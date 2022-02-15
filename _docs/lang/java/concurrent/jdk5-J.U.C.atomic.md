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

## 二、原子类

在jdk1.5中，共有12个原子类

- 对基本类型提供支持的原子类有3个：AtomicInteger、AtomicLong、AtomicBoolean
- 对数组类型提供支持的原子类有3个：AtomicIntegerArray、AtomicLongArray、AtomicReferenceArray
- 对引用类型提供支持的原子类有3个：AtomicReference、AtomicReferenceFieldUpdater、AtomicMarkableReferce
- 对类的字段提供支持的原子类有3个：AtomicIntegerFieldUpdater、AtomicLongFieldUpdater、AtomicStampedFieldUpdater

在jdk1.8中，新增了4个原子类

- DoubleAccumulator
- LongAccumulator
- DoubleAdder
- LongAdder

这些原子类提供的方法大同小异，下面以最简单AtomicInteger.class为例进行说明，方便理解。

```java
public class AtomicInteger extends Number implements java.io.Serializable {

    private static final Unsafe U = Unsafe.getUnsafe();
    private static final long VALUE = U.objectFieldOffset(AtomicInteger.class, "value");
    private volatile int value;

    public AtomicInteger() {
    }

    public AtomicInteger(int initialValue) {
        value = initialValue;
    }

    public final int get() {
        return value;
    }

    public final void set(int newValue) {
        value = newValue;
    }

    // value += delta，返回前值
    public final int getAndAdd(int delta) {
        return U.getAndAddInt(this, VALUE, delta);
    }

    // value += delta，返回终值
    public final int addAndGet(int delta) {
        return U.getAndAddInt(this, VALUE, delta) + delta;
    }

    // boolean success = value == expectedValue   
    // if(success) value = newValue
    // return success
    public final boolean compareAndSet(int expectedValue, int newValue) {
        return U.compareAndSetInt(this, VALUE, expectedValue, newValue);
    }

    // value++，返回前值
    public final int getAndIncrement() {
        return U.getAndAddInt(this, VALUE, 1);
    }

    // value--，返回前值
    public final int getAndDecrement() {
        return U.getAndAddInt(this, VALUE, -1);
    }

    // value++，返回终值
    public final int incrementAndGet() {
        return U.getAndAddInt(this, VALUE, 1) + 1;
    }

    // value--，返回终值
    public final int decrementAndGet() {
        return U.getAndAddInt(this, VALUE, -1) - 1;
    }

    // --- jdk1.6新增方法 ---

    // set()会立刻更改，其它线程立刻可见；lazySet()会延迟（但最终会），其它线程会在一段时间后可见
    public final void lazySet(int newValue) {
        U.putIntRelease(this, VALUE, newValue);
    }

    // --- jdk1.8新增方法 ---

    public final int getAndUpdate(IntUnaryOperator updateFunction) {
        int prev = get(), next = 0;
        for (boolean haveNext = false;;) {
            if (!haveNext)
                next = updateFunction.applyAsInt(prev);
            if (weakCompareAndSetVolatile(prev, next))
                return prev;
            haveNext = (prev == (prev = get()));
        }
    }

    public final int updateAndGet(IntUnaryOperator updateFunction) {
        int prev = get(), next = 0;
        for (boolean haveNext = false;;) {
            if (!haveNext)
                next = updateFunction.applyAsInt(prev);
            if (weakCompareAndSetVolatile(prev, next))
                return next;
            haveNext = (prev == (prev = get()));
        }
    }

    // --- jdk1.9新增方法 ---

    public final int getPlain() {
        return U.getInt(this, VALUE);
    }

    public final void setPlain(int newValue) {
        U.putInt(this, VALUE, newValue);
    }

    public final int getOpaque() {
        return U.getIntOpaque(this, VALUE);
    }

    public final void setOpaque(int newValue) {
        U.putIntOpaque(this, VALUE, newValue);
    }

    public final int getAcquire() {
        return U.getIntAcquire(this, VALUE);
    }

    public final void setRelease(int newValue) {
        U.putIntRelease(this, VALUE, newValue);
    }

    public final int compareAndExchange(int expectedValue, int newValue) {
        return U.compareAndExchangeInt(this, VALUE, expectedValue, newValue);
    }

    public final int compareAndExchangeAcquire(int expectedValue, int newValue) {
        return U.compareAndExchangeIntAcquire(this, VALUE, expectedValue, newValue);
    }

    public final int compareAndExchangeRelease(int expectedValue, int newValue) {
        return U.compareAndExchangeIntRelease(this, VALUE, expectedValue, newValue);
    }

    public final boolean weakCompareAndSetVolatile(int expectedValue, int newValue) {
        return U.weakCompareAndSetInt(this, VALUE, expectedValue, newValue);
    }

    public final boolean weakCompareAndSetAcquire(int expectedValue, int newValue) {
        return U.weakCompareAndSetIntAcquire(this, VALUE, expectedValue, newValue);
    }

    public final boolean weakCompareAndSetRelease(int expectedValue, int newValue) {
        return U.weakCompareAndSetIntRelease(this, VALUE, expectedValue, newValue);
    }
}
```
