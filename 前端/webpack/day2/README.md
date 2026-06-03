# Day2：静态资源与生产构建

这一阶段不再重复 webpack 最基础的 `entry`、`output`、`mode`。  
如果 Day1 已经能跑通 HTML、JS、CSS 和 dev-server，Day2 的重点就是：让 webpack 像真实项目一样处理图片、字体、文本、public 静态目录，并输出更适合生产环境的文件结构。

## 学习目标

学完 Day2 后，你应该能：

- 理解 webpack 5 的 Asset Modules。
- 会处理图片、SVG、字体、文本等静态资源。
- 能区分 `src/assets` 和 `public` 的使用场景。
- 理解 `contenthash` 对浏览器缓存的作用。
- 能区分开发环境和生产环境的 CSS 处理方式。
- 能看懂一个偏真实项目的 webpack 输出目录。

## 文件说明

- [练习题](./练习题.md)
- [webpack 配置](./webpack.config.js)
- [入口代码](./src/index.js)
- [样式文件](./src/style.css)
- [HTML 模板](./public/index.html)

## 推荐学习方式

1. 先看本 README 的重点提醒。
2. 阅读 [webpack.config.js](./webpack.config.js)，重点看 `module.rules`。
3. 运行 `npm run dev`，观察开发环境效果。
4. 运行 `npm run build`，观察 `dist` 目录结构。
5. 做 [练习题](./练习题.md)，遇到问题再回来看配置。

## Day2 重点提醒

### 1. webpack 5 优先使用 Asset Modules

webpack 5 内置了静态资源处理能力，基础场景不需要再安装 `file-loader`、`url-loader`、`raw-loader`。

常见类型：

- `asset/resource`：输出一个文件，返回文件 URL。
- `asset/inline`：转成 Data URL，直接内联到 JS 里。
- `asset/source`：把文件内容当成字符串导入。
- `asset`：自动在输出文件和内联之间选择。

### 2. 图片一般放在 `src/assets`

如果图片会被 JS 或 CSS 引用，建议放在 `src/assets`。

```js
import heroUrl from './assets/hero.svg';

const img = document.createElement('img');
img.src = heroUrl;
```

这样 webpack 能分析依赖、改文件名、加 hash，并返回最终 URL。

### 3. `public` 适合放不参与打包的文件

例如：

- `favicon.ico`
- 固定名称的配置文件
- 不想被 webpack 改名的静态文件

本示例使用 `copy-webpack-plugin` 把 `public/static` 复制到 `dist/static`。

### 4. `contenthash` 用于长期缓存

生产环境常见写法：

```js
filename: 'js/[name].[contenthash:8].js'
```

文件内容不变，hash 不变；文件内容变化，hash 才变化。  
这样浏览器可以放心缓存旧文件。

### 5. 开发环境和生产环境处理 CSS 不一样

开发环境：

- 使用 `style-loader`
- 改样式刷新快
- CSS 会被 JS 注入页面

生产环境：

- 使用 `mini-css-extract-plugin`
- 输出独立 CSS 文件
- 更适合浏览器缓存

## 本日重点配置

### 图片和 SVG

```js
{
  test: /\.(png|jpe?g|gif|svg|webp)$/i,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 4 * 1024,
    },
  },
  generator: {
    filename: 'images/[name].[contenthash:8][ext]',
  },
}
```

### 字体

```js
{
  test: /\.(woff2?|ttf|eot)$/i,
  type: 'asset/resource',
  generator: {
    filename: 'fonts/[name].[contenthash:8][ext]',
  },
}
```

### 文本源码

```js
{
  test: /\.txt$/i,
  type: 'asset/source',
}
```

## 建议练习

- 把一张图片通过 JS 插入页面。
- 把一张图片通过 CSS `background-image` 使用。
- 改小 `asset` 的 `maxSize`，观察输出目录变化。
- 新增一个 `.txt` 文件并用 `asset/source` 导入。
- 新增一个 `public/static/site.json`，构建后确认它被复制。
- 对比 `npm run dev` 和 `npm run build` 的输出差异。

## 入口命令

```bash
npm install
npm run dev
npm run build
```

如果你已经在 Day1 安装过依赖，Day2 仍建议在当前目录单独执行一次 `npm install`，因为每个 day 都是独立小项目。
