---
title: Terraform：加速 DevOps 之旅，實現 IaC 自動化管理
date: 2025-03-02 13:55:26
tags: [DevOps, IaC, Terraform]
---

## Terraform 簡介
Terraform 是一個由 HashiCorp 開發的 Infrastructure as Code (IaC)工具，用於自動化配置、管理和編排基礎設施。它主要透過描述性配置文件（通常使用 HCL, HashiCorp Configuration Language）來定義基礎設施。這些配置文件不僅能夠描述要部署的資源，還能夠設定其屬性和關聯。使用者只需寫下所需資源的 code ，Terraform 會根據這些 code 與雲平台或其他服務提供商的 API 互動，並自動創建、修改或刪除資源，從而實現基礎設施的自動化管理。

## Terraform lifecycle
在使用 Terraform 管理基礎設施時，通常會遵循一個標準的生命周期流程，這個流程包括四個主要步驟：`init`、`plan`、`apply`、`destroy`。每個步驟都在特定的階段執行，幫助確保 Terraform 配置的正確性與基礎設施的一致性。以下是這些步驟的詳細介紹：

![alt text](images/tf/image-1.png)

### 1. `terraform init`
`terraform init` 是初始化 Terraform 工作目錄的命令。這是 Terraform 操作的第一步，會執行以下動作：
- 下載 Provider 插件：初始化時，Terraform 會下載並安裝配置中所需的所有 provider（例如 AWS、Azure、Google Cloud 等）的插件。
- 初始化後端：如果使用遠端後端來存儲 Terraform 狀態（例如 AWS S3、Terraform Cloud 等），這個命令會初始化並配置這些後端。
- 創建 `.terraform` 目錄：Terraform 會創建一個 `.terraform` 目錄來儲存插件、依賴和狀態文件。


```bash
terraform init
```

### 2. `terraform plan`
`terraform plan` 命令會根據當前的 Terraform 配置文件來預測基礎設施變更。它會與當前的基礎設施狀態進行比較，並顯示出 Terraform 將採取的操作，包括添加、修改或刪除資源。

- 預測變更：這一步可以幫助你在進行任何更改之前，預覽 Terraform 會做什麼操作。
- 輸出計劃：`terraform plan` 會生成一個執行計劃，告訴使用者 Terraform 將如何更新基礎設施。


```bash
terraform plan
```

### 3. `terraform apply`
`terraform apply` 命令會根據 `terraform plan` 所生成的計劃來實際執行變更。這一步會根據計劃中顯示的操作來修改基礎設施，將配置文件中的變更應用到實際環境中。

- 執行變更：這是實際進行資源創建、修改或刪除的步驟。
- 確認操作：執行 `terraform apply` 時，Terraform 會要求用戶確認是否確定要應用計劃，除非使用 `-auto-approve` 參數跳過此步驟。


```bash
terraform apply
```
如果要自動批准並應用變更，可以使用：
```bash
terraform apply -auto-approve
```

### 4. `terraform destroy`
`terraform destroy` 命令會刪除所有由 Terraform 管理的基礎設施資源。這通常在不再需要某些資源時使用，或者在測試環境中用來清理資源。

- 刪除資源：它會根據配置文件中定義的資源來刪除所有的資源。
- 確認刪除：執行時，Terraform 會顯示將刪除的資源，並要求用戶確認是否刪除。


```bash
terraform destroy
```

## Terraform 如何幫助 DevOps
Terraform 是一個強大的 Infrastructure as Code, IaC 工具，它能幫助 DevOps 團隊有效地管理和自動化基礎設施部署的過程。Terraform 讓基礎設施的管理變得像寫程式一樣簡單，不需要手動操作雲平台的控制面板或 CLI，而是透過使用 Terraform，團隊可以將基礎設施配置寫成程式，就可以透過執行簡單的命令（如 terraform apply）來創建、修改或刪除資源。這樣可以大幅度提高資源管理的效率和準確性，並且可以在不同的環境中保持一致性，避免了重複性和手動操作的錯誤。

此外，當開發團隊需要在不同的雲平台（如 AWS、Azure、Google Cloud）或自建環境中部署應用程式時，Terraform 讓他們能夠使用相同的配置文件來創建、更新或刪除資源，從而避免了手動配置的錯誤和重複性工作。更重要的是，Terraform 支援自動化的部署流程，讓 DevOps 團隊可以通過簡單的命令來應用、測試和推送變更，縮短了開發週期並提高了交付的速度。這樣，DevOps 團隊能夠在提高基礎設施可維護性和可擴展性的同時，保持快速迭代和自動化的工作流程。