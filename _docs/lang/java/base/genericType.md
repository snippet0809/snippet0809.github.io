---
title: 泛型
description: 泛型
---

## 一、<? extends T> & <? super T>

<? extends T> 和 <? super T> 是Java泛型中的通配符（Wildcards）和边界（Bounds）的概念

- <? extends T> 是指上界通配符（Upper Bounds Wildcards），T是上界，<? extends T>表示T或其子类
- <? super T> 是指下界通配符（Lower Bounds Wildcards），T是下届，<? super T>表示T或其父类
