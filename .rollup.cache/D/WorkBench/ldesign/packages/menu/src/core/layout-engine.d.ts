/**
 * 布局引擎
 */
import type { FlatMenuItem, LayoutResult, MenuConfig, MenuItem, Position } from '../types';
/**
 * 布局引擎类
 */
export declare class LayoutEngine {
    private config;
    private items;
    private flatItems;
    private itemPositions;
    constructor(config: MenuConfig);
    /**
     * 设置菜单项
     */
    setItems(items: MenuItem[]): void;
    /**
     * 更新配置
     */
    updateConfig(config: Partial<MenuConfig>): void;
    /**
     * 计算布局
     */
    private calculateLayout;
    /**
     * 计算横向布局
     */
    private calculateHorizontalLayout;
    /**
     * 计算纵向布局
     */
    private calculateVerticalLayout;
    /**
     * 获取布局结果
     */
    getLayout(): LayoutResult;
    /**
     * 获取可见的菜单项
     */
    private getVisibleItems;
    /**
     * 获取总尺寸
     */
    private getTotalSize;
    /**
     * 获取菜单项位置
     */
    getItemPosition(itemId: string | number): Position | undefined;
    /**
     * 计算收起模式的宽度
     */
    getCollapsedWidth(): string;
    /**
     * 计算展开模式的宽度
     */
    getExpandedWidth(): string;
    /**
     * 判断是否需要响应式处理
     */
    shouldResponsive(containerWidth: number): boolean;
    /**
     * 计算响应式菜单项
     */
    calculateResponsiveItems(containerWidth: number): {
        visibleItems: MenuItem[];
        overflowItems: MenuItem[];
    };
    /**
     * 获取扁平化的菜单项
     */
    getFlatItems(): FlatMenuItem[];
}
