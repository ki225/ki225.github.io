---
title: LoRa WAN
date: 2025-10-27 16:24:39
tags: [wireless, LoRa]
---
## LoRa
LoRa（Long Range）是一種專為低功耗、長距離傳輸設計的無線通訊技術，屬於 LPWAN（Low Power Wide Area Network）的一種。它利用擴頻調變技術，使資料能在數公里甚至十幾公里的範圍內穩定傳輸，同時維持極低的電力消耗，非常適合電池供電的感測裝置。LoRa 通常搭配 LoRaWAN 協定運作，後者定義了裝置、閘道器、網路伺服器與應用伺服器間的通訊方式。

由於具備遠距、低耗電、低成本、可大規模佈署等特性，LoRa 被廣泛應用於智慧城市、環境監測、農業物聯網、能源管理與資產追蹤等場域。

### LoRaWAN
- 是屬於 LPWAN（Low Power Wide Area Network） 的一種通訊協定。
- 資料速率（Data Rates）: 速率選擇為傳輸距離與傳輸時間的權衡（trade-off）
  - LoRa 支援的資料速率範圍為 0.3 kbps ～ 50 kbps。
- ADR（Adaptive Data Rate）: 目的是同時提升終端裝置的電池壽命與網路容量
  - ADR 機制 允許網路根據每個裝置的狀況（例如距離、訊號品質），動態調整資料速率，以達到最佳化效能。
- 頻道切換（Change Channel）
  - 為避免干擾，每次傳輸時終端裝置會以偽隨機方式切換通道（pseudo-random fashion） -> 提升頻譜利用率與系統穩定性。

![alt text](images/wireless/img42.png)

LoRaWAN 架構由四個主要部分組成：終端裝置（End Devices）、閘道器（Gateway）、網路伺服器（Network Server） 與 應用伺服器（Application Server）。終端裝置負責蒐集感測資料並透過 LoRa 無線傳輸將資料送出；閘道器接收這些長距離的 LoRa 訊號，並以一般的 IP 網路（如以太網或行動網路）轉送至網路伺服器；網路伺服器則進行封包驗證、重複封包消除與路由管理，確保資料安全與正確傳遞；最後，應用伺服器負責將淨化後的資料轉換為實際應用層資訊，例如顯示在儀表板或觸發警報。這樣的分層架構讓 LoRaWAN 同時具備長距離通訊、低功耗、高擴充性與安全性的特點，成為物聯網應用中最常見的低功耗廣域網路方案之一。

### LoRaWAN Device Classes
![alt text](images/wireless/img41.png)

|      類別     | 接收時機                          |   功耗  |  延遲  | 通訊特性                | 適用場景           |
| :---------: | :---------------------------- | :---: | :--: | :------------------ | :------------- |
| **Class A** | 每次上行（Uplink）後開啟兩個短暫接收窗                | 🔋 最低 | 🕓 高 | 採 ALOHA 上行，僅在上行後可下行（Downlink） | 省電感測器、週期性資料回報  |
| **Class B** | 依據 Gateway 的 Beacon 訊號定時開啟接收窗 |  🔋 中 | 🕓 中 | 具時間同步，可排程接收下行訊息     | 智慧抄表、半即時控制     |
| **Class C** | 幾乎全時開啟接收窗（傳輸時暫停）              | 🔋 最高 | ⚡ 最低 | 即時雙向通訊、伺服端可隨時下行     | 工業控制、智慧照明、緊急應用 |

## Pysical Message Format

LoRaWAN 的通訊封包可分為 上行（Uplink） 與 下行（Downlink） 兩種格式，兩者都由多個區段組成，用於確保資料正確傳輸與完整性。
|          類型          | 封包結構                                            | 說明                                                                                             |
| :------------------: | :---------------------------------------------- | :--------------------------------------------------------------------------------------------- |
|  **Uplink Message**  | `Preamble → PHDR → PHDR_CRC → PHYPayload → CRC` | 由終端裝置傳送至閘道器。包含前導碼（Preamble）供同步、PHY 標頭與校驗碼（PHDR、PHDR_CRC），主要資料載體（PHYPayload），以及整體封包的錯誤檢查碼（CRC）。 |
| **Downlink Message** | `Preamble → PHDR → PHDR_CRC → PHYPayload`       | 由閘道器傳回至終端裝置。結構與上行相似，但通常不包含整體 CRC 欄位。                                                           |

### LoRaWAN 接收視窗運作原理
在 LoRaWAN 的設計中，為了節能終端裝置不會隨時接收資料，終端裝置只在每次上行傳輸後短暫打開接收窗等待下行資料，其餘時間都處於休眠狀態。
- 每當終端裝置傳送完一筆上行資料（Uplink）後，會依序開啟兩個短暫的下行接收視窗（RX1、RX2），讓網路伺服器有機會傳送資料回裝置。
- 這兩個接收窗讓裝置有機會接收來自網路伺服器的 下行訊息（例如控制指令或確認回覆）。
- 接收窗口的開啟時間是根據上行訊息最後一個位元（last uplink bit）結束後的固定延遲時間而定。
- Receive Window Duration（接收視窗持續時間）
  - 定義：指裝置在每次上行傳輸後開啟接收視窗的時間長度。
  - 規範：接收視窗的長度至少要 足夠讓裝置偵測到下行封包的前導碼（preamble）。
  - 封包結構：Preamble → PHDR → PHDR_CRC → PHYPayload
  - 若視窗太短，可能在尚未同步封包時就關閉接收，導致漏接；若太長，則浪費電力。
- 當裝置在接收視窗內偵測到前導碼（preamble）時，會做以下兩件事以避免重複接收同一筆資料並節省電能
  - 無線接收器（radio receiver）會保持啟動狀態，直到整個下行封包解調完成（demodulated）。
  - 若已成功接收並解調該下行封包，裝置不會再開啟第二個接收視窗（RX2），因為已完成通信。
- 網路伺服器與裝置之間必須高度時間同步，當網路伺服器要向終端裝置發送下行訊息時：
  - 伺服器必須精準地在接收視窗開啟的那一刻（RX1 或 RX2）開始傳送。
  - 若時間錯過，終端裝置的接收器就會關閉，導致封包無法被接收。

#### 第一接收視窗（RX1）
- 頻率（Frequency）：
  - 與上行訊息使用相同頻道。
- 開啟時間（Timing）：
  - 在上行訊號結束後 RECEIVE_DELAY1 秒（±20 µs） 打開。
- 資料速率（Data Rate）：
  - 預設與上行訊息相同。
  - 不同地區（Region）可根據頻譜規範調整 uplink 與 RX1 的速率對應關係。
- 特性：
  - RX1 是裝置最先開啟的接收機會，若伺服端要立即回覆，可利用這個時窗。

![alt text](images/wireless/img44.png)


#### 第二接收視窗（RX2）
- 頻率與資料速率：
  - 預設為系統設定的固定頻率與速率（依區域標準決定）。
  - 可透過 MAC 命令（MAC Command） 動態修改。
- 開啟時間（Timing）：
  - 在上行訊號結束後 RECEIVE_DELAY2 秒（±20 µs） 打開。
- 特性：
  - RX2 作為 備用接收視窗，若伺服端未能在 RX1 傳送下行封包，仍可利用 RX2 進行第二次嘗試。


![alt text](images/wireless/img43.png)

## Mac Message Format

![alt text](images/wireless/img45.png)

### PHYPayload（Physical Layer Payload）
PHYPayload = MHDR | MACPayload | MIC

| 欄位名稱           | 大小（Bytes）    | 說明                                    |
| :------------- | :----------- | :------------------------------------ |
| **MHDR**       | 1            | MAC Header，定義訊息類型與協定版本。               |
| **MACPayload** | 7 ~ M（依地區而異） | 主要資料內容，包含 Frame Header、Port 與資料負載。    |
| **MIC**        | 4            | Message Integrity Code，用於驗證訊息完整性與安全性。 |

### MHDR（MAC Header）
| 位元範圍         | 欄位        | 說明                           |
| :----------- | :-------- | :--------------------------- |
| **Bits 7–5** | **MType** | 訊息類型（Message Type）           |
| **Bits 4–2** | **RFU**   | 保留位（Reserved for Future Use） |
| **Bits 1–0** | **Major** | 協定版本（Major Version）          |

#### MType（訊息類型）
| MType (bits 7–5) | 名稱                        | 說明                |
| :--------------- | :------------------------ | :---------------- |
| 000              | **Join Request**          | 裝置加入網路請求          |
| 001              | **Join Accept**           | 網路回覆裝置加入成功        |
| 010              | **Unconfirmed Data Up**   | 未確認上行資料（uplink）   |
| 011              | **Unconfirmed Data Down** | 未確認下行資料（downlink） |
| 100              | **Confirmed Data Up**     | 需伺服器確認的上行資料       |
| 101              | **Confirmed Data Down**   | 需裝置確認的下行資料        |
| 110              | **RFU**                   | 保留未使用             |
| 111              | **Proprietary**           | 自定義封包（非標準應用）      |
#### Major（協定版本）
| Bits (1–0) | 說明               |
| :--------- | :--------------- |
| 00         | LoRaWAN R1（目前版本） |
| 01–11      | RFU（保留未使用）       |

### MACPayload（MAC 層負載）
MACPayload = FHDR | FPort | FRMPayload

| 欄位名稱           | 大小（Bytes） | 說明                                 |
| :------------- | :-------- | :--------------------------------- |
| **FHDR**       | 7 ~ 22    | Frame Header（框架標頭），包含裝置地址、控制與序號資訊。 |
| **FPort**      | 0 ~ 1     | Frame Port，指定應用層或 MAC 命令通訊端口。      |
| **FRMPayload** | 0 ~ N     | Frame Payload，實際的資料內容（可加密）。        |

#### FHDR – Frame Header（框架標頭）
負責攜帶裝置識別與通訊控制資訊，確保上行與下行資料的順序與可靠性。
FHDR = DevAddr | FCtrl | FCnt | FOpts
| 欄位名稱        | 大小（Bytes） | 說明                                    |
| :---------- | :-------- | :------------------------------------ |
| **DevAddr** | 4         | 裝置位址（Device Address），用於識別裝置在網路中的身份。   |
| **FCtrl**   | 7~M         | Frame Control，包含控制旗標（如 ACK、ADR）與選項長度。 |
| **FCnt**    | 2         | Frame Counter，用於封包序號與重傳檢測（避免重複封包）。    |
| **FOpts**   | 0 ~ 15    | Frame Options，可攜帶 MAC 命令（如連線參數更新）。    |

#### FCtrl（Downlink）
| 位元位置            | 欄位名稱         | 說明                                 |
| :-------------- | :----------- | :--------------------------------- |
| **Bit 7**       | **ADR**      | Adaptive Data Rate 啟用位，是否啟用自動速率調整。 |
| **Bit 6**       | **RFU**      | 保留位（Reserved for Future Use）。      |
| **Bit 5**       | **ACK**      | 用於回覆上行 Confirmed Data 是否成功接收。      |
| **Bit 4**       | **FPending** | 表示網路端仍有更多下行資料待傳。                   |
| **Bits [3..0]** | **FOptsLen** | FOpts 欄位長度（0–15 bytes）。            |

#### FCtrl（Uplink）
| 位元位置            | 欄位名稱          | 說明                                      |
| :-------------- | :------------ | :-------------------------------------- |
| **Bit 7**       | **ADR**       | 啟用自動資料速率調整（Adaptive Data Rate）。         |
| **Bit 6**       | **ADRACKReq** | 要求網路確認 ADR 狀態（ADR Acknowledge Request）。 |
| **Bit 5**       | **ACK**       | 確認收到上一筆下行 Confirmed Data。               |
| **Bit 4**       | **ClassB**    | 指示裝置支援 Class B 模式（同步接收窗）。               |
| **Bits [3..0]** | **FOptsLen**  | FOpts 欄位長度（0–15 bytes）。                 |

### Adaptive Data Rate（ADR）自適應資料速率
ADR 是上面 FCtrl 封包的欄位，指是否啟用 Adaptive Data Rate；也是 LoRaWAN 中用來**自動調整裝置的資料速率與發射功率（Tx Power）**的機制，其主要目標是延長終端裝置的電池壽命、提升整體網路容量與穩定性，對於固定裝置，開啟 ADR 可讓網路自動優化資料速率與發射功率；對於移動裝置，應關閉 ADR 以避免因通道變化導致傳輸錯誤。

- ADR 可由裝置或網路端設定/取消。
- 當環境穩定時開啟 ADR，可減少重傳與功耗；當信號快速變動時關閉 ADR，避免頻繁錯誤調整。

| 裝置類型                         | ADR 狀態    | 說明                           |
| :--------------------------- | :-------- | :--------------------------- |
| **靜止型裝置（Stationary Device）** | `ADR = 1` | 保持啟用 ADR，由網路根據訊號品質自動調整速率與功率。 |
| **移動型裝置（Mobile Device）**     | `ADR = 0` | 停用 ADR，因無線環境變化快，網路不再動態調整。    |


#### ADR 狀態行為對照表

| 封包方向              | ADR 位元                          | 效果說明 |
| :------------------- | :------------------------------ | :--- |
| **Uplink ADR = 1**   | ✅ 網路可透過 MAC 命令調整資料速率與 Tx Power。 |      |
| **Uplink ADR = 0**   | 🚫 網路不得更改裝置速率與功率設定。             |      |
| **Downlink ADR = 1** | ✅ 網路伺服器可以發送 ADR 相關指令至裝置。        |      |
| **Downlink ADR = 0** | ⚠️ 表示目前無線通道變化太快，暫停 ADR 機制。      |      |

### 網路伺服器是否仍能接收訊號（Check Network Server Reception）
當 LoRaWAN 的 ADR 機制 開啟時，網路可能會調整裝置的傳輸參數，讓它以更高的資料速率與更低的發射功率運作，以節省能源與頻寬。但若裝置長時間未確認伺服器仍能接收到訊號，可能導致封包傳不出去、通訊品質下降、無法進行後續 ADR 調整。因此，裝置需要定期進行「連線確認」測試（例如透過要求 ACK 的 uplink frame），確保網路端仍能穩定接收並回覆，若未收到回覆，裝置應恢復到預設的功率與資料速率。

- 情境（Scenario）：
  - 目前的資料速率（Data Rate）已被網路優化後 高於預設值（Default Data Rate）。
  - 目前的發射功率（Tx Power）低於預設值（Default Tx Power）。
- 動作（Action）：
  - 終端裝置需定期驗證網路伺服器是否仍能接收到它的上行訊息（uplink frames）。

![alt text](images/wireless/img46.png)

### ACK 位元
LoRaWAN 支援「Unconfirmed Data（不需回覆）」和「Confirmed Data（需回覆 ACK）」兩種回覆模式，第二種就需要 ACK。ACK 是 FCtrl 欄位中其中一個欄位，用途就是讓通訊雙方知道封包是否成功被接收。
- 若傳送端為終端裝置（End-device），網路伺服器會嘗試在終端裝置開啟的兩個接收視窗（RX1 或 RX2）中，傳送 確認訊息（Acknowledgement） 給裝置。
  - 當終端裝置傳送一筆「Confirmed Data Up」時，伺服器需在 RX1 或 RX2 視窗內回覆帶有 ACK = 1 的封包作為確認。
- 若傳送端為閘道器／網路伺服器（Gateway / Network）時，終端裝置會在之後的上行傳輸中，自行決定是否回傳確認訊息（ACK）。
  - 若是伺服器傳送「Confirmed Data Down」，終端裝置在下一次 uplink 時回傳 ACK = 1，表示已成功接收。

### Retransmission Procedure
1. 上行封包（Uplink Frames）
    - 傳送端為 終端裝置（End Device）。
    - 「Confirmed」與「Unconfirmed」 兩種上行封包都會依設定的 NbTrans（重傳次數） 進行重傳。
    - 若在其中一次傳輸後成功收到來自網路的有效下行回覆（Valid Downlink），則停止後續重傳。
2. 下行封包（Downlink Frames）
    - 傳送端為 閘道器（Gateway） 或 網路伺服器（Network Server）。
    - 若未收到終端裝置的確認（ACK），應用伺服器（Application Server）會被通知，並可決定是否重新發送新的 Confirmed Frame。

#### Frame Pending Bit
FPending 位元只用於 下行封包（Downlink） 的 FCtrl 欄位中。當 FPending = 1 時，表示：
- 閘道器或網路伺服器仍有更多資料尚未傳送給該裝置。
- 通知終端裝置應盡快再發送一次上行封包，以便開啟新的接收視窗（Receive Window）來接收後續資料。
  - 因為終端裝置通常只在上行後開啟短暫接收窗，若網路有多筆下行資料待傳，就會透過 FPending 告訴裝置「再開一次門，我還有東西要給你」。

#### Frame counter (FCnt) Bit
FCnt 是 FHDR 的其中一個欄位，也是 LoRaWAN 通訊中非常重要的安全與同步機制，用來確保每筆封包的順序正確、避免重播攻擊（Replay Attack），並由 終端裝置（End Device） 與 網路伺服器（Network Server） 共同維護。他的計數器運作機制如下:
- 單一計數器機制（Single Counter Scheme）
  - 適用版本： LoRaWAN 1.0
  - 欄位：
    - FCntDown → 用於**所有通訊埠（All Ports）**的下行封包計數。
  - 特點：
    - 所有下行資料共用同一個計數器。
- 雙計數器機制（Two-Counter Scheme）
  - 適用版本： LoRaWAN 1.1
  - 欄位：
    - NFCntDown → 用於 MAC 通訊（Port 0）
    - AFCntDown → 用於 應用層通訊（Port > 0）
  - 特點：
    - 分離控制與應用層計數器，提高安全性與同步精度。
- 計數器重設規則（Counter Reset）
    | 類型                                       | 行為說明                                                                                    |
    | :--------------------------------------- | :-------------------------------------------------------------------------------------- |
    | **OTAA（Over-The-Air Activation）裝置**      | 當處理 **Join-Accept** 訊息時，會同時重設：<br>➡️ 上行計數器 `FCntUp`<br>➡️ 下行計數器 `NFCntDown`、`AFCntDown` |
    | **ABP（Activation By Personalization）裝置** | 在**製造時初始化為 0**，<br>⚠️ **在整個使用期間不得重設**，以防止重播攻擊。                                          |

ps. OTA 是指在空氣中交換資訊。

#### Port Field (FPort)
FPort 是位於 MACPayload 中的一個欄位，用來指定該封包所屬的通訊類型（應用層或 MAC 層），依據其值的不同，封包內容（FRMPayload）會有不同的用途。以下是 FPort 值與用途說明：
| **FPort 值**             | **用途說明**                                             |
| :---------------------- | :--------------------------------------------------- |
| **0**                   | FRMPayload 僅包含 **MAC Commands**（僅用於 MAC 層控制，不屬於應用資料） |
| **1–223 (0x01–0xDF)**   | **應用層專用（Application-specific）**，可由使用者或應用自訂協定。        |
| **224 (0xE0)**          | **LoRaWAN MAC Layer Test Protocol**，用於測試與除錯。         |
| **225–255 (0xE1–0xFF)** | **未來擴充用途（Future Extension）**，保留給後續 LoRaWAN 規範版本使用。   |


## MAC commands
在剛剛我們提到當 FPort ≥ 1 時，FRMPayload 通常由應用層加密，並交由應用伺服器處理；而當 FPort = 0 時，封包不屬於應用層，FRMPayload 內容不會被加密為應用資料，而是由 MAC 層直接解析，用於控制命令（例如 ADR、LinkCheckReq 等）。所以這邊就要來介紹 MAC commands。

### 甚麼是 MAC commands?
MAC Commands 是 LoRaWAN MAC 層（Medium Access Control Layer）用來進行 網路管理與連線控制 的指令。這些命令不屬於應用層資料，而是由 終端裝置（End Device） 與 網路伺服器（Network Server）互相交換，用於維持通訊品質與網路同步。

### MAC commands 放哪裡?
| 放置位置                          | 條件                        | 說明                                                    |
| :---------------------------- | :------------------------ | :---------------------------------------------------- |
| **FOpts（Frame Options）**      | 位於 **FHDR** 內，最大 15 Bytes | 適合放置較短的 MAC 命令（節省額外欄位開銷）。                             |
| **FRMPayload（Frame Payload）** | 當 **FPort = 0** 時         | 用於攜帶較長或多筆 MAC 命令。此時 **FRMPayload 僅包含 MAC 命令，不含應用資料**。 |

### 會考的指令(重要)
#### Link Check Commands(LinkCheckReq / LinkCheckAns)
- 用於讓終端裝置（End Device）確認與網路伺服器的連線品質。
- 這是最常用的 MAC 層診斷命令，有助於評估訊號強度與覆蓋範圍。

| 命令名稱             | 方向                              | 功能說明                  |
| :--------------- | :------------------------------ | :-------------------- |
| **LinkCheckReq** | 上行（End Device → Network Server） | 終端裝置發送「連線檢查請求」給網路伺服器。 |
| **LinkCheckAns** | 下行（Network Server → End Device） | 網路伺服器回覆連線品質資訊。        |

其實 SINR 也是
##### LinkCheckAns Payload
LinkCheckAns Payload = Margin | GwCnt
| 欄位名稱       | 大小（bytes） | 說明                                                                 |
| :--------- | :-------- | :----------------------------------------------------------------- |
| **Margin** | 1         | 解調裕度（Demodulation Margin）：以 dB 為單位，代表最後一次成功接收的 LinkCheckReq 的訊號品質。 |
| **GwCnt**  | 1         | Gateway Count：成功接收到該訊息的閘道器數量。                                      |

#### Link ADR Commands(LinkADRReq / LinkADRAns)
用於 ADR（Adaptive Data Rate）機制，由網路伺服器指示終端裝置調整傳輸速率（Data Rate）、發射功率（Tx Power）或可用通道（Channel Mask）。

| 命令名稱           | 方向                              | 功能說明             |
| :------------- | :------------------------------ | :--------------- |
| **LinkADRReq** | 下行（Network Server → End Device） | 網路請求裝置進行速率與功率調整。 |
| **LinkADRAns** | 上行（End Device → Network Server） | 裝置回覆是否成功應用設定。    |

##### LinkADRReq Payload
LinkADRReq Payload = DataRate_TXPower | ChMask | Redundancy

| 欄位名稱                 | 大小（bytes） | 說明                                              |
| :------------------- | :-------- | :---------------------------------------------- |
| **DataRate_TXPower** | 1         | 前 4 bits 為 **DataRate**，後 4 bits 為 **TxPower**。 |
| **ChMask**           | 2         | Channel Mask，表示可用頻道。`1 = 可用`，`0 = 禁用`。          |
| **Redundancy**       | 1         | 冗餘設定（控制重傳次數 NbTrans 等參數）。                       |

Channel Mask（ChMask）位元對應
|  位元 | 通道         | 說明                |
| :-: | :--------- | :---------------- |
|  0  | Channel 1  | 若為 1，表示此通道可用      |
|  1  | Channel 2  | 若為 0，表示此通道停用      |
|  …  | …          | 依序對應 Channel 3–16 |
|  15 | Channel 16 | 同上                |


##### LinkADRAns Payload
LinkADRAns Payload = Status

當終端裝置（End Device）收到來自網路伺服器的 LinkADRReq 命令後，它會回傳 LinkADRAns 以告知設定結果。此回覆僅佔 1 byte，包含三個主要確認位元（ACK bits）：

| 欄位名稱       | 大小（bytes） | 說明                  |
| :--------- | :-------- | :------------------ |
| **Status** | 1         | 回覆狀態（bit 0–2 為確認標誌） |

|      位元      | 名稱               | 說明         |
| :----------: | :--------------- | :--------- |
|   **Bit 0**  | Channel mask ACK | 通道設定是否成功   |
|   **Bit 1**  | Data rate ACK    | 資料速率設定是否成功 |
|   **Bit 2**  | Power ACK        | 發射功率設定是否成功 |
| **Bits 7–3** | RFU              | 保留位        |

Status Bit 詳細行為

| 欄位                   | Bit 值 = 0（失敗）                                           | Bit 值 = 1（成功）                          |
| :------------------- | :------------------------------------------------------ | :------------------------------------- |
| **Channel mask ACK** | 所設定的通道遮罩（Channel Mask）啟用了未定義的頻道，或設定導致**所有頻道被關閉**（無法使用）。 | 通道遮罩設定成功。                              |
| **Data rate ACK**    | 請求的資料速率（DataRate）**裝置不支援**，或該速率在當前啟用頻道中無法使用。            | 設定成功，或 DataRate 欄位被設為 **15（表示忽略此設定）**。 |
| **Power ACK**        | 裝置**無法在指定的功率或更低功率下運作**（可能超出硬體範圍）。                       | 設定成功，或 TxPower 欄位被設為 **15（表示忽略此設定）**。  |

#### End-Device Transmit Duty Cycle（DutyCycleReq / DutyCycleAns）
##### DutyCycleReq
DutyCycleReq 是由 Network Server 下發給 End Device 的指令，用來限制裝置的最大全域發射佔空比（Duty Cycle），以遵守各地區的無線電法規（如歐洲 ETSI EN300.220 的發射限制）。

DutyCycleReq Payload = DutyCyclePL (1 byte)

DutyCycleReq Payload 結構
| DutyCyclePL 欄位名稱          | 位元範圍     | 說明                           |
| :------------ | :------- | :--------------------------- |
| **RFU**       | Bits 7–4 | 保留位（Reserved for Future Use） |
| **MaxDCycle** | Bits 3–0 | 最大發射佔空比限制指標（range: 0–15）     |

Duty Cycle 計算公式

$\text{Duty Cycle} = \frac{1}{2^{\text{MaxDCycle}}}$

Duty Cycle 每個整數就代表一個值，這是因為如果要表示成浮點數會佔用太多 bits。實際上整數代表多大的浮點數不確定，下表只是一個範例。

| **MaxDCycle 值** | **Duty Cycle（最大發射比例）** | **說明**                       |
| :-------------: | :--------------------: | :--------------------------- |
|      **0**      |           無限制          | 表示「no duty cycle limitation」 |
|      **1**      |        1/2 = 50%       | 可在一半時間內發射                    |
|      **2**      |        1/4 = 25%       |                              |
|      **4**      |      1/16 ≈ 6.25%      |                              |
|      **8**      |      1/256 ≈ 0.39%     | 常見於歐洲 ISM 頻段限制               |
|      **15**     |    1/32768 ≈ 0.003%    | 幾乎無法連續發射，超低 duty             |

##### DutyCycleAns
- 方向： 上行（End Device → Network Server）
- 內容： 無 Payload（空回覆）。
- 用途： 表示終端裝置已成功接受並套用 Duty Cycle 限制。

#### Receive Windows Parameters（RXParamSetupReq / RXParamSetupAns）






