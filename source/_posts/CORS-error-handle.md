---
title: CORS 錯誤解析：CORS resource sharing error header preflight invalid status 解決方案
date: 2025-02-05 11:27:20
tags: [CORS, AmazonAPIGateway]
---

# 緣起
CORS 設置一直是 Amazon API Gateway 很重要的一環，過去聽到這個坑應該有快三次，但得到的解方都不是很清楚，於是這次我還是栽了 QQ，所以決定寫一下我的解決過程。

## 同源政策（Same-Origin Policy）是什麼？為什麼會有 CORS 問題？
### 從咖啡廳到奶茶店：理解同源政策
想像一下，你在一家咖啡廳點了一杯飲料，店員會把你的訂單拿去內場處理，但不會隨便幫你去隔壁的奶茶店點單，對吧？因為這家咖啡廳的規定是只能處理自己店內的訂單，不能直接與其他店共享點餐資訊或資源。這就是同源政策的概念！

換成網站的語言，同源政策是一種瀏覽器的安全機制，它會限制網站存取來自不同網域、協議或埠號的資源，以防止惡意網站竊取你的敏感資訊，例如銀行帳戶或個人郵件。簡單來說，網站 A 可以向網站 B 發送請求，但不能直接讀取回應的內容，這樣就能防止駭客建立一個看似正常的網站，卻暗中讀取你在其他網站的私人資料。

![alt text](images/cors/img3.png)


### 用奶茶店來解釋「不同源」的危險

假設你習慣去 A 奶茶店 買飲料，這家店的老闆認識你，每次你點珍珠奶茶，他都知道要少冰、半糖，還會幫你累積點數。某天，你經過一間裝潢幾乎一樣的 B 奶茶店，看起來就像是 A 奶茶店的分店。你不疑有他，點了一杯珍珠奶茶，甚至輸入了你的會員帳號密碼。但其實，這家 B 奶茶店 是假的！它只是模仿 A 奶茶店的樣子，偷偷記錄你的會員帳密，然後用你的資料去 A 奶茶店領取免費飲料，甚至可能做更壞的事情！

![alt text](images/cors/img2.png)

這就是所謂的 **跨來源攻擊（Cross-Origin Attack）**，當一個網站（B 奶茶店）冒充另一個網站（A 奶茶店），然後偷偷存取你的資料或發送惡意請求。

### CORS（Cross-Origin Resource Sharing，跨來源資源共享）：跨來源的信任證明
為了防止這種情況，瀏覽器才會設計「同源政策」，確保 A 奶茶店的會員系統不能被 B 奶茶店隨便存取。這樣即使你誤入 B 奶茶店，也不會讓它直接讀取你的 A 奶茶店帳號資訊！


#### 但如果 B 奶茶店真的是 A 奶茶店的合作夥伴呢？
這時候就需要 CORS 來幫忙，讓 A 奶茶店主動允許 B 奶茶店存取會員系統。當 A 奶茶店確認 B 奶茶店的請求是安全的，就會回傳一張「信任證明」，讓 B 奶茶店合法地請求 API，不會被瀏覽器擋下來。

簡單來說，CORS是一種瀏覽器的安全機制，用來限制不同來源（不同 domain、port 或協議）之間的 HTTP 請求。

## 我遇到的問題: CORS resource sharing error header preflight invalid status
我的前端（localhost:5173）要連後端（api.example.com），這就被視為跨來源（Cross-Origin）請求，所以瀏覽器會擋掉它。

![](images/cors/img1.png)
### 什麼是 Preflight Request？為什麼我的 POST 變成 OPTIONS？
當時 debug 是把後端 Amazon lambda 收到的整個 event 印出來，結果發現我的 request 變成 OPTIONS 了:

![](images/cors/img4.png)

如果請求是 **非簡單請求（non-simple request）**，瀏覽器會先發送一個 **預檢請求（Preflight Request）**，這是一個 OPTIONS 請求，用來詢問後端：「嘿，你允許我這樣發請求嗎？」

舉個以 JavaScript 網頁發送 POST 請求的例子，因為這個請求帶了 Content-Type: application/json，所以會觸發 OPTIONS 預檢請求。
```js
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Kiki' })
});
```
如果後端沒有正確回應這個 OPTIONS，你的 API 就會報錯！

## 解決
### API Gateway 設置 CORS 與 OPTIONS

![](images/cors/img5.png) 

API Gateway 設置完 OPTIONS method 後記得整合自己的 lambda...

![](images/cors/img6.png)

### 後端必須回應正確的 CORS Header
以無伺服器為例，我這邊加上以下這端 code
```py
http_method = event["requestContext"]["http"]["method"]

if http_method == "OPTIONS":
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
    "body": ""
    }
```

如此一來，你的伺服器在收到 OPTIONS 的時候就有辦法回應請求端(你的前端)說:「可以！你可以用 POST 方法來請求我，並且可以帶上 Content-Type 標頭。」於是你的前端瀏覽器再次把 POST 請求打過去，伺服器也正確回應。

>下方是一張網路上的圖，只是他是打 GET 請求過去。不過概念一樣

![](images/cors/img7.png)

如此以來就會過了 ouo