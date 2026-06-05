import { EventDispatch } from "./event";

export type AnimeTickEvent = {
  tick: { time: number; delta: number };
};

export class AnimeTick {
  private _fps: number = 30;
  constructor(public mainTick?: AnimeTick) {}
  animeFlag: number | null = null;
  performance: number = performance.now();
  event: EventDispatch<AnimeTickEvent> = new EventDispatch();
  private running: boolean = false;
  private offMainTick?: () => void;

  get fps() {
    return this._fps;
  }

  set fps(value: number) {
    this._fps = Math.max(1, value || 1);
  }

  get timeSpace() {
    return 1000 / this.fps;
  }

  start() {
    this.stop();
    this.running = true;
    this.performance = performance.now();

    if (this.mainTick) {
      this.offMainTick = this.mainTick.event.on("tick", ({ time }) => {
        this.handleFrame(time);
      });
      return this;
    }

    this.animeFlag = requestAnimationFrame(this.loop);
    return this;
  }

  stop() {
    this.running = false;
    if (this.animeFlag !== null) {
      cancelAnimationFrame(this.animeFlag);
      this.animeFlag = null;
    }
    if (this.offMainTick) {
      this.offMainTick();
      this.offMainTick = undefined;
    }
    return this;
  }

  tick(time: number = performance.now()) {
    const delta = time - this.performance;
    this.performance = time;
    this.event.fire("tick", { time, delta });
    return this;
  }

  anime(cb: (config: { time: number; delta: number }) => void) {
    return this.event.on("tick", cb);
  }

  clear() {
    this.stop();
    this.event.clear();
    return this;
  }

  private loop = (time: number) => {
    if (!this.running) return;
    this.handleFrame(time);
    this.animeFlag = requestAnimationFrame(this.loop);
  };

  private handleFrame(time: number) {
    const delta = time - this.performance;
    if (delta < this.timeSpace) return;
    this.performance = time;
    this.event.fire("tick", { time, delta });
  }
}
