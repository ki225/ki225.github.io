const n=`---
title: 3GPP - Multi connectivity involving NTN-based NG-RAN
date: 2025-11-18 21:07:59
tags: [3gpp]
---
## Multi connectivity involving NTN-based NG-RAN

### Multi connectivity
Multi connectivity 是指 UE 連接多種通訊協定，例如說現在的手機可以支援藍芽、WiFi、4G 和 5G 等等。在剛剛的介紹裡可以發現當通訊的工作搬移到太空後，勢必會有時間延遲的問題。因此，有的人就想到可以使用 Multi-Connectivity 來解決「不穩定、不均勻、不足」的無線連線品質。


![alt text](images/3gpp/img18.png)

- 根據 TS 22.261 所描述的多種服務情境（如住宅區、車輛、高速鐵路、飛機上等使用者），結合地面與非地面接取可在資料速率與可靠度方面達成目標的服務效能。
- 在服務不足地區，地面網路（例如 LTE）在小區邊緣的頻寬可能受限；若加入 NTN 型 NG-RAN，可協助達成預期的使用者體驗資料速率。
- 在某些情境，例如高速鐵路沿線的服務區域可能不均勻，引入 NTN 多重連線可提供目標等級的可靠度。
- 多重連線可以發生在：
  - 上行（UL）
  - 下行（DL）
  - 或上下行同時

### Multi connectivity - Transparent NTN + 地面基地台

以下圖為例子，一個使用者設備（UE）同時透過 透明式（transparent）NTN 型 NG-RAN 與 地面蜂巢式（cellular）NG-RAN 連接至 5G 核心網（5GCN），形成 Dual Connectivity。兩個 gNB 之間用 Xn 互連，以實現
- 讓兩個 gNB 分享 UE 的狀態、buffer、PDCP split
- 協調 UL/DL 哪些流量走衛星，哪些走地面
- 避免 handover、切換中斷

但若要形成這個情境，和衛星連接的 NTN Gateway 需要位於該地面行動網路（PLMN） 的覆蓋區域內

![alt text](images/3gpp/img19.png)

如圖所示，兩條路徑最後都進到 NG 介面（NG-C / NG-U）、5GC（AMF、UPF）與 Data Network（DN，例如 Internet），但究竟是如何把 QoS flows 透過不同 Bearer 分別送到兩個 gNB？

#### 如何把 QoS flows 透過不同 Bearer 分別送到兩個 gNB？

我們就可以從下圖看到 UE 裡面有三條不同的資料通道：MCG、SCG、Split。


![alt text](images/3gpp/img20.png)

| **項目**          | **MCG Bearer**           | **SCG Bearer**              | **Split Bearer**                   |
| --------------- | ------------------------ | --------------------------- | ---------------------------------- |
| **全名**          | Master Cell Group Bearer | Secondary Cell Group Bearer | Split Bearer                       |
| **走哪個節點？**      | 主 gNB（MN）                | 副 gNB（SN）                   | **MN + SN 同時**                     |
| **典型網路類型**      | 地面基站（Terrestrial）        | 衛星 NTN（LEO / GEO）或另一地面 gNB  | 地面 + 衛星／雙 gNB                      |
| **PDCP 處理位置**   | MN                       | SN                          | **MN（PDCP負責分流）**                   |
| **RLC / MAC 層** | MN RLC / MN MAC          | SN RLC / SN MAC             | 同時 MN RLC + SN RLC；MN MAC + SN MAC |
| **用途 / 流量特性**   | 低延遲、控制流量、可靠性要求高          | 高吞吐量、不敏感延遲的大流量              | **需要聚合頻寬的流量**（吞吐最大化）               |
| **是否支援負載分散？**   | 否                        | 否                           | **是（PDCP 分拆 UL / DL）**             |
| **是否支援路徑備援？**   | 部分                       | 部分                          | **完整備援（兩路同時存在）**                   |
| **適用場景**        | 地面訊號優、延遲敏感，重要的資訊               | 偏遠地區、衛星覆蓋、地網弱，用於影音串流這種需要大頻寬但不用可靠性的               | **地面 + 衛星協同最佳化**，用於分流                   |
| **使用 NTN 的情況**  | 不常用（延遲大）                 | 常用（衛星單一路徑）                  | **最常用於 NTN Multi-Connectivity**    |

### Multi connectivity - 兩個 Transparent NTN 

剛剛介紹完「衛星」與「地面基地台」的情形，接著要介紹兩個透明式（Transparent）NTN 型 NG-RAN 進行組合的情境。以下情境是 UE 同時透過兩個不同的透明 NTN（兩顆衛星 / 兩個衛星系統）連線到兩個 gNB，並在核心網路端彙整，這種架構特別適合在完全沒有地面網路覆蓋（unserved areas）的情況下，為 UE 提供服務。

在這個情境下這兩者可以是兩個 GEO（地球同步軌道）系統，或兩個 LEO（低軌道衛星）系統，或一個 GEO + 一個 LEO 的組合，這樣的組合特別適用於無地面基礎建設的地區（unserved areas），用來為 UE 提供服務。
- LEO NTN 型 NG-RAN 具有較低的延遲，可用來承載延遲敏感的流量。
- GEO NTN 型 NG-RAN 則提供較大的頻寬，可幫助達成目標的資料吞吐量需求。

不過目前的手機難以接收 GEO 和 LEO 的訊號，所以目前只有 SOS 緊急功能

![alt text](images/3gpp/img21.png)

### Multi connectivity - Regenerative NTN + 地面基站
再生式 NTN 型 NG-RAN（衛星上搭載 gNB-DU）與地面型 NG-RAN 進行組合的多重連線架構也是值得考慮的情境，此組合特別適用於地面網路覆蓋不足（underserved areas）的區域，以提供 UE 更佳的服務。

![alt text](images/3gpp/img22.png)

### Multi connectivity - 兩個 Regenerative NTN 

將兩個再生式（regenerative）NTN 型 NG-RAN（衛星上搭載 gNB）進行組合 ── 不論是兩個 GEO、兩個 LEO，或是 GEO 與 LEO 的混合 ── 並在衛星間具備星間鏈路（Inter Satellite Links, ISL），也是值得考慮的架構，用於為**無地面覆蓋（unserved areas）**的 UE 提供服務。然而 Regenerative NTN 型 NG-RAN（衛星搭載 gNB）與地面型 NG-RAN（NR 或 LTE）之間的多重連線在此並未納入規範，因為 Xn 協定在「上行回傳鏈路（Feeder link）／衛星無線介面」上傳輸的可行性仍屬於 FFS（For Further Study）。

![alt text](images/3gpp/img23.png)

### NG-RAN 影響
前面的章節介紹了不同的多種連結架構，而不同的架構會帶來不同的影響，像是控制面（CP）和使用者面（UP）在不同位置終止，就會對延遲與 buffer 需求造成差異。

這邊要總結 NTN + 地面基地台的 Dual Connectivity（DC）會遇到什麼事
- Transparent NTN：衛星只是 relay → CP/UP 都終止在地面
  - DC 需要的 Xn、NG、F1… 通通在地面跑，不需要上衛星 → 問題最少
  - 但仍然有長延遲（衛星 → 地面）需要增加 buffer。
- Regenerative NTN
  - 控制面 CP 在地面終止 → 要求 F1AP 必須能忍受衛星巨大的 RTT（幾百 ms）
  - 使用者面 UP
    - Xn leg（地面 eNB/gNB ↔ 地面 gNB-CU）→ 不受衛星影響，延遲正常。
    - F1 leg（DU 在衛星 ↔ CU 在地面）→ 延遲巨大（SRI往返延遲）`;export{n as default};
