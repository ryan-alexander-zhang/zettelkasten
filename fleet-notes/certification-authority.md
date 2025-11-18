---
tags:
  - ca
  - https
id: 20251117170104
created: 2025-11-17
reviewed: false
status:
  - in_progress
type: fleet-note
---
X 509 证书是标准的公钥证书。

1. CA 解决了什么问题？解决了服务器如果直接传输公钥不安全的问题
2. 怎么解决的？独立的 CA 机构加密服务器的公钥





CA 解决了什么问题？解决了传输服务器公钥不安全的问题

怎么解决的？独立的 CA 机构去用 CA 私钥签名服务器的公钥，CA 私钥对应的公钥预装在操作系统、浏览器等，用于验证签名，所以服务器的公钥没有暴露给第三方。


服务器创建私钥和公钥对，把公钥和相关信息发送给 CA 机构，CA 机构用自己的私钥加密信息的哈希和公钥已经服务器信息组装成证书，浏览器预装了 CA 私钥对应的公钥，收到证书后，计算一次 Hash，对比解密的 Hash 是否一致.

1. Generate the public key and secret key by size.
$$
(SK_{server},PK_{server}) = Generate(Size)
$$
2. Certification schema.
$$
T={Version,SerialNumber,SignatureAlgo,Issuer,Validity,Subject,SubjectPublicKeyInfo,Extensions}
$$
3. Sign by CA secret key.
$$
\sigma = Sign_{SK_{CA}} (Hash(T))
$$
4. The certification.
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
* [什么是X.509证书？ -SSL.com](https://www.ssl.com/zh-CN/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/%E4%BB%80%E4%B9%88%E6%98%AFx-509%E8%AF%81%E4%B9%A6/)
* [什么是数字证书？ -SSL.com](https://www.ssl.com/zh-CN/%E6%96%87%E7%AB%A0%EF%BC%8C/%E4%BB%80%E4%B9%88%E6%98%AF%E6%95%B0%E5%AD%97%E8%AF%81%E4%B9%A6/)

# Link to
* [[什么是mTLS]]
* [[图解SSL和TLS协议]]
* [[非对称加密算法]]