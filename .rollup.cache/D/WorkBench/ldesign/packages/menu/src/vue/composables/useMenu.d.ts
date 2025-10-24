/**
 * Vue3 菜单 Composable
 */
import type { Ref } from 'vue';
import { MenuManager } from '../../core/menu-manager';
import type { MenuConfig, MenuItem } from '../../types';
export interface UseMenuOptions extends MenuConfig {
    container?: Ref<HTMLElement | null>;
}
export declare function useMenu(options?: UseMenuOptions): {
    containerRef: Ref<HTMLElement, HTMLElement>;
    menuRef: Ref<{
        mount: (containerOrSelector: HTMLElement | string) => void;
        expand: (itemId: string | number) => void;
        collapse: (itemId: string | number) => void;
        toggleExpand: (itemId: string | number) => void;
        selectItem: (itemId: string | number) => void;
        toggleCollapsed: () => void;
        setCollapsed: (collapsed: boolean) => void;
        setItems: (items: MenuItem[]) => void;
        updateConfig: (config: Partial<MenuConfig>) => void;
        unmount: () => void;
        destroy: () => void;
        on: (event: string, handler: (...args: any[]) => void) => () => void;
        once: (event: string, handler: (...args: any[]) => void) => () => void;
        off: (event: string, handler?: (...args: any[]) => void) => void;
        emit: (event: string, ...args: any[]) => void;
        listenerCount: (event: string) => number;
        eventNames: () => string[];
        removeAllListeners: (event?: string) => void;
    }, MenuManager | {
        mount: (containerOrSelector: HTMLElement | string) => void;
        expand: (itemId: string | number) => void;
        collapse: (itemId: string | number) => void;
        toggleExpand: (itemId: string | number) => void;
        selectItem: (itemId: string | number) => void;
        toggleCollapsed: () => void;
        setCollapsed: (collapsed: boolean) => void;
        setItems: (items: MenuItem[]) => void;
        updateConfig: (config: Partial<MenuConfig>) => void;
        unmount: () => void;
        destroy: () => void;
        on: (event: string, handler: (...args: any[]) => void) => () => void;
        once: (event: string, handler: (...args: any[]) => void) => () => void;
        off: (event: string, handler?: (...args: any[]) => void) => void;
        emit: (event: string, ...args: any[]) => void;
        listenerCount: (event: string) => number;
        eventNames: () => string[];
        removeAllListeners: (event?: string) => void;
    }>;
    expandedKeys: Ref<Set<string | number> & Omit<Set<string | number>, keyof Set<any>>, Set<string | number> | (Set<string | number> & Omit<Set<string | number>, keyof Set<any>>)>;
    activeKey: Ref<string | number, string | number>;
    collapsed: Ref<boolean, boolean>;
    expand: (itemId: string | number) => void;
    collapse: (itemId: string | number) => void;
    toggleExpand: (itemId: string | number) => void;
    selectItem: (itemId: string | number) => void;
    setCollapsed: (value: boolean) => void;
    toggleCollapsed: () => void;
    setItems: (items: MenuItem[]) => void;
    updateConfig: (config: Partial<MenuConfig>) => void;
};
