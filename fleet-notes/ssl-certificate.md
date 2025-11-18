---
tags:
  - https
  - ssl
  - ca
id: 20251118170840
created: 2025-11-18
reviewed: false
status:
  - done
type: fleet-note
---
## **Self-Signed Certification Content**

```shell
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            43:c8:cf:d3:fe:96:22:08:15:6f:07:6e:8c:3b:c6:20:9f:88:6c:f4
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: C=CN, ST=Huining, L=Huining, O=Erpang, OU=Erpang, CN=Test, emailAddress=hnzhrh@gmail.com
        Validity
            Not Before: Nov 18 08:21:59 2025 GMT
            Not After : Nov 18 08:21:59 2026 GMT
        Subject: C=CN, ST=Huining, L=Huining, O=Erpang, OU=Erpang, CN=Test, emailAddress=hnzhrh@gmail.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (4096 bit)
                Modulus:
                    00:e1:bd:17:70:a1:b0:6c:55:98:67:af:3a:c1:71:
                    40:89:f1:35:04:81:94:bf:a5:ba:37:88:4e:a9:f8:
                    51:c1:7b:e7:a7:14:8b:45:6c:41:56:1e:ea:0d:f9:
                    61:d8:0a:94:e8:ce:a2:74:e7:e5:2b:e4:a0:bb:b2:
                    09:08:5b:0e:db:61:d1:f0:6d:68:8b:10:c4:86:8c:
                    d1:a0:42:2f:c6:59:fc:d7:f1:67:8d:6e:4b:fc:d0:
                    23:b4:88:31:f7:db:3e:63:7a:ef:12:ac:33:d8:ad:
                    79:b1:7c:a8:a2:ef:86:90:71:1c:05:22:77:bc:01:
                    8d:65:d8:ca:68:35:c3:20:20:7d:7f:91:b7:cf:97:
                    f1:29:20:93:62:49:72:63:ab:1b:9f:7a:af:f2:ae:
                    52:6d:68:45:37:78:3c:14:5a:21:67:ac:12:e1:8b:
                    7a:93:29:31:a3:5c:6e:9b:06:fe:0f:80:b5:ee:d9:
                    8e:e9:12:fa:e5:29:e9:73:e7:2a:77:7d:48:eb:8f:
                    d2:5a:fa:3c:cd:c8:e8:32:23:12:33:a6:75:37:0b:
                    fd:e3:59:8a:ef:7d:e1:62:3b:bf:fc:23:15:de:eb:
                    86:4a:0b:8e:ff:58:f5:1d:c2:f6:06:6f:2b:f7:3c:
                    f6:d3:53:43:bd:4e:e4:78:95:99:ca:4d:92:67:25:
                    5b:17:93:f6:f1:9f:e6:76:82:76:3f:39:73:fd:48:
                    90:63:f9:cb:25:7e:18:a2:fc:33:b1:c0:9d:7e:8d:
                    8e:43:b5:8b:99:c7:92:f0:62:25:4d:d9:cc:59:1e:
                    30:fc:e6:ed:39:b3:5c:e3:0d:e4:d8:ea:4b:f6:96:
                    64:02:2c:e3:2b:c9:e5:0a:7f:27:03:c0:8a:3f:d9:
                    c4:be:c1:b7:d3:18:f2:a2:34:1e:f8:68:4e:1c:f3:
                    fe:ba:0e:47:5b:10:10:74:33:b1:e7:46:40:f5:9c:
                    9c:83:0b:36:98:1a:dc:3b:dd:35:a4:77:95:43:71:
                    5e:80:eb:86:b4:7e:f8:29:41:bf:27:5f:a8:2b:c8:
                    14:fe:b1:1d:db:f0:fc:ac:23:a5:b8:d2:b5:ef:04:
                    bd:e8:34:95:2f:c2:5d:9c:35:f6:6f:ff:a3:fe:49:
                    7c:2d:5f:a1:f0:87:30:b7:18:12:02:5f:8d:8a:71:
                    83:90:14:b4:be:ab:e0:2b:11:e1:1b:7c:00:0a:9e:
                    4b:7a:0f:c0:ca:42:2e:0d:1a:92:84:01:22:2a:82:
                    5d:97:32:f0:60:57:5f:c8:e7:44:9d:42:cc:05:6e:
                    b9:ab:e4:c4:53:90:ee:01:ae:00:21:e5:37:4c:72:
                    87:47:5f:48:5a:a6:c0:37:e0:c6:90:70:03:47:cc:
                    cf:5d:b9
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Subject Key Identifier: 
                1B:48:8B:F7:87:9C:7A:E3:D1:6C:A6:6B:DE:3E:8A:C9:47:33:F3:C6
            X509v3 Authority Key Identifier: 
                1B:48:8B:F7:87:9C:7A:E3:D1:6C:A6:6B:DE:3E:8A:C9:47:33:F3:C6
            X509v3 Basic Constraints: critical
                CA:TRUE
    Signature Algorithm: sha256WithRSAEncryption
    Signature Value:
        46:b7:9b:f7:a8:83:15:88:83:83:e4:64:de:0a:bb:e1:ba:ef:
        38:12:fa:f9:52:39:1c:06:9d:73:60:61:4d:7c:38:43:cd:7a:
        d8:72:0a:4a:94:5c:68:a2:9d:f1:a0:18:4e:b5:7f:bf:84:14:
        a6:a9:9f:cb:37:eb:85:7b:a2:ca:b0:b0:e5:29:ee:51:c2:62:
        21:b5:cb:6b:96:cb:08:7d:16:80:bf:04:88:b8:43:fe:e2:7f:
        7b:9c:2c:69:dc:54:0a:16:5f:e0:38:38:35:e3:a3:c2:f7:4a:
        77:7d:70:84:03:57:7f:4c:7d:3a:c4:58:a7:b2:a3:12:a6:01:
        91:c2:e5:22:17:d9:4c:87:b2:0c:23:ff:8b:00:e4:62:fd:27:
        b9:4d:68:eb:17:80:22:93:d9:7c:3f:ed:a3:99:d7:b3:a1:35:
        56:0c:ed:30:cb:36:7f:ce:09:a9:12:30:23:a7:d1:ef:68:9d:
        c7:cb:30:28:41:2f:42:3c:60:6c:8c:20:b6:31:7e:9f:07:3b:
        b5:5a:16:40:bd:68:8d:84:02:3e:cb:29:e7:51:16:97:0a:72:
        39:65:22:50:35:90:8c:c1:ee:73:23:75:b2:67:c1:14:24:6a:
        db:01:98:57:b3:79:ad:9e:1a:7b:5f:f2:6e:e2:db:61:3e:af:
        3a:68:a7:64:04:d0:ca:b9:67:f5:e5:fe:0a:92:49:4b:ca:90:
        91:f3:d4:d7:9f:15:4b:f8:cd:f6:98:de:70:d5:95:9f:fc:3d:
        e9:da:fd:51:57:c1:ac:cb:d7:49:58:da:0d:9c:76:10:9f:f4:
        d7:21:ea:0d:23:b5:8a:8e:b2:ba:5f:d1:70:46:21:3d:25:4d:
        25:10:af:7e:9b:a0:5c:a6:4d:3c:b8:f9:63:5f:e2:22:ad:03:
        47:eb:34:7f:03:1f:13:bf:10:a1:2a:46:a1:84:6e:18:00:05:
        06:eb:54:b5:d9:ee:9d:76:1d:6c:8f:fa:ef:d4:d5:12:ba:0b:
        01:7a:cb:31:02:d5:42:63:8a:a1:4a:7c:93:80:3a:d4:4d:c1:
        c9:11:bc:68:9a:29:dc:95:99:7a:08:ed:7b:5b:b4:3b:4e:0f:
        e3:38:d6:eb:fc:04:11:25:f8:cc:8f:9c:32:d6:7f:b8:88:9e:
        6a:b8:ad:90:8f:ea:1b:4e:5d:2e:fc:05:08:67:11:d1:bb:3e:
        a6:5a:8c:88:08:88:53:ab:ef:df:3d:d8:57:d2:2d:8e:7d:85:
        6f:5b:d1:b2:15:f1:5d:f0:23:30:33:ce:d8:b8:af:1d:b4:aa:
        26:0a:83:37:76:56:19:a8:90:1c:77:2b:dd:03:99:4a:77:01:
        6e:c0:1b:b8:7d:89:52:53
```


## Generate and Verify Flow

1. Generate the public key and secret key by size.
$$
(SK_{server},PK_{server}) = Generate(Size)
$$
2. Certificate data.
$$
T = \bigl(
    \text{Version},
    \text{Serial Number},
    \text{Signature Alg},
    \text{Issuer},
    \text{Validity},
    \text{Subject},
    \text{SubjectPKInfo},
    \text{Extensions}
\bigr)
$$
3. Sign by CA secret key.
$$
\sigma = Sign_{SK_{CA}} (Hash(T))
$$
4. The certificate.
$$
Cert = (T, \sigma)
$$
5. Verify.
$$
true = Verify(Dec_{PK_{CA}}(\sigma),Hash(T))
$$

| Symbol                    | Meaning                                                     |
| ------------------------- | ----------------------------------------------------------- |
| $$SK_{server}$$           | The server's secret key                                     |
| $$PK_{server}$$           | The server's public key                                     |
| $$Generate(Size)$$        | Generates a key pair of the specified size                  |
| $$Hash(T)$$               | The digest of $T$                                           |
| $$\sigma$$                | The digest of $T$ encrypted (signed) with the CA secret key |
| $$Des_{PK_{CA}}(\sigma)$$ | The digest decrypted using the CA public key                |


# References
* [What Is an X.509 Certificate? - SSL.com](https://www.ssl.com/faqs/what-is-an-x-509-certificate/)
* [What is an SSL certificate? \| Cloudflare](https://www.cloudflare.com/learning/ssl/what-is-an-ssl-certificate/)

# Link to
* [[certificate-authority]]
* [[openssl-generate-certificate]]