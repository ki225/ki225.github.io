---
title: 3GPP - Transparent satellite based NG-RAN architecture
date: 2025-11-16 11:46:38
tags: [3gpp]
---

在上一篇筆記有介紹了兩種 payload，我們知道了 Transparent Payload 只有實作了頻率轉換與射頻功率放大器，但並沒有做拆解與重新包裝的部分。在這個章節我們要延伸介紹 Transparent satellite。

## Transparent satellite
下圖展示了一個以 透明式衛星為基礎的 NG-RAN 架構。其關鍵概念是：
- 衛星不負責 base station（gNB）功能，而只是單純的 RF 中繼器（repeater）。
  - 他的 payload 只會
    - 射頻濾波（RF filtering）
    - 頻率轉換（frequency conversion）
    - 功率放大（amplification）
  - 衛星會把 NR-Uu 介面「原封不動地重複」在兩條鏈路之間，這就是圖中綠色框所強調的部分。
    - Service link（UE ↔ 衛星）和 Feeder link（衛星 ↔ NTN Gateway）都使用 NR-Uu 介面（5G 無線介面）。
    - 完全不會終止 NR-Uu，也不會做 baseband 處理 → 所以它其實就是 Remote Radio Unit（RRU）被放到太空裡。

![alt text](images/3gpp/img4.png)

而下一張圖是 Transparent Satellite 更詳細的 NTN 結構圖，可以看到 NR-Uu 是原封不動地穿過衛星，整個 NR-Uu 介面是由 gNB 終止，不是由衛星終止。PDU (Packet Data Unit) Session 是為 UE 與 DN (Data Network) 提供 PDU 連線服務的資料通道，PDU session 裡面又可以看到 QoS Flow (服務品質流程) 是如何映射到 Radio Bearer（UE–gNB）及 NG-U Tunnel（gNB–UPF）
- QoS Flow (服務品質流程) 是 PDU Session 裡面的最小單位，一個 Session 可以有很多個 QoS Flow，每一個 QoS Flow 都有不同的上下行流量設定。
- radio bearers -> 無線電承載（RAN）
- NG-U tunnels -> 使用者平面隧道（Core UP）

![alt text](images/3gpp/img6.png)

在 5G（尤其 NTN 衛星網路）中，控制面與使用者面的協定、功能、路徑、延遲、可靠性需求全部都不一樣，controle plane 負責管理連線、認證、移動性、UE 註冊等「網路運作本身」；而 user plane 負責實際傳資料（網頁、影像、VoIP）。所以在接下來的詳細介紹裡面會分成針對 user plane 的，與 control plane 的。

### User Plane
透過下圖可以更清楚的發現到衛星和 NTN Gateway 是完全不插手做事，直到訊號到地面的 gNB（地面基地台）才會進行處理，把原本的內容重新封裝成符合 5G Core(5GC)的格式，最後透過 GTP-U（NG-U）介面傳送給 UPF。這邊收到 UE 的 NR-Uu 詳細說明如下：
| UE 協定層   | 功能                 |
| -------- | ------------------ |
| **PDU**  | 使用者資料（IP packet）   |
| **SDAP** | 將 QoS Flow 映射到 DRB |
| **PDCP** | 加密、壓縮、重排序          |
| **RLC**  | ARQ 重傳、分段/重組       |
| **MAC**  | 排程、HARQ            |
| **PHY**  | 實際無線訊號（OFDM 等）     |

和 user plane 不一樣的是，重新封裝後會透過介面 NG-C 傳送給 5GC 的 AMF

> 其中下圖看起來是白色打叉的框框代表 RF processing & Frequency Switching

![alt text](images/3gpp/img7.png)

### Control Plane

而下圖是針對 control plane，和 user plane 一樣衛星和 NTN Gateway 是完全不插手做事，直到 gNB 才會重新封裝。這邊收到 UE 的 NR-Uu 詳細說明如下：

| gNB 協定層              | 功能                                  |
| -------------------- | ----------------------------------- |
| **RRC**              | UE context、連線建立、radio configuration |
| **PDCP/RLC/MAC/PHY** | 處理無線承載                              |
| **NGAP（NG-AP）**      | gNB ↔ AMF 控制訊號                      |
| **SCTP**             | NG-AP 傳輸協定                          |
| **IP/L2/L1**         | gNB → AMF 傳輸協定                      |


![alt text](images/3gpp/img8.png)

### 透明式衛星對 NG-RAN 的影響
- 透明式衛星不需要修改 5G RAN 架構（NG-RAN）
  - 什麼協定都不終止 → NG-RAN 不需要變更架構
- NR-Uu（UE ↔ gNB）相關定時器 需要延長，因為衛星延遲太大
- 在有 ISL（衛星間連結）的 LEO 架構中，延遲要包含：feeder link（衛星 ↔ gateway）、service link（UE ↔ 衛星）、多個 ISL（衛星 ↔ 衛星）躍點
- 衛星什麼都不懂，只是 RF repeater。全部都在 地面 gNB 與 5GC 終止。
- 控制面協定不需改動，只需調整 timer 以適應較大的 Uu （NR-Uu）往返延遲。使用者面協定也不需修改，但長延遲會影響傳輸效率，因此 gNB 必須配置更大的 buffer 來支援高延遲下的資料傳輸。
  - 延遲變大 ⇒ 在路上的資料變多 ⇒ gNB 這頭要暫存的東西就變多 ⇒ buffer 要變大。


## Regenerative satellite based NG-RAN architectures

和上一小節不同，Regenerative Satellite 的 NTN 架構會對來自地面的訊號進行 regeneration 處理。主要包含以下元素：
- NR-Uu 無線介面：用於 UE 與衛星之間的業務鏈路（service link）。
- 衛星無線介面（Satellite Radio Interface, SRI）：用於 NTN Gateway 與衛星之間的前回程鏈路（feeder link）。

從下圖可以看到流程為：
- UE ↔ 衛星
  - 使用 NR-Uu，就像對地面基地台一樣。
- 衛星跑 gNB 功能
  - 這是「再生式衛星」的關鍵 → 不只是轉發，而是處理 RAN layer。
- gNB output 透過 SRI 傳給 NTN Gateway
  - 使用 NG interface，但透過 SRI 回地面。
- NTN Gateway → 5GC（地面）
  - Gateway 只負責傳輸，不做 RAN。
- 5GC ↔ DN
  - 標準 5G core 網路架構。

![alt text](images/3gpp/img9.png)

而當有多個衛星時，因為 gNB 不在地面、而是在衛星上，所以衛星之間可以互相 relay NG interface 資料，透過 ISL 跨衛星傳遞，直到最後一個衛星才送到地面 5G Core Network（5GCN）。這樣的好處是：
- 不同軌道位置、不同衛星上搭載的 gNB（例如 LEO 星群）
  - 可以全部接到同一個地面的 5G Core Network
  - 即使它們覆蓋不同區域，也可以共用同一個核心網

另外，如果一顆衛星上不只一個 gNB（例如 multi-beam or multi-sector），或是多顆 gNB 虛擬化（vRAN / CU-DU 分離），那麼同一條 SRI（Satellite Radio Interface，衛星與 Gateway 的 feeder link）會承載該衛星所有 gNB 的 NG interface 資料，也就是說多個 gNB 的 NG-C（控制平面）與多個 gNB 的 NG-U（使用者平面）全部會 MUX（multiplex）在同一條 SRI 鏈路上送回地面。

> ps Xn 是 gNB ↔ gNB 之間用的跨節點介面

![alt text](images/3gpp/img10.png)

從更詳細的下圖可以看到 radio bearers 和  NG-U tunnels 的劃分和上一個不一樣了。
- gNB 在衛星上

![alt text](images/3gpp/img11.png)

以下同樣分成 user plane 和 control plane 去做介紹。

### User Plane
但因為 gNB 在衛星上，NG-U 不是直接傳到地面，而是 NG-U (GTP-U) 是透過 SRI（Satellite Radio Interface）下行傳到 NTN Gateway，其中可以從下圖看到 MAC 和 PHY 層會在 gNB 轉成 Protocol Layers of the SRI　——　也就是 SRI 的封包承載層（類似回程 link layer）　——　再傳回地面的 gateway。從 NTN Gateway 傳來的 GTP-U PDU Session 封包會由 UPF 接收，並直接當作地面 5G 的一般流量一樣處理。

![alt text](images/3gpp/img12.png)


### Control Plane
- RRC / PDCP / RLC / MAC / PHY（Access Stratum）是 UE ↔ gNB 的協定，屬於 RAN，會透過衛星上的 gNB 進行重新封裝
- NAS（Non-Access Stratum）是 UE ↔ 5GC（AMF/SMF）之間的協定，不經 gNB 解碼，gNB 只 relay。
  - NAS-SM（Session Management，跟 SMF）
  - NAS-MM（Mobility Management，跟 AMF）
- NTN Gateway 不做 RAN 層處理，只做 SRI 解封以還原成 IP 傳輸，以及 IP forwarding 以傳給地面的 5GC AMF

![alt text](images/3gpp/img13.png)

### 對 NG-RAN 的影響
- 延遲的增加
  - NG 介面延遲：因為 gNB 不在地面，而是在衛星上，NG-C / NG-U 訊息必須穿越衛星回程鏈路（SRI），甚至還要經過多條 ISL，這些天線傳輸距離遠、傳輸路徑複雜，因此延遲一定遠大於地面光纖。
  - GEO 衛星：因為距離地球更遠，所以延遲更高
- 應用協定（Application Protocol）的計時器（timers）可能需要延長，以因應前回程鏈路（feeder link）所產生的長延遲。
  - 許多控制協定會設置 timer，以定義訊息送出去後，多久沒收到回應就當作超時
  - NG 介面可能經歷比地面網路更長的延遲（在地球同步軌道 GEO 衛星的情況下可達數百毫秒），這會同時影響控制平面（CP）與使用者平面（UP）；此問題可透過實作方式進行調整與處理。
  - 例如：
    - NG-AP：跑在 gNB ↔ AMF 之間的控制協定（NG-C 上的應用層協定）
- 在具備星間鏈路（ISL）的低軌道（LEO）衛星情境中，所需考量的延遲至少應包含前回程鏈路（SRI），以及一條或多條星間鏈路（ISL）。

## gNB-DU processed payload

這邊要講的是把 gNB 給拆分成 gNB-DU 和 gNB-CU，其中 DU 表示 Distributed Unit，它負責比較低層的 RAN 功能，像是RLC、MAC；CU 則表示 Centralized Unit，他負責比較高層的 RAN 功能，像是 RRC（Radio Resource Control）、PDCP（Packet Data Convergence Protocol）、SDAP（QoS mapping）
- gNB-DU
- gNB-CU

![alt text](images/3gpp/img14.png)


下圖是更細節的說明，但可以發現 QoS Flow → Radio Bearer → NG-U tunnel 的對應關係不因 gNB-DU 在太空而改變。

![alt text](images/3gpp/img15.png)

### User plane
- DU 與 CU 之間的 F1-U 使用 GTP-U/UDP/IP 封裝後經 SRI 傳輸，而 CU 再透過 NG-U 與 UPF 連接。整個使用者平面保持 5G 標準協定，不需修改。
- UPF 不需要知道 DU 在衛星上
- SRI 是衛星與 NTN Gateway 之間的回程鏈路，用於承載 CU/DU split 架構中的 UE 使用者平面資料。
- 在 5G 核心網與 gNB-CU 之間，使用者資料透過標準 NG-U（GTP-U）傳輸。
- 而在 gNB-CU 與部署於衛星上的 gNB-DU 之間，PDCP PDU 會透過 F1-U 封裝成 GTP-U，並經由 NTN Gateway 與 SRI 進行傳輸。

- F1-C（完整）＝ F1-C high layers（在 CU/DU 間封裝的高層訊息） + 低層傳輸協定（SCTP / IP / L1/L2）
  - 高層的 F1-C（F1-AP）會穿過 SRI、NTN Gateway
  - 低層 L1/L2 並不會跨越衛星──它們分別在 CU 和 DU 的本地實作。

![alt text](images/3gpp/img16.png)

### Control plane

![alt text](images/3gpp/img17.png)


### 對於 NG-RAN 的影響
- RRC 與其他第 3 層（Layer 3）的處理功能都終結於地面上的 gNB-CU，因此會受到較嚴格的計時要求（timing constraints）。
- 在 LEO（低軌）系統，甚至在 GEO（地球同步軌道）系統中採用此種架構選項，都可能對現有的 F1 實作產生影響（例如需延長計時器）。此影響在 LEO 中會比 GEO 顯著地小。
- 對控制面而言，除了 F1-AP 需因 SRI 的較長往返延遲（round-trip time）進行適應之外，本架構並不會帶來特別的問題。
- 對使用者平面而言，經由 Xn 的 UP 實例（instance）不受 NTN 的影響；但經由 F1 傳輸（並承載於 SRI 上）的 UP 實例則必須適應 SRI 顯著較高的往返延遲。
- 較長的延遲將使得 gNB-CU 必須為 UP 封包配置更大的緩衝空間（buffering）。

