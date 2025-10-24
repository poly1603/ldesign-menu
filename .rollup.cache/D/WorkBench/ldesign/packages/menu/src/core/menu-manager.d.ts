/**
 * 菜单管理器 - 核心类
 */
import type { MenuConfig, MenuItem } from '../types';
import { EventEmitter } from './event-emitter';
/**
 * 菜单管理器类
 */
export declare class MenuManager extends EventEmitter {
    private config;
    private container;
    private items;
    private expandedKeys;
    private activeKey;
    private collapsed;
    private itemStates;
    private layoutEngine;
    private popupManager;
    private animationController;
    private eventDelegator;
    private virtualScroller;
    constructor(config?: MenuConfig);
    /**
     * 挂载到容器
     */
    mount(containerOrSelector: HTMLElement | string): void;
    /**
     * 渲染菜单
     */
    private render;
    /**
     * 获取容器类名
     */
    private getContainerClasses;
    /**
     * 更新容器样式
     */
    private updateContainerStyles;
    /**
     * 渲染菜单项列表
     */
    private renderMenuItems;
    /**
     * 渲染单个菜单项
     */
    private renderMenuItem;
    /**
     * 处理菜单项点击
     */
    private handleItemClick;
    /**
     * 处理菜单项悬停
     */
    private handleItemHover;
    /**
     * 处理键盘导航
     */
    private handleKeyboardNav;
    /**
     * 展开菜单项
     */
    expand(itemId: string | number): void;
    /**
     * 收起菜单项
     */
    collapse(itemId: string | number): void;
    /**
     * 切换展开状态
     */
    toggleExpand(itemId: string | number): void;
    /**
     * 选中菜单项
     */
    selectItem(itemId: string | number): void;
    /**
     * 显示子菜单 Popup
     */
    private showSubmenuPopup;
    /**
     * 切换收起状态
     */
    toggleCollapsed(): void;
    /**
     * 设置收起状态
     */
    setCollapsed(collapsed: boolean): void;
    /**
     * 更新菜单项
     */
    setItems(items: MenuItem[]): void;
    /**
     * 更新配置
     */
    updateConfig(config: Partial<MenuConfig>): void;
    /**
     * 获取菜单项的父级 ID
     */
    private getItemParents;
    /**
     * 获取同级菜单项 ID
     */
    private getSiblingIds;
    /**
     * 卸载
     */
    unmount(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
