const e=`---
title: Hyperledger Fabric 筆記 - 應用程式與網路的橋樑 Connection Profile 
date: 2025-04-05 08:38:15
tags: [hlf]
---

在專題研究如何把 Federate Learnning 串接到區塊鏈上的時候，恰好看到 HLF 有 connection profile 這個技術觀念。根據[官方文件](https://hyperledger-fabric.readthedocs.io/en/release-2.2/developapps/connectionprofile.html#scenario)的說明，connection profile 是一個在網路內很重要的溝通角色，因為它明白如何與網路內的元素溝通，像是 peers orderers 與 CAs 等等，它也包含與這些元件相關的通道 Channel 與 Organization 資訊。其實簡單來說它就像是 Gateway 的存在，用 connection profile 就能讓外部輕鬆跟網路內部溝通。


## 為什麼要使用 Connection Profile？
使用 Connection Profile 的最大理由是 簡化應用程式與區塊鏈網路的互動流程。在一個 Hyperledger Fabric 網路中，可能包含多個組織與節點，網路拓撲可能相當複雜，但或許某個應用程式根本不需要了解整個 HLF 網路的全貌。

### Connection Profile 如何簡化網路交流複雜度 ?
根據[官方文件](https://hyperledger-fabric.readthedocs.io/en/release-2.2/developapps/connectionprofile.html#scenario)的說明，其實 Connection Profile 描述的是網路的「某一視角（view）」，這是因為它只需要包含該應用程式 Gateway 所需的足夠資訊即可，所謂「足夠資訊」代表擁有足以處理交易提交或事件通知的資訊。

舉例而言，在以下範例中，兩個應用程式——\`issue\` 與 \`buy\`——分別使用了 \`Gateway 1\` 和 \`Gateway 2\`，並分別由 Connection Profile 1 和 2 進行設定。每一份設定檔都描述了 MagnetoCorp 與 DigiBank 網路元件中的不同子集。每個連線設定檔都必須包含足夠的資訊，使 Gateway 能代表 \`issue\` 與 \`buy\` 應用程式與網路互動。

至於為何說「連線設定檔不需要詳盡描述整個網路通道，它只需要包含 Gateway 所需的足夠資訊即可」? 以這個例子繼續說明，在上述的網路中，Connection Profile 1 至少需要包含 issue 交易所需的背書組織與 Peers，同時也要能識別哪些 Peer 會在交易被寫入帳本後通知 Gateway。

![alt text](images/HLF/img1.png)

## 類別
- 靜態模式(Static gateways)：需要完整描述網路的所有元件，適合已知穩定的拓撲，通常由系統管理員建立。
- 動態模式(dynamic gateways)：可透過 Service Discovery 動態擴充資訊。，其餘由網路自動探索，非常適合開發與測試階段，加快上手速度。`;export{e as default};
