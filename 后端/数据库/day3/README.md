# Day3：事务、索引与查询优化

这一阶段开始关注数据库的可靠性和性能。  
真实后端系统里，SQL 不只是“能查出来”就够了，还要保证数据一致，并在数据量变大后仍然能查得快。

## 学习目标

学完 Day3 后，你应该能：

- 理解事务的作用。
- 使用 `START TRANSACTION`、`COMMIT`、`ROLLBACK`。
- 用转账案例理解 ACID。
- 创建普通索引、唯一索引、联合索引。
- 使用 `EXPLAIN` 初步分析 SQL。
- 理解索引不是越多越好。

## 文件说明

- [练习题](./练习题.md)
- [示例 SQL](./示例.sql)

## 推荐学习方式

1. 先看事务示例，理解为什么需要回滚。
2. 执行 [示例 SQL](./示例.sql)。
3. 观察事务前后账户余额变化。
4. 使用 `EXPLAIN` 查看查询计划。
5. 做 [练习题](./练习题.md)，重点练索引和事务。

## Day3 重点提醒

### 1. 事务解决“要么都成功，要么都失败”

转账是最经典的事务例子：

- A 扣 100。
- B 加 100。

这两步必须一起成功。  
如果 A 扣钱成功，但 B 加钱失败，数据就错了。

### 2. 基础事务写法

```sql
START TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
```

如果中途发现错误：

```sql
ROLLBACK;
```

### 3. ACID

| 特性 | 含义 |
| --- | --- |
| Atomicity | 原子性，要么都成功，要么都失败 |
| Consistency | 一致性，事务前后数据规则不能被破坏 |
| Isolation | 隔离性，多个事务之间互不干扰到不合理程度 |
| Durability | 持久性，提交后数据要保存下来 |

### 4. 索引用来加速查询

常见索引：

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX uk_users_email ON users(email);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

索引适合：

- 经常用于 `WHERE` 的字段。
- 经常用于 `JOIN` 的字段。
- 经常用于排序或分组的字段。

### 5. 索引不是越多越好

索引会提升查询速度，但也有代价：

- 占用额外空间。
- 插入、更新、删除时需要维护索引。
- 不合理索引可能完全用不上。

### 6. 用 `EXPLAIN` 初步看查询

```sql
EXPLAIN SELECT * FROM users WHERE email = 'xiaoming@example.com';
```

重点先看：

- `type`：访问类型，通常越接近 `const`、`ref` 越好。
- `key`：实际使用的索引。
- `rows`：预估扫描行数。

## 本日重点 SQL

```sql
START TRANSACTION;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1 AND balance >= 100;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

COMMIT;
```

```sql
CREATE INDEX idx_logs_user_id ON access_logs(user_id);

EXPLAIN
SELECT *
FROM access_logs
WHERE user_id = 1;
```

## 建议练习

- 用事务模拟转账。
- 故意执行 `ROLLBACK`，观察余额是否恢复。
- 给查询字段创建索引。
- 使用 `EXPLAIN` 对比建索引前后的查询计划。
- 创建联合索引，并测试字段顺序对查询的影响。

## 入口命令

```bash
mysql -u root -p
```

进入 MySQL 后执行：

```sql
SOURCE 后端/数据库/day3/示例.sql;
```

如果路径执行失败，可以直接打开 `示例.sql`，复制 SQL 到客户端执行。
