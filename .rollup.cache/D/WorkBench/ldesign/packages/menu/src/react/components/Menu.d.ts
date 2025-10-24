/**
 * React 菜单组件
 */
import React from 'react';
import type { MenuConfig, MenuItem } from '../../types';
export interface MenuProps extends Partial<MenuConfig> {
    items?: MenuItem[];
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export interface MenuRef {
    expand: (itemId: string | number) => void;
    collapse: (itemId: string | number) => void;
    toggleExpand: (itemId: string | number) => void;
    selectItem: (itemId: string | number) => void;
    setCollapsed: (collapsed: boolean) => void;
    toggleCollapsed: () => void;
    setItems: (items: MenuItem[]) => void;
    updateConfig: (config: Partial<MenuConfig>) => void;
}
export declare const Menu: any;
