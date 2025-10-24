/**
 * Vue3 菜单状态管理 Composable
 */
import type { Ref } from 'vue';
export interface MenuState {
    expandedKeys: Set<string | number>;
    activeKey: string | number | null;
    collapsed: boolean;
}
export declare function useMenuState(initialState?: Partial<MenuState>): {
    expandedKeys: Ref<Set<string | number> & Omit<Set<string | number>, keyof Set<any>>, Set<string | number> | (Set<string | number> & Omit<Set<string | number>, keyof Set<any>>)>;
    activeKey: Ref<string | number, string | number>;
    collapsed: Ref<boolean, boolean>;
    isExpanded: (itemId: string | number) => boolean;
    isActive: (itemId: string | number) => boolean;
    expand: (itemId: string | number) => void;
    collapse: (itemId: string | number) => void;
    toggleExpand: (itemId: string | number) => void;
    setActive: (itemId: string | number | null) => void;
    toggleCollapsed: () => void;
    reset: () => void;
};
