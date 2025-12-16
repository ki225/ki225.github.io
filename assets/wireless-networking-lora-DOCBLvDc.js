const n=`---
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
|  **Uplink Message**  | \`Preamble → PHDR → PHDR_CRC → PHYPayload → CRC\` | 由終端裝置傳送至閘道器。包含前導碼（Preamble）供同步、PHY 標頭與校驗碼（PHDR、PHDR_CRC），主要資料載體（PHYPayload），以及整體封包的錯誤檢查碼（CRC）。 |
| **Downlink Message** | \`Preamble → PHDR → PHDR_CRC → PHYPayload\`       | 由閘道器傳回至終端裝置。結構與上行相似，但通常不包含整體 CRC 欄位。                                                           |

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
| **靜止型裝置（Stationary Device）** | \`ADR = 1\` | 保持啟用 ADR，由網路根據訊號品質自動調整速率與功率。 |
| **移動型裝置（Mobile Device）**     | \`ADR = 0\` | 停用 ADR，因無線環境變化快，網路不再動態調整。    |


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
    | **OTAA（Over-The-Air Activation）裝置**      | 當處理 **Join-Accept** 訊息時，會同時重設：<br>➡️ 上行計數器 \`FCntUp\`<br>➡️ 下行計數器 \`NFCntDown\`、\`AFCntDown\` |
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

在這邊不是用 good/bad 來回答這個 link 的品質如何，而是用 link margin 和 gateway count 來表示。所謂的 link margin 就是 link budget 扣除成功接收的最低要求後所多出的量。比如說當前 link budget 透過 SINR 測量出是 10db(link budget)，而 link 通訊最低要 8db，則 link margin 就是 10-8=2(db)。但後來大家好像都把 margin & budget 混著用了(老師說的)所以看到 margin 就是 SINR。

| 欄位名稱       | 大小（bytes） | 說明                                                                 |
| :--------- | :-------- | :----------------------------------------------------------------- |
| **Margin** | 1         | 解調裕度（Demodulation Margin）：以 dB 為單位，代表最後一次成功接收的 LinkCheckReq 的訊號品質。 |
| **GwCnt**  | 1         | Gateway Count：network server 成功接收到該訊息的所來自的閘道器數量。(在 n 個閘道的交集處傳送訊息，則可能m個閘道會幫你送訊息)                                      |

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
| **ChMask**           | 2         | Channel Mask，表示可用頻道。\`1 = 可用\`，\`0 = 禁用\`。          |
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

$\\text{Duty Cycle} = \\frac{1}{2^{\\text{MaxDCycle}}}$

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

##### RXParamSetupReq
由網路伺服器下發，用來設定終端裝置的：
- 第二接收窗（RX2）頻率（Frequency）
- RX2 接收資料速率（RX2DataRate）
- RX1 上下行資料速率偏移（RX1DRoffset）

RXParamSetupReq Payload = DLsettings | Frequency
| 欄位名稱           | 大小（bytes） | 位元位置                                                   | 說明                                      |
| :------------- | :-------- | :----------------------------------------------------- | :-------------------------------------- |
| **DLsettings** | 1         | Bit7 RFU<br>Bits6–4 RX1DRoffset<br>Bits3–0 RX2DataRate | 定義 RX1 與 RX2 的資料速率設定                    |
| **Frequency**  | 3         | –                                                      | 設定 RX2 頻率（Hz），通常為 24-bit 值表示 MHz × 100。 |

##### RXParamSetupAns
RXParamSetupAns 由 end-device 回覆，回報是否成功套用設定，確保雙方同步參數。根據 LoRaWAN 規範，RXParamSetupAns 必須持續放在 FOpts 欄位中，直到裝置收到一個下行（Class A）訊息為止。這樣即使中途 uplink 遺失，Network Server 仍能最終得知下行參數是否已被成功套用。

| 欄位名稱       | 大小（bytes） | 位元                                                                                        | 說明     |
| :--------- | :-------- | :---------------------------------------------------------------------------------------- | :----- |
| **Status** | 1         | Bit0 – Channel ACK<br>Bit1 – RX2 Data Rate ACK<br>Bit2 – RX1DRoffset ACK<br>Bits7–3 – RFU | 回覆設定結果 |

| 位元名稱                  | Bit = 0（失敗）         | Bit = 1（成功） |
| :-------------------- | :------------------ | :---------- |
| **Channel ACK**       | RX2 頻率不可用（裝置不支援該頻段） | 頻率設定成功      |
| **RX2 Data Rate ACK** | RX2 資料速率不被允許        | 資料速率設定成功    |
| **RX1DRoffset ACK**   | RX1 上下行速率偏移超出允許範圍   | 設定成功        |

#### End-Device Status Command（DevStatusReq / DevStatusAns）
##### DevStatusReq
Network Server 可使用 DevStatusReq 指令，請求終端裝置（End Device）回報其狀態。


##### DevStatusAns
當裝置接收到 DevStatusReq 時，會回覆 DevStatusAns，提供電池電量與通訊品質資訊。

DevStatusAns Payload = Battery | Margin
| 欄位名稱        | 大小（bytes） | 說明                         |
| :---------- | :-------- | :------------------------- |
| **Battery** | 1         | 電池電量狀態                     |
| **Margin**  | 1         | 解調信號雜訊比（SNR Margin, 單位 dB） |

Battery 欄位編碼與說明：
|     值     | 狀態說明                                   |
| :-------: | :------------------------------------- |
|   **0**   | 裝置使用外部電源（External Power Source）。       |
| **1–254** | 電池電量（Battery Level），1 代表最低、254 代表最高電量。 |
|  **255**  | 裝置無法量測電池電量（例如無電池偵測功能）。                 |

Battery 欄位是 Network Server 用來監控裝置能耗的重要指標，可協助網路管理系統進行電源管理或觸發節能機制。

Margin 欄位說明
| 項目       | 說明                                                   |
| :------- | :--------------------------------------------------- |
| **意義**   | 表示上一次成功接收到 DevStatusReq 封包的 **解調訊號雜訊比（SNR）**，單位為 dB。 |
| **數值範圍** | –32 ～ +31（6-bit 有號整數）                                |
| **取值方式** | 四捨五入至最接近的整數。                                         |
| **意義解讀** | 值越大 → 訊號品質越好；值為負 → 雜訊干擾嚴重。                           |

Margin 反映無線鏈路的物理層品質（PHY Layer），Network Server 可據此判斷是否需要調整 Data Rate 或 Tx Power。

#### Channel Creation & Modification (NewChannelReq / NewChannelAns)

##### NewChannelReq
- NewChannelReq 是由 Network Server 傳送給 End Device 的命令，用來
  - 建立新頻道（New Channel）
  - 修改現有的雙向頻道（Bidirectional Channel）
- 此命令會設定：
  - 該頻道的 中心頻率（Center Frequency）
  - 該頻道可使用的 上行資料速率範圍（Uplink Data Rate Range）

NewChannelReq Payload = ChIndex | Freq | DrRange
| 欄位名稱        | 大小（bytes） | 說明                                  |
| :---------- | :-------- | :---------------------------------- |
| **ChIndex** | 1         | 頻道索引（Channel Index）                 |
| **Freq**    | 3         | 頻道中心頻率（Center Frequency），單位為 100 Hz |
| **DrRange** | 1         | 資料速率範圍（Data Rate Range）             |

- ChIndex（Channel Index）
  - 指定要修改或建立的頻道索引。
  - LoRaWAN 規範定義了「預設頻道（Default Channels）」，這些頻道對所有裝置都相同，不可被修改或刪除。
  - 可設定範圍 N≤ChIndex≤15，其中 N 為預設頻道數量（例如 EU868 為 3）。
  - 裝置必須至少支援 16 個頻道定義（部分地區可能要求更多）
- Freq（Frequency）
  - 3 bytes（24 bits）值，單位為 100 Hz。
  - 實際頻率計算方式：Frequency (Hz)=Freq×100
- DrRange（Data Rate Range）
  - 用來指定該頻道可使用的 資料速率範圍。
  - 欄位被分為兩個 4-bit 部分：
  - 若 DrRange = 0x52 → MaxDR = 5、MinDR = 2 → 表示該頻道允許 DR2 ~ DR5 的速率傳輸。
    | 位元範圍     | 名稱        | 說明           |
    | :------- | :-------- | :----------- |
    | Bits 7–4 | **MaxDR** | 該頻道允許的最高資料速率 |
    | Bits 3–0 | **MinDR** | 該頻道允許的最低資料速率 |

##### NewChannelAns
裝置在接收到 NewChannelReq 後，會回傳 NewChannelAns 命令以確認設定結果。Payload 含有一個 Status byte：
| 位元       | 名稱                        | 說明                     |
| :------- | :------------------------ | :--------------------- |
| Bit 0    | **Channel frequency ACK** | 頻率有效時回 1；若超出允許範圍回 0。   |
| Bit 1    | **Data rate range ACK**   | 資料速率範圍有效時回 1；若不支援則回 0。 |
| Bits 7–2 | **RFU**                   | 保留位。                   |

#### Setting delay between TX and RX (RXTimingSetupReq)

- RXTimingSetupReq 是由 Network Server 下發給 End Device 的命令，用來設定上行傳輸（TX）結束與接收視窗（RX）開啟之間的延遲時間，白話就是 uplink 送完多久後要延遲多久才開始有第一個 receive window
- 這影響裝置接收下行訊息（downlink）的時機。
- 運作說明
  - RX1（第一接收視窗）
    - 在 TX 結束後 Delay 秒（±20 μs） 開啟。
  - RX2（第二接收視窗）
    - 永遠在 RX1 之後 1 秒 開啟。
- RXTimingSetupReq Payload 結構

| 欄位名稱      | 大小（bytes） | 說明                             |
| :-------- | :-------- | :----------------------------- |
| **Delay** | 1         | 設定 TX 結束後至 RX1 視窗開啟的延遲時間（單位：秒） |

#### DeviceTime commands(DeviceTimeReq)

終端裝置可以使用 DeviceTimeReq 命令，請求 Network Server 提供目前的網路日期與時間，以對齊時間避免太大落差

## End-device activation
裝置要加入到 LoRaWAN 網路環境，每個裝置會需要先被 activate，主要方式有兩種
1. Over-The-Air Activation (OTAA): 在空氣中連接需要做的完整 activation 流程
2. Activation By Personalization (ABP): 事先有做好一些前置作業，所以要做的事比 OTAA 少很多


加入前要做身分驗證，所以 end-device 需要具備以下資訊，以確保加入過程中的加密安全性與完整性驗證。

| 項目                                        | 名稱               | 中文說明                                                                                                                                                                                                      |
| :---------------------------------------- | :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1️⃣ JoinEUI（Join Server ID）**           | 要加入 server 的 id         | 代表負責裝置註冊與金鑰生成的 **Join Server**。<br>在 OTAA（Over-The-Air Activation）過程中，Join Server 負責協助裝置進行**入網認證（Join Procedure）**，並推導出**工作階段金鑰（Session Keys）**。                                                          |
| **2️⃣ DevEUI（Device ID）**                 | 裝置自己的 id            | 為終端裝置的**全球唯一識別碼（64-bit IEEE EUI-64）**，由製造商分配，用於在入網與管理過程中識別特定裝置。                                                                                                                                           |
| **3️⃣ Device Root Keys（AppKey & NwkKey）** | 裝置根金鑰            | 在裝置出廠時分配的兩組**長期對稱金鑰**：<br> - **AppKey（Application Key）**：用於推導應用層安全金鑰（AppSKey）。<br> - **NwkKey（Network Key）**：用於推導網路層安全金鑰（FNwkSIntKey、SNwkSIntKey、NwkSEncKey）。<br> 這兩組金鑰**永不在空中傳輸**，只用於安全地生成 session keys。 |
| **4️⃣ JSIntKey & JSEncKey Derivation**    | Join Server 金鑰衍生 | 由 **NwkKey** 推導出兩個臨時金鑰：<br> - **JSIntKey（Join Server Integrity Key）**：用於驗證 Join 訊息的完整性。<br> - **JSEncKey（Join Server Encryption Key）**：用於加密 Join-Accept 訊息內容。<br> 這確保 OTAA 加入過程中的認證與金鑰交換皆受到保護。            |

### JoinEUI
- JoinEUI（加入伺服器識別碼） 是一個依據 IEEE EUI-64 標準 的全球唯一應用識別碼。
- 它用來唯一識別要加入的 Join Server，即協助裝置完成 Join 流程與 Session Key 推導 的伺服器。
- 對於 OTAA 模式的裝置，JoinEUI 必須在執行 Join 流程前預先儲存在裝置內部。

### DevEUI
- DevEUI（裝置識別碼） 是一個在 IEEE EUI-64 位址空間中定義的全球唯一裝置 ID。
- 它用於在整個 LoRaWAN 網路中唯一識別該終端裝置。
- 對於 OTAA 裝置，DevEUI 必須在 Join 前預先儲存在裝置中，以便網路識別裝置身份。

### Device Root Keys（AppKey & NwkKey）
- NwkKey（Network Key） 與 AppKey（Application Key） 是在裝置製造階段就分配的 AES-128 根金鑰。
- 這兩把金鑰是裝置在 OTAA 加入網路時的安全基礎，不會經由空中傳輸。
- 在 OTAA 過程中：
- 若純粹因為 LoRaWAN 網路需要 key 就會使用 NwkKey 用於推導以下網路層安全金鑰：
  - FNwkSIntKey（上行訊息完整性金鑰）
  - SNwkSIntKey（下行訊息完整性金鑰）
  - NwkSEncKey（網路層加密金鑰）
- 若是為了 data，就會用 AppKey 用於推導以下應用層金鑰：
  - AppSKey（應用層資料加密金鑰）

> 平常若有 key 需求的話，會是用這兩個 key 衍生出的這些 key

在經過 activation 後， end-device 內部就會儲存
- DevAddr (Device address) -> 讓別人知道這個 device node
- NwkSEncKey/ SNwkSIntKey/FNwkSIntKey (Triplet of network session key)
- AppSKey (Application session key)

#### Forwarding Network Session Integrity Key（FNwkSIntKey）
這個針對 LoRa node 送給 server

- FNwkSIntKey（轉送網路完整性金鑰）用於 uplink 封包的完整性驗證。
- 終端裝置在每次傳送上行資料時，都會用此金鑰搭配公式計算出 MIC（Message Integrity Code，訊息完整碼），以確保封包內容未被竄改。
  - 在 MAC 層用封包的 MIC 判斷有沒有被修改

#### Serving Network Session Integrity Key（SNwkSIntKey）
這個針對 server 送給 LoRa node -> downlink

- SNwkSIntKey（服務網路完整性金鑰）有兩個主要用途：
  - 驗證所有下行封包的 MIC，確保從伺服器發出的資料未被竄改。
  - 在上行封包中參與計算 MIC（與 FNwkSIntKey 一起），以支援漫遊網路環境。
    - 漫遊表示離開原本的  LoRa 網路，要走到別人的 LoRa 網路
- 這種「雙金鑰」設計讓轉送伺服器（Forwarding Network Server）只需驗證部分 MIC，而主伺服器（Serving Network Server）負責最終驗證。

> MIC 本身沒有加解密，只是用來檢查
#### Network Session Encryption Key（NwkSEncKey）
- NwkSEncKey（網路加密金鑰）用於加密與解密 MAC 命令，包含：
  - 在 FOpts 欄位中 傳輸的控制指令。
  - 在 Port 0 的 FRMPayload 傳輸的 MAC 指令封包。

#### Application Session Key（AppSKey）
- AppSKey（應用層會話金鑰）由 應用伺服器與終端裝置 共同使用，用來加密與解密應用層資料（Application Payload）。
- 它與網路層金鑰分離，確保應用層內容在傳輸中對網路營運商仍保持保密性。

#### DevAddr（End Device Address）
- 因為用 EUI 代表 LoRa node 實在是太長了，所以用比較短的 Device Address
- DevAddr（裝置位址） 為 32 位元（4 bytes）識別碼，由 Network Server 分配。
- 它在區域網路內唯一識別裝置，並包含網路識別資訊（NetID）。

| 位元範圍       | 欄位名稱        | 說明                                       |
| :--------- | :---------- | :--------------------------------------- |
| Bits 31 – 32-N | **AddrPrefix**   | Network server 編號，表示出在哪個 network。概念大概是"班級"                |
| Bits 31-N – 0  | **NwkAddr** | 裝置位址（Device Address within that network），概念大概是一個班級內的"座號" |

- AddrPrefix（地址前綴） 用於識別目前管理該裝置的 Network Server。
  - 當裝置進行 漫遊（Roaming） 時，AddrPrefix 讓外部網路能快速辨認出哪個伺服器擁有該裝置的控制權。
    - 如果前後 AddrPrefix 不一樣，就可以代表漫遊。
- NwkAddr（Network Address）
  - 由 Network Server 或網路管理者 任意指派的裝置識別碼。
  - 它在同一個網路中必須唯一，但在不同網路中可以重複使用（因為由 AddrPrefix 區分）。
  - NwkAddr 通常用於內部路由與裝置識別。

### OTAA
在 OTAA（Over-The-Air Activation，空中啟用） 模式下，終端裝置必須先完成一次 Join（入網）流程，才能與 Network Server 進行任何資料交換。當裝置遺失會話相關資訊（Session Context，例如金鑰或 DevAddr）時，必須重新執行一次 Join 程序，以重新取得新的會話金鑰與裝置位址。

### Join Procedure
無論是 Join-Request 還是 Rejoin-Request，最後都要獲得 server 驗證裝置身份後所回覆的加密 Join-Accept 訊息。
#### Join-request message
- Join-Request（加入請求） 由 終端裝置（End Device） 主動發起，是 OTAA（Over-The-Air Activation） 流程的第一步。
- 該訊息用來通知網路伺服器（Network Server）：「我要加入 LoRaWAN 網路」。
- Join-Request 訊息未加密（明文傳送）。
- 可使用任意 資料速率（Data Rate） 與 隨機頻率跳頻（Frequency Hopping），在指定的入網頻道上發送，以提升成功率與抗干擾性。
- DevNonce（Device Nonce）
  - 當裝置首次上電時，DevNonce 從 0 開始。
  - 每次發送 Join-Request 時，DevNonce 都會 +1。
  - Network Server 會記錄裝置的最後 DevNonce 值，若偵測到重複或未遞增的 DevNonce，會忽略該 Join-Request（防止重放攻擊）。

| 欄位名稱         | 大小（Bytes） | 說明                       |
| :----------- | :-------- | :----------------------- |
| **JoinEUI**  | 8         | 加入伺服器識別碼（Join Server ID） |
| **DevEUI**   | 8         | 裝置唯一識別碼（Device EUI）      |
| **DevNonce** | 2         | 裝置隨機計數器（Device Nonce）    |


`;export{n as default};
