const e=`---
title: Presigned URLs：讓未授權用戶安全存取 Amazon S3
date: 2025-02-20 14:06:25
tags: [AWS, S3, policy, PresignedURL, security]
---

想到 AWS 的儲存資源，一定會馬上想到最經典的 S3 服務。在資料儲存的安全議題上，AWS 提供了很多安全保障設定，像是 ACLs、bucket policies、Block Public Access、IAM 等等，而這篇文章想和大家介紹的是 S3 的 Presigned URLs。

在我們設定 bucket policies 來公開我們的檔案前，不知道大家有沒有想過:
- "為什麼我沒辦法直接透過 object url 開啟檔案?"
- "為什麼點開 OPEN 之後出來的 url 那麼長?"


![alt text](images/AWS/s3/img2.png)

![alt text](images/AWS/s3/img1.png)

而這部分就是我們接下來要說的 Presigned URLs

### 什麼是 Presigned URLs？
Amazon S3（Simple Storage Service）預設所有物件都是私有的，只有擁有該物件的 AWS 使用者才可以存取。然而，透過 presigned URL，物件擁有者可以授權其他使用者在特定時間內存取該物件。

Presigned URLs 是 AWS 提供的一種機制，允許用戶生成一個帶有有效期權限的 URL，用來對允許未經授權的使用者透過該 URL 對 S3 物件進行有限操作。這些 URL 是由擁有 AWS 權限的用戶生成的，並且在 URL 中已經簽名並授權了特定的操作（如上傳、下載文件等），這樣一來使用者就可以在不需要提供 AWS 憑證的情況下執行指定的操作。

![alt text](images/AWS/s3/img4.png)

### 什麼情境適合使用 Presigned URLs 來訪問 S3？
Presigned URLs 可用於以下情境：
1. 臨時文件分享：允許未經授權的使用者在一定時間內下載 S3 物件。
2. 受限存取的 API 端點：當 API 需要限制存取 S3 資源時，可動態生成 presigned URL。
3. 無需直接暴露 AWS 憑證：應用程式可產生 presigned URL，讓客戶端存取 S3 而無需提供 AWS 憑證。
4. 允許用戶上傳文件：透過 presigned URL 允許使用者上傳文件到特定 S3 存儲桶，而無需開放整個 S3 權限。

這邊舉一個情境說明，假設你的公司與一家設計公司合作開發新產品，你需要將一些涉及商業機密的設計圖共享給設計公司，這時候就可以透過生成 Presigned URL，你可以確保只有在指定時間內，設計公司才能下載這些文件，且文件一旦過期，便無法再被訪問。

不只是限制別人下載或查看檔案，我們也可以透過這個方法限制別人上傳資料。假設我們要經營一個電子商務平台，平台允許商家上傳產品圖片以展示商品。為了讓平台的順暢的運作，我們希望限制每位商家只能上傳符合平台規定的圖片，這時候就可以透過 Presigned URLs 避免商家直接存取 S3，以實現這個需求。

![alt text](images/AWS/s3/img3.png)

### 如何透過 Presigned URLs 存取 S3？
使用 AWS SDK（如 boto3）或 CLI 來產生 presigned URL，然後可透過瀏覽器或 HTTP 請求存取 S3 物件。

#### 1. 產生 Presigned URL（Python 示例）
\`\`\`python
import boto3
from botocore.exceptions import ClientError

def create_presigned_url(bucket_name, object_name, expiration=3600):
    """生成 Presigned URL 以存取 S3 物件"""
    s3_client = boto3.client('s3')
    try:
        response = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': object_name},
            ExpiresIn=expiration
        )
    except ClientError as e:
        print(f"Error: {e}")
        return None
    return response
\`\`\`

#### 2. 使用 Presigned URL 下載 S3 物件（Python 示例）
\`\`\`python
import requests

url = create_presigned_url('my-bucket', 'my-object')
if url:
    response = requests.get(url)
    print(response.content)  # 下載的文件內容
\`\`\`

#### 3. 產生 Presigned URL 以允許上傳文件
\`\`\`python
def create_presigned_post(bucket_name, object_name, expiration=3600):
    """生成 Presigned URL 以允許上傳 S3 物件"""
    s3_client = boto3.client('s3')
    try:
        response = s3_client.generate_presigned_post(
            bucket_name,
            object_name,
            ExpiresIn=expiration
        )
    except ClientError as e:
        print(f"Error: {e}")
        return None
    return response
\`\`\`

#### 4. 使用 Presigned URL 上傳文件（Python 示例）
\`\`\`python
response = create_presigned_post('my-bucket', 'my-upload-object')
if response:
    with open('local-file.txt', 'rb') as f:
        files = {'file': ('local-file.txt', f)}
        http_response = requests.post(response['url'], data=response['fields'], files=files)
        print(f'Upload status: {http_response.status_code}')
\`\`\`

### Presigned URLs 的最佳實踐
- 嚴格限定 AWS Identity and Access Management (IAM) 權限，只允許最小化的 Amazon S3 操作和資源，減少不必要的曝光。
- 儘可能使用臨時憑證（例如 role）而非存取密鑰。如果使用存取密鑰，定期輪換它們，以防止長期未授權存取。
- 使用 S3 的 VPC 端點，以讓 VPC 直接連接到 S3 存儲桶而無需通過網路，進而提高隔離性和安全性。
- 要求生成操作使用多因素身份驗證 (MFA)，以增強身份驗證。
- 實時創建 Presigned URLs，確保它們的有效期最短。
- 遵循最小權限原則，並在傳輸過程中進行加密，以減少使用預簽名 URL 時無意間資料存取或曝光的風險。
- 在 URL 中使用唯一的隨機值（nonce），以防止未經授權的存取。驗證 nonce 以防止重放攻擊。這樣，結合時間限制存取後，使猜測 URL 變得困難。

### Presigned URLs 的好處
1. 安全性高：URL 具有時間限制，過期後無法存取。
2. 授權細粒度控制：可僅授權特定對象，避免直接開放 S3 權限。
3. 簡化應用開發：允許應用程式臨時授權存取 S3，而無需暴露 AWS 認證。
4. 靈活性：可授權下載或上傳，根據需求自訂操作類型。

## 結論
總之 Presigned URLs 是 Amazon S3 提供的一種簡單而安全的方法，允許未經授權的使用者在有限時間內存取 S3 物件。這種方法適用於臨時文件分享、受限 API 存取、用戶端文件上傳等場景，並且具有高度的靈活性和安全性，是開發雲端應用時不可或缺的技術之一。



## References
- [Using presigned URLs to identify per-requester usage of Amazon S3](https://aws.amazon.com/tw/blogs/storage/using-presigned-urls-to-identify-per-requester-usage-of-amazon-s3/)
- [How to securely transfer files with presigned URLs](https://aws.amazon.com/tw/blogs/security/how-to-securely-transfer-files-with-presigned-urls/)
- [Presigned URLs](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/s3-presigned-urls.html)
- [Amazon S3 Presigned URLs: Your Key to Secure, Temporary Access](https://kkamalesh117.medium.com/amazon-s3-presigned-urls-your-key-to-secure-temporary-access-74b92e82d700)
- [AWS S3 uploads using pre-signed URLs](https://abhibvp003.medium.com/aws-s3-uploads-using-pre-signed-urls-bb5dd0a8a8e3)
- [The illustrated guide to S3 pre-signed URLs](https://fourtheorem.com/the-illustrated-guide-to-s3-pre-signed-urls/)`;export{e as default};
