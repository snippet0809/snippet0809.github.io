---
title: spring-webmvc
description: spring-webmvc
---

spring-web provides core HTTP integration, including some handy Servlet filters, Spring HTTP Invoker, infrastructure to integrate with other web frameworks and HTTP technologies e.g. Hessian, Burlap.

spring-webmvc is an implementation of Spring MVC. spring-webmvc depends on on spring-web, thus including it will transitively add spring-web. You don't have to add spring-webexplicitly.

You should depend only on spring-web if you don't use Spring MVC but want to take advantage of other web-related technologies that Spring supports.

## 一、项目结构

spring-webmvc-5.1.8.RELEASE

- org.springframework.web.servlet
  - config
    - WebMvcConfigurer接口
