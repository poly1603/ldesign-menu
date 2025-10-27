/**
 * 菜单管理器模块 - 核心类
 * 
 * @description
 * 菜单系统的核心管理器，负责统筹所有子模块，管理菜单的完整生命周期。
 * 提供完整的菜单功能，包括渲染、事件处理、状态管理、动画控制等。
 */

import { nanoid } from 'nanoid'
import type { DEFAULT_MENU_CONFIG, FlatMenuItem, MenuConfig, MenuItem, MenuItemState } from '../types'
import { findMenuItem, getMenuItemChildrenIds, getMenuItemParents, getMenuItemSiblingIds } from '../utils/tree-utils'
import { createElement, setData, setStyle } from '../utils/dom-utils'
import { AnimationController } from './animation-controller'
import { EventDelegator } from './event-delegator'
import { EventEmitter } from './event-emitter'
import { LayoutEngine } from './layout-engine'
import { PopupManager } from './popup-manager'
import { VirtualScroller } from './virtual-scroller'

/**
 * 菜单管理器类
 * 
 * @description
 * 菜单组件的核心管理类，继承自 EventEmitter 提供事件功能。
 * 统一管理菜单的渲染、交互、动画、布局等所有功能模块。
 * 
 * @example
 * ```ts
 * // 创建菜单实例
 * const menu = new MenuManager({
 *   mode: 'vertical',
 *   theme: 'light',
 *   items: [
 *     { id: '1', label: '首页', icon: '🏠' },
 *     { 
 *       id: '2', 
 *       label: '产品',
 *       children: [
 *         { id: '2-1', label: '产品A' },
 *         { id: '2-2', label: '产品B' }
 *       ]
 *     }
 *   ],
 *   onSelect: (item) => {
 *     console.log('选中:', item.label)
 *   }
 * })
 * 
 * // 挂载到DOM
 * menu.mount('#app')
 * 
 * // 操作菜单
 * menu.expand('2')           // 展开菜单项
 * menu.selectItem('2-1')     // 选中菜单项
 * menu.setCollapsed(true)    // 收起菜单
 * 
 * // 销毁
 * menu.destroy()
 * ```
 */
export class MenuManager extends EventEmitter {
  private config: Required<MenuConfig>
  private container: HTMLElement | null = null
  private items: MenuItem[] = []

  // 状态管理
  private expandedKeys: Set<string | number> = new Set()
  private activeKey: string | number | null = null
  private collapsed = false
  private itemStates: Map<string | number, MenuItemState> = new Map()

  // 子模块
  private layoutEngine: LayoutEngine
  private popupManager: PopupManager
  private animationController: AnimationController
  private eventDelegator: EventDelegator
  private virtualScroller: VirtualScroller

  constructor(config: MenuConfig = {}) {
    super()

    // 合并默认配置
    this.config = {
      mode: config.mode || 'vertical',
      theme: config.theme || 'light',
      items: config.items || [],
      expandMode: config.expandMode || 'hover',
      submenuTrigger: config.submenuTrigger || 'popup',
      collapsed: config.collapsed || false,
      defaultExpandedKeys: config.defaultExpandedKeys || [],
      defaultActiveKey: config.defaultActiveKey || '',
      accordion: config.accordion || false,
      width: config.width || '240px',
      collapsedWidth: config.collapsedWidth || '64px',
      indent: config.indent || 24,
      itemHeight: config.itemHeight || 40,
      popupOffset: config.popupOffset || 4,
      virtualScroll: config.virtualScroll || false,
      virtualThreshold: config.virtualThreshold || 100,
      lazyLoad: config.lazyLoad || false,
      animation: config.animation !== false,
      animationType: config.animationType || 'slide',
      animationDuration: config.animationDuration || 300,
      animationEasing: config.animationEasing || 'cubic-bezier(0.4, 0, 0.2, 1)',
      responsive: config.responsive || false,
      collapseMode: config.collapseMode || 'more',
      breakpoint: config.breakpoint || 768,
      keyboardNavigation: config.keyboardNavigation !== false,
      onSelect: config.onSelect,
      onExpand: config.onExpand,
      onCollapse: config.onCollapse,
      onClick: config.onClick,
      onCollapsedChange: config.onCollapsedChange,
    }

    this.items = this.config.items
    this.collapsed = this.config.collapsed
    this.expandedKeys = new Set(this.config.defaultExpandedKeys)
    this.activeKey = this.config.defaultActiveKey || null

    // 初始化子模块
    this.layoutEngine = new LayoutEngine(this.config)
    this.popupManager = new PopupManager(this.config.popupOffset)
    this.animationController = new AnimationController({
      type: this.config.animationType,
      duration: this.config.animationDuration,
      easing: this.config.animationEasing,
    })
    this.eventDelegator = new EventDelegator({
      onItemClick: this.handleItemClick.bind(this),
      onItemHover: this.handleItemHover.bind(this),
      onKeyboardNav: this.handleKeyboardNav.bind(this),
    })
    this.virtualScroller = new VirtualScroller({
      itemHeight: this.config.itemHeight,
      threshold: this.config.virtualThreshold,
    })

    // 设置菜单项
    this.layoutEngine.setItems(this.items)
  }

  /**
   * 挂载到容器
   * 
   * @description
   * 将菜单挂载到指定的 DOM 容器中，开始渲染和事件监听。
   * 支持传入元素对象或 CSS 选择器。
   * 
   * @param containerOrSelector - 容器元素或 CSS 选择器字符串
   * @throws 如果找不到容器元素，抛出错误
   * 
   * @example
   * ```ts
   * // 使用选择器
   * menu.mount('#app')
   * 
   * // 使用元素对象
   * const container = document.getElementById('menu-container')
   * menu.mount(container)
   * ```
   */
  mount(containerOrSelector: HTMLElement | string): void {
    const container = typeof containerOrSelector === 'string'
      ? document.querySelector(containerOrSelector) as HTMLElement
      : containerOrSelector

    if (!container) {
      throw new Error('Container not found')
    }

    this.container = container
    this.render()
    this.eventDelegator.attach(container)
  }

  /**
   * 渲染菜单
   * 
   * @description
   * 完整渲染菜单的 DOM 结构。
   * 清空容器，设置样式和属性，创建菜单项元素。
   * 
   * @todo 优化为增量更新机制，避免每次都完全重新渲染
   * 
   * @private
   */
  private render(): void {
    if (!this.container) {
      return
    }

    // 清空容器（性能注意：会触发大量 DOM 操作）
    this.container.innerHTML = ''

    // 设置容器类名和属性
    this.container.className = this.getContainerClasses()
    setData(this.container, 'mode', this.config.mode)
    setData(this.container, 'theme', this.config.theme)

    // 设置容器样式
    this.updateContainerStyles()

    // 渲染菜单项
    const menuList = this.renderMenuItems(this.items, 0)
    this.container.appendChild(menuList)
  }

  /**
   * 获取容器类名
   */
  private getContainerClasses(): string {
    const classes = [
      'ldesign-menu',
      `ldesign-menu--${this.config.mode}`,
      `ldesign-menu--${this.config.theme}`,
    ]

    if (this.collapsed) {
      classes.push('ldesign-menu--collapsed')
    }

    return classes.join(' ')
  }

  /**
   * 更新容器样式
   */
  private updateContainerStyles(): void {
    if (!this.container) {
      return
    }

    const width = this.collapsed
      ? this.config.collapsedWidth
      : this.config.width

    if (this.config.mode === 'vertical') {
      setStyle(this.container, {
        width: typeof width === 'number' ? `${width}px` : width,
      })
    }
  }

  /**
   * 渲染菜单项列表
   */
  private renderMenuItems(items: MenuItem[], level: number): HTMLElement {
    const menuList = createElement('ul', 'ldesign-menu-list')
    setData(menuList, 'level', String(level))

    items.forEach((item) => {
      if (item.hidden) {
        return
      }

      const menuItem = this.renderMenuItem(item, level)
      menuList.appendChild(menuItem)
    })

    return menuList
  }

  /**
   * 渲染单个菜单项
   */
  private renderMenuItem(item: MenuItem, level: number): HTMLElement {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = this.expandedKeys.has(item.id)
    const isActive = this.activeKey === item.id

    // 创建菜单项元素
    const menuItem = createElement('li', 'ldesign-menu-item')
    setData(menuItem, 'menu-item-id', String(item.id))
    setData(menuItem, 'level', String(level))

    if (item.disabled) {
      menuItem.classList.add('ldesign-menu-item--disabled')
    }
    if (isActive) {
      menuItem.classList.add('ldesign-menu-item--active')
    }
    if (hasChildren) {
      menuItem.classList.add('ldesign-menu-item--has-children')
    }
    if (isExpanded) {
      menuItem.classList.add('ldesign-menu-item--expanded')
    }

    // 创建菜单项内容
    const itemContent = createElement('div', 'ldesign-menu-item__content')
    itemContent.setAttribute('tabindex', item.disabled ? '-1' : '0')
    itemContent.setAttribute('role', 'menuitem')

    // 图标
    if (item.icon) {
      const iconEl = createElement('span', 'ldesign-menu-item__icon')
      if (typeof item.icon === 'string') {
        iconEl.innerHTML = item.icon
      }
      itemContent.appendChild(iconEl)
    }

    // 标签
    if (!this.collapsed || level > 0) {
      const labelEl = createElement('span', 'ldesign-menu-item__label')
      labelEl.textContent = item.label
      itemContent.appendChild(labelEl)

      // 角标
      if (item.badge) {
        const badgeEl = createElement('span', 'ldesign-menu-item__badge')
        badgeEl.textContent = String(item.badge)
        itemContent.appendChild(badgeEl)
      }

      // 展开箭头
      if (hasChildren && this.config.submenuTrigger === 'inline') {
        const arrowEl = createElement('span', 'ldesign-menu-item__arrow')
        arrowEl.innerHTML = '▶'
        itemContent.appendChild(arrowEl)
      }
    }

    menuItem.appendChild(itemContent)

    // 子菜单
    if (hasChildren && this.config.submenuTrigger === 'inline' && isExpanded) {
      const submenu = this.renderMenuItems(item.children!, level + 1)
      submenu.classList.add('ldesign-menu-submenu')
      menuItem.appendChild(submenu)
    }

    return menuItem
  }

  /**
   * 处理菜单项点击
   */
  private handleItemClick(itemId: string | number, event: MouseEvent): void {
    const item = findMenuItem(this.items, itemId)
    if (!item || item.disabled) {
      return
    }

    // 触发点击事件
    if (this.config.onClick) {
      this.config.onClick(item, event)
    }
    this.emit('click', { item, event })

    const hasChildren = item.children && item.children.length > 0

    if (hasChildren) {
      // 切换展开状态
      this.toggleExpand(itemId)
    }
    else {
      // 选中菜单项
      this.selectItem(itemId)
    }
  }

  /**
   * 处理菜单项悬停
   */
  private handleItemHover(itemId: string | number, event: MouseEvent): void {
    if (this.config.expandMode !== 'hover') {
      return
    }

    const item = findMenuItem(this.items, itemId)
    if (!item || item.disabled) {
      return
    }

    const hasChildren = item.children && item.children.length > 0

    if (hasChildren && this.config.submenuTrigger === 'popup') {
      // 显示 popup 子菜单
      this.showSubmenuPopup(itemId, event.currentTarget as HTMLElement)
    }
  }

  /**
   * 处理键盘导航
   */
  private handleKeyboardNav(key: string, itemId: string | number, event: KeyboardEvent): void {
    this.emit('keyboard-nav', { key, itemId, event })
  }

  /**
   * 展开菜单项
   * 
   * @description
   * 展开指定的菜单项，显示其子菜单。
   * 如果启用了手风琴模式，会自动收起同级的其他菜单项。
   * 触发 onExpand 回调和 expand 事件。
   * 
   * @param itemId - 要展开的菜单项 ID
   * 
   * @example
   * ```ts
   * // 展开"产品"菜单项
   * menu.expand('2')
   * 
   * // 监听展开事件
   * menu.on('expand', ({ item }) => {
   *   console.log('展开了:', item.label)
   * })
   * ```
   */
  expand(itemId: string | number): void {
    const item = findMenuItem(this.items, itemId)
    if (!item || !item.children) {
      return
    }

    // 手风琴模式：关闭同级其他菜单项
    if (this.config.accordion) {
      const parents = this.getItemParents(itemId)
      const siblingIds = this.getSiblingIds(itemId)
      siblingIds.forEach(id => this.collapse(id))
    }

    this.expandedKeys.add(itemId)

    if (this.config.onExpand) {
      this.config.onExpand(item)
    }
    this.emit('expand', { item })

    this.render()
  }

  /**
   * 收起菜单项
   * 
   * @description
   * 收起指定的菜单项，隐藏其子菜单。
   * 同时会递归收起所有子级菜单项。
   * 触发 onCollapse 回调和 collapse 事件。
   * 
   * @param itemId - 要收起的菜单项 ID
   * 
   * @example
   * ```ts
   * // 收起"产品"菜单项
   * menu.collapse('2')
   * 
   * // 监听收起事件
   * menu.on('collapse', ({ item }) => {
   *   console.log('收起了:', item.label)
   * })
   * ```
   */
  collapse(itemId: string | number): void {
    const item = findMenuItem(this.items, itemId)
    if (!item) {
      return
    }

    this.expandedKeys.delete(itemId)

    // 同时收起所有子项，保持状态一致性
    const childrenIds = getMenuItemChildrenIds(item)
    childrenIds.forEach(id => this.expandedKeys.delete(id))

    if (this.config.onCollapse) {
      this.config.onCollapse(item)
    }
    this.emit('collapse', { item })

    this.render()
  }

  /**
   * 切换展开状态
   * 
   * @description
   * 切换菜单项的展开/收起状态。
   * 如果当前是展开的，则收起；如果是收起的，则展开。
   * 
   * @param itemId - 要切换的菜单项 ID
   * 
   * @example
   * ```ts
   * // 点击菜单项时切换展开状态
   * menuItem.addEventListener('click', () => {
   *   menu.toggleExpand('2')
   * })
   * ```
   */
  toggleExpand(itemId: string | number): void {
    if (this.expandedKeys.has(itemId)) {
      this.collapse(itemId)
    }
    else {
      this.expand(itemId)
    }
  }

  /**
   * 选中菜单项
   * 
   * @description
   * 将指定菜单项设置为激活状态（高亮显示）。
   * 通常用于导航到新页面时同步菜单的激活状态。
   * 触发 onSelect 回调和 select 事件。
   * 
   * @param itemId - 要选中的菜单项 ID
   * 
   * @example
   * ```ts
   * // 选中首页菜单项
   * menu.selectItem('1')
   * 
   * // 路由变化时同步菜单状态
   * router.afterEach((to) => {
   *   const menuItem = findMenuItemByPath(menuItems, to.path)
   *   if (menuItem) {
   *     menu.selectItem(menuItem.id)
   *   }
   * })
   * ```
   */
  selectItem(itemId: string | number): void {
    const item = findMenuItem(this.items, itemId)
    if (!item || item.disabled) {
      return
    }

    this.activeKey = itemId

    if (this.config.onSelect) {
      this.config.onSelect(item)
    }
    this.emit('select', { item })

    this.render()
  }

  /**
   * 显示子菜单 Popup
   */
  private showSubmenuPopup(itemId: string | number, triggerElement: HTMLElement): void {
    const item = findMenuItem(this.items, itemId)
    if (!item || !item.children) {
      return
    }

    const placement = this.config.mode === 'horizontal' ? 'bottom-start' : 'right-start'
    const submenu = this.renderMenuItems(item.children, 1)

    this.popupManager.open(
      `submenu-${itemId}`,
      triggerElement,
      submenu,
      placement,
      () => {
        this.emit('popup-close', { itemId })
      },
    )

    this.emit('popup-open', { itemId })
  }

  /**
   * 切换收起状态
   */
  toggleCollapsed(): void {
    this.setCollapsed(!this.collapsed)
  }

  /**
   * 设置收起状态
   */
  setCollapsed(collapsed: boolean): void {
    this.collapsed = collapsed

    if (this.config.onCollapsedChange) {
      this.config.onCollapsedChange(collapsed)
    }
    this.emit('collapsed-change', { collapsed })

    this.updateContainerStyles()
    this.render()
  }

  /**
   * 更新菜单项
   * 
   * @description
   * 动态更新整个菜单的数据，替换为新的菜单项数组。
   * 会重新计算布局并重新渲染菜单。
   * 
   * @param items - 新的菜单项数组
   * 
   * @example
   * ```ts
   * // 动态加载菜单数据
   * fetch('/api/menu').then(res => res.json()).then(data => {
   *   menu.setItems(data.menuItems)
   * })
   * 
   * // 根据权限过滤菜单
   * const filteredItems = filterMenuByPermissions(allItems, userPermissions)
   * menu.setItems(filteredItems)
   * ```
   */
  setItems(items: MenuItem[]): void {
    this.items = items
    this.layoutEngine.setItems(items)
    this.render()
  }

  /**
   * 更新配置
   * 
   * @description
   * 动态更新菜单配置，如主题、模式、动画等。
   * 配置更新后会自动重新渲染菜单。
   * 
   * @param config - 部分配置对象
   * 
   * @example
   * ```ts
   * // 切换到暗色主题
   * menu.updateConfig({ theme: 'dark' })
   * 
   * // 切换到横向模式
   * menu.updateConfig({ mode: 'horizontal' })
   * 
   * // 禁用动画
   * menu.updateConfig({ animation: false })
   * ```
   */
  updateConfig(config: Partial<MenuConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    } as Required<MenuConfig>

    // 同步更新子模块的配置
    this.layoutEngine.updateConfig(this.config)
    this.animationController.updateConfig({
      type: this.config.animationType,
      duration: this.config.animationDuration,
      easing: this.config.animationEasing,
    })

    this.render()
  }

  /**
   * 获取菜单项的父级 ID 数组
   * 
   * @description
   * 获取指定菜单项的所有父级节点ID，从根节点到直接父级按顺序排列。
   * 
   * @param itemId - 菜单项ID
   * @returns 父级ID数组
   */
  private getItemParents(itemId: string | number): (string | number)[] {
    const parents = getMenuItemParents(this.items, itemId)
    return parents.map(item => item.id)
  }

  /**
   * 获取同级菜单项 ID 数组
   * 
   * @description
   * 获取与指定菜单项处于同一层级的所有菜单项ID（兄弟节点），
   * 主要用于手风琴模式下收起其他同级菜单项。
   * 
   * @param itemId - 菜单项ID
   * @returns 同级菜单项ID数组
   */
  private getSiblingIds(itemId: string | number): (string | number)[] {
    return getMenuItemSiblingIds(this.items, itemId)
  }

  /**
   * 卸载菜单
   * 
   * @description
   * 从 DOM 中卸载菜单，清理所有事件监听器和子模块。
   * 释放所有资源，防止内存泄漏。
   * 
   * @example
   * ```ts
   * // 组件卸载时清理
   * onUnmounted(() => {
   *   menu.unmount()
   * })
   * ```
   */
  unmount(): void {
    // 销毁所有子模块
    this.eventDelegator.destroy()
    this.popupManager.destroy()
    this.animationController.destroy()

    // 清空容器
    if (this.container) {
      this.container.innerHTML = ''
      this.container = null
    }

    // 移除所有事件监听器
    this.removeAllListeners()
  }

  /**
   * 销毁菜单实例
   * 
   * @description
   * 完全销毁菜单实例，释放所有资源。
   * 销毁后菜单实例不可再使用。
   * 
   * @example
   * ```ts
   * // 完全销毁菜单
   * menu.destroy()
   * // menu 实例不可再使用
   * ```
   */
  destroy(): void {
    this.unmount()
  }
}


