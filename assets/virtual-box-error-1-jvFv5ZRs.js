const t=`---
title: VirtialBox 網路排查 VERR_INTNET_FLT_IF_NOT_FOUND
date: 2025-05-04 11:38:56
tags: [VirtualBox, networking]
---

在我要打 Linux networking 指令筆記的時候，打開虛擬機發現噴了以下錯誤
\`\`\`
Failed to open/create the internal network 'HostInterfaceNetworking-VirtualBox Host-Only Ethernet Adapter' (VERR_INTNET_FLT_IF_NOT_FOUND).
\`\`\`
這句錯誤其實是代表 VirtualBox 嘗試使用 Host-Only Network 介面時失敗了，而原因是找不到對應的網路介面，所以解決方式就是想辦法把 Host-Only Network 介面生出來。

## Host-Only Network 介面
### 簡介
簡單來說，Host-Only Networking 是一種僅讓虛擬機（VM）與主機（Host）通訊的網路模式，而不能連線至外部網路，這樣的作法實現了以下幾點：

- 不需要實體網路卡
- 不會讓 VM 暴露在主機的外部網路中，因此較安全
- 適合在主機與 VM 或 VM 與 VM 間建立隔離的本地網路

### 實現方式
VirtualBox 會在主機上建立一個虛擬的網路介面（Host-Only Adapter），類似 loopback interface，所有設為 Host-Only 的 VM 會像是透過虛擬交換器（switch）彼此相連，並與主機通訊，可以看到[下圖](https://www.nakivo.com/blog/virtualbox-network-setting-guide/)就清楚的表示 Host-Only Adapter 對於虛擬機的作用。

在圖片裡，虛擬機（VM1 ~ VM3）與主機透過這個私有網段進行通訊，而他們能使用的網段來自於 Host-Only Network 網段提供的 \`192.168.56.0/24\`，一旁的 DHCP Server 位於 \`192.168.56.100\`，則是用來為 Host-Only 網段的 VM 提供自動 IP 配置（如 VM1: 192.168.56.101）。

![](images/networking/virtualbox/img1.png)


## 如何設定 Host-Only Networking ?
進入到 VirtualBox 選取 VM → 設定 → 網路，我們需要勾選「啟用網路介面卡」，選擇 Attached to：Host-Only Adapter。但由於我之前就有設定過了，所以可以看到我已經有了 Host-Only Adapter。

![](images/networking/virtualbox/img2.png)

接著進入到 Windows 控制台 → 網路和網際網路 → 網路和共用中心  → 變更介面卡設定，畫面會類似下方。

![](images/networking/virtualbox/img3.png)

找到 VirtualBox 的 Host-Only 網路介面，點右鍵並選擇"停用"，再點右鍵並選擇"啟用"，等待大概十秒就可以啦!

## References
- [Windows 10 - Host Only Adapters](https://forums.virtualbox.org/viewtopic.php?t=94277)
- [VERR_INTNET_FLT_IF_NOT_FOUND of death](https://forums.virtualbox.org/viewtopic.php?f=6&t=94568&p=456926#p456926)
- [VirtualBox Network Settings: Complete Guide](https://www.nakivo.com/blog/virtualbox-network-setting-guide/)`;export{t as default};
