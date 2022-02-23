---
title: spring-context
description: cache等
---

## 一、spring-context项目结构

- org.springframework
  - cache
  - context
    - ApplicationContext接口
  - stereotype
    - @Component
    - @Controller
    - @Service
    - @Repository

## 二、Spring缓存

### 1、本地缓存

```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-cache</artifactId>
    </dependency>
    <dependency>
        <groupId>com.github.ben-manes.caffeine</groupId>
        <artifactId>caffeine</artifactId>
    </dependency>
```

```java
@Configuration
public class CacheConfig {

    /**
     * Spring会使用ConcurrentMapCacheManager来作为默认的CacheManager，但它不支持缓存过期
     */
    @Bean
    public CacheManager cacheManager() {
       CaffeineCacheManager caffeineCacheManager = new CaffeineCacheManager();
       caffeineCacheManager.setCaffeine(Caffeine.newBuilder().expireAfterWrite(10, TimeUnit.MINUTES));
       return new CaffeineCacheManager();
   }
}
```

如果项目引入了Spring-boot-starter-data-redis包，即使没有Redis相关配置，spring也会优先创建RedisCacheManager(RedisConnectionFactory("localhost", 6379))来作为默认的CacheManager

### 2、Redis缓存

```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
```

```java
@Configuration
public class RedisConfig {

    private static final String REDIS_HOST = "";    
    private static final int REDIS_PORT = 6379;
    private static final String REDIS_PASSWORD = "";

    /**
     * Redis连接配置（个人讨厌配置文件方式）
     * <p>
     * 注意：虽然此处Redis的作用仅仅是为CacheManager打工，但下面的cacheManager方法不可直接调用此方法，
     * 而应该把RedisConnectionFactory以Spring Bean的形式注入，除非主动调用LettuceConnectionFactory::afterPropertiesSet()，
     * 没错，就是重写自Spring-Beans项目InitializingBean接口的afterPropertiesSet()。
     * 说到这里，dddd
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        // 默认端口6379，默认没有密码
        RedisStandaloneConfiguration redisConfiguration = new RedisStandaloneConfiguration(REDIS_HOST, REDIS_PORT);
        redisConfiguration.setPassword(REDIS_PASSWORD);
        return new LettuceConnectionFactory(redisConfiguration);
    }

    /**
     * redis缓存配置
     */
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration cacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(5));
        return RedisCacheManager.builder(factory).cacheDefaults(cacheConfiguration).build();
    }
}
```
