/**
 * React 菜单 Hook
 */
import type { MenuConfig, MenuItem } from '../../types';
export interface UseMenuOptions extends MenuConfig {
    container?: HTMLElement | null;
}
export declare function useMenu(options?: UseMenuOptions): {
    containerRef: any;
    menuRef: any;
    expandedKeys: any;
    activeKey: any;
    collapsed: any;
    expand: (itemId: string | number) => void;
    collapse: (itemId: string | number) => void;
    toggleExpand: (itemId: string | number) => void;
    selectItem: (itemId: string | number) => void;
    setCollapsed: (value: boolean) => void;
    toggleCollapsed: () => void;
    setItems: (items: MenuItem[]) => void;
    updateConfig: (config: Partial<MenuConfig>) => void;
};
