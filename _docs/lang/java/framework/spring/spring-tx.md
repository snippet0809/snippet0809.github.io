---
title: spring-tx
description: Spring Transaction
---

## 一、项目结构

spring-tx-5.1.8.RELEASE

- org.springframework
  - dao
  - jca
  - transaction
    - annotation
      - @EnableTransactionManagement
      - @Transactional
    - PlatformTransactionManager接口

@SpringBootApplication注解会自动配置事务，所以Spring Boot启动类不加@EnableTransactionManagement也可以，但@EnableCaching是一定要加的

## 二、PlatformTransactionManager接口

Spring事务管理的顶层接口，具体实现交给了各个框架，这样开发者即使切换持久层框架，也不用改代码。org.springframework.jdbc.datasource.DataSourceTransactionManager就是Spring jdbc提供的事务管理实现类，mybaits-spring也使用它作为默认的事务管理器。

```java
public interface PlatformTransactionManager {

    TransactionStatus getTransaction(@Nullable TransactionDefinition definition) throws TransactionException;

    void commit(TransactionStatus status) throws TransactionException;

    void rollback(TransactionStatus status) throws TransactionException;
}
```

## 三、Spring的事务隔离级别和事务传播机制

### 1、四个事务隔离级别

脏读、不可重复读、幻读：

- 脏读：事务A更新一条数据 -> 事务B去读这条数据 -> 事务A回滚（事务B读到的数据是错的）
- 不可重复读：事务A查询一条数据 -> 事务B更新这条数据并提交 -> 事务A使用相同SQL再次查询（事务A两次读到的结果不一样，也就是说数据不能重复读）
- 幻读：事务A查询一批数据 -> 事务B新增几条数据后提交 -> 事务A用相同SQL再次查询，发现数据条数竟然增加了（事务A幻读）

```java
public enum Isolation {

    // 默认值。使用数据库的隔离级别，mysql默认的隔离级别是REPEATABLE_READ
    DEFAULT(TransactionDefinition.ISOLATION_DEFAULT),

    // 允许事务未提交时读（我正在写的这个数据你不能写，但你可以任意读取）。可能出现脏读、不可重复读和幻读
    READ_UNCOMMITTED(TransactionDefinition.ISOLATION_READ_UNCOMMITTED),

    // 确保事务提交后再读（我正在写的这个数据你不能读写，可以去读写其它的）。可避免脏读，但可能会出现不可重复读和幻读
    READ_COMMITTED(TransactionDefinition.ISOLATION_READ_COMMITTED),

    // 可重读，确保事务可以多次从一个字段中读取相同的值（我正在读、写的数据，你不能读，可以去读写其它的）。可以避免脏读和不可重复读，仍会出现幻读问题
    REPEATABLE_READ(TransactionDefinition.ISOLATION_REPEATABLE_READ),

    // 序列化，确保事务可以从一个表中读取相同的行（我正在读、写的数据，你不能读，只能去读其它的，并且此时你不能有任何写操作）。可避免所有并发问题，但性能非常低
    SERIALIZABLE(TransactionDefinition.ISOLATION_SERIALIZABLE);
}
```

### 2、七种事务传播机制

```java
public enum Propagation {
 
    // Spring默认事务传播机制。有事务就加入，没有新建一个
    REQUIRED(TransactionDefinition.PROPAGATION_REQUIRED),

    // 有事务就加入，没有就算了，直接以非事务的方式执行 
    SUPPORTS(TransactionDefinition.PROPAGATION_SUPPORTS),

    // 有事务就加入，没有抛异常
    MANDATORY(TransactionDefinition.PROPAGATION_MANDATORY),

    // 有事务就挂起，自己新建一个事务
    REQUIRES_NEW(TransactionDefinition.PROPAGATION_REQUIRES_NEW),

    // 有事务就挂起，自己以非事务的方式执行
    NOT_SUPPORTED(TransactionDefinition.PROPAGATION_NOT_SUPPORTED),

    // 有事务抛异常
    NEVER(TransactionDefinition.PROPAGATION_NEVER),

    // 有事务就加入（和REQUIRED不同的是加入后可以独立于当前事务单独地提交或回滚），没有新建一个。注意有的事务管理器可能不支持
    NESTED(TransactionDefinition.PROPAGATION_NESTED);
}
```
