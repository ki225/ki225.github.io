---
title: cannot visit container by containerIP:8000/api
date: 2025-05-04 17:19:37
tags: [networking, docker]
---

在 Windows 上啟動 Docker，Docker 會建立一個 User-defined networks，虛擬的 bridge 網路，此時產生的 container IP 都是屬於這個虛擬網路，如此一來就可以透過彼此的 IP 或容器名稱互相通訊。但也因此只有其他 container 或 Docker 自己可以看到，Windows 主機是看不到這個 container IP 的，導致打 `http://${containerIP}:8000/api` 失敗。

container IP 是 Docker 內部網路的 IP，不屬於主機的網路

這是因為 Docker 預設的網路架構與Windows 主機的網路限制使得你無法直接透過 container 的內部 IP 從主機（host）進行存取。