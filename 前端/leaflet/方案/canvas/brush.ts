export interface CanvasBrushOption {
  // ======================================
  // 基础画笔样式（描边/填充）
  // ======================================
  /** 描边颜色/样式（支持颜色字符串、渐变、图案） */
  strokeColor?: string | CanvasGradient | CanvasPattern;
  /** 填充颜色/样式（支持颜色字符串、渐变、图案） */
  fillColor?: string | CanvasGradient | CanvasPattern;
  /** 全局透明度（0-1，影响所有绘制操作） */
  globalAlpha?: number;

  // ======================================
  // 线条样式配置
  // ======================================
  /** 线宽（像素） */
  lineWidth?: number;
  /** 线条端点样式（默认butt） */
  lineCap?: "butt" | "round" | "square";
  /** 线条连接点样式（默认miter） */
  lineJoin?: "bevel" | "round" | "miter";
  /** 斜接限制（当lineJoin为miter时有效，默认10） */
  miterLimit?: number;
  /** 虚线模式（数组，如[5,3]表示5px实线+3px空白） */
  lineDash?: number[];
  /** 虚线偏移量（正数向右偏移，负数向左） */
  lineDashOffset?: number;

  // ======================================
  // 文本样式配置
  // ======================================
  /** 字体样式（如"bold 16px Arial"，同CSS font） */
  font?: string;
  /** 文本水平对齐方式（默认start） */
  textAlign?: "start" | "end" | "left" | "right" | "center";
  /** 文本垂直对齐方式（默认alphabetic） */
  textBaseline?: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";
  /** 文本方向（默认inherit） */
  direction?: "ltr" | "rtl" | "inherit";
  /** 文本描边颜色（单独控制文本描边，优先级高于strokeColor） */
  textStrokeColor?: string | CanvasGradient | CanvasPattern;
  /** 文本描边宽度（单独控制文本描边宽度） */
  textStrokeWidth?: number;

  // ======================================
  // 阴影效果配置
  // ======================================
  /** 阴影颜色（默认transparent） */
  shadowColor?: string;
  /** 阴影模糊半径（像素，值越大越模糊） */
  shadowBlur?: number;
  /** 阴影水平偏移（像素，正数向右，负数向左） */
  shadowOffsetX?: number;
  /** 阴影垂直偏移（像素，正数向下，负数向上） */
  shadowOffsetY?: number;

  // ======================================
  // 合成与裁剪配置
  // ======================================
  /** 全局合成模式（控制新绘制内容与已有内容的混合方式） */
  globalCompositeOperation?: any;
}

type CanvasBrushResolvedOption = Omit<Required<CanvasBrushOption>, "textStrokeColor" | "textStrokeWidth"> &
  Pick<CanvasBrushOption, "textStrokeColor" | "textStrokeWidth">;

type CanvasBrushContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

class CanvasStyleState {
  readonly defaultOption: CanvasBrushResolvedOption = {
    // 基础画笔
    strokeColor: "#000000",
    fillColor: "#000000",
    globalAlpha: 1,

    // 线条样式
    lineWidth: 1,
    lineCap: "butt",
    lineJoin: "miter",
    miterLimit: 10,
    lineDash: [],
    lineDashOffset: 0,

    // 文本样式
    font: "10px sans-serif",
    textAlign: "start",
    textBaseline: "alphabetic",
    direction: "inherit",
    textStrokeColor: undefined,
    textStrokeWidth: undefined,

    // 阴影效果
    shadowColor: "transparent",
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,

    // 合成模式
    globalCompositeOperation: "source-over",
  };

  currentOption: CanvasBrushResolvedOption;

  constructor(option?: CanvasBrushOption) {
    this.currentOption = this.merge(this.defaultOption, option);
  }

  set(option?: Partial<CanvasBrushOption>) {
    this.currentOption = this.merge(this.currentOption, option);
    return this.currentOption;
  }

  resolve(option?: Partial<CanvasBrushOption>) {
    return this.merge(this.currentOption, option);
  }

  apply(ctx: CanvasBrushContext, option: CanvasBrushResolvedOption = this.currentOption) {
    // 基础画笔样式
    ctx.strokeStyle = option.strokeColor;
    ctx.fillStyle = option.fillColor;
    ctx.globalAlpha = option.globalAlpha;

    // 线条样式
    ctx.lineWidth = option.lineWidth;
    ctx.lineCap = option.lineCap;
    ctx.lineJoin = option.lineJoin;
    ctx.miterLimit = option.miterLimit;
    ctx.setLineDash(option.lineDash);
    ctx.lineDashOffset = option.lineDashOffset;

    // 文本样式
    ctx.font = option.font;
    ctx.textAlign = option.textAlign;
    ctx.textBaseline = option.textBaseline;
    ctx.direction = option.direction;

    // 阴影效果
    ctx.shadowColor = option.shadowColor;
    ctx.shadowBlur = option.shadowBlur;
    ctx.shadowOffsetX = option.shadowOffsetX;
    ctx.shadowOffsetY = option.shadowOffsetY;

    // 合成模式
    ctx.globalCompositeOperation = option.globalCompositeOperation;
  }

  private merge(base: CanvasBrushResolvedOption, option?: Partial<CanvasBrushOption>): CanvasBrushResolvedOption {
    return { ...base, ...option, lineDash: option?.lineDash ? [...option.lineDash] : [...base.lineDash] };
  }
}

class CanvasImageLoader {
  private cache: { [key: string]: Promise<HTMLImageElement> } = {};

  load(url: string): Promise<HTMLImageElement> {
    const cachedTask = this.cache[url];
    if (cachedTask) return cachedTask;

    const task = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = (err) => {
        delete this.cache[url];
        reject(new Error(`图片加载失败: ${url}，原因: ${err}`));
      };
      image.src = url;
    });

    this.cache[url] = task;
    return task;
  }
}

class CanvasPathBuilder {
  static line(ctx: CanvasBrushContext, points: [number, number][]) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
  }

  static polygon(ctx: CanvasBrushContext, points: [number, number][]) {
    this.line(ctx, points);
    ctx.closePath();
  }

  static polygonPath(points: [number, number][]) {
    const path = new Path2D();
    if (points.length === 0) return path;
    path.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      path.lineTo(points[i][0], points[i][1]);
    }
    path.closePath();
    return path;
  }
}

/**笔刷绘制基础图形 */
export class CanvasBrush {
  static ImageSource: { [key: string]: Promise<HTMLImageElement> } = {};
  private static imageLoader = new CanvasImageLoader();
  defaultOption: CanvasBrushResolvedOption;
  currentOption: CanvasBrushResolvedOption;
  ctx: CanvasBrushContext;
  private styleState: CanvasStyleState;
  constructor(canvas: HTMLCanvasElement | OffscreenCanvas, option?: CanvasBrushOption & { willReadFrequently?: boolean }) {
    const { willReadFrequently = false, ...brushOption } = option || {};
    const ctx = canvas.getContext("2d", { willReadFrequently } as any) as CanvasBrushContext | null;
    if (!ctx) throw new Error("Canvas 2D 上下文创建失败");
    this.ctx = ctx;

    // 合并默认配置与用户传入配置（用户配置覆盖默认，未传入则用默认）
    this.styleState = new CanvasStyleState(brushOption);
    this.defaultOption = this.styleState.defaultOption;
    this.currentOption = this.styleState.currentOption;
  }
  save() {
    this.ctx.save();
  }
  restore() {
    this.ctx.restore();
  }
  private withContext(draw: () => void) {
    this.ctx.save();
    try {
      draw();
    } finally {
      this.ctx.restore();
    }
  }
  /**
   * 获取图片资源（带缓存和错误处理）
   * @param url 图片 URL
   * @returns 图片加载 Promise（成功返回 Image 元素，失败 reject）
   */
  getImageSource(url: string): Promise<HTMLImageElement> {
    const cachedTask = CanvasBrush.ImageSource[url];
    if (cachedTask) return cachedTask;
    const task = CanvasBrush.imageLoader.load(url);
    CanvasBrush.ImageSource[url] = task;
    return task.catch((err) => {
      delete CanvasBrush.ImageSource[url];
      throw err;
    });
  }
  clearRect(x?: number, y?: number, width?: number, height?: number) {
    this.ctx.clearRect(x ?? 0, y ?? 0, width ?? this.ctx.canvas.width, height ?? this.ctx.canvas.height);
    return this;
  }
  /**
   * 设置笔刷配置（支持临时绘制）
   * @param option 配置选项（部分覆盖，可选）
   * @param brushDraw 临时绘制回调（仅本次生效，可选）
   */
  setBrushOption(option?: Partial<CanvasBrushOption>, brushDraw?: (brush: CanvasBrush) => void): this {
    if (brushDraw) {
      const previousOption = this.currentOption;
      const tempOption = this.styleState.resolve(option);
      // 临时绘制：应用配置 -> 执行绘制 -> 恢复上下文和配置
      this.withContext(() => {
        this.currentOption = tempOption;
        this.applyTempOption(this.currentOption);
        try {
          brushDraw(this);
        } finally {
          this.currentOption = previousOption;
        }
      });
    } else {
      // 持久化配置：直接应用到上下文
      this.currentOption = this.styleState.set(option);
      this.applyTempOption(this.currentOption);
    }

    return this;
  }

  /**
   * 创建图案填充（支持图片 URL 或元素）
   * @param img 图片 URL 或 Canvas/Video 元素
   * @param repeat 重复模式（默认 'repeat'）
   * @returns 图案对象 Promise（失败返回 null）
   */
  async createPattern(img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | string, repeat: "repeat" | "repeat-x" | "repeat-y" | "no-repeat" = "repeat"): Promise<CanvasPattern | null> {
    try {
      // 处理图片 URL 类型
      if (typeof img === "string") {
        img = await this.getImageSource(img);
      }
      return this.ctx.createPattern(img, repeat) || null;
    } catch (err) {
      console.error("创建图案失败:", err);
      return null;
    }
  }

  /**
   * 应用临时配置到 Canvas 上下文（内部工具方法）
   * @param tempOption 合并后的完整配置
   */
  private applyTempOption(tempOption: CanvasBrushResolvedOption): void {
    this.styleState.apply(this.ctx, tempOption);
  }

  /**
   * 设置裁剪路径（支持自动闭合和手动控制）
   * @param points 裁剪路径顶点（可选）
   * @param clipDraw 裁剪区域内的绘制回调（可选，自动管理上下文）
   */
  clip(points?: [number, number][], clipDraw?: (brush: CanvasBrush) => void): this {
    // 绘制裁剪路径（如果提供了顶点）
    if (points?.length) {
      this.ctx.beginPath();
      this.ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        this.ctx.lineTo(points[i][0], points[i][1]);
      }
      this.ctx.closePath(); // 自动闭合路径
    }

    if (clipDraw) {
      // 自动管理上下文：save -> clip -> 绘制 -> restore
      this.withContext(() => {
        this.ctx.clip();
        clipDraw(this);
      });
    } else {
      // 手动控制：仅执行 clip（需用户自行管理上下文）
      this.ctx.clip();
    }

    return this;
  }

  /**
   * 绘制文本（支持填充和描边）
   * @param text 文本内容
   * @param point 绘制坐标 [x, y]
   * @param option 临时样式配置（可选）
   */
  drawText(text: string, point: [number, number], option?: Partial<CanvasBrushOption>): this {
    this.withContext(() => {
      // 合并配置（当前配置 + 临时配置）
      const tempOption = this.styleState.resolve(option);
      this.applyTempOption(tempOption);
      // 绘制文本描边（仅当配置了描边颜色）
      if (tempOption.textStrokeColor) {
        this.ctx.strokeStyle = tempOption.textStrokeColor;
        this.ctx.lineWidth = tempOption.textStrokeWidth || 1; // 描边宽度兜底
        this.ctx.strokeText(text, point[0], point[1] + 0.5);
      }
      // 绘制文本填充
      this.ctx.fillText(text, point[0], point[1]);
    });
    return this;
  }

  /**
   * 绘制线段
   * @param points 线段顶点数组（至少2个点）
   * @param option 临时样式配置（可选）
   */
  drawLine(points: [number, number][], option?: Partial<CanvasBrushOption>): this {
    if (points.length < 2) return this; // 至少需要2个点

    this.withContext(() => {
      const tempOption = this.styleState.resolve(option);
      this.applyTempOption(tempOption);
      CanvasPathBuilder.line(this.ctx, points);
      this.ctx.stroke();
    });
    return this;
  }
  polygonPath(points: [number, number][]) {
    return CanvasPathBuilder.polygonPath(points);
  }
  /**
   * 绘制多边形
   * @param points 多边形顶点数组（至少3个点）
   * @param ifFill 是否填充（默认 false）
   * @param option 临时样式配置（可选）
   */
  drawPolygon(points: [number, number][], ifFill: boolean = false, option?: Partial<CanvasBrushOption>): this {
    if (points.length < 3) return this; // 至少需要3个点

    this.withContext(() => {
      const tempOption = this.styleState.resolve(option);
      this.applyTempOption(tempOption);
      CanvasPathBuilder.polygon(this.ctx, points);
      if (ifFill) this.ctx.fill();
      this.ctx.stroke();
    });
    return this;
  }

  /**
   * 绘制矩形
   * @param point 左上角坐标 [x, y]
   * @param width 宽度
   * @param height 高度
   * @param ifFill 是否填充（默认 false）
   * @param option 临时样式配置（可选）
   */
  drawRect(point: [number, number], width: number, height: number, ifFill: boolean = false, option?: Partial<CanvasBrushOption>): this {
    const [x, y] = point;
    this.withContext(() => {
      const tempOption = this.styleState.resolve(option);
      this.applyTempOption(tempOption);
      this.ctx.beginPath();
      this.ctx.rect(x, y, width, height);
      if (ifFill) this.ctx.fill();
      this.ctx.stroke();
    });
    return this;
  }

  /**
   * 绘制圆弧
   * @param point 圆心坐标 [x, y]
   * @param radius 半径
   * @param startAngle 起始角度（弧度）
   * @param endAngle 结束角度（弧度）
   * @param ifFill 是否填充（默认 false）
   * @param option 临时样式配置（可选）
   */
  drawArc(point: [number, number], radius: number, startAngle: number, endAngle: number, ifFill: boolean = false, option?: Partial<CanvasBrushOption>): this {
    const [x, y] = point;
    this.withContext(() => {
      const tempOption = this.styleState.resolve(option);
      this.applyTempOption(tempOption);
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, startAngle, endAngle);
      if (ifFill) this.ctx.fill();
      this.ctx.stroke();
    });
    return this;
  }

  /**
   * 绘制圆形（drawArc 的快捷方法）
   * @param point 圆心坐标 [x, y]
   * @param radius 半径
   * @param ifFill 是否填充（默认 false）
   * @param option 临时样式配置（可选）
   */
  drawCircle(point: [number, number], radius: number, ifFill: boolean = false, option?: Partial<CanvasBrushOption>): this {
    return this.drawArc(point, radius, 0, Math.PI * 2, ifFill, option);
  }

  /**
   * 绘制图片（支持裁剪和缩放）
   * @param img 图片 URL 或 Image 元素
   * @param point 目标位置 [x, y]
   * @param size 目标尺寸 [width, height]
   * @param dpoint 源图裁剪起始坐标（可选）
   * @param dsize 源图裁剪尺寸（可选）
   * @returns 绘制完成的 Promise
   */
  async drawImage(img: HTMLImageElement | string, point: [number, number], size: [number, number], dpoint?: [number, number], dsize?: [number, number]): Promise<this> {
    try {
      // 处理图片 URL 类型
      const image = typeof img === "string" ? await this.getImageSource(img) : img;

      // 绘制图片（支持源区域裁剪）
      const [x, y] = point;
      const [w, h] = size;
      this.withContext(() => {
        this.applyTempOption(this.currentOption);
        if (dpoint && dsize) {
          const [dx, dy] = dpoint;
          const [dw, dh] = dsize;
          this.ctx.drawImage(image, dx, dy, dw, dh, x, y, w, h);
        } else {
          this.ctx.drawImage(image, x, y, w, h);
        }
      });
      return this;
    } catch (err) {
      console.error("绘制图片失败:", err);
      return this; // 失败仍返回实例，避免链式调用中断
    }
  }

  /**
   * 设置平移变换（支持临时绘制）
   * @param point 平移坐标 [x, y]
   * @param draw 平移后的绘制回调（可选，自动管理上下文）
   */
  setTranslate(point: [number, number], draw?: (brush: CanvasBrush) => void): this {
    if (draw) {
      this.withContext(() => {
        this.ctx.translate(point[0], point[1]);
        draw(this);
      });
    } else {
      this.ctx.translate(point[0], point[1]);
    }
    return this;
  }

  /**
   * 设置旋转变换（支持临时绘制，角度单位：度）
   * @param angle 旋转角度（度）
   * @param draw 旋转后的绘制回调（可选，自动管理上下文）
   */
  setRotate(angle: number, draw?: (brush: CanvasBrush) => void): this {
    const rad = (angle * Math.PI) / 180; // 转为弧度
    if (draw) {
      this.withContext(() => {
        this.ctx.rotate(rad);
        draw(this);
      });
    } else {
      this.ctx.rotate(rad);
    }
    return this;
  }

  /**
   * 执行自定义绘制逻辑
   * @param draw 自定义绘制回调
   */
  draw(draw: (brush: CanvasBrush) => void): this {
    draw(this);
    return this;
  }
}
