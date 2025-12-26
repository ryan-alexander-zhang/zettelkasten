---
type: "to-read"
id: 20251226081259
created: 2025-12-26T08:16:59
source:
  - "https://newsletter.squishy.computer/p/natures-many-attempts-to-evolve-a"
tags:
reviewd: false
---
### P2P and federated protocols converge toward becoming Nostr, but with extra steps

Here is the architecture of a typical app: a big centralized server in the cloud supporting many clients. The web works this way. So do apps.

![](https://substackcdn.com/image/fetch/$s_!LHN2!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7e22f4bd-490e-44c5-a1c5-f0fbca5f4723_1500x938.png)

This architecture grants the server total control over users. The server owns your data, owns your account, and owns [the cryptographic keys used to secure it](https://newsletter.squishy.computer/i/114076486/what-does-this-look-like-in-an-app).

That last bit is obscure, but important. Cryptographic keys are how we enforce security, privacy, ownership, and control in software. **[Not your keys, not your data](https://newsletter.squishy.computer/p/trustless-protocols-are-better-than)**.

The architecture of apps is [fundamentally feudal](https://newsletter.squishy.computer/p/web3). Apps own the keys and use them to erect a [cryptographic wall](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) around the hoard of data us peasants produce. You “sign in” to cross the drawbridge, and the castle can pull up the drawbridge at any time, shutting you out.

> "Centralization" is the state of affairs where a single entity or a small group of them can observe, capture, control, or extract rent from the operation or use of an Internet function exclusively.  
> *([RFC 9518: Centralization, Decentralization, and Internet Standards](https://www.rfc-editor.org/rfc/rfc9518.html))*

Powerful network effects build up inside those castle walls. [These network effects can be leveraged](https://newsletter.squishy.computer/p/aggregators-arent-open-ended) to generate further centralization, extract rents, and shut down competition.

We are seeing the consequences of this centralized architecture play out today, as platforms [like the App Store](https://www.theverge.com/2020/6/17/21293813/apple-app-store-policies-hey-30-percent-developers-the-trial-by-franz-kafka) enter their late-stage phase. When growth slows, the kings of big castles become [bad emperors](https://newsletter.squishy.computer/p/web2-has-a-bad-emperor-problem).

## Federation: choose your server

> The Internet has succeeded in no small part because of its purposeful avoidance of any single controlling entity.  
> *([RFC 9518: Centralization, Decentralization, and Internet Standards](https://www.rfc-editor.org/rfc/rfc9518.html))*

So, apps are centralized. How might we fix this? Well, the first thing we could do is bridge the gap between apps.

![](https://substackcdn.com/image/fetch/$s_!9pt8!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F422c05a6-09e5-43e8-bada-e4a0002fb107_1500x1220.png)

**This is called federation**. Users talk to the server, and servers talk to each other, trading messages so you can talk to users on other servers. Now you have the benefit of choice: which castle do you want to live in?

Email works this way. So do [Mastodon](https://joinmastodon.org/) and [Matrix](https://matrix.org/). My email is `@gmail.com`, yours `@protonmail.com`. We live on different domains, use different apps run by different companies, yet we can freely email each other.

The great thing about federation is that it’s easy to implement. It’s just an ordinary client-server architecture with a protocol bolted onto the back. We don’t have to build exotic technology, just [exapt existing infrastructure](https://newsletter.squishy.computer/p/exapt-existing-infrastructure). That’s why Mastodon, for example, is just an [ordinary Ruby on Rails app](https://github.com/mastodon/mastodon).

But there’s a wrinkle…

## Federated networks become oligopolies at scale

![A consolidated federated network. Just three nodes are left, with one overbearing large node.](https://substackcdn.com/image/fetch/$s_!_5w9!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fac85b772-5c53-4332-9cb8-a8ba588c8f76_1500x1161.png)

A consolidated federated network. Just three nodes are left, with one overbearing large node.

**Why does this happen?** Well, networks centralize over time, converging toward an exponential distribution of size, power, wealth. **[This centralization is inevitable](https://newsletter.squishy.computer/p/centralization-is-inevitable)**. You see it on the web, in social networks, airline routes, power grids, trains, banks, Bitcoin mining, protein interactions, ecological food webs, neural networks, and oligarchies. Network theory tells us why:

- **Preferential attachment**: more connections means more network effect means more connections, leading to the emergence of densely-connected hub nodes.
- **N^2 scaling**: if every fed has to talk to every other fed to exchange messages, the number of connections will scale exponentially with each additional node *[(n \* (n -1))](https://en.wikipedia.org/wiki/Dense_graph)*. This leads to the emergence of large hubs that aggregate and relay world state.
- **Fitness pressure**: Small nodes get taken down by large spikes in traffic, while large nodes stick around. Small nodes have fewer resources, large nodes have lots. Unreliable nodes attract fewer connections, while reliable nodes attract connections just by virtue of staying alive.
- **Efficiency**: exponentially-distributed networks are ultra-small worlds. You can get from anywhere to anywhere in just a few hops through hubs.
- **Resilience**: exponential networks survive random failures, because the chances are exponential that the node that fails will be from the long tail.

This is called [the scale-free property](https://networksciencebook.com/chapter/4#introduction4), and it [emerges in all evolving networks](https://newsletter.squishy.computer/p/centralization-is-inevitable). Federated networks are no exception. Take email for example:

> Email is not distributed anymore. You just cannot create another first-class node of this network.
> 
> Email is now an oligopoly, a service gatekept by a few big companies which does not follow the principles of net neutrality.
> 
> I have been self-hosting my email since I got my first broadband connection at home in 1999. I absolutely loved having a personal web+email server at home, paid extra for a static IP and a real router so people could connect from the outside. I felt like a first-class citizen of the Internet and I learned so much.
> 
> Over time I realized that residential IP blocks were banned on most servers. I moved my email server to a VPS. No luck. I quickly understood that self-hosting email was a lost cause. Nevertheless, I have been fighting back out of pure spite, obstinacy, and activism. In other words, because it was the right thing to do.
> 
> But my emails are just not delivered anymore. I might as well not have an email server.
> 
> *([After self-hosting my email for twenty-three years I have thrown in the towel](https://cfenollosa.com/blog/after-self-hosting-my-email-for-twenty-three-years-i-have-thrown-in-the-towel-the-oligopoly-has-won.html), Carlos Fenollosa, 2022)*

We can see the outlines of a similar consolidation beginning to emerge in the Fediverse. In 2023, [Facebook Threads implemented ActivityPub](https://www.theverge.com/2023/12/13/24000120/threads-meta-activitypub-test-mastodon) and it instantly became the largest node in the Fediverse. This made some people angry and lead to [demands for defederation](https://wedistribute.org/2024/03/block-threads-to-remain-listed/). But Threads is already [over 10x larger than the rest of the Fediverse](https://www.eff.org/deeplinks/2024/06/whats-difference-between-mastodon-bluesky-and-threads#:~:text=Threads%20is%20a%20totally%20different%20application%2C%20solely%20hosted%20by%20Meta%2C%20and%20is%20ten%20times%20bigger%20than%20the%20Fediverse). Defederation is hardly an effective blockade. The network has consolidated. Network science strikes again.

At scale, federated systems experience many of the same problems as centralized apps. That’s because feds are still feudal. They own your data, they own your account, they own your keys.

Large feds occupy a strategically central location in the network topology, and they have powerful influence over the rest of the network. They can leverage their network effect to pull up the drawbridge, by inventing new features that don’t federate, or cutting off contact with other feds.

So, federated networks become oligopolies. We can choose our server, as long as it’s blessed by the oligopoly. Still, an oligopoly is better than a dictatorship, email better than Facebook. But can we do even better?

## P2P: all peers are equal

Ok, forget servers. What if we could connect to each other directly? This is called peer-to-peer networking.

![A large, densely-connected p2p network with many connections between peers](https://substackcdn.com/image/fetch/$s_!jtYo!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff9533364-5e70-4f50-82da-68ecd9191085_1500x1175.png)

A large, densely-connected p2p network with many connections between peers

In a P2P network, each participant runs a peer that can find other peers and send them messages. Users own their keys, and use them to sign, verify, and encrypt messages. This is great! We have all the ingredients for [credible exit](https://newsletter.squishy.computer/p/credible-exit) and [minimal user agency](https://newsletter.squishy.computer/p/the-minimal-definition-of-user-agency).

However, P2P presents some tricky engineering challenges. There is no central source of truth, so various peers will will have different points of view of the network state. That means we need to design for eventual consistency and the ability to merge potentially conflicting states. Other things, like timestamps, are also hard. [Decentralized protocols are hard](https://newsletter.squishy.computer/i/145470133/decentralized-protocols-are-hard)! All of this is headwind compared to ordinary app engineering.

We also run into some practical networking challenges. We no longer have centralized servers, so many requests take several hops, from peer-to-peer-to-peer, to get to their destination.

Also, peers are unreliable. They are bandwidth-constrained and blink in and out of existence. Close your laptop, your peer disappears. This adds a cost to peer discovery. You dial a previously available peer, but it’s gone now, so you dial another, and another. Unreliable peers plus multiple hops equals long delays, and occasionally, the inability to reach portions of the network.

![A sparsely connected network where many of the peers have dropped off the network, or have intermittent service.](https://substackcdn.com/image/fetch/$s_!JEtl!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa894a670-9f3d-41de-b7d9-800961540e67_1500x1193.png)

A sparsely connected network where many of the peers have dropped off the network, or have intermittent service.

## …but some peers are more equal than others

The same evolutionary pressures that apply to other networks apply to P2P networks, and some of them, like [fitness pressure on reliability](https://en.wikipedia.org/wiki/Fitness_model_\(network_theory\)), are exaggerated by peer availability. This leads to the evolution of **superpeers**: high-bandwidth, high-availability peers who’s job is to serve other peers on the network.

> Peer-to-Peer (P2P) networks have grown to such a massive scale that performing an efficient search in the network is non-trivial. Systems such as Gnutella were initially plagued with scalability problems as the number of users grew into the tens of thousands. As the number of users has now climbed into the millions, system designers have resorted to the use of supernodes to address scalability issues and to perform more efficient searches.  
> *(Hadaller, Regan, Russell, 2012. [The Necessity of Supernodes](https://www.kevinregan.com/files/proj_supernode_paper.pdf))*

![P2P protocol with large superpeers at the center](https://substackcdn.com/image/fetch/$s_!AwP1!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3c9d8af3-ec86-40c4-9493-266c71ee3cca_1500x1174.png)

P2P protocol with large superpeers at the center

Instead of connecting directly, we connect to one of the high-bandwidth, high-availability superpeers. Peer discovery is no longer a problem, and everything is just one or two hops away… an ultra-small world.

Wait… That just sounds like centralization with extra steps!

Like feds, superpeers occupy a strategically central location in the network topology, and have powerful influence over the rest of the network. Our P2P network has converged toward an exponential distribution. Network science strikes again.

Well, but on a P2P network we do own our keys, and this is a big improvement. [Trustless protocols are better than trustful ones](https://newsletter.squishy.computer/p/trustless-protocols-are-better-than), and by owning our keys we have the foundations for [minimal user agency](https://newsletter.squishy.computer/p/the-minimal-definition-of-user-agency?utm_source=publication-search).

Still, we’ve done a lot of hard engineering to support a flat P2P network that will never exist in the end. Is there a simpler way?

## The many attempts of nature to evolve a relay

Let’s start at the end and work backwards.

- All networks require large servers at scale
- Not your keys, not your data

Can we design a distributed architecture that admits these two facts? What might such an architecture look like?

![](https://substackcdn.com/image/fetch/$s_!Ghar!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F617e964c-8cf5-4149-9869-979b798c89b5_1500x840.png)

Take some ordinary, off-the-shelf servers. Treat them as dumb, untrusted pipes. Their job is just to relay information. They don’t own the keys—you own your keys. You sign messages with your key, then post them to one or more relays. Other users follow one or more relays. When they get a message, they use your key to verify you sent it. That’s it!

[This is the Nostr protocol](https://nostr.com/the-protocol). I want to claim that Nostr has discovered a new fundamental architecture for distributed protocols. Not federated, not P2P… **[Relay](https://nostr.com/relays)**.

![](https://substackcdn.com/image/fetch/$s_!Zf7N!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F30deb945-d2ef-4bf0-b273-61ada144395a_1500x849.png)

Relays cut to the chase:

- **Relays are simple**. They use boring technology, like plain old servers. You benefit from all of the tailwinds of traditional app development.
- **Relays take advantage of economies of scale**. Big dumb servers in the cloud have high availability and high uptime, and they’re commodity infrastructure.
- **Relays sidestep the N^2 scaling problem**: Relays don’t talk to each other, and users only need to join a small number of relays to gain autonomy—at least two, and certainly less than a dozen. We never really hit the scale where the n^2 scaling problem matters.
- **Relays support user-ownership**. You own your data, your account, and most importantly, [your keys](https://newsletter.squishy.computer/p/the-minimal-definition-of-user-agency). Relays are large, but they aren’t in charge. If a relay goes down or shuts you down, no problem! Your account doesn’t change, and your data is already mirrored to other relays. [Credible exit](https://newsletter.squishy.computer/p/credible-exit)!

…Most importantly, **relays are what you would get in the end anyway**. It’s fewer steps for the same result.