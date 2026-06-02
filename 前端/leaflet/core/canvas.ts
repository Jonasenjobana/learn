import * as L from "leaflet";
export class CanvasLayer extends L.Layer {
  private _canvas!: HTMLCanvasElement;
  private _context!: CanvasRenderingContext2D;
  options: any;
  animationLoop!: number;
  onAdd(map: any) {
    this._map = map;
    if (!this._canvas) this._initCanvas();
    if (this.options.pane) this.getPane()?.appendChild(this._canvas);
    else map._panes.overlayPane.appendChild(this._canvas);
    map.on("moveend", this._reset, this);
    map.on("resize", this._reset, this);
    // map.on('click', this._executeListeners, this);
    // map.on('mousemove', this._executeListeners, this);
    if (map.options.zoomAnimation && L.Browser.any3d) {
      /**缩放动画 */
      map.on("zoomanim", this._animateZoom, this);
    }
    this._reset();
    return this;
  }
  /**初始化画布 */
  private _initCanvas() {
    this._canvas = L.DomUtil.create("canvas", "leaflet-canvas-map leaflet-layer");
    var originProp = "" + L.DomUtil.testProp(["transformOrigin", "WebkitTransformOrigin", "msTransformOrigin"]);
    this._canvas.style[originProp] = "50% 50%";
    var size = this._map.getSize();
    this._canvas.width = size.x;
    this._canvas.height = size.y;
    this._context = this._canvas.getContext("2d")!;
    var animated = this._map.options.zoomAnimation && L.Browser.any3d;
    L.DomUtil.addClass(this._canvas, "leaflet-zoom-" + (animated ? "animated" : "hide"));
  }
  private _animateZoom(e: any) {
    let map: any = this._map;
    var scale = map.getZoomScale(e.zoom),
      offset = map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(map._getMapPanePos());
    L.DomUtil.setTransform(this._canvas, offset, scale);
  }

  private _reset() {
    var topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._canvas, topLeft);
    var size = this._map.getSize();
    this._canvas.width = size.x;
    this._canvas.height = size.y;
    this._redraw();
  }
  protected _redraw() {}
  /**移除时会自动调用 */
  onRemove(map: any) {
    if (this.options.pane) {
      this.getPane()?.removeChild(this._canvas);
    } else {
      map.getPanes().overlayPane.removeChild(this._canvas);
    }
    map.off("moveend", this._reset, this);
    map.off("resize", this._reset, this);
    if (map.options.zoomAnimation) {
      map.off("zoomanim", this._animateZoom, this);
    }
    if (this.animationLoop) cancelAnimationFrame(this.animationLoop);
    return this;
  }
}
