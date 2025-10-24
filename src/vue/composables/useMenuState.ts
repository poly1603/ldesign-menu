/**
 * Vue3 菜单状态管理 Composable
 */

import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { MenuItem } from '../../types'

export interface MenuState {
  expandedKeys: Set<string | number>
  activeKey: string | number | null
  collapsed: boolean
}

export function useMenuState(initialState: Partial<MenuState> = {}) {
  const expandedKeys = ref<Set<string | number>>(
    new Set(initialState.expandedKeys || []),
  )
  const activeKey = ref<string | number | null>(
    initialState.activeKey || null,
  )
  const collapsed = ref(initialState.collapsed || false)

  // 检查菜单项是否展开
  const isExpanded = (itemId: string | number) => {
    return expandedKeys.value.has(itemId)
  }

  // 检查菜单项是否激活
  const isActive = (itemId: string | number) => {
    return activeKey.value === itemId
  }

  // 展开菜单项
  const expand = (itemId: string | number) => {
    expandedKeys.value.add(itemId)
  }

  // 收起菜单项
  const collapse = (itemId: string | number) => {
    expandedKeys.value.delete(itemId)
  }

  // 切换展开状态
  const toggleExpand = (itemId: string | number) => {
    if (isExpanded(itemId)) {
      collapse(itemId)
    }
    else {
      expand(itemId)
    }
  }

  // 设置激活项
  const setActive = (itemId: string | number | null) => {
    activeKey.value = itemId
  }

  // 切换收起状态
  const toggleCollapsed = () => {
    collapsed.value = !collapsed.value
  }

  // 重置状态
  const reset = () => {
    expandedKeys.value.clear()
    activeKey.value = null
    collapsed.value = false
  }

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
  }
}


