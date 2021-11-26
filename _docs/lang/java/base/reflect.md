---
title: 反射
description: java.lang.Class & java.lang.reflect包
---

## 一、简介

什么是反射：运行中获取类信息

反射的用途：最常见的用途是用来开发框架

## 二、java.lang.Class类

### 1、@CallerSensitive注解

Reflection.getCallerClass()要求调用者必须有@CallerSensitive注解，且是由启动类加载器或拓展类加载器加载的类才可以调用，为的是解决反射机制所带来的安全隐患。

### 2、Class类常用的Reflection API

```java
public final class Class<T> implements java.io.Serializable, GenericDeclaration, Type, AnnotatedElement {

    // 获取类的所有public属性
    @CallerSensitive
    public Field[] getFields() throws SecurityException {
        checkMemberAccess(Member.PUBLIC, Reflection.getCallerClass(), true);
        return copyFields(privateGetPublicFields(null));
    }

    // 获取类的所有属性
    @CallerSensitive
    public Field[] getDeclaredFields() throws SecurityException {
        checkMemberAccess(Member.DECLARED, Reflection.getCallerClass(), true);
        return copyFields(privateGetDeclaredFields(false));
    }

    // 获取类的指定属性
    @CallerSensitive
    public Field getDeclaredField(String name)
        throws NoSuchFieldException, SecurityException {
        checkMemberAccess(Member.DECLARED, Reflection.getCallerClass(), true);
        Field field = searchFields(privateGetDeclaredFields(false), name);
        if (field == null) {
            throw new NoSuchFieldException(name);
        }
        return field;
    }

    // ***类似的方法还有以下这些：***
    //
    // - Method[] getMethods()
    // - Method[] getDeclaredFeilds()
    // - Method getMethod(String name, Class<?>... parameterTypes)

    // - Constructor<?>[] getConstructors()
    // - Constructor<?>[] getDeclaredConstructors()
    // - Constructor<T> getConstructor(Class<?>... parameterTypes)
    // ***

    // ***其它实现省略***
}
```
