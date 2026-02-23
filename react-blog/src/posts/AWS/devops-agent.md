---
title: 開箱 DevOps Agent
date: 2025-12-10 10:04:27
tags: [AWS, DevOps]
---

## Table of Contents

---

## 前言

因為實習的關係，主管剛好和我聊了一下 Azure 推出好一陣子的 SRE Agent，但因為我們公司主要是使用 AWS 建 infra 所以希望可以找到解決方案是支援 AWS 的，很幸運的在被指派這個任務後的第二個禮拜 AWS 就推出了 DevOps Agent，看到[第一手熱騰騰的發表資訊](https://aws.amazon.com/tw/blogs/aws/aws-devops-agent-helps-you-accelerate-incident-response-and-improve-system-reliability-preview/)當然就是超級興奮地要來開箱阿XD 而且還是免費的 preview 階段當然不能錯過。這篇筆記就會針對現有的功能去操作，並且提出一些我的想法。

![image](images/AWS/devops-agent/imgn.png)

## 甚麼是 AWS DevOps Agent

AWS DevOps Agent 本質上是一個 **常駐、持續運作的 AI SRE Agent**，它的工作流程可拆成三大部分：

- Always-on Autonomous Incident Response (自動偵測 → 自動分析 → 自動提案修復)
    - 接到 Alert 時自動啟動 AWS DevOps Agent
    - 快速彙整所有相關 Operational Data，如 CloudWatch Logs
    - AI 語意分析問題原因，並產生 Root Cause Hypothesis（根因假設）
    - 自動生成修復步驟（Runbook-Aware）
    - 允許使用者一鍵修復
- Proactively Prevent Future Incidents (事件後分析 → 建議改進 → 預防下次出事)
- Get More From Your DevOps Tools (整合 Observability + Git + Runbooks + CI/CD)

## 開始使用

在正式開始用前會看到 AWS 要求我們先建立一個 Agent Space，所以這邊先來和大家介紹什麼是 Agent Spcae。

### DevOps Agent Space
DevOps Agent Space 可以想像成一個獨立的「AI SRE 工作區」，它決定了 Agent 能看到什麼、能做什麼、能連到哪些工具。

在一個 Agent Space 裡，我們可以設定它能訪問哪些 AWS 帳號，這會決定它能看到哪些 CloudWatch、ECS、Lambda、RDS 等服務；另外也可以設定讓它能串接哪些觀測工具，像是 Datadog 或 New Relic，這決定了 Agent 能搜集哪些 log 和 metrics；再來我們也可以設定能連 GitHub 或 GitLab 上的指定 repo，這樣它才能做 Code Diff、找出破壞性的 Commit。

AWS 官方建議在以下幾種情境使用多個 Agent Spaces 會比較好，比如說不同團隊要分開管理時，Web Front-end 組可以用 Space-Web，Backend API 組用 Space-API，Data Platform 組用 Space-Data，ML Infra 組用 Space-ML。或者當我們有環境分離需求時，也很適合用不同的 Space 把 Prod 環境跟 Dev/Staging 環境隔離開來，又或是分離微服務架構、資料隔離等等。

- [官方 Source](https://docs.aws.amazon.com/devopsagent/latest/userguide/userguide-what-are-devops-agent-spaces.html)


### 建立步驟
建立 Agent Space 的過程蠻簡單的，這邊詳細帶大家看每一個步驟的設定

1. 建立 **Agent Space**
    
    首先要用 IAM Identity 管理誰能登入 Web App
    
    ![alt text](images/AWS/devops-agent/img1.png)
    
    ![alt text](images/AWS/devops-agent/img2.png)
    
2. agent space 部署完成
    
    等大概一分鐘後 agent space 就會部署完成了

    ![alt text](images/AWS/devops-agent/img3.png)

## 功能介紹

### Runbook 設定

設定 runbooks 來引導 AWS DevOps Agent 在執行事故回應調查（incident response investigations）以及事故預防分析（incident prevention evaluations）時的行為。

1. 點右上角設定
    
    ![alt text](images/AWS/devops-agent/img4.png)
    
2. 會看到 runbook 畫面
    
    ![alt text](images/AWS/devops-agent/img5.png)
    

### Topology

DevOps Agent 的 topology 功能，簡單說就是 Agent 自動幫你拼出來的系統架構圖，不只是讓我們可以更清楚的了解目前帳號的資源狀況，DevOps Agent 也會在後續使用這個圖來分析問題、追蹤影響範圍、尋找 root cause。

![alt text](images/AWS/devops-agent/img6.png)

實作上，它會先做 Resource discovery，由 Agent 掃描你的資源，接著進行 Relationship Detection，分析各資源之間的關聯。如果我們有允許串接 GitHub 或 GitLab，它就還能做 Code & Deployment Mapping，把部署版本和程式碼差異顯示在拓樸上。


更厲害的是它的 Observability Behavior Mapping。它會從 CloudWatch、Metric spikes 等地方推論哪些服務之間有 request/response 的依賴關係。舉例來說，如果 API A 的 latency spike 跟 DB B 的 CPU spike 高度相關，它就會推測 A 跟 B 之間有依賴關係。

這邊就實際玩一次拓樸功能，但目前 topology 的建立過程需要等蠻久的，光是我使用的帳號只是個沒有什麼資源的訓練帳號，跑一次拓樸就要將近四十分鐘，如果換做是資源不斷增減且量很大的企業，我覺得這不會是一個很有吸引力的功能。

跑完之後你可以看到 Topology sources 和 Topology graph。

![alt text](images/AWS/devops-agent/img7.png)
![alt text](images/AWS/devops-agent/img8.png)

更多有關 DevOps Agent 的拓樸功能也可以看官方文件
- [What is a DevOps Agent topology? - AWS DevOps Agent](https://docs.aws.amazon.com/devopsagent/latest/userguide/userguide-what-is-a-devops-agent-topology.html)


### Web App

Web App 是 DevOps Agent 的主要操作介面，在建立完成 Agent Space 後會提供一個獨立的 link，透過這個 link 就能開啟一個有時間限制的 Session 進入介面。而這個 Web App 主要有以下幾個功能：

1. Start an investigation
    
    ![alt text](images/AWS/devops-agent/img9.png)
    
    - 有幾個按鈕作為常見問答，點進去後會用 AI 生成範例詢問模板。
        - 例如當我點了”high CPU usage”
            
            ![alt text](images/AWS/devops-agent/img10.png)
            
        - 可以選擇要查詢的  region、帳號、時間
            
            ![alt text](images/AWS/devops-agent/img11.png)
            
        - 首先會列出使用者問題以及 agent response，時間軸越往下是越新的回覆
            
            ![alt text](images/AWS/devops-agent/img12.png)
            
        - 接著他會開始爬所有資源，對每個資源進行 data fetching，以 ec2 為例子，可以看到 agent 查詢甚麼，按下展開 detail 後可以看到查詢結果
            
            ![alt text](images/AWS/devops-agent/img13.png)
            
        - 最後生成 root cause
            
            ![alt text](images/AWS/devops-agent/img14.png)
            
    - 如果有打過 investigation 就會留下紀錄，類似 GPT conversation
        
        ![alt text](images/AWS/devops-agent/img15.png)
        
2. prevention
    
    Prevention 功能則是讓你主動進行預防性分析。按下 run now 之後，它就會開始分析並給出結果。

    ![alt text](images/AWS/devops-agent/img16.png)
    
    - 按下 run now
        
        ![alt text](images/AWS/devops-agent/img17.png)
        
    - 給結果

        這邊因為還沒有任何資源有異常所以掃不到，等等我會做幾個實驗來測試真的發生狀況後 DevOps Agent 的反應

        ![alt text](images/AWS/devops-agent/img18.png)
        
### 串接 Observability Tools 

AWS DevOps Agent 做 AI SRE 和自動化 Incident 調查往往會需要很多資料，包括 logs、Metrics、Traces、Alerts/Incidents、Resource health events 等等。但其實這些資料很多都不是只存在 AWS CloudWatch，所以 DevOps Agent 允許整合像是 Datadog、Dynatrace、New Relic、Splunk 這些工具，不過我這邊沒有現成資料儲存在第三方，所以就不實際操作了。

更多可以看官方文件
- [Connecting telemetry sources - AWS DevOps Agent](https://docs.aws.amazon.com/devopsagent/latest/userguide/configuring-capabilities-connecting-telemetry-sources-index.html)

![alt text](images/AWS/devops-agent/img19.png)

### Connecting MCP Servers

DevOps Agent 也支援我們在帳號層級註冊 MCP 伺服器，這樣這個帳號內所有 Agent Spaces 都能自由選擇要使用 MCP 伺服器中的哪些工具。

設定的方式是選取某個 Agent Space，進入 Capabilities，在 MCP Servers 區域點選 Add，然後選擇要加入此 Space 的 MCP server。你可以選擇工具模式，either 允許所有工具，或是只選擇特定工具。

更多可以看官方文件
- [Connecting MCP Servers - AWS DevOps Agent](https://docs.aws.amazon.com/devopsagent/latest/userguide/configuring-capabilities-connecting-mcp-servers.html)


## 實驗

前面講了那麼多功能，究竟實不實用還是要看它爬出來的過程和結果能不能讓使用的人一眼就排查出解決問題的方式，甚至是直接幫我們正確處理。所以這邊簡單做了實驗讓大家看一下它的效果。

### 實驗 1: 建立一個 CPU 爆炸的案例

1. 這邊我先在 EC2 上安裝並執行了 stress 指令，讓 CPU 使用率飆高。接著就來看看 DevOps Agent 能不能幫我們排查出錯誤和原因。

    ```bash
    sudo yum install -y stress || sudo apt-get install -y stress
    stress --cpu 2 --timeout 300
    ```
    ![alt text](images/AWS/devops-agent/img20.png)

2. 使用 DevOps Agent 開啟 `Start an investigation`，他很快發現錯誤了

    [alt text](images/AWS/devops-agent/img21.png)

3. 針對 ec2 找原因

    ![alt text](images/AWS/devops-agent/img22.png)

4. 自行建立 SSM 進去 ec2 看

    ![alt text](images/AWS/devops-agent/img23.png)

5. 排查出錯誤是因為我執行指令把 CPU 搞爆

    ![alt text](images/AWS/devops-agent/img24.png)

6. 推斷出 root cause，不過它不知道我執行哪條指令造成這個錯誤

    ![alt text](images/AWS/devops-agent/img25.png)

### 實驗 2: 查找沒有被使用的資源

1. 輸入問題

    ![alt text](images/AWS/devops-agent/img26.png)
    
2. 講得不夠清楚他就不回答了，例如我要她查詢 unused resource，他會要求我講明確，例如 idle ec2
    
    ![alt text](images/AWS/devops-agent/img27.png)
    
3. 根據他在左邊的內容，我在右邊的聊天室回答他我想要 all of the above，聊天室會自己抓前後文&吃左邊 investigate 的資料
    
    ![alt text](images/AWS/devops-agent/img28.png)
    
4. 我重新在聊天室跟他說我要調查所有資料後，他確實重新幫我跑了 investigation
    - 可以看到彩色那條寫 in progress
    
    ![alt text](images/AWS/devops-agent/img29.png)
    
5. 不過他還是有限制搜尋範圍啦，要查其他的要自己想
    
    ![alt text](images/AWS/devops-agent/img30.png)
    
6. root cause 有點醜，但列出資源的部分挺清楚
    
    ![alt text](images/AWS/devops-agent/img31.png)
    ![alt text](images/AWS/devops-agent/img32.png)
    

### 實驗 3: 接續問他有沒如何減少成本

1. 接續實驗 2，問其他問題也不會誤觸 investigation，會正常回我怎麼減少成本
    
    ![alt text](images/AWS/devops-agent/img33.png)
    


## 開箱心得

整體來說是個很棒的體驗，無論是 DevOps Agent 非常清楚直觀的操作介面，還是它在分析 root cause 過程時的透明化資訊，又或是聊天介面和排查資訊以及原生資源的整合都給了我很好的體驗。

首先讓我印象最深刻的是 DevOps Agent 清楚且直觀的操作介面。在進行 root cause analysis 時，它並不是只丟給我一個結論，而是把整個分析過程透明地呈現出來，包含它檢查了哪些資源、觀察到哪些異常訊號、以及推論背後的邏輯。這種設計對於 DevOps 或 SRE 角色來說非常重要，因為它讓 AI 的判斷是「可被理解、可被追溯」的，而不是一個黑盒子，實現了可解釋性。再來就是 chat 與 investigate 之間的整合也相當流暢。DevOps Agent 能夠正確理解使用者在對話中輸入的自然語言，是單純的詢問，還是希望它進一步展開調查行為，這讓整體互動非常自然，不需要刻意切換心智模式或操作流程。

不過也有一些不足的地方，像是以維運人員的角度來說就希望它能更好的整合 runbook 方面的功能，雖然目前 DevOps Agent 有支援設定 runbooks 來引導它在執行事故回應調查和事故預防分析時的行為，但可惜目前階段還不能辦到以 AWS 官方的最佳實踐角度去生成 runbook；另外它也不會自動產生成本報告或清除資源，只會掃描跟應用相關的資源，而且拓樸生出來的結果也沒有把每個資源的完整關聯列出來。

另外它也沒有定時「自動摘要」這種功能，必須自己手動去進行 investigate 操作，而且調查的方向也要自己預先設定好，不能請 DevOps Agent 憑空去探索所有資源是否有發生錯誤的情形，這是我覺得和 Azure SRE Agent 相比起來略為不足的地方。最後就是 investigate 的總結呈現沒那麼美觀，只適合開發人員看，對於 PM 等角色而言很難清楚看出結論，不過這部分應該可以請右邊的 chat 用白話文來解釋一遍。
