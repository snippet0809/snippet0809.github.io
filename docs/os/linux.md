# Linux操作系统

## 一、~/.bashrc和~/.bash_profile的区别

- .bash_profile：登录shell启动时会被执行，一般用于设置全局的环境变量（登录时加载）
- .bashrc：打开非登录shell时会加载，一般用于定义与终端操作相关的配置（每次打开终端时都加载）

## 二、常用命令

### 1、ln

作用：创建链接

格式：`ln <源文件> <链接名>`

举例：`ln -s /usr/local/bin/python3 /usr/local/bin/python`

参数：

- -s：软链接
