import { defineConfig } from 'vitepress'

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
    nav: [
      { text: '首页', link: '/' },
      { text: 'Python 基础', link: '/Python基础/' },
      { text: 'Node 基础', link: '/Node基础/' },
      { text: '前端', link: '/前端/webpack/' },
      { text: '后端', link: '/后端/数据库/' },
      { text: '运维', link: '/运维/docker/' },
      { text: 'CI/CD', link: '/CICD/' }
    ],
    sidebar: {
      '/Python基础/': [
        {
          text: 'Python 基础',
          items: [
            { text: '总览', link: '/Python基础/' },
            { text: 'Day1', link: '/Python基础/day1/' },
            { text: 'Day2', link: '/Python基础/day2/' },
            { text: 'Day3', link: '/Python基础/day3/' },
            { text: 'Day4', link: '/Python基础/day4/' },
            { text: 'Day5', link: '/Python基础/day5/' },
            { text: 'Day1-Day5 总览', link: '/Python基础/Day1-Day5总览.html' },
            { text: 'JavaScript 对比', link: '/Python基础/JavaScript对比.html' },
            { text: '数据类型与类', link: '/Python基础/数据类型与类.html' },
            { text: '解包', link: '/Python基础/解包.html' }
          ]
        }
      ],
      '/Node基础/': [
        {
          text: 'Node 基础',
          items: [
            { text: '总览', link: '/Node基础/' },
            { text: 'Day1', link: '/Node基础/day1/' },
            { text: 'Day2', link: '/Node基础/day2/' }
          ]
        }
      ],
      '/前端/': [
        {
          text: 'Webpack',
          items: [
            { text: '总览', link: '/前端/webpack/' },
            { text: 'Day1', link: '/前端/webpack/day1/' },
            { text: 'Day2', link: '/前端/webpack/day2/' },
            { text: 'Day3', link: '/前端/webpack/day3/' },
            { text: '个人总结', link: '/前端/webpack/个人总结.html' }
          ]
        },
        {
          text: 'Leaflet',
          items: [{ text: '总览', link: '/前端/leaflet/' }]
        }
      ],
      '/后端/': [
        {
          text: '数据库',
          items: [
            { text: '总览', link: '/后端/数据库/' },
            { text: 'Day1', link: '/后端/数据库/day1/' },
            { text: 'Day2', link: '/后端/数据库/day2/' },
            { text: 'Day3', link: '/后端/数据库/day3/' },
            { text: '总结', link: '/后端/数据库/总结.html' }
          ]
        }
      ],
      '/运维/': [
        {
          text: 'Docker',
          items: [
            { text: '总览', link: '/运维/docker/' },
            { text: 'Day1', link: '/运维/docker/day1/' },
            { text: 'Day2', link: '/运维/docker/day2/' },
            { text: 'Day3', link: '/运维/docker/day3/' }
          ]
        }
      ],
      '/CICD/': [
        {
          text: 'GitHub Actions CI/CD',
          items: [
            { text: '总览', link: '/CICD/' },
            { text: 'Day1', link: '/CICD/day1/' },
            { text: 'Day2', link: '/CICD/day2/' },
            { text: 'Day3', link: '/CICD/day3/' }
          ]
        }
      ],
      '/': [
        {
          text: '学习入口',
          items: [
            { text: '首页', link: '/' },
            { text: 'Python 基础', link: '/Python基础/' },
            { text: 'Node 基础', link: '/Node基础/' },
            { text: 'Webpack', link: '/前端/webpack/' },
            { text: '数据库', link: '/后端/数据库/' },
            { text: 'Docker', link: '/运维/docker/' },
            { text: 'CI/CD', link: '/CICD/' }
          ]
        }
      ]
    },
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
