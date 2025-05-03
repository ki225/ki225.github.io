---
title: HLF-server-client-trust
date: 2025-04-05 10:03:19
tags:
---

這是一個很關鍵的問題，也是許多使用 Hyperledger Fabric 或處理 TLS 的開發者常混淆的點。以下我會用清楚的方式幫你釐清：

---

## ✅ **為什麼 client 要信任 `ca-cert.pem`？**

當一個 **client（例如 `fabric-ca-client`）要透過 HTTPS（TLS）連線到 server（如 `fabric-ca-server`）** 時，它需要確保：

1. 伺服器提供的憑證是**有效的**
2. 憑證是由一個**可信任的憑證機構（CA）**簽發的
3. 憑證的主機名稱與 URL 符合（例如 CN 或 SAN 包含 `localhost`）

而 client 根本**無法直接驗證 server 提供的 `tls-cert.pem` 本身是否可信**，它只能從一份「CA 憑證」出發，反查 server 提供的憑證是否為此 CA 所簽。

這份 CA 憑證就是我們說的：

### ✅ `ca-cert.pem`：**CA 的公開根憑證**
---

## 🔍 **那 `tls-cert.pem` 又是什麼？**

這是 **Server 自己的「憑證」**，就像一張身份證，上面寫著：

- CN: tls.ca.orderer3.example.com
- 有效期限
- 被誰簽發：Issued By → 某個 CA

這張憑證是 **由 CA 所簽發出來的**，對應的一般是 server 的私鑰（`key.pem`）一起使用。

---

## 🧠 具體比喻說明：

| 角色 | 檔案 | 說明 |
|------|------|------|
| 👨‍🏫 TLS CA | `ca-cert.pem` | 一家戶政事務所的「印章」樣本，公開提供給所有人驗證用 |
| 🏢 Server | `tls-cert.pem` | 由戶政事務所發給 server 的「身份證」，上有簽章與名稱 |
| 🔍 Client | `--tls.certfiles` | 拿著戶政事務所的「印章樣本」，來驗證 server 的身份證是不是真的 |

---

## ✅ 實際過程簡化流程圖：

```
fabric-ca-client ➡️ Connect to ➡️ https://localhost:9059

Server sends: tls-cert.pem (含 CN、有效期、簽發者)
Client checks:
  - tls-cert.pem 是由 ca-cert.pem 簽的嗎？
  - CN/SAN 是否包含 localhost？
  - 有效期限還沒過嗎？
```

只有全部都通過，TLS 連線才會成功。否則就會報：

```
x509: certificate signed by unknown authority
```

---

## ✅ 所以 `--tls.certfiles` 應該指向的是：

```bash
--tls.certfiles /path/to/ca-cert.pem
```

而**不是**：

```bash
--tls.certfiles /path/to/tls-cert.pem ❌
```

因為 client 要信任的是**誰簽了憑證**（CA），不是憑證本身。

---

## 🧪 想驗證的話你可以做這件事：

```bash
openssl verify -CAfile ca-cert.pem tls-cert.pem
```

若返回：

```
tls-cert.pem: OK
```

就代表這張 server 憑證的確是由 `ca-cert.pem` 所簽發，client 就會信任。

---

有需要我幫你畫一個流程圖或整理出你整個 CA 架構的信任鏈嗎？對 multi-org/multi-CA 系統會很有幫助！


## 如何確認 TLS 握手?


## 驗證憑證是否依樣