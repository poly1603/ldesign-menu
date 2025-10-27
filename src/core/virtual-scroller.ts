/**
 * 虚拟滚动器模块
 * 
 * @description
 * 实现高性能的虚拟滚动功能，适用于大量菜单项的场景。
 * 只渲染可见区域的菜单项，大幅降低 DOM 节点数量和内存占用。
 * 支持动态计算可见范围、平滑滚动和缓冲区优化。
 */

import type { FlatMenuItem, ScrollState } from '../types'

/**
 * 虚拟滚动配置接口
 * 
 * @description
 * 定义虚拟滚动的行为参数，包括项高度、启用阈值和缓冲区大小。
 */
export interface VirtualScrollerConfig {
  /** 每个菜单项的固定高度（像素） */
  itemHeight: number
  /** 启用虚拟滚动的最小项数阈值 */
  threshold: number
  /** 上下缓冲区的额外渲染项数（overscan），用于更平滑的滚动 */
  overscan: number
}

/**
 * 虚拟滚动器类
 * 
 * @description
 * 管理大量菜单项的虚拟滚动逻辑，动态计算和更新可见区域。
 * 通过只渲染可见项和少量缓冲项，在保持流畅滚动的同时显著提升性能。
 * 
 * @example
 * ```ts
 * const scroller = new VirtualScroller({
 *   itemHeight: 40,    // 每项高度 40px
 *   threshold: 100,    // 超过 100 项时启用
 *   overscan: 3        // 上下各额外渲染 3 项
 * })
 * 
 * // 设置数据
 * scroller.setItems(flatMenuItems)
 * 
 * // 更新滚动状态
 * scroller.updateScrollState({
 *   scrollTop: container.scrollTop,
 *   clientHeight: container.clientHeight
 * })
 * 
 * // 获取可见项
 * const visibleItems = scroller.getVisibleItems()
 * ```
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
   * 设置菜单项数据
   * 
   * @description
   * 更新虚拟滚动器管理的菜单项列表，并重新计算可见范围。
   * 应在菜单数据变化时调用此方法。
   * 
   * @param items - 扁平化的菜单项数组
   * 
   * @example
   * ```ts
   * const flatItems = flattenTree(menuItems)
   * scroller.setItems(flatItems)
   * ```
   */
  setItems(items: FlatMenuItem[]): void {
    this.items = items
    this.calculateVisibleRange()
  }

  /**
   * 更新滚动状态
   * 
   * @description
   * 当容器滚动或尺寸变化时，更新滚动状态并重新计算可见范围。
   * 通常在 scroll 事件处理器中调用。
   * 
   * @param state - 部分滚动状态对象
   * 
   * @example
   * ```ts
   * container.addEventListener('scroll', () => {
   *   scroller.updateScrollState({
   *     scrollTop: container.scrollTop,
   *     scrollLeft: container.scrollLeft
   *   })
   * })
   * ```
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
   * 
   * @description
   * 根据当前滚动位置和容器尺寸，计算应该渲染的菜单项索引范围。
   * 包含上下缓冲区（overscan）以实现更平滑的滚动体验。
   * 
   * @private
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
   * 
   * @description
   * 返回当前应该渲染的菜单项的索引范围。
   * 
   * @returns 包含 start 和 end 索引的对象
   * 
   * @example
   * ```ts
   * const range = scroller.getVisibleRange()
   * console.log(`应渲染第 ${range.start} 到 ${range.end} 项`)
   * ```
   */
  getVisibleRange(): { start: number, end: number } {
    return this.visibleRange
  }

  /**
   * 获取可见的菜单项
   * 
   * @description
   * 返回当前可见范围内的菜单项数组，用于实际渲染。
   * 这是虚拟滚动的核心方法，只返回需要渲染的项。
   * 
   * @returns 可见的菜单项数组
   * 
   * @example
   * ```ts
   * const visibleItems = scroller.getVisibleItems()
   * visibleItems.forEach(item => renderMenuItem(item))
   * ```
   */
  getVisibleItems(): FlatMenuItem[] {
    const { start, end } = this.visibleRange
    return this.items.slice(start, end + 1)
  }

  /**
   * 获取总高度
   * 
   * @description
   * 计算所有菜单项的总高度，用于设置滚动容器的高度。
   * 
   * @returns 总高度（像素）
   * 
   * @example
   * ```ts
   * const totalHeight = scroller.getTotalHeight()
   * scrollContainer.style.height = `${totalHeight}px`
   * ```
   */
  getTotalHeight(): number {
    return this.items.length * this.config.itemHeight
  }

  /**
   * 获取偏移量
   * 
   * @description
   * 计算可见区域的顶部偏移量，用于定位渲染的菜单项。
   * 
   * @returns 偏移量（像素）
   * 
   * @example
   * ```ts
   * const offset = scroller.getOffset()
   * visibleContainer.style.transform = `translateY(${offset}px)`
   * ```
   */
  getOffset(): number {
    return this.visibleRange.start * this.config.itemHeight
  }

  /**
   * 滚动到指定项
   * 
   * @description
   * 计算滚动到指定菜单项所需的 scrollTop 值。
   * 
   * @param index - 目标菜单项的索引
   * @returns 需要设置的 scrollTop 值（像素）
   * 
   * @example
   * ```ts
   * const scrollTop = scroller.scrollToItem(10)
   * container.scrollTop = scrollTop
   * ```
   */
  scrollToItem(index: number): number {
    const scrollTop = index * this.config.itemHeight
    return scrollTop
  }

  /**
   * 判断是否需要启用虚拟滚动
   * 
   * @description
   * 根据配置的阈值判断当前菜单项数量是否需要启用虚拟滚动。
   * 项数少于阈值时，直接渲染所有项可能性能更好。
   * 
   * @returns 是否应启用虚拟滚动
   * 
   * @example
   * ```ts
   * if (scroller.shouldEnable()) {
   *   // 使用虚拟滚动渲染
   *   renderVirtual(scroller.getVisibleItems())
   * } else {
   *   // 直接渲染所有项
   *   renderAll(allItems)
   * }
   * ```
   */
  shouldEnable(): boolean {
    return this.items.length >= this.config.threshold
  }

  /**
   * 更新配置
   * 
   * @description
   * 动态更新虚拟滚动器的配置参数，并重新计算可见范围。
   * 
   * @param config - 部分配置对象
   * 
   * @example
   * ```ts
   * scroller.updateConfig({
   *   itemHeight: 50,  // 改变项高度
   *   overscan: 5      // 增加缓冲区
   * })
   * ```
   */
  updateConfig(config: Partial<VirtualScrollerConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
    this.calculateVisibleRange()
  }
}


