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
        // 情况二：类锁，被锁的是类对象SynchorizedDemo.class
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

对象头由`Mark Word`和`Class Metadata Address`组成，其中`Mark Word`存储了对象的HashCode、锁信息、分代年龄、GC标志等信息，
`Class Metadata Address`是类型指针，指向类的元数据，jvm通过这个指针来确定对象是哪一个类的实例。

锁也分不同状态，JDK6之前只有两个状态：无锁、有锁（重量级锁），而在JDK6之后对synchronized进行了优化，分为了四个状态：无锁状态、偏向锁、轻量级锁、重量级锁。
锁的类型和状态在对象头`Mark Word`中都有记录，在申请锁、锁升级等过程中JVM都需要读取对象的`Mark Word`数据。

每一个锁都对应一个Monitor对象，在HotSpot虚拟机中它是由ObjectMonitor实现的（C++实现）。每个对象都存在着一个Monitor与之关联，
对象与其Monitor之间的关系有存在多种实现方式，如Monitor可以与对象一起创建销毁，也可在当线程试图获取对象锁时自动生成，但当一个Monitor被某个线程持有后，它便处于锁定状态。
