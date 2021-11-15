---
title: jdk1.5 java.util.concurrent包
description: 线程池 & 带返回值的线程
---

## 一、线程池

```java
public class ThreadPoolExecutor extends AbstractExecutorService {

    public ThreadPoolExecutor(int corePoolSize,
                            int maximumPoolSize,
                            long keepAliveTime,
                            TimeUnit unit,
                            BlockingQueue<Runnable> workQueue,
                            ThreadFactory threadFactory,
                            RejectedExecutionHandler handler) {
        // 构造方法具体实现省略
    }
    // 类其它内容省略
}
```

线程池有六个重要参数：

1. 核心线程数：线程池维护的最小线程数量
2. 最大线程数：工作队列满了的情况下线程池会创建新线程，如果线程总数达到了最大线程数还有任务进来则执行拒绝策略
3. 空闲线程存活时间、时间单位：当前线程数大于核心线程数 & 存在空闲线程，这个时间段后会空闲线程会被销毁
4. 工作队列：jdk提供了四种工作队列
    1. ArrayBlockingQueue：基于数组的有界阻塞队列，按FIFO排序。
    2. LinkedBlockingQuene：基于链表的无界阻塞队列（其实最大容量为Interger.MAX），按照FIFO排序。由于该队列的近似无界性，当线程池中线程数量达到corePoolSize后，再有新任务进来，会一直存入该队列，而不会去创建新线程直到maxPoolSize，因此使用该工作队列时，参数maxPoolSize其实是不起作用的。
    3. SynchronousQuene：一个不缓存任务的阻塞队列，添加一个任务后必须等线程取出这个任务才能继续添加。
    4. PriorityBlockingQueue：具有优先级的无界阻塞队列，优先级通过参数Comparator实现。
5. 线程工厂
6. 拒绝策略：jdk中提供了四种拒绝策略
    1. AbortPolicy（默认）：直接丢弃任务，并抛出RejectedExecutionException异常。
    2. CallerRunsPolicy：“调用者运行”的一种调节机制，该策略既不会抛弃任务，也不会抛出异常，而是将某些任务回退到调用者，从而降低新任务的流量。当线程数大于最大线程数时，哪个线程调用就由哪个线程执行（比如main线程调用的那么就由main线程去执行）。
    3. DiscardPolicy：直接丢弃任务，不抛出任何异常
    4. DiscardOldestPolicy：抛弃队列中等待最久的任务，然后把当前任务加入队列中尝试再次提交。

## 二、带返回值的线程

### Callable\<V>接口

基于Runnable接口创建的线程没有返回值，Callable接口可以实现带返回值的线程

```java
@FunctionalInterface
public interface Callable<V> {
    /**
     * Computes a result, or throws an exception if unable to do so.
     *
     * @return computed result
     * @throws Exception if unable to compute a result
     */
    V call() throws Exception;
}
```

## Future\<V>接口和FutureTask\<V>类

Futuer\<V>表示线程的执行结果，使用Futuer\<V>::get()可以获取线程执行后的返回值，这个方法会阻塞

```java
public interface Future<V> {

    boolean cancel(boolean mayInterruptIfRunning);

    boolean isCancelled();

    boolean isDone();

    V get() throws InterruptedException, ExecutionException;

    V get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException;
}
```

FutureTask\<V>类实现了RunnableFuture\<V>接口，RunnableFuture\<V>接口继承了Runnable和Future\<V>两个接口，
所以FutureTask\<V>既可以作为Runnable被线程执行，又可以作为Future\<V>得到Callable\<V>的返回值

```java
public class FutureTask<V> implements RunnableFuture<V> {
    // 具体实现省略
}

public interface RunnableFuture<V> extends Runnable, Future<V> {
    void run();
}
```

## 示例

```java
    Callable<String> callable = new Callable<String>() {
        @Override
        public String call() throws Exception {
            return null;
        }
    };
    FutureTask<String> futureTask = new FutureTask<>(callable);
    Thread thread = new Thread(futureTask);
    thread.start();
    String result = null;
    try {
        result = futureTask.get();
    } catch (InterruptedException | ExecutionException e) {
        e.printStackTrace();
    }
    System.out.println(result);
```
