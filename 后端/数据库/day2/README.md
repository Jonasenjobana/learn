# Day2：表关系、JOIN 与约束

这一阶段从单表进入多表。  
真实后端项目很少只有一张表，用户、订单、商品、角色、权限之间都需要通过关系组织起来。

## 学习目标

学完 Day2 后，你应该能：

- 理解一对多和多对多关系。
- 使用主键和外键表达表关系。
- 写出 `INNER JOIN` 和 `LEFT JOIN`。
- 使用 `UNIQUE`、`NOT NULL`、`DEFAULT`。
- 使用 `COUNT`、`SUM`、`AVG`、`GROUP BY` 做基础统计。
- 看懂简单业务表设计。

## 文件说明

- [练习题](./练习题.md)
- [示例 SQL](./示例.sql)

## 推荐学习方式

1. 先看表关系说明。
2. 执行 [示例 SQL](./示例.sql)，创建用户、订单、订单明细表。
3. 观察每个 JOIN 查询的结果。
4. 自己完成 [练习题](./练习题.md)。
5. 尝试画出表关系图。

## Day2 重点提醒

### 1. 一对多关系

一个用户可以有多个订单，一个订单只属于一个用户。  
这就是一对多。

```text
users 1 ---- N orders
```

通常在“多”的一方放外键：

```sql
user_id INT NOT NULL
```

### 2. 多对多关系

一个学生可以选择多门课程，一门课程也可以被多个学生选择。  
这就是多对多。

多对多通常需要一张中间表：

```text
students N ---- N courses

student_courses:
- student_id
- course_id
```

### 3. `INNER JOIN` 和 `LEFT JOIN`

`INNER JOIN`：只返回两边都匹配的数据。

```sql
SELECT users.name, orders.order_no
FROM users
INNER JOIN orders ON orders.user_id = users.id;
```

`LEFT JOIN`：左表数据都保留，右表没有匹配时显示 `NULL`。

```sql
SELECT users.name, orders.order_no
FROM users
LEFT JOIN orders ON orders.user_id = users.id;
```

### 4. 约束让数据更可靠

常见约束：

- `PRIMARY KEY`：主键。
- `FOREIGN KEY`：外键。
- `NOT NULL`：不能为空。
- `UNIQUE`：唯一。
- `DEFAULT`：默认值。

### 5. 分组统计很常用

```sql
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id;
```

后端接口里常见的“统计每个用户订单数”“统计商品销量”都需要分组。

## 本日重点 SQL

```sql
SELECT u.name, o.order_no, o.total_amount
FROM users AS u
INNER JOIN orders AS o ON o.user_id = u.id;

SELECT u.name, COUNT(o.id) AS order_count
FROM users AS u
LEFT JOIN orders AS o ON o.user_id = u.id
GROUP BY u.id, u.name;
```

## 建议练习

- 设计用户表和文章表。
- 查询每个用户发布了多少篇文章。
- 查询没有发布文章的用户。
- 设计学生、课程、中间表。
- 查询某个学生选择了哪些课程。

## 入口命令

```bash
mysql -u root -p
```

进入 MySQL 后执行：

```sql
SOURCE 后端/数据库/day2/示例.sql;
```

如果路径执行失败，可以直接打开 `示例.sql`，复制 SQL 到客户端执行。
