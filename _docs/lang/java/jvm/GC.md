---
title: 垃圾收集器
description: java与C++之间有一堵由内存动态分配和垃圾收集技术所围成的高墙，墙外面的人想进去，墙里面的人却想出来
---

## 一、如何判断对象已死？

### 引用计数算法

定义：在对象的头信息里维护一个引用计数，当有引用指向时+1，释放时-1

优点：简单方便

缺点：解决不了互相引用的情况

### 可达性分析算法

判断对象到GC Roots之间是否有引用链

## 二、垃圾收集算法

- 标记-清除
- 标记-复制
- 标记-整理

## 三、常见的新生代、老年代垃圾收集器组合

### 1、Serial & Serial Old

单线程垃圾收集器

### 2、ParNew & CMS

#### ParNew

多线程版本的Serial

#### CMS（Concurrent Mark-Sweep）

特点：基于标记-清除算法、并发收集、牺牲系统吞吐量已达到低延迟

收集过程：

1. 初始标记（只标记与GC Roots关联的对象，时间很短，需要Stop The World）
2. 并发标记（并发标记与GC Roots关联对象的对象）
3. 重新标记（需要Stop The World）
4. 并发清除

缺陷：

- 对CPU资源敏感。在CPU算力吃紧的情况下，会造成程序响应变慢。
- 可能会发生concurrent mode failure。清理浮动垃圾时会造成Full GC
- 标记-清除算法引发的空间碎片化问题

ps：**CMS在jdk9中已被标记为Deprecated**

### 3、Parallel Scavenge & Parallel Old

jdk7和jdk8默认的垃圾收集器（jdk6是不是还不知道，没验证过）

### 4、G1垃圾收集器（Garbage First）

jdk9以后成为默认的垃圾收集器，第一款全能的垃圾收集器
支持Mixed GC
