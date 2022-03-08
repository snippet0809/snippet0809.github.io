---
title: spring-webmvc
description: Intercepter等
---
> spring-web provides core HTTP integration, including some handy Servlet filters, Spring HTTP Invoker, infrastructure to integrate with other web frameworks and HTTP technologies e.g. Hessian, Burlap.
>
> spring-webmvc is an implementation of Spring MVC. spring-webmvc depends on on spring-web, thus including it will transitively add spring-web. You don't have to add spring-web explicitly.
>
> You should depend only on spring-web if you don't use Spring MVC but want to take advantage of other web-related technologies that Spring supports.

spring-webmvc-5.1.8.RELEASE

- org.springframework.web.servlet
  - config
    - WebMvcConfigurer接口
  - HandlerInterceptor接口

## 过滤器 & 拦截器

> request -> servlet filter -> sevrlet -> spring mvc intercepter -> controller

- 规范不同。Filter是servlet规范定义的，只能用于java web项目；Intercepter是Spring MVC定义的，即可用于Web，也可用于Application
- 深度不同。Filter只能作用于servlet前后，Intercepter可以作用于方法前后以及DispatcherServlet进行视图渲染之后（此时多用于清理资源）

注意：若通过@WebFilter和@ServletComponentScan注册Filter，则Filter内部不能注入Spring Bean，建议用@Component把Filter注册为Spring Bean交由Spring容器管理
