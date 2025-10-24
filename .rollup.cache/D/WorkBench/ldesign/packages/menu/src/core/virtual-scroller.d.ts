/**
 * 虚拟滚动器
 */
import type { FlatMenuItem, ScrollState } from '../types';
/**
 * 虚拟滚动配置
 */
export interface VirtualScrollerConfig {
    itemHeight: number;
    threshold: number;
    overscan: number;
}
/**
 * 虚拟滚动器类
 */
export declare class VirtualScroller {
    private config;
    private scrollState;
    private items;
    private visibleRange;
    constructor(config?: Partial<VirtualScrollerConfig>);
    /**
     * 设置菜单项
     */
    setItems(items: FlatMenuItem[]): void;
    /**
     * 更新滚动状态
     */
    updateScrollState(state: Partial<ScrollState>): void;
    /**
     * 计算可见范围
     */
    private calculateVisibleRange;
    /**
     * 获取可见范围
     */
    getVisibleRange(): {
        start: number;
        end: number;
    };
    /**
     * 获取可见的菜单项
     */
    getVisibleItems(): FlatMenuItem[];
    /**
     * 获取总高度
     */
    getTotalHeight(): number;
    /**
     * 获取偏移量
     */
    getOffset(): number;
    /**
     * 滚动到指定项
     */
    scrollToItem(index: number): number;
    /**
     * 判断是否需要启用虚拟滚动
     */
    shouldEnable(): boolean;
    /**
     * 更新配置
     */
    updateConfig(config: Partial<VirtualScrollerConfig>): void;
}
