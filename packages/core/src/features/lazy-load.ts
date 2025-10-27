/**
 * 懒加载功能模块
 * 
 * @description
 * 提供菜单项的异步懒加载功能，支持按需加载子菜单数据。
 * 适用于大型菜单树，减少初始加载时间。
 */

import type { MenuItem } from '../types'
import { logger } from '../utils/logger'

/**
 * 懒加载配置接口
 */
export interface LazyLoadConfig {
  /** 加载函数（返回子菜单项数组） */
  loadFn: (parentId: string | number) => Promise<MenuItem[]>
  /** 加载失败重试次数 */
  retryCount: number
  /** 缓存策略（'memory'内存缓存，'none'不缓存） */
  cacheStrategy: 'memory' | 'none'
  /** 缓存过期时间（毫秒，0表示永不过期） */
  cacheExpire: number
  /** 加载开始回调 */
  onLoadStart?: (parentId: string | number) => void
  /** 加载成功回调 */
  onLoadSuccess?: (parentId: string | number, children: MenuItem[]) => void
  /** 加载失败回调 */
  onLoadError?: (parentId: string | number, error: Error) => void
}

/**
 * 缓存项接口
 */
interface CacheItem {
  /** 子菜单项 */
  children: MenuItem[]
  /** 缓存时间戳 */
  timestamp: number
}

/**
 * 懒加载管理器类
 * 
 * @description
 * 管理菜单项的异步懒加载，支持缓存、重试、加载状态管理等功能。
 * 
 * @example
 * ```ts
 * const lazyLoad = new LazyLoadManager({
 *   loadFn: async (parentId) => {
 *     const response = await fetch(`/api/menu/${parentId}/children`)
 *     return await response.json()
 *   },
 *   retryCount: 3,
 *   cacheStrategy: 'memory',
 *   onLoadStart: (id) => showLoading(id),
 *   onLoadSuccess: (id, children) => hideLoading(id),
 *   onLoadError: (id, error) => showError(id, error)
 * })
 * 
 * // 加载子菜单
 * const children = await lazyLoad.load('2')
 * 
 * // 检查是否已加载
 * if (lazyLoad.isLoaded('2')) {
 *   console.log('已加载')
 * }
 * 
 * // 清除缓存
 * lazyLoad.clearCache('2')
 * ```
 */
export class LazyLoadManager {
  private config: Required<LazyLoadConfig>
  private cache: Map<string | number, CacheItem> = new Map()
  private loadingMap: Map<string | number, Promise<MenuItem[]>> = new Map()

  constructor(config: Partial<LazyLoadConfig> & Pick<LazyLoadConfig, 'loadFn'>) {
    this.config = {
      loadFn: config.loadFn,
      retryCount: config.retryCount ?? 3,
      cacheStrategy: config.cacheStrategy ?? 'memory',
      cacheExpire: config.cacheExpire ?? 5 * 60 * 1000, // 默认5分钟
      onLoadStart: config.onLoadStart,
      onLoadSuccess: config.onLoadSuccess,
      onLoadError: config.onLoadError,
    }
  }

  /**
   * 加载子菜单
   * 
   * @description
   * 异步加载指定菜单项的子菜单。
   * 支持缓存和重试机制。
   * 
   * @param parentId - 父菜单项ID
   * @returns Promise，resolve时返回子菜单项数组
   * 
   * @example
   * ```ts
   * try {
   *   const children = await lazyLoad.load('2')
   *   renderChildren(children)
   * } catch (error) {
   *   console.error('加载失败:', error)
   * }
   * ```
   */
  async load(parentId: string | number): Promise<MenuItem[]> {
    // 检查缓存
    if (this.config.cacheStrategy === 'memory') {
      const cached = this.getFromCache(parentId)
      if (cached) {
        logger.debug('从缓存加载:', parentId)
        return cached
      }
    }

    // 检查是否正在加载
    const loading = this.loadingMap.get(parentId)
    if (loading) {
      logger.debug('等待加载完成:', parentId)
      return loading
    }

    // 触发加载开始回调
    if (this.config.onLoadStart) {
      try {
        this.config.onLoadStart(parentId)
      }
      catch (error) {
        logger.error('加载开始回调失败:', error)
      }
    }

    // 创建加载Promise
    const loadPromise = this.loadWithRetry(parentId, this.config.retryCount)
    this.loadingMap.set(parentId, loadPromise)

    try {
      const children = await loadPromise

      // 保存到缓存
      if (this.config.cacheStrategy === 'memory') {
        this.saveToCache(parentId, children)
      }

      // 触发加载成功回调
      if (this.config.onLoadSuccess) {
        try {
          this.config.onLoadSuccess(parentId, children)
        }
        catch (error) {
          logger.error('加载成功回调失败:', error)
        }
      }

      logger.debug('加载成功:', parentId, `共${children.length}项`)
      return children
    }
    catch (error) {
      // 触发加载失败回调
      if (this.config.onLoadError) {
        try {
          this.config.onLoadError(parentId, error as Error)
        }
        catch (cbError) {
          logger.error('加载失败回调失败:', cbError)
        }
      }

      logger.error('加载失败:', parentId, error)
      throw error
    }
    finally {
      // 移除加载状态
      this.loadingMap.delete(parentId)
    }
  }

  /**
   * 带重试的加载
   * 
   * @description
   * 加载失败时自动重试。
   * 
   * @param parentId - 父菜单项ID
   * @param retryCount - 重试次数
   * @returns Promise
   * 
   * @private
   */
  private async loadWithRetry(
    parentId: string | number,
    retryCount: number,
  ): Promise<MenuItem[]> {
    let lastError: Error | null = null

    for (let i = 0; i <= retryCount; i++) {
      try {
        if (i > 0) {
          logger.debug(`重试加载 (${i}/${retryCount}):`, parentId)
        }

        return await this.config.loadFn(parentId)
      }
      catch (error) {
        lastError = error as Error

        // 最后一次重试失败，抛出错误
        if (i === retryCount) {
          break
        }

        // 等待后重试（指数退避）
        const delay = Math.min(1000 * Math.pow(2, i), 5000)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }

  /**
   * 从缓存获取
   * 
   * @description
   * 从缓存中获取子菜单数据。
   * 检查缓存是否过期。
   * 
   * @param parentId - 父菜单项ID
   * @returns 缓存的子菜单项数组，如果不存在或已过期返回 null
   * 
   * @private
   */
  private getFromCache(parentId: string | number): MenuItem[] | null {
    const cached = this.cache.get(parentId)
    if (!cached) {
      return null
    }

    // 检查是否过期
    if (this.config.cacheExpire > 0) {
      const elapsed = Date.now() - cached.timestamp
      if (elapsed > this.config.cacheExpire) {
        this.cache.delete(parentId)
        return null
      }
    }

    return cached.children
  }

  /**
   * 保存到缓存
   * 
   * @description
   * 将加载的子菜单保存到缓存。
   * 
   * @param parentId - 父菜单项ID
   * @param children - 子菜单项数组
   * 
   * @private
   */
  private saveToCache(parentId: string | number, children: MenuItem[]): void {
    this.cache.set(parentId, {
      children,
      timestamp: Date.now(),
    })
  }

  /**
   * 检查是否已加载
   * 
   * @description
   * 检查指定菜单项的子菜单是否已加载。
   * 
   * @param parentId - 父菜单项ID
   * @returns 是否已加载
   * 
   * @example
   * ```ts
   * if (!lazyLoad.isLoaded('2')) {
   *   await lazyLoad.load('2')
   * }
   * ```
   */
  isLoaded(parentId: string | number): boolean {
    return this.cache.has(parentId)
  }

  /**
   * 检查是否正在加载
   * 
   * @description
   * 检查指定菜单项是否正在加载中。
   * 
   * @param parentId - 父菜单项ID
   * @returns 是否正在加载
   */
  isLoading(parentId: string | number): boolean {
    return this.loadingMap.has(parentId)
  }

  /**
   * 清除缓存
   * 
   * @description
   * 清除指定菜单项或所有菜单项的缓存。
   * 
   * @param parentId - 父菜单项ID（可选，不提供则清除所有）
   * 
   * @example
   * ```ts
   * // 清除特定项的缓存
   * lazyLoad.clearCache('2')
   * 
   * // 清除所有缓存
   * lazyLoad.clearCache()
   * ```
   */
  clearCache(parentId?: string | number): void {
    if (parentId !== undefined) {
      this.cache.delete(parentId)
      logger.debug('已清除缓存:', parentId)
    }
    else {
      this.cache.clear()
      logger.debug('已清除所有缓存')
    }
  }

  /**
   * 预加载
   * 
   * @description
   * 预加载指定菜单项的子菜单（用于性能优化）。
   * 
   * @param parentIds - 父菜单项ID数组
   * @returns Promise数组
   * 
   * @example
   * ```ts
   * // 预加载多个菜单项
   * await Promise.all(lazyLoad.preload(['2', '3', '4']))
   * ```
   */
  preload(parentIds: (string | number)[]): Promise<MenuItem[]>[] {
    return parentIds.map(id => this.load(id))
  }
}


