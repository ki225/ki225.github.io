const n=`---
title: Cloud Concepts & Technologies intro - 1
date: 2025-10-13 13:36:48
tags: [cloud, virtualization, Load Balancing, Scalability, Elasticity ]
---

這篇筆記主要是在講雲端優勢以及相關技術，還不會提到大廠雲服務。

## Virtualization
在過去尚未虛擬化的時代，一個 server 只能擁有一個 os，並處理特定的服務，但這樣就會發生單點故障的問題。

![alt text](images/cloud/img1.png)

### 甚麼是虛擬化?
- 虛擬化將運算資源的實體特性隱藏起來，讓使用者（無論是應用程式還是終端使用者）看不到底層的實體細節。
- 讓單一實體資源（如伺服器、作業系統、應用程式或儲存裝置）看起來像是多個虛擬資源在運作；也可以讓多個實體資源（例如多個儲存裝置或伺服器）呈現為一個統一的虛擬資源

![alt text](images/cloud/img2.png)

### Hypervisor
- 虛擬化層（Virtualization Layer）由虛擬機管理程式（hypervisor）或虛擬機監控器（VMM, Virtual Machine Monitor）所組成
- Hypervisor 會向 guest OS 提供一個虛擬化的作業環境平台
- Hypervisor 可分為 Type-1（原生型）與 Type-2（宿主型） 兩種類型
    - type 1: 這類 Hypervisor（又稱原生型虛擬機管理程式）直接運行在主機硬體上，負責控制硬體資源並監控各個來賓作業系統（Guest OS）。
    - type 2: 這類 Hypervisor（又稱宿主型虛擬機管理程式）運行在一般的主機作業系統（Host OS）之上，再由它來監控與管理來賓作業系統。

![alt text](images/cloud/img4.png)

### Guest host
- 指安裝在虛擬機（Virtual Machine, VM）中的作業系統，與主要的主機作業系統（Host OS）並存。
    - 主機 OS 負責硬體資源管理；客體 OS 則在虛擬化層（Hypervisor）上執行，像是「被包在盒子裡的電腦」。 
- 異質性支援： 在虛擬化環境中，客體 OS 不一定要與主機 OS 相同，例如可以在 Windows 主機上運行 Linux 虛擬機。

## 虛擬化類型分類

### Emulation（模擬）
- 利用另一種電腦或系統，模仿原本電腦或電子系統的行為，換句話說，就是讓一台電腦「假裝」成另一台電腦，能執行原系統的程式或遊戲。
- 以遊戲模擬器（Game Emulator）為例子，就是讓現代電腦模擬早期主機（如 PS2、Game Boy）的運作環境，執行原主機上的遊戲。


![alt text](images/cloud/img5.png)


### Full Virtualization
- 虛擬化層（Virtualization Layer）會完全將客體作業系統（Guest OS）與底層硬體分離（解耦），讓客體 OS 不需知道實際硬體的存在。
- guest OS 不需要任何修改，且不會察覺自己是在虛擬化環境中運行
  - 完全虛擬化讓 guest os 「以為自己擁有整台電腦」，
- 二進位轉譯（Binary Translation）完全虛擬化透過「直接執行使用者層指令（User Requests）」與「動態轉譯作業系統層指令（OS Requests）」來達成。
  - 也就是 Hypervisor 會攔截、翻譯並執行那些原本無法直接運行在虛擬環境中的指令。
- 優點
  - 模擬層（Emulation Layer）能夠將各個虛擬機（VM）彼此，以及與主機作業系統（Host OS）之間完全隔離。
  - 它同時控制每個 VM 對系統資源的存取，可防止某個不穩定的虛擬機影響整體系統效能。
  - 透過模擬一致的系統硬體環境，完整虛擬化還能提供高度的虛擬機可攜性，使 VM 能夠在不同硬體的主機之間透明地遷移而不會出現相容性問題。
  - 支援此類虛擬化的主要產品包括 VMware、Microsoft Hyper-V 與 KVM。

![alt text](images/cloud/img6.png)

### Para-Virtualization
- 半虛擬化透過修改客體 OS，使它能主動與 Hypervisor 合作
  - 客體作業系統（Guest OS） 會被修改（modified），以便能夠與虛擬機監控器（Hypervisor）直接溝通，從而提升整體效能與效率（performance and efficiency）
- 核心修改內容
  - 在客體作業系統的 核心（kernel） 中，原本那些無法虛擬化的指令（non-virtualizable instructions）會被替換成超呼叫（hypercalls）。
  - 這些 hypercalls 會直接與虛擬化層（hypervisor）通訊，避免了複雜的指令模擬過程。
- 優點
  - 接近原生效能：
    - 半虛擬化的客體系統執行效能比完全虛擬化更接近實體機（native performance），因為它能直接與 Hypervisor 溝通，減少模擬與轉譯開銷。
  - 不依賴最新硬體支援：
    - 不需要使用最新的 CPU 虛擬化指令集（如 Intel VT-x、AMD-V），即可運作，對硬體相容性要求較低。
  - 彈性虛擬介面：
    - 允許虛擬機與底層硬體之間的介面設計不必完全相同，可根據效能或應用需求進行最佳化。
  - 支援技術：
    - 此類虛擬化方式被 VMware 與 Xen 所採用與支援。

![alt text](images/cloud/img7.png)

### Hardware Virtualization
- 透過硬體層內建的虛擬化功能來實現，例如：Intel VT-x（Virtualization Technology）、AMD-V（AMD Virtualization）
- 運作原理
  - 當作業系統執行「特權指令或敏感操作（privileged and sensitive calls）」時，這些指令會自動被攔截（trap）並交由 Hypervisor 處理。
- 不再需要使用「二進位轉譯（Binary Translation）」或「半虛擬化（Para-Virtualization）」等軟體層解決方案，因為硬體本身就提供了安全、高效的虛擬化支援


![alt text](images/cloud/img8.png)

## Load Balancing
負載平衡（Load Balancing）可以透過軟體或硬體方式實現。

- 軟體型負載平衡器（Software-based Load Balancer）
  - 執行於一般的作業系統上，也可以進一步被虛擬化。
- 硬體型負載平衡器（Hardware-based Load Balancer）
  - 將負載平衡演算法實作在專用積體電路（ASIC, Application Specific Integrated Circuit）中。
  - 當使用者的請求進入時，系統會依照預先設定的負載平衡策略，將請求導向後端伺服器。
  - 而伺服器的回應則會被直接回傳給使用者（第4層負載平衡），或是先回到負載平衡器再傳給使用者（第7層負載平衡）。

## Load Balancing Algorithm
### Round Robin
伺服器會依序（one by one）被選取來處理新的請求，以非階層式、循環（circular）的方式分配工作，而且沒有為任何伺服器設定優先權（no priority assigned）。

### Weighted Round Robin
每台伺服器會被分配一個權重（weight）。新進的請求會根據這些權重的固定（static）或動態（dynamic）比例來決定要路由到哪一台伺服器。

### Low Latency
負載平衡器（Load Balancer）會監控每台伺服器的延遲時間（latency），並將新的請求導向延遲最低的伺服器。

### Least Connections
- 這種負載平衡方法會即時追蹤每台伺服器的當前連線數，讓新進的請求會被分配給目前連線數量最少的伺服器
- 優點: 
  - 適合請求處理時間長短不一的應用（例如即時聊天、影音串流）
  - 避免部分伺服器過載
- 缺點: 但需持續追蹤每台伺服器的連線狀態。


![alt text](images/cloud/img9.png)

### Priority
- 每台伺服器都會被設定一個優先等級（priority），當有新流量進入時，請求會優先導向等級最高的伺服器。
- 若該伺服器發生故障或無法服務，則會自動切換（failover）到下一個較低優先等級的伺服器。
- 特色
  - 備援伺服器僅在主機失效時接手
  - 設計簡單，適合關鍵任務或主備架構（Primary###Backup）
  - 容易造成負載不均


### Overflow
- 當最高優先等級的伺服器接收到的請求量超出負荷（overflows）時，多餘的請求會被轉送到次高優先等級的伺服器。
- 平時由高優先伺服器處理主要流量。


## Session-based Application
因為負載平衡器可能會把同一位使用者的多次請求分配到不同伺服器，所以必須有機制來維持使用者的工作階段狀態（session state）或相關資訊。

### Sticky sessions
- 所有屬於同一位使用者的請求（user session）都會被導向到同一台伺服器進行處理。
- 優點
  - 因為所有使用者資料都存在同一台伺服器上，不需要跨伺服器同步 session 狀態。
- 缺點
  - 單點風險高

### Session Database
- 所有的工作階段資訊（session information）都會儲存在外部的獨立資料庫中（stored externally in a separate session database）。
- 為了避免單一故障點（single point of failure），這個資料庫通常會進行複製或備援（replication）。
- 常見實作
  - Redis、Memcached、MySQL、PostgreSQL 等皆可作為 Session Store。
  - 通常會搭配主從複寫（master-slave replication）或叢集部署以提高可用性。

### Browser cookies
- 工作階段資訊（session information）會儲存在用戶端（client side），以瀏覽器 Cookie 的形式存在。
- 這種方式讓工作階段管理更簡單（session management easy），同時對負載平衡器的負擔最小（least overhead）。
- 優點
  - 不需集中式資料庫或黏性連線
  - 減少伺服器端記憶體負擔
- 缺點
  - 受 Cookie 容量限制（通常 4KB 以內）
  - 若加密不當，可能有安全風險（如竊取、偽造）

### URL re-writing
- URL 改寫引擎（URL re-write engine）會在用戶端（client side）透過修改網址（URL）的方式來儲存工作階段資訊（session information）。
- 優點
  - 可避免負載平衡器的額外負擔（overhead），因為不需伺服器端維護 session 狀態。
  - 可儲存的工作階段資訊量有限，對於需要大量 session 資料的應用不適用。
- 缺點
  - 但安全性較低（URL 可能被分享或記錄在瀏覽器歷史中）。
  - 對於需要大量 session 資料的應用不適用。


## Scalability & Elasticity
現代網頁應用程式通常採用多層式部署架構（multi-tier deployment），例如有前端層（Web Tier）、應用層（Application Tier）、資料層（Database Tier）等等，並且每一層的伺服器數量可能不同（varying number of servers in each tier）。

因此，容量規劃（capacity planning）成為一項非常重要的工作，它的目的在於決定應用程式每一層部署所需的資源數量與規模，例如：

- 計算資源（Computing resource）
- 儲存空間（Storage）
- 記憶體（Memory）
- 網路資源（Network resource）

![alt text](images/cloud/img10.png)

### Traditional capacity planning
- 垂直擴充（Scale Up / Vertical Scaling）
  - 透過升級單一伺服器的硬體資源來提升效能，例如：增加 CPU 核心數、記憶體、儲存空間或網路頻寬。
  - 適合中小規模應用
  - 有物理極限與單點故障風險
- 水平擴充（Scale Out / Horizontal Scaling）
  - 增加更多相同類型的伺服器，例如新增多台應用伺服器來共同處理請求。
  - 高可用、易於彈性擴展
  - 系統架構需支援分散式運作（如負載平衡與資料同步）`;export{n as default};
