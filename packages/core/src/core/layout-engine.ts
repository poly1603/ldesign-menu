/**
 * 布局引擎模块
 * 
 * @description
 * 负责计算和管理菜单的布局信息，包括横向和纵向布局、菜单项位置计算、
 * 响应式处理等功能。为渲染引擎提供精确的布局数据。
 */

import type { FlatMenuItem, LayoutResult, MenuConfig, MenuItem, Position } from '../types'
import { flattenTree } from '../utils/tree-utils'

/**
 * 布局引擎类
 * 
 * @description
 * 管理菜单的布局计算逻辑，支持横向和纵向两种布局模式。
 * 根据菜单配置和容器尺寸，计算每个菜单项的位置和尺寸，
 * 并提供响应式布局支持。
 * 
 * @example
 * ```ts
 * const engine = new LayoutEngine({
 *   mode: 'vertical',
 *   itemHeight: 40,
 *   indent: 24
 * })
 * 
 * engine.setItems(menuItems)
 * const layout = engine.getLayout()
 * const position = engine.getItemPosition('item-1')
 * ```
 */
export class LayoutEngine {
  private config: MenuConfig
  private items: MenuItem[] = []
  private flatItems: FlatMenuItem[] = []
  private itemPositions: Map<string | number, Position> = new Map()

  constructor(config: MenuConfig) {
    this.config = config
  }

  /**
   * 设置菜单项
   * 
   * @description
   * 更新菜单项数据，将树形结构扁平化，并重新计算布局。
   * 
   * @param items - 菜单项数组
   * 
   * @example
   * ```ts
   * engine.setItems([
   *   { id: '1', label: '首页' },
   *   { id: '2', label: '产品', children: [...] }
   * ])
   * ```
   */
  setItems(items: MenuItem[]): void {
    this.items = items
    this.flatItems = flattenTree(items)
    this.calculateLayout()
  }

  /**
   * 更新配置
   * 
   * @description
   * 动态更新布局配置，并重新计算布局。
   * 
   * @param config - 部分配置对象
   * 
   * @example
   * ```ts
   * engine.updateConfig({
   *   itemHeight: 50,
   *   indent: 30
   * })
   * ```
   */
  updateConfig(config: Partial<MenuConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
    this.calculateLayout()
  }

  /**
   * 计算布局
   * 
   * @description
   * 根据当前模式（横向/纵向）计算所有菜单项的位置。
   * 
   * @private
   */
  private calculateLayout(): void {
    this.itemPositions.clear()

    if (this.config.mode === 'horizontal') {
      this.calculateHorizontalLayout()
    }
    else {
      this.calculateVerticalLayout()
    }
  }

  /**
   * 计算横向布局
   * 
   * @description
   * 计算横向菜单的布局位置，只计算第一级菜单项（根级别）。
   * 子菜单通过 popup 方式显示，不参与主布局计算。
   * 
   * @private
   */
  private calculateHorizontalLayout(): void {
    let currentX = 0
    const itemHeight = this.config.itemHeight || 40
    const indent = this.config.indent || 24

    // 只计算第一级菜单项的位置
    this.flatItems
      .filter(item => item.level === 0)
      .forEach((item) => {
        this.itemPositions.set(item.id, {
          x: currentX,
          y: 0,
        })

        // 估算宽度（实际宽度需要在渲染后获取）
        // 基于文本长度估算，实际可能需要测量
        const estimatedWidth = item.label.length * 14 + indent * 2
        currentX += estimatedWidth
      })
  }

  /**
   * 计算纵向布局
   * 
   * @description
   * 计算纵向菜单的布局位置，包括所有层级的菜单项。
   * 每个层级根据缩进值向右偏移。
   * 
   * @private
   */
  private calculateVerticalLayout(): void {
    const itemHeight = this.config.itemHeight || 40
    const indent = this.config.indent || 24
    let currentY = 0

    this.flatItems.forEach((item) => {
      // 根据层级计算水平偏移
      const x = item.level * indent

      this.itemPositions.set(item.id, {
        x,
        y: currentY,
      })

      currentY += itemHeight
    })
  }

  /**
   * 获取布局结果
   */
  getLayout(): LayoutResult {
    const visibleItems = this.getVisibleItems()
    const totalSize = this.getTotalSize()

    return {
      visibleRange: {
        start: 0,
        end: visibleItems.length - 1,
      },
      totalSize,
      offset: 0,
      itemPositions: this.itemPositions,
    }
  }

  /**
   * 获取可见的菜单项
   */
  private getVisibleItems(): FlatMenuItem[] {
    return this.flatItems.filter(item => !item.hidden)
  }

  /**
   * 获取总尺寸
   */
  private getTotalSize(): number {
    const itemHeight = this.config.itemHeight || 40
    const visibleItems = this.getVisibleItems()

    if (this.config.mode === 'horizontal') {
      // 横向模式：返回总宽度
      let totalWidth = 0
      this.itemPositions.forEach((pos) => {
        totalWidth = Math.max(totalWidth, pos.x)
      })
      return totalWidth
    }
    else {
      // 纵向模式：返回总高度
      return visibleItems.length * itemHeight
    }
  }

  /**
   * 获取菜单项位置
   */
  getItemPosition(itemId: string | number): Position | undefined {
    return this.itemPositions.get(itemId)
  }

  /**
   * 计算收起模式的宽度
   */
  getCollapsedWidth(): string {
    return this.config.collapsedWidth || '64px'
  }

  /**
   * 计算展开模式的宽度
   */
  getExpandedWidth(): string {
    return this.config.width || '240px'
  }

  /**
   * 判断是否需要响应式处理
   */
  shouldResponsive(containerWidth: number): boolean {
    if (!this.config.responsive) {
      return false
    }

    const breakpoint = this.config.breakpoint || 768
    return containerWidth < breakpoint
  }

  /**
   * 计算响应式菜单项
   */
  calculateResponsiveItems(containerWidth: number): {
    visibleItems: MenuItem[]
    overflowItems: MenuItem[]
  } {
    if (!this.shouldResponsive(containerWidth)) {
      return {
        visibleItems: this.items,
        overflowItems: [],
      }
    }

    // 简单实现：将所有子菜单移到"更多"中
    const visibleItems: MenuItem[] = []
    const overflowItems: MenuItem[] = []

    let currentWidth = 0
    const indent = this.config.indent || 24

    this.items.forEach((item) => {
      const estimatedWidth = item.label.length * 14 + indent * 2
      if (currentWidth + estimatedWidth <= containerWidth - 100) {
        visibleItems.push(item)
        currentWidth += estimatedWidth
      }
      else {
        overflowItems.push(item)
      }
    })

    return {
      visibleItems,
      overflowItems,
    }
  }

  /**
   * 获取扁平化的菜单项
   */
  getFlatItems(): FlatMenuItem[] {
    return this.flatItems
  }
}


