---
title: 為何我剛剛已經新增 IAM Role 到 EC2，但仍無法透過該 IAM 執行特定行為？
date: 2025-02-15 14:23:21
tags: [AWS]
---

## 緣起
在使用 session manager 連接 EC2 會需要一定的權限，這時候就需要設定 IAM role 來實現，然而在 AWS console 把 IAM role attach 到 EC2 上後還是沒辦法馬上用 session manager，那這是為甚麼呢？又該如何解決？

## 背景知識：IAM Role 與 EC2 Metadata Service

在 AWS 環境中，當我們為 EC2 實例新增 IAM Role 時，EC2 會透過 EC2 Metadata Service (IMDS) 來獲取 IAM Role 提供的臨時憑證。這些憑證允許 EC2 內的應用程式使用 AWS 服務，而不需要手動設定 Access Key 和 Secret Key。

### EC2 Metadata Service (IMDS) 的角色

- EC2 Metadata Service 允許 EC2 取得與該實例相關的資訊，包括 IAM Role 的臨時憑證。
- 主要 API 端點：
  ```
  http://169.254.169.254/meta-data/
  ```
- `169.254.169.254` 是 EC2 Metadata Service 的特殊 IP，屬於 Link-Local Address（連結本地位址），僅在該實例內部可用。AWS 使用這個固定 IP 讓 EC2 無需透過 DNS 查詢，即可直接存取 Metadata Service。

### Amazon SSM Agent (`amazon-ssm-agent`) 的角色

- `amazon-ssm-agent` 允許 AWS Systems Manager (SSM) 管理 EC2 實例，例如執行命令、存取 Session Manager 等。
- 它會透過 EC2 Metadata Service 取得 IAM Role 的臨時憑證，並用來與 AWS Systems Manager 進行通訊。

當 EC2 新增或更新 IAM Role 時，EC2 Metadata Service 可能會緩存舊的 IAM 憑證，導致新的 IAM 權限無法立即生效。

---

## 問題排查與解決方法

### 1. 檢查 AWS CLI 是否正確讀取 IAM 認證

使用以下指令檢查 AWS CLI 是否正確讀取 IAM Role 提供的憑證：

```bash
aws configure list
```

若 `access_key` 和 `secret_key` 顯示為 `None`，表示 IAM Role 尚未正確應用。

若要手動測試 EC2 Metadata Service 是否正常運作，執行：

```bash
curl -H "X-aws-ec2-metadata-token: $(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")" http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

若此指令返回 IAM Role 名稱，表示 EC2 Metadata Service 正常運作。

---

### 2️. 重啟 `amazon-ssm-agent` 來強制更新 IAM Role

如果 IAM Role 尚未生效，可能需要重啟 `amazon-ssm-agent`，強制它重新向 EC2 Metadata Service 取得最新的 IAM 憑證。

執行以下指令：

```bash
sudo systemctl restart amazon-ssm-agent
```

此指令會：

1. 停止 `amazon-ssm-agent`，釋放過期的 IAM 憑證。
2. 重新啟動 `amazon-ssm-agent`，強制它向 EC2 Metadata Service 重新請求最新的 IAM Role 憑證。
3. 讓 AWS CLI 和 AWS Systems Manager 取得最新的 IAM 權限。

---

### 3️. 重新啟動 EC2 Metadata Service（如果仍然無法生效）

若重啟 `amazon-ssm-agent` 仍無法解決問題，可以嘗試重新啟動 EC2 Metadata Service：

```bash
sudo systemctl restart ec2-instance-connect
```

這將強制 EC2 重新載入 IAM Role，確保最新的權限已經應用。

---
下次如果又遇到 EC2 新增 IAM Role 後無法立即生效，試試 `sudo systemctl restart amazon-ssm-agent`！