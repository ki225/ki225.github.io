# ki225.github.io
My hexo website


## Branches
- Main
  - the complete file for building this page
- Master 
  - for presenting the Hexo Web page

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