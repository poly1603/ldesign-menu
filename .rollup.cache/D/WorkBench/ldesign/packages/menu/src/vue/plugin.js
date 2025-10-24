/**
 * Vue3 插件
 */
import Menu from './components/Menu.vue';
export const MenuPlugin = {
    install(app, options = {}) {
        const { prefix = 'L', defaultConfig = {} } = options;
        // 注册组件
        app.component(`${prefix}Menu`, Menu);
        // 提供全局配置
        app.provide('menu-default-config', defaultConfig);
    },
};
export default MenuPlugin;
//# sourceMappingURL=plugin.js.map