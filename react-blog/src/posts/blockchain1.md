---
title: 區塊鏈 & 分散式帳本技術簡介
date: 2025-03-05 13:41:25
tags: [blockchain, DLT, Distributed Ledger Technology]
---
## 區塊鏈介紹

區塊鏈平台是一種點對點（peer-to-peer）的電腦網路，利用複雜的加密技術與共識機制來共同驗證與批准網路節點間的互動，即使這些節點彼此之間不一定信任。

區塊鏈將網路互動的紀錄儲存在分散式資料庫中，並由所有網路參與者共同維護。透過加密技術與共識機制的結合，節點能夠在無需中央機構介入的情況下誠實互動。當區塊鏈技術被適當應用於合適的情境時，它能提供去中心化服務，使網路具備自我管理、自我監管、智能化與安全性的功能。

## 歷史簡介  
區塊鏈技術最早由中本聰（Satoshi Nakamoto）於 2008 年發表的白皮書《Bitcoin: A Peer-to-Peer Electronic Cash System》中正式公開。在該論文中，中本聰提出了一個基於點對點網路的分散式支付系統，並將其命名為區塊鏈（Blockchain）。在該系統中，節點之間的互動是透過一種隨機共識機制「工作量證明（Proof of Work, PoW）」來驗證與批准，並將交易紀錄存儲於所有網路節點共同維護的加密資料結構中。這是第一個已知的去中心化網路實現，使參與者能夠安全地進行交易，而無需依賴中央機構來監督網路互動。

## 共識機制與智能合約  
區塊鏈節點可以透過交易來參與網路，這些交易受到集體共識的約束。因此，共識機制可被視為區塊鏈網路中的一種「民主」機制，允許系統做出集體決策，使節點能夠對交易的有效性進行「投票」。交易可分為兩種：
1. 硬編碼交易（Hard-coded Transactions），即寫死在系統內的交易
2. 可編程交易（Programmable Transactions），即智能合約（Smart Contracts）。
> 不同共識機制的「民主程度」不同，其中一些機制需要高運算成本的算法。

當交易被確認為有效時，這些交易將被組成數據區塊，並透過加密技術（特別是哈希指標，hash pointers）按時間順序連結，形成一條區塊鏈（Blockchain）。包含有效交易的數據區塊將被新增至區塊鏈資料庫（Blockchain Ledger），簡稱為「帳本（Ledger）」。該帳本記錄了網路內所有有效交易，形成區塊鏈網路的官方歷史紀錄。透過維護帳本的本地副本，每個區塊鏈節點皆能擔任歷史紀錄的守護者，促進透明度與問責制，這對於建立分散式系統的信任至關重要。

## 區塊鏈的三大核心特性  
一般而言，區塊鏈網路具備以下三大基本特性：
1. 帳本的不可變性（Immutability）：一旦數據進入區塊鏈，便無法被竄改或刪除。
2. 資訊的透明性（Transparency）：網路內的交易紀錄可供參與者查閱，確保資訊公開。
3. 數據的一致性（Consistency）：所有節點的帳本副本始終保持同步，以確保資料一致。

## 區塊鏈分類  
根據不同的區塊鏈應用，區塊鏈系統可以分為以下三個層級：

### 1. 會員權限（Membership）
- 存取控制（Access Control）
   - 公開、無需許可（Public Unpermissioned）
   - 私有、需許可（Private Permissioned）
   - 聯盟鏈、需許可（Consortium Permissioned）
- 身份管理（Identity Management）
   - 匿名身份（Anonymous）
   - 公鑰基礎設施（Public Key Infrastructure, PKI）

### 2. 共識機制（Consensus）
- 治理結構（Governance）
   - 去中心化（Decentralized）
   - 階層式治理（Hierarchical）
   - 中心化（Centralized）
- 共識類型（Type of Consensus）
   - 工作量證明（Proof-of-Work, PoW）
   - 權益證明（Proof-of-Stake, PoS）
   - 權威證明（Proof-of-Authority, PoA）
   - 燒毀證明（Proof-of-Burn, PoB）
   - 容量證明（Proof-of-Capacity, PoC）
   - 背書機制（Endorsement-based）
   - 混合共識（Hybrid）

### 3. 帳本（Ledger）
- 存取權限（Permissions）
   - 開放讀寫（Open Read/Write）
   - 基於身份的讀寫（Identity-based Read/Write）
- 數據庫類型（Type of Database）
   - LevelDB
   - CouchDB

### 4. 智能合約（Smart Contracts）
- 邏輯結構（Logic Structure）
   - 硬編碼邏輯（Hard-coded Logic）
   - 可編程邏輯（Programmable Logic）
- 程式語言（Coding Language）
   - 專用語法（Single Dedicated Syntax）
   - 通用語法（General Purpose Syntax）
- 授權模式（License）
   - 開源（Open Source）
   - 封閉源（Closed Source）

## 分散式帳本技術（DLT）
區塊鏈系統直接衍生自分散式帳本技術（Distributed Ledger Technology, DLT）。DLT 是一種數據庫架構，它透過一組加密協議來分散存儲交易記錄，並提供存取、驗證、更新和管理這些記錄的方式。這些協議確保了記錄的不可變性、一致性、可用性與透明度。相比於中心化系統，DLT 能有效消除單點故障（Single Point of Failure, SPOF），提高數據安全性與抗審查能力。

![image](images/blockchain/img1.png)


## References
- [A Quick Overview of Hyperledger Fabric](https://kctheservant.medium.com/a-quick-overview-of-hyperledger-fabric-348e8c4da451)
- [Private data](https://hyperledger-fabric.readthedocs.io/en/release-2.5/private-data/private-data.html)
- [Hyperledger Fabric专业词汇解释](https://blog.csdn.net/djklsajdklsajdlk/article/details/125334014)
- [Decentralizing Trust: Consortium Blockchains and Hyperledger Fabric Explained](https://www.arxiv.org/pdf/2502.06540)