# Day3：Docker Compose 与多容器应用

这一阶段从单个容器进入多容器应用。  
真实项目常见组合是：后端服务、数据库、缓存、反向代理。Docker Compose 可以用一个配置文件把这些服务统一管理起来。

## 学习目标

学完 Day3 后，你应该能：

- 看懂 `compose.yml` 基础结构。
- 使用 `docker compose up -d` 启动多服务。
- 使用 `docker compose down` 停止服务。
- 理解 `services`、`ports`、`volumes`、`networks`。
- 使用环境变量配置容器。
- 理解容器之间可以用服务名通信。
- 使用 volume 持久化 MySQL 数据。

## 文件说明

- [练习题](./练习题.md)
- [Compose 示例](./compose.yml)
- [示例 Node 服务](./app/server.js)
- [Dockerfile](./app/Dockerfile)
- [package.json](./app/package.json)

## 推荐学习方式

1. 先阅读 [compose.yml](./compose.yml)。
2. 在 day3 目录执行 `docker compose up -d`。
3. 浏览器访问 `http://localhost:3000`。
4. 用 `docker compose ps` 查看服务。
5. 用 `docker compose down` 停止服务。
6. 做 [练习题](./练习题.md)。

## Day3 重点提醒

### 1. Compose 管理多个服务

一个 `compose.yml` 可以同时描述：

- app
- mysql
- redis
- nginx

示例结构：

```yaml
services:
  app:
    build: ./app
  mysql:
    image: mysql:8
```

### 2. 服务名就是容器间域名

在 Compose 网络里，app 连接 MySQL 时，host 不写 `localhost`，而写服务名：

```text
mysql
```

例如：

```text
mysql://root:password@mysql:3306/demo
```

注意：

- `localhost` 在容器里指的是当前容器自己。
- 服务之间通信要用 Compose 的 service name。

### 3. ports 是宿主机到容器

```yaml
ports:
  - "3000:3000"
```

含义：

```text
宿主机端口:容器端口
```

浏览器访问宿主机的 `localhost:3000`，会转发到 app 容器的 3000。

### 4. volume 用来持久化数据

MySQL 数据如果只存在容器里，删除容器后容易丢失。  
所以需要 volume：

```yaml
volumes:
  mysql_data:
```

再挂载到 MySQL：

```yaml
volumes:
  - mysql_data:/var/lib/mysql
```

### 5. down 和 down -v 不一样

```bash
docker compose down
```

停止并删除容器和网络，但保留 volume。

```bash
docker compose down -v
```

会连 volume 一起删除，数据库数据也会被删掉。要谨慎使用。

## 本日重点命令

```bash
docker compose up -d
docker compose ps
docker compose logs
docker compose logs app
docker compose down
```

## 建议练习

- 启动 app + mysql + redis。
- 修改 app 端口映射。
- 查看 MySQL 容器日志。
- 进入 MySQL 容器。
- 停止服务后重新启动，观察 volume 是否保留数据。
- 谨慎测试 `docker compose down -v`。

## Windows 提醒

在 PowerShell 中进入 day3 目录：

```powershell
cd C:\Users\Administrator\Desktop\AI\运维\docker\day3
```

启动：

```bash
docker compose up -d
```
