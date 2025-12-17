---
title: migration 時資料庫需要注意的事情(適用於 Aurora serverless)
date: 2025-10-12 20:38:37
tags: [Auora serverless, database, aws]
---

## 背景
基於稽核紀錄與自動化考量，我們使用 Terraform 將建置基礎設施進行 migrate，包含伺服器、資料庫等等。然而資料庫一旦刪除會導致所有資料消失，因此在進行 migrate 或修改結構 時，不能直接重新建立整個 module，而是需要以「部分套用 (target apply)」的方式更新指定資源。例如

```sh
$ terraform plan -var-file="prod.tfvars" -target=module.aurora_postgresql_v2
```

## 問題說明
但在執行上述指令後，遇到 terraform 噴錯如下，主要是再說「建立 RDS Subnet Group 時，AWS 偵測到只有單一可用區（AZ）被覆蓋」。

```
Error: creating RDS DB Subnet Group (prod-email_service_db-vpc):
DBSubnetGroupDoesNotCoverEnoughAZs:
The DB subnet group doesn't meet Availability Zone (AZ) coverage requirement.
Current AZ coverage: ap-northeast-1a.
Add subnets to cover at least 2 AZs.
```

## 問題解決
先讓 VPC module 生成 subnet group（包含至少兩個 AZ），再建立 Aurora cluster，就能順利通過 AWS 的驗證。

```sh
$ terraform plan -var-file="prod.tfvars" -target=module.vpc
$ terraform apply -var-file="prod.tfvars" -target=module.vpc

$ terraform plan -var-file="prod.tfvars" -target=module.aurora_postgresql_v2
$ terraform apply -var-file="prod.tfvars" -target=module.aurora_postgresql_v2
```
