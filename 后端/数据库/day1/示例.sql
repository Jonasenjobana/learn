CREATE DATABASE IF NOT EXISTS learn_mysql DEFAULT CHARACTER SET utf8mb4;
USE learn_mysql;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  age INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, age)
VALUES
  ('小明', 'xiaoming@example.com', 18),
  ('小红', 'xiaohong@example.com', 20),
  ('小刚', 'xiaogang@example.com', 22);

SELECT * FROM users;

SELECT id, name, email
FROM users
WHERE age >= 20
ORDER BY id DESC
LIMIT 2;

UPDATE users
SET age = 19
WHERE id = 1;

SELECT * FROM users WHERE id = 1;

DELETE FROM users
WHERE id = 3;

SELECT * FROM users;
