/**
 * 菜单管理器 - 核心类
 */

import { nanoid } from 'nanoid'
import type { DEFAULT_MENU_CONFIG, FlatMenuItem, MenuConfig, MenuItem, MenuItemState } from '../types'
import { findMenuItem, getMenuItemChildrenIds } from '../utils/tree-utils'
import { createElement, setData, setStyle } from '../utils/dom-utils'
import { AnimationController } from './animation-controller'
import { EventDelegator } from './event-delegator'
import { EventEmitter } from './event-emitter'
import { LayoutEngine } from './layout-engine'
import { PopupManager } from './popup-manager'
import { VirtualScroller } from './virtual-scroller'

/**
 * 菜单管理器类
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
   */
  private render(): void {
    if (!this.container) {
      return
    }

    // 清空容器
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
   */
  expand(itemId: string | number): void {
    const item = findMenuItem(this.items, itemId)
    if (!item || !item.children) {
      return
    }

    // 手风琴模式：关闭同级其他菜单
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
   */
  collapse(itemId: string | number): void {
    const item = findMenuItem(this.items, itemId)
    if (!item) {
      return
    }

    this.expandedKeys.delete(itemId)

    // 同时收起所有子项
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
   */
  setItems(items: MenuItem[]): void {
    this.items = items
    this.layoutEngine.setItems(items)
    this.render()
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<MenuConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    } as Required<MenuConfig>

    this.layoutEngine.updateConfig(this.config)
    this.animationController.updateConfig({
      type: this.config.animationType,
      duration: this.config.animationDuration,
      easing: this.config.animationEasing,
    })

    this.render()
  }

  /**
   * 获取菜单项的父级 ID
   */
  private getItemParents(itemId: string | number): (string | number)[] {
    // 简化实现
    return []
  }

  /**
   * 获取同级菜单项 ID
   */
  private getSiblingIds(itemId: string | number): (string | number)[] {
    // 简化实现
    return []
  }

  /**
   * 卸载
   */
  unmount(): void {
    this.eventDelegator.destroy()
    this.popupManager.destroy()
    this.animationController.destroy()

    if (this.container) {
      this.container.innerHTML = ''
      this.container = null
    }

    this.removeAllListeners()
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.unmount()
  }
}


