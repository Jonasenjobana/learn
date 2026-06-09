import * as L from "leaflet";
import rbush from "rbush";
import { ABBox } from "./canvas/box";
import { EventDispatch } from "./canvas/event";
import { AnimeTick } from "./canvas/tick";
export interface SLCanvasRenderTick {
  time: number;
  delta: number;
}
export interface SLCanvasRenderTool {
  ctx: CanvasRenderingContext2D;
  map: L.Map;
  layer: SLCanvasLayer;
  /** animeLoop 图层渲染时的动画时间 */
  tick?: SLCanvasRenderTick;
}
export interface SLCanvasTextRenderTool extends SLCanvasRenderTool {
  box: ABBox;
}
export interface SLCanvasRenderResult {
  hitBoxes?: ABBox[];
  textBoxes?: ABBox[];
}
export interface SLCanvasLayerEvent {
  rawEvent: L.LeafletMouseEvent;
  layer: SLCanvasLayer;
  hits: ABBox[];
}
/** 当前全局 hover / active 命中状态 */
export interface SLCanvasHoverState {
  layer: SLCanvasLayer | null;
  hits: ABBox[];
}
/** 鼠标命中的单个候选对象，用于重叠元素轮选 */
export interface SLCanvasHitCandidate {
  layer: SLCanvasLayer;
  box: ABBox;
}
/** 待渲染文字任务，保留原始 textBox，不重新计算文本位置 */
interface SLCanvasTextTask {
  layer: SLCanvasLayer;
  box: ABBox;
  index: number;
}
export interface SLCanvasOption {
  level?: number;
  textLevel?: number;
  pane?: string;
  className?: string;
  /** 是否参与 hitBoxes 交互命中 */
  interactive?: boolean;
  textOverlap?: boolean;
  /** 命中后的鼠标样式，默认 pointer */
  cursor?: string | ((event: SLCanvasLayerEvent) => string);
  /** 同一图层内多个元素命中时的排序 */
  hitSort?: (a: ABBox, b: ABBox) => number;
  /** 用于 hover/active 持久状态的主键 */
  getBoxKey?: (box: ABBox) => string | number;
  event?: Record<string, (e: SLCanvasLayerEvent) => void>;
  animeLoop?: boolean;
  render: (tool: SLCanvasRenderTool) => SLCanvasRenderResult | void;
  renderText?: (tool: SLCanvasTextRenderTool) => void;
}
export class SLMapLayerManager extends EventDispatch {
  constructor(public map: L.Map) {
    super();
    this.initEventMap();
    this.initEvent("on");
    this.tickDispatcher.anime(this.animeRenderTask);
    this.tickDispatcher.start();
  }
  readonly dispatchEventName: string[] = ["moveend", "resize", "mousedown", "mouseup", "click", "mousemove", "zoomend", "zoomstart", "unload"];
  dispatchEventMap: Map<string, (e: any) => void> = new Map();
  tickDispatcher: AnimeTick = new AnimeTick();
  canvasLayerMap: Map<string, SLCanvasLayer> = new Map();
  cursor: string = "default";
  hoverState: SLCanvasHoverState = { layer: null, hits: [] };
  activeState: SLCanvasHoverState = { layer: null, hits: [] };
  private renderTick: SLCanvasRenderTick = { time: performance.now(), delta: 0 };
  checkCollapse() {}
  initEventMap() {
    this.dispatchEventName.forEach((name) => {
      this.dispatchEventMap.set(name, (e: any) => this.fire(name, e));
    });
  }
  initEvent(flag: "on" | "off") {
    const InteractiveEvent = ["mousemove", "click", "mousedown"];
    const RerenderEvent = ["moveend", "resize"];
    this.dispatchEventName.forEach((name) => {
      this.map[flag](name, this.dispatchEventMap.get(name)!);
    });
    RerenderEvent.forEach((name) => {
      this.map[flag](name, this.layerRenderTask);
    });
    InteractiveEvent.forEach((name) => {
      this.map[flag](name, this.interactiveTask);
    });
  }
  layerRenderTask = () => {
    // 主体渲染按 level 从低到高，保证高 level 图层后绘制、视觉在上方。
    const sortLayerList = this.getActiveLayers().sort((a, b) => this.getLayerLevel(a) - this.getLayerLevel(b));
    sortLayerList.forEach((layer) => {
      layer.setRenderTick(this.renderTick);
      layer.onReset();
    });
    this.renderTextTask();
  };
  animeRenderTask = (tick: SLCanvasRenderTick) => {
    // 当前文字仍绘制在各图层 canvas 上，动画帧统一重绘可避免静态文字反复叠画。
    if (!this.getActiveLayers().some((layer) => layer.option.animeLoop)) return;
    this.renderTick = tick;
    this.layerRenderTask();
  };
  renderTextTask = () => {
    // 普通文字参与 rbush 避让；hover/active 文字最后叠加绘制，不影响其他文字布局。
    const textRBush = new rbush();
    this.getActiveLayers().forEach((layer) => layer.setVisibleTextBoxes([]));
    const visibleTextBoxMap = new Map<SLCanvasLayer, ABBox[]>();
    const textTasks = this.getActiveLayers()
      .filter((layer) => layer.option.textOverlap)
      .reduce((tasks: SLCanvasTextTask[], layer) => {
        layer.textBoxes.forEach((box, index) => {
          if (!box || box.isEmpty) return;
          tasks.push({ layer, box, index });
        });
        return tasks;
      }, []);
    textTasks.sort((a, b) => this.compareTextTask(a, b)).forEach(({ layer, box }) => {
      const rbushBox = { ...box.rbush, data: box };
      if (textRBush.search(rbushBox).length > 0) return;
      textRBush.insert(rbushBox);
      this.pushVisibleTextBox(visibleTextBoxMap, layer, box);
      layer.onRenderText(box);
    });
    textTasks
      .filter((task) => this.getTextStateLevel(task) > 0)
      .sort((a, b) => {
        const stateDiff = this.getTextStateLevel(a) - this.getTextStateLevel(b);
        if (stateDiff !== 0) return stateDiff;
        return this.compareTextTask(a, b);
      })
      .forEach(({ layer, box }) => {
        // hover/active 文本相当于 overlay，直接最后绘制，不写入 textRBush。
        this.pushVisibleTextBox(visibleTextBoxMap, layer, box);
        layer.onRenderText(box);
      });
    visibleTextBoxMap.forEach((boxes, layer) => {
      layer.setVisibleTextBoxes(boxes);
    });
  };
  private pushVisibleTextBox(visibleTextBoxMap: Map<SLCanvasLayer, ABBox[]>, layer: SLCanvasLayer, box: ABBox) {
    const visibleTextBoxes = visibleTextBoxMap.get(layer) || [];
    if (visibleTextBoxes.some((visibleBox) => layer.getBoxKey(visibleBox) === layer.getBoxKey(box))) return;
    visibleTextBoxes.push(box);
    visibleTextBoxMap.set(layer, visibleTextBoxes);
  }
  interactiveTask = (event: L.LeafletEvent) => {
    const mouseEvent = event as L.LeafletMouseEvent;
    if (!mouseEvent || !mouseEvent.containerPoint) return;
    const x = mouseEvent.containerPoint.x;
    const y = mouseEvent.containerPoint.y;
    const candidates = this.searchHitCandidates(x, y);
    const topCandidate = candidates[0];
    const topLayer = topCandidate?.layer || null;
    const topHits = topCandidate ? [topCandidate.box] : [];
    const layerEvent = topLayer ? this.createLayerEvent(mouseEvent, topLayer, topHits) : null;
    this.setCursor(layerEvent ? this.getHitCursor(layerEvent) : "");
    if (mouseEvent.type === "mousemove") {
      this.updateHoverState(mouseEvent, topLayer, topHits);
    }
    if (mouseEvent.type === "click") {
      const activeCandidate = this.getNextActiveCandidate(candidates);
      this.updateActiveState(mouseEvent, activeCandidate?.layer || null, activeCandidate ? [activeCandidate.box] : []);
      if (activeCandidate) {
        const activeEvent = this.createLayerEvent(mouseEvent, activeCandidate.layer, [activeCandidate.box]);
        activeCandidate.layer.option.event?.click?.(activeEvent);
      }
      return;
    }
    if (layerEvent) {
      topLayer?.option.event?.[mouseEvent.type]?.(layerEvent);
    }
  };
  createCanvasLayer(name: string, option: SLCanvasOption) {
    if (this.canvasLayerMap.has(name)) {
      return this.canvasLayerMap.get(name)!;
    }
    const layer = new SLCanvasLayer(option);
    this.canvasLayerMap.set(name, layer);
    return layer;
  }
  addCanvasLayer(name: string) {
    const layer = this.canvasLayerMap.get(name);
    if (layer) {
      if (this.map.hasLayer(layer)) {
        return;
      }
      this.map.addLayer(layer);
      this.layerRenderTask();
    }
  }
  removeCanvasLayer(name: string) {
    const layer = this.canvasLayerMap.get(name);
    if (layer) {
      if (!this.map.hasLayer(layer)) {
        return;
      }
      this.map.removeLayer(layer);
      this.canvasLayerMap.delete(name);
      this.layerRenderTask();
    }
  }
  /** 隐藏图层（保留记录，可随时 show 恢复） */
  hideCanvasLayer(name: string) {
    const layer = this.canvasLayerMap.get(name);
    if (layer && this.map.hasLayer(layer)) {
      this.map.removeLayer(layer);
      this.layerRenderTask();
    }
  }
  /** 显示之前隐藏的图层 */
  showCanvasLayer(name: string) {
    const layer = this.canvasLayerMap.get(name);
    if (layer && !this.map.hasLayer(layer)) {
      this.map.addLayer(layer);
      this.layerRenderTask();
    }
  }
  /** 触发重绘（外部数据变更后调用） */
  redrawCanvasLayer(name?: string) {
    if (name) {
      const layer = this.canvasLayerMap.get(name);
      if (layer && this.map.hasLayer(layer)) {
        layer.onReset();
        this.renderTextTask();
      }
      return;
    }
    this.layerRenderTask();
  }
  clearActiveState(layer?: SLCanvasLayer) {
    // 指定 layer 时只清理该图层的 active，避免误清其他业务图层选中态。
    if (layer && this.activeState.layer !== layer) return;
    if (!this.activeState.layer) return;
    this.activeState.layer.setActiveBoxes([]);
    this.activeState = { layer: null, hits: [] };
    this.layerRenderTask();
  }
  private getActiveLayers() {
    return [...this.canvasLayerMap.values()].filter((layer) => this.map.hasLayer(layer));
  }
  private getLayerLevel(layer: SLCanvasLayer) {
    return layer.option.level || 0;
  }
  private getLayerTextLevel(layer: SLCanvasLayer) {
    return layer.option.textLevel || 0;
  }
  private compareTextTask(a: SLCanvasTextTask, b: SLCanvasTextTask) {
    const levelDiff = this.getLayerLevel(b.layer) - this.getLayerLevel(a.layer);
    if (levelDiff !== 0) return levelDiff;
    const textLevelDiff = this.getLayerTextLevel(b.layer) - this.getLayerTextLevel(a.layer);
    if (textLevelDiff !== 0) return textLevelDiff;
    if (a.layer === b.layer) return a.index - b.index;
    return 0;
  }
  private getTextStateLevel(task: SLCanvasTextTask) {
    if (task.layer.isActive(task.box)) return 2;
    if (task.layer.isHover(task.box)) return 1;
    return 0;
  }
  private getInteractiveLayers() {
    return this.getActiveLayers()
      .filter((layer) => layer.option.interactive)
      .sort((a, b) => this.getLayerLevel(b) - this.getLayerLevel(a));
  }
  private searchHitCandidates(x: number, y: number): SLCanvasHitCandidate[] {
    // 生成完整命中栈：图层按 level 高优先，图层内部顺序交给 searchHit / hitSort。
    return this.getInteractiveLayers().reduce((candidates: SLCanvasHitCandidate[], layer) => {
      const layerHits = layer.searchHit(x, y);
      layerHits.forEach((box: any) => candidates.push({ layer, box }));
      return candidates;
    }, []);
  }
  private getNextActiveCandidate(candidates: SLCanvasHitCandidate[]) {
    // 重叠轮选：如果当前 active 仍在鼠标命中栈中，则切换到下一个候选。
    if (candidates.length === 0) return null;
    const activeIndex = candidates.findIndex((candidate) => {
      return candidate.layer === this.activeState.layer && this.activeState.hits.some((box) => candidate.layer.getBoxKey(box) === candidate.layer.getBoxKey(candidate.box));
    });
    return candidates[activeIndex >= 0 ? (activeIndex + 1) % candidates.length : 0];
  }
  private setCursor(cursor: string) {
    this.cursor = cursor;
    this.applyCursor(cursor);
  }
  private applyCursor(cursor: string) {
    // Leaflet 拖拽态会给容器/图层加 grab，cursor 要同步写到 canvas 才能稳定覆盖。
    const elements = [this.map.getContainer(), ...this.getActiveLayers().map((layer) => layer.getCanvasElement())];
    elements.forEach((element) => {
      if (!element) return;
      if (cursor) {
        element.style.setProperty("cursor", cursor, "important");
      } else {
        element.style.removeProperty("cursor");
      }
    });
  }
  private createLayerEvent(rawEvent: L.LeafletMouseEvent, layer: SLCanvasLayer, hits: ABBox[]): SLCanvasLayerEvent {
    return { rawEvent, layer, hits };
  }
  private getHitCursor(event: SLCanvasLayerEvent) {
    const { cursor = "pointer" } = event.layer.option;
    return typeof cursor === "function" ? cursor(event) : cursor;
  }
  private updateHoverState(event: L.LeafletMouseEvent, layer: SLCanvasLayer | null, hits: ABBox[]) {
    // hover 只在命中对象变化时触发，避免 mousemove 高频重绘。
    const nextState = { layer, hits };
    if (!this.isStateChanged(this.hoverState, nextState)) return;
    const prevState = this.hoverState;
    prevState.layer?.setHoverBoxes([]);
    if (prevState.layer) {
      prevState.layer.option.event?.mouseleave?.(this.createLayerEvent(event, prevState.layer, prevState.hits));
    }
    layer?.setHoverBoxes(hits);
    if (layer) {
      layer.option.event?.mouseenter?.(this.createLayerEvent(event, layer, hits));
    }
    this.hoverState = nextState;
    this.layerRenderTask();
  }
  private updateActiveState(event: L.LeafletMouseEvent, layer: SLCanvasLayer | null, hits: ABBox[]) {
    // active 默认由 click 维护；点击空白处会清空 active。
    const nextState = { layer, hits };
    if (!this.isStateChanged(this.activeState, nextState)) return;
    this.activeState.layer?.setActiveBoxes([]);
    layer?.setActiveBoxes(hits);
    this.activeState = nextState;
    this.layerRenderTask();
  }
  private isStateChanged(prev: SLCanvasHoverState, next: SLCanvasHoverState) {
    if (prev.layer !== next.layer) return true;
    if (prev.hits.length !== next.hits.length) return true;
    const prevKeys = prev.layer ? prev.hits.map((box) => prev.layer!.getBoxKey(box)).join("|") : "";
    const nextKeys = next.layer ? next.hits.map((box) => next.layer!.getBoxKey(box)).join("|") : "";
    return prevKeys !== nextKeys;
  }
}
export class SLCanvasLayer extends L.Layer {
  constructor(public option: SLCanvasOption) {
    super({ pane: option.pane || "sl-pane" });
    const { render, renderText } = option;
    this.render = render;
    this.renderText = renderText;
  }
  hitBoxes: ABBox[] = [];
  textBoxes: ABBox[] = [];
  visibleTextBoxes: ABBox[] = [];
  hoverBoxes: ABBox[] = [];
  activeBoxes: ABBox[] = [];
  hitRBush = new rbush();
  private hoverKeys: Set<string> = new Set();
  private activeKeys: Set<string> = new Set();
  private defaultKeyIndex = 0;
  private defaultObjectKeyMap: WeakMap<object, string> = new WeakMap();
  protected canvas: HTMLCanvasElement = document.createElement("canvas");
  protected ctx: CanvasRenderingContext2D = this.canvas.getContext("2d")!;
  protected render: (tool: SLCanvasRenderTool) => SLCanvasRenderResult | void;
  protected renderText?: (tool: SLCanvasTextRenderTool) => void;
  private renderTick: SLCanvasRenderTick = { time: performance.now(), delta: 0 };
  protected get map() {
    return this._map;
  }
  onAdd(map: L.Map) {
    this.initCanvas();
    if (this.options.pane) {
      const pane = this.getPane();
      if (!pane) {
        map.createPane(this.options.pane);
      }
      this.getPane()!.appendChild(this.canvas);
    }
    this.onReset();
    this.fire("add");
    return this;
  }
  onRemove(map: L.Map) {
    if (this.options.pane) {
      this.getPane()?.removeChild(this.canvas);
    } else {
      map.getPanes().overlayPane.removeChild(this.canvas);
    }
    this.fire("remove");
    return this;
  }
  onRender(): SLCanvasRenderResult {
    this.clearContext();
    const result = this.render({ ctx: this.ctx, map: this.map, layer: this, tick: this.renderTick }) || {};
    this.hitBoxes = result.hitBoxes || [];
    this.textBoxes = result.textBoxes || [];
    this.rebuildHitRBush();
    return { hitBoxes: this.hitBoxes, textBoxes: this.textBoxes };
  }
  setRenderTick(tick: SLCanvasRenderTick) {
    this.renderTick = tick;
  }
  onRenderText(box: ABBox) {
    this.renderText?.({ ctx: this.ctx, map: this.map, layer: this, box });
  }
  searchHit(x: number, y: number) {
    const hits = this.hitRBush
      .search({ minX: x, minY: y, maxX: x, maxY: y })
      .map((item: any) => item.data as ABBox)
      .filter((box: ABBox) => box.isHit(x, y));
    return this.option.hitSort ? hits.sort(this.option.hitSort) : hits;
  }
  setVisibleTextBoxes(boxes: ABBox[]) {
    this.visibleTextBoxes = boxes;
  }
  setHoverBoxes(boxes: ABBox[]) {
    this.hoverBoxes = boxes;
    this.hoverKeys = new Set(boxes.map((box) => this.getBoxKey(box)));
  }
  setActiveBoxes(boxes: ABBox[]) {
    this.activeBoxes = boxes;
    this.activeKeys = new Set(boxes.map((box) => this.getBoxKey(box)));
  }
  getCanvasElement() {
    return this.canvas;
  }
  isHover(dataOrBox: any) {
    return this.hoverKeys.has(this.getStateKey(dataOrBox));
  }
  isActive(dataOrBox: any) {
    return this.activeKeys.has(this.getStateKey(dataOrBox));
  }
  getBoxKey(box: ABBox) {
    const key = this.option.getBoxKey ? this.option.getBoxKey(box) : this.getDefaultBoxKey(box);
    return key + "";
  }
  onReset() {
    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this.canvas, topLeft);
    var size = this._map.getSize();
    this.canvas.width = size.x;
    this.canvas.height = size.y;
    return this.onRender();
  }
  protected clearContext() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  protected rebuildHitRBush() {
    this.hitRBush.clear();
    const rbushList = this.hitBoxes.filter((box) => box && !box.isEmpty).map((box) => ({ ...box.rbush, data: box }));
    if (rbushList.length) {
      this.hitRBush.load(rbushList);
    }
  }
  private getStateKey(dataOrBox: any) {
    if (dataOrBox && typeof dataOrBox.isHit === "function" && dataOrBox.rbush) {
      return this.getBoxKey(dataOrBox as ABBox);
    }
    return this.option.getBoxKey ? this.option.getBoxKey(new ABBox(dataOrBox)) + "" : this.getDefaultValueKey(dataOrBox);
  }
  private getDefaultBoxKey(box: ABBox) {
    return this.getDefaultValueKey(box.data ?? box);
  }
  private getDefaultValueKey(value: any) {
    // 框架层不假设 id/mmsi/name 等业务字段；未配置 getBoxKey 时仅按对象身份兜底。
    if (value === null || value === undefined) return "";
    if (typeof value !== "object" && typeof value !== "function") return `${typeof value}:${value}`;
    const objectValue = value as object;
    const cachedKey = this.defaultObjectKeyMap.get(objectValue);
    if (cachedKey) return cachedKey;
    const key = `object:${++this.defaultKeyIndex}`;
    this.defaultObjectKeyMap.set(objectValue, key);
    return key;
  }

  /** 初始化 canvas，并挂到 Leaflet 缩放体系中 */
  protected initCanvas() {
    this.canvas = L.DomUtil.create("canvas", this.option.className);
    var originProp = "" + L.DomUtil.testProp(["transformOrigin", "WebkitTransformOrigin", "msTransformOrigin"]);
    this.canvas.style[originProp] = "50% 50%";
    var size = this._map.getSize();
    this.canvas.width = size.x;
    this.canvas.height = size.y;
    this.canvas.style.zIndex = this.option.level ? this.option.level + "" : "100";
    this.ctx = this.canvas.getContext("2d")!;
    var animated = this._map.options.zoomAnimation && L.Browser.any3d;
    L.DomUtil.addClass(this.canvas, "leaflet-zoom-" + (animated ? "animated" : "hide"));
  }
}
