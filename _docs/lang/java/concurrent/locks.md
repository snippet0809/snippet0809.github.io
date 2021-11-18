---
title: java.util.concurrent.locks包
description: Lock接口及其实现类
---

## 一、Lock接口 & ReentrantLock实现类

### Lock接口

```java
public interface Lock {

    void lock();

    void lockInterruptibly() throws InterruptedException;

    boolean tryLock();

    boolean tryLock(long time, TimeUnit unit) throws InterruptedException;

    void unlock();

    Condition newCondition();
}
```

### ReentrantLock实现类

```java
public class ReentrantLock implements Lock, java.io.Serializable {
    
    // 默认非公平锁
    public ReentrantLock() {
        sync = new NonfairSync();
    }
    
    // true-公平锁，false-非公平锁
    public ReentrantLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
    }
    
    // 其它实现省略
}
```

### 1、ReentrantLock和synchronized的区别

- ReentrantLock使用灵活但需要手动加解锁，synchronized自动加解锁但使用上不灵活
- ReentrantLock可以响应中断，synchronized不可以
- 两者默认都是非公平锁，ReentrantLock可以实现公平锁，synchronized不可以
- 两者都是可重入锁，synchronized不需要手动释放锁，ReentrantLock需要手动释放锁，加锁和解锁的次数需一致

ps：**jdk1.6对synchronized优化后，在低并发的情况下synchronized性能已经和ReentrantLock相当了，高并发情况下ReentrantLock性能会占优**

### 2、使用示例

```java
    Lock lock = new ReentrantLock();
    if (lock.tryLock()) {
        try {
            // 同步处理逻辑
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    } else {
        // 尝试加锁失败的情况
    }    
```

## 二、ReadWriteLock接口 & ReentrantReadWriteLock实现类

### ReadWriteLock接口

```java
public interface ReadWriteLock {

    Lock readLock();

    Lock writeLock();
}
```

### ReentrantReadWriteLock实现类

```java
public class ReentrantReadWriteLock implements ReadWriteLock, java.io.Serializable {

    private final ReentrantReadWriteLock.ReadLock readerLock;
    private final ReentrantReadWriteLock.WriteLock writerLock;

    public static class ReadLock implements Lock, java.io.Serializable {
        // 实现省略
    }

    public static class WriteLock implements Lock, java.io.Serializable {
        // 实现省略
    }

    public ReentrantReadWriteLock.WriteLock writeLock() { return writerLock; }
    public ReentrantReadWriteLock.ReadLock  readLock()  { return readerLock; }

    // 其它实现省略 
}
```
