/**
 * React 菜单状态管理 Hook
 */
import { useState, useCallback } from 'react';
export function useMenuState(initialState = {}) {
    const [expandedKeys, setExpandedKeys] = useState(new Set(initialState.expandedKeys || []));
    const [activeKey, setActiveKey] = useState(initialState.activeKey || null);
    const [collapsed, setCollapsed] = useState(initialState.collapsed || false);
    // 检查菜单项是否展开
    const isExpanded = useCallback((itemId) => {
        return expandedKeys.has(itemId);
    }, [expandedKeys]);
    // 检查菜单项是否激活
    const isActive = useCallback((itemId) => {
        return activeKey === itemId;
    }, [activeKey]);
    // 展开菜单项
    const expand = useCallback((itemId) => {
        setExpandedKeys(prev => new Set(prev).add(itemId));
    }, []);
    // 收起菜单项
    const collapse = useCallback((itemId) => {
        setExpandedKeys((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
        });
    }, []);
    // 切换展开状态
    const toggleExpand = useCallback((itemId) => {
        if (isExpanded(itemId)) {
            collapse(itemId);
        }
        else {
            expand(itemId);
        }
    }, [isExpanded, expand, collapse]);
    // 设置激活项
    const setActive = useCallback((itemId) => {
        setActiveKey(itemId);
    }, []);
    // 切换收起状态
    const toggleCollapsed = useCallback(() => {
        setCollapsed(prev => !prev);
    }, []);
    // 重置状态
    const reset = useCallback(() => {
        setExpandedKeys(new Set());
        setActiveKey(null);
        setCollapsed(false);
    }, []);
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
        setCollapsed,
        toggleCollapsed,
        reset,
    };
}
//# sourceMappingURL=useMenuState.js.map