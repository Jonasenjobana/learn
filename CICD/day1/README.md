# Day1：GitHub Actions 基础与第一个 CI

这一阶段用于把 GitHub Actions 最基本的 workflow 跑起来。  
Day1 不追求复杂部署，重点是理解 workflow 的结构，以及它怎么在 push 或 pull request 时自动执行。

## 学习目标

学完 Day1 后，你应该能：

- 知道 workflow 文件应该放在哪里。
- 理解 `name`、`on`、`jobs`、`steps`。
- 使用 GitHub 托管 runner。
- 使用 `actions/checkout` 拉取仓库代码。
- 写出一个最小 CI。
- 在 GitHub Actions 页面查看执行日志。

## 文件说明

- [练习题](./练习题.md)
- [示例 workflow](./ci.yml)

## 推荐学习方式

1. 先看本 README 的重点提醒。
2. 阅读 [示例 workflow](./ci.yml)。
3. 在真实 GitHub 仓库中创建 `.github/workflows/ci.yml`。
4. 复制示例内容并提交到 GitHub。
5. 打开 GitHub 仓库的 Actions 页面观察运行结果。

## Day1 重点提醒

### 1. workflow 文件位置固定

GitHub Actions 只会识别这个目录下的 workflow：

```text
.github/workflows/
```

例如：

```text
.github/workflows/ci.yml
```

### 2. `on` 决定什么时候运行

常见触发：

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

含义：

- push 到 `main` 时运行。
- 有 PR 指向 `main` 时运行。

### 3. 一个 workflow 可以有多个 job

```yaml
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - run: echo "hello"
```

理解方式：

- `jobs`：一组任务。
- `check`：任务名，可以自己起。
- `runs-on`：运行在哪种机器上。
- `steps`：任务中的每一步。

### 4. `actions/checkout` 很常用

```yaml
- uses: actions/checkout@v4
```

它的作用是把你的仓库代码拉到 runner 里。  
如果没有这一步，后面的命令通常找不到项目文件。

### 5. `run` 用来执行命令

```yaml
- run: node -v
- run: npm -v
```

在 Ubuntu runner 里，默认 shell 通常是 bash。

## 本日重点 workflow

```yaml
name: Day1 CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Print environment
        run: |
          pwd
          ls
          echo "GitHub Actions is running"
```

## 建议练习

- 修改 workflow 名称。
- 增加一个 step 输出当前目录。
- 增加一个 step 输出 Node 版本。
- 把触发分支从 `main` 改成 `master`。
- 故意写错一条命令，观察失败日志。

## 使用方式

把 [ci.yml](./ci.yml) 复制到真实仓库：

```text
.github/workflows/ci.yml
```

然后提交并推送：

```bash
git add .github/workflows/ci.yml
git commit -m "add ci workflow"
git push
```
