// Day1 示例代码：Node 环境、npm 与模块系统
// 这份文件可以直接运行：node index.js

console.log('示例 1：Hello Node')
console.log('Hello Node')

console.log('\n示例 2：当前运行环境')
console.log('当前目录:', process.cwd())
console.log('操作系统:', process.platform)
console.log('Node 版本:', process.version)

console.log('\n示例 3：命令行参数')
const name = process.argv[2] || 'Node'
console.log(`你好，${name}`)

console.log('\n示例 4：CommonJS 引入内置模块')
const path = require('node:path')
const demoPath = path.join('logs', 'app.log')
console.log('拼接后的路径:', demoPath)

console.log('\n示例 5：简单函数封装')
function add(a, b) {
  return a + b
}

console.log('3 + 5 =', add(3, 5))

