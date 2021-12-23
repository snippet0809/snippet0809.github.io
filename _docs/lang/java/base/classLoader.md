---
title: jdk1.0 类加载器
description: java.lang.ClassLoader
---
## 一、类生命周期

加载 -> 连接（验证->准备->解析） -> 初始化 -> 使用 -> 卸载

加载、连接、初始化三个过程被称为类加载过程

## 二、类加载器分类

1. 启动类加载器：又称根类加载器，JVM的一部分，使用C++编写，加载位于/jre/lib目录中或者被参数-Xbootclasspath所指定的目录下的核心Java类库，例如rt.jar
2. 拓展类加载器：由sun.misc.Launcher$ExtClassLoader实现，加载位于/jre/lib/ext目录中的或者java.ext.dirs系统变量所指定的目录下的拓展类库
3. 应用类加载器：由sun.misc.Launcher$AppClassLoader实现，加载用户路径(ClassPath)上所指定的类库

## 三、双亲委派机制

应用类加载器的双亲为扩展类加载器，扩展类加载器的双亲为启动类加载器。

在类加载的时候，系统会判断当前类是否已经被加载，如果被加载，就会直接返回可用的类，否则就会尝试加载。在尝试加载时，会先请求双亲处理，如果双亲处理失败，才会自己加载。**双亲委派机制防止了类重复加载。**

```java
public abstract class ClassLoader {

    // 双亲
    private final ClassLoader parent;

    // 类加载过程
    protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
        synchronized (getClassLoadingLock(name)) {
            // 一、是否已经加载过了
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                // 二、双亲是否存在，存在了让双亲加载
                try {
                    if (parent != null) {
                        c = parent.loadClass(name, false);
                    } else {
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // ClassNotFoundException thrown if class not found
                    // from the non-null parent class loader
                }
                // 三、自己加载
                if (c == null) {
                    long t1 = System.nanoTime();
                    c = findClass(name);

                    // this is the defining class loader; record the stats
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
            }
            // 四、是否进行解析
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }

    // ***其它实现省略***
}
```
