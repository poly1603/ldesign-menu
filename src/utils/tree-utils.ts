/**
 * 树形数据处理工具
 */

import type { FlatMenuItem, MenuItem } from '../types'

/**
 * 扁平化树形数据
 */
export function flattenTree(
  items: MenuItem[],
  level = 0,
  parentId?: string | number,
  path: (string | number)[] = [],
): FlatMenuItem[] {
  const result: FlatMenuItem[] = []
  let index = 0

  function traverse(nodes: MenuItem[], currentLevel: number, currentParentId?: string | number, currentPath: (string | number)[] = []) {
    nodes.forEach((node) => {
      const itemPath = [...currentPath, node.id]
      const flatItem: FlatMenuItem = {
        ...node,
        level: currentLevel,
        parentId: currentParentId,
        path: itemPath,
        hasChildren: Boolean(node.children && node.children.length > 0),
        index: index++,
      }

      result.push(flatItem)

      if (node.children && node.children.length > 0) {
        traverse(node.children, currentLevel + 1, node.id, itemPath)
      }
    })
  }

  traverse(items, level, parentId, path)
  return result
}

/**
 * 根据 ID 查找菜单项
 */
export function findMenuItem(
  items: MenuItem[],
  id: string | number,
): MenuItem | undefined {
  for (const item of items) {
    if (item.id === id) {
      return item
    }
    if (item.children) {
      const found = findMenuItem(item.children, id)
      if (found) {
        return found
      }
    }
  }
  return undefined
}

/**
 * 根据路径查找菜单项
 */
export function findMenuItemByPath(
  items: MenuItem[],
  path: string,
): MenuItem | undefined {
  for (const item of items) {
    if (item.path === path) {
      return item
    }
    if (item.children) {
      const found = findMenuItemByPath(item.children, path)
      if (found) {
        return found
      }
    }
  }
  return undefined
}

/**
 * 获取菜单项的所有父级
 * 
 * @description
 * 递归查找指定菜单项的所有父级节点，从根节点到直接父级按顺序返回。
 * 
 * @param items - 菜单项数组
 * @param id - 目标菜单项ID
 * @returns 父级节点数组，按从根到直接父级的顺序排列
 * 
 * @example
 * ```ts
 * const parents = getMenuItemParents(menuItems, '2-1')
 * // 返回: [{ id: '2', label: '产品', ... }]
 * ```
 */
export function getMenuItemParents(
  items: MenuItem[],
  id: string | number,
): MenuItem[] {
  const parents: MenuItem[] = []

  function traverse(nodes: MenuItem[], targetId: string | number): boolean {
    for (const node of nodes) {
      if (node.id === targetId) {
        return true
      }
      if (node.children) {
        const found = traverse(node.children, targetId)
        if (found) {
          parents.unshift(node)
          return true
        }
      }
    }
    return false
  }

  traverse(items, id)
  return parents
}

/**
 * 获取菜单项的所有子级 ID
 */
export function getMenuItemChildrenIds(item: MenuItem): (string | number)[] {
  const ids: (string | number)[] = []

  function traverse(node: MenuItem) {
    if (node.children) {
      node.children.forEach((child) => {
        ids.push(child.id)
        traverse(child)
      })
    }
  }

  traverse(item)
  return ids
}

/**
 * 过滤菜单树
 * 
 * @description
 * 根据条件过滤菜单树，返回符合条件的菜单项及其子项。
 * 使用深度克隆确保不修改原始数据，符合不可变数据原则。
 * 
 * @param items - 要过滤的菜单项数组
 * @param predicate - 过滤条件函数，返回 true 表示保留该项
 * @returns 过滤后的新菜单项数组（深度克隆）
 * 
 * @example
 * ```ts
 * const filtered = filterMenuTree(menuItems, item => !item.hidden)
 * ```
 */
export function filterMenuTree(
  items: MenuItem[],
  predicate: (item: MenuItem) => boolean,
): MenuItem[] {
  return items
    .map((item) => {
      // 深度克隆菜单项，避免修改原始数据
      const clonedItem: MenuItem = { ...item }

      // 递归过滤子项
      if (clonedItem.children && clonedItem.children.length > 0) {
        clonedItem.children = filterMenuTree(clonedItem.children, predicate)
      }

      return clonedItem
    })
    .filter((item) => {
      // 保留符合条件的项，或有符合条件的子项的父项
      return predicate(item) || (item.children && item.children.length > 0)
    })
}

/**
 * 遍历菜单树
 */
export function traverseMenuTree(
  items: MenuItem[],
  callback: (item: MenuItem, level: number, parent?: MenuItem) => void,
  level = 0,
  parent?: MenuItem,
): void {
  items.forEach((item) => {
    callback(item, level, parent)
    if (item.children && item.children.length > 0) {
      traverseMenuTree(item.children, callback, level + 1, item)
    }
  })
}

/**
 * 映射菜单树
 */
export function mapMenuTree<T>(
  items: MenuItem[],
  mapper: (item: MenuItem, level: number) => T,
  level = 0,
): T[] {
  return items.map((item) => {
    const mapped = mapper(item, level)
    if (item.children && item.children.length > 0) {
      // @ts-expect-error - 动态添加 children 属性
      mapped.children = mapMenuTree(item.children, mapper, level + 1)
    }
    return mapped
  })
}

/**
 * 获取菜单树的最大深度
 */
export function getMenuTreeDepth(items: MenuItem[]): number {
  let maxDepth = 0

  function traverse(nodes: MenuItem[], depth: number) {
    maxDepth = Math.max(maxDepth, depth)
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        traverse(node.children, depth + 1)
      }
    })
  }

  traverse(items, 1)
  return maxDepth
}

/**
 * 检查菜单项是否有权限
 */
export function hasPermission(
  item: MenuItem,
  userPermissions: string[],
): boolean {
  if (!item.permissions || item.permissions.length === 0) {
    return true
  }
  return item.permissions.some(permission => userPermissions.includes(permission))
}

/**
 * 根据权限过滤菜单
 * 
 * @description
 * 根据用户权限过滤菜单树，只保留用户有权限访问的菜单项。
 * 
 * @param items - 菜单项数组
 * @param userPermissions - 用户权限数组
 * @returns 过滤后的菜单项数组
 */
export function filterMenuByPermissions(
  items: MenuItem[],
  userPermissions: string[],
): MenuItem[] {
  return filterMenuTree(items, item => hasPermission(item, userPermissions))
}

/**
 * 获取同级菜单项
 * 
 * @description
 * 查找与指定菜单项处于同一层级的所有菜单项（兄弟节点）。
 * 主要用于手风琴模式，收起其他同级菜单项。
 * 
 * @param items - 菜单项数组
 * @param id - 目标菜单项ID
 * @returns 同级菜单项数组（不包含目标菜单项本身）
 * 
 * @example
 * ```ts
 * const siblings = getMenuItemSiblings(menuItems, '2-1')
 * // 返回: [{ id: '2-2', ... }, { id: '2-3', ... }]
 * ```
 */
export function getMenuItemSiblings(
  items: MenuItem[],
  id: string | number,
): MenuItem[] {
  // 查找目标项的父级
  const parents = getMenuItemParents(items, id)

  // 如果没有父级，说明是根级菜单项
  if (parents.length === 0) {
    // 返回根级别的其他菜单项
    return items.filter(item => item.id !== id)
  }

  // 获取直接父级
  const directParent = parents[parents.length - 1]

  // 返回父级的其他子项
  if (directParent.children) {
    return directParent.children.filter(item => item.id !== id)
  }

  return []
}

/**
 * 获取同级菜单项的ID数组
 * 
 * @description
 * 获取与指定菜单项同级的所有菜单项ID，便于快速操作。
 * 
 * @param items - 菜单项数组
 * @param id - 目标菜单项ID
 * @returns 同级菜单项ID数组
 */
export function getMenuItemSiblingIds(
  items: MenuItem[],
  id: string | number,
): (string | number)[] {
  const siblings = getMenuItemSiblings(items, id)
  return siblings.map(item => item.id)
}


