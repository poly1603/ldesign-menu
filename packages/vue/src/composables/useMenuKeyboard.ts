/**
 * 菜单键盘导航 Composable
 * 提供完整的键盘导航支持
 * @module composables/useMenuKeyboard
 */

import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'
import type { MenuItem } from '../types'
import { findItemByKey, flattenItems, hasChildren, isDisabled } from '../types'

/**
 * 键盘导航配置
 */
export interface UseMenuKeyboardOptions {
  /**
   * 菜单项数据
   */
  items: Ref<MenuItem[]>

  /**
   * 当前选中的 key
   */
  selectedKey: Ref<string | undefined>

  /**
   * 当前展开的 keys
   */
  openKeys: Ref<string[]>

  /**
   * 选中回调
   */
  onSelect: (key: string) => void

  /**
   * 展开/收起回调
   */
  onToggleOpen: (key: string) => void

  /**
   * 是否启用键盘导航
   * @default true
   */
  enabled?: boolean

  /**
   * 菜单容器元素
   */
  containerRef?: Ref<HTMLElement | null>
}

/**
 * 菜单键盘导航
 * 支持方向键、Enter、Esc、Home、End 等按键
 * @param options - 配置选项
 */
export function useMenuKeyboard(options: UseMenuKeyboardOptions) {
  const {
    items,
    selectedKey,
    openKeys,
    onSelect,
    onToggleOpen,
    enabled = true,
    containerRef,
  } = options

  // 当前焦点项
  const focusedKey = ref<string | undefined>(selectedKey.value)

  /**
   * 获取所有可见的菜单项（扁平化）
   */
  function getVisibleItems(): MenuItem[] {
    const allItems = flattenItems(items.value)
    return allItems.filter((item) => {
      // 过滤掉禁用和隐藏的项
      if (isDisabled(item) || item.type === 'divider') {
        return false
      }

      // 检查父级是否展开
      if (item.parentKey) {
        return openKeys.value.includes(item.parentKey)
      }

      return true
    })
  }

  /**
   * 获取下一个可聚焦的项
   */
  function getNextItem(currentKey: string | undefined): string | undefined {
    const visibleItems = getVisibleItems()
    if (visibleItems.length === 0) return undefined

    if (!currentKey) {
      return visibleItems[0].key
    }

    const currentIndex = visibleItems.findIndex(item => item.key === currentKey)
    if (currentIndex === -1) {
      return visibleItems[0].key
    }

    const nextIndex = (currentIndex + 1) % visibleItems.length
    return visibleItems[nextIndex].key
  }

  /**
   * 获取上一个可聚焦的项
   */
  function getPrevItem(currentKey: string | undefined): string | undefined {
    const visibleItems = getVisibleItems()
    if (visibleItems.length === 0) return undefined

    if (!currentKey) {
      return visibleItems[visibleItems.length - 1].key
    }

    const currentIndex = visibleItems.findIndex(item => item.key === currentKey)
    if (currentIndex === -1) {
      return visibleItems[visibleItems.length - 1].key
    }

    const prevIndex = currentIndex === 0 ? visibleItems.length - 1 : currentIndex - 1
    return visibleItems[prevIndex].key
  }

  /**
   * 处理键盘事件
   */
  function handleKeyDown(event: KeyboardEvent): void {
    if (!enabled) return

    const { key } = event

    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        focusedKey.value = getNextItem(focusedKey.value)
        break

      case 'ArrowUp':
        event.preventDefault()
        focusedKey.value = getPrevItem(focusedKey.value)
        break

      case 'ArrowRight': {
        event.preventDefault()
        if (focusedKey.value) {
          const item = findItemByKey(items.value, focusedKey.value)
          if (item && hasChildren(item) && !openKeys.value.includes(focusedKey.value)) {
            onToggleOpen(focusedKey.value)
          }
        }
        break
      }

      case 'ArrowLeft': {
        event.preventDefault()
        if (focusedKey.value) {
          const item = findItemByKey(items.value, focusedKey.value)
          if (item && hasChildren(item) && openKeys.value.includes(focusedKey.value)) {
            onToggleOpen(focusedKey.value)
          }
        }
        break
      }

      case 'Enter':
      case ' ': // 空格键
        event.preventDefault()
        if (focusedKey.value) {
          onSelect(focusedKey.value)
        }
        break

      case 'Escape':
        event.preventDefault()
        // 关闭所有展开的子菜单
        if (focusedKey.value) {
          const item = findItemByKey(items.value, focusedKey.value)
          if (item && hasChildren(item) && openKeys.value.includes(focusedKey.value)) {
            onToggleOpen(focusedKey.value)
          }
        }
        break

      case 'Home':
        event.preventDefault()
        {
          const visibleItems = getVisibleItems()
          if (visibleItems.length > 0) {
            focusedKey.value = visibleItems[0].key
          }
        }
        break

      case 'End':
        event.preventDefault()
        {
          const visibleItems = getVisibleItems()
          if (visibleItems.length > 0) {
            focusedKey.value = visibleItems[visibleItems.length - 1].key
          }
        }
        break

      default:
        break
    }
  }

  // 挂载和卸载事件监听
  onMounted(() => {
    const container = containerRef?.value || document
    container.addEventListener('keydown', handleKeyDown as EventListener)
  })

  onUnmounted(() => {
    const container = containerRef?.value || document
    container.removeEventListener('keydown', handleKeyDown as EventListener)
  })

  return {
    /**
     * 当前焦点项的 key
     */
    focusedKey,

    /**
     * 设置焦点到指定项
     */
    setFocus: (key: string | undefined) => {
      focusedKey.value = key
    },

    /**
     * 移动到下一项
     */
    focusNext: () => {
      focusedKey.value = getNextItem(focusedKey.value)
    },

    /**
     * 移动到上一项
     */
    focusPrev: () => {
      focusedKey.value = getPrevItem(focusedKey.value)
    },
  }
}


