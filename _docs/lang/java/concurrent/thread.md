---
title: jdk1.0时代的多线程
description: java.lang.Thread & java.lang.Runnable
---

## 一、Thread类部分源码

```java
public class Thread implements Runnable {

    // 源码片段一：线程的六种状态
    public enum State {
        NEW,
        RUNNABLE,
        BLOCKED,
        WAITING,
        TIMED_WAITING,
        TERMINATED;
    }

    // 源码片段二：run() & start()
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

    // 源码片段三：Thread类的一些常用方法
    public static native void sleep(long millis) throws InterruptedException;
}

```

## 二、实现java.lang.Runnable接口创建线程

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

## 三、继承java.lang.Thread类创建线程

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
