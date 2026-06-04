# Day2：Node 项目 CI、缓存与构建产物

这一阶段把 GitHub Actions 用到真实 Node 或前端项目中。  
Day1 只是跑通命令，Day2 要完成更接近项目的流程：安装依赖、检查代码、运行测试、执行构建，并保存构建产物。

## 学习目标

学完 Day2 后，你应该能：

- 使用 `actions/setup-node` 配置 Node。
- 理解 `npm ci` 适合 CI 环境。
- 配置 Node 版本矩阵。
- 使用 npm 缓存加速依赖安装。
- 执行 lint、test、build。
- 使用 `actions/upload-artifact` 保存构建产物。

## 文件说明

- [练习题](./练习题.md)
- [示例 workflow](./node-ci.yml)

## 推荐学习方式

1. 先看项目里是否有 `package-lock.json`。
2. 阅读 [示例 workflow](./node-ci.yml)。
3. 把 workflow 放入真实 Node 项目的 `.github/workflows/`。
4. 根据项目实际脚本修改 `npm run lint`、`npm test`、`npm run build`。
5. 提交后观察 Actions 日志和 artifacts。

## Day2 重点提醒

### 1. CI 里优先用 `npm ci`

```bash
npm ci
```

适合 CI 的原因：

- 根据 `package-lock.json` 精确安装。
- 比 `npm install` 更稳定。
- 如果 lock 文件和 `package.json` 不一致会直接失败。

### 2. `actions/setup-node` 配置 Node

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: npm
```

其中：

- `node-version` 指定 Node 版本。
- `cache: npm` 启用 npm 缓存。

### 3. 矩阵测试多个 Node 版本

```yaml
strategy:
  matrix:
    node-version: [20, 22]
```

适合库项目或需要兼容多个 Node 版本的项目。

### 4. 构建产物可以上传

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: dist
    path: dist
```

适合保存：

- 前端 `dist`
- 测试报告
- 覆盖率报告
- 打包后的文件

### 5. 脚本要贴合项目

不是所有项目都有这些脚本：

```bash
npm run lint
npm test
npm run build
```

如果项目没有，就要先在 `package.json` 中补脚本，或者删掉对应 step。

## 本日重点 workflow

```yaml
name: Node CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      - run: npm ci
      - run: npm run build
```

## 建议练习

- 把 Node 版本改成当前项目使用的版本。
- 添加 `npm run lint`。
- 添加 `npm test`。
- 上传 `dist` 目录。
- 故意让测试失败，观察 CI 如何阻止合并。

## 使用方式

把 [node-ci.yml](./node-ci.yml) 复制到真实仓库：

```text
.github/workflows/node-ci.yml
```

然后按项目实际脚本调整命令。
