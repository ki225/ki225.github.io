---
title: 數位憑證如何驗證流量安全?
date: 2025-05-15 10:31:46
tags: [networking, certificate]
---

憑證是一種用來證明身份或加密通訊的數位文件，其中常見的是數位憑證，他由可信任的憑證機構(CA)簽發，主要用作 SSL/TLS（HTTPS）、驗證某個實體（如網站、使用者或伺服器）的身份等，而他的結構包含:

- 主體名稱（Subject Name）：誰擁有這個憑證（如 domain 名稱）
- 公鑰（Public Key）：可用來進行加密或驗證簽章
- 發行者（Issuer）：簽發此憑證的 CA
- 有效期間（Validity Period）：憑證的生效與失效日期
- 簽章（Signature）：由 CA 對憑證內容做的數位簽章

![](images/networking/certificate/img1.png)

##  X.509 憑證
X.509憑證是一種基於國際標準X.509的數位證書，用於證明數據擁有者的身份，他主要包含以下元素：
- 版本（Version）：憑證的版本號，通常為1、2或3，指定憑證的格式和屬性。
- 序列號（Serial Number）：由CA分配的唯一序列號，用於識別每個憑證的唯一性。
- 簽發者（Issuer）：CA的名稱和數位簽名，用於確保憑證的真實性。
- 主體（Subject）：數據擁有者的名稱和其他識別信息，指定了該憑證的用戶。
- 有效期（Validity Period）：憑證的有效期限，包括開始日期和結束日期。
- 公開金鑰（Public Key）：數據擁有者的公開金鑰，用於加密和數位簽名驗證。
- 數位簽名（Digital Signature）：CA對整個憑證的數據進行的數位簽名，用於確保憑證的完整性和真實性。

## PKI（Public Key Infrastructure，公開金鑰基礎建設）
PKI（Public Key Infrastructure，公開金鑰基礎建設）是一套結合硬體、軟體、政策與流程的安全架構，旨在透過數位憑證和非對稱加密技術，確保網路通訊的機密性、完整性、身份驗證與不可否認性。而 PKI 的核心組成如下:

1. 憑證授權中心（CA, Certificate Authority）
負責簽發、管理與撤銷數位憑證，確保公鑰與實體身份的關聯性。
2. 註冊機構（RA, Registration Authority）
協助 CA 驗證申請者身份，處理憑證申請與核發流程。
3. 數位憑證（Digital Certificate）
通常採用 X.509 格式，內含持有者的公鑰、身份資訊、有效期限及 CA 的數位簽章。
4. 金鑰對（Key Pair）
由公鑰與私鑰組成，公鑰可公開分享，私鑰需妥善保管，用於加密與簽章。
5. 憑證撤銷機制（CRL / OCSP）
用於查詢憑證是否已被撤銷，確保憑證的有效性與安全性。

透過 PKI，首先使用者會獲得一對公私鑰，接著將公鑰與身份資訊提交給 RA，RA 驗證後轉交 CA 進行憑證申請，CA 對申請資訊進行簽章，生成數位憑證。之後將憑證提供給使用者，並可透過目錄服務公開查詢，之後所有接收使用者請求的接收方將使用 CA 的公鑰，以驗證憑證的真實性與有效性。

![](images/networking/certificate/img6.png)

## TLS 憑證
### Transport Layer 是什麼？
Transport Layer 是 TCP/IP 模型裡面第四層，它位於 Application Layer 和 Network Layer 之間，主要職責是提供端到端的通信服務，確保資料能從源頭的應用程式可靠且完整地傳送到目標應用程式。

![](images/networking/certificate/img2.png)

### TLS
Transport Layer Security (TLS) 是運作在傳輸層之上的安全協定，通常在 TCP 連線建立後啟動，為應用層和傳輸層之間提供安全保護，例如對 Web 應用程式和伺服器之間的通訊（例如，Web 瀏覽器載入網站）進行加密。
> 先由 TCP 在傳輸層建立連線，接著啟動 TLS 握手，協商加密參數，TLS 之上才是 HTTP 在應用層的資料傳輸。HTTPS 是在 HTTP 通訊協定基礎上實施 TLS 加密，所有網站以及其他部分 Web 服務都使用該協定。因此，任何使用 HTTPS 的網站都使用 TLS 加密。

![](images/networking/certificate/img3.png)

TLS 通訊協定實現的功能有三個主要組成部分：加密、驗證和完整性。根據 [AWS 官方文章](https://aws.amazon.com/tw/what-is/ssl-certificate/)，TLS 憑證中包含：
* 網域名稱
* 憑證認證機構
* 憑證認證機構的數位簽章
* 簽發日期
* 到期日期
* 公開金鑰
* SSL/TLS 版本


## Hyperledger fabric 區塊鏈中使用的憑證
在 Fabric 網路中，節點（peer、orderer 等）需要憑證來確保身份驗證、資料安全與通訊保密。Fabric 採用 PKI（公私鑰基礎架構）來管理憑證。節點所需的主要憑證包括身份憑證和 TLS 憑證，簡單介紹如下：

|  | 身份憑證 | TLS 憑證 |
| -------- | -------- | -------- |
| 用途     | 用於節點身份認證與簽章，證明節點的合法身份     | 節點間 gRPC 通訊加密，保護通訊安全，提供資料加密和防止中間人攻擊     |
| 內容     | X.509 憑證     | X.509 TLS 憑證與對應私鑰     |
| 簽發者     | Fabric CA 或外部 CA     | TLS CA（可與 Fabric CA 分開） |

Peer 節點同時是 TLS server 與 TLS client，當一個 peer 節點在被其他 peer 節點、應用程式或 CLI 連線時，會以 TLS 伺服器角色出現；而當它主動連線到其他 peer 節點或 orderer 節點時，則扮演 TLS 用戶端的角色。當啟用 TLS 用戶端認證後，客戶端必須在 TLS 握手時送出憑證，若未送出或憑證無效，握手會失敗，連線會被關閉。

一個 peer 節點建立 TLS 憑證的方式是透過 enroll 和 register 進行註冊，其中兩個步驟的介紹如下：
- Registration
    - 指一組使用者名稱與密碼的組合，儲存在憑證授權中心（Certificate Authority, CA）中。
    - 這個註冊是由 CA 的管理者建立，沒有過期時間，並包含所需的角色與屬性。
- Enrollment
    - 指由組織的憑證授權中心（CA）簽發的一對公私鑰與一張 X.509 憑證。
    - 基於 registration 使用者名稱與密碼所生成的憑證，憑證中會編碼角色、屬性和其他元資料，代表 Fabric 網路中的一個身份。

其實 enrollment 這個步驟不僅是給予一張憑證，在 hyperledger fabric 中，他給予的是一整包資料夾叫做 `msp`，裡面包含的內容如下圖

![](images/networking/certificate/img4.png)
### MSP
Hyperledger 的 MSP 包含組織的 MSP 和 Local MSP，其中組織的 MSP 是在頻道設定中代表該組織的身份集合，節點的 Local MSP 是用於建立節點的邏輯參數集合，除了 MSP 之外還包含其他設定。針對節點的 local MSP 結構與說明如下
```
localmsp/
  ├── config.yaml
  ├── cacerts/
  │    └── <root CA public cert>.pem
  ├── intermediatecerts/
  │    └── <intermediate CA public cert>.pem
  ├── keystore/
  │    └── <node private key>.pem
  ├── signcerts/
  │    └── <node public cert>.pem
  ├── tlscacerts/
  │    └── tlsca.<org-domain>.pem
  ├── tlsintermediatecerts/
  │    └── tlsca.<org-domain>.pem
  └── operationscerts/
       └── operationcert.pem
```


- cacerts：註冊及入會時管理員身份所屬組織 CA 的根憑證。
- intermediatecerts：中繼 CA 的根憑證（若有使用）。
- keystore：節點的私鑰，用於簽署通訊資料。
- signcerts：節點的公鑰憑證，供其他節點識別。
- tlscacerts：簽發 TLS 憑證的 TLS CA 根憑證。
- tlsintermediatecerts：TLS 中繼 CA 根憑證（若有）。
- operationscerts：與操作服務溝通所需憑證。

### Fabric 與憑證
當 Fabric 收到一個憑證（例如節點或用戶身份憑證）準備進行驗證時，會檢查該憑證的 Issuer 欄位，並嘗試在本地 MSP 或信任鏈(Chain of Trust)中找到與之相符的 CA 憑證（即該 CA 憑證的 Subject 與憑證的 Issuer 相同）。

- Subject：憑證所代表的擁有者身份（如伺服器、使用者或組織）。憑證裡的 Subject 欄位記錄了這個身份的資訊。
- Issuer：簽發該憑證的憑證授權中心（CA）的身份。憑證裡的 Issuer 欄位記錄了簽署者的資訊，Fabric 會用憑證的 Issuer 去尋找憑證鏈中與之相符的 CA 憑證

![](images/networking/certificate/img5.png)

確認完成憑證的 subject 和 issuer 無誤後，接著就會利用該 CA 憑證的公鑰，驗證收到憑證的數位簽章是否正確且未被篡改。



### 憑證內容
我們可以執行以下指令確認憑證結構
```
openssl x509 -in cert.pem -text -noout
```
```
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            47:4d:5d:f6:db:92:6b:54:98:8d:9c:44:0c:ad:b6:77:c5:de:d2:ed
        Signature Algorithm: ecdsa-with-SHA256
        Issuer: C = US, ST = North Carolina, O = Hyperledger, OU = Fabric, CN = orderer1ca
        Validity
            Not Before: Feb  4 14:55:00 2022 GMT
            Not After : Feb  4 15:51:00 2023 GMT
        Subject: C = US, ST = North Carolina, O = Hyperledger, OU = orderer, CN = orderer1
        Subject Public Key Info:
            Public Key Algorithm: id-ecPublicKey
                Public-Key: (256 bit)
                pub:
                    04:29:ec:d5:53:3e:03:9d:64:a4:a4:28:a5:fe:12:
                    e2:f0:dd:e4:ee:b9:3f:3e:01:b2:3a:d4:68:b1:b2:
                    4f:82:1a:3a:33:db:92:6d:10:c9:c2:3b:3d:fc:7a:
                    f0:fa:cc:8b:44:e8:03:cb:a1:6e:eb:b3:6c:05:a2:
                    f8:fc:3c:af:24
                ASN1 OID: prime256v1
                NIST CURVE: P-256
        X509v3 extensions:
            X509v3 Key Usage: critical
                Digital Signature
            X509v3 Basic Constraints: critical
                CA:FALSE
            X509v3 Subject Key Identifier:
                63:97:F5:CA:BB:B7:4B:26:84:D9:65:40:E3:43:14:A4:7B:EE:79:FF
            X509v3 Authority Key Identifier:
                keyid:BA:2A:F8:EA:A5:7D:DF:1D:0F:CF:47:37:41:82:03:7E:04:61:D0:D8
            X509v3 Subject Alternative Name:
                DNS:server1.testorg.com
            1.2.3.4.5.6.7.8.1:
                {"attrs":{"hf.Affiliation":"","hf.EnrollmentID":"orderer1","hf.Type":"orderer"}}
    Signature Algorithm: ecdsa-with-SHA256
         30:45:02:21:00:e1:93:f6:3c:08:f2:b9:fb:06:c9:02:d0:cf:
         e1:a6:23:a3:05:78:10:d9:41:2c:1e:2c:91:80:fd:52:ad:62:
         9c:02:20:51:33:42:5e:a0:8a:2a:ec:f5:83:46:f0:99:6a:7e:
         eb:a8:97:1f:30:99:9d:ae:8d:ef:36:07:da:bb:67:ed:80
```

## 參考
- https://www.cloudflare.com/zh-tw/learning/ssl/transport-layer-security-tls/
- https://hyperledger-fabric.readthedocs.io/en/latest/enable_tls.html
- https://hyperledger-fabric.readthedocs.io/en/latest/certs_management.html
- https://hyperledger-fabric.readthedocs.io/en/latest/identity/identity.html
