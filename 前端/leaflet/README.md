# leaflet轻量开源的2D地图渲染引擎

- 默认EPSG:4326投影，wgs84坐标系。天地图天然支持不需要任何投影变更。
- 底图偏移，百度、高德、谷歌都有各自偏移，需要转化 解决方案使用图层偏移计算[gridlayer.ts](./core/gridlayer.ts)
    - 谷歌本身是4326但是国内区域是gcj02和高德一样
- 自定义图层[canvas.ts](./core/canvas.ts)
- Angular 使用leaflet性能不好原因是，ngzone本身全局事件监测，所以鼠标移动、图层缩放都会导致组件不断触发更新
