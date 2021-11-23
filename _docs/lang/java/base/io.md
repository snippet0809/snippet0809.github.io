---
title: jdk1.0 io & jdk1.4 nio
description: java.io包 & java.nio包
---

## 一、io和nio的区别

io|nio  
-|-
面向流|面向缓冲
阻塞IO|非阻塞IO
无|选择器

### 1、io面向流，nio面向缓冲区

io面向流意味着每次从流中读写数据，必须一次读写完毕，并且不能前后移动流中的数据。nio是将读写的数据放进一个缓冲区，需要时可在缓冲区中前后移动。nio需要检查缓冲区中是否包含所有需要处理的数据，还要确保当更多的数据读入缓冲区时不会覆盖尚未处理的数据。

### 2、io是阻塞IO，nio是非阻塞IO

io的各种流是阻塞的，当一个线程调用read()或write()时，该线程将被阻塞，直到数据被完全读取或完全写入。nio是非阻塞的，一个线程课管理多个通道（channel），线程从通道中发送数据读取/写入请求，当某一通道当前没有可用数据时，线程可以去处理其它通道的数据或者做其它事情。

### 3、nio的选择器允许一个单独的线程来监视多个输入通道

nio的选择器允许一个单独的线程来监视多个输入通道，你可以注册多个通道使用一个选择器，然后使用一个单独的线程来“选择”通道：这些通道里已经有可以处理的输入，或者选择已准备写入的通道。这种选择机制，使得一个单独的线程很容易来管理多个通道。

## 二、java.io包

jdk1.0只提供了通过字节流读写的方法，jdk1.1提供了通过字符流读写的方法。

```java
// 字节流读
public abstract class InputStream implements Closeable { 
    // 抽象类内容省略
}

// 字节流写
public abstract class OutputStream implements Closeable, Flushable {
    // 抽象类内容省略
}

// 字符流读
public abstract class Reader implements Readable, Closeable {
    // 抽象列内容省略
}

// 字符流写
public abstract class Writer implements Appendable, Closeable, Flushable {
    // 抽象类内容省略
}
```

## 三、java.nio包

最常用的缓冲区类型是ByteBuffer。除了ByteBuffer，还有ShortBuffer、IntBuffer、LongBuffer、FloatBuffer、DoubleBuffer、CharBuffer。

```java
public abstract class ByteBuffer extends Buffer implements Comparable<ByteBuffer> {
    
    public static ByteBuffer allocate(int capacity) {
        if (capacity < 0)
            throw new IllegalArgumentException();
        return new HeapByteBuffer(capacity, capacity);
    }

    // ***其它内容省略***
}
```
