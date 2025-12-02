/**
 * 菜单管理器
 * 核心状态管理和事件处理
 * @module managers/menu-manager
 */

import type {
  MenuConfig,
  MenuEventMap,
  MenuItem,
  MenuState,
} from '../types'
import type { MenuFilterConfig } from './menu-filter'
import { DEFAULT_MENU_CONFIG, DEFAULT_MENU_STATE } from '../types'
import { EventEmitter, findItemByKey, getItemPath, getParentKeys, hasChildren } from '../utils'
import { filterMenuItems } from './menu-filter'

/**
 * 菜单管理器配置
 */
export interface MenuManagerConfig extends MenuConfig {
  /**
   * 初始选中的菜单项 key
   */
  defaultSelectedKey?: string

  /**
   * 初始展开的菜单项 key 列表
   */
  defaultOpenKeys?: string[]

  /**
   * 权限过滤配置
   */
  filterConfig?: MenuFilterConfig
}

/**
 * 菜单管理器
 * 提供菜单的核心状态管理和事件处理功能
 */
export class MenuManager {
  /** 配置 */
  private config: Required<MenuConfig>

  /** 原始菜单数据 */
  private rawItems: MenuItem[]

  /** 过滤后的菜单数据 */
  private filteredItems: MenuItem[]

  /** 当前状态 */
  private state: MenuState

  /** 事件发射器 */
  private emitter = new EventEmitter<MenuEventMap>()

  /** 过滤配置 */
  private filterConfig: MenuFilterConfig

  /**
   * 创建菜单管理器
   * @param config - 菜单配置
   */
  constructor(config: MenuManagerConfig) {
    const { items, defaultSelectedKey, defaultOpenKeys, filterConfig, ...rest } = config

    // 合并默认配置
    this.config = {
      ...DEFAULT_MENU_CONFIG,
      ...rest,
      items: [],
    }

    this.rawItems = items
    this.filterConfig = filterConfig || {}
    this.filteredItems = filterMenuItems(items, this.filterConfig)

    // 初始化状态
    this.state = {
      ...DEFAULT_MENU_STATE,
      selectedKey: defaultSelectedKey,
      openKeys: defaultOpenKeys || [],
      activePath: defaultSelectedKey
        ? getParentKeys(this.filteredItems, defaultSelectedKey)
        : [],
    }

    // 如果有默认选中项，确保其父级展开（初始化时强制展开）
    if (defaultSelectedKey && this.config.autoExpandParent) {
      this.ensureOpenForKey(defaultSelectedKey, true)
    }
  }

  /**
   * 获取当前配置
   */
  getConfig(): Required<MenuConfig> {
    return { ...this.config }
  }

  /**
   * 获取过滤后的菜单项
   */
  getItems(): MenuItem[] {
    return this.filteredItems
  }

  /**
   * 获取原始菜单项
   */
  getRawItems(): MenuItem[] {
    return this.rawItems
  }

  /**
   * 获取当前状态
   */
  getState(): MenuState {
    return { ...this.state }
  }

  /**
   * 获取选中的菜单项 key
   */
  getSelectedKey(): string | undefined {
    return this.state.selectedKey
  }

  /**
   * 获取展开的菜单项 key 列表
   */
  getOpenKeys(): string[] {
    return [...this.state.openKeys]
  }

  /**
   * 选中菜单项
   * @param key - 菜单项 key
   * @param event - 原始事件
   */
  select(key: string, event?: Event): void {
    const item = findItemByKey(this.filteredItems, key)

    // 如果找不到菜单项，可能是使用插槽模式（items 为空）
    // 此时创建临时菜单项并触发事件，以支持插槽模式下的路由跳转
    if (!item) {
      // 更新状态
      this.state.selectedKey = key
      this.state.activePath = []

      // 创建临时菜单项
      const tempItem: MenuItem = { key, type: 'item' }

      // 触发事件
      this.emitter.emit('select', {
        key,
        item: tempItem,
        path: { keys: [key], items: [tempItem] },
        event,
      })
      return
    }

    // 分隔线不可选中
    if (item.type === 'divider') {
      return
    }

    // 检查是否禁用
    if ('disabled' in item && item.disabled) {
      return
    }

    // 如果是有子项的菜单，不选中，而是切换展开状态
    if (hasChildren(item)) {
      this.toggleOpen(key)
      return
    }

    // 更新状态
    const path = getItemPath(this.filteredItems, key)
    this.state.selectedKey = key
    this.state.activePath = path ? path.keys.slice(0, -1) : []

    // 确保父级展开
    this.ensureOpenForKey(key)

    // 触发事件
    this.emitter.emit('select', {
      key,
      item,
      path: path || { keys: [key], items: [item] },
      event,
    })
  }

  /**
   * 切换子菜单展开状态
   * @param key - 子菜单 key
   */
  toggleOpen(key: string): void {
    const isOpen = this.state.openKeys.includes(key)
    if (isOpen) {
      this.close(key)
    }
    else {
      this.open(key)
    }
  }

  /**
   * 展开子菜单
   * @param key - 子菜单 key
   */
  open(key: string): void {
    if (this.state.openKeys.includes(key)) {
      return
    }

    let newOpenKeys = [...this.state.openKeys]

    // 手风琴模式：关闭同级其他菜单
    if (this.config.accordion || this.config.topLevelExclusive) {
      const siblings = this.getSiblingKeys(key)
      newOpenKeys = newOpenKeys.filter(k => !siblings.includes(k))
    }

    newOpenKeys.push(key)
    this.state.openKeys = newOpenKeys

    this.emitter.emit('openChange', {
      key,
      open: true,
      openKeys: [...newOpenKeys],
    })
  }

  /**
   * 收起子菜单
   * @param key - 子菜单 key
   */
  close(key: string): void {
    if (!this.state.openKeys.includes(key)) {
      return
    }

    this.state.openKeys = this.state.openKeys.filter(k => k !== key)

    this.emitter.emit('openChange', {
      key,
      open: false,
      openKeys: [...this.state.openKeys],
    })
  }

  /**
   * 设置展开的菜单项
   * @param keys - 展开的菜单项 key 列表
   */
  setOpenKeys(keys: string[]): void {
    this.state.openKeys = [...keys]
  }

  /**
   * 展开所有菜单
   */
  openAll(): void {
    const allKeys = this.getAllSubmenuKeys()
    this.state.openKeys = allKeys
  }

  /**
   * 收起所有菜单
   */
  closeAll(): void {
    this.state.openKeys = []
  }

  /**
   * 设置折叠状态
   * @param collapsed - 是否折叠
   */
  setCollapsed(collapsed: boolean): void {
    this.config.collapsed = collapsed
    this.emitter.emit('collapse', { collapsed })
  }

  /**
   * 切换折叠状态
   */
  toggleCollapsed(): void {
    this.setCollapsed(!this.config.collapsed)
  }

  /**
   * 设置悬停的菜单项
   * @param key - 菜单项 key（null 表示离开）
   */
  setHoverKey(key: string | null): void {
    const prevKey = this.state.hoverKey
    if (prevKey === key) {
      return
    }

    this.state.hoverKey = key ?? undefined

    const item = key ? findItemByKey(this.filteredItems, key) ?? null : null
    this.emitter.emit('hover', { key, item })
  }

  /**
   * 更新菜单数据
   * @param items - 新的菜单数据
   */
  updateItems(items: MenuItem[]): void {
    this.rawItems = items
    this.filteredItems = filterMenuItems(items, this.filterConfig)

    // 如果当前选中项不存在了，清除选中状态
    if (this.state.selectedKey) {
      const item = findItemByKey(this.filteredItems, this.state.selectedKey)
      if (!item) {
        this.state.selectedKey = undefined
        this.state.activePath = []
      }
    }

    // 清理不存在的展开项
    this.state.openKeys = this.state.openKeys.filter((key) => {
      const item = findItemByKey(this.filteredItems, key)
      return item && hasChildren(item)
    })
  }

  /**
   * 更新过滤配置
   * @param config - 过滤配置
   */
  updateFilterConfig(config: MenuFilterConfig): void {
    this.filterConfig = config
    this.filteredItems = filterMenuItems(this.rawItems, config)
  }

  /**
   * 订阅事件
   * @param event - 事件名称
   * @param handler - 事件处理函数
   * @returns 取消订阅函数
   */
  on<K extends keyof MenuEventMap>(
    event: K,
    handler: (params: MenuEventMap[K]) => void,
  ): () => void {
    return this.emitter.on(event, handler)
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    this.emitter.clear()
  }

  /**
   * 确保指定菜单项的父级都展开
   * @param key - 菜单项 key
   * @param force - 是否强制展开（忽略 autoExpandParent 配置）
   */
  private ensureOpenForKey(key: string, force = false): void {
    // 如果未启用自动展开父级且非强制，则不处理
    if (!force && !this.config.autoExpandParent) {
      return
    }

    const parentKeys = getParentKeys(this.filteredItems, key)
    for (const parentKey of parentKeys) {
      if (!this.state.openKeys.includes(parentKey)) {
        this.state.openKeys.push(parentKey)
      }
    }
  }

  /**
   * 获取同级菜单的 key 列表
   * @param key - 菜单项 key
   * @returns 同级菜单 key 列表
   */
  private getSiblingKeys(key: string): string[] {
    const path = getItemPath(this.filteredItems, key)
    if (!path || path.keys.length <= 1) {
      // 顶级菜单，返回所有顶级菜单的 key
      return this.filteredItems
        .filter(item => hasChildren(item) && 'key' in item && item.key !== key)
        .map(item => (item as { key: string }).key)
    }

    // 找到父级菜单
    const parentKey = path.keys[path.keys.length - 2]
    const parentItem = findItemByKey(this.filteredItems, parentKey)
    if (!parentItem || !hasChildren(parentItem)) {
      return []
    }

    return parentItem.children
      .filter(item => hasChildren(item) && 'key' in item && item.key !== key)
      .map(item => (item as { key: string }).key)
  }

  /**
   * 获取所有子菜单的 key
   * @returns 所有子菜单 key 列表
   */
  private getAllSubmenuKeys(): string[] {
    const keys: string[] = []

    const walk = (items: MenuItem[]) => {
      for (const item of items) {
        if (hasChildren(item)) {
          keys.push(item.key)
          walk(item.children)
        }
      }
    }

    walk(this.filteredItems)
    return keys
  }
}

