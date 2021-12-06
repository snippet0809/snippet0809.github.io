---
title: GitHub Packages
description: 使用GitHub Packages托管软件包
---
 
[GitHub Packages官方中文文档](https://docs.github.com/cn/packages)

目前（2021年）最让人火大的地方：**即使是安装GitHub Packages上的public包，也必须要有TOKEN**

## Maven + GitHub Packages

### 第一步：认证

在~/.m2/settings.xml添加如下配置

```xml
<settings>
    <mirrors>
        <mirror>
            <id>aliyun</id>
            <url>https://maven.aliyun.com/repository/public</url>
            <!-- 注意：不要用*，如果配置了私库，*也会拦截，central只会拦截中央仓库 -->
            <mirrorOf>central</mirrorOf>
        </mirror>
    </mirrors>

    <activeProfiles>
        <activeProfile>github</activeProfile>
    </activeProfiles>

    <profiles>
        <profile>
            <id>github</id>
            <!-- 1、settting.xml中配置的repository比pom.xml中配置的repository优先级高 -->
            <!-- 2、GitHub Packages的仓库配置到pom.xml中也行，
                但repository的id一定要和setting.xml中<server></server>下的id保持一致 -->
            <repositories>
                <repository>
                    <id>central</id>
                    <url>https://repo1.maven.org/maven2</url>
                </repository>
                <repository>
                    <id>github</id>
                    <!-- 1、经过测试写成https://maven.pkg.github.com/OWNER/*也是可以的，
                        这样如果需要同时引入同一OWNER的多个仓库时就不用重复写多个对应的<server></server>了 -->
                    <!-- 2、如果需要同时引入不同OWNER的仓库时，不要想着写成/*或/*/*或/**，经过实测是不行的，  
                        老老实实定义多个<server></server>吧，即使这些<server></server>除了id都一模一样
                        (如果public库不需要token，哪还有这么多事) -->
                    <url>https://maven.pkg.github.com/OWNER/REPOSITORY</url>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
            </repositories>
        </profile>
    </profiles>

    <servers>
        <server>
            <!-- 这个id要和repository的id一致 -->
            <id>github</id>
            <username>USERNAME</username>
            <password>TOKEN</password>
        </server>
    </servers>
</settings>
```

### 第二步：使用

#### 1、install

在pom.xml中声明dependency执行mvn install即可

#### 2、deploy

在pom.xml中加入如下配置后执行mvn deploy即可

```xml
<project>
    <distributionManagement>
        <repository>
            <!-- 这个id要和setting.xml中<server></server>下的id一致 -->
            <id>github</id>
            <name>GitHub OWNER Apache Maven Packages</name>
            <url>https://maven.pkg.github.com/OWNER/REPOSITORY</url>
        </repository>
    </distributionManagement>
</project>
```
