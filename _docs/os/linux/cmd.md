---
title: Linux下常用命令
description: Linux下常用命令
---

## 一、网络相关

### 1、netstat（查看网络状况）

netstat用于显示tcp，udp的端口和进程等相关情况

netstat常用来查看端口占用：`netstat -tunlp | grep {port}`

参数：

- -t：仅显示tcp相关选项
- -u：仅显示udp相关选项
- -n：拒绝显示别名，能显示数字的全部转化为数字
- -l：仅列出在Listen(监听)的服务状态
- -p：显示建立相关链接的程序名

## 2、ssh（远程连接）

`ssh -p:{port} {username}@{host}`

当端口为ssh默认端口时（22）时可以省略-p参数

## 二、文件相关

### 1、scp（文件拷贝）

scp是secure copy的缩写，是基于ssh的文件拷贝命令

`scp [可选参数] {source_file} {target_file}`

可选参数：

- -r：递归复制。拷贝目录时要带上此参数

### 2、lsof（列出当前打开的文件）

lsof(list open files)是一个列出当前系统打开文件的工具

lsof常用来查看端口占用：`lsof -i:{port}`
