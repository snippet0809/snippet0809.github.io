# windows操作系统

## 一、更改ternimal为UTF-8编码

### 1、Git Bash

向`~/.bashrc`文件添加配置：`C:/Windows/System32/chcp.com 65001`

## 二、执行网络上下载的脚本

cnpm : 无法加载文件 C:\Users\xxx\AppData\Roaming\npm\cnpm.ps1，因为在此系统上禁止运行脚本。有关详细信息，请参阅https:/go.microsoft.com/fwlink/?LinkID=135170中的 about_Execution_Policies。

解决方案：更改windows系统的脚本执行策略。以管理员身份运行PowerShell，执行set-ExecutionPolicy RemoteSigned命令

- Restricted:可以执行单个命令，但不可以执行脚本（windows客户端计算机的默认策略）
- RemoteSigned:本地自己写的脚本可以执行，从网络上下载的脚本必须有数字签名才能执行（windows服务器计算机的默认策略）
