---
type: "to-read"
id: 20260116090129
created: 2026-01-16T09:44:29
source:
  - "https://dev.to/polliog/i-replaced-redis-with-postgresql-and-its-faster-4942"
tags:
reviewd: false
---
I had a typical web app stack:

- PostgreSQL for persistent data
- Redis for caching, pub/sub, and background jobs

**Two databases. Two things to manage. Two points of failure.**

Then I realized: **PostgreSQL can do everything Redis does.**

I ripped out Redis entirely. Here's what happened.

---

## The Setup: What I Was Using Redis For

Before the change, Redis handled three things:

### 1\. Caching (70% of usage)

### 2\. Pub/Sub (20% of usage)

```
// Real-time notifications
redis.publish('notifications', JSON.stringify({ userId, message }));
```

### 3\. Background Job Queue (10% of usage)

```
// Using Bull/BullMQ
queue.add('send-email', { to, subject, body });
```

**The pain points:**

- Two databases to backup
- Redis uses RAM (expensive at scale)
- Redis persistence is... complicated
- Network hop between Postgres and Redis

---

## Why I Considered Replacing Redis

### Reason #1: Cost

**My Redis setup:**

- AWS ElastiCache: $45/month (2GB)
- Growing to 5GB would cost $110/month

**PostgreSQL:**

- Already paying for RDS: $50/month (20GB storage)
- Adding 5GB of data: $0.50/month

**Potential savings:** ~$100/month

### Reason #2: Operational Complexity

**With Redis:**  

```
Postgres backup ✅
Redis backup ❓ (RDB? AOF? Both?)
Postgres monitoring ✅
Redis monitoring ❓
Postgres failover ✅
Redis Sentinel/Cluster ❓
```

**Without Redis:**  

```
Postgres backup ✅
Postgres monitoring ✅
Postgres failover ✅
```

One less moving part.

### Reason #3: Data Consistency

**The classic problem:**  

```
// Update database
await db.query('UPDATE users SET name = $1 WHERE id = $2', [name, id]);

// Invalidate cache
await redis.del(\`user:${id}\`);

// ⚠️ What if Redis is down?
// ⚠️ What if this fails?
// Now cache and DB are out of sync
```

With everything in Postgres: **transactions solve this.**

---

## PostgreSQL Feature #1: Caching with UNLOGGED Tables

**Redis:**  

```
await redis.set('session:abc123', JSON.stringify(sessionData), 'EX', 3600);
```

**PostgreSQL:**  

```
CREATE UNLOGGED TABLE cache (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_cache_expires ON cache(expires_at);
```

**Insert:**  

```
INSERT INTO cache (key, value, expires_at)
VALUES ($1, $2, NOW() + INTERVAL '1 hour')
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      expires_at = EXCLUDED.expires_at;
```

**Read:**  

```
SELECT value FROM cache
WHERE key = $1 AND expires_at > NOW();
```

**Cleanup (run periodically):**  

```
DELETE FROM cache WHERE expires_at < NOW();
```

### What is UNLOGGED?

**UNLOGGED tables:**

- Skip the Write-Ahead Log (WAL)
- Much faster writes
- Don't survive crashes (perfect for cache!)

**Performance:**  

```
Redis SET: 0.05ms
Postgres UNLOGGED INSERT: 0.08ms
```

**Close enough for caching.**

---

## PostgreSQL Feature #2: Pub/Sub with LISTEN/NOTIFY

**This is where it gets interesting.**

PostgreSQL has **native pub/sub** that most developers don't know about.

### Redis Pub/Sub

### PostgreSQL Pub/Sub

```
-- Publisher
NOTIFY notifications, '{"userId": 123, "msg": "Hello"}';
```

**Performance comparison:**  

```
Redis pub/sub latency: 1-2ms
Postgres NOTIFY latency: 2-5ms
```

**Slightly slower, but:**

- No extra infrastructure
- Can use in transactions
- Can combine with queries

### Real-World Example: Live Tail

In my log management app, I needed **real-time log streaming**.

**With Redis:**  

**Problem:** Two operations. What if publish fails?

**With PostgreSQL:**  

```
CREATE FUNCTION notify_new_log() RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('logs_new', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_inserted
AFTER INSERT ON logs
FOR EACH ROW EXECUTE FUNCTION notify_new_log();
```

Now it's **atomic**. Insert and notify happen together or not at all.  

```
// Frontend (via SSE)
app.get('/logs/stream', async (req, res) => {
  const client = await pool.connect();

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });

  await client.query('LISTEN logs_new');

  client.on('notification', (msg) => {
    res.write(\`data: ${msg.payload}\n\n\`);
  });
});
```

**Result:** Real-time log streaming with zero Redis.

---

## PostgreSQL Feature #3: Job Queues with SKIP LOCKED

**Redis (using Bull/BullMQ):**  

```
queue.add('send-email', { to, subject, body });

queue.process('send-email', async (job) => {
  await sendEmail(job.data);
});
```

**PostgreSQL:**  

```
CREATE TABLE jobs (
  id BIGSERIAL PRIMARY KEY,
  queue TEXT NOT NULL,
  payload JSONB NOT NULL,
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jobs_queue ON jobs(queue, scheduled_at) 
WHERE attempts < max_attempts;
```

**Enqueue:**  

```
INSERT INTO jobs (queue, payload)
VALUES ('send-email', '{"to": "user@example.com", "subject": "Hi"}');
```

**Worker (dequeue):**  

```
WITH next_job AS (
  SELECT id FROM jobs
  WHERE queue = $1
    AND attempts < max_attempts
    AND scheduled_at <= NOW()
  ORDER BY scheduled_at
  LIMIT 1
  FOR UPDATE SKIP LOCKED
)
UPDATE jobs
SET attempts = attempts + 1
FROM next_job
WHERE jobs.id = next_job.id
RETURNING *;
```

**The magic: `FOR UPDATE SKIP LOCKED`**

This makes PostgreSQL a **lock-free queue**:

- Multiple workers can pull jobs concurrently
- No job is processed twice
- If a worker crashes, job becomes available again

**Performance:**  

```
Redis BRPOP: 0.1ms
Postgres SKIP LOCKED: 0.3ms
```

**Negligible difference for most workloads.**

---

## PostgreSQL Feature #4: Rate Limiting

**Redis (classic rate limiter):**  

```
const key = \`ratelimit:${userId}\`;
const count = await redis.incr(key);
if (count === 1) {
  await redis.expire(key, 60); // 60 seconds
}

if (count > 100) {
  throw new Error('Rate limit exceeded');
}
```

**PostgreSQL:**  

```
CREATE TABLE rate_limits (
  user_id INT PRIMARY KEY,
  request_count INT DEFAULT 0,
  window_start TIMESTAMPTZ DEFAULT NOW()
);

-- Check and increment
WITH current AS (
  SELECT 
    request_count,
    CASE 
      WHEN window_start < NOW() - INTERVAL '1 minute'
      THEN 1  -- Reset counter
      ELSE request_count + 1
    END AS new_count
  FROM rate_limits
  WHERE user_id = $1
  FOR UPDATE
)
UPDATE rate_limits
SET 
  request_count = (SELECT new_count FROM current),
  window_start = CASE
    WHEN window_start < NOW() - INTERVAL '1 minute'
    THEN NOW()
    ELSE window_start
  END
WHERE user_id = $1
RETURNING request_count;
```

**Or simpler with a window function:**  

```
CREATE TABLE api_requests (
  user_id INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check rate limit
SELECT COUNT(*) FROM api_requests
WHERE user_id = $1
  AND created_at > NOW() - INTERVAL '1 minute';

-- If under limit, insert
INSERT INTO api_requests (user_id) VALUES ($1);

-- Cleanup old requests periodically
DELETE FROM api_requests WHERE created_at < NOW() - INTERVAL '5 minutes';
```

**When Postgres is better:**

- Need to rate limit based on complex logic (not just counts)
- Want rate limit data in same transaction as business logic

**When Redis is better:**

- Need sub-millisecond rate limiting
- Extremely high throughput (millions of requests/sec)

---

## PostgreSQL Feature #5: Sessions with JSONB

**Redis:**  

```
await redis.set(\`session:${sessionId}\`, JSON.stringify(sessionData), 'EX', 86400);
```

**PostgreSQL:**  

```
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- Insert/Update
INSERT INTO sessions (id, data, expires_at)
VALUES ($1, $2, NOW() + INTERVAL '24 hours')
ON CONFLICT (id) DO UPDATE
  SET data = EXCLUDED.data,
      expires_at = EXCLUDED.expires_at;

-- Read
SELECT data FROM sessions
WHERE id = $1 AND expires_at > NOW();
```

**Bonus: JSONB Operators**

You can query inside the session:  

```
-- Find all sessions for a specific user
SELECT * FROM sessions
WHERE data->>'userId' = '123';

-- Find sessions with specific role
SELECT * FROM sessions
WHERE data->'user'->>'role' = 'admin';
```

**You can't do this with Redis!**

---

## Real-World Benchmarks

I ran benchmarks on my production dataset:

### Test Setup

- **Hardware:** AWS RDS db.t3.medium (2 vCPU, 4GB RAM)
- **Dataset:** 1 million cache entries, 10k sessions
- **Tool:** pgbench (custom scripts)

### Results

| Operation | Redis | PostgreSQL | Difference |
| --- | --- | --- | --- |
| **Cache SET** | 0.05ms | 0.08ms | +60% slower |
| **Cache GET** | 0.04ms | 0.06ms | +50% slower |
| **Pub/Sub** | 1.2ms | 3.1ms | +158% slower |
| **Queue push** | 0.08ms | 0.15ms | +87% slower |
| **Queue pop** | 0.12ms | 0.31ms | +158% slower |

**PostgreSQL is slower... but:**

- All operations still under 1ms
- Eliminates network hop to Redis
- Reduces infrastructure complexity

### Combined Operations (The Real Win)

**Scenario:** Insert data + invalidate cache + notify subscribers

**With Redis:**  

```
await db.query('INSERT INTO posts ...');       // 2ms
await redis.del('posts:latest');                // 1ms (network hop)
await redis.publish('posts:new', data);         // 1ms (network hop)
// Total: ~4ms
```

**With PostgreSQL:**  

```
BEGIN;
INSERT INTO posts ...;                          -- 2ms
DELETE FROM cache WHERE key = 'posts:latest';  -- 0.1ms (same connection)
NOTIFY posts_new, '...';                        -- 0.1ms (same connection)
COMMIT;
-- Total: ~2.2ms
```

**PostgreSQL is faster when operations are combined.**

---

## When to Keep Redis

**Don't replace Redis if:**

### 1\. You Need Extreme Performance

```
Redis: 100,000+ ops/sec (single instance)
Postgres: 10,000-50,000 ops/sec
```

If you're doing millions of cache reads/sec, keep Redis.

### 2\. You're Using Redis-Specific Data Structures

**Redis has:**

- Sorted sets (leaderboards)
- HyperLogLog (unique count estimates)
- Geospatial indexes
- Streams (advanced pub/sub)

**Postgres equivalents exist but are clunkier:**  

```
-- Leaderboard in Postgres (slower)
SELECT user_id, score
FROM leaderboard
ORDER BY score DESC
LIMIT 10;

-- vs Redis
ZREVRANGE leaderboard 0 9 WITHSCORES
```

### 3\. You Have a Separate Caching Layer Requirement

If your architecture mandates a separate cache tier (e.g., microservices), keep Redis.

---

## Migration Strategy

**Don't rip out Redis overnight.** Here's how I did it:

### Phase 1: Side-by-Side (Week 1)

```
// Write to both
await redis.set(key, value);
await pg.query('INSERT INTO cache ...');

// Read from Redis (still primary)
let data = await redis.get(key);
```

**Monitor:** Compare hit rates, latency.

### Phase 2: Read from Postgres (Week 2)

```
// Try Postgres first
let data = await pg.query('SELECT value FROM cache WHERE key = $1', [key]);

// Fallback to Redis
if (!data) {
  data = await redis.get(key);
}
```

**Monitor:** Error rates, performance.

### Phase 3: Write to Postgres Only (Week 3)

```
// Only write to Postgres
await pg.query('INSERT INTO cache ...');
```

**Monitor:** Everything still works?

### Phase 4: Remove Redis (Week 4)

```
# Turn off Redis
# Watch for errors
# Nothing breaks? Success!
```

---

## Code Examples: Complete Implementation

### Cache Module (PostgreSQL)

```
// cache.js
class PostgresCache {
  constructor(pool) {
    this.pool = pool;
  }

  async get(key) {
    const result = await this.pool.query(
      'SELECT value FROM cache WHERE key = $1 AND expires_at > NOW()',
      [key]
    );
    return result.rows[0]?.value;
  }

  async set(key, value, ttlSeconds = 3600) {
    await this.pool.query(
      \`INSERT INTO cache (key, value, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '${ttlSeconds} seconds')
       ON CONFLICT (key) DO UPDATE
         SET value = EXCLUDED.value,
             expires_at = EXCLUDED.expires_at\`,
      [key, value]
    );
  }

  async delete(key) {
    await this.pool.query('DELETE FROM cache WHERE key = $1', [key]);
  }

  async cleanup() {
    await this.pool.query('DELETE FROM cache WHERE expires_at < NOW()');
  }
}

module.exports = PostgresCache;
```

### Pub/Sub Module

### Job Queue Module

```
// queue.js
class PostgresQueue {
  constructor(pool) {
    this.pool = pool;
  }

  async enqueue(queue, payload, scheduledAt = new Date()) {
    await this.pool.query(
      'INSERT INTO jobs (queue, payload, scheduled_at) VALUES ($1, $2, $3)',
      [queue, payload, scheduledAt]
    );
  }

  async dequeue(queue) {
    const result = await this.pool.query(
      \`WITH next_job AS (
        SELECT id FROM jobs
        WHERE queue = $1
          AND attempts < max_attempts
          AND scheduled_at <= NOW()
        ORDER BY scheduled_at
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      UPDATE jobs
      SET attempts = attempts + 1
      FROM next_job
      WHERE jobs.id = next_job.id
      RETURNING jobs.*\`,
      [queue]
    );

    return result.rows[0];
  }

  async complete(jobId) {
    await this.pool.query('DELETE FROM jobs WHERE id = $1', [jobId]);
  }

  async fail(jobId, error) {
    await this.pool.query(
      \`UPDATE jobs
       SET attempts = max_attempts,
           payload = payload || jsonb_build_object('error', $2)
       WHERE id = $1\`,
      [jobId, error.message]
    );
  }
}

module.exports = PostgresQueue;
```

---

## Performance Tuning Tips

### 1\. Use Connection Pooling

```
const { Pool } = require('pg');

const pool = new Pool({
  max: 20,  // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 2\. Add Proper Indexes

```
CREATE INDEX CONCURRENTLY idx_cache_key ON cache(key) WHERE expires_at > NOW();
CREATE INDEX CONCURRENTLY idx_jobs_pending ON jobs(queue, scheduled_at) 
  WHERE attempts < max_attempts;
```

### 3\. Tune PostgreSQL Config

### 4\. Regular Maintenance

---

## The Results: 3 Months Later

**What I saved:**

- ✅ $100/month (no more ElastiCache)
- ✅ 50% reduction in backup complexity
- ✅ One less service to monitor
- ✅ Simpler deployment (one less dependency)

**What I lost:**

- ❌ ~0.5ms latency on cache operations
- ❌ Redis's exotic data structures (didn't need them)

**Would I do it again?** Yes, for this use case.

**Would I recommend it universally?** No.

---

## Decision Matrix

**Replace Redis with Postgres if:**

- ✅ You're using Redis for simple caching/sessions
- ✅ Cache hit rate is < 95% (lots of writes)
- ✅ You want transactional consistency
- ✅ You're okay with 0.1-1ms slower operations
- ✅ You're a small team with limited ops resources

**Keep Redis if:**

- ❌ You need 100k+ ops/second
- ❌ You use Redis data structures (sorted sets, etc.)
- ❌ You have dedicated ops team
- ❌ Sub-millisecond latency is critical
- ❌ You're doing geo-replication

---

## Resources

**PostgreSQL Features:**

- [LISTEN/NOTIFY Docs](https://www.postgresql.org/docs/current/sql-notify.html)
- [SKIP LOCKED](https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE)
- [UNLOGGED Tables](https://www.postgresql.org/docs/current/sql-createtable.html)

**Tools:**

- [pgBouncer](https://www.pgbouncer.org/) - Connection pooling
- [pg\_stat\_statements](https://www.postgresql.org/docs/current/pgstatstatements.html) - Query performance

**Alternative Solutions:**

- [Graphile Worker](https://github.com/graphile/worker) - Postgres-based job queue
- [pg-boss](https://github.com/timgit/pg-boss) - Another Postgres queue

---

## TL;DR

**I replaced Redis with PostgreSQL for:**

1. Caching → UNLOGGED tables
2. Pub/Sub → LISTEN/NOTIFY
3. Job queues → SKIP LOCKED
4. Sessions → JSONB tables

**Results:**

- Saved $100/month
- Reduced operational complexity
- Slightly slower (0.1-1ms) but acceptable
- Transactional consistency guaranteed

**When to do this:**

- Small to medium apps
- Simple caching needs
- Want to reduce moving parts

**When NOT to do this:**

- High-performance requirements (100k+ ops/sec)
- Using Redis-specific features
- Have dedicated ops team

---

**Have you replaced Redis with Postgres (or vice versa)?** What was your experience? Drop your benchmarks in the comments! 👇

*P.S. - Want a follow-up on "PostgreSQL Hidden Features" or "When Redis is Actually Better"? Let me know!*