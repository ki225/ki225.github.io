const n=`---
title: 通訊的 MAC 層
date: 2025-10-26 14:55:08
tags: [wireless, mac]
---

## Medium Access Control(MAC)
MAC 層屬於 第 2 層（Data-Link Layer，資料鏈結層） 的下半層。整體結構如下：

| OSI 層級                            | 名稱                | 功能摘要                         |
| --------------------------------- | ----------------- | ---------------------------- |
| Layer 7                           | Application       | 應用層：提供使用者應用服務（HTTP、FTP、DNS…） |
| Layer 6                           | Presentation      | 呈現層：資料格式轉換、加密、壓縮             |
| Layer 5                           | Session           | 會議層：管理連線、同步會話                |
| Layer 4                           | Transport         | 傳輸層：端到端資料傳送（TCP/UDP）         |
| Layer 3                           | Network           | 網路層：路由與位址分配（IP）              |
| **Layer 2**                       | **Data-Link**     | **負責在同一網段內的資料傳輸**            |
| 　↳ **LLC（Logical Link Control）**  | 與網路層介接，提供錯誤檢測與控制  |                              |
| 　↳ **MAC（Medium Access Control）** | 管理媒體存取、碰撞避免、定址等功能 |                              |
| Layer 1                           | Physical          | 實體層：實際傳輸媒介（電纜、無線電波等）         |

### MAC vs LLC（Logical Link Control）
| 子層                              | 功能                 | 對應標準                                      |
| ------------------------------- | ------------------ | ----------------------------------------- |
| **LLC (Logical Link Control)**  | 管理與上層溝通、提供統一介面     | IEEE 802.2                                |
| **MAC (Medium Access Control)** | 管理媒體存取權、避免碰撞、定址與排程 | IEEE 802.x（如 802.3 Ethernet、802.11 Wi-Fi） |

## 802.11 碰撞議題相關研究 Collision avoidance

無線網路中，多個節點共用相同的傳輸媒介（例如無線頻道），因此需要媒體存取控制（MAC）機制來避免封包同時傳送造成碰撞（Collision）。依據存取方式不同，主要可分為三大類：

### Reservation-based（預約式）
節點事先預留傳輸資源（如時間、頻率或碼）來避免碰撞。

| 技術       | 全名                                 | 核心概念                | |
| -------- | ---------------------------------- | ------------------- |----|
| **TDMA** | Time Division Multiple Access      | 依「時間」分配傳輸時槽         |![alt text](images/wireless/img9.png)|
| **FDMA** | Frequency Division Multiple Access | 依「頻率」劃分頻道           |![alt text](images/wireless/img10.png)|
| **CDMA** | Code Division Multiple Access      | 依「編碼」分配傳輸碼，允許同頻同時傳輸 |![alt text](images/wireless/img11.png)|

#### RB in 5G
在 5G 中，一個 Resource Block (RB) 是最基本的頻時資源分配單位，由 12 個子載波 × 多個 OFDM 符號 組成，每個小格（RE）則對應到一個實際可承載資料的最小訊號單位。

![alt text](images/wireless/img12.png)

#### MIMO（Multiple Input Multiple Output，多輸入多輸出）

MIMO（Multiple Input Multiple Output，多輸入多輸出）是一種屬於 **Reservation-based（預約式）媒體存取技術** 的無線傳輸方式。它在發射端與接收端都配置多根天線，使得系統能在**相同的時間與頻率**條件下同時傳送多個資料流，大幅提升資料速率與頻譜利用率。其核心概念是 **Spatial Multiplexing（空間復用）**：當多根天線發射的訊號在接收端具有足夠不同的空間特徵（spatial signatures），且接收端能精確掌握通道狀態資訊（CSI）時，接收端便能透過空間解碼將多條資料流分離成近似獨立的平行通道。這意味著在相同資源條件下，MIMO 能同時承載更多的訊號傳輸。

與傳統的單天線系統（SISO）相比，MIMO 不需要額外的頻寬或時間資源，就能藉由增加天線數量成倍提升通道容量與傳輸速率。例如在 4×4 MIMO 配置下，最多可同時傳送四條獨立資料流，達到約四倍於 SISO 的頻譜效率。這種技術實質上在「時間」與「頻率」之外新增了「空間」維度，使無線網路能在高訊號雜訊比（SNR）條件下實現更高的通訊容量與效能，成為 4G 與 5G 無線通訊中的關鍵技術之一。

![alt text](images/wireless/img13.png)


### Contention-based（競爭式）
節點即時競爭媒體使用權，無預約，靠隨機機制避免碰撞。
| 技術                | 全名                                       | 特點                      |
| ----------------- | ---------------------------------------- | ----------------------- |
| **ALOHA**         | 無線隨機存取協定                                 | 當想要傳送Data時，就直接往外傳送，在低traffic load 時成功率高，反之碰撞率高              |
| **Slotted ALOHA** | 時槽化 ALOHA                                | 把頻道在時間上分段(slot)，每個傳輸點只能在一個分段(slot)的開始處進行傳送。每次傳送的數據必須少於或者等於一個頻道的一個時間分段(slot)。這樣大大的減少了傳輸頻道的衝突，改善了隨時隨地都有可能封包的缺點。         |
| **CSMA**          | Carrier Sense Multiple Access            | 傳送前先「聽」媒體是否空閒（Wi-Fi 使用） |
| **MACA**          | Multiple Access with Collision Avoidance | 傳送前先「打招呼」，使用 RTS/CTS 封包避免隱藏節點問題   |

![alt text](images/wireless/img14.png)

#### CSMA (Carrier Sense Multiple Access)
1. 1-persistent CSMA
    - 傳送機率固定為 1。
    - 延遲較小，但碰撞機率高（因為多個節點可能同時偵測到媒體空閒而立刻傳送）。
    | 狀況             | 行為                                 |
    | -------------- | ---------------------------------- |
    | **媒體空閒（Idle）** | **立即傳送**（Transmit probability = 1） |
    | **媒體忙碌（Busy）** | **持續監聽**直到媒體變空閒，再立即傳送              |
2. Non-persistent CSMA
    - 傳送延遲較大，但碰撞機率較低。
    - 適合高負載環境，可減少媒體競爭。
    | 狀況             | 行為                            |
    | -------------- | ----------------------------- |
    | **媒體空閒（Idle）** | 立即傳送資料                        |
    | **媒體忙碌（Busy）** | **等待一段隨機時間**（由機率分布決定）後再重新偵測媒體 |
3. p-persistent CSMA
    - 適用於時槽化系統（Slotted channel）。
    - 透過調整 p 值 在「延遲」與「碰撞」間取得平衡。
    | 狀況             | 行為                                     |
    | -------------- | -------------------------------------- |
    | **媒體空閒（Idle）** | 以機率 **p 傳送**、以機率 **(1−p) 延遲一個時槽**（再重試） |
    | **媒體忙碌（Busy）** | 持續監聽直到媒體變空閒                            |


| 類型                 | 傳送條件       | 等待策略             | 碰撞風險 | 特點          |
| ------------------ | ---------- | ---------------- | ---- | ----------- |
| **1-persistent**   | 空閒立即傳      | 忙碌時持續監聽          | 高    | 延遲低但易碰撞     |
| **Non-persistent** | 空閒立即傳      | 忙碌時隨機等待再偵測       | 低    | 延遲較高但穩定     |
| **p-persistent**   | 空閒時以 p 機率傳 | 以 (1−p) 機率延遲一個 slot | 中    | 可動態平衡效率與碰撞率 |


### Hybrid（混合式）
結合預約式與競爭式的優點，平時採競爭式存取，有需要時可保留資源。

| 技術     | 全名                           | 核心概念                          |
| -------- | ------------------------------- | ----------------------------- |
| **DAMA** | Demand Assigned Multiple Access | 節點先提出傳輸請求（Request），由中心分配時槽或頻道 |

![alt text](images/wireless/img15.png)

DAMA 分為兩個階段：
1. Contention-based Phase（競爭階段）
    - 節點使用 Slotted ALOHA 方式在共享通道上發送「傳輸請求」。
    - 因為是競爭式，所以仍有可能發生碰撞。
    - 一旦某節點的請求成功被接收，系統會分配一段保留時槽給它。
    - 🟦 圖中藍色虛線 → 表示「Slotted ALOHA 競爭階段」。
2. Reservation-based Phase（預約階段）
   - 節點獲得通道後，系統將該時槽「保留（reserved）」給它使用。
   - 節點可在後續時間內穩定地傳送資料，不再與其他節點競爭。
   - 🔴 圖中紅色虛線 → 表示「預約使用階段」。

## 802.11 MAC機制
這張圖展示的是 IEEE 802.11 無線區域網路（WLAN） 的整體架構與組成方式，說明了不同層級的無線網路如何相互連接與運作。圖中可以看到，無線網路的基本單位是 BSS（Basic Service Set），每個 BSS 由一個無線存取點（AP, Access Point）與多個無線終端（STA, Station）組成，例如 BSS1 由 AP1 管理、BSS2 由 AP2 管理。當多個 BSS 之間透過 Distribution System（分配系統） 互相連接時，就形成 ESS（Extended Service Set），這讓使用者能在不同 AP 所覆蓋的區域中自由漫遊（roaming），而整個 ESS 對外則透過 Portal 與其他有線網路（如 IEEE 802.3 Ethernet 或 802.16 WiMAX）連接，實現無線與有線網路之間的整合。

此外，圖中右側的 IBSS（Independent Basic Service Set） 代表「自組式網路（Ad-hoc mode）」的情境，這種網路不需要 AP，各個終端裝置（STA）可以直接彼此通信，常用於臨時性或分散式的網路連線。整體而言，802.11 無線網路可由多個基本單元（BSS）組成並透過分配系統擴展成 ESS，同時也支援不依賴基礎設施的 IBSS 模式，形成靈活且層次化的無線網路架構。

而這樣的網路結構能夠順利運作，關鍵在於底層的 MAC（Medium Access Control，媒體存取控制）機制。MAC 層負責管理節點之間如何共用無線媒介、避免訊號碰撞、進行封包轉送與連線管理，確保整個 BSS、ESS、甚至 IBSS 結構之間都能「在共享空氣中有秩序地說話」。

![alt text](images/wireless/img16.png)

### Super Frame
![alt text](images/wireless/img17.png)

這張圖展示了 IEEE 802.11 無線網路中 Super Frame（超框架） 的運作機制，說明了 PCF 與 DCF 如何在時間上交替運作。每個 Super Frame 由 AP 發送的 Beacon 封包 開始，用以同步所有終端（STA）並宣告進入 PCF 期間。在這段期間內，AP 以集中控制的方式進行輪詢（Polling），逐一分配傳輸權給各個 STA，以確保無碰撞、低延遲的資料傳輸。若某些 STA（如圖中的 STA2）未被分配傳輸權，則會設定 NAV（Network Allocation Vector） 進入休眠狀態，避免干擾通道並節省能源。

當 AP 發送 CF_END 封包 時，代表 PCF 期間結束，網路進入 DCF 期間，所有 STA 恢復採用 CSMA/CA（Carrier Sense Multiple Access with Collision Avoidance） 的分散式競爭機制，自由傳輸資料。整體而言，這張圖呈現了 Super Frame 中 集中式（PCF） 與 分散式（DCF） 傳輸模式的交替運作方式，使無線網路能同時兼顧即時性傳輸的穩定與一般資料傳輸的效率。

圖中主要元素說明

| 元件                                 | 說明                                                      |
| ---------------------------------- | ------------------------------------------------------- |
| **AP（Access Point）**               | 無線存取點，負責發送 **Beacon** 封包以同步所有裝置的時間，並在 **PCF 期間** 主導傳輸。  |
| **STA1 / STA2（Stations）**          | 無線終端裝置（使用者端），依據 AP 的排程或媒體狀態參與資料傳輸。                      |
| **Beacon**                         | 由 AP 週期性發送，用來宣告新的 **Super Frame** 開始，並通知進入 PCF 期間。      |
| **CF_END**                         | 表示 **PCF period（無競爭期）** 結束，之後進入 **DCF period（競爭期）**。    |
| **NAV（Network Allocation Vector）** | 一種「虛擬載波感知」計時器，用來表示媒體被占用的時間；當 STA 判斷媒體正在被使用，就會暫停傳輸並進入休眠。 |



### Point Coordination Function (PCF)
IEEE 802.11 的 PCF（Point Coordination Function）輪詢式傳輸以集中控制的方式，依序與多個終端裝置（STA）進行下行與上行資料交換。整個流程由 AP 主導，確保各節點能在無碰撞的情況下完成傳輸。整體流程如下：

* **① PCF Beacon 發送：**
  AP 先送出 **Beacon 封包** 宣告 PCF 週期開始，通知所有 STA 進入無競爭期（CFP）。
* **② 下行傳輸（DL）：**
  AP 向某個 STA（例如 STA1）發送資料封包。
* **③ ACK 回覆：**
  STA1 收到資料後立即回傳 **ACK**，確認封包成功接收。
* **④ 輪詢下一個 STA（Polling）：**
  AP 傳送 **Polling 封包** 給另一個 STA（如 STA2），詢問是否有資料要上傳。
* **⑤ 上行傳輸（UL）：**
  被輪詢的 STA2 立即回傳資料封包給 AP，完成上行傳輸。
* **⑥ AP 回覆 ACK：**
  AP 收到上行資料後發送 **ACK**，確認接收成功。
* **⑦ 重複進行：**
  AP 持續重複 DL、ACK、Polling、UL 的過程，依序與各個 STA 進行通訊，直到 PCF 期間結束。


| 符號                       | 含義                     |
| ------------------------ | ---------------------- |
| **PCF Beacon**           | 由 AP 送出，宣告 PCF 週期開始。   |
| **DL（Downlink）**         | AP 向某個 STA 傳送資料封包。     |
| **UL（Uplink）**           | STA 向 AP 上傳資料封包。       |
| **ACK（Acknowledgement）** | 確認封包成功接收的回覆訊息。         |
| **Polling（輪詢）**          | AP 詢問下一個 STA 是否有資料要上傳。 |


![alt text](images/wireless/img18.png)

#### Piggyback機制
Piggyback 技術的目的，是為了減少原始 PCF 模式中多次獨立封包交換（例如 DL、Polling、ACK）的頻繁往返，藉由「將多個控制訊息合併在同一封包中」來提升傳輸效率、降低延遲。

1. **Beacon 宣告開始：**
   AP 傳送 Beacon，通知所有 STA 進入 PCF 週期（CFP）。
2. **DL1 + Polling1（合併封包）：**
   AP 同時在一個封包內傳送下行資料（DL1）給 STA1，並附帶下一個 STA（STA1）輪詢指令。
   👉 **這就是 Piggyback：把 Polling 訊息「捎帶」在資料封包中。**
3. **STA1 回傳 ACK + UL1：**
   STA1 收到封包後，一併傳回 **ACK（確認）** 與 **上行資料（UL1）**，也是 Piggyback 的應用。
4. **ACK + DL2 + Polling2：**
   AP 收到 STA1 的回覆後，再發送另一個 Piggyback 封包，包含：
   * 對 STA1 的 ACK、
   * 對 STA2 的下行資料（DL2）、
   * 以及 Polling 指令。
5. **STA2 回傳 ACK + UL2：**
   STA2 收到後以相同方式捎帶回覆。
6. **STA2 未回應情況：**
   如果 STA2 超過 **PIFS** 間隔沒有回覆（例如封包遺失或 STA 離開網路），
   AP 就會認定該 STA 不存在，跳過它並繼續下一輪（DL3 + Polling3）。
7. **CF_END：**
   當所有排程完成或時間結束時，AP 傳送 CF_END 封包結束 PCF 週期。

![alt text](images/wireless/img19.png)


### Distributed Coordination Function (DCF)
在 PCF 結束後的 DCF 期間，各個 STA 透過 DIFS 等待時間 + 隨機退避機制 來公平競爭通道傳送資料，而 AP 透過 較短的 PIFS 間隔 保留對通道的優先權，確保能準時發送下一個 Beacon 開啟新的 Super Frame。

1. **CF_END（PCF 結束 → DCF 開始）**
   當 AP 傳送 CF_END 封包後，PCF 模式結束，進入 DCF 模式。
   所有 STA 可以開始依規則競爭通道傳送資料。
2. **DIFS（DCF Interframe Space）固定等待時間**
   每個 STA 在發送前都必須先等待一段固定時間 **DIFS**（紅色虛線區）。
   若在此期間通道保持空閒，才允許進入下一步「退避倒數」。
3. **Random Backoff（隨機退避時間）**
   為了避免多個 STA 同時開始傳送，
   每個 STA 會從一個「隨機時間窗口」中挑選一個倒數計時值（藍色虛線）。
   當倒數歸零時，該 STA 才開始發送資料（Data frame）。
4. **Data 傳輸**
   如圖中所示，STA1 與 STA2 依序完成傳輸。
   若有碰撞或干擾，則會再次進入退避階段重新競爭通道。
5. **Beacon 延遲（Defer Beacon）**
   若下一個 PCF Beacon 的預定時間到了，但通道仍被佔用（例如 STA 正在傳資料），
   AP 會**延遲（Defer）發送 Beacon**，直到通道再次空閒為止。
6. **PIFS（PCF Interframe Space）優先權**
   當 DCF 結束後，AP 會以較短的等待時間 **PIFS（綠色虛線）** 發送下一個 Beacon，
   因為 **PIFS < DIFS**，所以 AP 具有比一般 STA 更高的媒體存取優先權。

![alt text](images/wireless/img20.png)

#### Random Backoff 機制
當多個節點想同時講話（傳送封包）時，為了避免撞在一起（collision），Random Backoff 機制用隨機等待的方式，分散每個節點的傳送時機，降低碰撞機率。他會設定 Backoff Counter（退避計數器），也就是節點會隨機選一個整數作為等待時槽數。下圖是 DIFS + backoff 為例子，station1 想要傳送東西，然後他的 BC 是 5，在等完 DIFS(大家都要等待的時間)後就會開始倒數，倒數到 3 的時候 station3 送東西了，所以停止倒數，過完 DIFS 後繼續倒數，數完就傳送。但可以發現 station1 還是跟 station4 碰撞了，所以這個機制還是有可能產生碰撞。

![alt text](images/wireless/img47.png)

#### IEEE 802.11 無線網路中的優先權機制（Priority Scheme）
在 802.11 中，每個節點在發送封包前，都必須先偵測媒體是否空閒，若空閒，則必須等待一段固定的時間間隔（IFS）後才能開始傳送。而不同的 IFS 對應不同類型的封包，也代表不同的 媒體存取優先權。例如：ACK 或 CTS 這類需要立即回覆的控制訊息會使用最短的 SIFS，確保能最快回應並避免碰撞；AP 在集中控制模式（PCF）下傳送 Beacon 或 Polling 時會使用 PIFS，讓它比一般裝置更快取得通道；一般用戶端在分散式模式（DCF）下傳輸資料封包時，則需等待較長的 DIFS，以實現公平競爭；若發生錯誤封包或干擾，節點必須再等待更長的 EIFS 才能重傳，避免影響其他正在進行的通訊。

| 間隔名稱     | 全名                        | 用途                            | 優先權       | 時間（範例：802.11 DSSS） |
| -------- | ------------------------- | ----------------------------- | --------- | ------------------ |
| **SIFS** | Short Interframe Space    | 立即回覆用（ACK、CTS、Data fragment）  | 🥇 **最高** | 約 **10 μs**        |
| **PIFS** | PCF Interframe Space      | AP 在 PCF 模式下使用（Beacon、Poll 等） | 🥈 **中等** | 約 **30 μs**        |
| **DIFS** | DCF Interframe Space      | 一般資料傳輸（DCF 模式下）               | 🥉 **低**  | 約 **50 μs**        |
| **EIFS** | Extended Interframe Space | 錯誤封包處理後等待時間（避免干擾）             | 🚫 **最低** | **>50 μs**         |


![alt text](images/wireless/img21.png)

### CSMA/CA (載波偵測多重存取/碰撞避免)
在前面有介紹 CSMA 的機制是傳送前先「聽」媒體是否空閒以避免碰撞，而 CA 是碰撞避免機制，透過這兩個方法能確保節點之間能有序傳輸。運作過程中，為了解決 Hidden Terminal Problem，節點不僅聽取頻道（Carrier Sense），還會透過 RTS（Request To Send） 與 CTS（Clear To Send） 封包協調傳輸時機，以避免同時發送造成干擾。

1. **頻道偵測（Carrier Sense）**
   傳送端（Sender）在發送前，先確認頻道是否空閒。若空閒，等待一段 **IFS（Interframe Space）** 後開始發送。
2. **RTS（Request To Send）傳送**
   * Sender 向 Receiver 發送 **RTS 封包**，告知自己希望佔用媒體的時間長度。
   * 任何接收到 RTS 的 Sender Neighbor 會設定一個計時器 **NAV(RTS)**，在這段時間內「鎖住通道」，避免干擾。
3. **CTS（Clear To Send）回覆**
   * Receiver 收到 RTS 後，如果頻道空閒，則回覆一個 **CTS 封包** 給 Sender，表示可以傳送資料。
   * 接收到 CTS 的 Receiver Neighbor 同樣會設定 **NAV(CTS)**，進入靜默狀態，暫時停止傳輸。
4. **資料傳輸（DATA）**
   * 在 CTS 回覆後，Sender 開始傳送資料封包（Data）。
   * 由於周圍的節點都被 NAV 鎖住，因此此時通道專屬給這對通信端使用。
5. **ACK（Acknowledgement）確認**
   * Receiver 收到資料後回傳 **ACK**，確認資料正確接收。
   * 所有鄰近節點在 NAV 時間結束後，才重新參與通道競爭。

![alt text](images/wireless/img22.png)

### Hidden terminal problem
以下圖為例，A 送封包給 B 的時候，因為 C 不在通訊範圍內，所以 C 也同時給 B，這時 B 收到兩個同時來的封包而無法分辨，最後 crash。這裡的 Hidden 是因為 sender 彼此看不見，但在 receiver 範圍內而造成的破壞。

![alt text](images/wireless/img23.png)

### Exposed terminal problem
Exposed Terminal Problem 是指節點「能聽到其他傳輸但實際上不會互相干擾」，造成它誤以為頻道忙碌而停止傳輸，降低整體通道利用率。以下圖為例，雖然 C 理論上可以傳資料給 D（不會造成碰撞），但它卻被 CSMA/CA 機制「誤判為忙碌」而被迫等待，造成通道利用率降低。解法是使用 RTS/CTS 機制 讓節點能更精確判斷真正的干擾關係。

![alt text](images/wireless/img24.png)

## 802.11 節能、省電議題相關研究
### 電源管理模式總覽
| 模式                         | 說明                                              |
| -------------------------- | ----------------------------------------------- |
| **Active Mode (AM)**       | 裝置持續保持喚醒狀態，可即時收發資料。                             |
| **Power Saving Mode (PS)** | 裝置進入省電模式，週期性喚醒接收控制訊息（如 Beacon），其餘時間關閉無線模組以節省能量。 |

### 省電模式下的行為

| 類型                      | 有無 AP  | 模式名稱            | 特性                                      |
| ----------------------- | ------ | --------------- | --------------------------------------- |
| **Infrastructure Mode** | ✅ 有 AP | 省電模式 with AP    | STA 透過 Beacon 的 TIM/DTIM 機制由 AP 管理資料接收。 |
| **Ad-hoc Mode**         | ❌ 無 AP | 省電模式 without AP | 節點彼此協調，使用 ATIM 機制通告有資料待收。               |

### TIM(Traffic Indication Map)
TIM（Traffic Indication Map） 是實現省電機制的關鍵資訊元素，用來通知進入 Power Saving 模式 的終端裝置（STA）是否有資料被暫存在基地台（AP）端的緩衝區中。

| 類型                      | 適用模式           | 用途                                          | 備註                                      |
| ----------------------- | -------------- | ------------------------------------------- | --------------------------------------- |
| **TIM**                 | Infrastructure | 通知 STA 有暫存的 **Unicast 封包**。                 | 隨 Beacon 傳送。                            |
| **DTIM (Delivery TIM)** | Infrastructure | 通知所有 STA 有暫存的 **Broadcast / Multicast 封包**。 | 所有 STA 會在 DTIM Beacon 時醒來接收。            |
| **ATIM (Ad hoc TIM)**   | Ad-hoc         | 通知節點有資料待收。                                  | 在 ATIM window 中以 Unicast ATIM frame 傳送。 |

#### Infrastructure mode 的省電模式

在 Infrastructure 模式下，AP 是網路的核心控制者。當一個 STA 進入省電模式時，它會在控制訊框（Management Frame）中，將 Power Management 欄位設為 1，通知 AP「我要休眠」。此後，AP 會暫存（buffer）該 STA 的所有資料封包，直到 STA 再次醒來接收。STA 會定期醒來接收 Beacon，並透過其中的 TIM/DTIM 來判斷是否有資料等待傳送。


1. TIM：針對個別 STA 的暫存資料（Unicast）
    - 當 Beacon 中的 TIM 指示該 STA 有暫存資料（Buffered = 1）時，STA 會依據所採用的 媒體存取控制（MAC）模式決定動作：
    - a. PCF（Point Coordination Function）模式 — 集中輪詢
      - STA 不需主動要求資料，僅需等待 AP 在輪詢（Polling）過程中主動傳送。
      - 此模式屬於「集中式」控制，AP 會決定哪個 STA 能在該時段傳輸。
      - （保留式傳輸：由 AP 決定誰可溝通）
    - b. DCF（Distributed Coordination Function）模式 — 分散競爭
      - STA 必須主動向 AP 請求資料，步驟如下：
        1. STA 傳送 PS-Poll frame 給 AP。
        2. AP 收到 PS-Poll 後，立即傳送暫存的資料給該 STA。
      - 此模式屬於「競爭式」存取，AP 無法干預，STA 必須透過 CSMA/CA 競爭通道才能成功請求資料。
      - 延伸閱讀：https://note-on-clouds.blogspot.com/2019/02/wifi-power-saving-mode.html  
        ![alt text](images/wireless/img26.png)
2. DTIM：針對廣播或群播資料（Broadcast / Multicast）
    - 若 DTIM（Delivery TIM）顯示 Buffered = 1，代表 AP 有群播或廣播封包要送出。
    - 所有 STA 都會在這個 Beacon 週期醒來，等待 AP 傳送這些暫存的 Broadcast/Multicast 封包，接收完成後再回到省電狀態。

#### Ad-hoc mode的省電模式
在 Ad-hoc 模式中，沒有 AP 來幫忙儲存或通知資料，所以各節點（STA）必須自行協調資料傳遞與喚醒時間，因此 IEEE 802.11 設計了一個稱為 ATIM Window 的時段，讓所有節點在該時段內保持喚醒狀態並交換控制訊息。整個流程以 **Beacon interval（信標間隔）** 為一個週期單位，週期內又分為：

1. **TBTT (Target Beacon Transmission Time) window**
   → 節點定時傳送 Beacon，讓網路保持同步。
2. **ATIM window**
   → 所有節點都會醒來，在此期間交換 ATIM 控制訊息，通知誰有資料要傳。
3. **Data Transmission period**
   → 只有收到 ATIM 的節點保持喚醒進行資料交換；其他節點回到休眠狀態節省電力。

這裡比較特別的是，任何節點只要發現沒有其他裝置通知周期開始了，就可以自行發送 beacon 來通知其他裝置周期開始了。所以沒有 AP 這個角色。

![alt text](images/wireless/img25.png)


## 802.15.4 MAC
802.11 是針對 Wi-Fi、藍芽，而 802.15.4 更針對 IOT 設備。ZigBee 是一種基於 IEEE 802.15.4 標準的低功耗、低速率無線個人區域網路（WPAN, Wireless Personal Area Network） 技術，常用於 IoT（例如智慧家庭、感測器網路、工業監控）。

| 層級                      | 名稱      | 標準 / 定義者        | 功能說明                                                                                |
| ----------------------- | ------- | --------------- | ----------------------------------------------------------------------------------- |
| **ZigBee Applications** | 應用層     | ZigBee Alliance | 定義應用邏輯與通訊介面，例如智慧燈泡控制、溫濕度感測等應用。包含 Application Framework、ZCL（ZigBee Cluster Library）。 |
| **ZigBee Network**      | 網路層     | ZigBee Alliance | 定義節點如何組成網路、尋址與路由。例如 Mesh Routing、協調者（Coordinator）、路由器（Router）與終端裝置（End Device）的角色。  |
| **IEEE 802.15.4 MAC**   | 媒體存取控制層 | IEEE            | 管理無線傳輸的存取方式，例如 CSMA/CA（避免碰撞）、封包確認、節能模式。負責資料幀的傳送與接收。                                 |
| **IEEE 802.15.4 PHY**   | 實體層     | IEEE            | 定義無線電訊號的物理特性，如頻率（2.4GHz / 868MHz / 915MHz）、調變方式（O-QPSK / BPSK）與資料速率（250 kbps）。      |

### Device Types — FFD vs RFD
| 分類        | 全功能裝置（FFD, Full Function Device）                  | 簡化裝置（RFD, Reduced Function Device） |
| --------- | ------------------------------------------------- | ---------------------------------- |
| **網路角色**  | 可擔任協調者（Coordinator）、路由器（Router）、或終端裝置（End Device） | 僅可作為終端裝置（End Device）               |
| **支援拓樸**  | 支援 **任何拓樸**（Star、Peer-to-Peer、Mesh）               | 僅支援 **Star 拓樸**                    |
| **通訊對象**  | 可與 **任何裝置**（FFD 或 RFD）通訊                          | 僅能與 **FFD** 通訊                     |
| **功能複雜度** | 完整協定實作，功能強大                                       | 實作簡單，功耗低                           |
| **典型用途**  | ZigBee 協調者（Coordinator）、路由節點                      | 感測節點（例如溫度感測器）                      |

### Network topology
| 拓樸類型    | 結構圖示                       | 特性說明      | 圖片 |
| ----------------------------------------------- | -------------------------- | ---------------------------------------------------------------------- |------|
| **⭐ Star Topology**（星狀拓樸）                       | Coordinator 為中心，RFDs 連接於其上 | - 中心節點（Coordinator）負責所有通訊<br>- 適合簡單應用，如家庭感測網路<br>- 所有 RFD 只能與中心 FFD 通訊 |![alt text](images/wireless/img27.png) |
| **🔗 Peer-to-Peer (Mesh) Topology**（點對點 / 網狀拓樸） | 各 FFD 節點可直接連接彼此            | - 無中心節點，可多點連線<br>- 支援多跳傳輸，具高延展性與容錯性<br>- 常用於工業監控或智慧城市                  | ![alt text](images/wireless/img28.png) |
| **🌐 Combined Topology**（混合拓樸）                  | 星狀與網狀的結合                   | - 常見於大型 ZigBee 網路<br>- 主幹為 Mesh 結構，末端連接 Star 型感測節點<br>- 兼具穩定性與節能特性     | ![alt text](images/wireless/img29.png) |


一個 Star Topology 的 ZigBee 網路，本質上就是一個 PAN（個人區域網路）
![alt text](images/wireless/img27.png)

### slotted & unslotted CSMA/CA 的 channel access 機制
IEEE 802.15.4 同時支援兩種網路運作模式，一個是有 slot（時槽）概念，一個是沒有，但 IEEE 802.11（Wi-Fi）則沒有。對於 unslotted CSMA/CA 的 channel access 機制，其實就是指說每個人都有自己的時間系統，只是說沒有對齊彼此的時間就會很麻煩；而 slotted CSMA/CA 的 channel access 機制就是彼此的 slot 起點有對齊。


| 類型                     | 是否有 Beacon       | 通道存取機制                | 特點                               |
| ---------------------- | ---------------- | --------------------- | -------------------------------- |
| **Non Beacon-enabled** | ❌ 無 Beacon Frame | **Unslotted CSMA/CA** | 無時間同步機制，裝置隨時可競爭通道                |
| **Beacon-enabled**     | ✅ 有 Beacon Frame | **Slotted CSMA/CA**   | 以 Beacon 為時間基準，同步所有裝置的傳輸時槽（slot） |


其實 802.15.4 的重點就是**有時間就去睡覺(inactive portion)**跟**有 beacon 就畫 slot**，而 802.15.4 的 Beacon 模式，就是使用 Beacon 定時間、有 slot 來排隊、有空就省電睡覺。

![alt text](images/wireless/img30.png)

在 IEEE 802.15.4 的 Beacon-enabled 網路中，整個時間被切成一個又一個的 Beacon interval，每個 interval 開始時會發送 Beacon frame，所有裝置都依這個 Beacon 同步時間，並把接下來的傳輸區段切成許多 slot（時槽）——這就是「有 beacon 就畫 slot」的意思。Beacon interval 又分成兩個主要部分：
1. Active portion：可以傳資料的階段
    - CAP（Contention Access Period）：使用 Slotted CSMA/CA，節點競爭通道傳輸。
    - CFP（Contention-Free Period）：分配給特定節點的 GTS（Guaranteed Time Slot），不需競爭即可傳輸。
2. Inactive portion：所有裝置可進入睡眠以節省能量，這就是「有時間就去睡覺」。

> 但這裡就出現了一個問題，如果送封包後對方在 inactive portion，就會造成緊急問題沒辦法好好解決。

#### Slotted CSMA/CA Algorithm IFS(interframe space)
IFS（Interframe Space）是兩個資料幀（frame）之間必須保留的時間間隔，用來區分不同 frame 的傳輸（避免碰撞）、給接收端足夠的時間處理上一個 frame、幫助控制不同長度的資料幀之間的優先權。IFS 的兩種類型：

| 類型       | 全名                     | 用途                             | 長度 |
| -------- | ---------------------- | ------------------------------ | -- |
| **SIFS** | Short Interframe Space | 用於**短 frame**或需立即回覆的情境（例如 ACK） | 短  |
| **LIFS** | Long Interframe Space  | 用於**長 frame**之後的等待間隔           | 長  |


| 傳輸類型      | 範例                                  | 時間序列　time sequence |
| --------- | ----------------------------------- | ---- |
| **有 ACK** | Data → t_ack → ACK → IFS（LIFS/SIFS） | ✅    |
| **無 ACK** | Data → IFS（LIFS/SIFS）               | ❌    |

#### Slotted CSMA/CA — Backoff 機制
1. **初始化參數**
   * \`NB = 0\`
   * \`CW = 2\`
   * \`BE = macMinBE\`（一般為 3）
2. **等待一段隨機 backoff 時間**
   * 延遲 \`random(0, 2^BE - 1)\` 個 backoff period（slot 為單位）
   * 這樣每個節點等待時間都不一樣，減少碰撞。
3. **執行第一次 CCA (Clear Channel Assessment)**
   * 在 slot 邊界偵測通道是否空閒（Channel idle?）
   * 若通道忙碌：
     * \`NB = NB + 1\`
     * \`BE = min(BE + 1, macMaxBE)\`
     * 若 \`NB > macMaxCSMABackoffs\` → **宣告失敗 (Failure)**
     * 否則回到第 2 步重新 backoff。
4. **若通道空閒 (Y)**
   * \`CW = CW - 1\`
   * 若 \`CW > 0\` → 再進行一次 CCA（需連續兩次空閒才能傳）。
5. **若 \`CW = 0\` → 成功傳送 (Success)**
   * 節點開始傳資料（Frame Transmission）。

![alt text](images/wireless/img31.png)

### Data Transfer Model
#### Beacon-enabled Network
- 資料由 Coordinator（協調者） 傳送至 Device（裝置）。
- 在 Beacon-enabled 網路 中，協調者會在 Beacon frame 中標示「有資料待傳 (data pending)」。
- 裝置會週期性地喚醒並接收 Beacon，若發現有資料待接收，則使用 Slotted CSMA/CA 傳送一個 MAC command request（資料請求） 給協調者。
> 協調者在 Beacon 裡說「我有資料」，裝置再用 Slotted CSMA/CA 來請求。

![alt text](images/wireless/img32.png)

#### Non Beacon-enabled Network
- 資料同樣由 Coordinator 傳送至 Device。
- 在 Non Beacon-enabled 網路 中，因為沒有 Beacon frame，裝置會主動使用 Unslotted CSMA/CA 傳送 MAC command request（資料請求）。
- 若協調者有資料待傳，則使用 Unslotted CSMA/CA 將 Data frame 傳送給裝置。
> 沒有 Beacon，裝置自己主動問「你有我的資料嗎？」再用 Unslotted CSMA/CA 收資料。

![alt text](images/wireless/img33.png)

## 802.15.4 適用於感測網路的特性
IEEE 802.15.4 的 MAC 設計重點在「低功耗與高可靠性」，適合感測器與 IoT 裝置長時間運作。相比之下，Wi-Fi (802.11b) 追求的是「速度與彈性」，但耗能高、壽命短。

一個設計良好的 MAC（Medium Access Control）協定，應具備 **節能、高擴充性與適應性** 等特性。由於無線感測網路的節點多半受限於電池供電，因此 **能量效率（Energy efficiency）** 是最核心的設計目標；MAC 機制必須盡量減少碰撞、閒置聆聽、與控制封包開銷，以降低耗電。同時，網路在節點數量增加或拓撲變化時，也應能 **自我調整與擴展（Scalability & Adaptability）**，維持穩定通訊效能。至於 **延遲、吞吐量與頻寬利用率** 則屬於次要考量，通常在確保低功耗與可靠傳輸的前提下，再追求傳輸效能的最佳化。


### 感測網路中能量浪費的原因
| 原因                                  | 說明                               |
| ----------------------------------- | -------------------------------- |
| **Collision（碰撞）**                   | 多個節點同時傳輸導致資料衝突，需要重傳。             |
| **Overhearing（過度聆聽）**               | 節點無意中接收到與自己無關的封包。                |
| **Control-packet overhead（控制封包開銷）** | 控制訊息過多造成額外能量消耗。                  |
| **Overemitting（過度發射）**              | 傳輸功率超過實際所需距離或法規限制。               |
| **Idle listening（閒置聆聽） → 主要問題！**    | 節點在沒有資料傳輸時仍保持接收狀態，是**最主要的耗電來源**。 |

### 802.15.4 適用於 IoT 的特性比較
| 項目            | **IEEE 802.15.4 (WPAN)**     | **IEEE 802.11b (WLAN)**        |
| ------------- | ---------------------------- | ------------------------------ |
| **應用焦點**      | 監測與控制 (Monitoring & Control) | 網頁、電子郵件、影片 (Web, Email, Video) |
| **電池壽命（天）**   | 100 – 1000+                  | 0.5 – 5                        |
| **網路規模**      | 幾乎無限制（26+ 節點以上）              | 約 32 節點                        |
| **頻寬 (Kb/s)** | 20 – 250                     | 11,000+                        |
| **成功指標**      | **可靠性、低功耗**                  | **速度、靈活性**                     |


## MAC protocols for WSN

無線感測網路（Wireless Sensor Network, WSN）是一種由大量低功耗、具感測與無線通訊能力的節點所組成的分散式網路。這些節點可部署於各種環境中，用來監測溫度、濕度、壓力、光線或其他物理現象，並將資料透過無線方式傳送至匯聚節點（Sink）或基地台。由於 WSN 節點多半依賴電池供電且布建環境可能難以維護，節能設計與有效的媒體存取控制（MAC）協定便成為確保網路長期穩定運作的關鍵。

### S-MAC
每個 cluster 都有自己的 週期性排程（Listen + Sleep），所以整個網路不需要全域時間同步，只需區域內同步即可，已下圖為例分為兩個 cluster，Cluster 1（紅色區域）節點 A、C 彼此同步即可。

![alt text](images/wireless/img34.png)

#### periodic sleep–listen schedules
而為了降低節點能量消耗，特別是減少 idle listening（閒置聆聽），它透過週期性的睡眠與喚醒機制 (sleep/listen scheduling) 來節能。整個週期分成兩個主要階段：
1. Listen period（監聽期）
    - 所有節點都會醒來，用來執行時間同步與控制封包交換 (RTS/CTS)。
    - Listen period 的兩個子階段
        | 子階段                            | 名稱   | 說明                                                                | 圖中表示                      |
        | ------------------------------ | ---- | ----------------------------------------------------------------- | ------------------------- |
        | **(1) Synchronization period** | 同步階段 | 節點彼此交換 **SYNC 封包**，確保同一群（cluster）內時間一致。                           | 藍色箭頭區段（TX sync / RX sync） |
        | **(2) Control period**         | 控制階段 | 執行 **RTS/CTS (Request to Send / Clear to Send)** 交握，確定誰要傳資料、誰要接收。 | 紅色箭頭區段（RTS / CTS 封包）      |
2. Sleep / Sending data period（休眠或資料傳送期）
    - 節點若沒有通訊任務，會進入睡眠狀態；若有資料要傳輸，則利用此時段進行實際的資料傳送。

####  Communication
節點會採用自適應式聆聽（Adaptive Listening）的機制應對，節點若「聽到」鄰居正在通訊（理想情況下只需聽到 RTS 或 CTS 封包），會在該次傳輸結束後短暫地喚醒自己。若該節點正好是  next-hop node(下一個要接收資料的對象)，則會保持醒著，準備接收並轉發鄰居的訊息。若在這段 Adaptive Listening 期間沒有收到任何資料，則會再次進入睡眠狀態以節省能量。

1. synchronization period
    - CS (Carrier Sensing)：
      - 傳送端先偵測通道是否空閒（避免碰撞）。
    - TX Sync：
      - 傳送端在同步期傳送同步封包，讓鄰居節點維持相同時鐘。
      - (在S-MAC 裡沒有人扮演 AP 的角色，任何裝置都可以自發性告訴週期開始；這裡不是發 beacon 而是發 TX Sync，但意義相同)
2. control period
    - RTS/CTS 控制交握：
      - 傳送端（sender）發送 RTS (Request to Send)。
      - 接收端（receiver）回覆 CTS (Clear to Send)。
      - 這樣附近節點就知道不要干擾，避免碰撞。
3. sending data/sleep period：
    - 要溝通的結點就會在 sleep period 醒著
    - 資料傳輸階段（TX/RX Data）：
      - 雙方進入資料傳送階段（TX Data、RX Data）。
      - 傳完後，雙方再進入 Sleep period 節省能量。

![alt text](images/wireless/img35.png)

#### Re-transmit message problem - Message Passing 機制
在無線感測網路中，若資料訊息（message）太長或太短都會造成效率問題，當訊息太長，若傳輸過程中發生錯誤，需要重傳整個長封包，導致時間與能量浪費；若訊息太短，每次傳送都要執行 RTS/CTS 控制封包交換，導致控制開銷（control overhead）過大。

為了解決這個問題，S-MAC 使用 Message Passing 機制，將長訊息分段成多個小封包連續傳送，這樣就可以實現
- 傳送端只需在開始前執行一次 RTS/CTS。
- 接收端每收到一段就立即回 ACK。
- 若中間某段出錯，只需重傳該段，不需重傳整筆資料。
- 可同時減少 競爭延遲（contention latency） 與 控制開銷（RTS/CTS overhead）。

![alt text](images/wireless/img36.png)


### B-MAC
S-MAC 因為 idle listening 機制，一直聽但沒事做，導致很浪費電。B-MAC 因為減少 idle listening，所以比 S-MAC 更省資源。在 B-MAC 機制裡，每個設備都有自己的時間安排，也就是他們的時間事沒有對齊的，導致 sender 不知道 receiver 確切醒來的時間(而且 receiver 設備會醒來的時間超短)，這導致 sender 要付出大的代價，也就是 preamble 要超過 receiver 休息的時間。


> 老師當時做了一個很有趣的比喻，說已知學姐讀書一小時後會休息五分鐘(listen)，追求學姊的學長不知道學姐甚麼時候會開始讀書，但知道學姊一次讀一小時，所以只要自己在學姊的宿舍樓下彈超過一小時的吉他(preamble)，一定會有一小段吉他聲可以被學姊聽到(by 老師大學時間的故事改編)

- CCA 去聽 channel 是否擁擠，避免擠掉別人
![alt text](images/wireless/img37.png)


| 類別       | 說明                                                           |
| -------- | ------------------------------------------------------------ |
| ✅ **優點** | - 不需時間同步（asynchronous）<br> - 不需 RTS/CTS 控制封包<br> - 結構簡單、介面乾淨 |
| ❌ **缺點** | - **傳輸延遲長**（因長 preamble）<br> - 當網路流量大時，**效能下降**（容易碰撞、干擾）     |

> 當 preamble 短的話，反而要更頻繁的 wake up


### D-MAC
之前的 S-mAC 有 DFI(The data forwarding interruption problem) 的問題，只有接收端的 next hop of receiver 能聽到（overhear）資料傳輸的過程，而其他聽不到此傳輸的節點（超出通訊範圍者）會在該輪通訊期間維持睡眠狀態，直到下一個週期（cycle/interval）才會醒來。這個 sleeping period 就會導致傳輸中斷，在 MAC 層看似只有卡一下子(MAC層只在乎下一步的通訊是否成功)，但放大格局來看會造成整個網路傳輸很嚴重的延遲。


![alt text](images/wireless/img38.png)


- 透過資料收集樹（data gathering tree），將 IoT 感測節點的資料逐步傳送至 匯聚節點（sink）。
- 多跳路徑上的節點會依序喚醒（sequentially wake up），如同**連鎖反應（chain reaction）**般地將資料一路轉送至匯聚端。
    1. 最底層的節點（感測端）在其醒著的時段進行資料感測，並執行 TX（傳送）。倒數第二層節點在稍後的時刻醒來（RX），剛好接收到資料。
    2. 最底層送完就進入休息模式。此時倒數第二層成為 sender、倒數第三層成為 receiver
    3. 如此依序傳遞資料往上層傳送。

![alt text](images/wireless/img39.png)

節點根據樹的深度錯開睡眠時間，讓資料沿著多跳路徑像接力棒一樣快速傳到 Sink，既節能又減少延遲，確保資料可以一路順暢往上傳而不被中斷，但代價是需要精確的時間同步。

![alt text](images/wireless/img40.png)


#### 優缺點
- 優點
  - 與其他睡眠／喚醒週期分配方法相比，DMAC 能夠達到**非常低的延遲（latency）**，因為節點會依序醒來進行資料轉送，讓多跳傳輸更快速。
- 缺點
  - DMAC **未使用碰撞避免機制（collision avoidance）**。因此，若有多個擁有相同排程（schedule）的節點同時嘗試向同一個節點傳送資料，就可能發生**資料碰撞（collision）**的情況。

### 整理

| 協定名稱      | 是否需時間同步 | 傳輸機制類型                       | 是否能適應網路變化   | 主要特性摘要                                   |
| --------- | ------- | ---------------------------- | ----------- | ---------------------------------------- |
| **S-MAC** | ❌ 不需要   | **CSMA/CA**                  | ✅ 良好 (Good) | 採週期性睡眠以節能，具區域同步；簡單但可能產生轉送中斷問題。           |
| **B-MAC** | ❌ 不需要   | **CSMA**                     | ✅ 良好 (Good) | 採低功耗監聽 (LPL)，以長前導喚醒接收端；結構簡單、無需同步，但延遲較高。  |
| **DMAC**  | ✅ 需要    | **TDMA / 改良型 Slotted ALOHA** | ⚠️ 弱 (Weak) | 需時間同步，節點依樹狀結構深度依序喚醒；能快速傳送資料至 Sink，但彈性較低。 |
`;export{n as default};
