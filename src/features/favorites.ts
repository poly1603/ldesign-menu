/**
 * 收藏夹功能模块
 * 
 * @description
 * 提供菜单项的收藏功能，允许用户收藏常用菜单项以便快速访问。
 * 支持收藏列表管理、持久化存储、排序等功能。
 */

import type { MenuItem } from '../types'
import { findMenuItem } from '../utils/tree-utils'
import { logger } from '../utils/logger'

/**
 * 收藏项接口
 */
export interface FavoriteItem {
  /** 菜单项ID */
  id: string | number
  /** 菜单项标签 */
  label: string
  /** 路由路径（可选） */
  path?: string
  /** 图标（可选） */
  icon?: any
  /** 收藏时间戳 */
  timestamp: number
  /** 访问次数 */
  accessCount: number
}

/**
 * 收藏夹配置接口
 */
export interface FavoritesConfig {
  /** 最大收藏数量 */
  maxCount: number
  /** 是否启用持久化 */
  persistence: boolean
  /** 存储键 */
  storageKey: string
  /** 收藏变化回调 */
  onChange?: (favorites: FavoriteItem[]) => void
}

/**
 * 收藏夹管理器类
 * 
 * @description
 * 管理菜单项的收藏功能，支持添加、删除、排序、持久化等操作。
 * 
 * @example
 * ```ts
 * const favorites = new FavoritesManager({
 *   maxCount: 20,
 *   persistence: true,
 *   onChange: (items) => {
 *     console.log(`当前有 ${items.length} 个收藏`)
 *   }
 * })
 * 
 * // 添加收藏
 * favorites.add(menuItems, '2-1')
 * 
 * // 获取收藏列表
 * const list = favorites.getAll()
 * 
 * // 检查是否已收藏
 * if (favorites.has('2-1')) {
 *   console.log('已收藏')
 * }
 * 
 * // 移除收藏
 * favorites.remove('2-1')
 * ```
 */
export class FavoritesManager {
  private config: Required<FavoritesConfig>
  private favorites: Map<string | number, FavoriteItem> = new Map()

  constructor(config: Partial<FavoritesConfig> = {}) {
    this.config = {
      maxCount: config.maxCount ?? 20,
      persistence: config.persistence ?? true,
      storageKey: config.storageKey ?? 'ldesign-menu-favorites',
      onChange: config.onChange,
    }

    // 从存储加载
    if (this.config.persistence) {
      this.load()
    }
  }

  /**
   * 添加收藏
   * 
   * @description
   * 将菜单项添加到收藏夹。
   * 如果已达到最大数量，移除最早的收藏项。
   * 
   * @param menuItems - 菜单项数组
   * @param id - 要收藏的菜单项ID
   * @returns 是否成功添加
   * 
   * @example
   * ```ts
   * favorites.add(menuItems, '2-1')
   * ```
   */
  add(menuItems: MenuItem[], id: string | number): boolean {
    // 查找菜单项
    const menuItem = findMenuItem(menuItems, id)
    if (!menuItem) {
      logger.warn('菜单项不存在:', id)
      return false
    }

    // 如果已存在，更新访问次数
    if (this.favorites.has(id)) {
      const item = this.favorites.get(id)!
      item.accessCount++
      item.timestamp = Date.now()
      this.onChange()
      return true
    }

    // 检查数量限制
    if (this.favorites.size >= this.config.maxCount) {
      // 移除最早的收藏项
      const oldestId = this.getOldest()
      if (oldestId) {
        this.favorites.delete(oldestId)
      }
    }

    // 添加新收藏
    const favoriteItem: FavoriteItem = {
      id: menuItem.id,
      label: menuItem.label,
      path: menuItem.path,
      icon: menuItem.icon,
      timestamp: Date.now(),
      accessCount: 1,
    }

    this.favorites.set(id, favoriteItem)
    this.onChange()

    logger.debug('添加收藏:', menuItem.label)
    return true
  }

  /**
   * 移除收藏
   * 
   * @description
   * 从收藏夹移除指定的菜单项。
   * 
   * @param id - 菜单项ID
   * @returns 是否成功移除
   * 
   * @example
   * ```ts
   * favorites.remove('2-1')
   * ```
   */
  remove(id: string | number): boolean {
    const result = this.favorites.delete(id)
    if (result) {
      this.onChange()
      logger.debug('移除收藏:', id)
    }
    return result
  }

  /**
   * 切换收藏状态
   * 
   * @description
   * 切换菜单项的收藏状态（已收藏则移除，未收藏则添加）。
   * 
   * @param menuItems - 菜单项数组
   * @param id - 菜单项ID
   * @returns 切换后的状态（true表示已收藏）
   * 
   * @example
   * ```ts
   * const isFavorited = favorites.toggle(menuItems, '2-1')
   * console.log(isFavorited ? '已收藏' : '已取消收藏')
   * ```
   */
  toggle(menuItems: MenuItem[], id: string | number): boolean {
    if (this.has(id)) {
      this.remove(id)
      return false
    }
    else {
      this.add(menuItems, id)
      return true
    }
  }

  /**
   * 检查是否已收藏
   * 
   * @description
   * 检查指定菜单项是否已添加到收藏夹。
   * 
   * @param id - 菜单项ID
   * @returns 是否已收藏
   * 
   * @example
   * ```ts
   * if (favorites.has('2-1')) {
   *   showFavoriteIcon()
   * }
   * ```
   */
  has(id: string | number): boolean {
    return this.favorites.has(id)
  }

  /**
   * 获取所有收藏
   * 
   * @description
   * 获取所有收藏的菜单项列表。
   * 
   * @param sortBy - 排序方式（'time'按时间，'count'按访问次数）
   * @returns 收藏项数组
   * 
   * @example
   * ```ts
   * // 按收藏时间排序
   * const byTime = favorites.getAll('time')
   * 
   * // 按访问次数排序
   * const byCount = favorites.getAll('count')
   * ```
   */
  getAll(sortBy: 'time' | 'count' = 'time'): FavoriteItem[] {
    const items = Array.from(this.favorites.values())

    if (sortBy === 'time') {
      // 按时间倒序（最新的在前）
      items.sort((a, b) => b.timestamp - a.timestamp)
    }
    else if (sortBy === 'count') {
      // 按访问次数倒序（最常用的在前）
      items.sort((a, b) => b.accessCount - a.accessCount)
    }

    return items
  }

  /**
   * 获取收藏数量
   * 
   * @description
   * 获取当前收藏的菜单项数量。
   * 
   * @returns 收藏数量
   * 
   * @example
   * ```ts
   * const count = favorites.count()
   * console.log(`共有 ${count} 个收藏`)
   * ```
   */
  count(): number {
    return this.favorites.size
  }

  /**
   * 清空收藏
   * 
   * @description
   * 清空所有收藏的菜单项。
   * 
   * @example
   * ```ts
   * favorites.clear()
   * ```
   */
  clear(): void {
    this.favorites.clear()
    this.onChange()
    logger.debug('已清空所有收藏')
  }

  /**
   * 获取最早的收藏项ID
   * 
   * @description
   * 获取最早收藏的菜单项ID（用于达到最大数量时移除）。
   * 
   * @returns 最早的收藏项ID，如果没有则返回 null
   * 
   * @private
   */
  private getOldest(): string | number | null {
    let oldestId: string | number | null = null
    let oldestTime = Infinity

    this.favorites.forEach((item) => {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp
        oldestId = item.id
      }
    })

    return oldestId
  }

  /**
   * 状态变化处理
   * 
   * @description
   * 收藏夹变化时的统一处理。
   * 
   * @private
   */
  private onChange(): void {
    // 触发变化回调
    if (this.config.onChange) {
      try {
        this.config.onChange(this.getAll())
      }
      catch (error) {
        logger.error('收藏夹变化回调失败:', error)
      }
    }

    // 持久化
    if (this.config.persistence) {
      this.save()
    }
  }

  /**
   * 保存到存储
   * 
   * @description
   * 将收藏列表持久化到 localStorage。
   * 
   * @example
   * ```ts
   * favorites.save()
   * ```
   */
  save(): void {
    if (!this.config.persistence) {
      return
    }

    try {
      const data = Array.from(this.favorites.values())
      localStorage.setItem(this.config.storageKey, JSON.stringify(data))
      logger.debug('收藏列表已保存')
    }
    catch (error) {
      logger.error('保存收藏列表失败:', error)
    }
  }

  /**
   * 从存储加载
   * 
   * @description
   * 从 localStorage 加载之前保存的收藏列表。
   * 
   * @example
   * ```ts
   * favorites.load()
   * ```
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

      const data: FavoriteItem[] = JSON.parse(stored)
      this.favorites = new Map(data.map(item => [item.id, item]))

      logger.debug('收藏列表已加载')
    }
    catch (error) {
      logger.error('加载收藏列表失败:', error)
    }
  }

  /**
   * 导出收藏列表
   * 
   * @description
   * 将收藏列表导出为JSON字符串。
   * 
   * @returns JSON字符串
   * 
   * @example
   * ```ts
   * const json = favorites.export()
   * // 保存到文件或分享给其他用户
   * ```
   */
  export(): string {
    const data = this.getAll()
    return JSON.stringify(data, null, 2)
  }

  /**
   * 导入收藏列表
   * 
   * @description
   * 从JSON字符串导入收藏列表。
   * 
   * @param json - JSON字符串
   * @returns 是否成功导入
   * 
   * @example
   * ```ts
   * const success = favorites.import(jsonString)
   * if (success) {
   *   console.log('导入成功')
   * }
   * ```
   */
  import(json: string): boolean {
    try {
      const data: FavoriteItem[] = JSON.parse(json)

      if (!Array.isArray(data)) {
        throw new Error('无效的收藏数据格式')
      }

      // 合并导入的数据
      data.forEach((item) => {
        this.favorites.set(item.id, item)
      })

      this.onChange()
      logger.debug('收藏列表导入成功')
      return true
    }
    catch (error) {
      logger.error('导入收藏列表失败:', error)
      return false
    }
  }
}


