# Webpack 入门到静态资源指南

> 适合第一次接触 webpack 的前端学习笔记：先理解它解决什么问题，再学会打包 JS、CSS、图片、字体、HTML 和静态目录。

## 1. webpack 是什么

webpack 是一个现代 JavaScript 应用的静态模块打包工具。它会从入口文件开始分析依赖关系，把 JS、CSS、图片、字体等资源按规则处理后输出到构建目录。

可以把它理解为：

- `entry`：从哪里开始找依赖。
- `output`：打包结果放到哪里。
- `loader`：让 webpack 能处理非 JS 文件，比如 CSS、Less、图片。
- `plugin`：参与更复杂的构建流程，比如生成 HTML、清理目录、抽离 CSS。
- `mode`：区分开发环境和生产环境。

## 2. 最小项目结构

```txt
demo-webpack/
├─ package.json
├─ webpack.config.js
├─ public/
│  └─ favicon.ico
└─ src/
   ├─ index.js
   ├─ style.css
   └─ assets/
      └─ logo.png
```

## 3. 安装依赖

> 已有项目要先确认包管理器，下面以 npm 为例。

```bash
npm init -y
npm install -D webpack webpack-cli
```

如果需要本地开发服务器：

```bash
npm install -D webpack-dev-server
```

注意：`webpack-dev-server v5` 要求较新的 Node 环境，官方文档标注为 Node `>= 18.12.0`。老项目如果 Node 版本较低，要么升级 Node，要么锁定兼容版本。

## 4. 第一个 webpack 配置

```js
// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
```

入口文件：

```js
// src/index.js
const title = document.createElement('h1');
title.textContent = 'Hello webpack';
document.body.appendChild(title);
```

构建命令：

```bash
npx webpack
```

推荐写到 `package.json`：

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

之后执行：

```bash
npm run build
```

## 5. 自动生成 HTML

真实项目不建议手写 `dist/index.html`，因为打包文件名可能带 hash。常用 `html-webpack-plugin` 自动注入资源。

```bash
npm install -D html-webpack-plugin
```

```js
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
```

模板文件：

```html
<!-- public/index.html -->
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Webpack Demo</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

## 6. 开发服务器

```js
// webpack.config.js
module.exports = {
  // 省略其他配置
  devServer: {
    static: './dist',
    port: 8080,
    open: true,
    hot: true,
  },
};
```

脚本：

```json
{
  "scripts": {
    "dev": "webpack serve",
    "build": "webpack"
  }
}
```

启动：

```bash
npm run dev
```

常见配置：

- `static`：额外托管静态目录。
- `port`：本地端口。
- `open`：启动后自动打开浏览器。
- `hot`：启用热更新。
- `historyApiFallback`：单页应用刷新路由时回退到首页。
- `proxy`：代理后端 API。

示例：

```js
devServer: {
  static: './dist',
  port: 8080,
  historyApiFallback: true,
  proxy: [
    {
      context: ['/api'],
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  ],
}
```

## 7. 处理 CSS

安装：

```bash
npm install -D css-loader style-loader
```

配置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

使用：

```js
// src/index.js
import './style.css';
```

```css
/* src/style.css */
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
```

### 生产环境抽离 CSS

开发环境常用 `style-loader` 把样式插入页面；生产环境更常用 `mini-css-extract-plugin` 输出独立 CSS 文件。

```bash
npm install -D mini-css-extract-plugin
```

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),
  ],
};
```

## 8. 处理图片、字体等静态资源

webpack 5 推荐使用内置 Asset Modules，不需要再安装 `file-loader`、`url-loader`、`raw-loader` 作为基础方案。

### asset/resource

把文件输出到构建目录，并返回资源 URL。适合大图片、字体、视频等。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[contenthash:8][ext]',
        },
      },
      {
        test: /\.(woff2?|ttf|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash:8][ext]',
        },
      },
    ],
  },
};
```

使用图片：

```js
import logoUrl from './assets/logo.png';

const img = document.createElement('img');
img.src = logoUrl;
document.body.appendChild(img);
```

CSS 中也可以引用：

```css
.logo {
  background-image: url('./assets/logo.png');
}
```

### asset/inline

把资源转成 Data URL 内联进 JS。适合很小的图标。

```js
{
  test: /\.svg$/i,
  type: 'asset/inline',
}
```

### asset/source

把文件内容作为字符串导入。适合原始文本、模板、源码片段。

```js
{
  test: /\.txt$/i,
  type: 'asset/source',
}
```

### asset

自动在 `resource` 和 `inline` 之间选择。可以设置阈值，默认小文件会内联。

```js
{
  test: /\.(png|jpe?g|gif|webp)$/i,
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 8 * 1024,
    },
  },
  generator: {
    filename: 'images/[name].[contenthash:8][ext]',
  },
}
```

## 9. public 静态目录

有些资源不想被 import，也不想参与 hash，例如 `favicon.ico`、固定的第三方配置文件，可以从 `public` 复制到 `dist`。

常用方案是 `copy-webpack-plugin`：

```bash
npm install -D copy-webpack-plugin
```

```js
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
};
```

建议：

- 业务代码里会引用的图片，优先放 `src/assets` 并通过 `import` 或 CSS `url()` 引用。
- 不参与构建、文件名固定的资源，放 `public`。
- `public/index.html` 通常交给 `html-webpack-plugin` 当模板，不要再复制一份到输出目录。

## 10. 区分开发和生产环境

简单项目可以先用一个配置，通过 `mode` 切换：

```js
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
  output: {
    filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
  },
};
```

脚本：

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
}
```

更规范的项目会拆成：

```txt
build/
├─ webpack.common.js
├─ webpack.dev.js
└─ webpack.prod.js
```

然后用 `webpack-merge` 合并配置。

## 11. 完整入门配置示例

```js
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: './src/index.js',
  devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
  output: {
    filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: 'images/[name].[contenthash:8][ext]',
        },
      },
      {
        test: /\.(woff2?|ttf|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash:8][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    ...(isProd
      ? [
          new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
          }),
        ]
      : []),
  ],
  devServer: {
    static: './dist',
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
};
```

## 12. 常见坑

### 1. 为什么图片路径构建后变了

webpack 会根据配置把图片输出到 `dist`，并返回新的 URL。不要在 JS 里手写 `../dist/xxx.png`，应该用 `import logoUrl from './logo.png'`。

### 2. 为什么 CSS 不生效

检查是否安装并配置了 `css-loader` 和 `style-loader`，以及入口 JS 里是否 `import './style.css'`。

### 3. 为什么 dev server 刷新后 404

如果是 Vue Router、React Router 这类前端路由，需要加：

```js
devServer: {
  historyApiFallback: true,
}
```

### 4. webpack 5 还需要 file-loader/url-loader 吗

基础静态资源场景不需要。webpack 5 的 Asset Modules 已经覆盖了输出文件、内联 Data URL、导入源码等常见需求。

### 5. public 和 src/assets 怎么选

如果资源会被组件、JS、CSS 依赖，放 `src/assets`；如果资源只是原样复制并通过固定路径访问，放 `public`。

## 13. 学习路线

1. 先掌握 `entry`、`output`、`mode`，能打包 JS。
2. 加入 `html-webpack-plugin`，让 HTML 自动引用产物。
3. 加入 `webpack-dev-server`，跑通开发环境。
4. 加入 CSS loader，理解 loader 从右到左执行。
5. 用 Asset Modules 处理图片、字体和文本。
6. 区分 `development` 和 `production`。
7. 再学习代码分割、缓存、Tree Shaking、Babel、TypeScript、框架集成。

## 14. 官方文档入口

- webpack Getting Started: <https://webpack.js.org/guides/getting-started/>
- webpack Concepts: <https://webpack.js.org/concepts/>
- Asset Modules: <https://webpack.js.org/guides/asset-modules/>
- Dev Server: <https://webpack.js.org/configuration/dev-server/>
