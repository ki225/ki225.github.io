const p=`---
title: PHP 在 Web Server 中的整合方式與效能比較：從 CGI 到 PHP-FPM 的演進
date: 2025-07-11 16:38:06
tags: [LAMP, PHP]
---

> 因為多數網頁是 LAMP 架構，同事讓我研究了一下 PHP-FPM 相關的內容，在過程裡面發現了不少新知識，所以寫了這篇筆記。在正式介紹 PHP-FPM 之前，我會先介紹一下它誕生的背景，也就是 CGI ! 

## CGI
CGI（Common Gateway Interface）並不是一個工具，而是早期 Web 技術中用來連接 Web 伺服器與應用程式（例如 PHP、Python）的橋接標準，它允許伺服器在收到請求後，將該請求傳遞給外部程式處理，並將結果返回給用戶端。

![alt text](images/LAMP/img1.png)

雖然 CGI 實作簡單、相容性高，但其實非常消耗資源且沒效率。在[這篇文章](https://apachetoday.com/mailprint.php3?action=pv&ltsn=2000-06-30-002-01-NW-LF-SW)有提到 \`mod_cgi\` 模組允許 Apache 收到 CGI 請求時，子程序會 fork 出一個新的 PHP-CGI process 再執行該 CGI，並將其輸出作為回應發送給客戶端，就像下圖所呈現的，每次瀏覽器發送一次請求， cgi 會替每一個請求建立一個 process 來解析 cgi 請求、進行 php 語法編譯。

![alt text](images/LAMP/img3.png)

在 Apache 1.3 中這沒問題，但在 Apache 2.0 中會影響效能。因為 Apache 2.0 採用執行緒型架構（threaded MPM），當多執行緒的程序進行 fork 時，會複製所有執行緒並立即終止除一個之外的其他執行緒。因此，後續發展出如 mod_php、FastCGI 與 PHP-FPM 等更高效的整合方式。

## mod_php
為了解決剛剛說到傳統 CGI 的問題，mod_php 就誕生了。mod_php 是一個 Apache HTTP Server 的模組，將 PHP interpreter 內建於 Apache process 中，讓 Apache 能夠直接編譯 PHP 程式，處理 PHP 請求時不需要重複啟動外部程序，進而減少啟動與溝通的開銷。

![alt text](images/LAMP/img4.png)

看似解決了問題，但還是有以下缺點 :
- mod_php 則在每個 Apache process 中都載入完整的 PHP Interpreter，造成記憶體等資源的浪費
- 無法將 PHP 處理與 Apache 分開部署，PHP 版本切換也不方便
- 因為 PHP 與 Apache 同個 process，mod_php 只可與 non-threaded 的 prefork MPM 搭配使用，無法在 threaded MPM (如 worker 或 event) 運作

## FastCGI 的誕生? 和 php-fpm 的關係?
為了解決 CGI 造成的資源消耗問題，CGI 被改良並發展成不同形式，像是 FastCGI ( 協議，給 PHP語言使用 )、WSGI ( 給 Python )。我們可以從下面兩張圖看出 CGI 和 FastCGI 的差異，FastCGI process 會在伺服器啟動前先行啟動，且一旦啟動後，子 process 會持續在事件迴圈 / FCGI 協議接收區等待下一次請求，而不會因應單一請求而終止或立即重新 fork process。

![alt text](images/LAMP/img2.png)
![alt text](images/LAMP/img5.png)


為了實現 FastCGI 協議，發展出 php-fpm（FastCGI Process Manager）作為用戶請求和 PHP 透過 FastCGI 溝通的實作方式。和 CGI 與 php_mod 不同，php-fpm 是讓 PHP 以獨立 process 運作，這些 PHP process 會在  worker process pool 裡，由 master process 管理。

![alt text](images/LAMP/img6.png)

每個 process 並不是執行完請求就關閉，而是會先閒置，等待處理下一個 request，如果閒置太久，且已經太多 process 都閒置狀態才會關閉，所以不會有反覆啟動 processs 導致資源浪費。


## Apache 使用 mod_php 與 php-fpm 的比較

| 比較項目   | Apache + mod\\_php     | Apache + php-fpm              |
| ------ | --------------------- | ----------------------------- |
| 運作方式   | PHP 嵌入 Apache process | PHP 為獨立 process，透過 FastCGI 溝通 |
| 所需 MPM | 只能搭配 prefork MPM      | 可搭配 worker 或 event MPM        |
| 記憶體使用  | 每個 process 含 PHP，記憶體高 | 靜態資源不需 PHP，記憶體更節省             |
| 安全性與彈性 | 同一使用者執行，無法隔離          | 可設定不同 user/pool，支援多版本與安全隔離    |
| 效能擴展性  | 有限                    | 高，可彈性配置與自動調整 process 數量       |



## Ref
- https://www.ibm.com/docs/en/i/7.4.0?topic=functionality-cgi
- [**各種不同PHP的差異在那？**](https://ithelp.ithome.com.tw/questions/10146391)
- [**How to Add PHP-FPM Support on Apache and Nginx Web Server on Ubuntu**](https://www.atlantic.net/vps-hosting/how-to-add-php-fpm-support-on-apache-and-nginx-web-server-on-ubuntu/)
- [Apache - MPM 工作模式調優](https://hackmd.io/@KaiChen/HyeWkd-3Y)
- [**Looking at Apache 2.0 Alpha 4**](https://apachetoday.com/mailprint.php3?action=pv&ltsn=2000-06-30-002-01-NW-LF-SW)
- [**PHP 基礎：PHP-FPM 與 mod_php？**](https://labs.botsnova.com/2024/09/15/php-fpm/)
- [**How to Use Apache HTTPD With php-fpm and mod_php**](https://www.zend.com/blog/apache-phpfpm-modphp)
- [**在 httpd 上使用 PHP-FPM**](https://mt116.blogspot.com/2020/03/httpd-php-fpm.html)
- [**CGI、FastCGI及PHP-FPM的关系**](http://www.ywnds.com/?p=5986)
- [Demystifying Nginx and PHP-FPM for PHP Developers](https://medium.com/@mgonzalezbaile/demystifying-nginx-and-php-fpm-for-php-developers-bba548dd38f9)`;export{p as default};
