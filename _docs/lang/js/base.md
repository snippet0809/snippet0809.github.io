---
title: js语法基础
description: js语法基础
date: 2022-05-19
---

## 浅拷贝 & 深拷贝

```javascript
// 通过反序列化实现深拷贝
const a = [1, 2, 3]
const b = JSON.parse(JSON.stringify())
```
