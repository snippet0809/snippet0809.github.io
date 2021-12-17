---
title: Mybatis-Plus框架
description: Mybatis-Plus框架
---

## 一、基本用法

[官方文档](https://mp.baomidou.com/)

[源码仓库](https://github.com/baomidou/mybatis-plus)

## 二、常见问题

### 1、数据表中jsonArray类型字段的处理方法

<https://github.com/baomidou/mybatis-plus/issues/3897>

### 2、聚合函数的使用方法

```java
@Data
public class Order {

    @TableId
    private Integer orderId;    // 订单号
    private Integer orderFee;   // 订单金额

    @TableField(select = false, value = "IFNULL(SUM(order_fee), 0)")
    private Integer totalFee;   // 总金额
}

@Repository
@Mapper
public interface OrderMapper extends BaseMapper<Order> {}

@Service
public class OrderService {

    @Resource
    private OrderMapper orderMapper;

    public int queryTotalFee() {
        Order order = orderMapper.selectOne(new LambdaQueryWrapper<Order>()
            .select(Order::getTotalFee));
        return order.getTotalFee();
    }
}
```
