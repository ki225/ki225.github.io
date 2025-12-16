---
title: docker container network
date: 2025-05-15 10:59:17
tags:
---

## Docker Network 基礎概念
- 什麼是 Docker Network？
    - Docker Network 是 Docker 平台用來連接和管理容器間網路通訊的機制，允許多個容器在同一主機或跨多主機間透過虛擬網路互相通訊。而更值得去討論的是 docker 所創立出來的 container networking
- Container networking
    - 容器之間，或容器與非 Docker 工作負載之間連接與通訊的能力。
    - 容器預設是啟用網路功能的，且能夠發起外部連線。容器只會看到一個具備 IP 位址、閘道（gateway）、路由表、DNS 服務及其他網路細節的網路介面。
        - 唯有當容器使用 none 網路驅動時，才不會有這些網路設定。
    - 容器對其網路環境沒有「意識」或「識別能力」
        - 容器內部的應用程式不會知道自己是連接在 Docker 建立的哪一種網路（如 bridge、host、overlay 等）。
        - 容器也不會分辨通訊對象是另一個 Docker 容器、其他虛擬機器，或是任何其他非 Docker 的主機或設備。


## Docker Network 類型
Docker 的網路子系統是可插拔（pluggable）的，透過不同的驅動程式（drivers）來實現，細節可以參考[官方文件](https://docs.docker.com/engine/network/drivers/)

![image](https://hackmd.io/_uploads/SJl08B3--xg.png)

| 類型      | 用途說明                | 可跨主機 | 是否有隔離 | 特別適用場景      |
| ------- | ------------------- | ---- | ----- | ----------- |
| Bridge  | 單機容器互通              | 否    | 是     | 預設網路、開發環境   |
| Host    | 使用主機網路              | 否    | 否     | 高效能需求       |
| None    | 完全隔離                | 否    | 是     | 安全性測試或全離線   |
| Overlay | 多主機容器互通，Swarm 支援    | 是    | 是     | 分散式應用、Swarm |
| Macvlan | 模擬實體主機，分配 MAC       | 否    | 是     | 舊系統整合       |
| IPvlan  | 更底層控制，支援 VLAN 與路由控制 | 否    | 是     | 資訊管理高需求場域   |

![image](https://hackmd.io/_uploads/Sk24LeZZee.png)

### Bridge Network（預設橋接網路）
- Docker engine 會建立必要的 Linux bridge、內部介面、iptables 規則以及主機路由，讓連接到同一橋接網路的容器可以互相通訊，同時與未連接該網路的容器隔離，例如從下圖可以看到不同 bridge 底下的容器不能直接溝通。
    - Bridge Network 是建立在 Linux bridge 之上，而 Linux bridge 模擬一個 Layer 2 網路，主要負責同一主機內容器間的資料鏈路層封包轉發。
- 橋接網路適用於運行於單一 Docker daemon 主機上的容器，若要實現跨不同 Docker daemon 的容器通訊或 Layer-3 路由，可以使用 overlay network。
  
  ![image](https://hackmd.io/_uploads/S1uVagZZlg.png)
   ![image](https://hackmd.io/_uploads/S1x4r3Z-ge.png)
### Host Network（主機網路）
- 移除容器與 Docker 主機之間的網路隔離，直接使用主機的網路。

 ![image](https://hackmd.io/_uploads/HkcHrhWWll.png)
### None Network（無網路）
完全隔離容器，使其無法與主機或其他容器通訊。
### Overlay Network（疊加網路）
- Overlay 網路驅動程式會在多個 Docker daemon 主機之間建立一個分散式網路，用來連接多個 Docker daemon，使 Swarm 服務與容器能跨節點通訊。這種方式不需進行作業系統層級的路由設定。
- Overlay 網路多數是使用 VXLAN 技術封裝封包，使得封包能在主機間的底層網路傳輸。若啟用加密選項，則在 VXLAN 層級使用 IPsec 進行加密，保障資料安全。
    - VXLAN 是一種「隧道技術」，把虛擬網路封包包裹起來，透過底層網路傳送，讓不同實體主機的虛擬機器或容器能像在同一個局域網內通訊。
  
   ![image](https://hackmd.io/_uploads/H1teCxZbel.png)
   ![image](https://hackmd.io/_uploads/SkxtfSn-bll.png)
  ![image](https://hackmd.io/_uploads/ByDxeMbZel.png)
### ipvlan
IPvlan 網路讓使用者完全掌控 IPv4 與 IPv6 位址。VLAN 驅動基於此，讓管理者可完全控制第 2 層 VLAN 標記，甚至 IPvlan 第 3 層路由，適合需要底層網路整合的使用者
### Macvlan Network（MAC 地址網路）
允許為容器分配 MAC 位址，讓容器在網路上看起來像一個實體裝置。Docker 守護程序會依 MAC 位址將流量導向容器。使用 macvlan 驅動有時是處理需要直接連接實體網路（而非透過 Docker 主機網路堆疊路由）的舊有應用程式的最佳選擇。

### Docker daemon
使用者透過 docker cli 來對 docker daemon 操作，當 Docker Daemon 接收這些請求，執行對應的操作，並回傳結果給 CLI

![image](https://hackmd.io/_uploads/BJy1ul-Wxl.png)

## Docker Network 的架構與組成
### Network Namespace 概念
Namespace 是 Linux Kernel 用於實現資源隔離的一項功能，它能讓不同的 process 看到不同的系統資源視圖，達到彼此互不干擾的效果。

Docker 利用 Namespace 來隔離容器，使每個容器彷彿擁有自己獨立的系統環境。

![image](https://hackmd.io/_uploads/HyphXW--gg.png)

### Container Network Interface (CNI)
CNI 整合了許多網路插件，像是 bridge、ipvlan 等 CNI plugin，提供最簡單且單一的網路架構，更多可以參考[這篇筆記](https://www.hwchiu.com/docs/2018/cni-compare)

![image](https://hackmd.io/_uploads/S19CBhZZgx.png)


### Docker Daemon 與 Network Driver 互動

Docker Daemon 是 Docker 系統的核心服務，負責管理容器的生命週期、映像檔、網路及儲存資源。Daemon 接收來自 Docker CNI 或 API 的指令，並執行相應操作。

Network Driver 是 Docker 用來實現容器網路功能的模組。它負責建立、管理及控制容器之間以及容器與外部世界的網路連結。不同的 Driver 代表不同的網路技術與架構，例如 bridge、overlay、macvlan 等。

Docker Daemon 與 Network Driver 的互動流程：

1. 用戶或系統發出網路相關指令
例如使用 docker network create 建立網路，或在啟動容器時指定網路。
2. Docker Daemon 接收指令並解析
Daemon 判斷網路類型與配置需求，決定使用哪個 Network Driver。
3. 呼叫 Network Driver API
Docker Daemon 通過 Network Driver 的介面呼叫對應驅動程式，要求建立網路資源（如虛擬橋接器、Overlay 網路）或將容器連接到指定網路。
4. Network Driver 執行網路設定
Driver 根據需求在作業系統層面執行相應操作，例如建立 Linux bridge、設定 IPAM（IP 位址管理）、配置路由與防火牆規則。
5. Docker Daemon 監控並管理
Daemon 負責保持網路狀態同步，處理網路事件（如容器新增、刪除），並在容器生命週期中維護網路連線。

![image](https://hackmd.io/_uploads/B1B9njWbgx.png)

- Docker 使用 libnetwork 函式庫作為網路抽象層，統一管理不同 Network Driver 的操作。
- Network Driver 以插件（plugin）形式存在，也就是 CLI，Daemon 動態載入並與之通訊。
- Network Driver 需支援標準 API，確保 Docker Daemon 能呼叫其功能。
- Docker Daemon 透過管理 iptables 規則、Linux namespace、虛擬介面等，實現容器網路隔離與連通。


### 網路橋接 (Bridge) 與虛擬交換機 (vSwitch)

虛擬交換機通常指虛擬化平台（如 VMware vSphere、Hyper-V、Open vSwitch）中提供的軟體交換機，用於連結虛擬機器（VM）或容器的虛擬網路介面，並實現流量轉發與網路隔離


## IP 地址與 DNS 管理
### Docker 網路的 IP 分配機制
Docker 網路中的每個容器會被分配一個私有 IP 位址，以便容器之間及容器與主機或外部網路的通訊。Docker 透過內建的 IP 地址管理（IP Address Management, IPAM） 機制自動分配和管理這些 IP 位址。

而 [docker 官方文件](https://docs.docker.com/reference/compose-file/networks/)也提供透過於網路設定 `docker-compose.yaml` 增加`ipam` 以自訂 IPAM 配置的物件。它可以包含多個可選屬性，用來精細控制容器的 IP 位址分配方式。

```yml
networks:
  mynet1:
    ipam:
      driver: default
      config:
        - subnet: 172.28.0.0/16
          ip_range: 172.28.5.0/24
          gateway: 172.28.5.254
          aux_addresses:
            host1: 172.28.1.5
            host2: 172.28.1.6
            host3: 172.28.1.7
      options:
        foo: bar
        baz: "0"
```

### Docker 內建 DNS 解析

當容器使用預設橋接網路啟動時，Docker daemon 會將主機中 `/etc/resolv.conf`、`/etc/hosts` 及 `/etc/hostname` 檔案中所有非本地回環位址（non-localhost）的設定複製到容器內，並讓容器直接繼承 `/etc/resolv.conf` 設定；如果找不到非本地回環的設定，容器內的 `/etc/resolv.conf` 將會被初始化為硬編碼的 DNS 伺服器 `8.8.8.8`。如果主機的 DNS 設定改變（例如 DHCP 更新 DNS），已經運行中的容器內的 `/etc/resolv.conf` 不會自動更新，除非容器重啟。

自訂網路容器則使用 Docker 內建 DNS 伺服器，並轉發請求給主機 DNS。

![docker_container_dns_issue-3](https://hackmd.io/_uploads/SyGBonbWgg.jpg)



## Reference
- https://ithelp.ithome.com.tw/articles/10236066?sc=rss.iron
- https://blog.devgenius.io/docker-networking-all-types-explained-with-real-examples-ab1cf11f4cb2
- https://www.oreilly.com/library/view/learn-docker/9781788997027/0ea54c42-5c46-4a30-b935-c65b5aa1f0ab.xhtml
- https://collabnix.com/a-beginners-guide-to-docker-networking/
- https://www.educba.com/docker-networking/