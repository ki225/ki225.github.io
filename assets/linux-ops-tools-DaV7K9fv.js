const n=`---
title: Linux 操作與系統維運工具
date: 2025-05-15 13:51:36
tags: [Linux, networking]
---

最近在進入 DevOps 大坑，看了許多文章，其中在[這篇文章](https://jackchen890311.github.io/2023/05/24/summer-intern-2023/index.html)看到針對職缺的準備方向，所以想藉此來整理一些常見且實用的 Linux 操作與系統維運工具，也順便研究一下這些工具可能會如何運用在 DevOps 上。

## 為何要學 Linux ?
入坑 DevOps 一定要先學會基本的 Linux 運用，但為什麼要學 Linux 而不是其他作業系統環境呢? 我想原因有很多種，而救我的觀察我認為是以下幾點因素:
1. 開源特性：靈活性與穩定性的基礎 
   - 快速修補與穩定性：開源社群可迅速追蹤與修復底層 bug，提升系統穩定性與安全性。
   - 高度可自訂：使用者可根據需求調整核心設定與系統行為，打造專屬部署環境。
   - 工具生態豐富：許多第三方 DevOps 工具（如 Docker、Kubernetes、Ansible）皆以 Linux 環境為主要開發與運行平台，整合性強、相容性佳。
2. 雲端與虛擬化服務的主力平台
   - 雲端平台主流 OS：無論是 AWS EC2、Google Cloud Compute Engine、Azure VM，預設環境大多為 Linux，且支援最佳
   - 容器與 Kubernetes：Docker、K8s 等容器平台的核心設計基於 Linux namespaces 與 cgroups，熟悉 Linux 可更有效排查容器與資源調度問題
   - 基礎架構即程式碼（IaC）工具整合：Terraform、Chef、Puppet、Ansible 等自動化工具主要針對 Linux 系統設計。

## 基礎指令
DevOps 的任務一般都會在 Linux 環境進行操作，所以 CLI 操作是 DevOps 工作日常的基礎，常見的 CLI 如下:
\`\`\`bash
ls -l       # 檢查檔案詳細資訊  
cd /xxx     # 切換到設定資料夾  
cat file    # 檢視檔案內容  
grep "error" app.log  # 從 log 中搜尋關鍵字
\`\`\`

當然還有更多指令，比方說創建資料夾什麼的，這個推薦去看 Youtube 的整理影片或網路上的筆記。

## 查看硬體資訊（CPU / 記憶體 / 網路）
了解如何用指令查看硬體資訊（CPU、記憶體、網路）對 DevOps 工程師特別重要，DevOps 工作常接觸基礎設施，又或是使用容器部署，這時候如何監控資源來進行錯誤排查就是非常重要的事。
\`\`\`bash
lscpu       # 查看 CPU 規格與核心數  
free -h     # 顯示記憶體使用情況（人類可讀）  
lsblk       # 顯示磁碟分割與裝置名稱  
lspci | grep Eth  # 顯示網卡設備
\`\`\`

### free -h
- \`free\`：顯示記憶體與 swap 使用狀況。
- \`-h\`：human-readable，自動用 KiB、MiB、GiB 顯示，方便閱讀。

| 欄位名稱         | 意義與用途                                        |
| ------------ | -------------------------------------------- |
| \`total\`      | 總記憶體容量（RAM）                                  |
| \`used\`       | 已使用的記憶體（不含 buffer/cache）                     |
| \`free\`       | 完全沒被使用的記憶體（極少，因 Linux 會盡量用滿）                 |
| \`shared\`     | 多個程序共用的記憶體（例如 tmpfs、共享記憶體區）                  |
| \`buff/cache\` | 系統為了加速讀寫所使用的快取與 buffer 記憶體                   |
| \`available\`  | **實際可供使用** 的記憶體總和（\`free\` + 一部分 \`buff/cache\`） |

\`\`\`
$ free -h
              total        used        free      shared  buff/cache   available
Mem:          7.8Gi       984Mi       4.1Gi       9.0Mi       2.7Gi       6.5Gi
Swap:         2.0Gi          0B       2.0Gi
\`\`\`
### \`lsblk\`
當執行 lsblk 時，會看到兩種重要類型的裝置：Loop Devices（loop0 ~ loopN）和實體磁碟（如 sda），其中 Loop Device 是一種虛擬的塊裝置（Block Device），它將一個普通的檔案（通常是 \`.iso\`、\`.img\`、或 \`.snap\` 檔）模擬成一個磁碟設備，讓我們可以像操作實體磁碟一樣掛載與存取，且不會佔用實體磁碟容量；而實體磁碟與分割（如 sda, sda1, sda2, ...）
\`\`\`
$ lsblk
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
loop0    7:0    0     4K  1 loop /snap/bare/5
loop1    7:1    0  63.8M  1 loop /snap/core20/2501
loop2    7:2    0  63.8M  1 loop /snap/core20/2571
loop3    7:3    0  73.9M  1 loop /snap/core22/1908
loop4    7:4    0 346.3M  1 loop /snap/gnome-3-38-2004/119
loop5    7:5    0  91.7M  1 loop /snap/gtk-common-themes/1535
loop6    7:6    0    46M  1 loop /snap/snap-store/638
loop7    7:7    0  73.9M  1 loop /snap/core22/1963
loop8    7:8    0 349.7M  1 loop /snap/gnome-3-38-2004/143
loop9    7:9    0  44.5M  1 loop /snap/snapd/23771
loop10   7:10   0  12.2M  1 loop /snap/snap-store/1216
loop11   7:11   0  50.9M  1 loop /snap/snapd/24505
sda      8:0    0    80G  0 disk 
├─sda1   8:1    0   512M  0 part /boot/efi
├─sda2   8:2    0     1K  0 part 
└─sda5   8:5    0  79.5G  0 part /
sr0     11:0    1  56.1M  0 rom  /media/vboxuser/VBox_GAs_7.1.0
\`\`\``;export{n as default};
