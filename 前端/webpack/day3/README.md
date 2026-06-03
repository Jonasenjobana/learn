# Day3：Babel 与代码分割

这一阶段开始接近真实前端项目的构建需求。  
Day1 解决“能打包”，Day2 解决“能处理静态资源和生产输出”，Day3 重点解决两个问题：

- 新语法如何兼容旧浏览器。
- 代码如何按需加载，避免首屏一次性加载太多。

## 学习目标

学完 Day3 后，你应该能：

- 理解 webpack 和 Babel 的分工。
- 使用 `babel-loader` 处理现代 JavaScript 语法。
- 看懂 `@babel/preset-env` 的基础配置。
- 理解 `browserslist` 对兼容目标的影响。
- 使用 `import()` 做动态导入。
- 理解 `optimization.splitChunks` 和 `runtimeChunk` 的作用。
- 能观察构建后的多个 JS chunk。

## 文件说明

- [练习题](./练习题.md)
- [webpack 配置](./webpack.config.js)
- [Babel 配置](./babel.config.js)
- [入口代码](./src/index.js)
- [异步模块](./src/modules/stats.js)
- [样式文件](./src/style.css)
- [HTML 模板](./public/index.html)

## 推荐学习方式

1. 先看 [babel.config.js](./babel.config.js)，理解 Babel 负责什么。
2. 再看 [webpack.config.js](./webpack.config.js)，重点看 JS rule 和 `optimization`。
3. 运行 `npm run dev`，点击页面按钮观察异步模块加载。
4. 运行 `npm run build`，查看 `dist/js` 里生成了几个文件。
5. 做 [练习题](./练习题.md)，重点练动态导入和 chunk 拆分。

## Day3 重点提醒

### 1. webpack 和 Babel 不是一回事

webpack 负责模块打包：

- 从入口开始找依赖。
- 处理 JS、CSS、图片等资源。
- 输出最终构建产物。

Babel 负责 JavaScript 语法转换：

- 把较新的 JS 语法转换成目标浏览器能理解的写法。
- 例如箭头函数、可选链、空值合并等语法。

在 webpack 里，Babel 通常通过 `babel-loader` 接入。

### 2. `babel-loader` 只处理 JS 文件

常见配置：

```js
{
  test: /\.js$/i,
  exclude: /node_modules/,
  use: 'babel-loader',
}
```

注意：

- `exclude: /node_modules/` 很常见，避免处理第三方依赖导致构建变慢。
- Babel 配置一般放在 `babel.config.js` 或 `.babelrc`。

### 3. `@babel/preset-env` 看目标浏览器

示例：

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.5%, last 2 versions, not dead',
      },
    ],
  ],
};
```

目标越旧，Babel 需要转换的内容越多；目标越新，输出代码越接近原始代码。

### 4. `import()` 会产生异步 chunk

普通导入：

```js
import { getScores } from './modules/stats';
```

会进入主包。

动态导入：

```js
const module = await import('./modules/stats');
```

会生成单独的异步文件，只有执行到这里时才加载。

### 5. `splitChunks` 用于拆公共代码

常见生产配置：

```js
optimization: {
  splitChunks: {
    chunks: 'all',
  },
  runtimeChunk: 'single',
}
```

理解方式：

- `splitChunks`：把可复用或较大的模块拆出去。
- `runtimeChunk`：把 webpack 运行时代码单独拆出来，有利于缓存稳定。

## 本日重点配置

### JS 兼容处理

```js
{
  test: /\.js$/i,
  exclude: /node_modules/,
  use: 'babel-loader',
}
```

### 代码分割

```js
optimization: {
  splitChunks: {
    chunks: 'all',
  },
  runtimeChunk: 'single',
}
```

### 动态导入命名

```js
const statsModule = await import(
  /* webpackChunkName: "stats" */
  './modules/stats'
);
```

构建后通常会看到类似：

```txt
dist/
└─ js/
   ├─ main.xxxxxxxx.js
   ├─ runtime.xxxxxxxx.js
   └─ stats.xxxxxxxx.js
```

## 建议练习

- 修改 `babel.config.js` 的 `targets`，观察生产代码差异。
- 新增一个模块，用 `import()` 按需加载。
- 把动态导入改成普通导入，对比构建结果。
- 查看 `dist/js` 里的 chunk 文件名。
- 解释为什么代码分割能优化首屏加载。

## 入口命令

```bash
npm install
npm run dev
npm run build
```

这一天会用到 Babel 相关依赖。当前目录是独立小项目，和 day1/day2 分开安装依赖。
