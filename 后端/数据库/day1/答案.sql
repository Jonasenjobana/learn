CREATE DATABASE IF NOT EXISTS learn_shop DEFAULT CHARACTER SET utf8mb4;
USE learn_shop;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  stock INT NOT NULL DEFAULT 0,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, price, stock, description)
VALUES
  ('机械键盘', 199.00, 12, '适合办公和游戏'),
  ('无线鼠标', 89.90, 30, '轻量化无线鼠标'),
  ('显示器支架', 159.00, 8, '可升降桌面支架'),
  ('Type-C 数据线', 29.90, 100, '1.5 米快充线'),
  ('蓝牙耳机', 299.00, 0, '主动降噪入耳式耳机');

SELECT * FROM products;

SELECT name, price, stock
FROM products;

SELECT name, price
FROM products
WHERE price > 100;

SELECT id, name, price, stock
FROM products
ORDER BY price DESC
LIMIT 3;

SELECT *
FROM products
WHERE id = 1;

UPDATE products
SET stock = 20
WHERE id = 1;

SELECT *
FROM products
WHERE id = 1;

SELECT *
FROM products
WHERE id = 5;

DELETE FROM products
WHERE id = 5;

INSERT INTO products (name, price, stock)
VALUES ('笔记本支架', 69.00, 15);

SELECT *
FROM products
WHERE name = '笔记本支架';

SELECT * FROM products;
