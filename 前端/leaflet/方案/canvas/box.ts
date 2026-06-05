/**
 * rbush筛选后再进行射线法判断
 */
// 圆形边界内部
export function insideCircle(point: [number, number], circle: [number, number], radius: number): boolean {
  const [px, py] = point;
  const [cx, cy] = circle;
  return (px - cx) * (px - cx) + (py - cy) * (py - cy) <= radius * radius;
}
// 辅助函数：判断点是否在线段上
export function isPointOnSegment(p: [number, number], a: [number, number], b: [number, number]): boolean {
  const [px, py] = p;
  const [ax, ay] = a;
  const [bx, by] = b;
  // 点的坐标在seg的包围盒内，且向量叉积为0（共线）
  return Math.min(ax, bx) <= px && px <= Math.max(ax, bx) && Math.min(ay, by) <= py && py <= Math.max(ay, by) && Math.abs((bx - ax) * (py - ay) - (by - ay) * (px - ax)) < 1e-6; // 浮点数精度容错
}
/**几何内部 */
export function insidePolygon(point: [number, number], polygon: [number, number][]): boolean {
  const [px, py] = point;
  const n = polygon.length;
  let count = 0;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = polygon[i];
    const [x2, y2] = polygon[(i + 1) % n]; // 闭合边

    // 点在边上（简化判断）
    if (isPointOnSegment(point, [x1, y1], [x2, y2])) return true;

    // 射线与边相交判断
    if (((y1 < py && y2 >= py) || (y2 < py && y1 >= py)) && x1 + ((py - y1) / (y2 - y1)) * (x2 - x1) > px) {
      count++;
    }
  }
  return count % 2 === 1;
}
export function createABBoxFactory(points: [number, number][]): ABBox;
export function createABBoxFactory(points: [number, number], hitRange: number): ABBox;
export function createABBoxFactory(points: [number, number][] | [number, number], hitRange?: number): ABBox {
  let box = new ABBox();
  if (Array.isArray(points[0])) {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    (points as [number, number][]).forEach((point) => {
      const [x, y] = point;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
    box.updateRbush({ minX, minY, maxX, maxY });
  } else {
    points = points as [number, number];
    hitRange = hitRange ?? 0;
    box.updateRbush({ minX: points[0] - hitRange, minY: points[1] - hitRange, maxX: points[0] + hitRange, maxY: points[1] + hitRange });
  }
  return box;
}
export class ABBox<T = any> {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  minX: number = -1;
  minY: number = -1;
  maxX: number = -1;
  maxY: number = -1;
  data?: T;
  isEmpty: boolean;
  /**碰撞盒子 多边形 */
  boxPolygon: [number, number][] = [];
  /**碰撞盒子 圆形*/
  radius: number = -1;
  /**安全范围补偿 */
  saveRange: number = 0;
  constructor(data?: T, saveRange = 0) {
    this.saveRange = saveRange;
    this.data = data;
    this.isEmpty = true;
    this.setEmpty();
  }
  get rbush() {
    return { minX: this.minX, minY: this.minY, maxX: this.maxX, maxY: this.maxY, data: this.data };
  }
  setEmpty() {
    this.minX = Infinity;
    this.minY = Infinity;
    this.maxX = -Infinity;
    this.maxY = -Infinity;
    this.isEmpty = true;
  }
  updatePolygon(polygon: [number, number][]) {
    this.boxPolygon = polygon;
    const { rbush } = createABBoxFactory(polygon);
    this.updateRbush(rbush);
    this.radius = -1;
  }
  updateRadius(center: [number, number], radius: number) {
    this.radius = radius;
    const { rbush } = createABBoxFactory(center, radius);
    this.updateRbush({...rbush, data: this.data});
    this.boxPolygon = [];
  }
  updateRbush(rbush?: { minX: number; minY: number; maxX: number; maxY: number; data?: any }) {
    const { minX, minY, maxX, maxY, data } = rbush || { minX: this.minX, minY: this.minY, maxX: this.maxX, maxY: this.maxY, data: this.data };
    this.minX = minX - this.saveRange;
    this.minY = minY - this.saveRange;
    this.maxX = maxX + this.saveRange;
    this.maxY = maxY + this.saveRange;
    this.width = this.maxX - this.minX;
    this.height = this.maxY - this.minY;
    this.x = this.maxX - this.width / 2;
    this.y = this.maxY - this.height / 2;
    this.data = data ?? this.data;
    this.isEmpty = false;
    return this;
  }
  /**合并多个aabb */
  mergeABBox(abox: ABBox[] | ABBox) {
    const compare = ({ minX, minY, maxX, maxY }: { minX: number; minY: number; maxX: number; maxY: number }) => {
      this.minX = Math.min(this.minX, minX);
      this.minY = Math.min(this.minY, minY);
      this.maxX = Math.max(this.maxX, maxX);
      this.maxY = Math.max(this.maxY, maxY);
      this.updateRbush();
    };
    if (abox instanceof Array) {
      abox.forEach(compare);
    } else {
      compare(abox);
    }
    return this;
  }
  /**
   * 根据聚合特性构造更详细的包围盒 射线法计算有无在内部
   * 挖空形状不支持
   */
  isHit(x: number, y: number, hitRange: number = 0) {
    const baseHit = x >= this.minX - hitRange && x <= this.maxX + hitRange && y >= this.minY - hitRange && y <= this.maxY + hitRange;
    if (baseHit && this.boxPolygon.length > 0) {
      return insidePolygon([x, y], this.boxPolygon);
    } else if (baseHit && this.radius > 0) {
      return insideCircle([x, y], [this.x, this.y], this.radius);
    } else {
      return baseHit;
    }
  }
  /**检测盒子是否相交 */
  intersects(abox: { minX: number; minY: number; maxX: number; maxY: number }) {
    return abox.minX < this.maxX && abox.maxX > this.minX && abox.minY < this.maxY && abox.maxY > this.minY;
  }
  clone() {
    const cloneElement = new ABBox().updateRbush(this.rbush);
    cloneElement.radius = this.radius;
    cloneElement.boxPolygon = this.boxPolygon;
    return cloneElement;
  }
}
