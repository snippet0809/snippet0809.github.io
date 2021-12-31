---
title: 并发编程
description: 并发编程
---

>Do not communicate by sharing memory; instead, share memory by communicating.
>
>不要通过共享内存来通信，而应通过通信来共享内存。

## 一、互斥锁

```go
func main() {
    var mu sync.Mutex

    mu.Lock()
    go func(){
        fmt.Println("你好, 世界")
        mu.Unlock()
    }()

    mu.Lock()
}
```

## 二、通道

```go
// 单线程版本的Hello World
func demo1() {
    done := make(chan int)

    go func(){
        fmt.Println("你好, 世界")
        done <- 1
    }()

    <-done
}

// 多线程版本的Hello World
func demo2() {
    done := make(chan int, 10) // 带 10 个缓存

    // 开N个后台打印线程
    for i := 0; i < cap(done); i++ {
        go func(){
            fmt.Println("你好, 世界")
            done <- 1
        }()
    }

    // 等待N个后台线程完成
    for i := 0; i < cap(done); i++ {
        <-done
    }
}

// 使用WaitGroup简化的多线程Hello World
func demo3() {
    var wg sync.WaitGroup

    // 开N个后台打印线程
    for i := 0; i < 10; i++ {
        wg.Add(1)

        go func() {
            fmt.Println("你好, 世界")
            wg.Done()
        }()
    }

    // 等待N个后台线程完成
    wg.Wait()
}
```
