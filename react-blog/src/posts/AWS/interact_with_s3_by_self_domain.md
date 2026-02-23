---
title: 透過 CloudFront 實現自有網域對 S3 檔案的安全存取控制
date: 2026-1-20 22:24:15
tags: [AWS, S3]
---

## Table of Contents
---

## 前言

最近在處理檔案上傳下載的需求時遇到了一個有趣的挑戰，如何讓同一個 S3 bucket 裡的檔案，有些完全公開，有些需要驗證才能存取，並且存取操作都是透過直觀的自有網域作為 url 而不是 S3 提供的那一串又臭又長的 object url。

這篇筆記會以 CloudFront + S3 為核心，說明如何透過 CloudFront Signed URL，讓即使是需要驗證的檔案，也能以自有網域作為存取入口，並在同一個 S3 bucket 中實現混合存取的設計。

![image](images/AWS/interact_with_s3_by_self_domain/img0.png)

## 使用自有網域存取? CloudFront + S3

就像前言提到的，我們不希望在存取 s3 物件的時候都要帶 S3 提供那冗長且不直觀的 object URL，我們希望存取物件所使用的網址是一般使用者習慣的 `https://` + 自有網域所組成的網址。

那這個部分會用 CloudFront 和 S3 來實現。由於 CloudFront 本身支援綁定自有網域與 TLS 憑證，所以我就將自有網域直接指向 CloudFront 的 url，讓它成為檔案存取的唯一入口，也就是說任何透過自有網域發出的請求，實際上都會先進入 CloudFront，再由 CloudFront 代理存取 S3。

在這個架構中，S3 只負責作為物件儲存的角色，它並不直接對外提供存取。所有對外的檔案請求都會先進入 CloudFront，再由 CloudFront 依照設定的行為（behavior）與簽署 URL 規則，決定請求是否能被轉送到對應的 S3。這樣做的好處就是讓存取權限的控管點從 S3 物件層級上升到 CloudFront 層級，後續無論是要做權限驗證、期限限制，還是混合公開與私有存取模式，就都能在同一個入口下完成!

## 如何透過自有網域更安全的存取 S3 物件?

透過剛剛的架構我們可以直接透過自有網域存取物件，但如果沒有任何安全上的控管，任何人只要猜到檔案存放路徑，就可以透過你的網域來存取裡面的所有東西。如果你的 S3 裡面有一些比較敏感的資源希望特定的人存取，就可以透過簽署過後的 url 來在存取時加入驗證與期限限制，避免任何人只要猜到路徑就能下載檔案。接下來會透過幾個步驟帶大家完成設定 CloudFront Signed URL !

### Step 1. 建立金鑰對和金鑰群組
1. 建立金鑰對
    
    整個安全機制的核心就是 CloudFront 的 Signed URL，而要產生這些簽署過的網址，首先需要建立一組金鑰對，而且必須滿足以下要求：

    - It must be an SSH-2 RSA key pair.
    - It must be in base64-encoded PEM format.
    - It must be a 2048-bit key pair.

    ```bash
    $ openssl genrsa -out private_key.pem 2048
    ```
    
    ```bash
    $ openssl rsa -pubout -in private_key.pem -out public_key.pem
    ```
2. 上傳 **Public Key**
    1. 進入到 cloudfront > key management > public keys
        
        ![image](images/AWS/interact_with_s3_by_self_domain/img1.png)
        
    2. 選擇 **Add public key**
    3. 把剛剛在本地生成的 `public_key.pem` 的內容貼上去
        
        ![image](images/AWS/interact_with_s3_by_self_domain/img2.png)
3. 建立 key group
    
    ![image](images/AWS/interact_with_s3_by_self_domain/img3.png)
    
4. 把剛剛建立的 private key 存到 secret manager
    
    ![image](images/AWS/interact_with_s3_by_self_domain/img4.png)
    ![image](images/AWS/interact_with_s3_by_self_domain/img5.png)
    ![image](images/AWS/interact_with_s3_by_self_domain/img6.png)

### Step 2. 設定 S3 bucket 權限
如果 S3 bucket 是透過自動化工具建立的，接下來要調整的就是權限設定。

1. 已經透過 pipeline-manager 建立 s3，接著進入到該 S3 → Bucket → **Permissions**
2. 開啟 Block public access
    
    ![image](images/AWS/interact_with_s3_by_self_domain/img7.png)
    

### Step 3. 配置 CloudFront distribution

CloudFront 的設定是整個架構的核心，由於我的 distribution 已經透過 IAC 建立好並且連接到對應的 S3 bucket，所以接下來就會進入到調整 origin 設定的步驟。在接下來的操作會設定相關權限來建立 S3 與 CloudFront 之間的信任關係，這樣一來我們就可以透過簽署後的 url 向 S3 操作。

1. 已經透過 pipeline-manager 建立 cloudfront，可以看到他已經連接到 s3
    
    ![image](images/AWS/interact_with_s3_by_self_domain/img8.png)
    
2. 選 25testing201.surveycake.biz_S3，點 edit
    
    ![image](images/AWS/interact_with_s3_by_self_domain/img9.png)
    
3. 設定成這樣：
    
    ![image](images/AWS/interact_with_s3_by_self_domain/img10.png)
    
4. 複製他產生的 s3 policy
    
    ![image](images/AWS/interact_with_s3_by_self_domain/img11.png)
    
5. 前往 s3 貼上去
    
    ![image](images/AWS/interact_with_s3_by_self_domain/img12.png)
    
6. 點 behavior，修改存東西的 s3 origin
    - 如果是要做 signed url → 透過 url 下載東西
        1.  Restrict viewer access: `yes`
        2. Trusted authorization type: `Trusted key groups`
        3. 選剛剛的 key group
        
        ![image](images/AWS/interact_with_s3_by_self_domain/img13.png)
        
    - 如果是要做 pre-signed url → 透過 url 上傳東西
        1. 記得加上 PUT method
            
            ![image](images/AWS/interact_with_s3_by_self_domain/img14.png)
            

### Step 4. 創 lambda & IAM

在這個架構中，我是使用 Lambda 作為應用層與 CloudFront 之間的中介來簽發 CloudFront Signed URL，而這個 Lambda 會需要做到以下幾件事情：
- 驗證請求來源是否有權限產生下載或上傳 URL  
- 從 AWS Secrets Manager 讀取 CloudFront 的 private key  
- 根據需求產生對應的 Signed URL（包含 path、HTTP method 與有效期限）

不過這邊要注意的是，因為憑證是 lambda 簽發的，所以 lambda 的 iam role 必須要有把東西 put 到 s3 的權限，否則簽發的 url 不能 put
    
![image](images/AWS/interact_with_s3_by_self_domain/img15.png)

## 混合存取模式

基於管理方便之類的原因，我們大多會把所有資料放在同一個 S3，但如果要求某些資料要公開存取、某些要完全不公開要怎麼實現？如何讓 S3 Bucket 可以實現 部分物件完全公開/部分物件完全不公開/部分物件限制公開

答案是善用 CloudFront 的 path pattern，在設定 behavior 時，可以為不同的路徑模式設定不同的規則。比如說讓公開檔案都放在 `public/*` 路徑下，然後為這個 pattern 建立一個不綁定 key group 的 behavior。這樣這些檔案就可以直接透過 CloudFront domain 存取，不需要任何驗證。

### 部分物件透過完全公開

1. 讓要公開的檔案名稱有個統一的 pattern，並且不要替這個 pattern behavior 綁 key group 
    
    ![image.png](attachment:3f6285cc-0646-4fc4-b0a0-088e3079cd8f:image.png)
    
    ![image.png](attachment:6b60d218-bd5b-4a36-8afa-4127bf222a9b:image.png)
    
2. 就可以直接從 domain 去存取了
    
    
    
## 小結

透過 CloudFront 搭配 S3，我們就可以把「檔案是否能被存取」的責任從 S3 本身抽離出來，讓 S3 負責儲存資料，存取權限則改交由 CloudFront 的 behavior 與 Signed URL 機制來控管。除了責任劃分以外，這種做法還可以讓 URL 更乾淨，整體存取邏輯更貼近應用層的設計思維，而不用輸入 S3 的 object url。

如果你的目標是打造一個「**對外只有自有網域、對內才知道是 S3**」的檔案存取架構，那 CloudFront + Signed URL 會是一個非常實用的解法~!
