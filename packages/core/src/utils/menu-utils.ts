/**
 * 菜单工具函数
 * @module utils/menu-utils
 */

import type { FlatMenuItem, MenuItem, MenuItemPath, MenuSubItem } from '../types'

/**
 * 判断菜单项是否有子项
 * @param item - 菜单项
 * @returns 是否有子项
 */
export function hasChildren(item: MenuItem): item is MenuSubItem {
  return (
    item.type === 'submenu'
    && 'children' in item
    && Array.isArray(item.children)
    && item.children.length > 0
  )
}

/**
 * 判断菜单项是否为分隔线
 * @param item - 菜单项
 * @returns 是否为分隔线
 */
export function isDivider(item: MenuItem): boolean {
  return item.type === 'divider'
}

/**
 * 判断菜单项是否为分组
 * @param item - 菜单项
 * @returns 是否为分组
 */
export function isGroup(item: MenuItem): boolean {
  return item.type === 'group'
}

/**
 * 判断菜单项是否禁用
 * @param item - 菜单项
 * @returns 是否禁用
 */
export function isDisabled(item: MenuItem): boolean {
  return 'disabled' in item && item.disabled === true
}

/**
 * 判断菜单项是否隐藏
 * @param item - 菜单项
 * @returns 是否隐藏
 */
export function isHidden(item: MenuItem): boolean {
  return 'hidden' in item && item.hidden === true
}

/**
 * 获取菜单项的 key
 * @param item - 菜单项
 * @param index - 索引（用于生成默认 key）
 * @returns 菜单项 key
 */
export function getItemKey(item: MenuItem, index: number): string {
  if ('key' in item && item.key) {
    return item.key
  }
  return `menu-item-${index}`
}

/**
 * 根据 key 查找菜单项
 * @param items - 菜单项列表
 * @param key - 要查找的 key
 * @returns 找到的菜单项，未找到返回 undefined
 */
export function findItemByKey(
  items: MenuItem[],
  key: string,
): MenuItem | undefined {
  for (const item of items) {
    if ('key' in item && item.key === key) {
      return item
    }
    if (hasChildren(item)) {
      const found = findItemByKey(item.children, key)
      if (found) {
        return found
      }
    }
    if (isGroup(item) && 'children' in item) {
      const found = findItemByKey((item as MenuSubItem).children, key)
      if (found) {
        return found
      }
    }
  }
  return undefined
}

/**
 * 获取菜单项的路径（从根到目标项）
 * @param items - 菜单项列表
 * @param key - 目标菜单项 key
 * @returns 路径信息，未找到返回 null
 */
export function getItemPath(
  items: MenuItem[],
  key: string,
): MenuItemPath | null {
  const path: MenuItemPath = { keys: [], items: [] }

  function walk(list: MenuItem[], stack: MenuItem[], keyStack: string[]): boolean {
    for (const item of list) {
      if ('key' in item && item.key === key) {
        path.keys = [...keyStack, item.key]
        path.items = [...stack, item]
        return true
      }

      if (hasChildren(item)) {
        const nextStack = [...stack, item]
        const nextKeyStack = [...keyStack, item.key]
        if (walk(item.children, nextStack, nextKeyStack)) {
          return true
        }
      }

      if (isGroup(item) && 'children' in item) {
        const nextStack = [...stack, item]
        const nextKeyStack = 'key' in item ? [...keyStack, item.key] : keyStack
        if (walk((item as MenuSubItem).children, nextStack, nextKeyStack)) {
          return true
        }
      }
    }
    return false
  }

  return walk(items, [], []) ? path : null
}

/**
 * 获取所有父级 key（不包含自身）
 * @param items - 菜单项列表
 * @param key - 目标菜单项 key
 * @returns 父级 key 列表
 */
export function getParentKeys(items: MenuItem[], key: string): string[] {
  const path = getItemPath(items, key)
  if (!path || path.keys.length <= 1) {
    return []
  }
  return path.keys.slice(0, -1)
}

/**
 * 扁平化菜单项
 * @param items - 菜单项列表
 * @returns 扁平化后的菜单项列表
 */
export function flattenItems(items: MenuItem[]): FlatMenuItem[] {
  const result: FlatMenuItem[] = []

  function walk(
    list: MenuItem[],
    level: number,
    parentKey?: string,
    path: string[] = [],
  ): void {
    for (const item of list) {
      const itemKey = 'key' in item ? item.key : undefined
      const currentPath = itemKey ? [...path, itemKey] : path

      result.push({
        item,
        level,
        parentKey,
        path: currentPath,
      })

      if (hasChildren(item)) {
        walk(item.children, level + 1, item.key, currentPath)
      }

      if (isGroup(item) && 'children' in item) {
        walk((item as MenuSubItem).children, level + 1, itemKey, currentPath)
      }
    }
  }

  walk(items, 0)
  return result
}

