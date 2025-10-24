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
 */
export function filterMenuTree(
  items: MenuItem[],
  predicate: (item: MenuItem) => boolean,
): MenuItem[] {
  return items
    .filter((item) => {
      if (item.children) {
        item.children = filterMenuTree(item.children, predicate)
      }
      return predicate(item) || (item.children && item.children.length > 0)
    })
    .map(item => ({ ...item }))
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
 */
export function filterMenuByPermissions(
  items: MenuItem[],
  userPermissions: string[],
): MenuItem[] {
  return filterMenuTree(items, item => hasPermission(item, userPermissions))
}


