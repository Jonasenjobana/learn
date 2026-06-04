# Docker 学习指南

这套内容用于从零学习 Docker，并逐步过渡到后端、前端、数据库服务的容器化部署。\
默认读者已经有一定前端或后端基础，所以重点放在“能运行容器、能写 Dockerfile、能用 Compose 编排服务”。

## 当前学习入口

- [Day1：镜像、容器与常用命令](./day1/)
- [Day2：Dockerfile 与镜像构建](./day2/)
- [Day3：Docker Compose 与多容器应用](./day3/)

## 阶段总结

| 阶段   | 主题                    | 学完后应掌握                                                  | 入口              |
| ---- | --------------------- | ------------------------------------------------------- | --------------- |
| Day1 | 镜像、容器与常用命令            | 理解镜像和容器，能拉取镜像、运行容器、查看日志、进入容器、映射端口和目录                    | [day1](./day1/) |
| Day2 | Dockerfile 与镜像构建      | 能为 Node/前端项目编写 Dockerfile，理解构建上下文、分层缓存和 `.dockerignore` | [day2](./day2/) |
| Day3 | Docker Compose 与多容器应用 | 能用 Compose 启动 app、MySQL、Redis 等多服务，理解网络、数据卷和环境变量        | [day3](./day3/) |

### Day1 总结：镜像、容器与常用命令

Day1 的目标是先把 Docker 跑起来，理解最核心的“镜像”和“容器”。

重点内容：

- Docker 是什么。
- 镜像和容器的区别。
- `docker pull`、`docker run`、`docker ps`。
- 端口映射 `-p`。
- 后台运行 `-d`。
- 查看日志 `docker logs`。
- 进入容器 `docker exec`。
- 停止和删除容器。

适合目标：

- 能运行一个 nginx 容器。
- 能通过浏览器访问容器服务。
- 能查看容器日志和状态。

### Day2 总结：Dockerfile 与镜像构建

Day2 的目标是从“使用别人镜像”进入“构建自己的镜像”。

重点内容：

- `Dockerfile` 基础语法。
- `FROM`、`WORKDIR`、`COPY`、`RUN`、`CMD`。
- 构建镜像 `docker build`。
- 运行自定义镜像。
- `.dockerignore`。
- 镜像分层和缓存。
- Node 项目容器化。

适合目标：

- 能为一个 Node 服务写 Dockerfile。
- 能构建并运行自己的镜像。
- 能解释为什么要使用 `.dockerignore`。

### Day3 总结：Docker Compose 与多容器应用

Day3 的目标是把多个容器组合成一个应用，例如后端服务 + MySQL + Redis。

重点内容：

- `compose.yml` 基础结构。
- `services`、`ports`、`volumes`、`networks`。
- 环境变量。
- 服务名作为容器间域名。
- 数据卷保存数据库数据。
- `docker compose up` 和 `docker compose down`。

适合目标：

- 能用 Compose 启动多服务项目。
- 能让 app 容器连接 MySQL 容器。
- 能理解为什么数据库数据要用 volume 持久化。

## 学习目标

学完 Day1-Day3 后，应能够：

- 看懂常见 Docker 命令。
- 区分镜像、容器、数据卷和网络。
- 使用 Docker 运行 nginx、MySQL、Redis 等基础服务。
- 为 Node 项目编写 Dockerfile。
- 用 Docker Compose 管理多容器开发环境。
- 理解容器化对部署和 CI/CD 的意义。

## 推荐学习方式

1. 每天先看对应 `README.md`。
2. 复制示例命令到终端执行。
3. 自己完成 `练习题.md`。
4. 修改端口、环境变量、目录挂载，再观察变化。
5. 学完后尝试把前端、后端、数据库放进同一个 Compose 项目。

## 基础概念

Docker 常见对象：

| 概念         | 说明           |
| ---------- | ------------ |
| Image      | 镜像，像应用模板     |
| Container  | 容器，镜像运行后的实例  |
| Volume     | 数据卷，用于持久化数据  |
| Network    | 网络，让容器之间通信   |
| Dockerfile | 构建镜像的说明书     |
| Compose    | 管理多容器应用的配置工具 |

一个常见流程：

```text
写 Dockerfile -> build 镜像 -> run 容器 -> 查看日志 -> 停止/删除容器
```

## 常用命令速查

```bash
docker version
docker images
docker ps
docker ps -a
docker pull nginx
docker run -d --name web -p 8080:80 nginx
docker logs web
docker exec -it web sh
docker stop web
docker rm web
docker rmi nginx
```

Compose 常用命令：

```bash
docker compose up -d
docker compose ps
docker compose logs
docker compose logs app
docker compose down
docker compose down -v
```

## 后续进阶方向

学完 Day1-Day3 后，可以继续补：

- 多阶段构建。
- 镜像体积优化。
- Docker 网络进阶。
- Docker 数据卷备份。
- 容器健康检查。
- Docker 与 GitHub Actions / Jenkins 集成。
- Docker 部署前端、后端、数据库。
- Docker Swarm 和 Kubernetes 基础。
- 生产环境容器安全。

