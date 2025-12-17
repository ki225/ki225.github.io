---
title: 3GPP - 非地面網路 NTN
date: 2025-11-15 14:49:19
tags: [3gpp, ntn]
---

這篇筆記是講解 3GPP 文件的第四章 "Non-Terrestrial Networks overview and scenarios"，非地面網路（NTN） 指的是利用天基或空基平台（如衛星、無人機、高空平台等）提供行動或寬頻通信服務的網路架構，藉由 NTN 與地面行動網路（Terrestrial Networks, TN）共同構成 5G 與未來 6G 的整體通信生態系，以擴大行動網路涵蓋範圍，讓網路能夠在任何位置、任何時間提供連接能力。


## 非地面網路（Non-Terrestrial Networks, NTN）
非地面網路（NTN）是 5G 與未來 6G 架構中的重要組成，主要透過部署於空中或太空的通訊平台（如衛星、UAS 無人機、HAPS 高空平台等）來提供廣域、跨國甚至全球的行動通訊服務。NTN 的基本組成可分為下列三類：

- sat-gateway（衛星閘道）
  - 負責將 NTN 與地面的公共資料網路（如 Internet、5GC）連接
  - 與衛星或 UAS 之間以 feeder link（回傳鏈路） 通訊
- 衛星 / UAS（空中通訊平台）
  - 承載 RF 處理設備，用以連接地面與空中的使用者
  - 可搭載「透明載荷」或「再生載荷」
  - 也可能透過 ISL（Inter-Satellite Link）星間鏈路 與其他衛星進行溝通
- UE（使用者設備）
  - 位於衛星或 UAS 的 beam 覆蓋範圍內
  - 透過 service link（服務鏈路） 與空中平台連線

### 單一空中平台產生的問題：覆蓋範圍與 gateway 稀少
在下圖可以看到衛星和無人機等空中通訊設備會透過 service link & feeder link 的方式和地面進行通訊，在此簡化情境中，僅有單一空中平台提供覆蓋，但這也暴露了一個關鍵限制：空中平台的覆蓋範圍內不一定存在地面 gateway。例如，當一顆 LEO 衛星移動到海洋上空時，其覆蓋區域內可能完全沒有地面站。若此時某位使用者正在通話，雖然 service link 仍能連上衛星，但因缺乏可用的 feeder link，資料無法回傳至地面網路，使用者可能必須等到衛星再次覆蓋陸地、或下一顆具有 gateway 連線能力的衛星接手，可能延遲數十分鐘。這種情形顯然無法滿足 5G 所要求的即時性與服務連續性。

> 衛星或 UAS 通常會在其視野（field of view）內產生多個 beam，beam footprint 通常呈橢圓形。
![alt text](images/3gpp/img1.png)

為了解決「覆蓋範圍有限」與「gateway 密度不足」的問題，NTN 通常不是部署一顆，而是部署大量的衛星 / UAS 節點形成一個星座（constellation）。

![alt text](images/3gpp/img2.png)

### NTN plateform 類型
- 大部分 GEO 都是同步衛星
- LEO 通常不會在眼前停留超過十多分鐘

衛星與地面之間的通訊必須同時考量通訊品質與設備保護，其中一項重要原因是：若接收端收到的訊號功率過強，而設備本身的耐受能力不足，就可能造成元件損壞，而為了避免「被訊號燒掉」，就必須採用成本更高、可承受大幅功率變動的高階射頻設備。

以圓形軌道的 LEO、MEO 與 GEO 衛星為例，它們相對於地表位置變化較為可預期，因此能夠提供較穩定的接收功率，終端設備的設計也較為簡單。然而，HEO（Highly Elliptical Orbit，高橢圓軌道）衛星在軌道上與地表距離變化劇烈，導致接收端的訊號強度會大幅波動，因此需要更高成本、更耐受高功率變動的 RF 設備才能維持正常運作。也因此，HEO 衛星較常用於太空探測或特定軍事應用，而不是一般民用通訊場景。

| platform 類型            | 高度範圍                   | 軌道            | 典型 beam footprint |
| --------------- | ---------------------- | ------------- | ----------------- |
| **LEO 衛星**      | 300–1500 km            | 環繞地球的近地軌道     | 100–1000 km       |
| **MEO 衛星**      | 7000–25000 km          | 中地球軌道         | 100–1000 km       |
| **GEO 衛星**      | 35,786 km              | 固定於地球某點的仰角/方位 | 200–3500 km       |
| **UAS（含 HAPS）** | 8–50 km（HAPS 多為 20 km） | ——            | 5–200 km          |
| **HEO 衛星**      | 400–50000 km           | 橢圓軌道          | 200–3500 km       |

![alt text](images/3gpp/img3.png)

### 衛星 payload
這裡所指的 payload 並非通訊封包中的 payload，而是衛星或 UAS 平台上，為了執行特定任務（如觀測、通訊或導航）而設計的功能性次系統。在 NTN 架構中，衛星或 UAS 可能搭載以下兩種類型的通訊酬載：
#### Transparent Payload
Transparent Payload 主要負責將接收到的 RF 訊號以最基本的方式轉發，並不進行通訊協定層面的處理，屬於「訊號放大轉發（bent-pipe）」架構，具有低複雜度與低延遲的特性，它的特色就是訊號波形不會被改變，幾乎不做解調或處理。

另外，之所以需要進行濾波、頻率轉換與放大，是因為 uplink（地面 → 太空） 與 downlink（太空 → 地面） 所使用的頻段通常不同，衛星必須在中繼時切換至適合下行傳輸的頻率，同時確保訊號品質符合通訊需求。

- radio frequency filtering
- frequency conversion
- amplification
#### regenerative payload
regenerative payload 會在衛星或 UAS 平台上執行更進階的訊號處理，相當於在空中放置部分或完整的基地台功能。與 Transparent Payload 僅放大與轉發訊號不同，regenerative payload 會先透過 demodulation/decoding 將 uplink 訊號還原成基頻資料，再經由 coding/modulation 重新封裝成 downlink，因此相當於在衛星上對訊號進行完整的重新打包（regeneration）。

包含以下典型功能：

- radio frequency filtering
- frequency conversion
- amplification
- demodulation/decoding、coding/modulation
- switch and/or routing
- having all or part of base station functions (e.g. gNB)
- Inter-satellite links (ISL) optionally in case of a constellation of satellites

如果沒有 regeneration，資料一定要回到地面 gateway 才能被解碼，再傳給下一顆衛星或下一個 UE，造成更多的延遲

![alt text](images/3gpp/img5.png)

## Non-Terrestrial Networks reference scenarios
依照衛星軌道類型和衛星 payload 類型兩個維度對 NTN 進行分類，並將不同組合對應到 3GPP 設定的情境 Scenario A / B / C1 / C2 / D1 / D2。

| 衛星軌道 | Beam 模式    | Transparent | Regenerative |
| ---- | ---------- | ----------- | ------------ |
| GEO  | 固定覆蓋       | A           | B            |
| LEO  | steerable beam   | C1          | D1           |
| LEO  | beam 隨衛星移動 | C2          | D2           |

ps. MEO 在商業上比較不常用，因為他軌道高但又不能同步，需要更高成本去做地面設備、接收發送訊號，且延遲久


### Steerable Beams（Earth-fixed）
- LEO 衛星快速移動
- Beam（藍色覆蓋區）會持續指向地球上同一個地區
```
   (Satellite moving →)
        🛰️
         \   beam steer
          \ ↘
           🌍 fixed spot
```
### Beams Move With Satellite（Satellite-fixed）
- 衛星移動時
- Beam footprint 會掃過地面，不在固定位置
```
   (Satellite moving →)
        🛰️
         \ 
          \  beam stays under satellite
           🌍 footprint sweeps across ground
```
> Earth-fixed beam 指的是，即使衛星本身在移動，波束覆蓋區（beam footprint）仍然固定在地球表面某一位置不動。Steerable beam 衛星內的天線陣列會不斷重新調整波束角度才能實現。

| 參數 | GEO 為基礎的非地面接取網路 (Scenario A & B) | LEO 為基礎的非地面接取網路 (Scenario C & D) |
|------|------------------------------------------------|------------------------------------------------|
| **軌道類型 (Orbit type)** | 以固定仰角／方位維持相對地球上某點的定點位置（同步軌道） | 繞地球運行的圓形軌道 |
| **高度 (Altitude)** | 35,786 公里 | 600 公里 / 1,200 公里 |
| **服務鏈路頻段 (Spectrum, service link)** | < 6 GHz（例：2 GHz）<br>> 6 GHz（例：下行 20 GHz、上行 30 GHz） | < 6 GHz（例：2 GHz）<br>> 6 GHz（例：下行 20 GHz、上行 30 GHz） |
| **最大通道頻寬 (Max channel bandwidth capability)** | 低於 6 GHz：30 MHz <br>高於 6 GHz：1 GHz | 低於 6 GHz：30 MHz <br>高於 6 GHz：1 GHz |
| **酬載類型 (Payload)** | Scenario A：Transparent（僅射頻功能）<br>Scenario B：Regenerative（包含部分或全部 RAN 功能） | Scenario C：Transparent（僅射頻功能）<br>Scenario D：Regenerative（包含部分或全部 RAN 功能） |
| **星間鏈路 (Inter-Satellite Link)** | 無 | Scenario C：無 <br>Scenario D：可有／可無（兩者皆可能） |
| **地球固定波束 (Earth-fixed beams)** | 是 | Scenario C1：是（可轉向波束 steerable beams）<br>Scenario C2：否（波束隨衛星移動）<br>Scenario D1：是（可轉向波束 steerable beams）<br>Scenario D2：否（波束隨衛星移動） |
| **最大波束覆蓋直徑（edge to edge）** | 3500 km | 1000 km |
| **最低仰角（sat-gateway 與 UE）** | 服務鏈路 10°、回傳鏈路 10° | 服務鏈路 10°、回傳鏈路 10° |
| **衛星與 UE 之間的最遠距離（在最低仰角）** | 40,581 km | 1,932 km（600 km 高度）<br>3,131 km（1,200 km 高度） |
| **最大往返時延（僅傳播延遲）** | Scenario A：541.46 ms（service + feeder）<br>Scenario B：270.73 ms（service link only） | Scenario C（透明酬載：service + feeder）：<br>25.77 ms（600 km）<br>41.77 ms（1200 km）<br><br>Scenario D（再生酬載：service only）：<br>12.89 ms（600 km）<br>20.89 ms（1200 km） |
| **單一 cell 內最大差分延遲** | 10.3 ms | 600 km：3.12 ms <br>1200 km：3.18 ms |
| **最大都卜勒偏移（地球固定 UE）** | 0.93 ppm <br><br>**Doppler shift 公式：**<br>f' = f (1 + Δv / c)<br>f：發射頻率<br>Δv：相對速度<br>c：光速 | 24 ppm（600 km）<br>21 ppm（1200 km） |
| **最大都卜勒偏移變化率（地球固定 UE）** | 0.000045 ppm/s | 0.27 ppm/s（600 km）<br>0.13 ppm/s（1200 km） |
| **地表上 UE 的移動速度** | 1200 km/h（例如：飛機） | 500 km/h（例如：高速列車）<br>最高可達 1200 km/h（例如：飛機） |
| **UE 天線類型** | 全向性天線（線性極化），假設 0 dBi | 全向性天線（線性極化），假設 0 dBi<br>指向性天線（等效孔徑直徑可達 60 cm，圓極化） |
| **UE 發射功率 (Tx Power)** | 全向性天線：UE power class 3，最高 200 mW | 指向性天線：最高可達 20 W |
| **UE 噪聲指數 (Noise Figure)** | 全向性天線：7 dB<br>指向性天線：1.2 dB | 全向性天線：7 dB<br>指向性天線：1.2 dB |
| **Service link（服務鏈路）** | 3GPP 定義的新無線電介面（NR） | 3GPP 定義的新無線電介面（NR） |
| **Feeder link（回傳鏈路）** | 3GPP 或非 3GPP 定義的無線介面 | 3GPP 或非 3GPP 定義的無線介面 |

可以看到在欄位 "最大往返時延（僅傳播延遲）"，Scenario C 的時間很明顯比 Scenario D 多，這是因為 Scenario C 的 Transparent payload 無法做解調，所以路徑變成：
```
UE → 衛星（service 上行） → 地面 gateway（feeder 下行） → 衛星（feeder 上行） → UE（service 下行）
```

然而 Scenario D 只需要計算
```
UE → 衛星（service 上行）
UE ← 衛星（service 下行）
```

另外「仰角」會決定 UE 與衛星之間連線的幾何路徑長度，
- UE 在頭頂仰角高 → 衛星最近
```
      🛰 衛星
       |
       |   （最短）
       |
      🧍 UE
```
- UE 在地平線附近（仰角 0°）→ 衛星最遠
  - 因為地球是球體，在仰角 0° 時 UE 幾乎看不到衛星（視線沿地球表面切線），所以距離變成「地球邊緣 → 太空」的斜邊
```
衛星  🛰
       \
        \
         \       （最遠）
          \
           🧍 UE
```
所以用 GEO 例子來看數字差多少，會發現
| 情境                 | 距離                    |
| ------------------ | --------------------- |
| 正頭頂（仰角 90°）        | **35,786 km**（高度）     |
| 仰角 10°（3GPP 最低可見度） | **40,581 km**         |
| 仰角 0°（理論極限）        | **更長，甚至超過 42,000 km** |


而 GEO 高度非常高，spot beam 投射到地表會被放大，這是因為在這麼高的位置上，只要天線指向地面稍微偏斜，beam 在地球表面上的 footprint 就會變大。再搭配低仰角的情況，就會因為 beam 是斜著照到地球表面，使得橢圓投影變長。因此 3GPP 使用「覆蓋邊緣（低仰角）」來定義最大 footprint
```
      衛星 (非常高)
        \     ← beam 傾斜照射
         \
          \___________________   ← 地球表面投影變長
```

HTS（高吞吐量衛星）技術使 spot beam 更聚焦，但 footprint 還是大
- HTS（High Throughput Satellite）
  - 使用多個高增益 spot beams
  - 每個 spot beam 比傳統 GEO 覆蓋小很多（不是覆蓋整個大陸那種）
  - 但在 GEO 高度下，再小的 beam 投到地球上都會變大

### 其他小補充
- 用於延遲計算的光速為 **299,792,458 m/s**。
- GEO 的最大波束覆蓋尺寸是依據先進的 GEO 高吞吐量系統（HTS）估算，  假設使用覆蓋邊緣（低仰角）的 spot beams，所以最大波束覆蓋直徑（edge to edge）	3500km
