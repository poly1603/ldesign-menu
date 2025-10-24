/**
 * 事件发射器
 */
/**
 * 事件发射器类
 */
export class EventEmitter {
    constructor() {
        this.events = new Map();
    }
    /**
     * 注册事件监听器
     */
    on(event, handler) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(handler);
        // 返回取消监听的函数
        return () => this.off(event, handler);
    }
    /**
     * 注册一次性事件监听器
     */
    once(event, handler) {
        const wrappedHandler = (...args) => {
            handler(...args);
            this.off(event, wrappedHandler);
        };
        return this.on(event, wrappedHandler);
    }
    /**
     * 移除事件监听器
     */
    off(event, handler) {
        if (!handler) {
            // 移除所有该事件的监听器
            this.events.delete(event);
            return;
        }
        const handlers = this.events.get(event);
        if (handlers) {
            handlers.delete(handler);
            if (handlers.size === 0) {
                this.events.delete(event);
            }
        }
    }
    /**
     * 触发事件
     */
    emit(event, ...args) {
        const handlers = this.events.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(...args);
                }
                catch (error) {
                    console.error(`Error in event handler for "${event}":`, error);
                }
            });
        }
    }
    /**
     * 获取事件监听器数量
     */
    listenerCount(event) {
        return this.events.get(event)?.size || 0;
    }
    /**
     * 获取所有事件名称
     */
    eventNames() {
        return Array.from(this.events.keys());
    }
    /**
     * 清除所有事件监听器
     */
    removeAllListeners(event) {
        if (event) {
            this.events.delete(event);
        }
        else {
            this.events.clear();
        }
    }
}
//# sourceMappingURL=event-emitter.js.map