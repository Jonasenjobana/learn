import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const outputFile = path.join(root, '.vitepress', 'generated-routes.mjs')

const ignoredDirs = new Set(['.git', '.vitepress', 'node_modules', 'dist', '.cache'])
const topOrder = ['Python基础', 'Node基础', '前端', '后端', '运维', 'CICD']
const topicOrder = ['webpack', 'angular', 'leaflet', '数据库', 'docker']

function toPosix(filePath) {
  return filePath.split(path.sep).join('/')
}

function stripExt(filePath) {
  return filePath.replace(/\.md$/i, '')
}

function naturalCompare(a, b) {
  return a.localeCompare(b, 'zh-CN', { numeric: true, sensitivity: 'base' })
}

function orderIndex(list, value) {
  const index = list.indexOf(value)
  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}

function sortTopNames(a, b) {
  const orderDiff = orderIndex(topOrder, a) - orderIndex(topOrder, b)
  return orderDiff === 0 ? naturalCompare(a, b) : orderDiff
}

function sortTopicNames(a, b) {
  const orderDiff = orderIndex(topicOrder, a) - orderIndex(topicOrder, b)
  return orderDiff === 0 ? naturalCompare(a, b) : orderDiff
}

function docLink(relativePath) {
  const normalized = toPosix(relativePath)
  if (normalized === 'README.md') return '/'
  if (normalized.endsWith('/README.md')) {
    return `/${normalized.slice(0, -'README.md'.length)}`
  }
  return `/${stripExt(normalized)}.html`
}

function fallbackTitle(relativePath) {
  const normalized = toPosix(relativePath)
  const parts = normalized.split('/')
  const file = parts.at(-1)

  if (file === 'README.md') {
    const dir = parts.at(-2)
    if (!dir) return '首页'
    if (/^day\d+$/i.test(dir)) return dir.replace(/^day/i, 'Day')
    return dir
  }

  return stripExt(file)
}

async function readTitle(absPath, relativePath) {
  const content = await fs.readFile(absPath, 'utf8')
  const heading = content
    .split(/\r?\n/)
    .find((line) => /^#\s+/.test(line))

  if (!heading) return fallbackTitle(relativePath)
  return heading.replace(/^#\s+/, '').trim()
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue
      files.push(...(await walk(path.join(dir, entry.name))))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(path.join(dir, entry.name))
    }
  }

  return files
}

function groupDocs(docs) {
  const byTop = new Map()

  for (const doc of docs) {
    if (doc.relativePath === 'README.md') continue

    const [top, topic = ''] = doc.relativePath.split('/')
    if (!top) continue

    if (!byTop.has(top)) byTop.set(top, new Map())
    const topics = byTop.get(top)
    const topicKey = topic.endsWith('.md') ? '__root__' : topic

    if (!topics.has(topicKey)) topics.set(topicKey, [])
    topics.get(topicKey).push(doc)
  }

  return byTop
}

function sortDocsForTopic(docs) {
  return docs.toSorted((a, b) => {
    const aName = path.basename(a.relativePath)
    const bName = path.basename(b.relativePath)
    const aDir = path.basename(path.dirname(a.relativePath))
    const bDir = path.basename(path.dirname(b.relativePath))
    const aDepth = a.relativePath.split('/').length
    const bDepth = b.relativePath.split('/').length

    const aIsReadme = aName === 'README.md'
    const bIsReadme = bName === 'README.md'
    if (aIsReadme !== bIsReadme) return aIsReadme ? -1 : 1
    if (aIsReadme && bIsReadme && aDepth !== bDepth) return aDepth - bDepth

    const aIsDay = /^day\d+$/i.test(aDir)
    const bIsDay = /^day\d+$/i.test(bDir)
    if (aIsDay !== bIsDay) return aIsDay ? -1 : 1

    return naturalCompare(a.relativePath, b.relativePath)
  })
}

function buildSidebar(byTop) {
  const sidebar = {}

  for (const top of [...byTop.keys()].sort(sortTopNames)) {
    const topics = byTop.get(top)
    const groups = []

    for (const topic of [...topics.keys()].sort(sortTopicNames)) {
      const docs = sortDocsForTopic(topics.get(topic))
      const readme = docs.find((doc) => doc.relativePath === `${top}/${topic}/README.md`)
      const text = topic === '__root__' ? top : readme?.topicTitle ?? topic

      groups.push({
        text,
        items: docs.map((doc) => ({
          text: doc.navTitle,
          link: doc.link,
        })),
      })
    }

    sidebar[`/${top}/`] = groups
  }

  const homeItems = []
  for (const top of [...byTop.keys()].sort(sortTopNames)) {
    const topics = byTop.get(top)
    const firstTopic = [...topics.keys()].sort(sortTopicNames)[0]
    const firstDocs = sortDocsForTopic(topics.get(firstTopic))
    const firstReadme =
      firstDocs.find((doc) => doc.relativePath === `${top}/${firstTopic}/README.md`) ??
      firstDocs.find((doc) => doc.relativePath.endsWith('/README.md')) ??
      firstDocs[0]
    if (!firstReadme) continue

    homeItems.push({
      text: firstReadme.topicTitle ?? top,
      link: firstReadme.link,
    })
  }

  sidebar['/'] = [
    {
      text: '学习入口',
      items: [{ text: '首页', link: '/' }, ...homeItems],
    },
  ]

  return sidebar
}

function buildNav(byTop) {
  const nav = [{ text: '首页', link: '/' }]

  for (const top of [...byTop.keys()].sort(sortTopNames)) {
    const topics = byTop.get(top)
    const firstTopic = [...topics.keys()].sort(sortTopicNames)[0]
    const firstDocs = sortDocsForTopic(topics.get(firstTopic))
    const firstReadme =
      firstDocs.find((doc) => doc.relativePath === `${top}/${firstTopic}/README.md`) ??
      firstDocs.find((doc) => doc.relativePath.endsWith('/README.md')) ??
      firstDocs[0]
    if (!firstReadme) continue

    nav.push({
      text: top,
      link: firstReadme.link,
    })
  }

  return nav
}

function displayTitle(title, relativePath) {
  const normalized = toPosix(relativePath)
  const dir = normalized.split('/').at(-2)
  const file = normalized.split('/').at(-1)

  if (file === '练习题.md') return '练习题'
  if (file === '答案.md') return '练习答案'
  if (file === '命令示例.md') return '命令示例'

  if (file === 'README.md') {
    if (dir && /^day\d+$/i.test(dir)) return dir.replace(/^day/i, 'Day')
    return '总览'
  }

  return title
}

const markdownFiles = await walk(root)
const docs = []

for (const absPath of markdownFiles) {
  const relativePath = toPosix(path.relative(root, absPath))
  const title = await readTitle(absPath, relativePath)
  const parts = relativePath.split('/')
  const topicTitle =
    parts.length >= 2 && parts[1] === 'README.md'
      ? title
      : parts.length >= 3 && parts[2] === 'README.md'
        ? title
        : undefined

  docs.push({
    relativePath,
    title,
    topicTitle,
    navTitle: displayTitle(title, relativePath),
    link: docLink(relativePath),
  })
}

const byTop = groupDocs(docs)
const nav = buildNav(byTop)
const sidebar = buildSidebar(byTop)

const content = `// This file is generated by scripts/update-vitepress-routes.mjs.
// Do not edit it manually.

export const nav = ${JSON.stringify(nav, null, 2)}

export const sidebar = ${JSON.stringify(sidebar, null, 2)}
`

await fs.writeFile(outputFile, content, 'utf8')
console.log(`Generated ${toPosix(path.relative(root, outputFile))}`)
