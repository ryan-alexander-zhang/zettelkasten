---
tags:
  - https
  - ca
id: 20251118161436
created: 2025-11-18
reviewed: false
status:
  - in_progress
type: fleet-note
---

**How to decode the certification？**
```shell
openssl x509 -in certificate.crt -text -noout
```

**How to generate a pair of certificates?**
```shell
openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -sha256 -days 365
```

* `-nodes` You must input the phrase to protect the secret key if you do not use the flag.

# References

# Link to