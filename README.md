# ki225.github.io

## ⚙️ **Built with Hexo**  
This site is powered by **Hexo**, a fast and lightweight **static site generator** perfect for developers and bloggers. It's **customized with a minimalist theme**, ensuring a clean and distraction-free reading experience.  

## Branches
- Main
  - the complete file for building this page
- Master 
  - for presenting the Hexo Web page

## Hexo Quick Start

### Create a new post

``` bash
$ hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

``` bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

### Generate static files

``` bash
$ hexo generate
```

More info: [Generating](https://hexo.io/docs/generating.html)

### Deploy to remote sites

``` bash
$ hexo deploy
```

More info: [Deployment](https://hexo.io/docs/one-command-deployment.html)


## Others
```
git remote add origin https://github.com/ki225/ki225.github.io.git
```
At first I worked in Master branch, and I dont want that whole files filled in master branch.
```
git fetch
git checkout main || git checkout -b main origin/main
git merge master --allow-unrelated-histories
git add .
git commit -m "..."
git push origin main
```