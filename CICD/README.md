# GitHub Actions CI/CD 学习指南

这套内容用于研究 GitHub 的 CI/CD，也就是 GitHub Actions。  
默认读者已经有前端或 Node 基础，所以重点放在“提交代码后自动检查、自动构建、自动部署”的工程化流程。

## 当前学习入口

- [Day1：GitHub Actions 基础与第一个 CI](./day1/)
- [Day2：Node 项目 CI、缓存与构建产物](./day2/)
- [Day3：部署、Secrets 与环境保护](./day3/)

## 阶段总结

| 阶段 | 主题 | 学完后应掌握 | 入口 |
| --- | --- | --- | --- |
| Day1 | GitHub Actions 基础与第一个 CI | 理解 workflow、job、step、runner，能写出 push/PR 触发的基础 CI | [day1](./day1/) |
| Day2 | Node 项目 CI、缓存与构建产物 | 能对 Node 项目执行 install/lint/test/build，使用依赖缓存和 artifacts | [day2](./day2/) |
| Day3 | 部署、Secrets 与环境保护 | 理解 Secrets、环境变量、手动触发、部署环境和权限控制 | [day3](./day3/) |

### Day1 总结：GitHub Actions 基础与第一个 CI

Day1 的目标是先理解 GitHub Actions 的基本结构，并跑通一个最小 workflow。

重点内容：

- `.github/workflows/*.yml` 文件位置。
- `on` 触发条件。
- `jobs`、`steps`、`runs-on`。
- `actions/checkout`。
- `run` 执行命令。
- push 和 pull request 自动触发。

适合目标：

- 能看懂一个最小 workflow。
- 能知道 CI 为什么通常在提交代码后运行。
- 能在 GitHub Actions 页面查看运行日志。

### Day2 总结：Node 项目 CI、缓存与构建产物

Day2 的目标是把 GitHub Actions 用在真实 Node/前端项目里，完成安装依赖、检查、测试和构建。

重点内容：

- `actions/setup-node`。
- `npm ci` 和 `npm install` 的区别。
- Node 版本矩阵。
- npm 缓存。
- 上传构建产物 artifacts。
- job 失败时如何看日志。

适合目标：

- 能为 Node 项目写基础 CI。
- 能缓存依赖提高流水线速度。
- 能把 `dist` 作为构建产物保存下来。

### Day3 总结：部署、Secrets 与环境保护

Day3 的目标是从 CI 进入 CD，理解自动部署需要的密钥、权限和环境保护。

重点内容：

- `workflow_dispatch` 手动触发。
- `secrets` 和 `vars`。
- `env` 环境变量。
- GitHub Environments。
- `permissions` 最小权限原则。
- 部署前审批。
- 常见部署流程。

适合目标：

- 能安全使用 GitHub Secrets。
- 能写一个手动部署 workflow。
- 能理解为什么生产部署不能随便自动执行。

## 学习目标

学完 Day1-Day3 后，应能够：

- 看懂 GitHub Actions 的 YAML 结构。
- 写出基础 CI workflow。
- 给 Node 项目配置安装、测试、构建流程。
- 使用缓存和构建产物。
- 理解 Secrets、环境变量和权限。
- 设计一个简单的部署流程。

## 推荐学习方式

1. 每天先看对应 `README.md`。
2. 阅读 `workflow.yml` 示例。
3. 把示例复制到真实 GitHub 仓库的 `.github/workflows/` 下测试。
4. 提交一次 commit 或打开 PR，观察 Actions 日志。
5. 修改触发条件和命令，再观察变化。

## 基础概念

GitHub Actions 的核心结构：

```text
workflow
└─ jobs
   └─ steps
```

常见文件位置：

```text
.github/
└─ workflows/
   └─ ci.yml
```

最小示例：

```yaml
name: CI

on:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "hello github actions"
```

## 后续进阶方向

学完 Day1-Day3 后，可以继续研究：

- Docker 镜像构建和推送。
- GitHub Container Registry。
- 前端项目部署到 GitHub Pages / Vercel / Netlify。
- 后端项目部署到云服务器。
- 多环境部署：dev、staging、production。
- reusable workflows。
- composite actions。
- 自托管 runner。
- OIDC 免密部署云资源。
- CI/CD 安全加固。

## 官方文档入口

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Actions Quickstart](https://docs.github.com/en/actions/quickstart)
- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [Contexts reference](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts)
