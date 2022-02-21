---
title: spring-beans
description: Spring Bean的定义、解析和创建
---

## 一、spring-beans项目结构

- org.springframework.beans
  - annotation
  - factory
    - BeanFactory接口（创建）
    - config
      - BeanDefinition接口（定义）
  - propertyeditors
  - support
    - BeanDefinitionReader接口（解析）

## 二、Spring Bean的定义、解析和创建

### 1、Bean的定义、解析

Spring会将配置文件中的Bean描述解析为BeanDefinition对象

### 2、Bean的创建

Spring Bean的创建是典型的工厂模式，顶级接口为BeanFactory
