# Day1：最小三维场景与动画循环

这一阶段用于跑通 Three.js 的第一个可视化示例。你会创建一个带光照的旋转立方体，并理解 Three.js 项目中最重要的三件事：场景、相机和渲染器。

## 学习目标

学完 Day1 后，你应该能：

- 使用 Vite 启动一个 Three.js 示例项目。
- 创建 `Scene`、`PerspectiveCamera` 和 `WebGLRenderer`。
- 使用几何体、材质和网格创建一个可见物体。
- 添加环境光与方向光，让物体有基础明暗变化。
- 使用 `requestAnimationFrame` 编写动画循环。
- 处理窗口尺寸变化，保持画面比例正确。

## 文件说明

- [练习题](./练习题.md)
- [入口页面](./index.html)
- [示例代码](./src/main.js)
- [页面样式](./src/style.css)
- [项目配置](./package.json)

## 推荐学习方式

1. 先阅读本 README，理解每个文件负责什么。
2. 执行安装与启动命令，把示例跑起来。
3. 打开 `src/main.js`，对照页面观察每段代码的效果。
4. 修改立方体颜色、旋转速度和相机位置。
5. 完成 [练习题](./练习题.md)，确认自己能独立调整场景。

## 入口命令

当前示例使用 npm。首次运行前进入本目录：

```bash
cd 前端/threejs/day1
npm install
npm run dev
```

构建生产产物：

```bash
npm run build
```

本示例不会在文档生成时自动安装依赖，需要你在学习时手动执行 `npm install`。

## Day1 重点提醒

### 1. Three.js 的基础搭建顺序

最小 Three.js 页面通常按这个顺序写：

1. 创建场景 `Scene`。
2. 创建相机 `Camera`，决定从哪里看。
3. 创建渲染器 `WebGLRenderer`，决定画到哪里。
4. 创建物体 `Mesh`，放进场景。
5. 添加灯光。
6. 编写动画循环，每一帧更新并重新渲染。

可以把它理解为：

- `Scene`：舞台。
- `Camera`：观察舞台的眼睛。
- `Renderer`：把舞台画到浏览器里的画笔。
- `Mesh`：由几何体和材质组成的可见物体。

### 2. 为什么需要相机位置

Three.js 的默认坐标原点是 `(0, 0, 0)`。如果相机和立方体都在原点，相机就会贴在物体内部，画面很可能不符合预期。

Day1 示例把相机放在：

```js
camera.position.set(2.5, 2, 4);
camera.lookAt(0, 0, 0);
```

这表示相机从右上前方看向原点。

### 3. 为什么要设置画布尺寸

渲染器需要知道当前窗口宽高：

```js
renderer.setSize(window.innerWidth, window.innerHeight);
```

窗口变化时，还要更新相机比例和渲染器尺寸，否则画面会被拉伸。

### 4. 动画循环做了什么

`requestAnimationFrame` 会在浏览器准备绘制下一帧时调用回调。Day1 示例每一帧都做两件事：

- 改变立方体旋转角度。
- 调用 `renderer.render(scene, camera)` 重新绘制。

## 建议练习

- 把立方体颜色改成你喜欢的颜色。
- 调整 `camera.position`，观察近看、远看、俯视和侧视的区别。
- 修改 `cube.rotation.x` 与 `cube.rotation.y` 的速度。
- 把 `BoxGeometry` 的参数改成不同长宽高，做成长方体。
- 尝试注释掉灯光，观察材质显示效果有什么变化。

## 常见问题

### 1. 页面是空白的

优先检查：

- 是否执行了 `npm install`。
- 是否通过 `npm run dev` 启动，而不是直接双击 `index.html`。
- 浏览器控制台是否有报错。
- 相机是否看向物体。
- 物体是否已经 `scene.add(cube)`。

### 2. 立方体看起来没有立体感

检查是否添加了灯光，以及材质是否使用会响应光照的类型，例如 `MeshStandardMaterial`。如果使用 `MeshBasicMaterial`，它不受灯光影响。

### 3. 调整窗口后画面变形

检查是否监听了 `resize`，并同时更新：

- `camera.aspect`
- `camera.updateProjectionMatrix()`
- `renderer.setSize(...)`
