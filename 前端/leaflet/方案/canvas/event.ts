type EventListener<T> = {
  cb: (args: T) => void;
  once: boolean;
  that?: unknown;
};

export class EventDispatch<E extends Record<string, any> = Record<string, void>> {
  // 事件存储结构: Map<事件名, 监听器列表>
  private events: Map<keyof E, Array<EventListener<E[keyof E]>>>;

  constructor() {
    this.events = new Map();
  }

  /**
   * 注册事件监听器
   * @param event 事件名称
   * @param cb 回调函数
   * @returns 取消订阅函数
   */
  on<K extends keyof E>(event: K, cb: (args: E[K]) => void, that?: unknown): () => void {
    return this.addListener(event, cb, false, that);
  }

  /**
   * 移除事件监听器
   * @param event 事件名称
   * @param cb 要移除的回调函数，不传则移除该事件下所有监听器
   * @param that 指定上下文时，只移除同回调且同上下文的监听器
   */
  off<K extends keyof E>(event: K, cb?: (args: E[K]) => void, that?: unknown): void {
    const eventList = this.getListeners(event);
    if (eventList.length === 0) return;

    if (!cb) {
      this.events.delete(event);
      return;
    }

    const remaining = eventList.filter((item) => item.cb !== cb || (that !== undefined && item.that !== that));
    this.setListeners(event, remaining);
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 传递给回调的参数
   */
  fire<K extends keyof E>(event: K, args?: E[K]): void {
    const eventList = this.getListeners(event);
    if (eventList.length === 0) return;

    // 复制一份当前回调列表（防止触发中修改原数组）
    const callbacks = [...eventList];
    callbacks.forEach((listener) => {
      try {
        // 执行回调并绑定上下文
        listener.cb.call(listener.that, args as E[K]);
      } finally {
        if (listener.once) {
          this.removeListener(event, listener);
        }
      }
    });
  }

  /**
   * 注册一次性事件监听器（触发后自动移除）
   * @param event 事件名称
   * @param cb 回调函数
   * @returns 取消订阅函数
   */
  once<K extends keyof E>(event: K, cb: (args: E[K]) => void, that?: unknown): () => void {
    return this.addListener(event, cb, true, that);
  }

  /**
   * 清除所有事件监听器，传入事件名时只清除该事件
   */
  clear<K extends keyof E>(event?: K): void {
    if (event !== undefined) {
      this.events.delete(event);
      return;
    }
    this.events.clear();
  }

  private addListener<K extends keyof E>(event: K, cb: (args: E[K]) => void, once: boolean, that?: unknown): () => void {
    if (typeof cb !== "function") {
      throw new TypeError("回调必须是函数类型");
    }

    const listener: EventListener<E[K]> = { cb, once, that };
    const eventList = this.getListeners(event);
    eventList.push(listener);
    this.setListeners(event, eventList);

    return () => this.removeListener(event, listener);
  }

  private getListeners<K extends keyof E>(event: K): Array<EventListener<E[K]>> {
    return (this.events.get(event) || []) as Array<EventListener<E[K]>>;
  }

  private setListeners<K extends keyof E>(event: K, listeners: Array<EventListener<E[K]>>): void {
    if (listeners.length === 0) {
      this.events.delete(event);
      return;
    }
    this.events.set(event, listeners as Array<EventListener<E[keyof E]>>);
  }

  private removeListener<K extends keyof E>(event: K, listener: EventListener<E[K]>): void {
    const eventList = this.getListeners(event);
    const index = eventList.indexOf(listener);
    if (index === -1) return;
    eventList.splice(index, 1);
    this.setListeners(event, eventList);
  }
}
