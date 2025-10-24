/**
 * 菜单配置类型
 */
import type { MenuItem } from './menu';
/**
 * 菜单模式
 */
export type MenuMode = 'horizontal' | 'vertical';
/**
 * 主题类型
 */
export type MenuTheme = 'light' | 'dark' | 'auto';
/**
 * 展开模式
 */
export type ExpandMode = 'hover' | 'click' | 'auto';
/**
 * 子菜单触发方式
 */
export type SubmenuTrigger = 'popup' | 'inline';
/**
 * 响应式收起模式（横向菜单）
 */
export type CollapseMode = 'more' | 'scroll';
/**
 * Popup 定位
 */
export type PopupPlacement = 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';
/**
 * 动画类型
 */
export type AnimationType = 'fade' | 'slide' | 'zoom' | 'none' | string;
/**
 * 菜单配置接口
 */
export interface MenuConfig {
    /** 菜单模式 */
    mode?: MenuMode;
    /** 主题 */
    theme?: MenuTheme;
    /** 菜单数据 */
    items?: MenuItem[];
    /** 展开模式 */
    expandMode?: ExpandMode;
    /** 子菜单触发方式 */
    submenuTrigger?: SubmenuTrigger;
    /** 收起模式（仅 vertical） */
    collapsed?: boolean;
    /** 默认展开的菜单项 ID */
    defaultExpandedKeys?: (string | number)[];
    /** 默认激活的菜单项 ID */
    defaultActiveKey?: string | number;
    /** 手风琴模式（同级只能展开一个） */
    accordion?: boolean;
    /** 菜单宽度 */
    width?: string | number;
    /** 收起时的宽度 */
    collapsedWidth?: string | number;
    /** 子菜单缩进（px） */
    indent?: number;
    /** 菜单项高度（px） */
    itemHeight?: number;
    /** Popup 偏移量 */
    popupOffset?: number;
    /** 启用虚拟滚动 */
    virtualScroll?: boolean;
    /** 虚拟滚动阈值 */
    virtualThreshold?: number;
    /** 懒加载子菜单 */
    lazyLoad?: boolean;
    /** 启用动画 */
    animation?: boolean;
    /** 动画类型 */
    animationType?: AnimationType;
    /** 动画持续时间（ms） */
    animationDuration?: number;
    /** 动画缓动函数 */
    animationEasing?: string;
    /** 启用响应式 */
    responsive?: boolean;
    /** 收起模式 */
    collapseMode?: CollapseMode;
    /** 响应式断点（px） */
    breakpoint?: number;
    /** 启用键盘导航 */
    keyboardNavigation?: boolean;
    /** 选择菜单项时触发 */
    onSelect?: (item: MenuItem, event?: Event) => void;
    /** 展开菜单项时触发 */
    onExpand?: (item: MenuItem) => void;
    /** 收起菜单项时触发 */
    onCollapse?: (item: MenuItem) => void;
    /** 菜单项点击时触发 */
    onClick?: (item: MenuItem, event: Event) => void;
    /** 菜单收起/展开状态变化时触发 */
    onCollapsedChange?: (collapsed: boolean) => void;
}
/**
 * 默认配置
 */
export declare const DEFAULT_MENU_CONFIG: Required<Omit<MenuConfig, 'items' | 'onSelect' | 'onExpand' | 'onCollapse' | 'onClick' | 'onCollapsedChange'>>;
