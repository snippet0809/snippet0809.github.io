---
title: jdk1.0时代的多线程
description: java.lang.Thread & java.lang.Runnable
---

## 一、Thread类部分源码

```java
public class Thread implements Runnable {

    // ***源码片段一：线程的六种状态***
    public enum State {
        NEW,                // 新创建的Thread对象，未调用start()
        RUNNABLE,           // 就绪（ready，调用start()后在线程池中等待CPU调度）和运行中（running，已获得CPU时间片）两种状态的统称
        BLOCKED,            // 阻塞于锁
        WAITING,            // 等待其它线程notify或interrupt
        TIMED_WAITING,      // 等待指定时间后自动返回
        TERMINATED;         // 执行完毕
    }

    // ***源码片段二：run() & start()***
    private Runnable target;

    // run()被称为线程体，用来定义线程需要执行的任务逻辑代码
    @Override
    public void run() {
        if (target != null) {
            target.run();
        }
    }

    // start()的作用是开启线程，线程开启后，当线程被CPU调度处于运行状态，此时线程就会调用run()
    public synchronized void start() { 
        // 方法实现省略，核心代码是调用了 private native void start0(); 这个方法
    }

    // ***源码片段三：Thread类的一些常用方法***
    // 当前线程让出CPU时间片转为TIMED_WAITING，不释放对象锁
    public static native void sleep(long millis) throws InterruptedException;

    // 当前线程让出CPU时间片转为READY，不释放对象锁
    public static native void yield();

    // 当前线程中调用其它线程的join()/join(final long millis)，当前线程让出CPU时间片转为WAITING/TIMED_WAITING，释放对象锁
    // 被调用join()的线程执行完毕或者millis时间到，当前线程一般会进入RUNNABLE，也有可能进入BLOCKED（因为join是基于wait实现的）
    // join()和sleep()作用上最大区别是前者会释放对象锁，后者不会
    public final void join() throws InterruptedException {
        join(0);
    }
    public final synchronized void join(final long millis) throws InterruptedException {
        // 方法实现省略
    }
}

```

### 二、创建线程

### 1、实现java.lang.Runnable接口创建线程

```java
    // 这里是创建了一个实现Runnable接口的匿名内部类
    Runnable runnable = new Runnable() {
        @Override
        public void run() {
            // 需要执行的任务逻辑
        }
    };
    Thread thread = new Thread(runnable);
    thread.start();
```

### 2、继承java.lang.Thread类创建线程

```java
    // 这里是创建了一个继承Thread的匿名内部类，并重写了父类Thread的run()
    Thread thread = new Thread() {
        @Override
        public void run() {
            // 需要执行的任务逻辑
        }
    };
    thread.start();
```

### 三、Thread类常用方法示例

```java
public static void mian(String[] args) {

    // 一、创建一个子线程去执行任务
    Thread thread = new Thread(() -> {
        // ...子线程任务逻辑省略...
    });
    thread.start();
    // 二、主线程执行自己的任务
    // ...主线程任务逻辑省略...
    // 三、确保子线程任务已经指行完了。Thread.sleep(5 * 1000L)这种不靠谱的等待只能存在于测试环境，生产环境一定不要出现
    thread.join();
}
```
