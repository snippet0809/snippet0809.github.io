---
title: Spring Web
description: Spring Web
---

## 全局异常处理

```java
@RestController
@RequestMapping(value="base")
@RestControllerAdvice
public class BaseController implements ErrorController {

    // *** 以下是Spring Boot处理异常的方式（实现ErrorController接口） ***

    @RequestMapping(value = "error")
    public String errorHandler(HttpServletRequest request, HttpServletResponse response, Exception e) {
        // TODO 错误处理逻辑省略
        return null;
    }

    @Override
    public String getErrorPath() {
        return "/base/error";
    }

    // *** 以下是Spring MVC处理异常的方式（@RestControllerAdvice & @ExceptionHandler配合使用） ***
    // 注意：这种方式只能拦截Controller中发生的异常，未进入Controller就发生异常的情况（例如404）是拦截不到的
    
    @ExceptionHandler(value = Exception.class)
    public String handleException(HttpServletRequest request, HttpServletResponse response, Exception e) {
        // TODO 错误处理逻辑
        return null;
    }
}
```
