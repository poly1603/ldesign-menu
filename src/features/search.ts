/**
 * 菜单搜索功能模块
 * 
 * @description
 * 提供菜单项的搜索和过滤功能。
 * 支持模糊搜索、拼音搜索、高亮匹配、搜索历史等功能。
 */

import type { MenuItem } from '../types'
import { filterMenuTree } from '../utils/tree-utils'

/**
 * 搜索配置接口
 */
export interface SearchConfig {
  /** 是否区分大小写 */
  caseSensitive: boolean
  /** 是否启用拼音搜索 */
  pinyin: boolean
  /** 是否搜索子菜单 */
  searchChildren: boolean
  /** 最大搜索历史数量 */
  maxHistory: number
  /** 搜索字段（哪些字段参与搜索） */
  searchFields: Array<keyof MenuItem>
  /** 搜索回调 */
  onSearch?: (query: string, results: MenuItem[]) => void
}

/**
 * 搜索结果接口
 */
export interface SearchResult {
  /** 匹配的菜单项 */
  item: MenuItem
  /** 匹配的字段 */
  matchedField: string
  /** 匹配的位置（字符索引） */
  matchIndex: number
  /** 匹配分数（相关性） */
  score: number
}

/**
 * 菜单搜索管理器类
 * 
 * @description
 * 管理菜单的搜索功能，支持多种搜索模式和结果高亮。
 * 
 * @example
 * ```ts
 * const search = new MenuSearch({
 *   caseSensitive: false,
 *   searchChildren: true,
 *   onSearch: (query, results) => {
 *     console.log(`找到 ${results.length} 个匹配项`)
 *   }
 * })
 * 
 * // 搜索菜单项
 * const results = search.search(menuItems, '产品')
 * 
 * // 高亮匹配项
 * const highlighted = search.highlight(results, '产品')
 * 
 * // 获取搜索历史
 * const history = search.getHistory()
 * ```
 */
export class MenuSearch {
  private config: Required<SearchConfig>
  private searchHistory: string[] = []

  constructor(config: Partial<SearchConfig> = {}) {
    this.config = {
      caseSensitive: config.caseSensitive ?? false,
      pinyin: config.pinyin ?? true,
      searchChildren: config.searchChildren ?? true,
      maxHistory: config.maxHistory ?? 10,
      searchFields: config.searchFields ?? ['label', 'path'],
      onSearch: config.onSearch,
    }
  }

  /**
   * 搜索菜单项
   * 
   * @description
   * 根据关键词搜索菜单项，返回匹配的结果。
   * 支持模糊匹配和多字段搜索。
   * 
   * @param menuItems - 菜单项数组
   * @param query - 搜索关键词
   * @returns 匹配的菜单项数组
   * 
   * @example
   * ```ts
   * const results = search.search(menuItems, '产品')
   * results.forEach(item => {
   *   console.log('找到:', item.label)
   * })
   * ```
   */
  search(menuItems: MenuItem[], query: string): MenuItem[] {
    if (!query || query.trim() === '') {
      return []
    }

    // 记录搜索历史
    this.addToHistory(query)

    // 标准化搜索关键词
    const normalizedQuery = this.config.caseSensitive
      ? query
      : query.toLowerCase()

    // 过滤匹配的菜单项
    const results = filterMenuTree(menuItems, (item) => {
      return this.matchItem(item, normalizedQuery)
    })

    // 触发搜索回调
    if (this.config.onSearch) {
      this.config.onSearch(query, results)
    }

    return results
  }

  /**
   * 匹配单个菜单项
   * 
   * @description
   * 检查菜单项是否匹配搜索关键词。
   * 
   * @param item - 菜单项
   * @param query - 搜索关键词（已标准化）
   * @returns 是否匹配
   * 
   * @private
   */
  private matchItem(item: MenuItem, query: string): boolean {
    // 检查配置的搜索字段
    for (const field of this.config.searchFields) {
      const value = item[field]
      if (value && typeof value === 'string') {
        const normalizedValue = this.config.caseSensitive
          ? value
          : value.toLowerCase()

        // 简单的子串匹配
        if (normalizedValue.includes(query)) {
          return true
        }

        // TODO: 拼音搜索支持（需要拼音库）
        // if (this.config.pinyin && matchPinyin(value, query)) {
        //   return true
        // }
      }
    }

    return false
  }

  /**
   * 高亮匹配文本
   * 
   * @description
   * 在文本中高亮显示匹配的关键词。
   * 
   * @param text - 原始文本
   * @param query - 搜索关键词
   * @param className - 高亮样式类名
   * @returns 包含高亮标记的 HTML 字符串
   * 
   * @example
   * ```ts
   * const highlighted = search.highlight('产品管理', '产品', 'highlight')
   * // 返回: '<span class="highlight">产品</span>管理'
   * ```
   */
  highlight(text: string, query: string, className = 'search-highlight'): string {
    if (!query || query.trim() === '') {
      return text
    }

    const normalizedQuery = this.config.caseSensitive ? query : query.toLowerCase()
    const normalizedText = this.config.caseSensitive ? text : text.toLowerCase()

    const index = normalizedText.indexOf(normalizedQuery)
    if (index === -1) {
      return text
    }

    const before = text.substring(0, index)
    const match = text.substring(index, index + query.length)
    const after = text.substring(index + query.length)

    return `${before}<span class="${className}">${match}</span>${after}`
  }

  /**
   * 添加到搜索历史
   * 
   * @description
   * 将搜索关键词添加到历史记录。
   * 
   * @param query - 搜索关键词
   * 
   * @private
   */
  private addToHistory(query: string): void {
    // 移除重复项
    const index = this.searchHistory.indexOf(query)
    if (index !== -1) {
      this.searchHistory.splice(index, 1)
    }

    // 添加到开头
    this.searchHistory.unshift(query)

    // 限制历史数量
    if (this.searchHistory.length > this.config.maxHistory) {
      this.searchHistory.pop()
    }
  }

  /**
   * 获取搜索历史
   * 
   * @description
   * 获取最近的搜索记录。
   * 
   * @returns 搜索历史数组
   * 
   * @example
   * ```ts
   * const history = search.getHistory()
   * history.forEach(query => {
   *   console.log('历史记录:', query)
   * })
   * ```
   */
  getHistory(): string[] {
    return [...this.searchHistory]
  }

  /**
   * 清空搜索历史
   * 
   * @description
   * 清空所有搜索历史记录。
   * 
   * @example
   * ```ts
   * search.clearHistory()
   * ```
   */
  clearHistory(): void {
    this.searchHistory = []
  }

  /**
   * 更新配置
   * 
   * @description
   * 动态更新搜索配置。
   * 
   * @param config - 部分配置对象
   * 
   * @example
   * ```ts
   * search.updateConfig({
   *   caseSensitive: true,
   *   maxHistory: 20
   * })
   * ```
   */
  updateConfig(config: Partial<SearchConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    } as Required<SearchConfig>
  }
}

/**
 * 快速搜索函数
 * 
 * @description
 * 便捷的搜索函数，无需创建SearchConfig实例。
 * 
 * @param menuItems - 菜单项数组
 * @param query - 搜索关键词
 * @param caseSensitive - 是否区分大小写
 * @returns 匹配的菜单项数组
 * 
 * @example
 * ```ts
 * const results = searchMenu(menuItems, '产品', false)
 * console.log(`找到 ${results.length} 个匹配项`)
 * ```
 */
export function searchMenu(
  menuItems: MenuItem[],
  query: string,
  caseSensitive = false,
): MenuItem[] {
  const search = new MenuSearch({ caseSensitive })
  return search.search(menuItems, query)
}

/**
 * 过滤菜单项
 * 
 * @description
 * 根据条件函数过滤菜单项。
 * 
 * @param menuItems - 菜单项数组
 * @param predicate - 过滤条件函数
 * @returns 过滤后的菜单项数组
 * 
 * @example
 * ```ts
 * // 只显示未禁用的菜单项
 * const enabled = filterMenu(menuItems, item => !item.disabled)
 * 
 * // 只显示有权限的菜单项
 * const authorized = filterMenu(menuItems, item => 
 *   hasPermission(item, userPermissions)
 * )
 * ```
 */
export function filterMenu(
  menuItems: MenuItem[],
  predicate: (item: MenuItem) => boolean,
): MenuItem[] {
  return filterMenuTree(menuItems, predicate)
}


