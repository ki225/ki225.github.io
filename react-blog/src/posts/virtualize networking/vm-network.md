---
title: Ubuntu 無法連接網路問題排除筆記  
date: 2025-03-01 11:35:53
tags: [Ubuntu, networking, vm]
---

## 遇到的問題  
在 Ubuntu 22.04 LTS 環境中連線去 GitHub 的時候發現沒辦法連到遠端 repo，後來打開瀏覽器也發現無法上網。


![alt text](images/networking/img1.png)

## 排查 1 `ip route show`

`ip route show` 顯示的是虛擬機上的路由表，這些路由表決定了不同的 IP 地址範圍應該通過哪些網路介面來傳送。
```bash
$ ip route show
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 linkdown 
172.21.0.0/16 dev br-914aac2c12e6 proto kernel scope link src 172.21.0.1 
```
這一行輸出的 `ip route show` 顯示了兩個路由，涉及到 Docker 虛擬網路接口 `docker0` 和 `br-914aac2c12e6`。以下是說明:
- `docker0`
  - `dev docker0`：表示這條路由是通過 docker0 網卡來實現的。docker0 是 Docker 預設的虛擬網橋接口，它通常用來連接 Docker 容器和宿主機的網路。
  - `proto kernel`：這表示該路由是由內核自動添加的，通常這是 Docker 或其他系統設置所創建的路由。
  - `scope link`：表示該路由的範圍是連接範圍，這意味著它只能在本機（即宿主機或相同網段的設備）內進行訪問。
  - `src 172.17.0.1`：這是 Docker 虛擬網橋 docker0 的 IP 地址，這也是該網路接口的來源地址。它位於 172.17.0.0/16 網段內。
  - `linkdown`：表示 docker0 網卡目前處於 "link down" 狀態，也就是網卡目前處於未啟用或不可用狀態，這可能表示 Docker 容器網路接口未啟動。
- `br-914aac2c12e6`
  - `dev br-914aac2c12e6`：表示這條路由是通過名為 br-914aac2c12e6 的網橋接口來實現的。這可能是 Docker 創建的虛擬網橋，將一些容器連接到這個網段中。
  - `proto kernel`：與上面相同，表示這條路由由內核自動創建，可能與 Docker 或其他虛擬網路相關。
  - `scope link`：這條路由的範圍也是連接範圍，指明它只能在同一鏈路（例如同一台主機或同一網段）中有效。
  - `src 172.21.0.1`：這是 `br-914aac2c12e6` 虛擬網橋的 IP 地址。它處於 172.21.0.0/16 網段內，並作為這個網段的來源地址。

其中`br-914aac2c12e6`是 custom bridge，用來作為容器與容器之間的通信:

![alt text](images/networking/img4.png)

很明顯結果沒有出現 `0.0.0.0/0 via <gateway_ip> dev <interface>`，表示沒有 Gateway 可以處理網路流量 (`0.0.0.0/0`表示所有 IP 地址)。

![alt text](images/networking/img3.png)

## 排查 2 `ip addr show`
使用 `ip addr show` 顯示當前系統中各個網路接口的 IP 配置情況，每一個接口都包括了其 MAC 地址、IP 地址、狀態等資訊。在以下結果可以發現有線網卡接口 `enp0s3` 狀態顯示為 `DOWN`，表示此接口目前未啟動或未連接到網路。
```bash
$ ip addr show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: enp0s3: <BROADCAST,MULTICAST> mtu 1500 qdisc fq_codel state DOWN group default qlen 1000
    link/ether 08:00:27:e8:bf:7a brd ff:ff:ff:ff:ff:ff
4: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default 
    link/ether 02:42:b7:3a:7d:af brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
128: br-914aac2c12e6: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:0c:39:6d:54 brd ff:ff:ff:ff:ff:ff
    inet 172.21.0.1/16 brd 172.21.255.255 scope global br-914aac2c12e6
       valid_lft forever preferred_lft forever
    inet6 fe80::42:cff:fe39:6d54/64 scope link 
       valid_lft forever preferred_lft forever
140: vethade60a8@if139: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master br-914aac2c12e6 state UP group default 
    link/ether f6:db:b7:05:ca:8d brd ff:ff:ff:ff:ff:ff link-netnsid 2
    inet6 fe80::f4db:b7ff:fe05:ca8d/64 scope link 
       valid_lft forever preferred_lft forever
166: vethb5ffc04@if165: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master br-914aac2c12e6 state UP group default 
    link/ether 6a:84:4c:21:62:70 brd ff:ff:ff:ff:ff:ff link-netnsid 6
    inet6 fe80::6884:4cff:fe21:6270/64 scope link 
       valid_lft forever preferred_lft forever
168: veth30b3934@if167: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue master br-914aac2c12e6 state UP group default 
    link/ether fa:26:38:79:8b:2c brd ff:ff:ff:ff:ff:ff link-netnsid 7
    inet6 fe80::f826:38ff:fe79:8b2c/64 scope link 
       valid_lft forever preferred_lft forever
```


## 解決的步驟  

### (1) 啟用網路介面  
首先，手動啟用 `enp0s3` 介面：  

```bash
$ sudo ip link set enp0s3 up
```

再次確認介面狀態，確保其已變為 `UP`：  

```bash
$ ip addr show enp0s3
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 08:00:27:e8:bf:7a brd ff:ff:ff:ff:ff:ff
    inet6 fd00::a00:27ff:fee8:bf7a/64 scope global dynamic mngtmpaddr 
       valid_lft 86394sec preferred_lft 14394sec
    inet6 fe80::a00:27ff:fee8:bf7a/64 scope link 
       valid_lft forever preferred_lft forever
```


### (2) 透過 DHCP 重新獲取 IP 位址  
由於介面 `enp0s3` 仍然沒有正確的 IPv4 位址，因此執行 DHCP 客戶端來請求 IP 位址：  

```bash
$ sudo dhclient enp0s3
$ ip addr show enp0s3
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 08:00:27:e8:bf:7a brd ff:ff:ff:ff:ff:ff
    inet 10.0.2.15/24 brd 10.0.2.255 scope global dynamic enp0s3
       valid_lft 86386sec preferred_lft 86386sec
    inet6 fd00::a00:27ff:fee8:bf7a/64 scope global dynamic mngtmpaddr 
       valid_lft 86350sec preferred_lft 14350sec
    inet6 fe80::a00:27ff:fee8:bf7a/64 scope link 
       valid_lft forever preferred_lft forever
```

執行 `ip addr show enp0s3`，此時可見 `inet` 欄位獲得了動態 IPv4 位址 `10.0.2.15/24`：  

```
inet 10.0.2.15/24 brd 10.0.2.255 scope global dynamic enp0s3
```
![alt text](images/networking/img8.png)


### (3) 確認並修正路由設定  
檢查路由表：  

```bash
ip route show
```

結果顯示如下。其中 `default` 表示默認路由，表示如果目標 IP 地址不在其他路由條目中，則會使用這條路由。`via 10.0.2.2` 表示所有未知的 IP 地址將通過 IP 地址為 `10.0.2.2` 的路由器轉發。`dev enp0s3` 則說明這條路由會通過網路介面 `enp0s3` 來達成。

```
default via 10.0.2.2 dev enp0s3 
10.0.2.0/24 dev enp0s3 proto kernel scope link src 10.0.2.15
```

這表示 `enp0s3` 已經有一個預設 Gateway `10.0.2.2`，應該可以正常連線。



### (4) 測試網路連線  
測試是否可以連線到外部網路 External IP，這邊以 Google's DNS server (8.8.8.8) 為例 :

```bash
ping -c 4 8.8.8.8
```

如果 `ping` 成功，則表示網際網路連線正常，但若 `ping google.com` 失敗，則可能是 DNS 設定問題。  



### (5) 修正 DNS 設定（如有需要）  
如果 `ping google.com` 失敗，可能是 `/etc/resolv.conf` 缺少 DNS 伺服器。可手動添加 Google DNS：  

```bash
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
```

再測試 `ping google.com`，確認 DNS 解析功能恢復正常。


## 3. 成功解決原理  

- 問題發生的原因：  
  主要是 `enp0s3` 介面處於 `DOWN` 狀態，無法獲取 IP，導致沒有可用的預設路由，無法連線至網際網路。  
- 解決方式：  
  - 啟用 `enp0s3` 介面 (`ip link set enp0s3 up`)  
  - 透過 DHCP 取得 IP (`dhclient enp0s3`)  
  - 確保路由表中存在正確的預設網關 (`ip route show`)  
  - 測試網路連線 (`ping 8.8.8.8`)  
  - 若 DNS 無法解析，則手動設定 `/etc/resolv.conf`  

## 4. 正常 VM 內網路 Routing Diagram

![alt text](images/networking/img6.png)

![alt text](images/networking/img7.png)

## References
- [[Docker] Bridge Network 簡介](https://godleon.github.io/blog/Docker/docker-network-bridge/)
- [Ubuntu 20.04 temporary failure in name resolution for wired](https://askubuntu.com/questions/1358221/ubuntu-20-04-temporary-failure-in-name-resolution-for-wired)
- [solving chat](https://chat.stackexchange.com/rooms/128602/discussion-between-chili555-and-zedd)
- [Ubuntu 20.04 server不能ping，提示“Temporary failure in name resolution”的解决方法](https://blog.csdn.net/donaldsy/article/details/119973990)