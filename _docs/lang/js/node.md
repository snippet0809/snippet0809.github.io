---
title: node
description: nodejs
---

## npm镜像

### 1、替换registry

1. 查看当前registry：`npm config get registry` 
2. 设置镜像：`npm config set registry https://registry.npmmirror.com`
3. 取消镜像：`npm config set registry https://registry.npmjs.org`

### 2、[cnpm](https://npmmirror.com)

除了替换registry，也可以通过使用cnpm实现相同效果

安装cnpm：`npm install -g cnpm --registry=https://registry.npmmirror.com`
