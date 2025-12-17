const o=`---
title: 介紹 AWS 如何在網頁上辨識使用者帳戶？以及第三方 Cookie 封鎖對使用 AWS 資源的影響？
date: 2025-02-15 00:10:35
tags: [cookie-session, AWS-Authentication, AWS, Authentication]
---

不知道大家有沒有想過，在瀏覽器使用 AWS console 跑服務時，為什麼登入一次 AWS 帳號就可以在其他分頁也使用同樣帳號去操作資源？此外，當我們切去其他的 assumed role 後，再到其他原先已登入過的分頁會看到 "You have been signed out"，這又是為什麼呢？

![alt text](images/AWS/session/img1.png)

## 背景知識: AWS 如何辨識使用者帳戶 ?
AWS 透過 Cookies（Cookie）來管理網頁登入的使用者資訊，當我們登入 AWS 控制台後，AWS 會將一個 session Cookie 存儲在瀏覽器中，這個 Cookie 是用來辨識、維持使用者的登入狀態，或是用來提供個人化內容(像是語言)。這樣當我們再次訪問 AWS 服務或在 console 中進行操作時，AWS 會使用這個 Cookie 來確定當前操作是由哪個帳戶發起的，並確保對應的權限正確。



## 什麼是 cookie ?
Cookie 是一種小型的文字檔案，由伺服器發送給網頁瀏覽器的一段可閱讀文本。當使用者(瀏覽器)造訪網站(呼叫伺服器)時，該伺服器會將其不加修改地返回並存儲在使用者的瀏覽器中。目前的 cookie 大多用在個人化、加速身份認證等地方。

當客戶端向伺服器發送請求時，伺服器可以透過 HTTP response header 的 Set-Cookie 欄位來設定 cookie，cookie的生成方式可以是透過像 CGI script 等方法生成。
\`\`\`
Set-Cookie: NAME=VALUE; expires=DATE; path=PATH; domain=DOMAIN_NAME; secure
\`\`\`
### cookie 的壽命 ?
從上述 \`Set-Cookie\` 的設定裡可以看到 \`expires\` 這個 attribute。expires 屬性指定了一個日期字串，定義該 cookie 的有效存續時間。一旦達到到期日，該 cookie 將不再被儲存或傳送，此屬性可以讓 cookie 跨 sessions；然而若沒有設定 expires，則 cookie 會在 session 結束時就失效。

根據這個特性，我們可以把 cookie 分成兩類：有設置 expiration date 就是 Persistent cookie；反之則為 non-persistent cookie，又叫做 session cookie，因為它只在瀏覽器開啟時有效，關閉瀏覽器後就會刪除。


## AWS 透過 cookie 記錄了什麼 ?
前面有提到我們的 "登入"、"個人化內容" 都是透過 cookie 來記錄，這邊我們就用 F12 打開後台看一下，可以發現一些 cookie 內容，像是 "aws-creds" 就是存著 url 編碼後的 JSON 內容。

![alt text](images/AWS/session/img2.png)

## 剛登入時，如何取得 cookie ?
剛登入時，會向 Amazon 伺服器發送 cookie request，之後就是透過一連串的 cookie 請求和回覆組成

- cookie request: 客戶(browser)送給 server 的 cookie
- cookie response: server 回傳給 client (browser) 的


![alt text](images/AWS/session/img3.png)

假設我們切換 region，這時 domain 又會不一樣，所以又會請求一次，伺服器就會給我們屬於新 domain 的 cookie。

![alt text](images/AWS/session/img4.png)

## 分頁如何知道?
一般瀏覽網頁都會把 cookie 存入我們的裝置，所以網頁可以直接從裝置上的 cookie 去取得使用者資訊；雖然無痕分頁不會儲存 cookie 在裝置上，但只要無痕頁面沒有被關閉，cookie 仍可以跨分頁去使用。這邊我們試試看在成功登入 console 後，在新分頁開啟資源頁面，可以發現我們能夠在不同分頁使用相同帳號拜訪 AWS 的其他資源，而這其實也是透過一連串的 cookie 請求和回覆組成。

首先它會帶著 cookie request 透過 url 進入頁面，當瀏覽器拿到這些 cookie 後，它就知道可以吐回我們的 credential 了。所以第二次請求的 url 後面就加入了被 hash 後的辨別資訊。

![alt text](images/AWS/session/img16.png)






### 為什麼會需要重新登入 ?

往右邊看可以發現每個 cookie 都有過期的時間，其中有關我當前 credential 的 cookie 會在一天內就過期(我使用 IAM role)。[官網文件](https://docs.aws.amazon.com/zh_tw/singlesignon/latest/userguide/howtosessionduration.html) 也表示 IAM role 最短工作階段(session)持續時間為 1 小時，最多只能設定為 12 小時。

![alt text](images/AWS/session/img11.png)





## resources
- [Cookie-Based Authentication in Amazon AppStream 2.0](https://docs.aws.amazon.com/appstream2/latest/developerguide/cookie-auth.html)
- [Cookie Notice](https://aws.amazon.com/tw/legal/cookies/)
- [Set session duration for AWS accounts](https://docs.aws.amazon.com/singlesignon/latest/userguide/howtosessionduration.html)
`;export{o as default};
