# Node 基础查漏补缺

这份笔记用于快速补齐 Node.js 日常开发里最常用、最容易混淆、最值得反复回看的知识点。默认读者已经有前端 JavaScript 基础，所以重点放在 **Node 运行环境、模块系统、文件系统、异步模型、工程化和常见后端能力**。

## 当前学习入口

- [Day1：Node 环境、npm 与模块系统](./day1/README.md)
- [Day2：路径、文件系统与命令行脚本](./day2/README.md)

## 1. Node 是什么

Node.js 是一个基于 V8 引擎的 JavaScript 运行时，让 JavaScript 可以脱离浏览器运行在操作系统上。

它常用于：

- 写命令行工具
- 写后端接口服务
- 操作文件、目录、网络、进程
- 搭建前端工程化工具链
- 写脚本自动化处理任务

Node 和浏览器最大的区别：

| 对比项 | 浏览器 JavaScript | Node.js |
| --- | --- | --- |
| 主要环境 | 浏览器页面 | 操作系统 |
| 常见全局对象 | `window`、`document` | `global`、`process` |
| DOM 操作 | 支持 | 不支持 |
| 文件系统 | 通常不允许直接访问 | 可通过 `fs` 访问 |
| 网络能力 | `fetch`、XHR、WebSocket | `http`、`net`、`dns`、`fetch` |

## 2. 常用命令

```bash
node -v
npm -v
node index.js
npm init -y
npm install 包名
npm install 包名 -D
npm uninstall 包名
npm run 脚本名
npx 命令名
```

常见 npm 参数：

| 命令 | 含义 |
| --- | --- |
| `npm install` | 根据 `package.json` 安装依赖 |
| `npm install lodash` | 安装生产依赖 |
| `npm install eslint -D` | 安装开发依赖 |
| `npm update` | 更新依赖 |
| `npm list` | 查看已安装依赖 |
| `npm outdated` | 查看可更新依赖 |

## 3. package.json

`package.json` 是 Node 项目的说明书。

```json
{
  "name": "node-demo",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {},
  "devDependencies": {}
}
```

重点字段：

| 字段 | 作用 |
| --- | --- |
| `name` | 项目名 |
| `version` | 项目版本 |
| `type` | 决定 `.js` 默认使用 CommonJS 还是 ESM |
| `scripts` | 自定义命令 |
| `dependencies` | 运行时依赖 |
| `devDependencies` | 开发时依赖 |

依赖分类原则：

- 项目运行时必须用到：放 `dependencies`
- 只在开发、测试、打包时用到：放 `devDependencies`

## 4. 模块系统：CommonJS 与 ESM

Node 里常见两种模块写法。

### CommonJS

```js
const fs = require('node:fs')

module.exports = {
  name: 'demo'
}
```

### ESM

```js
import fs from 'node:fs'

export const name = 'demo'
export default {
  name
}
```

### 怎么选择

新项目优先使用 ESM：

```json
{
  "type": "module"
}
```

老项目里如果已经大量使用 `require` 和 `module.exports`，优先保持 CommonJS，不要为了统一而大面积改动。

### 文件后缀规则

| 后缀 | 模块类型 |
| --- | --- |
| `.cjs` | 强制 CommonJS |
| `.mjs` | 强制 ESM |
| `.js` | 由 `package.json` 的 `type` 决定 |

### `__dirname` / `__filename` / `import.meta.url`

这是 CJS 和 ESM 之间最容易踩坑的差异之一。

**CommonJS** 自带两个全局变量：

| 变量 | 值 | 示例 |
| --- | --- | --- |
| `__filename` | 当前文件的绝对路径 | `C:\project\src\utils\log.cjs` |
| `__dirname` | 当前文件所在目录 | `C:\project\src\utils` |

**ESM 没有这两个全局变量**，需要用 `import.meta.url` 自己算：

| 表达式 | 相当于 | 示例 |
| --- | --- | --- |
| `import.meta.url` | `__filename`（URL 格式） | `file:///C:/project/src/utils/log.mjs` |
| `fileURLToPath(import.meta.url)` | `__filename`（系统路径） | `C:\project\src\utils\log.mjs` |
| `path.dirname(fileURLToPath(import.meta.url))` | `__dirname` | `C:\project\src\utils` |

完整写法对比：

```js
// ========== CommonJS (.cjs) ==========
const path = require('path')

console.log(__filename)   // C:\project\src\log.cjs
console.log(__dirname)    // C:\project\src

// 拿父级目录
const parent = path.dirname(__dirname)   // C:\project


// ========== ESM (.mjs 或 type:module 的 .js) ==========
import path from 'path'
import { fileURLToPath } from 'url'

// 手动模拟 __dirname / __filename
const __filename = fileURLToPath(import.meta.url)          // C:\project\src\log.mjs
const __dirname = path.dirname(__filename)                  // C:\project\src

// 拿父级目录
const parent = path.dirname(__dirname)                      // C:\project
```

关键记忆点：

- `import.meta.url` 永远返回**当前源文件**的 `file://` URL，跟谁调用它无关
- `.cjs` 里 `__dirname` 直接用，`.mjs` 里得手算
- `"type": "module"` 的 `.js` 行为等同 `.mjs`

## 5. 路径处理 path

处理文件路径时，不建议手动拼字符串，优先使用 `node:path`。

```js
import path from 'node:path'

const filePath = path.join('logs', 'app.log')
const absolutePath = path.resolve('logs', 'app.log')
const ext = path.extname('avatar.png')
const name = path.basename('/user/avatar.png')
const dir = path.dirname('/user/avatar.png')

console.log(filePath, absolutePath, ext, name, dir)
```

常用 API：

| API | 作用 |
| --- | --- |
| `path.join()` | 拼接路径 |
| `path.resolve()` | 解析为绝对路径 |
| `path.basename()` | 获取文件名 |
| `path.dirname()` | 获取目录名 |
| `path.extname()` | 获取扩展名 |

Windows 和 macOS/Linux 的路径分隔符不同，所以不要写死 `/` 或 `\`。

## 6. 文件系统 fs

优先使用 Promise 风格的 `node:fs/promises`。

```js
import fs from 'node:fs/promises'

const text = await fs.readFile('note.txt', 'utf-8')
await fs.writeFile('copy.txt', text, 'utf-8')
await fs.appendFile('app.log', 'hello\n', 'utf-8')
```

常用 API：

| API | 作用 |
| --- | --- |
| `readFile()` | 读取文件 |
| `writeFile()` | 写入文件，会覆盖原内容 |
| `appendFile()` | 追加写入 |
| `mkdir()` | 创建目录 |
| `readdir()` | 读取目录 |
| `stat()` | 查看文件信息 |
| `copyFile()` | 复制文件 |
| `rename()` | 重命名或移动 |
| `unlink()` | 删除文件 |

注意：

- `writeFile()` 会覆盖原内容，使用前要确认是否可覆盖
- 删除文件用 `unlink()`，删除目录用 `rm()`，实际项目里要非常谨慎
- 读取大文件时不要直接 `readFile()`，优先考虑流

## 7. process 与环境变量

`process` 表示当前 Node 进程。

```js
console.log(process.cwd())
console.log(process.argv)
console.log(process.env.NODE_ENV)
console.log(process.platform)
```

常用属性：

| 属性 | 作用 |
| --- | --- |
| `process.cwd()` | 当前命令执行目录 |
| `process.argv` | 命令行参数 |
| `process.env` | 环境变量 |
| `process.platform` | 操作系统平台 |
| `process.exitCode` | 设置退出码 |

命令行参数示例：

```js
const [, , name = 'Node'] = process.argv

console.log(`Hello ${name}`)
```

运行：

```bash
node index.js Alice
```

## 8. 异步模型与事件循环

Node 非常依赖异步编程。

常见异步形式：

- 回调函数
- Promise
- async / await
- 事件监听
- Stream

### async / await

```js
import fs from 'node:fs/promises'

async function main() {
  try {
    const content = await fs.readFile('README.md', 'utf-8')
    console.log(content)
  } catch (error) {
    console.error('读取失败:', error.message)
  }
}

main()
```

### 事件循环常见顺序

```js
console.log('start')

setTimeout(() => {
  console.log('timeout')
}, 0)

Promise.resolve().then(() => {
  console.log('promise')
})

console.log('end')
```

输出通常是：

```text
start
end
promise
timeout
```

重点理解：

- 同步代码先执行
- Promise 微任务优先于定时器宏任务
- `setTimeout(fn, 0)` 不是立即执行，而是尽快进入下一轮任务

## 9. Buffer

`Buffer` 用来处理二进制数据，例如图片、文件、网络数据。

```js
const buffer = Buffer.from('你好 Node')

console.log(buffer)
console.log(buffer.toString('utf-8'))
```

常见场景：

- 文件读写
- 图片处理
- 网络传输
- 加密解密

## 10. Stream

流适合处理大文件或持续数据，不需要一次性把所有内容读入内存。

```js
import fs from 'node:fs'

const reader = fs.createReadStream('input.txt', 'utf-8')
const writer = fs.createWriteStream('output.txt', 'utf-8')

reader.pipe(writer)
```

常见流类型：

| 类型 | 说明 |
| --- | --- |
| Readable | 可读流 |
| Writable | 可写流 |
| Duplex | 可读可写流 |
| Transform | 转换流 |

什么时候用流：

- 文件很大
- 边读边写
- 上传下载
- 日志持续写入
- 网络请求响应

## 11. 事件 EventEmitter

Node 很多模块都基于事件模型。

```js
import { EventEmitter } from 'node:events'

const emitter = new EventEmitter()

emitter.on('login', (user) => {
  console.log(`${user} logged in`)
})

emitter.emit('login', 'Alice')
```

常用方法：

| API | 作用 |
| --- | --- |
| `on()` | 监听事件 |
| `once()` | 只监听一次 |
| `off()` | 移除监听 |
| `emit()` | 触发事件 |

## 12. HTTP 服务基础

不用框架也可以启动一个简单 HTTP 服务。

```js
import http from 'node:http'

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ message: 'Hello Node' }))
    return
  }

  res.statusCode = 404
  res.end('Not Found')
})

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
```

需要掌握：

- `req.url`
- `req.method`
- `req.headers`
- `res.statusCode`
- `res.setHeader()`
- `res.end()`

真实项目里一般会使用成熟框架，如 Express、Koa、Fastify、NestJS 等。

## 13. fetch 请求

现代 Node 已内置 `fetch`。

```js
const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
const data = await response.json()

console.log(data)
```

常见注意点：

- `response.ok` 用来判断 HTTP 状态是否成功
- `response.json()` 是异步方法
- 网络错误和 HTTP 错误不是一回事

```js
const response = await fetch('https://example.com/api')

if (!response.ok) {
  throw new Error(`HTTP ${response.status}`)
}

const data = await response.json()
```

## 14. 错误处理

Node 项目里错误处理非常重要。

```js
try {
  await doSomething()
} catch (error) {
  console.error(error.message)
}
```

常见原则：

- 能处理就处理，不能处理就向上抛
- 不要吞掉错误
- 异步函数要记得 `await`
- 接口层要返回合理状态码
- 脚本里失败时设置非 0 退出码

```js
async function main() {
  throw new Error('任务失败')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
```

## 15. 调试与排查

常用方式：

```bash
node --watch index.js
node --inspect index.js
```

简单排查：

```js
console.log(value)
console.dir(object, { depth: null })
console.time('task')
console.timeEnd('task')
```

常见问题：

| 问题 | 排查方向 |
| --- | --- |
| 找不到模块 | 检查是否安装、路径是否正确、模块类型是否一致 |
| 端口被占用 | 换端口或关闭占用进程 |
| 中文乱码 | 检查文件编码、响应头 charset |
| 路径错误 | 使用 `path.resolve()` 打印绝对路径 |
| Promise 没执行完 | 检查是否漏了 `await` |

## 16. 命令行脚本

Node 很适合写小工具。

```js
import fs from 'node:fs/promises'

const [, , fileName] = process.argv

if (!fileName) {
  console.error('请传入文件名')
  process.exitCode = 1
} else {
  const content = await fs.readFile(fileName, 'utf-8')
  console.log(content)
}
```

运行：

```bash
node read-file.js README.md
```

## 17. 常见项目结构

小型 Node 项目可以这样组织：

```text
project/
  package.json
  README.md
  src/
    index.js
    config.js
    utils/
    services/
  tests/
```

接口服务常见结构：

```text
project/
  src/
    app.js
    routes/
    controllers/
    services/
    models/
    middlewares/
    utils/
```

不要一开始就过度拆分，先让结构服务于真实需求。

## 18. 必会清单

学习 Node 基础时，建议按下面顺序查漏补缺：

- 会用 `node` 执行 JS 文件
- 会看懂和修改 `package.json`
- 明白 `dependencies` 和 `devDependencies`
- 明白 CommonJS 和 ESM 的区别
- 会使用 `path` 处理跨平台路径
- 会使用 `fs/promises` 读写文件
- 会读取命令行参数和环境变量
- 会写 `async / await` 并处理错误
- 明白事件循环里同步、微任务、宏任务的大致顺序
- 知道 Buffer 是处理二进制数据的
- 知道 Stream 适合处理大文件
- 会用 `http` 启动一个简单服务
- 会用 `fetch` 请求接口
- 会用 `console`、`--watch`、`--inspect` 做基础调试

## 19. 练习题

### 练习 1：文件复制

写一个脚本：

- 接收两个命令行参数：源文件、目标文件
- 读取源文件内容
- 写入目标文件
- 如果参数不足，打印提示并设置 `process.exitCode = 1`

### 练习 2：统计文本

读取一个 `.txt` 文件，统计：

- 总字符数
- 总行数
- 非空行数

### 练习 3：JSON 格式化

读取一个 JSON 文件：

- 如果 JSON 合法，格式化输出到新文件
- 如果 JSON 不合法，打印错误原因

### 练习 4：简易 HTTP API

使用 `node:http` 写一个服务：

- `GET /` 返回 `{ "message": "hello" }`
- `GET /time` 返回当前时间
- 其他路径返回 404

### 练习 5：目录扫描

写一个脚本：

- 接收目录路径
- 读取目录下所有文件名
- 输出文件名、扩展名、大小

## 20. 后续进阶方向

Node 基础之后，可以继续补：

- npm、pnpm、yarn 包管理差异
- Express / Koa / Fastify Web 框架
- RESTful API 设计
- 数据库连接：MySQL、PostgreSQL、MongoDB、Redis
- 身份认证：Cookie、Session、JWT
- 日志、配置、错误处理中间件
- 单元测试和接口测试
- TypeScript + Node
- Node 性能优化和部署
