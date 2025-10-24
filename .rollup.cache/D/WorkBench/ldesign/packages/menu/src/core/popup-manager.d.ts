/**
 * Popup 管理器
 */
import type { PopupPlacement } from '../types';
/**
 * Popup 管理器类
 */
export declare class PopupManager {
    private popups;
    private offset;
    private zIndexBase;
    constructor(offset?: number);
    /**
     * 设置全局监听器
     */
    private setupGlobalListeners;
    /**
     * 处理文档点击
     */
    private handleDocumentClick;
    /**
     * 处理文档键盘事件
     */
    private handleDocumentKeydown;
    /**
     * 处理滚动
     */
    private handleScroll;
    /**
     * 处理窗口大小变化
     */
    private handleResize;
    /**
     * 打开 Popup
     */
    open(id: string, triggerElement: HTMLElement, content: HTMLElement | string, placement?: PopupPlacement, onClose?: () => void): HTMLElement;
    /**
     * 更新 Popup 位置
     */
    updatePosition(id: string): void;
    /**
     * 关闭 Popup
     */
    close(id: string): void;
    /**
     * 关闭所有 Popup
     */
    closeAll(): void;
    /**
     * 检查 Popup 是否打开
     */
    isOpen(id: string): boolean;
    /**
     * 获取 Popup 元素
     */
    getPopup(id: string): HTMLElement | undefined;
    /**
     * 设置偏移量
     */
    setOffset(offset: number): void;
    /**
     * 销毁
     */
    destroy(): void;
}
