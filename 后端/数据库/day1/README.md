# Day1：数据库基础、建表与 CRUD

这一阶段用于把 MySQL 最基本的操作跑起来。  
如果你已经会后端开发，Day1 不需要停太久，重点是熟悉 SQL 的写法和表结构的设计方式。

## 学习目标

学完 Day1 后，你应该能：

- 理解数据库、表、字段、行的关系。
- 创建数据库和数据表。
- 使用常见字段类型。
- 写出 `INSERT`、`SELECT`、`UPDATE`、`DELETE`。
- 使用 `WHERE`、`ORDER BY`、`LIMIT` 做基础筛选。
- 明白更新和删除数据时为什么必须谨慎。

## 文件说明

- [练习题](./练习题.md)
- [练习答案](./答案.md)
- [答案 SQL](./答案.sql)
- [示例 SQL](./示例.sql)

## 推荐学习方式

1. 先看本 README 的重点提醒。
2. 在 MySQL 客户端中执行 [示例 SQL](./示例.sql)。
3. 观察每条 SQL 的结果。
4. 自己完成 [练习题](./练习题.md)。
5. 修改示例数据，再练习查询。

## Day1 重点提醒

### 1. 数据库、表、字段、行

可以先这样理解：

- 数据库：一个项目的数据空间。
- 表：一种数据的集合，例如用户表、订单表。
- 字段：表里的列，例如 `name`、`email`。
- 行：一条具体数据，例如一个用户。

### 2. 常见字段类型

| 类型 | 作用 | 示例 |
| --- | --- | --- |
| `INT` | 整数 | 年龄、数量、ID |
| `VARCHAR(n)` | 短字符串 | 用户名、邮箱 |
| `TEXT` | 长文本 | 文章内容、备注 |
| `DECIMAL(m, d)` | 精确小数 | 价格、金额 |
| `DATETIME` | 日期时间 | 创建时间、更新时间 |

### 3. 主键通常用 `id`

```sql
id INT PRIMARY KEY AUTO_INCREMENT
```

含义：

- `PRIMARY KEY`：主键，唯一标识一行数据。
- `AUTO_INCREMENT`：自动递增，不需要手动填写。

### 4. CRUD 是最基础的数据库能力

CRUD 分别是：

- Create：新增，`INSERT`
- Read：读取，`SELECT`
- Update：更新，`UPDATE`
- Delete：删除，`DELETE`

### 5. `UPDATE` 和 `DELETE` 要小心

危险写法：

```sql
DELETE FROM users;
```

这会删除整张表的数据。

更安全的写法：

```sql
DELETE FROM users WHERE id = 1;
```

更新数据同理，必须先确认 `WHERE` 条件是否正确。

## 本日重点 SQL

```sql
CREATE DATABASE learn_mysql DEFAULT CHARACTER SET utf8mb4;
USE learn_mysql;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  age INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, age)
VALUES ('小明', 'xiaoming@example.com', 18);

SELECT * FROM users;

UPDATE users
SET age = 19
WHERE id = 1;

DELETE FROM users
WHERE id = 1;
```

## 建议练习

- 创建一个 `products` 商品表。
- 插入 5 条商品数据。
- 查询价格大于 100 的商品。
- 按价格从高到低排序。
- 更新某个商品的库存。
- 删除一条指定商品。

## 入口命令

```bash
mysql -u root -p
```

进入 MySQL 后执行：

```sql
SOURCE 后端/数据库/day1/示例.sql;
```

如果路径执行失败，可以直接打开 `示例.sql`，复制 SQL 到客户端执行。
