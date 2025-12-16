---
title: cp 證照 - Cloud Economics and Billing
date: 2025-10-14 20:14:52
tags: [aws, cp]
---

## Section 1: Fundamentals of pricing
### pricing model
AWS 主要有三種基本的花費項目，包括:
1. compute
2. storage
3. data transfer

### how to pay
1. pay as you go
2. pay less when you reserve, save up to 75 percen
   - Reserved Instances (RIs)
     - All Upfront Reserved Instance (AURI) → largest discount
     - Partial Upfront Reserved Instance (PURI) → lower discounts
     - No Upfront Payments Reserved Instance (NURI) → smaller discount
3. pay less when you use more 
  - 分級定價（Tiered pricing）：像是 Amazon S3、Amazon EBS、Amazon EFS 等服務，
  - 使用量越大，每 GB 的單價就越低。
多種儲存服務：可根據需求選擇不同方案，以進一步降低整體儲存成本。
4. pay less as aws grow
5. Services with no charge
   - 完全不用錢
     - Amazon VPC
   - 如果關聯其他服務就需要錢
     - Elastic Beanstalk
     - Auto Scaling
     - AWS CloudFormation
     - IAM

## Section 2: Total Cost of OwnershipIntroducing 
### Total Cost of Ownership (TCO)?  
- 是一種財務估算方式，用來識別系統的直接成本與間接成本。可以幫助：
  - 比較成本：
    - 用來比較在本地（on-premises）執行整個基礎架構環境或特定工作負載，與在 AWS 雲端上執行的成本差異。
  - 預算與決策依據：
    - 幫助規劃預算，並為遷移至雲端建立合理的商業理由（business case）。 

### AWS Pricing Calculator

* **估算**每月成本
  預先了解在 AWS 上運行服務的每月預估費用。
* 找出降低成本的機會
  分析支出組成，找出可節省開銷的部分。
* 在建置前進行方案建模
  先模擬架構與資源配置，避免實際部署後超支。
* 探索價格細節與計算方式
  檢視估算背後的計價依據與單位成本。
* 尋找符合需求的執行個體類型與合約方案
  比較不同的 Instance 類型與付費條件（如 On-Demand、Reserved、Savings Plans）。
* 命名並建立服務群組
  可為估算命名，並依專案或功能分類不同服務群組，方便管理與比較。

## AWS Organizations
### 主要優點

* 集中式管理多個帳號的存取政策
  可在組織層級統一設定與管理 IAM 政策，簡化多帳號權限控管。
* 控制對 AWS 服務的存取
  可限制或允許特定帳號使用哪些 AWS 服務，提升安全性與治理能力。
* 自動化帳號建立與管理
  能自動建立新的 AWS 帳號並套用預設設定，方便大規模管理。
* 整合帳單管理（Consolidated Billing）
  將多個 AWS 帳號的費用集中管理與支付，方便追蹤總成本並享有量價折扣。

![alt text](images/AWS/cp/img1.png)

### Set up 步驟
1. Create Organization 
2. Create organizational units
3. Create service control policies
4. Test restrictions

## AWS Billing and Cost Management
- 支付 AWS 帳單: 管理所有帳號的付款方式與帳單資訊。
- 監控使用量與支出: 即時追蹤你在各項服務上的使用情況與費用。
- 設定預算與預測成本: 透過預算與預測功能，提前了解未來的支出趨勢，以便做好資金規劃。

底下包含了:
1. AWS Budgets
2. AWS Cost and Usage Report: 了解長期的成本趨勢與使用模式(並非預估)
3. AWS Cost Explore

## Technical support 
### 主動式指導（Proactive guidance）
- Technical Account Manager（TAM，技術帳戶經理）
  - TAM 是專屬於你的主要聯絡人，負責提供：
    - 架構設計與最佳化建議
    - 專案部署與風險規劃指導
    - 持續性技術溝通與狀況追蹤
  - TAM 會協助你在規劃、部署、與持續營運 AWS 解決方案時保持穩定與高效。

### 最佳實踐建議（Best practices）

- AWS Trusted Advisor（受信任顧問）
  - 這是一個線上工具，相當於你的「雲端顧問」，能：
    - 檢查系統設定是否符合 AWS 最佳實踐
    - 找出降低每月支出與提升效能的機會
    - 提升安全性與容錯能力（例如偵測未使用的資源、弱安全設定、或可升級的方案）

### 帳號協助（Account assistance）
- AWS Support Concierge（支援禮賓服務）
  - 負責處理帳務與帳號層級的非技術問題，例如：
    - 帳單分析與費用查詢
    - 付款方式、帳號設定
    - 統合帳單或發票問題
  - Concierge 會提供快速且有效率的帳務支援，協助你釐清財務與帳號管理相關疑問。

## AWS Support 提供四種支援方案
| 支援方案                         | 適用對象                 | 主要特色                                                                                                  | 適用情境             |
| ---------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------- | ---------------- |
| **Basic Support（基本支援）**      | 所有 AWS 使用者自動擁有       | - 24/7 客服服務<br>- 學習資源（文件、白皮書、論壇）<br>- 六項 Trusted Advisor 核心檢查<br>- 個人健康儀表板（Personal Health Dashboard） | 初學者、學習與小型專案      |
| **Developer Support（開發者支援）** | 測試或早期開發階段的使用者        | - 提供開發階段技術指導與支援<br>- 協助快速導入 AWS<br>- 適用於非正式環境或測試用途                                                    | 應用程式開發中、PoC 測試階段 |
| **Business Support（商業支援）**   | 在 AWS 上執行**生產環境**的客戶 | - 24/7 技術支援與架構建議<br>- 全面 Trusted Advisor 檢查<br>- 支援多項服務與高可用性架構<br>- 可聯絡 AWS Support 工程師               | 正式上線系統、營運中應用     |
| **Enterprise Support（企業支援）** | 執行**商業與關鍵任務系統**的企業   | - 專屬 **Technical Account Manager (TAM)**<br>- 主動管理與架構審查<br>- 專家協助部署與遷移<br>- 最佳實踐與效能優化建議               | 關鍵業務、金融級、全球部署系統  |
