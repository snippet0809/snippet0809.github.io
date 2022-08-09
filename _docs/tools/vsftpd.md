---
title: ftp服务器
description: ftp服务器安装、配置以及使用
date: 2022-08-09
---

## 一、安装

`yum install -y vsftpd`

## 二、配置

`vim /etc/vsftpd/vsftpd.conf`

```shell
# 禁止匿名登录
anonymous_enable=NO

# 限制用户不能跳出其主目录
chroot_local_user=YES
allow_writeable_chroot=YES

# 被动模式（PASV）端口配置，记得配置iptable
pasv_enable=YES
pasv_min=6000
pasv_max=7000
``` 

## 三、权限说明

### 1、限制跳出主目录

|                        | chroot_local_user=YES   | chroot_local_user=NO    |
|------------------------|-------------------------|-------------------------|
| chroot_list_enable=YES | 所有用户都不能跳出主目录，但list中用户除外 | 所有用户都可以跳出主目录，但list中用户除外 |
| chroot_list_enable=NO  | 所有用户都不能跳出主目录            | 所有用户都能跳出主目录             |

### 2、allow_writeable_chroot=YES作用

当ftp用户被限制在其主目录时，登录ftp会有以下错误

`500 OOPS: vsftpd: refusing to run with writable root inside chroot()`

报错原因：

`从2.3.5之后，vsftpd增强了安全检查，如果用户被限定在了其主目录下， 则该用户的主目录不能再具有写权限了！如果检查发现还有写权限，就会报以上错误.`

解决方案：

`allow_writeable_chroot=YES`

## 四、PORT（主动） & PASV（被动）

主动和被动指的是客户端，选择权也在客户端

- PORT：客户端向服务器21端口发送请求，建立连接。当需要传输文件时，客户端告诉服务器自己打开了哪个端口，服务器访问此端口传输文件。
- PASV：客户端向服务器21端口发送请求，建立连接。当需要传输文件时，服务器告诉客户端自己打开了哪个端口，客户端访问此端口传输文件。

注意：因为客户端一般都没有公网IP的，此时使用主动模式会导致服务器无法找到客户端建立传输链路

## 五、ftp用户

安装vsftpd后，会自动创建一个用户名为`ftp`用户，其主目录为`/var/ftp`

举例：新增一个ftp用户，用户名为`www`，主目录为`/srv/www`：

```shell
# 该用户只用作ftp文件传输，禁止登录
useradd www -s /sbin/nologin
chown -R www /srv/www
chmod 755 -R /srv/www
```