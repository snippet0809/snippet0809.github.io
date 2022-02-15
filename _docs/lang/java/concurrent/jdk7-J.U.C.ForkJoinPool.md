---
title: Java Fork/Join框架
description: jdk7 Fork/Join框架
---

广泛用于java8的Stream中

## 一、ForkJoinPool

执行ForkJoinTask的线程池

```java
public class ForkJoinPool extends AbstractExecutorService {

    // 同步执行
    public void execute(ForkJoinTask<?> task) {
        externalSubmit(task);
    }

    // 执行并等待结果
    public <T> T invoke(ForkJoinTask<T> task) {
        externalSubmit(task);
        return task.joinForPoolInvoke(this);
    }

    // 
    public <T> ForkJoinTask<T> submit(ForkJoinTask<T> task) {
        return externalSubmit(task);
    }

    // 其余内容省略
}
```

## 二、ForkJoinTask

ForkJoinTask代表运行在ForkJoinPool中的任务

```java
public abstract class ForkJoinTask<V> implements Future<V>, Serializable {

    // 在当前线程运行的线程池中安排一个异步执行，简单的理解就是再创建一个子任务。
    public final ForkJoinTask<V> fork() { 
        // 方法实现省略
    }

    // 当任务完成的时候返回计算结果
    public final V join() {
        // 方法实现省略
    }

    //  开始执行任务，如果必要，等待计算完成
    public final V invoke() {
        // 方法实现省略
    }

    // 其它内容省略
}
```

## 三、ForkJoinWorkerThread

ForkJoinWorkerThread代表ForkJoinPool线程池中的一个执行任务的线程
