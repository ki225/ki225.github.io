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

### Receive Windows
在 LoRaWAN 的設計中，為了節能終端裝置不會隨時接收資料，終端裝置只在每次上行傳輸後短暫打開接收窗等待下行資料，其餘時間都處於休眠狀態。

在 Class A 的 LoRaWAN 裝置中，每當終端裝置傳送完一筆上行資料（Uplink）後，會依序開啟 兩個短暫的下行接收視窗（RX1、RX2），讓網路伺服器有機會傳送資料回裝置。
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

