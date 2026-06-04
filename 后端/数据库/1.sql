CREATE TABLE tbl_ship (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ship_name VARCHAR(255),
    ship_name_en VARCHAR(255) NOT NULL comment '英文名称',
    ship_type TINYINT comment '1: 普通船, 2: 特殊船',
    mmsi CHAR(9) comment 'MMSI' UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP comment '更新时间' ON UPDATE CURRENT_TIMESTAMP,
);