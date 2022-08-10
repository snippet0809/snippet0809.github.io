---
title: RocketMQ
description: 消息队列
date: 2022-08-10
---

## 一、消息队列作用

- 削峰填谷
- 异步处理
- 模块解藕

## 二、RocketMQ消费模式

消费模式由consumer决定，消费纬度为topic

- 集群模式：每条消息只会被GROUP中的其中一个Consumer消费
- 广播模式：每条消息都会被GROUP中的所有Consumer消费一遍

## 三、消费消息是PUSH还是PULL

RocketMQ没有真正意义的push，虽然有push类，但底层采用的是长轮询机制，还是pull

不用push的原因：broker主动推送的话，可能造成推送的快，消费的慢，进而造成消息堆积

## 四、broker如何处理消息拉取请求？

Broker有消息就直接返回给Consumer，没有的话就Hold住这个连接，等消息来了直接返回给Consumer

## 五、重复消费

造成原因： Consumer消费完之后会向Broker发送ACK，Broker收到ACK后剔除消息，但由于网络原因ACK可能会无法送达

解决方案：Consumer端在业务逻辑上保证幂等性

## 六、顺序消费

发送端：使用单一个线程发送到指定QUEUE，代码上实现MessageQueueSelector接口
消费端：使用单一线程消费指定QUEUE里的消息

## 七、消息不丢失

1. Producer：同步发送，失败重试
2. Broker：同步刷盘
3. Consumer：消费完成后手动ACK确认

