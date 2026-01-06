/**
 * 菜单搜索工具
 * 提供菜单项搜索和高亮功能
 * @module utils/menu-search
 */

import type { MenuItem, MenuSubItem } from '../types'
import { hasChildren, isGroup } from './menu-utils'

/**
 * 搜索配置
 */
export interface MenuSearchConfig {
  /**
   * 搜索关键字
   */
  keyword: string

  /**
   * 是否区分大小写
   * @default false
   */
  caseSensitive?: boolean

  /**
   * 是否匹配路径
   * @default false
   */
  matchPath?: boolean

  /**
   * 是否匹配 key
   * @default false
   */
  matchKey?: boolean

  /**
   * 自定义匹配函数
   * @param item - 菜单项
   * @param keyword - 搜索关键字
   * @returns 是否匹配
   */
  customMatch?: (item: MenuItem, keyword: string) => boolean
}

/**
 * 搜索结果
 */
export interface MenuSearchResult {
  /**
   * 匹配的菜单项
   */
  item: MenuItem

  /**
   * 匹配的字段
   */
  matchedField: 'label' | 'path' | 'key' | 'custom'

  /**
   * 从根到匹配项的路径 key 列表
   */
  pathKeys: string[]

  /**
   * 匹配分数（用于排序，越高越相关）
   */
  score: number
}

/**
 * 计算匹配分数
 * @param text - 被搜索的文本
 * @param keyword - 搜索关键字
 * @param caseSensitive - 是否区分大小写
 * @returns 匹配分数
 */
function calculateScore(
  text: string,
  keyword: string,
  caseSensitive: boolean,
): number {
  const normalizedText = caseSensitive ? text : text.toLowerCase()
  const normalizedKeyword = caseSensitive ? keyword : keyword.toLowerCase()

  // 完全匹配
  if (normalizedText === normalizedKeyword) {
    return 100
  }

  // 以关键字开头
  if (normalizedText.startsWith(normalizedKeyword)) {
    return 80 + (keyword.length / text.length) * 20
  }

  // 包含关键字
  if (normalizedText.includes(normalizedKeyword)) {
    return 60 + (keyword.length / text.length) * 20
  }

  return 0
}

/**
 * 检查菜单项是否匹配搜索条件
 * @param item - 菜单项
 * @param config - 搜索配置
 * @returns 匹配结果
 */
function matchItem(
  item: MenuItem,
  config: MenuSearchConfig,
): { matched: boolean; field: 'label' | 'path' | 'key' | 'custom'; score: number } {
  const { keyword, caseSensitive = false, matchPath = false, matchKey = false, customMatch } = config

  if (!keyword) {
    return { matched: false, field: 'label', score: 0 }
  }

  // 分隔线不参与搜索
  if (item.type === 'divider') {
    return { matched: false, field: 'label', score: 0 }
  }

  // 自定义匹配
  if (customMatch && customMatch(item, keyword)) {
    return { matched: true, field: 'custom', score: 90 }
  }

  // 匹配 label
  if ('label' in item && item.label) {
    const score = calculateScore(item.label, keyword, caseSensitive)
    if (score > 0) {
      return { matched: true, field: 'label', score }
    }
  }

  // 匹配 path
  if (matchPath && 'path' in item && item.path) {
    const score = calculateScore(item.path, keyword, caseSensitive)
    if (score > 0) {
      return { matched: true, field: 'path', score }
    }
  }

  // 匹配 key
  if (matchKey && 'key' in item && item.key) {
    const score = calculateScore(item.key, keyword, caseSensitive)
    if (score > 0) {
      return { matched: true, field: 'key', score }
    }
  }

  return { matched: false, field: 'label', score: 0 }
}

/**
 * 搜索菜单项
 * @param items - 菜单项列表
 * @param config - 搜索配置
 * @returns 搜索结果列表（按分数降序排列）
 */
export function searchMenuItems(
  items: MenuItem[],
  config: MenuSearchConfig,
): MenuSearchResult[] {
  const results: MenuSearchResult[] = []

  if (!config.keyword || !config.keyword.trim()) {
    return results
  }

  function search(menuItems: MenuItem[], pathKeys: string[] = []): void {
    for (const item of menuItems) {
      const currentPath = 'key' in item && item.key ? [...pathKeys, item.key] : pathKeys
      const matchResult = matchItem(item, config)

      if (matchResult.matched) {
        results.push({
          item,
          matchedField: matchResult.field,
          pathKeys: currentPath,
          score: matchResult.score,
        })
      }

      // 递归搜索子项
      if (hasChildren(item) || isGroup(item)) {
        const children = 'children' in item ? (item as MenuSubItem).children : []
        search(children, currentPath)
      }
    }
  }

  search(items)

  // 按分数降序排列
  return results.sort((a, b) => b.score - a.score)
}

/**
 * 高亮搜索关键字
 * @param text - 原文本
 * @param keyword - 搜索关键字
 * @param caseSensitive - 是否区分大小写
 * @param highlightClass - 高亮 CSS 类名
 * @returns 带高亮标签的 HTML 字符串
 */
export function highlightKeyword(
  text: string,
  keyword: string,
  caseSensitive = false,
  highlightClass = 'l-menu-highlight',
): string {
  if (!keyword || !text) {
    return text
  }

  const flags = caseSensitive ? 'g' : 'gi'
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedKeyword})`, flags)

  return text.replace(regex, `<span class="${highlightClass}">$1</span>`)
}

/**
 * 过滤菜单项（保留匹配项及其父级路径）
 * @param items - 菜单项列表
 * @param config - 搜索配置
 * @returns 过滤后的菜单项列表
 */
export function filterMenuItemsBySearch(
  items: MenuItem[],
  config: MenuSearchConfig,
): MenuItem[] {
  if (!config.keyword || !config.keyword.trim()) {
    return items
  }

  function filter(menuItems: MenuItem[]): MenuItem[] {
    const result: MenuItem[] = []

    for (const item of menuItems) {
      // 分隔线保留
      if (item.type === 'divider') {
        continue // 暂时跳过，后续会根据上下文决定是否保留
      }

      const matchResult = matchItem(item, config)

      // 如果当前项匹配，直接添加
      if (matchResult.matched) {
        result.push(item)
        continue
      }

      // 如果有子项，递归过滤
      if (hasChildren(item) || isGroup(item)) {
        const children = 'children' in item ? (item as MenuSubItem).children : []
        const filteredChildren = filter(children)

        // 如果子项中有匹配的，保留当前项（作为路径）
        if (filteredChildren.length > 0) {
          result.push({
            ...item,
            children: filteredChildren,
          } as MenuItem)
        }
      }
    }

    return result
  }

  return filter(items)
}

/**
 * 获取所有搜索匹配项的父级 key 列表
 * 用于在搜索时自动展开包含匹配项的父级菜单
 * @param items - 菜单项列表
 * @param config - 搜索配置
 * @returns 需要展开的父级 key 列表
 */
export function getExpandKeysForSearch(
  items: MenuItem[],
  config: MenuSearchConfig,
): string[] {
  const results = searchMenuItems(items, config)
  const expandKeys = new Set<string>()

  for (const result of results) {
    // 添加路径上的所有父级 key（不包括自身）
    const parentKeys = result.pathKeys.slice(0, -1)
    parentKeys.forEach(key => expandKeys.add(key))
  }

  return Array.from(expandKeys)
}
