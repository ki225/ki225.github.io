const n=`---
title: AWS Global Infrastructure Overview
date: 2025-10-14 21:04:27
tags: [aws]
---

## Region
- AWS Region（區域） 是一個地理上的區域
- 每個 Region 都包含多個 Availability Zones（可用區，AZ），通常為 兩個或以上 -> provides full redundancy and connectivity to the network
- 跨區域資料複製（Data replication across Regions）由使用者自行控制，AWS 不會自動跨區域同步。
- 跨區域通訊是透過 AWS 自有的**骨幹網路（backbone network）**進行，確保安全與高速傳輸。

### 選擇 AWS Region 時應考慮的因素
| 考量面向                                                   | 說明                                                                                                                                                                    |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **📜 資料治理與法律要求（Data governance & legal requirements）** | 有些地方法律（如歐盟 GDPR 或資料保護指令）規定，特定資料必須存放於特定國家或地區內。選擇 Region 時需遵守此類規範。                                                                                                      |
| **⚡ 延遲（Latency）**                                      | 應儘量選擇**距離使用者與系統最近的區域**，可有效降低網路延遲、提升使用體驗。<br>→ 可使用 [CloudPing](https://www.cloudping.info/) 測試各區域延遲。                                                                   |
| **💵 成本（Cost）**                                        | 各個 Region 的服務費用不同。<br>例如：<br>・**US East (Ohio)**：t3.medium Linux EC2 價格為 **$0.0416/小時**<br>・**Asia Pacific (Tokyo)**：同規格為 **$0.0544/小時**<br>→ 亞洲區通常因基礎設施與運營成本較高而價格略貴。 |
| **🔁 可用性與冗餘（Availability & Redundancy）**               | 每個 Region 都包含多個 AZ，可跨 AZ 部署資源以確保高可用性與容錯能力。                                                                                                                            |

## 可用區（Availability Zones, AZ）
- 每個 AZ 都是 完全獨立的 AWS 基礎設施分區，彼此之間物理隔離。
- 每個 AZ 由一個或多個獨立的資料中心（Data Centers） 組成。

![alt text](images/AWS/cp/img2.png)

### 特色
| 特性                                      | 說明                                                                     |
| --------------------------------------- | ---------------------------------------------------------------------- |
| **獨立性（Isolation）**                      | 每個 AZ 都具備獨立的電力、冷卻與網路設施，設計上可在其他 AZ 故障時保持運作。                             |
| **容錯性（Fault Isolation）**                | AZ 之間的隔離能避免單點故障（例如停電或網路中斷）影響整個系統。                                      |
| **高速連線（High-speed Private Networking）** | AZ 之間透過 AWS 專用的**低延遲、高頻寬私有網路**互相連接，適合跨 AZ 複寫資料或建立高可用架構。                |
| **使用者選擇性（User Control）**                | 使用者可以**自行選擇**要在哪個 AZ 部署資源，例如 EC2、RDS、EBS 等。                            |
| **高可用性建議（Best Practice）**               | **AWS 建議**將資料與資源**跨多個 AZ 複製（replicate）**，以提升系統的**可靠性與韌性（resiliency）**。 |


## AWS 資料中心（AWS Data Centers）

- AWS 基礎架構的核心是由多個 資料中心（Data Centers） 組成。
- 使用者無法直接指定資料中心作為資源部署位置；最細的選擇單位是 Availability Zone（可用區，AZ）。
- 實際的資料儲存與運算都發生在這些資料中心內。

## 邊緣節點（Points of Presence, PoP）
- 降低延遲（Reduced latency）：
  - 使用者的內容請求會被導向至距離最近的 Edge Location，讓內容能以最快速度傳遞。
- 提升效能與可用性：
  - 全球數百個 PoP 節點確保在不同地理位置都能穩定提供內容。
- 節省原始伺服器負載：
  - Edge Caches 幫忙分擔流量，減少後端伺服器的壓力。
- 主要與 Amazon CloudFront（全球內容傳遞網路 CDN） 搭配使用，用於將內容更快速地傳遞給終端使用者，減少延遲（latency）。
- 運作方式
| 類型                              | 功能        | 說明                                                                               |
| ------------------------------- | --------- | -------------------------------------------------------------------------------- |
| **Edge Location（邊緣位置）**         | 快速回應請求    | 是全球分布最廣的 PoP 類型，用來**快取（cache）使用者常訪問的內容**，例如圖片、影片、網頁。                             |
| **Regional Edge Cache（區域邊緣快取）** | 儲存較少存取的內容 | 位於 Edge Locations 與原始伺服器（Origin）之間，負責**暫存較不常被請求的內容**，以減少回源（origin fetch）次數，提升效率。 |


## aws infra 特色
| 特性                                          | 說明                                                                                                              |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **彈性與可擴展性（Elasticity and Scalability）** | - **彈性（Elasticity）**：可依需求**自動調整資源容量**，在負載增加或減少時動態擴縮。<br>- **可擴展性（Scalability）**：能**隨業務成長快速擴大架構**，支援更多用戶、資料與請求量。 |
| **容錯能力（Fault Tolerance）**               | - 系統能在部分元件故障時仍**持續正常運作**。<br>- 透過**內建的元件冗餘（redundancy）**，確保不會因單點故障而中斷。                                          |
| **高可用性（High Availability）**             | - 提供**穩定的操作效能與最小化的停機時間**。<br>- 透過自動化與多層備援機制，實現**幾乎無需人工干預（minimal to no human intervention）**。                   |


## 總服務概覽

| 分類                                           | 服務名稱                      | 英文全名                           | 功能簡介                                             |
| -------------------------------------------- | ------------------------- | ------------------------------ | ------------------------------------------------ |
| **Storage 儲存服務**                             | Amazon S3                 | Simple Storage Service         | 物件儲存，具高擴展性與可用性，用於網站、備份、IoT、分析等。                  |
|                                              | Amazon EBS                | Elastic Block Store            | 高效能區塊儲存，與 EC2 搭配使用，適合資料庫與高 I/O 工作。               |
|                                              | Amazon EFS                | Elastic File System            | 全託管 NFS 檔案系統，可自動擴縮，支援多執行個體共享。                    |
| **Compute 運算服務**                             | Amazon EC2                | Elastic Compute Cloud          | 提供可調整規模的虛擬伺服器。                                   |
|                                              | Amazon EC2 Auto Scaling   | —                              | 自動新增或移除 EC2 執行個體以符合負載需求。                         |
|                                              | Amazon ECS                | Elastic Container Service      | 高效能 Docker 容器編排服務。                               |
|                                              | Amazon ECR                | Elastic Container Registry     | 全託管 Docker 映像儲存與管理服務。                            |
|                                              | AWS Elastic Beanstalk     | —                              | 自動部署與管理 Web 應用（支援 Apache、IIS）。                   |
|                                              | AWS Lambda                | —                              | 無伺服器運算，僅在程式執行時計費。                                |
|                                              | Amazon EKS                | Elastic Kubernetes Service     | 全託管 Kubernetes 容器部署與擴展服務。                        |
|                                              | AWS Fargate               | —                              | 無需管理伺服器即可執行容器（搭配 ECS/EKS）。                       |
| **Database 資料庫服務**                           | Amazon RDS                | Relational Database Service    | 全託管關聯式資料庫，支援 MySQL、PostgreSQL、Oracle、SQL Server。 |
|                                              | Amazon Aurora             | —                              | 與 MySQL、PostgreSQL 相容，效能提升 3–5 倍。                |
|                                              | Amazon Redshift           | —                              | 數據倉儲服務，可分析 PB 級資料。                               |
|                                              | Amazon DynamoDB           | —                              | NoSQL 鍵值／文件型資料庫，低延遲、高擴展性。                        |
| **Networking & CDN 網路與內容傳遞**                 | Amazon VPC                | Virtual Private Cloud          | 建立隔離的虛擬網路環境。                                     |
|                                              | Elastic Load Balancing    | —                              | 自動分配應用流量至多個目標（EC2、容器等）。                          |
|                                              | Amazon CloudFront         | —                              | 全球 CDN 網路，低延遲內容分發。                               |
|                                              | AWS Transit Gateway       | —                              | 將多個 VPC 或內部網路連接至單一閘道。                            |
|                                              | Amazon Route 53           | —                              | DNS 網域服務，將域名解析為 IP。                              |
|                                              | AWS Direct Connect        | —                              | 建立資料中心與 AWS 間的專線連線。                              |
|                                              | AWS VPN                   | —                              | 建立安全的加密通道連接內部網路與 AWS。                            |
| **Security, Identity & Compliance 安全、身份與合規** | AWS IAM                   | Identity and Access Management | 管理使用者與權限的存取控制服務。                                 |
|                                              | AWS Organizations         | —                              | 多帳號集中管理與服務限制設定。                                  |
|                                              | Amazon Cognito            | —                              | 為應用提供使用者註冊、登入與存取控制。                              |
|                                              | AWS Artifact              | —                              | 提供法遵與安全報告、審查文件。                                  |
|                                              | AWS KMS                   | Key Management Service         | 建立與管理加密金鑰，用於多項服務。                                |
|                                              | AWS Shield                | —                              | DDoS 攻擊防護服務。                                     |
| **Cost Management 成本管理**                     | AWS Cost and Usage Report | —                              | 最完整的成本與使用量報告。                                    |
|                                              | AWS Budgets               | —                              | 設定預算與警示，超出時自動通知。                                 |
|                                              | AWS Cost Explorer         | —                              | 視覺化成本分析介面，追蹤支出趨勢。                                |
| **Management & Governance 管理與治理**            | AWS Management Console    | —                              | Web 介面管理 AWS 資源。                                 |
|                                              | AWS Config                | —                              | 追蹤資源變更與組態歷史。                                     |
|                                              | Amazon CloudWatch         | —                              | 監控資源與應用效能。                                       |
|                                              | AWS Auto Scaling          | —                              | 根據需求自動調整資源容量。                                    |
|                                              | AWS CLI                   | Command Line Interface         | 以命令列操作 AWS 服務。                                   |
|                                              | AWS Trusted Advisor       | —                              | 提供安全、效能與成本的最佳化建議。                                |
|                                              | AWS Well-Architected Tool | —                              | 協助檢視與改善系統架構品質。                                   |
|                                              | AWS CloudTrail            | —                              | 追蹤使用者活動與 API 呼叫紀錄。                               |

`;export{n as default};
