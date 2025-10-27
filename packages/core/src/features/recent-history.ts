/**
 * 最近访问历史功能模块
 * 
 * @description
 * 记录和管理用户最近访问的菜单项，提供快速访问入口。
 * 支持访问频率统计、历史管理、持久化存储等功能。
 */

import type { MenuItem } from '../types'
import { findMenuItem } from '../utils/tree-utils'
import { logger } from '../utils/logger'

/**
 * 历史记录项接口
 */
export interface HistoryItem {
  /** 菜单项ID */
  id: string | number
  /** 菜单项标签 */
  label: string
  /** 路由路径（可选） */
  path?: string
  /** 图标（可选） */
  icon?: any
  /** 最后访问时间戳 */
  lastAccessTime: number
  /** 访问次数 */
  accessCount: number
  /** 首次访问时间戳 */
  firstAccessTime: number
}

/**
 * 最近访问配置接口
 */
export interface RecentHistoryConfig {
  /** 最大历史记录数量 */
  maxCount: number
  /** 是否启用持久化 */
  persistence: boolean
  /** 存储键 */
  storageKey: string
  /** 历史变化回调 */
  onChange?: (history: HistoryItem[]) => void
}

/**
 * 最近访问管理器类
 * 
 * @description
 * 管理用户最近访问的菜单项历史记录。
 * 自动记录访问时间和频率，支持多种排序方式。
 * 
 * @example
 * ```ts
 * const recentHistory = new RecentHistoryManager({
 *   maxCount: 10,
 *   persistence: true,
 *   onChange: (items) => {
 *     console.log('最近访问已更新')
 *   }
 * })
 * 
 * // 记录访问
 * recentHistory.record(menuItems, '2-1')
 * 
 * // 获取最近访问（按时间）
 * const recent = recentHistory.getRecent(5)
 * 
 * // 获取最常访问（按频率）
 * const frequent = recentHistory.getMostFrequent(5)
 * 
 * // 清空历史
 * recentHistory.clear()
 * ```
 */
export class RecentHistoryManager {
  private config: Required<RecentHistoryConfig>
  private history: Map<string | number, HistoryItem> = new Map()

  constructor(config: Partial<RecentHistoryConfig> = {}) {
    this.config = {
      maxCount: config.maxCount ?? 10,
      persistence: config.persistence ?? true,
      storageKey: config.storageKey ?? 'ldesign-menu-recent-history',
      onChange: config.onChange,
    }

    // 从存储加载
    if (this.config.persistence) {
      this.load()
    }
  }

  /**
   * 记录访问
   * 
   * @description
   * 记录菜单项的访问，更新访问时间和次数。
   * 自动维护历史记录数量。
   * 
   * @param menuItems - 菜单项数组
   * @param id - 访问的菜单项ID
   * @returns 是否成功记录
   * 
   * @example
   * ```ts
   * menu.on('select', ({ item }) => {
   *   recentHistory.record(menuItems, item.id)
   * })
   * ```
   */
  record(menuItems: MenuItem[], id: string | number): boolean {
    // 查找菜单项
    const menuItem = findMenuItem(menuItems, id)
    if (!menuItem) {
      logger.warn('菜单项不存在:', id)
      return false
    }

    const now = Date.now()

    // 如果已存在，更新访问信息
    if (this.history.has(id)) {
      const item = this.history.get(id)!
      item.lastAccessTime = now
      item.accessCount++
    }
    else {
      // 检查数量限制
      if (this.history.size >= this.config.maxCount) {
        // 移除最早的记录
        const oldestId = this.getOldest()
        if (oldestId) {
          this.history.delete(oldestId)
        }
      }

      // 添加新记录
      const historyItem: HistoryItem = {
        id: menuItem.id,
        label: menuItem.label,
        path: menuItem.path,
        icon: menuItem.icon,
        lastAccessTime: now,
        accessCount: 1,
        firstAccessTime: now,
      }

      this.history.set(id, historyItem)
    }

    this.onChange()
    logger.debug('记录访问:', menuItem.label)
    return true
  }

  /**
   * 获取最近访问
   * 
   * @description
   * 获取最近访问的菜单项列表（按最后访问时间排序）。
   * 
   * @param limit - 返回数量限制
   * @returns 历史记录数组
   * 
   * @example
   * ```ts
   * const recent = recentHistory.getRecent(5)
   * recent.forEach(item => {
   *   console.log(item.label, new Date(item.lastAccessTime))
   * })
   * ```
   */
  getRecent(limit?: number): HistoryItem[] {
    const items = Array.from(this.history.values())

    // 按最后访问时间倒序
    items.sort((a, b) => b.lastAccessTime - a.lastAccessTime)

    const count = limit ?? this.config.maxCount
    return items.slice(0, count)
  }

  /**
   * 获取最常访问
   * 
   * @description
   * 获取最常访问的菜单项列表（按访问次数排序）。
   * 
   * @param limit - 返回数量限制
   * @returns 历史记录数组
   * 
   * @example
   * ```ts
   * const frequent = recentHistory.getMostFrequent(5)
   * frequent.forEach(item => {
   *   console.log(item.label, `访问${item.accessCount}次`)
   * })
   * ```
   */
  getMostFrequent(limit?: number): HistoryItem[] {
    const items = Array.from(this.history.values())

    // 按访问次数倒序
    items.sort((a, b) => b.accessCount - a.accessCount)

    const count = limit ?? this.config.maxCount
    return items.slice(0, count)
  }

  /**
   * 获取访问统计
   * 
   * @description
   * 获取访问统计信息。
   * 
   * @returns 统计对象
   * 
   * @example
   * ```ts
   * const stats = recentHistory.getStats()
   * console.log('总访问次数:', stats.totalAccess)
   * console.log('唯一项数:', stats.uniqueItems)
   * ```
   */
  getStats(): {
    totalAccess: number
    uniqueItems: number
    mostFrequent: HistoryItem | null
    mostRecent: HistoryItem | null
  } {
    const items = Array.from(this.history.values())
    const totalAccess = items.reduce((sum, item) => sum + item.accessCount, 0)

    let mostFrequent: HistoryItem | null = null
    let mostRecent: HistoryItem | null = null

    items.forEach((item) => {
      if (!mostFrequent || item.accessCount > mostFrequent.accessCount) {
        mostFrequent = item
      }
      if (!mostRecent || item.lastAccessTime > mostRecent.lastAccessTime) {
        mostRecent = item
      }
    })

    return {
      totalAccess,
      uniqueItems: items.length,
      mostFrequent,
      mostRecent,
    }
  }

  /**
   * 移除历史记录
   * 
   * @description
   * 从历史记录中移除指定的菜单项。
   * 
   * @param id - 菜单项ID
   * @returns 是否成功移除
   * 
   * @example
   * ```ts
   * recentHistory.removeItem('2-1')
   * ```
   */
  removeItem(id: string | number): boolean {
    const result = this.history.delete(id)
    if (result) {
      this.onChange()
    }
    return result
  }

  /**
   * 清空历史
   * 
   * @description
   * 清空所有历史记录。
   * 
   * @example
   * ```ts
   * recentHistory.clear()
   * ```
   */
  clear(): void {
    this.history.clear()
    this.onChange()
    logger.debug('已清空访问历史')
  }

  /**
   * 获取最早的记录ID
   * 
   * @description
   * 获取最早访问的菜单项ID（用于达到最大数量时移除）。
   * 
   * @returns 最早的记录ID
   * 
   * @private
   */
  private getOldest(): string | number | null {
    let oldestId: string | number | null = null
    let oldestTime = Infinity

    this.history.forEach((item) => {
      if (item.lastAccessTime < oldestTime) {
        oldestTime = item.lastAccessTime
        oldestId = item.id
      }
    })

    return oldestId
  }

  /**
   * 状态变化处理
   * 
   * @private
   */
  private onChange(): void {
    if (this.config.onChange) {
      try {
        this.config.onChange(this.getRecent())
      }
      catch (error) {
        logger.error('历史记录变化回调失败:', error)
      }
    }

    if (this.config.persistence) {
      this.save()
    }
  }

  /**
   * 保存到存储
   */
  save(): void {
    if (!this.config.persistence) {
      return
    }

    try {
      const data = Array.from(this.history.values())
      localStorage.setItem(this.config.storageKey, JSON.stringify(data))
      logger.debug('访问历史已保存')
    }
    catch (error) {
      logger.error('保存访问历史失败:', error)
    }
  }

  /**
   * 从存储加载
   */
  load(): void {
    if (!this.config.persistence) {
      return
    }

    try {
      const stored = localStorage.getItem(this.config.storageKey)
      if (!stored) {
        return
      }

      const data: HistoryItem[] = JSON.parse(stored)
      this.history = new Map(data.map(item => [item.id, item]))

      logger.debug('访问历史已加载')
    }
    catch (error) {
      logger.error('加载访问历史失败:', error)
    }
  }
}


