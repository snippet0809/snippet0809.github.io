# Https配置

## http和https同时生效

### 1、https配置，使用代码配置比较麻烦

```yml
server:
  port: 443
  ssl:
    key-store: classpath:xxx/xxx.xxx.com.pfx
    key-store-password: xxx
```

### 2、http配置

```java

@Configuration
public class TomcatConfig {

    @Bean
    public ServletWebServerFactory servletContainer() {
        Connector connector = new Connector();
        connector.setPort(8100);
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
        tomcat.addAdditionalTomcatConnectors(connector);
        return tomcat;
    }
}

```
