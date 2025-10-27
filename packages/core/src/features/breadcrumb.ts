/**
 * 面包屑导航功能模块
 * 
 * @description
 * 自动生成和管理面包屑导航，显示当前菜单项的完整路径。
 * 支持点击导航、自定义分隔符、响应式收起等功能。
 */

import type { MenuItem } from '../types'
import { getMenuItemParents } from '../utils/tree-utils'

/**
 * 面包屑项接口
 */
export interface BreadcrumbItem {
  /** 菜单项 ID */
  id: string | number
  /** 显示标签 */
  label: string
  /** 路由路径（可选） */
  path?: string
  /** 图标（可选） */
  icon?: any
  /** 是否可点击 */
  clickable: boolean
}

/**
 * 面包屑配置接口
 */
export interface BreadcrumbConfig {
  /** 分隔符 */
  separator: string
  /** 最大显示项数（超出部分用...代替） */
  maxItems: number
  /** 是否显示根节点 */
  showRoot: boolean
  /** 是否显示当前项 */
  showCurrent: boolean
  /** 点击回调 */
  onClick?: (item: BreadcrumbItem) => void
  /** 自定义渲染函数 */
  render?: (items: BreadcrumbItem[]) => HTMLElement
}

/**
 * 面包屑管理器类
 * 
 * @description
 * 管理菜单的面包屑导航，根据当前激活的菜单项生成面包屑路径。
 * 
 * @example
 * ```ts
 * const breadcrumb = new BreadcrumbManager({
 *   separator: '/',
 *   maxItems: 5,
 *   onClick: (item) => {
 *     console.log('点击面包屑:', item.label)
 *     menu.selectItem(item.id)
 *   }
 * })
 * 
 * // 生成面包屑
 * const items = breadcrumb.generate(menuItems, '2-1')
 * // 返回: [{ label: '首页' }, { label: '产品' }, { label: '产品A' }]
 * 
 * // 渲染面包屑
 * const element = breadcrumb.render(items)
 * container.appendChild(element)
 * ```
 */
export class BreadcrumbManager {
  private config: Required<BreadcrumbConfig>

  constructor(config: Partial<BreadcrumbConfig> = {}) {
    this.config = {
      separator: config.separator ?? '/',
      maxItems: config.maxItems ?? 10,
      showRoot: config.showRoot ?? true,
      showCurrent: config.showCurrent ?? true,
      onClick: config.onClick,
      render: config.render,
    }
  }

  /**
   * 生成面包屑项
   * 
   * @description
   * 根据菜单项ID生成完整的面包屑路径。
   * 包含从根节点到当前节点的所有父级节点。
   * 
   * @param menuItems - 菜单项数组
   * @param activeId - 当前激活的菜单项ID
   * @returns 面包屑项数组
   * 
   * @example
   * ```ts
   * const items = breadcrumb.generate(menuItems, '2-1')
   * console.log(items.map(item => item.label))
   * // 输出: ['首页', '产品', '产品A']
   * ```
   */
  generate(menuItems: MenuItem[], activeId: string | number): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = []

    // 获取所有父级节点
    const parents = getMenuItemParents(menuItems, activeId)

    // 添加根节点（如果配置启用）
    if (this.config.showRoot && parents.length > 0) {
      parents.forEach((parent) => {
        breadcrumbs.push({
          id: parent.id,
          label: parent.label,
          path: parent.path,
          icon: parent.icon,
          clickable: true,
        })
      })
    }

    // 添加当前节点（如果配置启用）
    if (this.config.showCurrent) {
      const currentItem = this.findItem(menuItems, activeId)
      if (currentItem) {
        breadcrumbs.push({
          id: currentItem.id,
          label: currentItem.label,
          path: currentItem.path,
          icon: currentItem.icon,
          clickable: false, // 当前项通常不可点击
        })
      }
    }

    // 处理最大项数限制
    return this.limitItems(breadcrumbs)
  }

  /**
   * 查找菜单项
   * 
   * @description
   * 在菜单树中查找指定ID的菜单项。
   * 
   * @param items - 菜单项数组
   * @param id - 菜单项ID
   * @returns 找到的菜单项，未找到返回 null
   * 
   * @private
   */
  private findItem(items: MenuItem[], id: string | number): MenuItem | null {
    for (const item of items) {
      if (item.id === id) {
        return item
      }
      if (item.children) {
        const found = this.findItem(item.children, id)
        if (found) {
          return found
        }
      }
    }
    return null
  }

  /**
   * 限制面包屑项数量
   * 
   * @description
   * 当面包屑项超过最大数量时，中间部分用省略号代替。
   * 始终保留首尾项，确保用户能看到起点和终点。
   * 
   * @param items - 面包屑项数组
   * @returns 限制后的面包屑项数组
   * 
   * @private
   * 
   * @example
   * ```ts
   * // 输入: [A, B, C, D, E, F, G]（maxItems=5）
   * // 输出: [A, B, ..., F, G]
   * ```
   */
  private limitItems(items: BreadcrumbItem[]): BreadcrumbItem[] {
    if (items.length <= this.config.maxItems) {
      return items
    }

    const { maxItems } = this.config
    const ellipsisItem: BreadcrumbItem = {
      id: 'ellipsis',
      label: '...',
      clickable: false,
    }

    // 保留前2项和后2项，中间用省略号
    const keepStart = Math.floor((maxItems - 1) / 2)
    const keepEnd = maxItems - 1 - keepStart

    return [
      ...items.slice(0, keepStart),
      ellipsisItem,
      ...items.slice(-keepEnd),
    ]
  }

  /**
   * 渲染面包屑
   * 
   * @description
   * 将面包屑项数组渲染为 DOM 元素。
   * 支持自定义渲染函数。
   * 
   * @param items - 面包屑项数组
   * @returns 面包屑 DOM 元素
   * 
   * @example
   * ```ts
   * const items = breadcrumb.generate(menuItems, '2-1')
   * const element = breadcrumb.render(items)
   * document.getElementById('breadcrumb').appendChild(element)
   * ```
   */
  render(items: BreadcrumbItem[]): HTMLElement {
    // 使用自定义渲染函数
    if (this.config.render) {
      return this.config.render(items)
    }

    // 默认渲染
    const container = document.createElement('nav')
    container.className = 'ldesign-breadcrumb'
    container.setAttribute('aria-label', 'Breadcrumb')

    const list = document.createElement('ol')
    list.className = 'ldesign-breadcrumb__list'

    items.forEach((item, index) => {
      const listItem = document.createElement('li')
      listItem.className = 'ldesign-breadcrumb__item'

      // 图标
      if (item.icon) {
        const icon = document.createElement('span')
        icon.className = 'ldesign-breadcrumb__icon'
        if (typeof item.icon === 'string') {
          icon.innerHTML = item.icon
        }
        listItem.appendChild(icon)
      }

      // 标签
      if (item.clickable) {
        const link = document.createElement('a')
        link.className = 'ldesign-breadcrumb__link'
        link.textContent = item.label
        link.href = item.path || '#'
        link.setAttribute('data-id', String(item.id))

        // 点击事件
        link.addEventListener('click', (e) => {
          e.preventDefault()
          if (this.config.onClick) {
            this.config.onClick(item)
          }
        })

        listItem.appendChild(link)
      }
      else {
        const span = document.createElement('span')
        span.className = 'ldesign-breadcrumb__text'
        span.textContent = item.label
        listItem.appendChild(span)
      }

      // 分隔符（最后一项不显示）
      if (index < items.length - 1) {
        const separator = document.createElement('span')
        separator.className = 'ldesign-breadcrumb__separator'
        separator.textContent = this.config.separator
        separator.setAttribute('aria-hidden', 'true')
        listItem.appendChild(separator)
      }

      list.appendChild(listItem)
    })

    container.appendChild(list)
    return container
  }

  /**
   * 更新配置
   * 
   * @description
   * 动态更新面包屑配置。
   * 
   * @param config - 部分配置对象
   * 
   * @example
   * ```ts
   * breadcrumb.updateConfig({
   *   separator: '>',
   *   maxItems: 8
   * })
   * ```
   */
  updateConfig(config: Partial<BreadcrumbConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    } as Required<BreadcrumbConfig>
  }
}

/**
 * 创建面包屑HTML
 * 
 * @description
 * 便捷函数，快速创建面包屑导航的HTML结构。
 * 
 * @param items - 面包屑项数组
 * @param config - 面包屑配置
 * @returns 面包屑 DOM 元素
 * 
 * @example
 * ```ts
 * const breadcrumbEl = createBreadcrumb(items, {
 *   separator: '>',
 *   onClick: (item) => navigateTo(item.path)
 * })
 * ```
 */
export function createBreadcrumb(
  items: BreadcrumbItem[],
  config?: Partial<BreadcrumbConfig>,
): HTMLElement {
  const manager = new BreadcrumbManager(config)
  return manager.render(items)
}

/**
 * 从菜单项生成面包屑
 * 
 * @description
 * 一步生成面包屑导航。
 * 
 * @param menuItems - 菜单项数组
 * @param activeId - 当前激活的菜单项ID
 * @param config - 面包屑配置
 * @returns 面包屑 DOM 元素
 * 
 * @example
 * ```ts
 * const breadcrumb = generateBreadcrumb(menuItems, '2-1', {
 *   separator: '>'
 * })
 * 
 * document.getElementById('breadcrumb-container').appendChild(breadcrumb)
 * ```
 */
export function generateBreadcrumb(
  menuItems: MenuItem[],
  activeId: string | number,
  config?: Partial<BreadcrumbConfig>,
): HTMLElement {
  const manager = new BreadcrumbManager(config)
  const items = manager.generate(menuItems, activeId)
  return manager.render(items)
}


