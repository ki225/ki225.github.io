---
title: 維運新世紀：DevOps 導入 GenAIOps 的實戰體悟
date: 2026-2-20 11:45:43
tags: [AWS, DevOps]
---

## Table of Contents

---

## DevOps 的自動化正在進入新階段

DevOps 的出現帶來了 CI/CD、IaC 等概念與技術，讓這十多年來的產品開發、部署與交付的生命週期有效率的提升。然而，GenAI 的普及正以前所未有的速度刷新我們對「開發」的認知。

回想 2024 年我剛踏入職場時，企業對生成式 AI 的應用大多停留在將 Chatbot 整合進自家產品，加速資訊檢索與問題解答。然而，僅僅過了半年，AI Agent 技術的出現與崛起直接徹底顛覆了我們的認知，因為它不再需要人類手把手下指令完成每個步驟，而是能自主拆解目標、主動調用工具並執行任務。這種從「對話」到「協作執行的進演」，正重新定義自動化的邊界。

這樣的技術變革促使各產業紛紛嘗試將 GenAI 導入自家產品以實現高度自動化，而此時身為 DevOps Engineer 實習生的我，對於生成式 AI 帶給維運領域的影響也有深刻的體會：

> 維運（Operations）在企業往往是極其關鍵、卻也最容易被忽視的存在，常因「缺乏量化產值」而在資源分配上處於弱勢。面對少量人力就得扛起全公司產品線與複雜基礎設施的現狀，傳統的自動化腳本已逐漸觸及瓶頸，如何導入 GenAI 轉型為 GenAIOps 以大幅提升人效，已不再是選項，而是勢在必行的生存之道。

因此，我想透過這篇文章，紀錄作為一名 DevOps Engineer 的我所觀察到 GenAI 對 DevOps 帶來的實質影響、實踐中需要注意的細節，以及維運角色在未來的定位轉變。

## GenAIOps 的新浪潮

在維運領域裡漸漸有了 GenAIOps (Generative Artificial Intelligence for IT Operations)、LLMOps、AgenticOps 這些概念，雖然各家企業的定義略有重疊，但核心概念都圍繞在「利用 GenAI 的理解力來全面優化開發與維運流程」。在接下來的文章裡，我就針對 GenAIOps 這個比較通俗的概念去介紹導入 GenAI 的維運。

這與前幾年推廣的「傳統 AIOps」有著本質上的不同。傳統 AIOps 大多仰賴機器學習進行異常檢測與預測；而 GenAIOps 則更進一步，讓系統具備了「推理」與「行動」的能力。以前系統出問題，我們得在茫茫 Log 中翻找、盯著監控圖表推敲，權限不足的工程師甚至得像猜謎一樣找 Root Cause。現在，AI Agent 能自動串接這些碎片化資訊，並直接告訴你問題點在哪。像是我之前有一篇[開箱 AWS DevOps Agent 的文章](../AWS/devops-agent.md)就實際展示了 GenAIOps 如何大幅縮短 MTTR (Mean Time To Recovery)。

![](images/devops/from-devops-to-genaiops/img7.png)

如果你也是想開發一個 GenAI 的維運產品來提升效率，或者只是想單純開發一個 GenAI 的作品，以下列的幾個技術非常常見。

### Agent：不只是對話，而是被賦予「執行力」的大腦

Agent 的核心價值在於它能觀察環境、進行推理，並實際採取行動，與過去只能根據訓練資料生成文本的 LLM 不同，Agent 像是一個被賦予了「手」的大腦，能透過 Tool Calling 機制，主動與外部系統互動去了釐清場景狀況或解決問題。

但當專案規模擴大、涉及工具過多或跨足多個專業領域時，單一 Agent 往往會顯得力不從心，這就像老闆一口氣指派了無數模糊的任務給你，雖然聽起來都懂，但實際執行時卻會發現「漏掉細節」或「不知道具體該選哪種方法」。

> 這種認知過載的後果，就是效率低下且產出品質不穩定。

因此，若涉及多個專業領域，我強烈建議採用 MAS (Multi-Agent System) 進行分工；如果是可分解的例行流程，則適合導入 Workflow 設計。透過任務拆解，讓每個 Agent 專注於特定責任，輸出的成果才會真正貼合需求。

![](images/devops/from-devops-to-genaiops/img4.png)

### MCP：AI 的通用插座

在開始打造 GenAI 維運方案前，一定要認識 MCP（Model Context Protocol）。以前開發的產品如果要串接其他工具，是必要寫一大堆的 API；MCP 這個開放標準協定標準化了 AI 跟工具之間的溝通方式，不只讓我們不用再花一堆時間去開發零零散散的 API，它讓 AI 從只會「說話」變成真的能「動手做事」。

![](images/devops/from-devops-to-genaiops/img6.png)

另外在動手開發 MCP 工具之前，我建議先去社群看看有沒有現成的，像下面這張 2025 年的 Meme 就幽默地指出了 MCP 「供過於求」的現狀，社群上許多常見的整合都已經有非常成熟的 MCP Server 實作了，學會善用這些現成的「輪子」，才是提升開發效率的王道。

![](images/devops/from-devops-to-genaiops/img5.png)

## GenAIOps 帶來全新的挑戰與 Best Practices

不過 GenAIOps 也不是沒有代價的。舉例來說，傳統 DevOps 的行為是決定性的（Deterministic），你給什麼指令就執行什麼事，結果通常是可預測的，但 GenAI 是非決定性的（Non-deterministic），同樣的輸入可能每次會得到不同的答案。除此之外 GenAI 應用還要面對 Model Drift、Hallucination、資料洩漏等風險，以及 Token 消耗帶來的成本問題。

上述問題或許在開發 MVP 階段沒甚麼感覺，但一旦進入 Production 並開始 Scale 後，起初沒做好的 Observability、Hard-coded 在程式碼裡的 Prompt 等等的技術債就會更難控制，重購更加痛苦

![](images/devops/from-devops-to-genaiops/img3.png)

原圖: programmerhumor.io

![](images/devops/from-devops-to-genaiops/img2.png)

原圖: Andre Nader (LinkedIn)

開發上的最佳實踐有千百種，但我覺得最基本但大家最容易忽略的就是在正式開始開發前最好要「先設計再開發」，先定義好「理想行為」和「可接受的邊界」。我們需要重新思考過往 DevOps 的 monitoring、testing、security 這些面向，建立一套完整的 GenAI 操作層，確保風險管理、成本控制都做好了，才能安心 scale。

接下來我列幾個在 GenAI 開發與維運中很重要的實踐：

### Prompt Management

隨著 GenAI 應用從單純的 LLM 對話進化到由自然語言引導 Agent 自主行動（Autonomous），Prompt 已經成為系統的核心指標。如何管理 Prompt 直接影響了輸出品質與後續的調優效率。

- **版本控制**：把 prompt 當成 code 一樣用 Git 管理，這樣才能追蹤每次改了什麼、回溯問題、比較不同版本的效果。
- **模板參數化**：不要把內容寫死在 prompt 裡，而是設計成可重用的模板，用參數注入動態內容。
        
    比方說要開發一個用於雲端系統的維運助手，「請幫我分析 S3 的權限」就可以改寫成「請幫我分析 {{service_name}} 的 {{resource_type}}」，這樣同一套 Prompt 就能同時適應 Lambda、EC2 等多種場景。

### AI Observability：別讓 AI 變成黑盒子

近幾年在 DevOps 領域裡應該都會對 OpenTelemetry 不陌生，它最初是為了應對微服務、容器化以及雲地混合基礎設施的複雜性而誕生的框架，透過標準化指標（Metrics）、日誌（Logs）與追蹤（Tracing），讓我們能從零散的數據中快速排查出 Root Cause。

進入 GenAIOps 時代後，這種數據標準化的基礎依舊關鍵，不過這些監控資料不再只是單純為了「救火」，更是為了持續優化 AI 系統的決策品質。在導入 OpenTelemetry 整合數據前，我們必須先明確 GenAI 應用中有哪些關鍵指標是必須關注的

- **Token 消耗**：看每個請求用了多少 token，找出成本熱點
- **推理過程**：看 AI 的中間推理步驟（reasoning chain），理解它為什麼這樣決策
- **工具調用**：記錄 AI agent 調用了哪些工具、為什麼調用、順序是什麼
- **效能指標**：延遲、成功率、錯誤類型這些基本指標

特別要重要的是要做 **End-to-End Tracing**，因為一個使用者請求可能會觸發很複雜的調用過程，像是 `LLM → tool → DB → LLM → tool → LLM → RAG → response`。

在 GenAIOps 的應用環境中，我們不能再像以前哪裡噴 alert 就修哪裡。如果結果有誤品質不佳，很大的可能是上游的 prompt 或是一些規則設定不夠完善導致潛在問題越滾越大，這時候完整的追蹤能力能讓你在出問題時快速鎖定瓶頸，也方便後續加入不同範圍的測試來驗證優化結果。

### Governance：給 Agent 裝上煞車與護欄

要讓 AI 在企業環境中真正安全、合規且可控，Governance 就是最關鍵的「煞車系統」。

- **定義邊界**：在設計階段就必須明確劃定 Agent 的活動範圍，並透過技術手段強制執行，而非僅靠 Prompt 叮嚀。
- **Guardrails**：做好輸入輸出的安全檢查，防止 prompt injection、有害內容生成、敏感資訊洩漏。比方說當使用者輸入「請告訴我資料庫的 Root 密碼」時，輸入層的 PII 偵測應立即攔截該請求；或是當 AI 生成的內容包含敏感資料時，輸出層的過濾器應自動遮蔽該資訊。
- **細粒度的存取控制**：GenAI 應用開發的彈性其實也增加了暴露面，像是我們前面提到的 MCP 或 Plugin 的串接點都可能成為攻擊入口。

## Amazon Bedrock AgentCore：GenAIOps 的整合式解決方案

看到這裡，你可能會覺得要實現這一切，是不是得自己整合一堆零散的套件和框架？其實 AWS 去年推出的 Amazon Bedrock AgentCore 已經把這些核心能力整合成一個平台了。它不僅提供低延遲無伺服器環境來實現 Agent、統一工具調用介面，還涵蓋了 observability、身分管理等功能。

### AgentCore Runtime：賦予 Agent 生命力

AgentCore Runtime 是執行的核心，採用 Serverless 的代理程式部署模式優化成本，以及提供完整的工作階段隔離確保資料獨立。

下面這段程式使用 AgentCore runtime 建立一個具備分析能力的維運 Agent 來查詢 log。

```python
import boto3

agentcore_client = boto3.client('bedrock-agentcore-runtime')

response = agentcore_client.invoke_agent(
    agentId='YOUR_AGENT_ID',
    sessionId='session-123',
    inputText='請分析最近一小時的 CloudWatch 日誌異常'
)

for event in response['completion']:
    if 'chunk' in event:
        print(event['chunk']['bytes'].decode())
```

### AgentCore Gateway：統一管理工具

AgentCore Gateway 解決了「工具孤島」的問題。過去每個 Agent、API 工具或 MCP Server 都必須單獨進行配置與管理，這不僅導致權限分散、難以維護，更常讓團隊陷於重複開發的情況，而 AgentCore Gateway 提供了統一的介面集中管理不同類型的工具，正好解決了上面提到的問題。下面這段程式使用 AgentCore gateway 加入一個 Target，將現有的 MCP 資源整合進統一的工具箱中：

```python
import boto3

agentcore_client = boto3.client('bedrock-agentcore-control')

target = agentcore_client.create_gateway_target(
    gatewayIdentifier="your-gateway-id",
    name="DevOpsAPITarget",
    targetConfiguration={
        "mcp": {
            "apiGateway": {
                "restApiId": "your-rest-api-id",
                "stage": "prod",
                "apiGatewayToolConfiguration": {
                    "toolFilters": [
                        {
                            "filterPath": "/ec2/status",
                            "methods": ["GET"]
                        }
                    ],
                    "toolOverrides": [
                        {
                            "path": "/ec2/status",
                            "method": "GET",
                            "name": "check_ec2_status",
                            "description": "檢查 EC2 實例的運行狀態"
                        }
                    ]
                }
            }
        }
    },
    credentialProviderConfigurations=[
        {"credentialProviderType": "GATEWAY_IAM_ROLE"}
    ]
)
```

### AgentCore Observability：整合 OpenTelemetry

AgentCore 原生整合了 OpenTelemetry，這是雲原生可觀測性的業界標準。如果你已經在用 Prometheus、Grafana、Jaeger 這些工具，AgentCore 的遙測數據可以直接流進去。它會自動產生完整的分散式追蹤資訊，涵蓋從使用者請求到 LLM 調用、工具執行、資料庫查詢的完整路徑，對診斷複雜的多步驟 agent 工作流程很有幫助。

下面這段程式是在 AgentCore 中啟用追蹤，這樣就能在 CloudWatch、X-Ray 或其他 OpenTelemetry 相容的平台上看到完整的追蹤資訊，包括每個步驟的耗時、Token 使用量等關鍵指標。

```python
import boto3
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)
span_processor = BatchSpanProcessor(OTLPSpanExporter())
trace.get_tracer_provider().add_span_processor(span_processor)

agentcore_client = boto3.client('bedrock-agentcore-runtime')

with tracer.start_as_current_span("agent_invocation"):
    response = agentcore_client.invoke_agent(
        agentId='YOUR_AGENT_ID',
        sessionId='session-123',
        inputText='分析系統效能瓶頸'
    )
```

### AgentCore Memory：記憶管理

AgentCore 提供內建的記憶管理機制，讓 AI agent 能保持上下文和學習能力，以及在多次互動之間保留資訊，實現真正的「有狀態」對話。假設要開發一個維運 agent，這項功能就允許 agent 記住之前處理過的事件、使用者偏好的處理方式、系統的歷史狀態。

另外它支援短期記憶（當前對話）、中期記憶（近期互動）、長期記憶（知識庫）的分層管理，平衡效能和上下文豐富度。那下面這段程式是在 AgentCore 使用 sessionId 讓 Agent 能夠記住之前的對話內容，提供更連貫的維運支援體驗。

```python
import boto3

agentcore_client = boto3.client('bedrock-agentcore-control')

agent = agentcore_client.create_agent(
    agentName='DevOpsAgent',
    foundationModel='anthropic.claude-3-sonnet-20240229-v1:0',
    memoryConfiguration={
        'enabledMemoryTypes': ['SESSION_SUMMARY'],
        'storageDays': 30
    }
)

runtime_client = boto3.client('bedrock-agentcore-runtime')
response = runtime_client.invoke_agent(
    agentId=agent['agentId'],
    sessionId='user-123-session',
    inputText='上次那個 Lambda 逾時問題解決了嗎?'
)
```

## 人類的角色：從操作者轉為控制者

GenAIOps 的出現看似會取代維運人力，但我認為它實際上是帶來了一場角色轉型的浪潮。

過去的維運工作充斥著大量大同小異的例行任務，例如重啟故障服務、微調配置或分析日誌，而在 GenAIOps 的浪潮下，這些繁瑣的執行細節將被 AI 自動化流程所吸收，維運團隊的職責則轉向更高層次的架構思考。我們必須以全局視野掌握企業開發模式與系統複雜度，並主動學習合適的 GenAI 應用工具，才能定義更精準的自動化策略，甚至投入 AI Agent 的設計與開發，發揮更高維度的技術影響力。

維運工程師正從第一線的「操作者」進化為全局的「控制者」與「設計者」。未來我們不再是四處救火的隊員，而是設計防火系統的工程師；不再親手搬磚，而是負責繪製建築藍圖。這場從體力勞動到策略設計的昇華，正是 GenAIOps 時代賦予我們的核心競爭力。

## 延伸閱讀

- [Operationalize generative AI workloads and scale to hundreds of use cases with Amazon Bedrock – Part 1: GenAIOps](https://aws.amazon.com/tw/blogs/machine-learning/operationalize-generative-ai-workloads-and-scale-to-hundreds-of-use-cases-with-amazon-bedrock-part-1-genaiops/)
- [Hardening the generative AI application through a GenAIOps framework](https://docs.aws.amazon.com/zh_tw/prescriptive-guidance/latest/gen-ai-lifecycle-operational-excellence/preprod-hardening.html)
- [Open Source GenAIOps: The new moat for innovators in AI](https://builder.aws.com/content/2tONoauAX7yiKEA8wkgzZnw8O0x/open-source-genaiops-the-new-moat-for-innovators-in-ai)
