# 垃圾收集器

## 垃圾收集算法

- 标记-清除
- 标记=复制
- 标记-整理

## CMS垃圾收集器（Concurrent Mark-Sweep）

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
