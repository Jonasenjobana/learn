CREATE DATABASE IF NOT EXISTS learn_shop 
DEFAULT CHARACTER SET utf8mb4;

USE learn_shop;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL,
    stock INT,
    description VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)

INSERT INTO products (name, price, stock, description) VALUES ('哇哈哈', 1.5, 1023, '好喝的哇哈哈');
INSERT INTO products (name, price, stock, description) VALUES ('可口可乐', 1.3, 341, '可口可乐摩登装');
INSERT INTO products (name, price, stock, description) VALUES ('三得利乌龙茶', 1.5, 120, '无糖冰镇更好喝');
INSERT INTO products (name, price, stock, description) VALUES ('卫龙辣条', 1.5, 44, '甜辣');
INSERT INTO products (name, price, stock, description) VALUES ('咪咪', 0.2, 0, '童年味道');