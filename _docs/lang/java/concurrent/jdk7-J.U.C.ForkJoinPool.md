---
title: Java Fork/Join框架
description: jdk7 Fork/Join框架
---

## 一、简介

### 1、工作窃取（work-stealing）算法

它的模型大致是这样的：线程池中的每个线程都有自己的工作队列（这一点和ThreadPoolExecutor不同，ThreadPoolExecutor是所有线程共用一个工作队列），当自己队列中的任务都完成以后，会从其它线程的工作队列中偷一个任务执行，这样可以充分利用资源。

### 2、fork/join框架

从JDK1.7开始，Java提供Fork/Join框架用于并行执行任务，它的思想就是讲一个大任务分割成若干小任务，最终汇总每个小任务的结果得到这个大任务的结果，其广泛用于java8的Stream中。

这种思想和MapReduce很像（input --> split --> map --> reduce --> output）

## 二、ForkJoinPool

执行ForkJoinTask的线程池

```java
public class ForkJoinPool extends AbstractExecutorService {

    // 同步执行
    public void execute(ForkJoinTask<?> task) {
        externalSubmit(task);
    }

    // 异步执行
    public <T> ForkJoinTask<T> submit(ForkJoinTask<T> task) {
        return externalSubmit(task);
    }

    // 执行并等待结果
    public <T> T invoke(ForkJoinTask<T> task) {
        externalSubmit(task);
        return task.joinForPoolInvoke(this);
    }
}
```

## 三、ForkJoinTask

ForkJoinTask表示运行在ForkJoinPool中的任务，它有两个重要子类：RecursiveTask & RecursiveAction。

```java
public abstract class ForkJoinTask<V> implements Future<V>, Serializable {

    // 在当前线程运行的线程池中创建一个子任务
    public final ForkJoinTask<V> fork() { 
        Thread t;
        if ((t = Thread.currentThread()) instanceof ForkJoinWorkerThread)
            ((ForkJoinWorkerThread)t).workQueue.push(this);
        else
            ForkJoinPool.common.externalPush(this);
        return this;
    }

    // 阻塞当前线程并返回结果
    public final V join() {
        int s;
        if ((s = doJoin() & DONE_MASK) != NORMAL)
            reportException(s);
        return getRawResult();
    }
}

// 需要返回值的ForkJoinTask
public abstract class RecursiveTask<V> extends ForkJoinTask<V> {
    protected abstract V compute();
}

// 不需要返回值的ForkJoinTask
public abstract class RecursiveAction extends ForkJoinTask<Void> {
    protected abstract void compute();
}
```

## 四、ForkJoinWorkerThread

```java
// ForkJoinWorkerThread表示ForkJoinPool线程池中的一个执行任务的线程
public class ForkJoinWorkerThread extends Thread {
}
```

## 五、示例

使用fork/join计算1+2+3+...+100=?

```java
public class ForkJoinDemo {
    // todo
}
```
