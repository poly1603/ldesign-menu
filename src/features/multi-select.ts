/**
 * 多选模式功能模块
 * 
 * @description
 * 提供菜单项的多选功能，支持复选框、全选/反选、批量操作等。
 * 适用于需要批量选择菜单项进行操作的场景。
 */

import type { MenuItem } from '../types'
import { findMenuItem, traverseMenuTree } from '../utils/tree-utils'
import { logger } from '../utils/logger'

/**
 * 多选配置接口
 */
export interface MultiSelectConfig {
  /** 是否启用多选模式 */
  enabled: boolean
  /** 是否显示复选框 */
  showCheckbox: boolean
  /** 是否支持级联选择（选中父级时自动选中所有子级） */
  cascade: boolean
  /** 是否严格模式（父子完全独立） */
  strictMode: boolean
  /** 最大选择数量（0表示无限制） */
  maxCount: number
  /** 选择变化回调 */
  onSelectionChange?: (selected: Set<string | number>) => void
}

/**
 * 多选管理器类
 * 
 * @description
 * 管理菜单项的多选功能，支持复选框选择、级联选择、批量操作等。
 * 
 * @example
 * ```ts
 * const multiSelect = new MultiSelectManager({
 *   enabled: true,
 *   showCheckbox: true,
 *   cascade: true,
 *   maxCount: 50,
 *   onSelectionChange: (selected) => {
 *     console.log(`已选中 ${selected.size} 项`)
 *   }
 * })
 * 
 * // 切换选中状态
 * multiSelect.toggle(menuItems, '2')
 * 
 * // 全选
 * multiSelect.selectAll(menuItems)
 * 
 * // 反选
 * multiSelect.invertSelection(menuItems)
 * 
 * // 获取选中项
 * const selected = multiSelect.getSelected()
 * ```
 */
export class MultiSelectManager {
  private config: Required<MultiSelectConfig>
  private selectedKeys: Set<string | number> = new Set()
  private indeterminateKeys: Set<string | number> = new Set()

  constructor(config: Partial<MultiSelectConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      showCheckbox: config.showCheckbox ?? true,
      cascade: config.cascade ?? true,
      strictMode: config.strictMode ?? false,
      maxCount: config.maxCount ?? 0,
      onSelectionChange: config.onSelectionChange,
    }
  }

  /**
   * 切换选中状态
   * 
   * @description
   * 切换菜单项的选中状态。
   * 如果启用级联模式，会同时切换所有子项。
   * 
   * @param menuItems - 菜单项数组
   * @param id - 菜单项ID
   * @returns 切换后的状态（true表示已选中）
   * 
   * @example
   * ```ts
   * const isSelected = multiSelect.toggle(menuItems, '2')
   * console.log(isSelected ? '已选中' : '已取消选中')
   * ```
   */
  toggle(menuItems: MenuItem[], id: string | number): boolean {
    const item = findMenuItem(menuItems, id)
    if (!item) {
      return false
    }

    const isSelected = this.selectedKeys.has(id)

    if (isSelected) {
      // 取消选中
      this.selectedKeys.delete(id)

      // 级联模式：同时取消选中所有子项
      if (this.config.cascade && item.children) {
        this.deselectChildren(item.children)
      }
    }
    else {
      // 检查数量限制
      if (this.config.maxCount > 0 && this.selectedKeys.size >= this.config.maxCount) {
        logger.warn('已达到最大选择数量:', this.config.maxCount)
        return false
      }

      // 选中
      this.selectedKeys.add(id)

      // 级联模式：同时选中所有子项
      if (this.config.cascade && item.children) {
        this.selectChildren(item.children)
      }
    }

    // 更新半选状态
    this.updateIndeterminateState(menuItems)

    this.onChange()
    return !isSelected
  }

  /**
   * 选中菜单项
   * 
   * @description
   * 选中指定的菜单项。
   * 
   * @param menuItems - 菜单项数组
   * @param id - 菜单项ID
   * @returns 是否成功选中
   */
  select(menuItems: MenuItem[], id: string | number): boolean {
    if (this.selectedKeys.has(id)) {
      return true
    }

    const item = findMenuItem(menuItems, id)
    if (!item) {
      return false
    }

    // 检查数量限制
    if (this.config.maxCount > 0 && this.selectedKeys.size >= this.config.maxCount) {
      logger.warn('已达到最大选择数量:', this.config.maxCount)
      return false
    }

    this.selectedKeys.add(id)

    // 级联选择子项
    if (this.config.cascade && item.children) {
      this.selectChildren(item.children)
    }

    this.updateIndeterminateState(menuItems)
    this.onChange()
    return true
  }

  /**
   * 取消选中
   * 
   * @description
   * 取消选中指定的菜单项。
   * 
   * @param menuItems - 菜单项数组
   * @param id - 菜单项ID
   * @returns 是否成功取消选中
   */
  deselect(menuItems: MenuItem[], id: string | number): boolean {
    const item = findMenuItem(menuItems, id)
    if (!item) {
      return false
    }

    this.selectedKeys.delete(id)

    // 级联取消选中子项
    if (this.config.cascade && item.children) {
      this.deselectChildren(item.children)
    }

    this.updateIndeterminateState(menuItems)
    this.onChange()
    return true
  }

  /**
   * 选中所有子项
   * 
   * @description
   * 递归选中所有子菜单项。
   * 
   * @param children - 子菜单项数组
   * 
   * @private
   */
  private selectChildren(children: MenuItem[]): void {
    traverseMenuTree(children, (item) => {
      // 检查数量限制
      if (this.config.maxCount > 0 && this.selectedKeys.size >= this.config.maxCount) {
        return
      }
      this.selectedKeys.add(item.id)
    })
  }

  /**
   * 取消选中所有子项
   * 
   * @description
   * 递归取消选中所有子菜单项。
   * 
   * @param children - 子菜单项数组
   * 
   * @private
   */
  private deselectChildren(children: MenuItem[]): void {
    traverseMenuTree(children, (item) => {
      this.selectedKeys.delete(item.id)
    })
  }

  /**
   * 全选
   * 
   * @description
   * 选中所有菜单项。
   * 
   * @param menuItems - 菜单项数组
   * 
   * @example
   * ```ts
   * multiSelect.selectAll(menuItems)
   * ```
   */
  selectAll(menuItems: MenuItem[]): void {
    this.selectedKeys.clear()

    let count = 0
    traverseMenuTree(menuItems, (item) => {
      // 检查数量限制
      if (this.config.maxCount > 0 && count >= this.config.maxCount) {
        return
      }

      if (!item.disabled) {
        this.selectedKeys.add(item.id)
        count++
      }
    })

    this.onChange()
    logger.debug('全选完成，共选中:', count)
  }

  /**
   * 清空选中
   * 
   * @description
   * 清空所有选中的菜单项。
   * 
   * @example
   * ```ts
   * multiSelect.clearSelection()
   * ```
   */
  clearSelection(): void {
    this.selectedKeys.clear()
    this.indeterminateKeys.clear()
    this.onChange()
    logger.debug('已清空选中')
  }

  /**
   * 反选
   * 
   * @description
   * 反转所有菜单项的选中状态。
   * 
   * @param menuItems - 菜单项数组
   * 
   * @example
   * ```ts
   * multiSelect.invertSelection(menuItems)
   * ```
   */
  invertSelection(menuItems: MenuItem[]): void {
    const newSelected = new Set<string | number>()

    traverseMenuTree(menuItems, (item) => {
      if (!item.disabled) {
        if (!this.selectedKeys.has(item.id)) {
          // 检查数量限制
          if (this.config.maxCount === 0 || newSelected.size < this.config.maxCount) {
            newSelected.add(item.id)
          }
        }
      }
    })

    this.selectedKeys = newSelected
    this.updateIndeterminateState(menuItems)
    this.onChange()
  }

  /**
   * 更新半选状态
   * 
   * @description
   * 更新父节点的半选状态（部分子节点被选中时）。
   * 
   * @param menuItems - 菜单项数组
   * 
   * @private
   */
  private updateIndeterminateState(menuItems: MenuItem[]): void {
    if (!this.config.cascade) {
      return
    }

    this.indeterminateKeys.clear()

    traverseMenuTree(menuItems, (item) => {
      if (!item.children || item.children.length === 0) {
        return
      }

      const allChildrenIds: (string | number)[] = []
      traverseMenuTree(item.children, child => allChildrenIds.push(child.id))

      const selectedChildren = allChildrenIds.filter(id => this.selectedKeys.has(id))

      if (selectedChildren.length > 0 && selectedChildren.length < allChildrenIds.length) {
        // 部分子项被选中，设为半选状态
        this.indeterminateKeys.add(item.id)
      }
    })
  }

  /**
   * 获取选中的菜单项ID
   * 
   * @description
   * 获取所有选中的菜单项ID集合。
   * 
   * @returns 选中的ID集合
   * 
   * @example
   * ```ts
   * const selected = multiSelect.getSelected()
   * console.log('选中数量:', selected.size)
   * ```
   */
  getSelected(): Set<string | number> {
    return new Set(this.selectedKeys)
  }

  /**
   * 获取选中的菜单项数据
   * 
   * @description
   * 获取所有选中的完整菜单项对象。
   * 
   * @param menuItems - 菜单项数组
   * @returns 选中的菜单项数组
   * 
   * @example
   * ```ts
   * const items = multiSelect.getSelectedItems(menuItems)
   * items.forEach(item => {
   *   console.log('选中:', item.label)
   * })
   * ```
   */
  getSelectedItems(menuItems: MenuItem[]): MenuItem[] {
    const result: MenuItem[] = []

    this.selectedKeys.forEach((id) => {
      const item = findMenuItem(menuItems, id)
      if (item) {
        result.push(item)
      }
    })

    return result
  }

  /**
   * 是否选中
   * 
   * @description
   * 检查指定菜单项是否已选中。
   * 
   * @param id - 菜单项ID
   * @returns 是否选中
   */
  isSelected(id: string | number): boolean {
    return this.selectedKeys.has(id)
  }

  /**
   * 是否半选
   * 
   * @description
   * 检查指定菜单项是否处于半选状态（部分子项被选中）。
   * 
   * @param id - 菜单项ID
   * @returns 是否半选
   */
  isIndeterminate(id: string | number): boolean {
    return this.indeterminateKeys.has(id)
  }

  /**
   * 获取选中数量
   * 
   * @returns 选中的菜单项数量
   */
  getCount(): number {
    return this.selectedKeys.size
  }

  /**
   * 是否达到最大数量
   * 
   * @returns 是否已达到最大选择数量
   */
  isMaxReached(): boolean {
    if (this.config.maxCount === 0) {
      return false
    }
    return this.selectedKeys.size >= this.config.maxCount
  }

  /**
   * 状态变化处理
   * 
   * @private
   */
  private onChange(): void {
    if (this.config.onSelectionChange) {
      try {
        this.config.onSelectionChange(new Set(this.selectedKeys))
      }
      catch (error) {
        logger.error('选择变化回调失败:', error)
      }
    }
  }

  /**
   * 更新配置
   * 
   * @description
   * 动态更新多选配置。
   * 
   * @param config - 部分配置对象
   * 
   * @example
   * ```ts
   * multiSelect.updateConfig({
   *   maxCount: 100,
   *   cascade: false
   * })
   * ```
   */
  updateConfig(config: Partial<MultiSelectConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    } as Required<MultiSelectConfig>
  }
}


