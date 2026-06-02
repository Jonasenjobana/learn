# Day1：Node 环境、npm 与模块系统

这一阶段用于把 Node.js 最基本的运行方式跑起来。

如果你已经会浏览器里的 JavaScript，Day1 不需要重新学变量、判断、循环，重点看 Node 和浏览器环境的差异：

- Node 没有 `window`、`document`
- Node 可以访问文件、目录、进程、网络
- Node 项目通常从 `package.json` 开始管理
- Node 有 CommonJS 和 ESM 两种常见模块系统
- 命令行里运行 JS 文件，用的是 `node 文件名`

## 学习目标

学完 Day1 后，你应该能：

- 使用 `node` 执行 `.js` 文件。
- 看懂 `node -v`、`npm -v`、`npm init -y`。
- 理解 `package.json` 的基本作用。
- 区分 `dependencies` 和 `devDependencies`。
- 看懂 CommonJS 的 `require` / `module.exports`。
- 看懂 ESM 的 `import` / `export`。
- 知道 `process` 是 Node 里的进程对象。

## 文件说明

- [练习题](./练习题.md)
- [示例代码](./index.js)

## 推荐学习方式

1. 先确认本机 Node 版本：`node -v`
2. 运行 [示例代码](./index.js)：`node index.js`
3. 阅读本页的 Day1 重点
4. 自己完成 [练习题](./练习题.md)
5. 有疑问时回到上一层 [Node 基础总览](../README.md)

## Day1 重点提醒

### Node 不是浏览器

浏览器里常见：

```js
console.log(window.location.href)
console.log(document.title)
```

Node 里常见：

```js
console.log(process.cwd())
console.log(process.platform)
```

### 运行 JS 文件

```bash
node index.js
```

### package.json 是项目说明书

```json
{
  "name": "node-demo",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js"
  }
}
```

运行脚本：

```bash
npm run start
```

### CommonJS

这是很多老项目、脚本项目里仍然常见的写法。

```js
const path = require('node:path')

module.exports = {
  name: 'demo'
}
```

### ESM

这是现代 JavaScript 更统一的模块写法。

```js
import path from 'node:path'

export const name = 'demo'
```

如果 `package.json` 里设置：

```json
{
  "type": "module"
}
```

那么 `.js` 文件默认按 ESM 解析。

## 本日重点

### 常用命令

```bash
node -v
npm -v
node index.js
npm init -y
npm run start
```

### 常用全局能力

```js
console.log(__filename)
console.log(__dirname)
console.log(process.cwd())
console.log(process.argv)
```

注意：`__filename` 和 `__dirname` 是 CommonJS 里常见的变量，ESM 里不能直接使用。

### npm 依赖分类

- `dependencies`：运行项目时需要
- `devDependencies`：开发、测试、打包时需要

例如：

```bash
npm install lodash
npm install eslint -D
```

## 建议练习

- 输出当前 Node 版本
- 打印当前运行目录
- 创建一个最小 `package.json`
- 写一个 `npm run start` 脚本
- 使用 CommonJS 导出和导入一个函数
- 用 `process.argv` 读取命令行参数

