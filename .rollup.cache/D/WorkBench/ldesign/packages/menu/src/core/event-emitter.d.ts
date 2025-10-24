/**
 * 事件发射器
 */
type EventHandler = (...args: any[]) => void;
/**
 * 事件发射器类
 */
export declare class EventEmitter {
    private events;
    /**
     * 注册事件监听器
     */
    on(event: string, handler: EventHandler): () => void;
    /**
     * 注册一次性事件监听器
     */
    once(event: string, handler: EventHandler): () => void;
    /**
     * 移除事件监听器
     */
    off(event: string, handler?: EventHandler): void;
    /**
     * 触发事件
     */
    emit(event: string, ...args: any[]): void;
    /**
     * 获取事件监听器数量
     */
    listenerCount(event: string): number;
    /**
     * 获取所有事件名称
     */
    eventNames(): string[];
    /**
     * 清除所有事件监听器
     */
    removeAllListeners(event?: string): void;
}
export {};
