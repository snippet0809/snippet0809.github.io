---
title: Spring Web
description: 参数绑定、异常处理、浏览器跨域配置等
---

spring-web-5.1.8.RELEASE

- org.springframework
  - http
  - remoting
  - web
    - bind
      - annotation
        - @RestController注解
        - @RestControllerAdvice注解
        - @RequestMapping注解
        - @ResponseStatus注解
        - @ExceptionHandler注解
    - client
      - RestTemplate类
    - context
      - request
        - RequestContextHolder抽象类
    - cors
      - CorsConfigurationSource接口
      - UrlBasedCorsConfigurationSource类
    - filter
      - CorsFilter类

## 一、全局异常处理

### 方法一：使用Spring Web提供的@RestControllerAdvice和@ExceptionHandler

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * 401，未登录
     */
    @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(value = LoginTimeoutException.class)
    public SimplestResponse exceptionHandler(LoginTimeoutException e) {
        return new SimplestResponse().setErrmsg("登录已过期，请重新登录");
    }

    /**
     * 400，服务器无法处理前端的请求，一般是前端传参有问题之类的
     */
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = ClientException.class)
    public SimplestResponse exceptionHandler(ClientException e) {
        return new SimplestResponse().setErrmsg(e.getMessage());
    }

    /**
     * 500，服务器内部发生异常
     */
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(value = Exception.class)
    public SimplestResponse exceptionHandler(Exception e) {
        log.error("500", e);
        return new SimplestResponse().setErrmsg("服务器忙，请稍后重试");
    }
}
```

- 优势：代码优雅
- 劣势：只能处理进入Controller后发生的异常，无法处理404以及Intercepter中的异常

### 方法二：使用Spring Boot提供的ErrorController接口

```java
@RestController
@RequestMapping(value = "base")
@Slf4j
public class BaseController implements ErrorController {

    @RequestMapping(value = "error")
    public SimplestResponse errorHandler(HttpServletResponse response, Exception e) {
        if (e instanceof LoginTimeoutException) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return new SimplestResponse().setErrmsg("登录已过期，请重新登录");
        } else if (e instanceof ClientException) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            return new SimplestResponse().setErrmsg(e.getMessage());
        }
        log.error("500", e);
        response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        return new SimplestResponse().setErrmsg("服务器忙，请稍后重试");
    }

    @Override
    public String getErrorPath() {
        return "/base/error";
    }
}
```

- 优势：真正的全局处理
- 劣势：代码不优雅，通常需要单独写一个Controller

## 二、跨域配置

### 方法一：使用Spring Web提供的CorsFilter

```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.setAllowCredentials(true);
        source.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(source);
    }
}
```

- 优势：全局作用。从类名就知道，这是一个spring-web提供的一个servlet过滤器，优先级高
- 劣势：代码不优雅，通常需要单独创建一个类

### 方法二：重写spring-webmvc提供的WebMvcConfigurer类的addCorsMappings(CorsRegistry registry)方法

```java
@Component
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("*").allowCredentials(true).allowedMethods("*");
    }
}
```

- 优势：代码优雅。通常WebMvcConfigurer接口的多个方法都会被重写，放在一个类看着很舒服，代码高可读、易维护
- 劣势：作用于Mapping层面，即只对进入Controller的请求起作用，在Intercepter的preHandle()中返回false时就无能为力了

## 二、RestTemplate

getForObject()和getForEntity()的区别：前者只返回响应体，后者返回整个响应包（响应头、响应体等）
