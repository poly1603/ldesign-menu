/**
 * Vue3 插件
 */
import type { App } from 'vue';
import type { MenuConfig } from '../types';
export interface MenuPluginOptions {
    /** 全局默认配置 */
    defaultConfig?: Partial<MenuConfig>;
    /** 组件名称前缀 */
    prefix?: string;
}
export declare const MenuPlugin: {
    install(app: App, options?: MenuPluginOptions): void;
};
export default MenuPlugin;
