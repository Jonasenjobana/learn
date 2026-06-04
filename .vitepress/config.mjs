import { defineConfig } from 'vitepress'
import { nav, sidebar } from './generated-routes.mjs'

const base = process.env.VITEPRESS_BASE || '/'

export default defineConfig({
  lang: 'zh-CN',
  title: 'AI 学习文档',
  description: '编程、前端、后端、AI、运维、CI/CD 学习资料',
  base,
  cleanUrls: false,
  rewrites: (id) => id.replace(/(^|\/)README\.md$/, '$1index.md'),
  ignoreDeadLinks: true,
  themeConfig: {
    nav,
    sidebar,
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }],
    search: {
      provider: 'local'
    },
    outline: {
      label: '本页目录'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    lastUpdated: {
      text: '最后更新'
    },
    darkModeSwitchLabel: '切换深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部'
  },
  lastUpdated: true
})
