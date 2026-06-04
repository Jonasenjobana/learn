# Day2：Dockerfile 与镜像构建

这一阶段从“运行别人做好的镜像”进入“构建自己的镜像”。  
Day2 重点是 Dockerfile 基础语法，以及如何把一个简单 Node 服务打包成 Docker 镜像。

## 学习目标

学完 Day2 后，你应该能：

- 看懂基础 Dockerfile。
- 理解构建上下文。
- 使用 `docker build` 构建镜像。
- 使用 `docker run` 运行自定义镜像。
- 使用 `.dockerignore` 减少无用文件进入构建上下文。
- 理解镜像分层和缓存。

## 文件说明

- [练习题](./练习题.md)
- [示例 Dockerfile](./Dockerfile)
- [.dockerignore](./.dockerignore)
- [示例 Node 服务](./app/server.js)
- [package.json](./app/package.json)

## 推荐学习方式

1. 先阅读 [Dockerfile](./Dockerfile)。
2. 在 day2 目录执行构建命令。
3. 运行容器并访问 `http://localhost:3000`。
4. 修改 `server.js`，重新 build。
5. 做 [练习题](./练习题.md)。

## Day2 重点提醒

### 1. Dockerfile 是镜像说明书

常见指令：

| 指令 | 作用 |
| --- | --- |
| `FROM` | 基础镜像 |
| `WORKDIR` | 容器内工作目录 |
| `COPY` | 复制文件到镜像 |
| `RUN` | 构建镜像时执行命令 |
| `EXPOSE` | 声明容器服务端口 |
| `CMD` | 容器启动时执行命令 |

### 2. 构建镜像

在 `day2` 目录执行：

```bash
docker build -t docker-day2-node .
```

说明：

- `-t docker-day2-node`：给镜像取名。
- `.`：当前目录作为构建上下文。

### 3. 运行镜像

```bash
docker run -d --name docker-day2-app -p 3000:3000 docker-day2-node
```

访问：

```text
http://localhost:3000
```

### 4. `.dockerignore` 很重要

类似 `.gitignore`，用于排除不需要复制进镜像构建上下文的文件。

常见排除：

```text
node_modules
dist
.git
*.log
```

### 5. 镜像分层和缓存

Dockerfile 每一步通常会形成一层。  
把变化不频繁的步骤放前面，可以更好利用缓存。

例如 Node 项目常见写法：

```dockerfile
COPY app/package*.json ./
RUN npm install
COPY app/ ./
```

这样改业务代码时，不一定每次都重新安装依赖。

## 本日重点命令

```bash
docker build -t docker-day2-node .
docker run -d --name docker-day2-app -p 3000:3000 docker-day2-node
docker logs docker-day2-app
docker stop docker-day2-app
docker rm docker-day2-app
```

## 建议练习

- 修改响应文本后重新构建镜像。
- 修改镜像名。
- 修改容器端口映射。
- 故意删掉 `CMD`，观察容器启动行为。
- 修改 `.dockerignore`，观察构建上下文变化。

## Windows 提醒

在 PowerShell 中进入 day2 目录：

```powershell
cd C:\Users\Administrator\Desktop\AI\运维\docker\day2
```

再执行：

```bash
docker build -t docker-day2-node .
```
