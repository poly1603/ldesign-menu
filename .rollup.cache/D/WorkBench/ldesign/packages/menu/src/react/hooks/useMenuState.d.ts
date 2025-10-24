/**
 * React 菜单状态管理 Hook
 */
export interface MenuState {
    expandedKeys: Set<string | number>;
    activeKey: string | number | null;
    collapsed: boolean;
}
export declare function useMenuState(initialState?: Partial<MenuState>): {
    expandedKeys: any;
    activeKey: any;
    collapsed: any;
    isExpanded: any;
    isActive: any;
    expand: any;
    collapse: any;
    toggleExpand: any;
    setActive: any;
    setCollapsed: any;
    toggleCollapsed: any;
    reset: any;
};
