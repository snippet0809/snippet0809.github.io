---
title: jdk1.2容器类
description: java.util.Collection & java.util.Map
---

## 一、简介

自jdk1.2开始，java加入了容器类。容器类分为两种，分别为java.util.Collection和java.util.Map。

```java
public interface Collection<E> extends Iterable<E> {
    // 接口内容省略
}

public interface Map<K,V> {
    // 接口内容省略
}
```

## 二、Collection接口

Collection接口有三个重要的子接口，分别为java.util.List\<E>、java.util.Set\<E>和java.util.Queue\<E>

```java
public interface List<E> extends Collection<E> {
    // 接口内容省略
}

public interface Set<E> extends Collection<E> {
    // 接口内容省略
}

public interface Queue<E> extends Collection<E> {
    // 接口内容省略
}
```

### 1、元素可重的List

List接口有两个重要的实现类：java.util.ArrayList和java.util.LinkedList

其它一些知识：

1. 自jdk1.0开始就有的java.util.Vector\<E>后来也实现了List接口，Vector是线程安全的，但这个古老的类不推荐开发者再使用。
2. java.util.RandomAccess接口里面没有任何内容，它只是一个标志接口，实现了该接口的Collection支持快速随机访问，且实现了该接口的List使用for循环遍历的效率高于使用迭代器遍历

#### 1-1、java.util.ArrayList

jdk17中ArrayList部分源码，行为上和jdk8一样，但代码写的比jdk8精简多了

```java
public class ArrayList<E> extends AbstractList<E> implements List<E>, RandomAccess, Cloneable, java.io.Serializable {

    // ArrayList默认容量是10
    private static final int DEFAULT_CAPACITY = 10;
    // ArrayList底层是使用数组保存元素的
    transient Object[] elementData; // non-private to simplify nested class access
    // elementData默认值
    private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
    // ArrayList的长度，不是容量。容量是指能放多少个元素，长度是指实际已经放了多少个元素
    private int size;

    // Fail-Fast(快速失败机制)：java集合(Collection)中的一种错误检测机制。迭代器在迭代集合的时候，
    // 如果集合在结构上发生改变的时候，就有可能会发生fail-fast，即抛出ConcurrentModificationException。
    // fail-fast机制并不保证在异步修改时一定会抛出异常，它只是尽最大努力去抛出，所以这种机制一般仅用于检测bug
    // 
    // modCount用来记录ArrayList被修改的次数，ArrayList每次被修改（例如add()、remove()）的时候这个值都会+1
    // 迭代器初始化过程中会将modCount赋值给迭代器的expectedModCount，如果迭代过程中有其它线程修改了ArrayList，
    // 那么迭代器的expectedModCount和ArrayList的modCount就会不相等，进而发生ConcurrentModificationException
    protected transient int modCount = 0;

    public boolean add(E e) {
        modCount++;
        add(e, elementData, size);
        return true;
    }

    private void add(E e, Object[] elementData, int s) {
        if (s == elementData.length)
            elementData = grow();
        elementData[s] = e;
        size = s + 1;
    }   

    private Object[] grow() {
        return grow(size + 1);
    }

    // 扩容算法。数组为空返回一个初始容量的数组，否则返回一个扩容50%的数组
    private Object[] grow(int minCapacity) {
        int oldCapacity = elementData.length;
        if (oldCapacity > 0 || elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
            int newCapacity = ArraysSupport.newLength(oldCapacity,
                    minCapacity - oldCapacity, /* minimum growth */
                    oldCapacity >> 1           /* preferred growth */);     // 右移一位等价于除二舍余
            return elementData = Arrays.copyOf(elementData, newCapacity);
        } else {
            return elementData = new Object[Math.max(DEFAULT_CAPACITY, minCapacity)];
        }
    }

    // 其它实现省略
}
```

#### 1-2、java.util.LinkedList

jdk17中LinkedList部分源码。**jdk1.2时它只是简单的一个List，jdk1.5时它也成了一个Queue，jdk1.6时它还成了一个Deque**

```java
public class LinkedList<E> extends AbstractSequentialList<E> implements List<E>, Deque<E>, Cloneable, java.io.Serializable {

    transient int size = 0;
    // 链表的第一个节点
    transient Node<E> first;
    // 链表的最后一个节点
    transient Node<E> last;

    // LinkedList底层是用链表存储元素的
    private static class Node<E> {
        E item;
        Node<E> next;
        Node<E> prev;

        Node(Node<E> prev, E element, Node<E> next) {
            this.item = element;
            this.next = next;
            this.prev = prev;
        }
    }

    // 
    // jdk1.2时它只是简单的一个List。方法实现省略
    // 

    public boolean add(E e) {}

    public E get(int index) {}

    public boolean remove(Object o) {}


    // 
    // jdk1.5时它也成了一个Queue。方法实现省略
    //

    // 和add(E e)一样都是在队首插入一个元素。在容量已满的情况下，add()会抛出IllegalStateException，offer()只会返回false
    public boolean offer(E e) {}

    // 获取队首元素，但不移除，队列为空时返回null
    public E peek() {}

    // 获取队首元素，但不移除，队列为空时抛出异常
    public E element() {}

    // 移除队首元素，队列为空时返回null
    public E poll() {}

    // 移除队首元素，队列为空时抛出异常
    public E remove() {}


    //
    // jdk1.6后，它还成了一个Deque。方法实现省略
    //

    // 插入元素。在队首插入一个元素，如果元素为null，抛出NullPointerException
    public void addFirst(E e) {}

    // 插入元素。在队末插入一个元素，如果元素为null，抛出NullPointerException
    public void addLast(E e) {}

    // 插入元素。在队首插入一个元素，容量满时返回false
    public boolean offerFirst(E e) {}

    // 插入元素。在队末插入一个元素，容量满时返回false
    public boolean offerLast(E e) {}

    
    // 获取元素。获取队首元素，但不移除，队列为空时抛出NoSuchElementException
    public E getFirst() {}

    // 获取元素。获取队末元素，但不移除，队列为空时抛出NoSuchElementException
    public E getLast() {}

    // 获取元素。获取队首元素，但不移除，队列为空时返回null
    public E peekFirst() {}

    // 获取元素。获取队末元素，但不移除，队列为空时返回null
    public E peekLast() {}


    // 移除元素。移除队首元素，队列为空抛出NoSuchElementException
    public E removeFirst() {}

    // 移除元素。移除队首元素，队列为空抛出NoSuchElementException
    public E removeLast() {}

    // 移除元素。移除队首元素，队列为空时返回null
    public E pollFirst() {}

    // 移除元素。移除队末元素，队列为空时返回null
    public E pollLast() {}

    // 移除元素。从头部开始遍历Deque，移除第一个和参数相等的元素，未发现相等元素返回false
    public boolean removeFirstOccurrence(Object o) {}

    // 移除元素。从尾部开始遍历Deque，移除第一个和参数相等的元素，未发现相等元素返回false
    public boolean removeLastOccurrence(Object o) {}


    // 栈操作。出栈，即移除队首元素，等价于removeFirst()，队列为空时抛出NoSuchElementException
    public void push(E e) {}
    // 栈操作。入栈，即放入队首元素，等价于addFirst()，如果元素为null，则抛出NullPointerException，如果栈空间受到限制，则抛出IllegalStateException
    public E pop() {}


    // 其它实现忽略
}
```

### 2、元素不可重的Set

### 3、队列Queue

## 三、Map接口
