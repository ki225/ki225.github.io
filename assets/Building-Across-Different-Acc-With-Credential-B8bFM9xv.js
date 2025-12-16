const n=`---
title: 跨帳戶代理建立 AWS 資源
date: 2025-03-16 10:24:02
tags: [AWS, credentials, deployment-cross-acc]
---

在實習的某一天，我的 mentor 在與我們聊工作的時候突然讓我們去試著透過自己的帳號部署資源到其他帳號，這突如其來的任務對於剛進實習的我們來說很是不解，於是 mentor 就和我們進一步說明了這個任務的背景情境。

在現今雲端服務的運作中，許多公司需要協助客戶建置和管理雲端資源，這不僅是技術層面的挑戰，也涉及跨帳號操作的複雜性。但為什麼這些公司不自己建資源呢? 又或是為什麼客戶不直接給受委託的公司自己的帳密來部署呢? 接下來我們用一個簡單的部署情境來介紹背景和實作。

![image](images/AWS/credentials/img1.png)
## 故事情境
假設有一家名為 A公司的企業，專門提供雲端安全服務，協助客戶在雲端上部署各式各樣的資安防護工具。近期，B公司是 A公司的客戶，B公司有一個新創電商平台，對於網站安全非常重視，尤其是面對 DDoS 攻擊和網站流量篩選需求。B公司希望能夠透過 AWS 上的 Web Application Firewall (WAF) 保護他們的網站，免受惡意流量的威脅。為什麼 B公司不自己建立 WAF 資源呢? B公司雖然有雲端基礎架構的相關知識，但他們的工程團隊專注於開發和維護平台功能，資安防護是他們的次要任務，因此 B公司選擇外包這項工作，交由 A公司來協助他們在 AWS 上部署並管理 WAF。

A公司的雲端工程師小李被指派協助B公司建置 AWS WAF。小李要負責設置防火牆規則、配置 AWS WAF 並將它綁定到 B公司現有的 Application Load Balancer (ALB)，從而實現對 B公司網站的保護。但小李沒辦法拿到 B 公司的 AWS 帳戶密碼，這是為什麼呢?

### 實施最小權限原則 (least privilege access)
這是出於安全性考量中的最小權限原則。試想一下，如果 A公司員工直接使用 B公司的 AWS root user、IAM user，這樣會違反基本的資安原則，讓人員獲得過多不必要的權限，並增加帳號被濫用的風險。尤其是在涉及敏感操作（如修改 IAM 角色、配置防火牆規則）時，這樣的做法會讓客戶的雲端資源暴露於潛在的風險之中。

### 實踐方案: 假設角色（Assume Role）與信任關係機制
- 設定 IAM 角色：小李在 A公司帳號中建立了一個特定環境(執行 IaC 的環境)中的 IAM 角色，並將其設定為可以假設 B公司帳號中的角色。這樣，A公司員工就能夠無需直接訪問 B公司的帳號密碼，便可在 B公司帳號內進行必要的操作。
- 建立信任關係：小李為了確保 B公司願意授權 A公司進行操作，必須讓 B公司同仁在 B公司帳號內建立與 A公司的信任關係。這通常是由 B公司提供的一個 IAM 角色，並允許 A公司使用這個角色執行特定的操作。例如，B公司設置的 IAM 角色允許 A公司部署 WAF，並且授權給 A公司對應的 EC2 實例來操作。

### 換一個生活化的例子說明上述情況
假設小華有一間他自己整理的倉庫，裡面放著很多貴重的物品（比如書籍、紀錄片等），他需要請清潔工幫忙整理倉庫，但是又不想讓清潔工直接擁有倉庫的鑰匙，因為他不想讓清潔工隨時都能進入倉庫。

為了讓清潔工幫忙整理倉庫，小華決定設置一個特殊的“訪客證明”。這個訪客證明只授權清潔工在特定時間內進入倉庫，並且只能做一些整理的工作，比如清理書架或整理箱子，而不是隨意拿走倉庫裡的東西。小華會告訴清潔工，當他需要進入倉庫時，可以使用這個特殊的訪客證明，且這個證明有註明使用對象只有那位清潔工，所以他無法把證明借給別人，確保其他人無法隨便進入倉庫。

針對上述故事和我們原文的情境對照如下:
- 訪客證明: 這就像 B 公司提供給 A 公司的 IAM 角色
- 清潔工: A公司帳號用來執行 IaC 的 IAM 角色
- 小華只信任清潔工來做整理打掃的動作:  B 公司設定的 IAM 角色透過 trust relationship 來信任 A 公司的 role

## 實踐
接下來我們要針對原本 A 公司與 B 公司的情境，透過 Tarraform 實際部署 WAF 資源。

### 決定我們需要什麼?
為了讓程式設計師在不進入客戶帳戶的情況下完成這項任務，我們需要從公司帳戶到客戶帳戶建立一個隧道。因此，我們需要兩個 \`IAM-角色的 arn\`。此外，我們還需要知道哪些資源應該由 WAF 保護。因此，我們所需要的有：
1. 2 個 IAM role 的 arn
    - 公司的帳戶用於程式設計師
    - 客戶的假設角色
2. 哪些資源將與 WAF 關聯

### 設定 IAM 角色: 為工作環境創建角色
讓我們繼續處理我們所需要的 IAM 角色。第一個是在 A公司帳戶中。由於工作環境是在 A 公司的機器 EC2 中，我們根據以下需求來創建角色：
- Trusted entity type：Trusted entity type
- use case：EC2（這樣我們就可以將它附加到 EC2 實例）

![image](images/AWS/credentials/img2.png)

A 公司帳戶中的 IAM 角色將如下所示：
\`\`\`json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "ec2.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
\`\`\`

### 設定 IAM 角色: 從客戶獲取認證並建立信任關係
另一個角色是在客戶 (B公司) 帳戶中。此角色應該擁有足夠的權限來建立目標資源，假設是 AdminRole。在 A公司開始創建 Terraform 文件之前，我們需要先建立兩間公司的信任關係，如此一來就可以透過信任關係，表示客戶允許你在他們的帳戶中執行某些操作。


例如，以下是客戶 (B公司) 角色的 trust relationship policy：
\`\`\`json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "ec2.amazonaws.com",
                "AWS": "arn:aws:iam::<COMPANYA_ACC_ID>:role/<COMPANYA_IAM_ROLE>"
            },
            "Action": "sts:AssumeRole",
            "Condition": {}
        }
    ]
}
\`\`\`

讓我們逐步解析 "Statement" 部分：
- Effect
  - 指定該聲明是否允許或拒絕訪問
  - "Allow" 表示允許指定的操作
- Principal
  - 指定允許或拒絕訪問資源的實體（使用者、服務或帳戶）
  - 在這個例子中，它允許 EC2 服務和特定的 IAM 角色來假設此角色
- Action
  - 指定允許或拒絕的操作
  - 在這個例子中它允許假設此角色
- Condition
  - 指定此政策生效的條件
  - 空對象意味著沒有應用額外條件

### 部署過程中的角色假設
A 公司將在 EC2 環境中使用 Terraform 文件來完成此任務，因此 A 公司需要在 tf 文件中定義客戶 (B 公司)的資訊。首先定義一個 provider：
\`\`\`hcl
# Provider 配置
provider "aws" {
      alias  = "customer"
      region = "us-east-1"
      assume_role {
            role_arn = "arn:aws:iam::<CUSTOMER_ACC_ID>:role/<CUSTOMER_ROLE_NAME>"
      }
}
\`\`\`
這樣，A 公司就可以在客戶的帳戶中獲取現有的資源：
\`\`\`hcl
data "aws_lb" "target_alb" {
  provider = aws.waf
  name     = var.alb_name
}
\`\`\`
此外，如果有資源將在客戶帳戶中創建，而不是A公司帳戶中，就可以像下面這樣定義：
\`\`\`hcl
# 範例：使用公司帳戶在客戶帳戶中建立 WAF
resource "aws_wafv2_web_acl" "customer_waf_acl" {
  # provider: 定義該資源的目標
  provider = aws.customer 
  name        = ...
  description = ...
  scope       = ...

  # 詳細設置
}
\`\`\`
### 沒正確設置 provider 會怎樣?
如果使用者想要在不同帳戶上創建資源而未正確設置 provider，可能會發生類似下方的問題：
\`\`\`
│ Error: creating WAFv2 WebACL Association (arn:aws:wafv2:us-east-1:<COMPANY_ACC_ID>:regional/webacl/test_waf/...,arn:aws:elasticloadbalancing:us-east-1:<CUSTOMER_ACC_ID>:loadbalancer/app/cutomer-alb/...): operation error WAFV2: AssociateWebACL, https response error StatusCode: 400, RequestID: ..., api error AccessDeniedException: User: arn:aws:sts::<CUSTOMER_ACC_ID>:assumed-role/customer-role/aws-go-sdk-... is not authorized to perform: wafv2:AssociateWebACL on resource: arn:aws:wafv2:us-east-1:<COMPANY_ACC_ID>:regional/webacl/test_waf/... because noresource-based policy allows the wafv2:AssociateWebACL action
│
\`\`\`
這個問題發生的原因是系統認為 WAFv2 資源應該在公司帳戶中建立。因此，在關聯過程中權限不足。
`;export{n as default};
