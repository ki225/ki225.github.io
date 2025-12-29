const e=`---
title: Git Rebase 修改 Commit Message 筆記
date: 2025-05-10 18:54:54
tags: [git]
---

因為團隊開發習慣是在 git commit 訊息內加上 PR 編號，但開發專題開一個太習慣就忘記在後面加上尾綴 PR 編號，所以就要來一次改全部(大概 20 筆有夠多 QAQ)

### Step 1: 開始 Rebase 修改訊息
\`\`\`
git rebase -i HEAD~N
\`\`\`
把 N 替換成自己要的數字，例如 \`git rebase -i HEAD~20\`。

### Step 2: 將要改的 commit 對應行的 \`pick\` 改成 \`reword\`
1. 在執行 rebase 過後，會打開一個文字編輯器，列出最近 N 筆 commit，如下：
    \`\`\`
    pick abc123 feat: initial layout
    pick def456 fix: adjust padding
    pick ghi789 chore: update package
    ...
    \`\`\`
2. 把每一筆你要修改的 commit 前面的 \`pick\` 改成 \`reword\`(或是 \`r\`):
    \`\`\`
    reword abc123 feat: initial layout
    reword def456 fix: adjust padding
    reword ghi789 chore: update package
    ...
    \`\`\`
    ![](images/git/rebase/img1.png)
3. 修改完成後就執行儲存（通常是 :wq 或按 Ctrl+O 再 Ctrl+X）

### Step 3: 處理 Rebase 過程中產生的衝突
1. 儲存後會依序開啟訊息編輯器讓你修改每筆 commit message，然而即使我們只是改 message，Git 在 rebase 時還是要 replay 原本的改動（內容、時間點都會回到當時下 commit 的狀態），而這就可能 conflict。
    - 解釋: 
        - 以下圖來說，原先我開發的 PR (SCRUM-270) 是下方的 feature branch，他是從 B 節點分支出去的(\`git checkout -b feature\` 的時候 main 的 Head 是 B 節點)，但當我開發到後期後 main 主支有更動。為了讓我開發的 feature 可以配合系統現在的狀態，我必須把我的現在的 branch 插枝在 F 節點(目前 main 的 head)
        - 但因為 commit E ( main ) 和 commit D (feature branch) 都對同一個檔案做影響，於是產生 conflict，於是就會在編輯器看到 cuurent 和 incoming 兩個狀態的衝突讓你選擇，其中 current 是 D，incoming 是 E
        \`\`\`bash
        <<<<<<< HEAD (main - commit E)
        incoming changes (from main)
        =======
        current changes (from feature)
        >>>>>>> feature (commit D)
        \`\`\`
    -  ![](images/git/rebase/img11.png)
2. 每當出現 conflict，執行以下三步（保留目前程式碼內容）：
    \`\`\`bash
    git checkout --ours . # 把目前目錄下的所有有 conflict 的檔案，統一選擇使用「current 版本」的內容（也就是 rebase 的 base），「ours」這邊是指 rebase 的目標分支（不是發出 rebase 的那筆 commit）
    git add . 
    git rebase --continue # 往下面的 commit 去做 rebase
    \`\`\`
3. 若出現訊息 \`The previous cherry-pick is now empty...\`，則代表空 commit 情況，代表這筆 commit 的內容因為與目前相同被視為空，可以選擇以下指令跳過該筆
    \`\`\`bash
    git rebase --skip 
    \`\`\`

### Step 4: 修改 commit message
1. 當 rebase 到我們當初說要 \`reword\` 的 commit 時，就會跳出文字編輯器如下，這時候就可以修改 commit message，像我就直接在底下加上我要的尾綴，修改完成再 \`:wq\` 儲存並離開即可。
    ![](images/git/rebase/img2.png)
2. 遇到衝突一樣執行三件套，之後就可以看到自己過程裡修改的紀錄如下
    \`\`\`bash
    git checkout --ours . 
    git add . 
    git rebase --continue 
    \`\`\`
    ![](images/git/rebase/img5.png)
3. 可以用 \`git status\` 查看目前狀況，例如下圖可以看到我還剩下兩筆 commit 沒有改  ![](images/git/rebase/img7.png)
4. 持續執行步驟 2 ，最後完成的話會看到以下結果 ![](images/git/rebase/img8.png)
### Step 5: Rebase 完成後推送更新
1. 因為歷史已被改寫，需使用 --force 強制推送。
    \`\`\`
    git push --force
    \`\`\`
2. 使用 \`git status\` 驗證是否完成，若出現 \`nothing to commit, working tree clean\` 則代表成功 ![](images/git/rebase/img9.png)
3. 完成 rebase 後，C 和 D 會分別變成 replayed commits C' 和 D'。即使 replayed commits 和原本 commit 一樣，他們也會因為 parent commit 不同的關係，讓他們的 hash 也跟著改變
![](images/git/rebase/img12.png)`;export{e as default};
