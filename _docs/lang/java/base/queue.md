---
title: jdk1.5队列
description: java.util.Queue & java.util.Deque
---

## 一、Queue接口

jdk1.5时诞生，Queue是一个满足先进先出（FIFO, first in first out）的线性表，它只允许在表的前端进行删除操作，在表的后端进行插入操作

```java
public interface Queue<E> extends Collection<E> {

    // 添加元素到队尾，容量不足抛IllegalStateException
    boolean add(E e);

    // 添加元素到队尾，容量不足返回false
    boolean offer(E e);

    // 移除队首元素，队列若为空抛NoSuchElementException
    E remove();

    // 移除队首元素，队列若为空返回null
    E poll();

    // 获取队首元素，队列若为空抛NoSuchElementException
    E element();

    // 获取队首元素，队列若为空返回null
    E peek();
}
```

## 二、Deque接口

jdk1.6时诞生，Deque是一个双端队列，插入和取出操作既可以发生在队首也可以发生在队尾

```java
public interface Deque<E> extends Queue<E> {
   
    // 插入元素。在队首插入一个元素，如果元素为null，抛出NullPointerException
    public void addFirst(E e);

    // 插入元素。在队末插入一个元素，如果元素为null，抛出NullPointerException
    public void addLast(E e);

    // 插入元素。在队首插入一个元素，容量满时返回false
    public boolean offerFirst(E e);

    // 插入元素。在队末插入一个元素，容量满时返回false
    public boolean offerLast(E e);

    
    // 获取元素。获取队首元素，但不移除，队列为空时抛出NoSuchElementException
    public E getFirst();

    // 获取元素。获取队末元素，但不移除，队列为空时抛出NoSuchElementException
    public E getLast();

    // 获取元素。获取队首元素，但不移除，队列为空时返回null
    public E peekFirst();

    // 获取元素。获取队末元素，但不移除，队列为空时返回null
    public E peekLast();


    // 移除元素。移除队首元素，队列为空抛出NoSuchElementException
    public E removeFirst();

    // 移除元素。移除队首元素，队列为空抛出NoSuchElementException
    public E removeLast();

    // 移除元素。移除队首元素，队列为空时返回null
    public E pollFirst();

    // 移除元素。移除队末元素，队列为空时返回null
    public E pollLast();

    // 移除元素。从头部开始遍历Deque，移除第一个和参数相等的元素，未发现相等元素返回false
    public boolean removeFirstOccurrence(Object o);

    // 移除元素。从尾部开始遍历Deque，移除第一个和参数相等的元素，未发现相等元素返回false
    public boolean removeLastOccurrence(Object o);


    // 栈操作。出栈，即移除队首元素，等价于removeFirst()，队列为空时抛出NoSuchElementException
    public void push(E e);
    // 栈操作。入栈，即放入队首元素，等价于addFirst()，如果元素为null，则抛出NullPointerException，如果栈空间受到限制，则抛出IllegalStateException
    public E pop();

    // ***重写自Queue和Collection的方法省略***
}
```

## 三、实现类LinkedList

java.util.LinkedList在jdk1.2时作为List的实现类出现，在jdk1.5时实现了java.util.Queue接口，在jdk1.6时实现了Deque接口
