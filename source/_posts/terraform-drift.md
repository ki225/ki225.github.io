---
title: GitLab 與 Terraform 的協作，以及 Drift 的處理方式
date: 2025-08-19 11:45:43
tags: [terraform]
---

在基礎建設自動化的世界裡，**Terraform** 扮演著「基礎設施即程式碼（IaC）」的角色，而 **GitLab** 則像是它的管家，幫忙保存狀態、管理版本，甚至透過 pipeline 自動執行。這兩者的結合，讓團隊能夠在混亂的雲端環境裡維持秩序。

但現實世界總不乏例外。當基礎設施的「真實狀態」和 Terraform 腦袋裡的 `.tfstate` 不一致時，就會產生所謂的 **Terraform Drift**。這種情況有點像是你明明把房間收好，但有人半夜偷偷把桌子移走，早上醒來你還以為桌子還在原位。

---

## 什麼是 Terraform Drift?

Terraform 的狀態檔 (`terraform.tfstate`) 就是一份「地圖」，上面記錄了 Terraform 管理的資源和它們的設定值。
**Drift** 則是「地圖」和「真實世界」不同步時產生的落差。

常見原因包括：

* **手動修改**：有人直接在 AWS Console 點了幾下，結果 Terraform 並不知道。
* **外部系統干預**：像監控服務或 CI/CD 流程自動幫你改了一些配置。
* **雲端預設行為**：例如安全群組自動增加規則、自動擴展調整參數。

結果就是：Terraform 以為的狀態和實際狀態對不上。

---

## 如何處理 Terraform Drift?

那麼問題來了，發現 Drift 後該怎麼辦？

1. **偵測 Drift**

   * 可以利用 **GitLab Scheduled Pipeline** 定期執行：

     ```bash
     terraform init
     terraform plan -detailed-exitcode
     ```
   * 如果 `plan` 回傳的 exit code ≠ 0，就代表 drift 出現。這時 pipeline 可以設為失敗，並自動通知團隊（例如丟 Slack、Email，甚至直接開 issue）。

2. **同步狀態**

   * 使用 `terraform plan -refresh-only`，更新 state，讓 Terraform 的腦袋和真實環境對齊。

3. **處理 drift**

   * **如果遠端的改動比較合理**：那就更新 `.tf` 檔案，納入版本控制。
   * **如果是 Terraform 設定比較合理**：直接 `terraform apply`，讓雲端基礎設施回到我們的 IaC 定義。

這樣做能確保「程式碼才是唯一真實來源（Single Source of Truth）」。

---

## Terraform 與 GitLab 的整合

除了偵測 drift，GitLab 本身也能成為 Terraform 的好夥伴。

* **Terraform Backend**
  GitLab 可以作為 Terraform 的 backend，安全地存放和版本控制 `.tfstate` 檔。透過 API，存取會自動加密，避免狀態檔洩漏或版本衝突。
* **Pipeline 整合**
  GitLab CI/CD pipeline 可以直接執行 `terraform plan`、`apply` 等命令，實現「程式碼提交 → Pipeline 驗證 → 自動佈署」。
* **Module 儲存**
  GitLab Repo 也能充當 Terraform module registry。公司內部常用的模組可以統一放在 GitLab，跨專案引用。

例如：

```hcl
module "xm-stg-ses" {
  source  = "fox.25sprout.com/25sprout/ses-product/aws"
  version = "0.0.0"

  product_name = "xm"
  domain_name  = "xm-stg.svy.do"
  project_name = "surveycake-xm-stg"

  aws_region  = "us-west-2"
  mail_sender = "xm_stg@25demo.com"
  tags        = {"usage":"xm staging"}
}
```

這樣每個專案只要透過 `module` 呼叫，就能快速套用標準化的基礎設施組件。



