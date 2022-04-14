---
title: spring-context
description: cache等
---

spring-context--5.1.8.RELEASE

- org.springframework
  - cache
  - context
    - ApplicationContext接口
  - stereotype
    - @Component
    - @Controller
    - @Service
    - @Repository

## 一、Spring缓存

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

如果项目引入了Spring-boot-starter-data-redis且未创建CacheManager类型的Spring Bean，spring会创建RedisCacheManager(RedisConnectionFactory("localhost", 6379))来作为默认的CacheManager

### 2、Redis缓存

```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>

    <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
        <executions>
            <execution>
                <goals>
                    <!-- spring-boot:build-info 生成jar包时会记录构建信息，Spring容器启动后会有一个BuildProperties类型的Bean -->
                    <goal>build-info</goal>
                    <!-- spring-boot:repackage 创建自动可执行的jar包 -->
                    <goal>repackage</goal>
                </goals>
            </execution>
        </executions>
    </plugin>
```

```java
@Configuration
public class RedisConfig {

    private static final String REDIS_HOST = "";    
    private static final int REDIS_PORT = 6379;
    private static final String REDIS_PASSWORD = "";

    /**
     * 本地缓存配置
     * <p>
     * 本地启动使用ConcurrentMapCacheManager，生产环境使用RedisCacheManager。
     * 虽然Spring就是用ConcurrentMapCacheManager作为默认的CacheManager，但此时必须显示配置，
     * 因为项目引入了Spring-boot-starter-data-redis包，即使没有Redis相关配置，
     * Spring也会优先创建RedisCacheManager(RedisConnectionFactory("localhost", 6379))作为默认的CacheManager
     */
    @Bean
    @Profile("default")
    public CacheManager concurrentMapCacheManager(RedisConnectionFactory factory) {
        return new ConcurrentMapCacheManager();
    }

    /**
     * Redis连接配置（个人讨厌配置文件方式）
     * <p>
     * 注意：虽然此处Redis的作用仅仅是为CacheManager打工，但下面的cacheManager方法不可直接调用此方法，
     * 而应该把RedisConnectionFactory以Spring Bean的形式注入，除非主动调用LettuceConnectionFactory::afterPropertiesSet()，
     * 没错，就是重写自Spring-Beans项目InitializingBean接口的afterPropertiesSet()。
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
    @Profile("prod")
    public CacheManager cacheManager(RedisConnectionFactory factory, @Autowired(required = false) BuildProperties buildProperties) {
        // 虽然生产环境一定是通过jar包启动的，但是个人强迫症晚期，这里还是加了判空
        String version = buildProperties == null ? "unknown" : buildProperties.getVersion();
        RedisCacheConfiguration cacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
                .computePrefixWith(cacheName -> version + "-" + cacheName + "::")
                .entryTtl(Duration.ofMinutes(15));
        return RedisCacheManager.builder(factory).cacheDefaults(cacheConfiguration).build();
    }
}
```
