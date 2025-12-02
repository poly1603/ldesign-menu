/**
 * 菜单过滤器
 * 用于根据权限、角色等条件过滤菜单项
 * @module managers/menu-filter
 */

import type { MenuItem, MenuSubItem } from '../types'
import { hasChildren, isGroup, isHidden } from '../utils'

/**
 * 过滤器配置
 */
export interface MenuFilterConfig {
  /**
   * 用户拥有的权限列表
   */
  permissions?: string[]

  /**
   * 用户拥有的角色列表
   */
  roles?: string[]

  /**
   * 自定义过滤函数
   * @param item - 菜单项
   * @returns 是否显示该菜单项
   */
  customFilter?: (item: MenuItem) => boolean
}

/**
 * 检查权限
 * @param required - 菜单项要求的权限
 * @param owned - 用户拥有的权限
 * @returns 是否有权限
 */
function checkPermissions(
  required: string[] | undefined,
  owned: string[] | undefined,
): boolean {
  // 没有权限要求，直接通过
  if (!required || required.length === 0) {
    return true
  }

  // 用户没有任何权限，不通过
  if (!owned || owned.length === 0) {
    return false
  }

  // 检查是否有任一权限匹配
  return required.some(perm => owned.includes(perm))
}

/**
 * 检查角色
 * @param required - 菜单项要求的角色
 * @param owned - 用户拥有的角色
 * @returns 是否有角色权限
 */
function checkRoles(
  required: string[] | undefined,
  owned: string[] | undefined,
): boolean {
  // 没有角色要求，直接通过
  if (!required || required.length === 0) {
    return true
  }

  // 用户没有任何角色，不通过
  if (!owned || owned.length === 0) {
    return false
  }

  // 检查是否有任一角色匹配
  return required.some(role => owned.includes(role))
}

/**
 * 过滤单个菜单项
 * @param item - 菜单项
 * @param config - 过滤配置
 * @returns 是否显示
 */
function shouldShowItem(item: MenuItem, config: MenuFilterConfig): boolean {
  // 隐藏的项不显示
  if (isHidden(item)) {
    return false
  }

  // 分隔线始终显示（后续会根据上下文移除多余的分隔线）
  if (item.type === 'divider') {
    return true
  }

  // 检查权限
  if ('permissions' in item) {
    if (!checkPermissions(item.permissions, config.permissions)) {
      return false
    }
  }

  // 检查角色
  if ('roles' in item) {
    if (!checkRoles(item.roles, config.roles)) {
      return false
    }
  }

  // 自定义过滤
  if (config.customFilter && !config.customFilter(item)) {
    return false
  }

  return true
}

/**
 * 过滤菜单项列表
 * @param items - 菜单项列表
 * @param config - 过滤配置
 * @returns 过滤后的菜单项列表
 */
export function filterMenuItems(
  items: MenuItem[],
  config: MenuFilterConfig = {},
): MenuItem[] {
  const result: MenuItem[] = []

  for (const item of items) {
    // 检查是否应该显示
    if (!shouldShowItem(item, config)) {
      continue
    }

    // 处理有子项的菜单
    if (hasChildren(item) || isGroup(item)) {
      const children = 'children' in item
        ? filterMenuItems((item as MenuSubItem).children, config)
        : []

      // 如果子项全部被过滤掉，不显示父级（除非是分组）
      if (children.length === 0 && !isGroup(item)) {
        continue
      }

      // 创建新的菜单项，包含过滤后的子项
      result.push({
        ...item,
        children,
      } as MenuItem)
    }
    else {
      result.push(item)
    }
  }

  // 清理多余的分隔线（开头、结尾、连续的分隔线）
  return cleanupDividers(result)
}

/**
 * 清理多余的分隔线
 * @param items - 菜单项列表
 * @returns 清理后的列表
 */
function cleanupDividers(items: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = []
  let lastWasDivider = true // 开头的分隔线会被跳过

  for (const item of items) {
    if (item.type === 'divider') {
      if (!lastWasDivider) {
        result.push(item)
        lastWasDivider = true
      }
    }
    else {
      result.push(item)
      lastWasDivider = false
    }
  }

  // 移除结尾的分隔线
  while (result.length > 0 && result[result.length - 1]?.type === 'divider') {
    result.pop()
  }

  return result
}

