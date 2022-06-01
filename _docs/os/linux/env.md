---
title: 开发环境搭建
description: java等
date: 2022-06-01
---

## 一、shell脚本格式转化

Windows下编写的脚本，在Linux上运行出现`$'\r': command not found`,是因为Windows的换行是`\r\n`，而linux是`\n`。

1. `yum install -y dos2unix`
2. `dos2unix xxx.sh`

## 二、java开发环境

安装jre：`yum install -y java-1.8.0-openjdk`

参考文档：<http://openjdk.java.net/install/>
