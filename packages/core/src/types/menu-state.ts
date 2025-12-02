/**
 * 菜单状态类型定义
 * @module types/menu-state
 */

import type { MenuItem, MenuItemPath } from './menu-item'

/**
 * 菜单状态
 */
export interface MenuState {
  /**
   * 当前选中的菜单项 key
   */
  selectedKey?: string

  /**
   * 当前展开的子菜单 key 列表
   */
  openKeys: string[]

  /**
   * 当前激活的菜单项路径
   */
  activePath: string[]

  /**
   * 横向模式下溢出的菜单项 key 列表
   */
  overflowKeys: string[]

  /**
   * 悬停状态的菜单项 key
   */
  hoverKey?: string
}

/**
 * 菜单状态默认值
 */
export const DEFAULT_MENU_STATE: MenuState = {
  selectedKey: undefined,
  openKeys: [],
  activePath: [],
  overflowKeys: [],
  hoverKey: undefined,
}

/**
 * 菜单选择事件参数
 */
export interface MenuSelectEventParams {
  /**
   * 选中的菜单项 key
   */
  key: string

  /**
   * 选中的菜单项
   */
  item: MenuItem

  /**
   * 从根到选中项的路径信息
   */
  path: MenuItemPath

  /**
   * 原始事件（如果有）
   */
  event?: Event
}

/**
 * 菜单展开/收起事件参数
 */
export interface MenuOpenChangeEventParams {
  /**
   * 变化的菜单项 key
   */
  key: string

  /**
   * 是否展开
   */
  open: boolean

  /**
   * 当前所有展开的 key 列表
   */
  openKeys: string[]
}

/**
 * 横向菜单溢出事件参数
 */
export interface MenuOverflowEventParams {
  /**
   * 溢出的菜单项数量
   */
  overflowCount: number

  /**
   * 溢出的菜单项 key 列表
   */
  overflowKeys: string[]
}

/**
 * 菜单悬停事件参数
 */
export interface MenuHoverEventParams {
  /**
   * 悬停的菜单项 key（null 表示离开）
   */
  key: string | null

  /**
   * 悬停的菜单项（null 表示离开）
   */
  item: MenuItem | null
}

/**
 * 菜单事件类型映射
 */
export interface MenuEventMap {
  /**
   * 选择菜单项
   */
  select: MenuSelectEventParams

  /**
   * 展开/收起子菜单
   */
  openChange: MenuOpenChangeEventParams

  /**
   * 横向模式溢出变化
   */
  overflow: MenuOverflowEventParams

  /**
   * 悬停变化
   */
  hover: MenuHoverEventParams

  /**
   * 折叠状态变化
   */
  collapse: { collapsed: boolean }
}

/**
 * 菜单事件处理器
 */
export type MenuEventHandler<K extends keyof MenuEventMap> = (
  params: MenuEventMap[K]
) => void

