---
title: synchronized关键字
description: synchronized关键字的作用、特性、用法以及实现原理
---

## 一、synchronized作用

- 原子性：保证线程互斥地访问同步代码
- 可见性：某个线程对共享变量修改后，其它线程能立即发现
- 有序性：禁止jvm的编译器进行指令重排

注意：**synchronized和volatile的最大区别是volatile不具备原子性**

## 二、synchronized特性

### 1、synchronized是可重入锁

可重入锁：一个线程获取某对象的对象锁后，可以再次获取该对象的对象锁

可重入的最大作用是避免死锁，如果不是可重入锁，子类同步方法调用父类同步方法时就会发生死锁

### 2、synchronized是重量级锁

synchronized是通过对象头中的Monitor实现的，Monitor是通过操作系统的Mutex Lock实现的。
操作系统切换线程需要从用户态转换到核心态，代价很大，这也是synchronized效率低的原因。

## 三、synchronized用法

```java
public class SynchronizedDemo {

    // 修饰静态方法，等价于类锁，被锁的是当前类对象，也就是SynchronizedDemo.class
    public synchronized static void method1() {}

    // 修饰实例方法，等价于对象锁，被锁的是当前类的实例对象，也就是this
    public synchronized void method2() {}

    // 修饰代码块
    public void method1() {
        // 情况一：对象锁，被锁的是当前类的实例对象this
        synchronized(this) {
        }
        // 情况二：类锁，被锁的是类对象SynchronizedDemo.class
        synchronized(this.getClass()){
        }
        // 情况三：对象锁，被锁的是自定义的实例对象lock
        Object lock = new Object();
        synchronized(lock){
        }
    }
}
```

## 四、synchronized实现原理

在HotSpot虚拟机里，对象在堆内存中的存储布局可以分为三个部分：`对象头`、`实例数据`、`对齐填充`。

对象头由`Mark Word`和`类型指针`组成，其中`Mark Word`存储了对象的HashCode、GC分代年龄、锁状态标志、线程持有的锁、偏向线程ID、
偏向时间戳等信息，在32位虚拟机和64位虚拟机中分别占用32个和64个比特。`类型指针`指向对象的类型元数据，jvm通过这个指针来确定对象是哪个类的实例。

锁状态标志位（2个bit）共有五种：01（无锁定）、01（可偏向）、00（轻量级锁定）、10（重量级锁定）、11（GC标志） 。
当`Mark Word`中锁状态标志位为00或10时，`Mark Word`中存放的主要内容为指向锁的指针。