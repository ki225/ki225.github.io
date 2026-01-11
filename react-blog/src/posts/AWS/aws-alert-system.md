---
title: 用 AWS Lambda + Slack Bot 建立一個可擴充、事件導向、可互動的 Serverless 警報系統
date: 2025-12-8 10:24:02
tags: [AWS, DevOps, Terraform]
---

## Table of Contents

## 前言
在[上一篇筆記](why-we-need-alert-system.md)我們提到為什麼一個系統會需要警報系統，在接下來這篇文章就要來記錄一下有關建立這個警報系統的方法，以及為什麼這麼做的緣由。


![image](images/AWS/alert-system/img0.png)


## 我們的需求? 為什麼不直接用 Amazon chatbot?

### Amazon chatbot 整合 Slack

其實現在已經可以使用 Amazon chatbot (Amazon Q Developer in chat applications) 來實現警報串 Slack 通知的操作，而且串接上也非常簡單，不需要自己手動設定 Slack Bot 就可以完成，而且通知的警示訊息也算挺完整的，有包含了 region、帳號、原因、Alarm 對應的 Chart，甚至支援創建 Custom Action 操作在訊息上。

![image](images/AWS/alert-system/img2.png)

但其實從上面這張圖就可以發現 Amazon Q Chatbot 的功能還沒有足夠符合我們團隊對於警報系統的需求，這部分就包括:
- 它的圖片時間內會自動消失
- 它後續的狀態更新只會記錄在對話串，沒辦法直接更新最原始的訊息(圖片中 Alarm 解除後的綠色訊息是來自於左邊那則紅色訊息的對話串)
- 訊息無法客製化

總之綜合多種因素最後決定不使用 Amazon chatbot，原地鬼轉自己搞一個。(但期待之後 Amazon Q 可以把這些問題解決掉，這樣我就會去用 Q 了TT)


### 我們希望這個 Alert System 可以做到什麼?
在正式進入實作說明前，要先說一下這個系統要需要實現的部分。由於我們開發團隊日常是使用 Slack 這個通訊軟體進行溝通，包括開發上的討論、開發進度追蹤之類的，所以我們希望當問題發生時以及後續的狀況追蹤都可以在 Slack 上完成。

除了通訊軟體和狀態以外，我們希望這個 Alert system 是易於擴充的，也就是說它必須隨著系統功能越來越多時支援我們彈性增加要追蹤的狀態，也就是必須支援動態增加警報規則 (Alert Rule)；再來我希望這個警報系統必須像[這篇筆記](why-we-need-alert-system.md)所說的，紀錄發生了甚麼問題、誰去解決、狀態紀錄。而要追蹤的狀態有分成:
1. Alert 發生，目前沒人接手
2. Alert 發生，目前有人接手
3. Alert 解決

## 系統架構

經過初期的需求分析與技術評估後，我們設計了以下的 MVP 系統架構，整體設計圍繞三個核心理念：
- 事件驅動架構：當監控指標超過預設 Alert rule 的閾值時，CloudWatch Alarm 會自動觸發警報事件，啟動後續的通知流程
- IaC 管理：使用 Terraform 宣告式地定義所有警報規則、SNS Topic 和 Lambda 函數，確保環境一致性和可追溯性
- 所有溝通皆在相同地點：開發成員在 Slack 頻道中即時接收警報通知，並透過互動式按鈕認領處理，實現透明化的事件響應流程


![image](images/AWS/alert-system/img1.png)

### Serverless 架構為什麼適合 Slack 警報系統

其實對於外部企業來說，他們會比較偏愛去開機器搭配 Grafana 進行監控，但考量到我們團隊主要開發的系統本身就是完全無伺服器，因此直接整合 AWS 原生的 Alarm 功能搭配無伺服器服務 SNS、Lambda 等會是最好的選擇。

再來就是考量到本身系統業務量不大，CloudWatch Alarm 被觸發的事件可能一週只發生幾次或完全不發生，使用 Lambda 只在警報發生時才計費；最後也考量到團隊人力其實沒有那麼足夠，大家也都有自己的課業或工作需要顧，使用 Lambda 節省維護成本也是最符合我們需求的選擇。

### 使用 CloudWatch Alarm 管理 Alert Rule

CloudWatch Alarm 本身是 AWS 原生的監控警報服務，可以很輕鬆的整合 AWS 生態系統中的各種監控指標。而在實作上是使用 Terraform 去管理 CloudWatch Alarm 資源，因為我們團隊在開發、測試、生產環境是用 Region 做區隔，所以使用 Terraform 就可以在切換環境操作時直接用原本的程式碼部署到另一個 region 就好，大大的降低人工錯誤造成配置不一樣的風險。

```hcl
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "HighCPU-WebServer"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  threshold           = 80

    ...

  alarm_actions = [aws_sns_topic.cloudwatch_alarms.arn]
  ok_actions    = [aws_sns_topic.cloudwatch_alarms.arn]
}
```
### 為什麼不讓 Alarm 直接觸發 Slack? 而要引入 SNS?

其實 Alarm 大可以直接發到 Slack 就好，而不需要通過 SNS。但是這樣緊耦合的架構對於未來調整上就少了彈性，這邊給大家一個情境，假設系統未來有數百個 Alarm 被定義，但每個都直接綁死特定 Slack Channel，若之後要更換通訊軟體就必須一個一個去改，光想就覺得真的很痛苦QQ

另外，如果未來需要對這些 Alert 訊息做其他的處理，我們也可以很輕鬆的擴展成 Fan-out 的多訂閱者模式，只需要像下圖一樣讓更多的 Lambda 去訂閱 SNS topic 就可以完成了，很方便吧!

![image](images/AWS/alert-system/img16.png)

```
                    ┌──> Lambda (Slack) ────> Slack Channel
                    │
SNS Topic ──────────┼──> Lambda (PagerDuty) ─> On-call Engineer
  (一次發布)         │
                    ├──> Lambda (Email) ─────> Team Mailing List
                    │
                    ├──> Lambda (Webhook) ───> Monitoring Dashboard
                    │
                    └──> Lambda (DynamoDB) ──> 長期儲存警報歷史
```

## Slack 不應該只是通知管道
為了實現自動傳送通知到 Slack Channel，並讓開發成員可以透過按鈕互動來追蹤處理狀態，接下來會需要建立 Slack Bot 來實現

### Step 1. 建立 Slack Bot

1. 進入 [Slack API 官網](https://api.slack.com/apps)，點選
    
    ![image](images/AWS/alert-system/img3.png)
    
2. 定義 Slack Bot 名稱 & 選擇 channel
    
    ![image](images/AWS/alert-system/img4.png)
    
3. 建立完成後會看到有關於這個 bot 的基本資訊
    
    ![image](images/AWS/alert-system/img5.png)
    

### Step 2. 設定 Permission

1. 進入 OAuth & Permissions，滑到最底下，選擇以下 Scopes
    
    ![image](images/AWS/alert-system/img6.png)
    
2. 更改後 reinstall Slack Bot 到 channel

### Step 3. 儲存 Slack Bot secret
直接把 Token 資訊寫入 Lambda 會有不必要的風險，所以這邊使用 AWS Secrets Manager 集中管理敏感資訊，並透過 IAM 權限控制誰能存取。

1. 進入 OAuth & Permissions，複製 Bot User OAuth Token，等等會儲存它
    
    ![image](images/AWS/alert-system/img7.png)
    
2. 進入到 AWS Secrets Manager
3. 選擇 secret type & 存 secret
    - Other type of secret
    - Plaintext: 把原本預設的 Json 內容全部移除，接著直接貼上剛剛複製的 Bot User OAuth Token
    
    ![image](images/AWS/alert-system/img8.png)
    
4. 定義 secret 名稱
    
    ![image](images/AWS/alert-system/img9.png)
    
5. 剩下的保留預設
    
    ![image](images/AWS/alert-system/img10.png)
    
6. 完成
    
    ![image](images/AWS/alert-system/img11.png)
    

### Step 4. 開啟 Incoming Webhook
Incoming Webhook 是 Slack 提供的最簡單的訊息發送方式，它會建立一個專屬的 HTTPS URL，並透過 POST 請求發送 JSON 格式的訊息。其實這也就代表任何人只要有這個 URL 就能發訊息到該頻道，因此等等生成的 URL 在後續使用上也要小心保管，


1. 在 Slack App 設定頁點開 Incoming Webhooks 頁面，打開 **`Activate Incoming Webhooks`** 開關，打開後畫面如下
    
    ![image](images/AWS/alert-system/img12.png)
    
2. 滑到下方，點 **Add New Webhook** 
    
    ![image](images/AWS/alert-system/img13.png)
    
3. 選頻道
    
    ![image](images/AWS/alert-system/img14.png)
    
4. 完成
    
    

### Step 5. 開啟 Interactivity

由於我們需要新增按鈕功能來控制 Alert 狀態變更，所以會需要發送請求給 Slack Bot，並讓 Slack Bot 幫我們把請求重新導向到對應的處理 Lambda。這部分就是需要設定 Interactivity 來讓我們順利和 Slack Bot 互動。

1. 在 Slack App 設定頁設定頁點開 Interactivity & Shortcuts ****頁面，打開 **`Interactivity`** 開關
    
    ![image](images/AWS/alert-system/img15.png)
    
2. 貼上 Gateway URL

### Step 6. 完成


## MVP 成果

目前 MVP 系統已經實現了核心功能，可以發送我們自己定義的警報內容，並且搭配清楚的顏色讓大家一目了然當前狀態。未來這個系統還會再加上一些 on call 之類的功能，如果有其他技術上值得分享的地方還會再拿來寫一篇部落格分享。

![image](images/AWS/alert-system/img17.png)
![image](images/AWS/alert-system/img18.png)
