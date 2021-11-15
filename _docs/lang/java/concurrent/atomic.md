---
title: 原子包（java.util.concurrent.atomic）
description: volatile关键字 & 原子类
---

## 一、volatile关键字

### 1、volatile作用

- 保证所修饰变量的可见性（一个线程修改了这个共享变量，其他线程立马就能知道）
- 保证所修饰变量的有序性（禁止指令重新排序）

重要：**volatile不能保证共享变量具备原子性**

### 2、volatile的使用场景

如果要使用volatile保证共享变量线程安全，必须满足以下两个条件：

1. 对共享变量的写操作不依赖当前值
2. 共享变量没有包含在含有其它变量的不变式中

#### 示例一（反例）：i++

```java
public class VolatileDemo {

    private static volatile int i;

    // i++看似是一个单独操作，实际上是一个由读取->修改->写入组合而成的组合操作，违反了上述第一个条件
    public static void main(String[] args) throws InterruptedException {
        Runnable runnable = () -> {
            // index < 1000时最终输出大概率还是2000，CPU算的太快了，main线程开跑的时候子线程已经跑完了
            for (int index = 0; index < 10000; index++) {
                i++;    // IntelliJ IDEA is very smart，warning <Non-atomic operation on volatile field 'i'>
            }
        };
        Thread thread = new Thread(runnable);
        thread.start();     // 子线程执行
        runnable.run();     // main线程执行
        thread.join();      // 确保子线程已经执行完毕
        System.out.println(i); 
    }
}

```
