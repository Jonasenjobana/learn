CREATE DATABASE IF NOT EXISTS learn_mysql DEFAULT CHARACTER SET utf8mb4;
USE learn_mysql;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_no VARCHAR(50) NOT NULL UNIQUE,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_order_items_order_id FOREIGN KEY (order_id) REFERENCES orders(id)
);

INSERT INTO users (name, email)
VALUES
  ('小明', 'xiaoming@example.com'),
  ('小红', 'xiaohong@example.com'),
  ('小刚', 'xiaogang@example.com');

INSERT INTO orders (user_id, order_no, total_amount)
VALUES
  (1, 'NO202606040001', 199.00),
  (1, 'NO202606040002', 88.50),
  (2, 'NO202606040003', 360.00);

INSERT INTO order_items (order_id, product_name, quantity, price)
VALUES
  (1, '机械键盘', 1, 199.00),
  (2, '鼠标垫', 1, 38.50),
  (2, '数据线', 2, 25.00),
  (3, '显示器支架', 1, 360.00);

SELECT u.name, o.order_no, o.total_amount
FROM users AS u
INNER JOIN orders AS o ON o.user_id = u.id
ORDER BY o.id;

SELECT u.name, COUNT(o.id) AS order_count
FROM users AS u
LEFT JOIN orders AS o ON o.user_id = u.id
GROUP BY u.id, u.name
ORDER BY u.id;

SELECT o.order_no, i.product_name, i.quantity, i.price
FROM orders AS o
INNER JOIN order_items AS i ON i.order_id = o.id
ORDER BY o.id, i.id;

SELECT u.name, SUM(o.total_amount) AS total_spent
FROM users AS u
LEFT JOIN orders AS o ON o.user_id = u.id
GROUP BY u.id, u.name
ORDER BY total_spent DESC;
