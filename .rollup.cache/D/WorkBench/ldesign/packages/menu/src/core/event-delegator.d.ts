/**
 * 事件委托器
 */
/**
 * 事件委托器配置
 */
export interface EventDelegatorConfig {
    onItemClick?: (itemId: string | number, event: MouseEvent) => void;
    onItemHover?: (itemId: string | number, event: MouseEvent) => void;
    onItemFocus?: (itemId: string | number, event: FocusEvent) => void;
    onItemBlur?: (itemId: string | number, event: FocusEvent) => void;
    onKeyboardNav?: (key: string, itemId: string | number, event: KeyboardEvent) => void;
}
/**
 * 事件委托器类
 */
export declare class EventDelegator {
    private container;
    private config;
    private keyboardEnabled;
    constructor(config?: EventDelegatorConfig);
    /**
     * 绑定容器
     */
    attach(container: HTMLElement): void;
    /**
     * 解绑容器
     */
    detach(): void;
    /**
     * 处理点击事件
     */
    private handleClick;
    /**
     * 处理鼠标进入事件
     */
    private handleMouseEnter;
    /**
     * 处理鼠标离开事件
     */
    private handleMouseLeave;
    /**
     * 处理聚焦事件
     */
    private handleFocus;
    /**
     * 处理失焦事件
     */
    private handleBlur;
    /**
     * 处理键盘事件
     */
    private handleKeydown;
    /**
     * 启用键盘导航
     */
    enableKeyboard(): void;
    /**
     * 禁用键盘导航
     */
    disableKeyboard(): void;
    /**
     * 更新配置
     */
    updateConfig(config: Partial<EventDelegatorConfig>): void;
    /**
     * 销毁
     */
    destroy(): void;
}
