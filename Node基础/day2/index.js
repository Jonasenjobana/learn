// Day2 示例代码：路径、文件系统与命令行脚本
// 这份文件可以直接运行：node index.js

const path = require('node:path')
const fs = require('node:fs/promises')

async function main() {
  console.log('示例 1：path 常用方法')
  const filePath = path.join('data', 'users.json')
  console.log('join:', filePath)
  console.log('resolve:', path.resolve(filePath))
  console.log('basename:', path.basename(filePath))
  console.log('dirname:', path.dirname(filePath))
  console.log('extname:', path.extname(filePath))

  console.log('\n示例 2：写入、读取、追加文件')
  const notePath = path.join(__dirname, 'study_log.txt')
  await fs.writeFile(notePath, '今天学习 Node 文件系统\n', 'utf-8')
  await fs.appendFile(notePath, '明天继续学习 HTTP 服务\n', 'utf-8')

  const content = await fs.readFile(notePath, 'utf-8')
  console.log(content)

  console.log('示例 3：统计文本')
  const lines = content.split(/\r?\n/)
  const nonEmptyLines = lines.filter((line) => line.trim() !== '')
  console.log('字符数:', content.length)
  console.log('总行数:', lines.length)
  console.log('非空行数:', nonEmptyLines.length)

  console.log('\n示例 4：扫描当前目录')
  const entries = await fs.readdir(__dirname)

  for (const entry of entries) {
    const fullPath = path.join(__dirname, entry)
    const stat = await fs.stat(fullPath)

    if (stat.isFile()) {
      console.log({
        name: entry,
        ext: path.extname(entry) || '无扩展名',
        size: stat.size
      })
    }
  }
}

main().catch((error) => {
  console.error('运行失败:', error.message)
  process.exitCode = 1
})

