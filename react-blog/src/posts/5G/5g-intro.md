---
title: 行動通訊網路概述
date: 2025-10-18 19:49:14
tags: [5g, networking]
---

## 行動通訊技術演進總覽表
| 世代       | 名稱              | 全名                                         | 主要技術                    | 傳輸方式                       | 主要特色                      | 備註                      |
| -------- | --------------- | ------------------------------------------ | ----------------------- | -------------------------- | ------------------------- | ----------------------- |
| **1G**   | Analog Cellular | 第一代行動通信系統                                  | AMPS（美國）、NMT（北歐）等       | **類比 (Analog)**            | 只能進行語音通話、品質差、無加密。         | 手機初始時代（1980s），每通話需專用頻道。 |
| **2G**   | **GSM**         | Global System for Mobile Communications    | TDMA、FDMA               | **數位 (Digital)**           | 支援語音、簡訊 (SMS)、漫遊與基本資料傳輸。  | 首個全球化的行動標準。             |
| **2.5G** | **GPRS**        | General Packet Radio Service               | 封包交換 (Packet Switching) | **混合（電路＋封包）**              | 新增封包數據傳輸，實現初步行動上網。        | 可達約 56–114 kbps。        |
| **3G**   | **UMTS**        | Universal Mobile Telecommunications System | WCDMA                   | **全封包 (Packet Switching)** | 同時支援語音與高速資料（影像、網頁、串流）。    | 速率達 384 kbps–2 Mbps。    |
| **4G**   | **LTE**         | Long Term Evolution                        | OFDMA、SC-FDMA           | **All-IP (全封包)**           | 高速行動網路、低延遲、支援 VoLTE。      | 實現寬頻化與智慧手機時代。           |
| **4G+**  | **LTE-A**       | LTE-Advanced                               | 載波聚合、MIMO、多天線           | **All-IP (全封包)**           | 更高傳輸速率（上看 1 Gbps）、更佳頻譜效率。 | 為 5G 的過渡階段技術。           |

## 5G頻段特性

5G NR (New Radio)為 3GPP 制定的第五代無線接取標準（TS 38.300 系列），頻段分為 Sub-6GHz（中頻段）和 mmWave（>6GHz）。

| 類別       | **中頻段 (Mid Band)**           | **高頻段 (High Band / mmWave)**   |
| ---------- | ---------------------------- | ------------------------------ |
| **頻段區間**   |2 GHz ～ 6 GHz                | > 6 GHz（通常為毫米波 mmWave 頻段）      |
| **代表頻段**   |3.3 ～ 4.2 GHz、4.4 ～ 5.0 GHz  | 24.25 ～ 29.5 GHz、37 ～ 43.5 GHz |
| **主要支援特性** |  eMBB、URLLC、mMTC              | eMBB（主打高速）                     |
| **主要功能**   |  **訊號涵蓋 + 系統容量平衡**            | **超高頻寬、超高速率**                  |
| **資料速率**   | 百 Mbps ～ 1 Gbps              | 可達 10 ～ 20 Gbps                |
| **涵蓋範圍**   |中等（城市區域）                     | 最小（數十公尺至數百公尺）                  |
| **部屬時期**   | 初期 ～ 中期                      | 中期 ～ 晚期                        |
| **部屬區域**   | 人口密集區（市中心、商圈）                | 特定地點（體育館、車站、機場）                |
| **基站形式**   |大型基地台 + 街道小型基地台 (Small Cell) | 室內/街道級小型基地台                    |
| **優點**     | 傳輸速度與覆蓋兼顧                    | 傳輸速率極高、延遲最低                    |
| **缺點**     |成本中等、干擾需控管                   | 穿透力弱、需高密度布建                    |

## 5G 三大應用場景比較表
| 名稱        | 全名                                           | 中文名稱      | 主要特色                       | 代表應用                       | 技術重點                             |
| --------- | -------------------------------------------- | --------- | -------------------------- | -------------------------- | -------------------------------- |
| **eMBB**  | enhanced Mobile Broadband                    | 增強型行動寬頻   | 高速率、大頻寬、高用戶密度              | 4K/8K 串流影音、雲端遊戲、AR/VR、遠距教育 | 使用 **中/高頻段**，強調**頻寬提升**與**用戶體驗** |
| **URLLC** | Ultra-Reliable and Low-Latency Communication | 超高可靠低延遲通訊 | 延遲極低（<1 毫秒）、可靠性極高（99.999%） | 自駕車、遠距手術、智慧工廠、電網控制         | 核心為**低延遲協定設計、邊緣運算 (MEC)**、網路切片   |
| **mMTC**  | massive Machine-Type Communication           | 大規模機器型通訊  | 支援**大量裝置連接**（百萬級/km²）      | 智慧城市、智慧電錶、農業感測、環境監控        | 著重**省電、長連接時間、廣覆蓋**               |

## 5G 核心網路架構演進
在 5G core network 中, 以 CUPS 技術將控制面(Control Plane)與使用者面(User Plane)切割，控制信令集中於核心，資料傳輸則就近於邊緣處理，提升速度與靈活性。

| 技術名稱                | 全名                                | 中文名稱       | 核心概念                                                      | 主要優點                         | 實際應用                            |
| ------------------- | --------------------------------- | ---------- | --------------------------------------------------------- | ---------------------------- | ------------------------------- |
| **SBA**             | Service-Based Architecture        | 服務化架構      | 將核心網路功能以**服務形式（Service）** 模組化與 API 化，透過 HTTP/REST 介面彼此通訊。 | 網路功能軟體化、可虛擬化部署、開發敏捷性高。       | 提供快速擴展與更新，例如 AMF、SMF、UPF 可獨立升級。 |
| **CUPS**            | Control and User Plane Separation | 控制面與使用者面分離 | 將**控制面 (Control Plane)** 與**使用者面 (User Plane)** 拆開部署。     | 支援**分散式部署**（中央與邊緣資料中心）、減少延遲。 | 可在邊緣部署 UPF，加速自駕車、AR/VR 等低延遲服務。  |
| **Network Slicing** | —                                 | 網路切片       | 將一個實體網路切成多個**虛擬、獨立的子網 (Slice)**。                          | 根據應用需求客製化 QoS、延遲、頻寬等參數。      | 不同切片支援不同服務，如 eMBB、URLLC、mMTC。   |


![alt text](images/5g/img1.png)

## 5G NR gNB 架構與介面整理
### gNB 的分層架構
| 模組                         | 全名                | 主要功能                                 | 對應層級                |
| -------------------------- | ----------------- | ------------------------------------ | ------------------- |
| **CU（Central Unit）**       | Centralized Unit  | 控制面與高層資料處理，例如 RRC、SDAP、PDCP。         | 核心層 (Central Unit)  |
| **DU（Distributed Unit）**   | Distributed Unit  | 負責無線資源控制與資料鏈路層功能，如 RLC、MAC、PHY-high。 | 分散層 (Edge / Access) |
| **RRH（Remote Radio Head）** | Remote Radio Head | 處理射頻層 (PHY-low)，與天線模組連接。             | 實體層 (Radio)         |

### 主要協定層 (Protocol Stack)
| 協定層                                         | 功能                  |
| ------------------------------------------- | ------------------- |
| **RRC (Radio Resource Control)**            | 負責連線管理、無線資源分配、移動控制。 |
| **SDAP (Service Data Adaptation Protocol)** | 將 QoS 流映射到 PDCP。    |
| **PDCP (Packet Data Convergence Protocol)** | 處理加密、完整性保護、壓縮。      |
| **RLC (Radio Link Control)**                | 分段/重組封包、錯誤更正。       |
| **MAC (Medium Access Control)**             | 排程與通道多工。            |
| **PHY (Physical Layer)**                    | 實際無線訊號調變、編碼、傳輸。     |

### 5G gNB 介面對應與功能
| 介面名稱            | 方向                       | 功能說明                           |
| --------------- | ------------------------ | ------------------------------ |
| **NG-C / NG-U** | gNB ↔ 5G Core（AMF / UPF） | 與核心網連線：NG-C 為控制面、NG-U 為使用者面。   |
| **Xn-C / Xn-U** | gNB ↔ gNB                | 基地台之間的控制與資料通訊（Xn介面取代 4G 的 X2）。 |
| **E1**          | CU-CP ↔ CU-UP            | 在中央單元內部分離控制與使用者面。              |
| **F1-C / F1-U** | CU ↔ DU                  | 控制與資料分流介面，實現高層功能分離。            |
| **F2-C / F2-U** | DU ↔ RRH                 | 進一步的低層分離，負責射頻與訊號傳輸。            |

![alt text](images/5g/img4.png)


## 4g 如何過渡到 5g?
目前大多使用者仍然維持使用 4g，要如何兼顧兩種設備的使用者呢? 其實在 4G 與 5G 過渡階段，ng-eNB 讓 4G LTE 手機仍能透過 5G 核心網使用部分 5G 服務；而 gNB 則是完整支援 5G NR 空中介面與模組化架構（CU/DU/RU 拆分）的新一代基地台，具備更高頻寬、低延遲與彈性部署能力。

| 項目        | **ng-eNB**                                      | **gNB**                                                                                                           |
| --------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **全名**    | Next Generation eNodeB                          | Next Generation NodeB                                                                                             |
| **用途**    | 讓使用 4G LTE 無線介面的裝置（UE）能連接到 **5G 核心網 (5G Core)** | 讓使用 **5G NR（New Radio）** 介面的裝置連接到 5G 核心網                                                                          |
| **連線介面**  | LTE 空中介面（E-UTRA）                                | 5G NR 空中介面                                                                                                        |
| **對接核心網** | 透過 **NG 介面** 連接 5G Core (NG-C, NG-U)            | 同樣透過 NG 介面連接 5G Core                                                                                              |
| **設計目的**  | 為 4G 區域提供 5G Core 接入，作為 4G-5G 過渡階段使用            | 完整支援 5G 無線技術，為 5G 網路主要基地台                                                                                         |
| **架構組成**  | 類似傳統 eNB（單一節點）                                  | 拆分為三個功能模組：<br>• **CU（Central Unit）**：控制與管理<br>• **DU（Distributed Unit）**：實體層與 MAC 處理<br>• **RU（Radio Unit）**：射頻收發 |
| **內部介面**  | —                                               | **F1 介面**：連接 CU 與 DU<br>**Xn 介面**：gNB 間交換控制與資料                                                                    |
| **功能特性**  | 提供 E-UTRAN 控制與資料平面終止點                           | 提供 5G NR 控制與資料平面終止點，支援軟體化與彈性部署                                                                                    |
| **應用時期**  | 5G 初期部署（過渡型網路）                                  | 5G 主流與長期部署架構                                                                                                      |

![alt text](images/5g/img3.png)


### 4G EPC vs 5G Core 功能拆分與演進對照表
到了 5G，gNB（Next Generation NodeB） 取代 eNB，支援更靈活的虛擬化與邊緣部署，提升傳輸效率與網路彈性。

| 4G EPC 元件                                                                             | 5G Core 對應功能                                                                  | 主要職責 | 說明                                                       |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---- | -------------------------------------------------------- |
| **MME (Mobility Management Entity)**                                                  | **AMF (Access and Mobility Management Function)**                             | 控制面  | 管理 UE 的註冊、移動、連線與安全控制。MME 在 5G 中拆分出 AMF 與部分 SMF 職能。       |
| **SGW-C (Serving Gateway – Control Plane)** + **PGW-C (PDN Gateway – Control Plane)** | **SMF (Session Management Function)**                                         | 控制面  | 管理 PDU Session 建立、IP 配置與 QoS，取代原本 4G 的閘道控制功能。            |
| **SGW-U (Serving Gateway – User Plane)** + **PGW-U (PDN Gateway – User Plane)**       | **UPF (User Plane Function)**                                                 | 使用者面 | 處理用戶資料封包轉送、封包檢查與流量導向。UPF 可在邊緣節點部署，實現低延遲。                 |
| **HSS (Home Subscriber Server)**                                                      | **UDM (Unified Data Management)** + **AUSF (Authentication Server Function)** | 控制面  | HSS 在 5G 被拆分為：<br>• UDM：管理用戶訂閱資料<br>• AUSF：處理使用者認證與安全程序。 |
| **PCRF (Policy and Charging Rules Function)**                                         | **PCF (Policy Control Function)**                                             | 控制面  | 制定 QoS 與流量政策，並與 SMF、AMF 協作。是 PCRF 在 SBA 架構下的延伸。          |
| — (4G 無對應)                                                                            | **NRF (NF Repository Function)**                                              | 控制面  | 管理並註冊所有 5G 網路功能 (NF) 的 API 資訊，支援動態發現與服務互通。               |
| — (4G 無對應)                                                                            | **NSSF (Network Slice Selection Function)**                                   | 控制面  | 根據服務類型（eMBB、URLLC、mMTC）選擇合適的網路切片。                        |
| — (4G 無對應)                                                                            | **NEF (Network Exposure Function)**                                           | 控制面  | 提供對外 API 介面，使第三方服務可安全使用 5G 網路能力（例如 QoS、位置資訊）。            |
| **PDN / DN (Public Data Network)**                                                    | **DN (Data Network)**                                                         | 使用者面 | 實際的外部資料網路（如網際網路、企業雲端、應用伺服器）。                             |

![alt text](images/5g/img2.png)





## reference
- [ng-eNB vs gNB: Differences in 5G NG-RAN](https://www.rfwireless-world.com/articles/ng-enb-vs-gnb)
- [5G Network Equipment Manufacturers: Modem, Base Station, RAN & Core](https://www.rfwireless-world.com/vendors/5g-network-equipment-manufacturers)