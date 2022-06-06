---
title: Redis进阶
description: 高可用、分布式锁等
date: 2022-06-04
---

## 一、Redis如何保证高可用

三种部署模式：

- 主从模式
    特点：主节点读写、从节点只读
    缺点：1、主节点发生故障系统就会宕机 2、主从节点存储内容一致，浪费内存
- 哨兵模式
    特点：由一个或多个Sentinel实例监测主从节点，若主节点发生故障，自动将某个从节点升为新的主节点
    缺点：主从节点存储内容一致，浪费内存
- 集群模式：实现了数据的分布式存储

## 二、如何使用Reids实现分布式锁

### 1、使用setnx + expire命令

- 1. `setnx KEY VALUE`加锁
- 2. `expire KEY SECONDS`防止死锁

问题：因为分两部操作，所以不具备原子性。若setnx执行刚执行完，系统宕机，此时expire还未执行，造成KEY永不过期，即其它客户端永远不能获取锁

### 2、使用setnx + VALUE值设为过期时间 + getset

1. 执行`setnx KEY VALUE`加锁，此时VALUE为过期时间。若KEY不存在，加锁成功，否则进入第二步
2. KEY已存在，执行`get KEY`拿到VALUE，和当前时间对比，判断锁是否已过期。若未过期，加锁失败，否则进入第三步
3. 若锁已过期，执行`getset KEY NEW_VALUE`加锁

问题：`getset`虽然具备原子性，但是第二步和第三步这个整体不具备原子性。所以可能发生：A、B同时判断过期（判断这一步不具备原子性） -> A `getset`成功 -> B `getset`成功

### 3、使用set KEY VALUE [EX seconds][PX milliseconds][NX|XX]

从2.6.12版本开始，redis为set命令增加了一系列选项:

- EX seconds – Set the specified expire time, in seconds.
- PX milliseconds – Set the specified expire time, in milliseconds.
- NX – Only set the key if it does not already exist.
- XX – Only set the key if it already exist.

这个相当于把`setnx`和`expire`合并为一个命令，但这样仍会有问题：锁不具备客户端唯一标识，可能被其它客户端解锁

### 4、使用set KEY VALUE [EX seconds][PX milliseconds][NX|XX] + 唯一VALUE

1. 执行`setnx KEY VALUE EX SECONDS NX`加锁
2. 执行业务逻辑，完毕之后`get KEY`获取VALUE，判断此VALUE值和上一步的VALUE值是否一致
3. 若一致，解锁

问题：第二步和第三步这个整体不是原子操作，导致被其它客户端解锁

### 5、使用set KEY VALUE [EX seconds][PX milliseconds][NX|XX] + 唯一VALUE + LUA脚本

缺陷：KEY过期问题

### 6、使用Redisson

解决了Redis使用`set KEY VALUE [EX seconds][PX milliseconds][NX|XX]`实现分布式锁时KEY过期的问题

## 三、Redis如何解决Hash冲突

链式哈希：同一个哈希桶中，多个元素用一个链表来保存。

为了保持高效，Redis 会对哈希表做rehash操作，也就是增加哈希桶，减少冲突。为了rehash更高效，Redis还默认使用了两个全局哈希表，一个用于当前使用，称为主哈希表，一个用于扩容，称为备用哈希表。
