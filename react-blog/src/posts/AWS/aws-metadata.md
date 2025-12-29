---
title: AWS Metadata？
date: 2025-02-16 00:50:29
tags: [AWS]
---

# 什麼是 AWS Metadata？

AWS Metadata（AWS Instance Metadata Service，IMDS）是一種提供 EC2 執行個體相關資訊的機制，允許應用程式和腳本存取該執行個體的元數據（如執行個體 ID、區域、IAM 資訊等）。AWS 提供兩個版本的 Metadata 服務：

- **IMDSv1**：透過 HTTP 請求 `http://169.254.169.254/latest/meta-data/` 來取得元數據。
- **IMDSv2**：增強了安全性，需要透過 Token 來存取。

開發者可使用 AWS Metadata 來獲取 IAM 角色憑證、監控 EC2 狀態或是動態設定應用程式參數。例如，要獲取執行個體的公有 IP，可以執行：

```bash
curl http://169.254.169.254/latest/meta-data/public-ipv4
```

# `systemctl` 指令介紹與背後原理

`systemctl` 是用於管理 systemd 服務的指令。`systemd` 是現代 Linux 發行版（如 Ubuntu、CentOS、Amazon Linux 2）預設的初始化系統（init system），負責管理系統啟動、服務與資源。

## 常見 `systemctl` 指令
`systemctl` 代表 **system control**，它是 Linux `systemd` 初始化系統（init system）的一部分，主要用來管理系統服務（services）、單元（units）和系統狀態（state）。  


### 啟動、停止與重啟服務
```bash
sudo systemctl start <service-name>   # 啟動服務
sudo systemctl stop <service-name>    # 停止服務
sudo systemctl restart <service-name> # 重啟服務
```

### 查詢服務狀態
```bash
sudo systemctl status <service-name>
```

### 啟用與停用開機自動啟動
```bash
sudo systemctl enable <service-name>   # 設定服務開機啟動
sudo systemctl disable <service-name>  # 取消服務開機啟動
```
簡單來說，`systemctl` 讓你可以啟動、停止、重啟服務，查詢狀態，並設定服務是否隨系統開機自動執行。例如：  

```bash
sudo systemctl start nginx     # 啟動 Nginx 服務
sudo systemctl stop nginx      # 停止 Nginx 服務
sudo systemctl restart nginx   # 重新啟動 Nginx 服務
sudo systemctl status nginx    # 查看 Nginx 服務狀態
sudo systemctl enable nginx    # 設定 Nginx 服務開機自動啟動
sudo systemctl disable nginx   # 停用 Nginx 服務的開機自動啟動
```



### 服務管理的原理
`systemctl` 透過 systemd 管理 `unit`（單元），而每個服務都有對應的 `.service` 檔案，通常位於 `/etc/systemd/system/` 或 `/lib/systemd/system/` 目錄內。這些檔案定義了服務的執行方式、依賴關係等。

在 `systemd` 之前，Linux 主要使用 `SysVinit` 或 `Upstart` 來管理系統服務，但 `systemd` 提供了更高效能的並行啟動機制，並且更容易管理，所以現在大多數的 Linux 發行版都已經採用 `systemd`。
# 為何增添 IAM Role 到 EC2 後 EC2 不一定能馬上更新？

當你為 EC2 執行個體新增 IAM Role 或變更權限時，EC2 並不會立即感知變更，這是因為：
1. **Metadata 緩存機制**：EC2 會緩存 IAM Role 憑證一段時間，因此權限變更不會立即生效。
2. **AWS SSM Agent 依賴 IAM 權限**：如果 EC2 上的 AWS Systems Manager (SSM) Agent 無法獲取新的 IAM 權限，則某些 SSM 命令可能無法執行。

## 解決方法
### 重新啟動 Metadata 服務
如果 IAM Role 更新後無法立即反映在 EC2 上，可以嘗試重新啟動 Amazon SSM Agent，並強制重新整理 Metadata。

```bash
sudo systemctl restart amazon-ssm-agent
```

接著，檢查 AWS 配置來確認 IAM 權限是否正確更新：
```bash
aws configure list
```

若仍然無法取得最新的 IAM 權限，可以嘗試執行：
```bash
curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
```
這將重新獲取 Metadata Token，並顯示 IAM 角色的安全憑證資訊。

透過這些步驟，即可確保 EC2 正確更新 IAM 權限，並讓相關服務正常運行。

---

