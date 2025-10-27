/**
 * 状态管理器模块
 * 
 * @description
 * 集中管理菜单的所有状态，包括展开项、激活项、收起状态等。
 * 支持状态持久化、历史记录、撤销/重做等功能。
 */

import type { MenuItem } from '../types'
import { logger } from '../utils/logger'

/**
 * 菜单状态接口
 */
export interface MenuState {
  /** 展开的菜单项ID集合 */
  expandedKeys: Set<string | number>
  /** 当前激活的菜单项ID */
  activeKey: string | number | null
  /** 是否收起 */
  collapsed: boolean
  /** 选中的菜单项ID集合（多选模式） */
  selectedKeys: Set<string | number>
  /** 收藏的菜单项ID集合 */
  favoriteKeys: Set<string | number>
  /** 最近访问的菜单项ID数组 */
  recentKeys: (string | number)[]
}

/**
 * 状态历史记录接口
 */
export interface StateSnapshot {
  /** 快照时间戳 */
  timestamp: number
  /** 状态数据 */
  state: MenuState
  /** 操作描述 */
  action?: string
}

/**
 * 状态管理器配置接口
 */
export interface StateManagerConfig {
  /** 是否启用持久化 */
  persistence: boolean
  /** 持久化的存储键 */
  storageKey: string
  /** 最大历史记录数 */
  maxHistory: number
  /** 最大最近访问数 */
  maxRecent: number
  /** 状态变化回调 */
  onChange?: (state: MenuState, prevState: MenuState) => void
}

/**
 * 状态管理器类
 * 
 * @description
 * 集中式状态管理器，管理菜单的所有状态。
 * 支持状态持久化、历史记录、撤销/重做等功能。
 * 
 * @example
 * ```ts
 * const stateManager = new StateManager({
 *   persistence: true,
 *   storageKey: 'ldesign-menu-state',
 *   maxHistory: 50,
 *   onChange: (state, prevState) => {
 *     console.log('状态已变化')
 *   }
 * })
 * 
 * // 操作状态
 * stateManager.setActiveKey('1')
 * stateManager.toggleExpanded('2')
 * stateManager.addFavorite('3')
 * 
 * // 撤销/重做
 * stateManager.undo()
 * stateManager.redo()
 * 
 * // 持久化
 * stateManager.save()
 * stateManager.load()
 * ```
 */
export class StateManager {
  private config: Required<StateManagerConfig>
  private state: MenuState
  private history: StateSnapshot[] = []
  private historyIndex = -1

  constructor(config: Partial<StateManagerConfig> = {}) {
    this.config = {
      persistence: config.persistence ?? true,
      storageKey: config.storageKey ?? 'ldesign-menu-state',
      maxHistory: config.maxHistory ?? 50,
      maxRecent: config.maxRecent ?? 10,
      onChange: config.onChange,
    }

    // 初始化状态
    this.state = this.createInitialState()

    // 尝试从存储加载状态
    if (this.config.persistence) {
      this.load()
    }

    // 记录初始状态
    this.saveSnapshot('初始化')
  }

  /**
   * 创建初始状态
   * 
   * @description
   * 创建默认的菜单状态对象。
   * 
   * @returns 初始状态对象
   * 
   * @private
   */
  private createInitialState(): MenuState {
    return {
      expandedKeys: new Set(),
      activeKey: null,
      collapsed: false,
      selectedKeys: new Set(),
      favoriteKeys: new Set(),
      recentKeys: [],
    }
  }

  /**
   * 获取当前状态
   * 
   * @description
   * 获取当前的菜单状态（深拷贝，防止外部修改）。
   * 
   * @returns 当前状态对象
   * 
   * @example
   * ```ts
   * const state = stateManager.getState()
   * console.log('展开的菜单:', Array.from(state.expandedKeys))
   * console.log('激活项:', state.activeKey)
   * ```
   */
  getState(): MenuState {
    return {
      ...this.state,
      expandedKeys: new Set(this.state.expandedKeys),
      selectedKeys: new Set(this.state.selectedKeys),
      favoriteKeys: new Set(this.state.favoriteKeys),
      recentKeys: [...this.state.recentKeys],
    }
  }

  /**
   * 设置激活项
   * 
   * @description
   * 设置当前激活的菜单项ID，并记录到最近访问。
   * 
   * @param key - 菜单项ID
   * 
   * @example
   * ```ts
   * stateManager.setActiveKey('2-1')
   * ```
   */
  setActiveKey(key: string | number | null): void {
    const prevState = this.getState()
    this.state.activeKey = key

    // 记录到最近访问
    if (key !== null) {
      this.addToRecent(key)
    }

    this.onChange(prevState, '设置激活项')
  }

  /**
   * 切换展开状态
   * 
   * @description
   * 切换菜单项的展开/收起状态。
   * 
   * @param key - 菜单项ID
   * 
   * @example
   * ```ts
   * stateManager.toggleExpanded('2')
   * ```
   */
  toggleExpanded(key: string | number): void {
    const prevState = this.getState()

    if (this.state.expandedKeys.has(key)) {
      this.state.expandedKeys.delete(key)
    }
    else {
      this.state.expandedKeys.add(key)
    }

    this.onChange(prevState, '切换展开状态')
  }

  /**
   * 设置展开项
   * 
   * @description
   * 设置展开的菜单项ID集合。
   * 
   * @param keys - 菜单项ID数组
   * 
   * @example
   * ```ts
   * stateManager.setExpandedKeys(['2', '3'])
   * ```
   */
  setExpandedKeys(keys: (string | number)[]): void {
    const prevState = this.getState()
    this.state.expandedKeys = new Set(keys)
    this.onChange(prevState, '设置展开项')
  }

  /**
   * 切换收起状态
   * 
   * @description
   * 切换菜单的收起/展开状态。
   * 
   * @example
   * ```ts
   * stateManager.toggleCollapsed()
   * ```
   */
  toggleCollapsed(): void {
    const prevState = this.getState()
    this.state.collapsed = !this.state.collapsed
    this.onChange(prevState, '切换收起状态')
  }

  /**
   * 设置收起状态
   * 
   * @description
   * 设置菜单的收起状态。
   * 
   * @param collapsed - 是否收起
   * 
   * @example
   * ```ts
   * stateManager.setCollapsed(true)
   * ```
   */
  setCollapsed(collapsed: boolean): void {
    const prevState = this.getState()
    this.state.collapsed = collapsed
    this.onChange(prevState, '设置收起状态')
  }

  /**
   * 切换选中状态（多选模式）
   * 
   * @description
   * 切换菜单项的选中状态。
   * 
   * @param key - 菜单项ID
   * 
   * @example
   * ```ts
   * stateManager.toggleSelected('1')
   * ```
   */
  toggleSelected(key: string | number): void {
    const prevState = this.getState()

    if (this.state.selectedKeys.has(key)) {
      this.state.selectedKeys.delete(key)
    }
    else {
      this.state.selectedKeys.add(key)
    }

    this.onChange(prevState, '切换选中状态')
  }

  /**
   * 全选
   * 
   * @description
   * 选中所有菜单项。
   * 
   * @param keys - 所有菜单项ID数组
   * 
   * @example
   * ```ts
   * const allIds = getAllMenuIds(menuItems)
   * stateManager.selectAll(allIds)
   * ```
   */
  selectAll(keys: (string | number)[]): void {
    const prevState = this.getState()
    this.state.selectedKeys = new Set(keys)
    this.onChange(prevState, '全选')
  }

  /**
   * 清空选中
   * 
   * @description
   * 清空所有选中的菜单项。
   * 
   * @example
   * ```ts
   * stateManager.clearSelected()
   * ```
   */
  clearSelected(): void {
    const prevState = this.getState()
    this.state.selectedKeys.clear()
    this.onChange(prevState, '清空选中')
  }

  /**
   * 添加收藏
   * 
   * @description
   * 将菜单项添加到收藏夹。
   * 
   * @param key - 菜单项ID
   * 
   * @example
   * ```ts
   * stateManager.addFavorite('2-1')
   * ```
   */
  addFavorite(key: string | number): void {
    const prevState = this.getState()
    this.state.favoriteKeys.add(key)
    this.onChange(prevState, '添加收藏')
  }

  /**
   * 移除收藏
   * 
   * @description
   * 从收藏夹移除菜单项。
   * 
   * @param key - 菜单项ID
   * 
   * @example
   * ```ts
   * stateManager.removeFavorite('2-1')
   * ```
   */
  removeFavorite(key: string | number): void {
    const prevState = this.getState()
    this.state.favoriteKeys.delete(key)
    this.onChange(prevState, '移除收藏')
  }

  /**
   * 添加到最近访问
   * 
   * @description
   * 将菜单项添加到最近访问列表。
   * 自动维护列表大小和去重。
   * 
   * @param key - 菜单项ID
   * 
   * @private
   */
  private addToRecent(key: string | number): void {
    // 移除已存在的
    const index = this.state.recentKeys.indexOf(key)
    if (index !== -1) {
      this.state.recentKeys.splice(index, 1)
    }

    // 添加到开头
    this.state.recentKeys.unshift(key)

    // 限制数量
    if (this.state.recentKeys.length > this.config.maxRecent) {
      this.state.recentKeys.pop()
    }
  }

  /**
   * 获取最近访问
   * 
   * @description
   * 获取最近访问的菜单项ID列表。
   * 
   * @param limit - 返回数量限制
   * @returns 最近访问的ID数组
   * 
   * @example
   * ```ts
   * const recent = stateManager.getRecent(5)
   * console.log('最近访问:', recent)
   * ```
   */
  getRecent(limit?: number): (string | number)[] {
    const count = limit ?? this.config.maxRecent
    return this.state.recentKeys.slice(0, count)
  }

  /**
   * 清空最近访问
   * 
   * @description
   * 清空最近访问历史记录。
   * 
   * @example
   * ```ts
   * stateManager.clearRecent()
   * ```
   */
  clearRecent(): void {
    const prevState = this.getState()
    this.state.recentKeys = []
    this.onChange(prevState, '清空最近访问')
  }

  /**
   * 状态变化处理
   * 
   * @description
   * 状态变化时的统一处理，包括触发回调、保存快照、持久化等。
   * 
   * @param prevState - 之前的状态
   * @param action - 操作描述
   * 
   * @private
   */
  private onChange(prevState: MenuState, action?: string): void {
    // 触发变化回调
    if (this.config.onChange) {
      try {
        this.config.onChange(this.state, prevState)
      }
      catch (error) {
        logger.error('状态变化回调失败:', error)
      }
    }

    // 保存快照到历史
    this.saveSnapshot(action)

    // 持久化
    if (this.config.persistence) {
      this.save()
    }
  }

  /**
   * 保存状态快照
   * 
   * @description
   * 将当前状态保存到历史记录，支持撤销/重做。
   * 
   * @param action - 操作描述
   * 
   * @private
   */
  private saveSnapshot(action?: string): void {
    // 如果当前不在历史末尾，删除后面的记录
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1)
    }

    // 创建快照
    const snapshot: StateSnapshot = {
      timestamp: Date.now(),
      state: this.serializeState(),
      action,
    }

    this.history.push(snapshot)
    this.historyIndex++

    // 限制历史记录数量
    if (this.history.length > this.config.maxHistory) {
      this.history.shift()
      this.historyIndex--
    }
  }

  /**
   * 撤销
   * 
   * @description
   * 撤销到上一个状态。
   * 
   * @returns 是否成功撤销
   * 
   * @example
   * ```ts
   * if (stateManager.undo()) {
   *   console.log('已撤销')
   * }
   * ```
   */
  undo(): boolean {
    if (!this.canUndo()) {
      return false
    }

    this.historyIndex--
    const snapshot = this.history[this.historyIndex]
    this.state = this.deserializeState(snapshot.state)

    logger.debug('撤销操作:', snapshot.action)
    return true
  }

  /**
   * 重做
   * 
   * @description
   * 重做到下一个状态。
   * 
   * @returns 是否成功重做
   * 
   * @example
   * ```ts
   * if (stateManager.redo()) {
   *   console.log('已重做')
   * }
   * ```
   */
  redo(): boolean {
    if (!this.canRedo()) {
      return false
    }

    this.historyIndex++
    const snapshot = this.history[this.historyIndex]
    this.state = this.deserializeState(snapshot.state)

    logger.debug('重做操作:', snapshot.action)
    return true
  }

  /**
   * 是否可以撤销
   * 
   * @returns 是否可以撤销
   */
  canUndo(): boolean {
    return this.historyIndex > 0
  }

  /**
   * 是否可以重做
   * 
   * @returns 是否可以重做
   */
  canRedo(): boolean {
    return this.historyIndex < this.history.length - 1
  }

  /**
   * 序列化状态
   * 
   * @description
   * 将状态对象序列化为可存储的格式。
   * 
   * @returns 序列化后的状态
   * 
   * @private
   */
  private serializeState(): MenuState {
    return {
      expandedKeys: new Set(this.state.expandedKeys),
      activeKey: this.state.activeKey,
      collapsed: this.state.collapsed,
      selectedKeys: new Set(this.state.selectedKeys),
      favoriteKeys: new Set(this.state.favoriteKeys),
      recentKeys: [...this.state.recentKeys],
    }
  }

  /**
   * 反序列化状态
   * 
   * @description
   * 从存储格式还原状态对象。
   * 
   * @param state - 序列化的状态
   * @returns 状态对象
   * 
   * @private
   */
  private deserializeState(state: any): MenuState {
    return {
      expandedKeys: new Set(state.expandedKeys),
      activeKey: state.activeKey,
      collapsed: state.collapsed,
      selectedKeys: new Set(state.selectedKeys),
      favoriteKeys: new Set(state.favoriteKeys),
      recentKeys: state.recentKeys || [],
    }
  }

  /**
   * 保存状态到存储
   * 
   * @description
   * 将当前状态持久化到 localStorage。
   * 
   * @example
   * ```ts
   * stateManager.save()
   * ```
   */
  save(): void {
    if (!this.config.persistence) {
      return
    }

    try {
      const data = {
        expandedKeys: Array.from(this.state.expandedKeys),
        activeKey: this.state.activeKey,
        collapsed: this.state.collapsed,
        selectedKeys: Array.from(this.state.selectedKeys),
        favoriteKeys: Array.from(this.state.favoriteKeys),
        recentKeys: this.state.recentKeys,
      }

      localStorage.setItem(this.config.storageKey, JSON.stringify(data))
      logger.debug('状态已保存到存储')
    }
    catch (error) {
      logger.error('保存状态失败:', error)
    }
  }

  /**
   * 从存储加载状态
   * 
   * @description
   * 从 localStorage 加载之前保存的状态。
   * 
   * @example
   * ```ts
   * stateManager.load()
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

      const data = JSON.parse(stored)
      this.state = {
        expandedKeys: new Set(data.expandedKeys || []),
        activeKey: data.activeKey ?? null,
        collapsed: data.collapsed ?? false,
        selectedKeys: new Set(data.selectedKeys || []),
        favoriteKeys: new Set(data.favoriteKeys || []),
        recentKeys: data.recentKeys || [],
      }

      logger.debug('状态已从存储加载')
    }
    catch (error) {
      logger.error('加载状态失败:', error)
    }
  }

  /**
   * 清空存储
   * 
   * @description
   * 清空 localStorage 中的状态数据。
   * 
   * @example
   * ```ts
   * stateManager.clearStorage()
   * ```
   */
  clearStorage(): void {
    try {
      localStorage.removeItem(this.config.storageKey)
      logger.debug('存储已清空')
    }
    catch (error) {
      logger.error('清空存储失败:', error)
    }
  }

  /**
   * 重置状态
   * 
   * @description
   * 重置为初始状态。
   * 
   * @example
   * ```ts
   * stateManager.reset()
   * ```
   */
  reset(): void {
    const prevState = this.getState()
    this.state = this.createInitialState()
    this.onChange(prevState, '重置状态')
  }

  /**
   * 获取历史记录
   * 
   * @description
   * 获取状态历史记录列表。
   * 
   * @returns 历史记录数组
   * 
   * @example
   * ```ts
   * const history = stateManager.getHistory()
   * history.forEach(snapshot => {
   *   console.log(snapshot.action, new Date(snapshot.timestamp))
   * })
   * ```
   */
  getHistory(): StateSnapshot[] {
    return [...this.history]
  }

  /**
   * 清空历史记录
   * 
   * @description
   * 清空所有历史记录。
   * 
   * @example
   * ```ts
   * stateManager.clearHistory()
   * ```
   */
  clearHistory(): void {
    this.history = []
    this.historyIndex = -1
    this.saveSnapshot('清空历史')
  }
}


