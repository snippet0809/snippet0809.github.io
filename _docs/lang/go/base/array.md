---
title: 数组、字符串和切片
description: 数组、字符串和切片
---

> 数组、字符串和切片在底层有着相同的内存结构，在上层因为语法的限制有着不同的行为表现

## 一、数组

在go语言中，数组类型是切片和字符串的基础

## 二、字符串

Go语言字符串的底层结构在reflect.StringHeader中定义：

```go
type StringHeader struct {
    Data uintptr    // 指向底层字节数组
    Len int         // 字符串长度
}
```

## 三、切片

切片的底层结构：

```go
type SliceHeader struct {
    Data uintptr    // 指向数组
    Len int         // 切片长度
    Cap int         // 切片容量
}
```
