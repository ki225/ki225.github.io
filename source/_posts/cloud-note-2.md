---
title: Cloud Concepts & Technologies intro - 2
date: 2025-10-13 15:57:22
tags: [Deployment, Replication]
---

## Cloud Application Deployment Lifecycle
![alt text](images/cloud/img11.png)

### 1. Deployment Design
- 應用程式的部署（Application Deployment）是依照部署設定（deployment configuration）中指定的多層架構（tiers）來建立的。
- 部署的過程是根據設定檔中規範的內容，配置雲端資源（provisioning cloud resources）以建立整體架構。
- 此過程包含：啟動伺服器實例（server instances）、設定伺服器環境，以及在這些伺服器上部署應用程式的各個層級（如前端、後端、資料庫層等）。

### 2. Performance Evaluation
- 驗證應用程式在部署後是否符合效能需求（performance requirements）。
- 監控應用程式的工作負載（workload）。
- 測量回應時間（response time）與吞吐量（throughput）。
- 監控伺服器資源使用情況，包括 CPU、記憶體、磁碟、I/O 等指標。

### 3. Deployment Refinement
在評估應用程式效能之後，會調整部署（deployment refinement）以滿足效能需求。
可採用的方式包括：

- 垂直擴展（Vertical Scaling / Scaling Up）：提升單一伺服器的硬體資源，如增加 CPU、記憶體或儲存容量。
- 水平擴展（Horizontal Scaling / Scaling Out）：增加更多伺服器節點，以分散負載並提升處理能力。
- 替代性的伺服器互連方式（Alternative Server Interconnections）：改善伺服器之間的連線架構與通訊效率。
- 替代性的負載平衡策略（Alternative Load Balancing）：調整或更換負載平衡演算法以優化流量分配。
- 複寫策略（Replication Strategies）：透過資料或服務的複寫提升可靠性與容錯能力。

## Replication
- 在雲端中建立並維護多份資料副本（replicas）。
- 當主要資料來源（primary location）發生資料遺失時，組織仍可透過次要資料來源（secondary data sources）持續運行應用程式，確保業務不中斷。
### Array-based Replication
- 將資料自動從本地儲存陣列複製到遠端儲存陣列。
- 通常會使用 NAS（Network Attached Storage，網路附加儲存） 或 SAN（Storage Area Network，儲存區域網路） 來進行資料複寫。
- 優點（Advantages）：
  - 系統更穩定可靠（robust）。
  - 部署時需要較少的協調工作。
  - 複寫工作由儲存設備負責，可減輕伺服器負擔。
- 缺點（Disadvantages）：
  - 需要同質性儲存環境：來源與目標儲存陣列必須為相同或相容的設備。
  - 建置成本高，實施費用較昂貴。

![alt text](images/cloud/img12.png)

### NAS vs. SAN
| 類型 | 全名 | 定義與用途 | 特點 | 優勢重點 |
|------|------|-------------|------|-----------|
| NAS | Network Attached Storage（網路附加儲存） | 具備大容量儲存能力的裝置或裝置群組，提供以檔案為基礎（file-based）的資料儲存服務給網路上的其他設備。 | - 具備圖形化管理介面或網頁入口（如 QNAP Hybrid Backup Sync、Synology Hyper Backup）。<br>- 易於操作與管理。 | 使用者友善的檔案共享解決方案。 |
| SAN | Storage Area Network（儲存區域網路） | 為高效能與關鍵任務應用（mission-critical applications）所設計的系統。 | - 將多個儲存設備（如磁碟陣列、磁帶櫃）連接至專用網路，與 LAN 隔離。<br>- 儲存流量與一般網路流量分離。 | 提供最佳化的效能與資料可用性。 |


![alt text](images/cloud/img13.png)

### Network-based Replication
- 使用一個部署在網路上的專用設備（appliance），用來攔截主機與儲存陣列之間傳送的封包。
- 被攔截的封包會被複製（replicate）到次要位置以進行資料備援。
- 優點
  - 適用於大型且異質性（heterogeneous）的儲存與伺服器環境。
  - 支援任何作業系統平台與任何儲存陣列。
  - 運作時獨立於伺服器與儲存設備之外，不會干擾原系統。
  - 可在多廠牌產品之間進行資料複寫。
- 缺點
  - 初期建置成本高，因為需要專用硬體（proprietary hardware），且後續仍有維運成本。
  - 必須實作儲存區域網路（SAN）才能運行。


![alt text](images/cloud/img14.png)

### Host-based Replication
- 在標準伺服器上運行，透過軟體將資料從本地端傳輸到遠端位置。
- 主機本身扮演複寫控制機制（replication control mechanism）的角色。
- 每台主機上都會安裝一個代理程式（agent），彼此之間進行通訊與同步。
- 主機層級複寫可用於即時（real-time）複製整個虛擬機（VM）。
- 通常分為
  - 區塊層複寫（Block-based replication）
    - 需要本地與遠端伺服器上具有相同大小的專用磁碟區（dedicated volumes）
  - 檔案層複寫（File-based replication）
    - 管理者可以選擇要複寫的特定檔案或資料夾。
    - 所需儲存空間較區塊層複寫少。
- 優點
  - 彈性高：可利用現有的 IP 網路。
  - 可客製化：可依需求選擇要複寫的資料。
  - 可排程傳輸：能設定傳輸時間並限制頻寬使用。
  - 多元儲存支援：可在兩端使用不同類型的儲存設備組合。
- 缺點
  - 若無集中管理介面，大量伺服器環境難以維護。
  - 複寫過程會佔用主機資源（CPU、I/O 等）。
  - 兩端儲存設備皆需保持啟動狀態，因此需額外購置硬體與作業系統。
  - 並非所有應用程式都支援此類複寫。
  - 可能受病毒或應用程式錯誤影響。


![alt text](images/cloud/img15.png)

| 特性 | 陣列層級複寫（Array-based Replication） | 網路層級複寫（Network-based Replication） | 主機層級複寫（Host-based Replication） |
|------|----------------------------------|------------------------------------|----------------------------------|
| 執行層級 | 儲存陣列層（Storage array layer） | 網路層（如 SAN 交換器） | 主機層（作業系統或應用層） |
| 主機參與程度 | 不需要 | 不需要 | 需要 |
| 硬體相容性 | 需相同品牌的儲存設備 | 支援跨品牌 | 與儲存硬體無關 |
| 效能影響 | 最小 | 低 | 較高（會使用主機的 CPU 與 I/O） |
| 成本 | 高 | 中 | 低 |
| 彈性 | 低 | 中 | 高 |
| 典型應用情境 | 關鍵任務系統（例如金融業） | 異質環境（多品牌混合架構） | 雲端備份、跨平台應用 |


## Software Defined Networking
### Conventional Network 
- Control plane 和 data plane 是耦合的
- 複雜
  - 現代網路設備越來越複雜，因為不斷加入新的通訊協定以提升連線速度與可靠性。
  - 傳統網路多適用於靜態流量模式（static traffic patterns）
  - 各種通訊協定通常是為特定應用程式而設計的
  - 由於傳統網路架構複雜，當流量模式變化時，要調整或修改設定以應對動態需求相當困難
- 管理負擔
  - 管理來自多個廠商的多台網路設備與介面相當困難，當進行網路升級（upgradation）時，往往需要同時修改多個設備的設定（例如交換器、路由器、防火牆等）。
- 可擴展性受限
  - 虛擬化技術的普及，使得需要網路存取的虛擬主機數量大量增加。
    - 多租戶應用（multi-tenant applications）在雲端中分散部署於多個虛擬機上，需彼此交換大量流量。
    - 大數據應用（Big Data applications）通常會在大量虛擬機上執行分散式演算法，產生龐大的 VM 間資料交換需求。

![alt text](images/cloud/img16.png)

### Software Defined Network (SDN)
- 控制平面與資料平面分離
- 網路控制器（Network Controller）採用集中式設計（Centralized Network Controller），統一管理整個網路的行為與策略。
- 具備以下三項特徵：
  - 集中化網路控制器（Centralized Network Controller）：由單一邏輯控制中心負責整體網路的路由與資源配置決策。
  - 可程式化的開放 API（Programmable Open APIs）：允許開發者透過程式化方式動態控制網路行為。
  - 標準化通訊介面（Standard Communication Interface，例如 OpenFlow）：用於控制層與資料層之間的通訊，實現統一管理與協作。


![alt text](images/cloud/img17.png)

![alt text](images/cloud/img18.png)

### SDN 裡面的 Centralized Network Controller
- 維持整個網路的統一視圖（unified view），使設定、管理與資源配置（configuration, management, provisioning）變得更簡單、更一致。
- 透過可程式化的開放 API（programmable open APIs），可以直接部署 SDN（Software-Defined Networking）應用程式，以動態控制網路行為。
- 因此，網路管理員不再需要等待設備廠商將新功能嵌入專有硬體（proprietary hardware）中，即可自行實現與更新網路功能。

### Programmable Open APIs
- SDN 架構（Software-Defined Networking）支援可程式化的開放 API，作為SDN 應用層與控制層之間的介面（稱為 Northbound Interface，北向介面）。
- 這些開放 API 允許開發者實作網路功能，例如：
  - 路由（Routing）
  - 服務品質（QoS, Quality of Service）管理
  - 存取控制（Access Control）
- 藉由這種開放式設計，SDN 能靈活整合新功能，快速響應應用與流量需求的變化

### Standard Communication Interface(OpenFlow)
- 在 SDN 架構（Software-Defined Networking）中，控制層（Control Layer）與基礎設施層（Infrastructure Layer）之間透過標準化的南向介面（Southbound Interface）進行通訊。
- OpenFlow 是由 開放網路基金會（ONF, Open Networking Foundation） 所制定的標準協定，也是目前最廣泛採用的 SDN 南向介面協定。
- OpenFlow 採用 「流（flow）」的概念 來識別與管理網路流量：
  - 每個「flow」會根據預先定義的比對規則（match rules）進行分類。
  - 控制器可根據這些規則，決定如何轉送、阻擋或修改封包，達成動態且可程式化的網路控制。

#### OpenFlow Switch
1. 流表（Flow Table / Group Table）
- 負責進行 封包查詢（packet lookups），根據匹配規則決定如何處理封包。
- 控制封包的轉送（forwarding），並透過 **OpenFlow 通道（OpenFlow channel）與外部的控制器（controller）**進行通訊。
![alt text](images/cloud/img20.png)

2. OpenFlow 通訊協定（OpenFlow Protocol）
- 這是一種在控制器與網路設備之間雙向實作的協定，用於維持控制與資料交換。
- 控制器（Controller） 透過 OpenFlow Switch Protocol 來管理交換器：
  - 可以新增（add）、更新（update）或刪除（delete）流表中的項目（flow entries）。
  - 以此達到動態控制網路流量、即時改變路由決策與執行網路策略的目的。

![alt text](images/cloud/img19.png)

