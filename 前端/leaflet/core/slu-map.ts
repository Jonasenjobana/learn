import * as L from 'leaflet';
let a = 6378245.0;
let pi = 3.1415926535897932384626;
let ee = 0.00669342162296594323;
let x_pi = pi * 3000.0 / 180.0;
let R = 6378137;
/**地图工具类 */
export class SLUMap {
  private static transformLat(x: number, y: number) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
        return ret;
  }
  private static transformLng(x: number, y: number) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
        return ret;
  }
  private static transform(lng: number, lat: number) {
        var dLat = SLUMap.transformLat(lng - 105.0, lat - 35.0);
        var dLng = SLUMap.transformLng(lng - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * pi;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
        dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
        var mgLat = lat + dLat;
        var mgLng = lng + dLng;
        var newCoord = {
            lng: mgLng,
            lat: mgLat
        };
        return newCoord;
  }
  /** 测算两点与Y轴形成的角度大小（Y轴方向 ↑ ）
   * @param latLngA 第一个点的[纬度，经度]
   * @param latLngB 第二个点的[纬度，经度]
   * @param type=0  0天地图  1高德地图
   * @returns 两点与正北方的角度
   */
  static getAngle(map: L.Map, latLngA: [number, number], latLngB: [number, number]): number {
    let [y0, x0] = SLUMap.transformLatLngToPoint(map, latLngA),
      [y1, x1] = SLUMap.transformLatLngToPoint(map, latLngB);
    let θ = Math.atan2(x1 - x0, y1 - y0);
    θ = (θ * 180) / Math.PI;
    θ = 90 + θ < 0 ? 450 + θ : 90 + θ;
    return θ;
  }
  /**获取相对角度 第一个点为原点
   * @param map 当前的地图
   * @param latLngA 第一个点的[纬度，经度]
   * @param latLngB 第二个点的[纬度，经度]
   */
  static getRelativeAngle(map: L.Map, latLngA: [number, number], latLngB: [number, number]) {
    let [x0, y0] = SLUMap.transformLatLngToPoint(map, latLngA),
    [x1, y1] = SLUMap.transformLatLngToPoint(map, latLngB);
    let θ = Math.atan2(y1 - y0, x1 - x0) - Math.PI / 2;
    θ = ((θ * 180) / Math.PI + 360) % 360;
    return θ; 
  }
  /** 得到坐标系点位
   * @param map 当前的地图
   * @param latlng [纬度,经度]
   * @returns latlng有效时返回 [x,y] , 无效时返回 [0,0]
   */
  static transformLatLngToPoint(map: L.Map, latlng: [number, number] | undefined): [number, number] {
    if (!latlng) return [0, 0];
    let [lat = 0, lng = 0] = latlng,
      p: any | L.Point;
    let _map: any = map;
    if (_map.latLngToContainerPoint) {
      p = _map.latLngToContainerPoint([lat, lng]);
    } else {
      p = _map.lngLatToContainer([lng, lat]);
    }
    return [p.x, p.y];
  }
   /** 判断经纬度是否在中国境内（含海南等近海区域）
     * @param lng 经度 (WGS84)
     * @param lat 纬度 (WGS84)
     * @returns 是否在中国境内
     */
    static isInChina(lng: number, lat: number): boolean {
        return (
            lng >= 72.004 &&
            lng <= 137.8347 &&
            lat >= 0.8293 &&
            lat <= 55.8271
        );
    }
    /** 百度转84 */
    static tobd09ps84(lng: number, lat: number) {
        var gcj02 = SLUMap.tobd09cj02(lng, lat);
        var map84 = SLUMap.togcj02gps84(gcj02.lng, gcj02.lat);
        return map84;
    }
    /** 84转百度 */
    static togps84bd09(lng: number, lat: number) {
        var gcj02 = SLUMap.togps84gcj02(lng, lat);
        var bd09 = SLUMap.togcj02bd09(gcj02.lng, gcj02.lat);
        return bd09;
    }
    /** 84转火星 */
    static togps84gcj02(lng: number, lat: number) {
        var dLat = SLUMap.transformLat(lng - 105.0, lat - 35.0);
        var dLng = SLUMap.transformLng(lng - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * pi;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
        dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
        var mgLat = lat + dLat;
        var mgLng = lng + dLng;
        var newCoord = {
            lng: mgLng,
            lat: mgLat
        };
        return newCoord;
    }
    /** 火星转84 */
    static togcj02gps84(lng: number, lat: number) {
        var coord = SLUMap.transform(lng, lat);
        var lontitude = lng * 2 - coord.lng;
        var latitude = lat * 2 - coord.lat;
        var newCoord = {
            lng: lontitude,
            lat: latitude
        };
        return newCoord;
    }
    /** 火星转百度 */
    static togcj02bd09(lng: number, lat: number) {
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        var newCoord = {
            lng: bd_lng,
            lat: bd_lat
        };
        return newCoord;
    }
    /** 百度转火星 */
    static tobd09cj02(bd_lng: number, bd_lat: number) {
        var x = bd_lng - 0.0065;
        var y = bd_lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        var newCoord = {
            lng: gg_lng,
            lat: gg_lat
        };
        return newCoord;
    }
}
