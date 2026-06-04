# Day3：部署、Secrets 与环境保护

这一阶段从 CI 进入 CD。  
部署比构建更危险，因为它会影响真实环境，所以 Day3 的重点不是“能不能自动部署”，而是“怎么安全地部署”。

## 学习目标

学完 Day3 后，你应该能：

- 使用 `workflow_dispatch` 手动触发 workflow。
- 理解 `secrets`、`vars`、`env` 的区别。
- 使用 GitHub Environments 管理部署环境。
- 给部署 job 设置最小权限。
- 理解为什么生产部署需要审批。
- 写出一个简单部署 workflow 模板。

## 文件说明

- [练习题](./练习题.md)
- [示例 workflow](./deploy.yml)

## 推荐学习方式

1. 先理解 Secrets 不应该写进仓库。
2. 阅读 [示例 workflow](./deploy.yml)。
3. 在 GitHub 仓库 Settings 中添加 Actions Secret。
4. 创建 staging 或 production Environment。
5. 使用手动触发运行部署 workflow。

## Day3 重点提醒

### 1. 部署建议先手动触发

```yaml
on:
  workflow_dispatch:
```

初学阶段不要一上来 push 就自动部署生产环境。  
先用手动触发，更容易控制风险。

### 2. Secrets 不能写进代码

错误做法：

```yaml
run: ssh user@server -p my-password
```

正确做法：

```yaml
run: echo "${{ secrets.DEPLOY_HOST }}"
```

实际项目里，密码、token、私钥、云厂商密钥都应该放在 GitHub Secrets。

### 3. `env`、`vars`、`secrets`

| 类型 | 用途 | 是否敏感 |
| --- | --- | --- |
| `env` | workflow/job/step 中的环境变量 | 不一定 |
| `vars` | GitHub 配置的普通变量 | 不敏感 |
| `secrets` | GitHub 配置的密钥 | 敏感 |

### 4. Environments 可以保护生产部署

GitHub Environments 常用于：

- 区分 `staging` 和 `production`。
- 给生产环境加审批。
- 给不同环境设置不同 secrets。

示例：

```yaml
environment: production
```

### 5. permissions 要尽量小

```yaml
permissions:
  contents: read
```

不要默认给过大的权限。  
需要推送镜像、发 release、写 PR 评论时，再按需增加。

## 本日重点 workflow

```yaml
name: Deploy

on:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - run: echo "Deploy to ${{ vars.DEPLOY_ENV }}"
```

## 建议练习

- 添加一个 repository secret。
- 添加一个 repository variable。
- 创建一个 `staging` Environment。
- 把部署 job 绑定到 `staging`。
- 使用 `workflow_dispatch` 手动运行。
- 尝试给 production 加审批。

## 使用方式

把 [deploy.yml](./deploy.yml) 复制到真实仓库：

```text
.github/workflows/deploy.yml
```

再到 GitHub 仓库设置里配置：

- Settings -> Secrets and variables -> Actions
- Settings -> Environments
