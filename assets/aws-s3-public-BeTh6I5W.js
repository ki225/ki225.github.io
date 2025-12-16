const n=`---
title: AWS S3 存取權限設置與公開存取管理策略
date: 2025-02-24 18:01:11
tags: [aws, s3]
---


控管權限對產品的安全面非常重要，然而仍有些需要公開讀取的場景，像是要在網路上給所有人自由瀏覽、下載的檔案、圖片。假如今天要用 s3 儲存這些東西，該怎麼辦?

### s3 如何管理存取權限 ?
AWS 提供許多方式管理 S3 和其內容物的存取權限，像是透過 ACLs 和 bucket policies 來授予其他 AWS 帳戶或公眾 (匿名) 訪問權限，除此之外，Block Public Access 在 2018 的時候普及於所有 region，以預設所有新建立的 Amazon S3 buckets 和物件都是私有，讓使用者更輕鬆的一鍵保護 s3。

![alt text](images/AWS/s3/img5.png)

### S3  公開存取權 
指的是允許所有人（包括未經身份驗證的使用者），對你的 S3 存儲桶和物件進行存取操作，像是讀、寫、刪除，不需要使用 AWS 帳戶或是 IAM 身分，就可以直接透過物件 URL 訪問

### 公有 (Public) 的定義
在 AWS S3 中，「公有 (Public)」的定義是指物件或存儲桶 (Bucket) 可被 AWS 帳戶以外的任何人或匿名使用者存取。當一個 S3 存儲桶或物件設定為公有時，任何人都可以透過 URL 存取該物件，而無需驗證或授權。

### S3 權限的所有設置方法
S3 提供了多種方法來管理存取權限，主要包括以下幾種：

1. S3 存儲桶 (Bucket) 的公有存取設定
   - AWS 提供了一個「公有存取封鎖 (Block Public Access)」功能，允許管理者統一設定是否允許公有存取。
   - 設定位置：
     - S3 管理控制台 (Console) > 儲存桶 > 權限 (Permissions) > 公有存取封鎖 (Block public access)
   - 簡而言之，Block Public Access 這項功能會覆蓋儲存桶政策和存取控制清單（ACL），以強制阻止所有未經授權的外部存取，確保儲存桶和物件不會意外公開。然而實際上要公開物件，除了關閉此功能外，也需要設定 Bucket Policy 或 ACL。

2. S3 存儲桶策略 (Bucket Policy)
   - 使用 JSON 格式來定義桶的存取權限。
   - 例如，允許所有人讀取存儲桶內的物件：
     \`\`\`json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Principal": "*",
           "Action": "s3:GetObject",
           "Resource": "arn:aws:s3:::example-bucket/*"
         }
       ]
     }
     \`\`\`
   - 設定方式：
     - S3 管理控制台 > 權限 > 儲存桶原則
     - AWS CLI: \`aws s3api put-bucket-policy\`

3. ACL (存取控制清單, Access Control List)
   - 允許對特定物件或桶設定讀取/寫入權限。
   - 例如，將物件設定為公有讀取：
     \`\`\`bash
     aws s3api put-object-acl --bucket example-bucket --key example-object --acl public-read
     \`\`\`
   - S3 管理控制台 > 權限 > 物件 ACL

4. IAM (身份與存取管理, Identity and Access Management) 政策
   - 透過 IAM 設定哪些 AWS 使用者或角色可存取 S3。
   - 例如，允許某個 IAM 角色存取 S3：
     \`\`\`json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": "s3:GetObject",
           "Resource": "arn:aws:s3:::example-bucket/*"
         }
       ]
     }
     \`\`\`
   - 設定方式：
     - IAM 控制台 > 設定角色/使用者權限
     - AWS CLI: \`aws iam put-role-policy\`

### 設定公開存取權的目的
將 S3 設定為公有通常是為了以下用途：

1. 網站託管 (Static Website Hosting)
   - S3 可作為靜態網站的主機，公開存取 HTML、CSS、JavaScript、圖片等資源。
   - 需啟用「靜態網站託管」功能並設定公有存取。
2. 公開資料共享 (Public Data Sharing)
   - 當需要向大眾提供開放資料集 (如政府數據、研究資料) 時，可能會使用 S3 公開存取。
3. 內容傳遞 (Content Distribution)
   - 企業可能會使用 S3 存放圖片、影片等內容，並透過 CloudFront 快取和分發。
4. 開發測試 (Development & Testing)
   - 在某些開發階段，開發者可能會暫時將 S3 設為公有以便快速存取測試資料。

### 結論
在 AWS S3 中，「公有」指的是對 AWS 帳戶外的使用者開放存取權限。S3 提供多種方式來管理權限，包括公有存取封鎖、存儲桶策略、ACL 和 IAM。設定公有存取通常用於網站託管、數據共享、內容傳遞等場景，但應謹慎管理，避免洩露敏感資訊。


![alt text](images/AWS/s3/img6.png)


## References
- [Amazon S3 Block Public Access – Another Layer of Protection for Your Accounts and Buckets](https://aws.amazon.com/tw/blogs/aws/amazon-s3-block-public-access-another-layer-of-protection-for-your-accounts-and-buckets/)
- [AWS S3「阻止所有公開訪問」設定說明](https://realnewbie.com/coding/basic-concent/aws-s3-block-all-public-access-settings/)
- [Troubleshoot access denied (403 Forbidden) errors in Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/troubleshoot-403-errors.html)
- [Blocking public access to your Amazon S3 storage](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html#access-control-block-public-access-policy-status)
- [Configuring block public access settings for your S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/configuring-block-public-access-bucket.html)`;export{n as default};
