const n=`---
title: Git Submodule 介紹與管理指南  
date: 2025-01-31 22:40:37
tags: [git, submodule]
---

## Git Submodule 介紹與刪除教學


### 什麼是 Git Submodule？  
Git Submodule 讓你可以將另一個 Git 倉庫作為 子模組 添加到自己的專案中，簡單來說就是別人的 repo 剛好有你要的功能，然後你就把他 clone 到自己的 repo 底下來用

### 如何檢查 Git 專案是否包含 Submodule？  

- 方法 1：使用 \`git submodule status\`
    \`\`\`
    git submodule status
    \`\`\`
- 方法 2：檢查 \`.gitmodules\` 檔案


### 如何移除 Git Submodule？  


- 步驟 1：刪除 \`.gitmodules\` 記錄
    \`\`\`sh
    git submodule deinit -f -- <submodule-name>
    \`\`\`

- 步驟 2：刪除 \`<submodule-name>\` 內的 Git 設定
    \`\`\`sh
    rm -rf <submodule-name>/.git
    \`\`\`

- 步驟 3：從 Git 中刪除該子模組
    \`\`\`sh
    git rm -rf <submodule-name>
    \`\`\`

- 步驟 4：確認變更並提交
    \`\`\`sh
    git commit -m "Removed submodule <submodule-name>"
    git push origin main
    \`\`\`
`;export{n as default};
