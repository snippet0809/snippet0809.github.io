---
title: 乐观锁和悲观锁的实现
description: 乐观锁和悲观锁的实现
---

## 乐观锁

实现步骤：

1. 表中设置一个version字段
2. 更新前先查询出version值
3. 更新时SET version = newVersion WHERE version = oldVersion
4. 若更新失败则重试，直至更新成功

## 悲观锁

用法：sql语句后面加上FOR UPDATE（例如 SELECT * FROM USER WHERE user_id = xxx FOR UPDATE）

注意：

- FOR UPDATE是排它锁，一旦加锁，其它操作只能等待
- FOR UPDATE命中索引是锁行，没有命中索引会锁表
- 仅适用于InnoDB，且必须在事务中(BEGIN/COMMIT)才能生效
