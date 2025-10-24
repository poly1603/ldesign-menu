/**
 * Vue3 菜单 Composable
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { MenuManager } from '../../core/menu-manager';
export function useMenu(options = {}) {
    const menuRef = ref(null);
    const containerRef = options.container || ref(null);
    const expandedKeys = ref(new Set(options.defaultExpandedKeys || []));
    const activeKey = ref(options.defaultActiveKey || null);
    const collapsed = ref(options.collapsed || false);
    // 初始化菜单
    const initMenu = () => {
        if (!containerRef.value) {
            return;
        }
        const menu = new MenuManager({
            ...options,
            onSelect: (item, event) => {
                activeKey.value = item.id;
                options.onSelect?.(item, event);
            },
            onExpand: (item) => {
                expandedKeys.value.add(item.id);
                options.onExpand?.(item);
            },
            onCollapse: (item) => {
                expandedKeys.value.delete(item.id);
                options.onCollapse?.(item);
            },
            onCollapsedChange: (newCollapsed) => {
                collapsed.value = newCollapsed;
                options.onCollapsedChange?.(newCollapsed);
            },
        });
        menu.mount(containerRef.value);
        menuRef.value = menu;
    };
    // 展开菜单项
    const expand = (itemId) => {
        menuRef.value?.expand(itemId);
    };
    // 收起菜单项
    const collapse = (itemId) => {
        menuRef.value?.collapse(itemId);
    };
    // 切换展开状态
    const toggleExpand = (itemId) => {
        menuRef.value?.toggleExpand(itemId);
    };
    // 选中菜单项
    const selectItem = (itemId) => {
        menuRef.value?.selectItem(itemId);
    };
    // 设置收起状态
    const setCollapsed = (value) => {
        menuRef.value?.setCollapsed(value);
    };
    // 切换收起状态
    const toggleCollapsed = () => {
        menuRef.value?.toggleCollapsed();
    };
    // 更新菜单项
    const setItems = (items) => {
        menuRef.value?.setItems(items);
    };
    // 更新配置
    const updateConfig = (config) => {
        menuRef.value?.updateConfig(config);
    };
    // 监听配置变化
    watch(() => options.items, (newItems) => {
        if (newItems && menuRef.value) {
            menuRef.value.setItems(newItems);
        }
    }, { deep: true });
    // 挂载时初始化
    onMounted(() => {
        initMenu();
    });
    // 卸载时清理
    onBeforeUnmount(() => {
        menuRef.value?.destroy();
    });
    return {
        containerRef,
        menuRef,
        expandedKeys,
        activeKey,
        collapsed,
        expand,
        collapse,
        toggleExpand,
        selectItem,
        setCollapsed,
        toggleCollapsed,
        setItems,
        updateConfig,
    };
}
//# sourceMappingURL=useMenu.js.map