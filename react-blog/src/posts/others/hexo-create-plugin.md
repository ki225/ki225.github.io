---
title: Hexo 個人網頁 建立自己的 plugin!
date: 2025-01-31 17:39:19
tags: [Hexo]
---

## 背景
這篇文章的源起只因突然想記錄我去了那些咖啡廳，所以就決定在我的頁面放一個咖啡收藏地圖!

### 使用別人的 plugin
剛好在 [Hexo 官網](https://hexo.io/plugins/)找插件的時候，看到對岸有大大做了一個插件叫做 `hexo-tag-map`，所以我就按照以下步驟把他下載到本地去用。

```sh=
npm install hexo-tag-map --save
```

![image](https://hackmd.io/_uploads/BJyxwG9_ke.png)
> 他的地圖大概是長這樣

但發現這個插件一張地圖只能放一個地標，對於去一堆咖啡廳的我來說我才不想每個咖啡廳都塞一張地圖在我的頁面上ww

所以我決定自己生一個插件!

### 建立一個插件
在 hexo 的資料夾底下找到 `node_modules` 資料夾，接著建立一個資料夾，這個名字就是你 plugin 的名稱，且必須是以 `hexo` 開頭。

```sh=
mkdir node_modules/hexo-my-plugin
cd node_modules/hexo-my-plugin
```

使用 npm 初始化一个新的 `package.json` 文件：
```sh=
npm init
```

接下來他會幫你設定 `package.json` 需要的東西，回答他的問題就好，回錯也沒關係之後還能改。大概流程如下:
```
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (hexo-collector-map)
version: (1.0.0)                                                                                                                          
description: A custom hexo plugin for keeping the place I visited.
entry point: (index.js)                                                                                                                   
test command:
git repository: <我的github repo>
keywords: ...
author: ...                                                                                                                            
license: (ISC)                                                                                                                       
type: (commonjs)
```

建立好後要讓自己的 hexo 知道有這個插件，所以要找到 hexo 資料夾底下的 `package.json` ，把 dependencies 新增我們剛剛建立的插件。
```json=
"dependencies": {
    "hexo": "^7.3.0",
    ...,
    "hexo-my-plugin": "^1.0.0" // 你新增的
  }
```

其他要注意的是，客製化插件資料夾底下的 `index.js` 必須加上以下語法註冊你設計的 tag，這樣之後 markdown 語法打出這些 tag 的時候 hexo 才知道可以做甚麼。

> 不可以和其他 tag 撞名

```js=
hexo.extend.tag.register(
  name,
  function (args, content) {
    // ...
  },
  options,
);
```

### 看看成果吧
重新更新網頁資料，在本地跑一次
```sh=
npx hexo clean && npx hexo g && npx hexo s
```

![image](https://hackmd.io/_uploads/ry7eqf5u1l.png)

### 部署上自己的網站
```
npx hexo generate
npx hexo deploy
```
