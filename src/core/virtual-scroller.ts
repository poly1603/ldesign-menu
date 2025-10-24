/**
 * 虚拟滚动器
 */

import type { FlatMenuItem, ScrollState } from '../types'

/**
 * 虚拟滚动配置
 */
export interface VirtualScrollerConfig {
  itemHeight: number
  threshold: number
  overscan: number
}

/**
 * 虚拟滚动器类
 */
export class VirtualScroller {
  private config: VirtualScrollerConfig
  private scrollState: ScrollState
  private items: FlatMenuItem[] = []
  private visibleRange: { start: number, end: number } = { start: 0, end: 0 }

  constructor(config: Partial<VirtualScrollerConfig> = {}) {
    this.config = {
      itemHeight: config.itemHeight || 40,
      threshold: config.threshold || 100,
      overscan: config.overscan || 3,
    }

    this.scrollState = {
      scrollTop: 0,
      scrollLeft: 0,
      clientHeight: 0,
      clientWidth: 0,
      scrollHeight: 0,
      scrollWidth: 0,
    }
  }

  /**
   * 设置菜单项
   */
  setItems(items: FlatMenuItem[]): void {
    this.items = items
    this.calculateVisibleRange()
  }

  /**
   * 更新滚动状态
   */
  updateScrollState(state: Partial<ScrollState>): void {
    this.scrollState = {
      ...this.scrollState,
      ...state,
    }
    this.calculateVisibleRange()
  }

  /**
   * 计算可见范围
   */
  private calculateVisibleRange(): void {
    if (this.items.length === 0) {
      this.visibleRange = { start: 0, end: 0 }
      return
    }

    const { scrollTop, clientHeight } = this.scrollState
    const { itemHeight, overscan } = this.config

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      this.items.length - 1,
      Math.ceil((scrollTop + clientHeight) / itemHeight) + overscan,
    )

    this.visibleRange = {
      start: startIndex,
      end: endIndex,
    }
  }

  /**
   * 获取可见范围
   */
  getVisibleRange(): { start: number, end: number } {
    return this.visibleRange
  }

  /**
   * 获取可见的菜单项
   */
  getVisibleItems(): FlatMenuItem[] {
    const { start, end } = this.visibleRange
    return this.items.slice(start, end + 1)
  }

  /**
   * 获取总高度
   */
  getTotalHeight(): number {
    return this.items.length * this.config.itemHeight
  }

  /**
   * 获取偏移量
   */
  getOffset(): number {
    return this.visibleRange.start * this.config.itemHeight
  }

  /**
   * 滚动到指定项
   */
  scrollToItem(index: number): number {
    const scrollTop = index * this.config.itemHeight
    return scrollTop
  }

  /**
   * 判断是否需要启用虚拟滚动
   */
  shouldEnable(): boolean {
    return this.items.length >= this.config.threshold
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<VirtualScrollerConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
    this.calculateVisibleRange()
  }
}


