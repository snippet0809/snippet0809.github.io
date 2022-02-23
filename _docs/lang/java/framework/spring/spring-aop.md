---
title: Spring Aop
description: Spring Aop
---

## 一、spring-aop项目结构

spring-aop-5.1.8.REALEASE

- org
  - aopalliance
  - springframework.aop
    - aspectj
    - config
    - framework
    - interceptor
    - scope
    - support
    - target

## 二、JDK代理和CGLIB代理

- JDK代理：只能对实现了接口的类生成代理，原理是利用反射机制生成一个实现了接口的匿名类
- CGLIB代理：动态修改字节码生成子类

在Spring AOP中，如果目标类实现了接口，则Spring默认使用JDK代理，否则默认使用CGLIB代理

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(AspectJAutoProxyRegistrar.class)
public @interface EnableAspectJAutoProxy {

    /**
     * Indicate whether subclass-based (CGLIB) proxies are to be created as opposed
     * to standard Java interface-based proxies. The default is {@code false}.
     */
    boolean proxyTargetClass() default false;   // 强制使用CGLIB代理

    /**
     * Indicate that the proxy should be exposed by the AOP framework as a {@code ThreadLocal}
     * for retrieval via the {@link org.springframework.aop.framework.AopContext} class.
     * Off by default, i.e. no guarantees that {@code AopContext} access will work.
     * @since 4.3.1
     */
    boolean exposeProxy() default false;    // 允许使用 ((A)AopContext.currentProxy()).f() 处理同类方法间的“自调用”
}
```
