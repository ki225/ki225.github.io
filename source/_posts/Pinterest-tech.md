---
title: Pinterest-tech
date: 2025-02-24 20:51:02
tags:
---

在準備 0307 大使工作坊的過程中，因為主題是做出類似 Pinterest 圖片搜尋引擎效果，所以希望在正式進入實作環節前的以圖搜圖、以文字搜圖效果，

## 前言
Pinterest 是一個視覺化搜尋引擎，讓使用者能夠發現並儲存各種主題的靈感，如食譜、居家設計、時尚等。使用者可以透過 Pin（釘圖）將喜愛的內容儲存到個人圖版（Board），方便日後參考和整理。此外，Pinterest 提供強大的搜尋功能，使用者可以透過關鍵字或圖片進行搜尋，發掘更多相關的點子。平台也支援社交互動，使用者可以追蹤其他人的圖版，分享靈感，並與朋友交流。

為了提升使用者體驗，Pinterest 開發了 PinSage 和 ItemSage 等技術。PinSage 是一種基於圖卷積網路（Graph Convolutional Network, GCN）的推薦系統演算法，透過從龐大的圖資料中學習每個 Pin（釘圖）的 embeddings 來學習 pins 之間的圖結構關係，並使用最近鄰搜尋（Approximate Nearest Neighbors, ANN）技術來加速推薦結果的檢索，以在數十億個 pins 中即時尋找最相關的內容。而 ItemSage 採用多任務學習（Multi-Task Learning），可以同時學習多種使用者互動行為，從而提高整體推薦效果。


可以整合文字、影音、圖片等不同類型的數據與多任務學習來優化購物推薦，確保推薦系統的準確性、效率與個人化體驗。這些技術使 Pinterest 能夠在龐大的視覺資料庫中快速識別相關內容，提升使用者體驗，並增強購物與廣告變現的能力。

Pinterest 上的購物推薦需要針對不同的使用者行為（如點擊、儲存、加入購物車等）進行最佳化。ItemSage 採用多任務學習（Multi-Task Learning），可以同時學習多種使用者互動行為，從而提高整體推薦效果。例如，某位使用者習慣先儲存商品再購買，而另一位則可能直接點擊購買，ItemSage 能夠根據這些行為模式提供個人化的推薦結果。


## references
- [PinSage: A new graph convolutional neural network for web-scale recommender systems](https://medium.com/pinterest-engineering/pinsage-a-new-graph-convolutional-neural-network-for-web-scale-recommender-systems-88795a107f48)
- [从CNN到GCN的联系与区别——GCN从入门到精（fang）通（qi）](https://blog.csdn.net/weixin_40013463/article/details/81089223)