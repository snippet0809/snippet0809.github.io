---
title: spring-context
description: ApplicationContext接口、cache等
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

Spring默认的CacheManager为ConcurrentMapCacheManager，但它不支持缓存自动过期。

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

    @Bean
    public CacheManager cacheManager() {
       CaffeineCacheManager caffeineCacheManager = new CaffeineCacheManager();
       caffeineCacheManager.setCaffeine(Caffeine.newBuilder().expireAfterWrite(10, TimeUnit.MINUTES));
       return new CaffeineCacheManager();
   }
}
```

### 2、Redis缓存

```xml
    <!-- 如果项目引入了Spring-boot-starter-data-redis且未显式指定CacheManager，
        spring会自动创建RedisCacheManager(RedisConnectionFactory("localhost", 6379))来作为默认的CacheManager -->
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
                    <!-- spring-boot:repackage 打包成可执行的jar，没有这个需要显式指定启动类 -->
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
     * Redis连接配置（个人讨厌配置文件方式）
     * <p>
     * 注意：虽然此处Redis的作用仅仅是为CacheManager打工，但下面的cacheManager方法不可直接调用此方法，
     * 而应该把RedisConnectionFactory以Spring Bean的形式注入，除非主动调用LettuceConnectionFactory::afterPropertiesSet()，
     * 没错，就是重写自Spring-Beans项目InitializingBean接口的afterPropertiesSet()。
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration redisConfiguration = new RedisStandaloneConfiguration(REDIS_HOST, REDIS_PORT);
        redisConfiguration.setPassword(REDIS_PASSWORD);
        return new LettuceConnectionFactory(redisConfiguration);
    }

    /**
     * redis缓存配置
     */
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory, @Autowired(required = false) BuildProperties buildProperties) {
        String version = buildProperties == null ? "unknown" : buildProperties.getVersion();
        RedisCacheConfiguration cacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
                .computePrefixWith(cacheName -> version + "-" + cacheName + "::")
                .entryTtl(Duration.ofMinutes(15));
        return RedisCacheManager.builder(factory).cacheDefaults(cacheConfiguration).build();
    }
}
```
