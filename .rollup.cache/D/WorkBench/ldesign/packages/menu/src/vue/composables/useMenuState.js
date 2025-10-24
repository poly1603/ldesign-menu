/**
 * Vue3 菜单状态管理 Composable
 */
import { ref } from 'vue';
export function useMenuState(initialState = {}) {
    const expandedKeys = ref(new Set(initialState.expandedKeys || []));
    const activeKey = ref(initialState.activeKey || null);
    const collapsed = ref(initialState.collapsed || false);
    // 检查菜单项是否展开
    const isExpanded = (itemId) => {
        return expandedKeys.value.has(itemId);
    };
    // 检查菜单项是否激活
    const isActive = (itemId) => {
        return activeKey.value === itemId;
    };
    // 展开菜单项
    const expand = (itemId) => {
        expandedKeys.value.add(itemId);
    };
    // 收起菜单项
    const collapse = (itemId) => {
        expandedKeys.value.delete(itemId);
    };
    // 切换展开状态
    const toggleExpand = (itemId) => {
        if (isExpanded(itemId)) {
            collapse(itemId);
        }
        else {
            expand(itemId);
        }
    };
    // 设置激活项
    const setActive = (itemId) => {
        activeKey.value = itemId;
    };
    // 切换收起状态
    const toggleCollapsed = () => {
        collapsed.value = !collapsed.value;
    };
    // 重置状态
    const reset = () => {
        expandedKeys.value.clear();
        activeKey.value = null;
        collapsed.value = false;
    };
    return {
        expandedKeys,
        activeKey,
        collapsed,
        isExpanded,
        isActive,
        expand,
        collapse,
        toggleExpand,
        setActive,
        toggleCollapsed,
        reset,
    };
}
//# sourceMappingURL=useMenuState.js.map