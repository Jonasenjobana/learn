CREATE DATABASE IF NOT EXISTS learn_mysql DEFAULT CHARACTER SET utf8mb4;
USE learn_mysql;

DROP TABLE IF EXISTS access_logs;
DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  balance DECIMAL(10, 2) NOT NULL DEFAULT 0
);

INSERT INTO accounts (name, balance)
VALUES
  ('小明', 500.00),
  ('小红', 200.00);

SELECT * FROM accounts;

START TRANSACTION;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1 AND balance >= 100;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

COMMIT;

SELECT * FROM accounts;

START TRANSACTION;

UPDATE accounts
SET balance = balance - 999
WHERE id = 1 AND balance >= 999;

ROLLBACK;

SELECT * FROM accounts;

CREATE TABLE access_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  url VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO access_logs (user_id, url, created_at)
VALUES
  (1, '/api/users', '2026-06-04 09:00:00'),
  (1, '/api/orders', '2026-06-04 09:05:00'),
  (1, '/api/orders/1', '2026-06-04 09:10:00'),
  (2, '/api/users', '2026-06-04 10:00:00'),
  (2, '/api/products', '2026-06-04 10:05:00'),
  (3, '/api/login', '2026-06-04 11:00:00'),
  (3, '/api/logout', '2026-06-04 11:10:00'),
  (1, '/api/profile', '2026-06-04 12:00:00'),
  (2, '/api/cart', '2026-06-04 13:00:00'),
  (1, '/api/cart', '2026-06-04 14:00:00');

EXPLAIN
SELECT * FROM access_logs WHERE user_id = 1;

CREATE INDEX idx_access_logs_user_id ON access_logs(user_id);
CREATE INDEX idx_access_logs_user_created ON access_logs(user_id, created_at);

SHOW INDEX FROM access_logs;

EXPLAIN
SELECT * FROM access_logs WHERE user_id = 1;

EXPLAIN
SELECT *
FROM access_logs
WHERE user_id = 1
ORDER BY created_at DESC
LIMIT 3;
