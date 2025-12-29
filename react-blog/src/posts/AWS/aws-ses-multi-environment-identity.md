---
title: 使用 AWS SES + 子網域委派，實作多環境 Email Identity 與轉寄架構
date: 2025-12-8 21:04:27
tags: [AWS, SES identity]
---

## Table of Contents

---

## 背景

在做 [SCRUM-127 把 Forward email 全部都改成用 Terraform 改寫以遵循 GitOps](https://github.com/aws-educate-tw/aws-educate-tpet-backend/pull/121) 這支票的過程裡，為了：

- 為 **local-dev** 測試隔離 email 行為
- 避免打到 production 的 SES
- 區分 prod / preview / dev / local-dev 不同 email 身份

因此我們決定在每個環境 (prod / preview / dev / local-dev) 建立一個獨立 SES Identity + 子網域，例如：

- prod → `aws-educate.tw`
- preview → `preview.aws-educate.tw`
- dev → `dev.aws-educate.tw`
- local-dev → `local-dev.aws-educate.tw`

---

## 新增子網域

1. 點 `Create hosted zone`
    
    ![alt text](images/AWS/ses/img1.png)
    
    
2. 建立 **hosted zone**
    - 輸入子網域名稱（此例為 preview.aws-educate.tw）
    
    ![alt text](images/AWS/ses/img2.png)
    
3. 會自動跳轉到以下畫面，Route53 會給我們 4 筆 NS 記錄
    - 這 4 筆 NS 是用來委派子網域
    - NS（Name Server）決定「哪個 DNS 伺服器負責回答這個網域的相關問題？」，所以當我們在等一下的步驟設定好 4 筆 NS 後，就代表 preview 子網域請交給這 4 台 DNS 伺服器負責。
    
    ![alt text](images/AWS/ses/img3.png)
    

## DNS delegation

<aside>

接著要把 preview 子網域委派給新的 hosted zone。這邊會需要先理解 DNS 解析的過程，簡單來說DNS 查找流程就像是從「全球電話簿 → 國家電話簿 → 公司總機 → 部門」一路查下去，所以當今天要找 `preview.aws-educate.tw` 的時候，電腦會：

1. 問 Root DNS（`.`）
    1. Root DNS（`.`）會回答：「aws-educate.tw 的管理單位請找 `.tw` 的 Name Server」
2. 問 `.tw` TLD Name Server
    1. TLD 會回答：「aws-educate.tw 是由這些 NS 管的。」
    2. 至於是哪些 NS ? 就是一開始我們買 `aws-educate.tw`網域時註冊處給我們的 Name Server。阿這部分我們已經在買網域的網站設定好了。
3. 問 aws-educate.tw 的 Name Server
    1. 這時候 aws-educate.tw 的 Name Server 就會被問 「請問 preview.aws-educate.tw 在哪裡？」，當我們在主域名中加入 NS Delegation 後， aws-educate.tw 就會把這個查詢轉給 preview.aws-educate.tw 的這四個 Name Server

</aside>

接下來就是完成子網域委派，才可以實現上面情境的 3-a

1. 回到 [aws-educate.tw](http://aws-educate.tw) 主網域
    
    ![alt text](images/AWS/ses/img4.png)
    
2. 把先前第三步驟的這 4 筆 NS 記錄加入 aws-educate.tw 主 zone
    
    ![alt text](images/AWS/ses/img5.png)
    
3. 這樣一來，當有人問  aws-educate.tw 「preview.aws-educate.tw 在哪？」，就會把這個查詢轉給 preview.aws-educate.tw 的這四個 Name Server

---

## 初次在某個 region 設定 SES Identity

<aside>
SES Identity 就是 AWS 要求我們證明我們有權代表這個 Email 或這個 Domain 寄信，因為 email 最常被冒充（phishing、spam），所以 SES 不會直接讓任何人用任何地址寄信，我們必須通過 Identity 驗證，SES 才會授權寄信。

</aside>

<aside>
因為 AWS 的架構會將各個 Region 彼此隔離以達到容錯目的，因此即使是同一組 Email 或 Domain，也必須在每個 Region 各自進行身分驗證，才能確保郵件在該 Region 內能被正確且本地化地驗證與寄送。

</aside>

1. 進入指定 region，這邊以 preview 環境所在的 us-west-1 為例子
2. 進入 SES > Account dashboard，點黃色區塊的 `View Get set up page`
    
    ![alt text](images/AWS/ses/img6.png)
    
3. 設定 email，這會是之後收驗證信的 email
    
    ![alt text](images/AWS/ses/img7.png)
    
4. 設定 sending domain
    - Sending domain（寄件網域）
        - 是信件「From:」標頭會使用的網域，也就是寄信的時候會看到像這樣
        
        ```bash
        From: something@preview.aws-educate.tw
        ```
        
    - MAIL FROM domain（Envelope-From 網域）
        - 他會做 SPF、Bounce 退信、reputation(評分要不要進垃圾信)
        - 這邊我們填寫 bounces，SES 會把他組合成 bounces.preview.aws-educate.tw，這就會是**Return-Path / Envelope-From** 使用的網域。
    
    ![alt text](images/AWS/ses/img8.png)
    
5. 保留預設
    
    ![alt text](images/AWS/ses/img9.png)
    
6. 一樣保留預設
    
    ![alt text](images/AWS/ses/img10.png)
    
7. 跳過
    
    ![alt text](images/AWS/ses/img11.png)
    
8. 確認
    
    ![alt text](images/AWS/ses/img12.png)
    

## 完成任務

完成設定之後需要完成一些指定任務才能啟用 identity

![alt text](images/AWS/ses/img13.png)

### 任務 1: 驗證 email

- 去剛剛填寫的帳號收驗證信，點進去信中的連結就可以囉
- 然後你就可以看到他變成完成狀態
    
    ![alt text](images/AWS/ses/img14.png)

    

### 任務 2: 驗證 domain

1. 點選 task **`Verify sending domain`** 的 **`Get DNS Records`** 
2. 點選 **`Download .csv record set`**下載 record set
    
    ![alt text](images/AWS/ses/img15.png)
    
3. 進入 route53 > Hosted zones > preview.aws-educate.tw，點選 **`Import zone file`**
    
    ![alt text](images/AWS/ses/img16.png)
    
4. 點開剛剛下載的 record set
    
    ![alt text](images/AWS/ses/img17.png)
    
5. 稍微調整一下順序貼上
    - 這邊的順序和 CSV 的不一樣，他要的是 **`Record name** TTL  type **Value/Route traffic to`** ，而且是用空白區分
    - 用好後按下 import
    
    ![alt text](images/AWS/ses/img18.png)
    
6. 完成把 SES 要的 DNS 記錄加到 preview.aws-educate.tw zone
    
    ![alt text](images/AWS/ses/img19.png)
    
7. 等待大概十分鐘，有時候快一點只要五分鐘，可以先做別的事情
    - 看到以下畫面代表完成
    
    ![alt text](images/AWS/ses/img20.png)
    
8. 可以申請 production access 啦!
    
    ![alt text](images/AWS/ses/img21.png)
    

## 幫 SES Identity 申請 production access

<aside>

因為目前我們是屬於預設的 **Sandbox** 模式，雖然已經是可以使用的了，但他會對所有關聯的收件者做驗證。

然而我們團隊的成員其實會隨著屆數去有所新增變動，如果每一次新增一個收件者都要手動記出驗證信的話實在是太麻煩了，因此我們要直接升級成 production access。

</aside>

1. 點 **`Request production access`**
    
    ![alt text](images/AWS/ses/img21.png)
    
2. 填寫相關設定
    - 選 `Transactional` ，因為選 MKT 很容易被抓去跟客服約談
    
    ![alt text](images/AWS/ses/img22.png)
    
3. 然後就被約談啦
    ![alt text](images/AWS/ses/img23.png)
    

---

## Forward email

<aside>

設定完成 production access 申請後，就可以做 forward email，也就是當我寄信給 `dev@aws-educate.tw` 後要轉發給 dev team 成員的 gmail 郵件過程中做的事。詳細步驟請參考 Shiun 的筆記：[用 SES, S3, Lambda 實現轉發信件功能](https://www.notion.so/SES-S3-Lambda-18fbed65f6ba41369b89292136e669ec?pvs=21) 

</aside>