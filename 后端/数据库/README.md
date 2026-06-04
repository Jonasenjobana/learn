# MySQL 学习指南

这套内容用于从零学习 MySQL，并逐步过渡到后端开发里最常用的数据库能力。  
默认读者已经有一定 JavaScript / 后端基础，所以重点放在“能建表、能写查询、能理解关系、能处理事务和索引”。

## 当前学习入口

- [Day1：数据库基础、建表与 CRUD](./day1/)
- [Day2：表关系、JOIN 与约束](./day2/)
- [Day3：事务、索引与查询优化](./day3/)

## 阶段总结

| 阶段 | 主题 | 学完后应掌握 | 入口 |
| --- | --- | --- | --- |
| Day1 | 数据库基础、建表与 CRUD | 理解数据库/表/字段，能创建数据库和表，能完成增删改查 | [day1](./day1/) |
| Day2 | 表关系、JOIN 与约束 | 理解一对多、多对多，能写常见 JOIN，能使用主键、外键、唯一约束 | [day2](./day2/) |
| Day3 | 事务、索引与查询优化 | 理解事务 ACID，能创建索引，能用 `EXPLAIN` 初步分析 SQL | [day3](./day3/) |

### Day1 总结：数据库基础、建表与 CRUD

Day1 的目标是先把 MySQL 的基本操作跑起来，不追求复杂业务模型，重点是理解表结构和最常用 SQL。

重点内容：

- 数据库、数据表、字段、行的关系。
- 常见字段类型：`INT`、`VARCHAR`、`TEXT`、`DECIMAL`、`DATETIME`。
- 创建数据库和数据表。
- `INSERT`、`SELECT`、`UPDATE`、`DELETE`。
- `WHERE`、`ORDER BY`、`LIMIT`。

适合目标：

- 能创建一个简单用户表。
- 能插入、查询、更新、删除数据。
- 能解释为什么删除和更新时必须小心 `WHERE`。

### Day2 总结：表关系、JOIN 与约束

Day2 的目标是从单表进入多表，开始理解真实后端系统为什么需要拆表，以及表之间怎么关联。

重点内容：

- 主键和外键。
- 一对多关系，例如用户和订单。
- 多对多关系，例如学生和课程。
- `INNER JOIN`、`LEFT JOIN`。
- `UNIQUE`、`NOT NULL`、`DEFAULT`。
- 基础聚合：`COUNT`、`SUM`、`AVG`、`GROUP BY`。

适合目标：

- 能设计用户、订单、订单明细三张表。
- 能查询“某个用户的所有订单”。
- 能写分组统计 SQL。

### Day3 总结：事务、索引与查询优化

Day3 的目标是理解数据库不仅要能查，还要能保证数据可靠，并在数据变多时保持查询效率。

重点内容：

- 事务的基本使用：`START TRANSACTION`、`COMMIT`、`ROLLBACK`。
- ACID：原子性、一致性、隔离性、持久性。
- 常见索引：普通索引、唯一索引、联合索引。
- `EXPLAIN` 查看查询执行计划。
- 慢查询常见原因。
- 索引不是越多越好。

适合目标：

- 能用事务模拟转账。
- 能为常见查询字段建立索引。
- 能用 `EXPLAIN` 初步判断 SQL 是否走索引。

## 学习目标

学完 Day1-Day3 后，应能够：

- 看懂常见 MySQL 表结构。
- 写出基础 CRUD SQL。
- 理解主键、外键、唯一约束和默认值。
- 写出常见多表查询。
- 理解事务在后端业务中的作用。
- 为接口开发设计简单数据库表。
- 初步使用索引和 `EXPLAIN` 排查慢查询。

## 推荐学习方式

1. 每天先看对应 `README.md`。
2. 在本地 MySQL 客户端中执行 `示例.sql`。
3. 自己完成 `练习题.md`。
4. 修改表字段和数据，再观察查询结果。
5. 学完后尝试把 SQL 和 Node/NestJS 后端接口连接起来。

## 基础命令

下面命令以 MySQL 命令行客户端为例：

```bash
mysql -u root -p
```

进入后可以执行：

```sql
SHOW DATABASES;
CREATE DATABASE learn_mysql DEFAULT CHARACTER SET utf8mb4;
USE learn_mysql;
SHOW TABLES;
```

## 后续进阶方向

学完 Day1-Day3 后，可以继续补：

- MySQL 数据库设计范式。
- 更复杂的 SQL 查询。
- 分页查询和游标分页。
- 视图、存储过程、触发器。
- MySQL 锁机制和隔离级别。
- 慢查询日志和性能优化。
- MySQL 与 Node.js / NestJS / Prisma / TypeORM 集成。
- Redis 缓存与 MySQL 的配合。
