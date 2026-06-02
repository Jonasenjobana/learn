# Day2：路径、文件系统与命令行脚本

这一阶段用于学习 Node 最常用的本地能力：处理路径、读写文件、扫描目录、写小脚本。

如果你有前端 JavaScript 基础，Day2 的重点不是语法，而是把 JS 用在浏览器之外：

- 用 `path` 处理跨平台路径
- 用 `fs` 读取、写入、追加文件
- 用 `process.argv` 接收命令行参数
- 用 `async / await` 处理异步文件操作
- 把重复操作封装成可运行的小脚本

## 学习目标

学完 Day2 后，你应该能：

- 使用 `path.join()`、`path.resolve()` 处理路径。
- 使用 `fs/promises` 读取和写入文本文件。
- 使用 `readdir()` 和 `stat()` 扫描目录。
- 使用 `process.argv` 读取脚本参数。
- 写出带错误处理的 Node 命令行脚本。
- 理解为什么大文件不能总是直接 `readFile()`。

## 文件说明

- [练习题](./练习题.md)
- [示例代码](./index.js)

## 推荐学习方式

1. 先看 `path`，理解不要手动拼路径字符串
2. 再看 `fs/promises`，掌握基本文件读写
3. 运行 [示例代码](./index.js)：`node index.js`
4. 按顺序完成 [练习题](./练习题.md)
5. 最后尝试把多个小功能组合成一个脚本

## 和浏览器 JavaScript 最不一样的地方

### 1. Node 可以操作本地文件

```js
const fs = require('node:fs/promises')

async function main() {
  const content = await fs.readFile('README.md', 'utf-8')
  console.log(content)
}

main()
```

### 2. 路径不要手动拼接

不推荐：

```js
const filePath = 'logs' + '/' + 'app.log'
```

推荐：

```js
const path = require('node:path')

const filePath = path.join('logs', 'app.log')
```

### 3. 脚本可以接收参数

```js
const fileName = process.argv[2]
```

运行：

```bash
node index.js note.txt
```

## 学习顺序

建议按下面顺序学习：

1. `path.join()` 和 `path.resolve()`
2. `path.basename()`、`path.dirname()`、`path.extname()`
3. `fs.readFile()`、`fs.writeFile()`、`fs.appendFile()`
4. `fs.readdir()`、`fs.stat()`
5. `process.argv`
6. `try / catch`
7. 综合脚本练习

## 本日重点

### path 常用方法

```js
const path = require('node:path')

console.log(path.join('data', 'users.json'))
console.log(path.resolve('data', 'users.json'))
console.log(path.basename('/data/users.json'))
console.log(path.dirname('/data/users.json'))
console.log(path.extname('/data/users.json'))
```

### fs/promises

```js
const fs = require('node:fs/promises')

async function main() {
  await fs.writeFile('note.txt', '今天学习 Node 文件系统', 'utf-8')
  const content = await fs.readFile('note.txt', 'utf-8')
  console.log(content)
}

main()
```

### 错误处理

```js
async function main() {
  try {
    const content = await fs.readFile('missing.txt', 'utf-8')
    console.log(content)
  } catch (error) {
    console.error('读取失败:', error.message)
    process.exitCode = 1
  }
}
```

## 建议练习

- 读取一个文本文件并打印内容
- 写入一个学习日志文件
- 追加一行日志
- 复制一个文件
- 统计文本字符数和行数
- 扫描目录，输出文件名、扩展名和大小
- 读取 JSON 文件并格式化输出

## 入口文件

- [Day2 练习题](./练习题.md)
- [Day2 示例代码](./index.js)

