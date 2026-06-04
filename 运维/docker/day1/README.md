# Day1：镜像、容器与常用命令

这一阶段用于把 Docker 最基础的运行方式跑起来。  
Day1 不写 Dockerfile，也不做复杂部署，重点是理解镜像、容器、端口映射、日志和进入容器这些基础能力。

## 学习目标

学完 Day1 后，你应该能：

- 理解镜像和容器的区别。
- 拉取 Docker 镜像。
- 运行一个容器。
- 查看容器列表和日志。
- 进入容器内部。
- 映射端口访问容器服务。
- 停止、删除容器。

## 文件说明

- [练习题](./练习题.md)
- [命令示例](./命令示例.md)

## 推荐学习方式

1. 先确认 Docker Desktop 或 Docker Engine 已经启动。
2. 执行 [命令示例](./命令示例.md) 中的命令。
3. 用浏览器访问 `http://localhost:8080`。
4. 自己完成 [练习题](./练习题.md)。
5. 每次删除容器前先用 `docker ps -a` 确认目标。

## Day1 重点提醒

### 1. 镜像和容器

可以这样理解：

- 镜像：应用模板，例如 `nginx` 镜像。
- 容器：镜像运行起来之后的实例。

一个镜像可以启动多个容器。

```text
nginx 镜像 -> web1 容器
nginx 镜像 -> web2 容器
```

### 2. 拉取镜像

```bash
docker pull nginx
```

查看本地镜像：

```bash
docker images
```

### 3. 运行容器

```bash
docker run -d --name web -p 8080:80 nginx
```

参数含义：

- `-d`：后台运行。
- `--name web`：容器名叫 `web`。
- `-p 8080:80`：宿主机 8080 端口映射到容器 80 端口。
- `nginx`：使用 nginx 镜像。

### 4. 查看容器

```bash
docker ps
docker ps -a
```

区别：

- `docker ps`：只看正在运行的容器。
- `docker ps -a`：查看所有容器，包括已经停止的。

### 5. 查看日志

```bash
docker logs web
```

持续查看：

```bash
docker logs -f web
```

### 6. 进入容器

```bash
docker exec -it web sh
```

说明：

- `exec`：在容器里执行命令。
- `-it`：交互式终端。
- `sh`：进入 shell。

### 7. 停止和删除容器

```bash
docker stop web
docker rm web
```

如果容器还在运行，通常要先 `stop` 再 `rm`。

## 本日重点命令

```bash
docker version
docker pull nginx
docker images
docker run -d --name web -p 8080:80 nginx
docker ps
docker logs web
docker exec -it web sh
docker stop web
docker rm web
```

## 建议练习

- 拉取 nginx 镜像。
- 启动一个 nginx 容器。
- 通过浏览器访问容器。
- 查看容器日志。
- 进入容器内部查看文件。
- 停止并删除容器。

## Windows 提醒

如果你使用 Docker Desktop：

- 确认 Docker Desktop 已启动。
- 终端可以用 PowerShell。
- 浏览器访问 `http://localhost:8080`。
- 如果端口被占用，可以换成 `-p 8081:80`。
