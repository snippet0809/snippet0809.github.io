---
title: Git 
description: 版本管理工具
---

## 查看配置

`git config --global --list`

- global：用户级别
- system：系统级别

## 配置代理

`git config --global http.proxy socks5://127.0.0.1:10808`

`git config --global https.proxy socks5://127.0.0.1:10808`

## 取消代理

`git config --global --unset http.proxy`

`git config --global --unset https.proxy`

## git reset & git revert

git reset ${versionId}：回退到指定版本，该版本之后的commit被舍弃

git revert ${versionId}：撤销指定版本提交的内容，之后生成一个新的版本
