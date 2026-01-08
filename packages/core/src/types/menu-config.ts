/**
 * 菜单配置类型定义
 * 参考 Ant Design Menu 组件设计
 * @module types/menu-config
 */

import type { MenuItem } from './menu-item'

/**
 * 菜单展示模式
 * - `vertical`: 垂直模式（侧边栏）
 * - `horizontal`: 水平模式（顶部导航）
 * - `inline`: 内嵌模式（子菜单内嵌展开，等同于 vertical + expandMode: inline）
 */
export type MenuMode = 'vertical' | 'horizontal' | 'inline'

/**
 * 子菜单展开方式（仅垂直模式有效）
 * - `inline`: 内嵌展开
 * - `popup`: 弹出展开
 * - `mixed`: 混合模式（一级内嵌，其余弹出）
 */
export type ExpandMode = 'inline' | 'popup' | 'mixed'

/**
 * 子菜单触发方式
 * - `hover`: 鼠标悬停触发
 * - `click`: 点击触发
 */
export type TriggerMode = 'hover' | 'click'

/**
 * 菜单主题
 * - `light`: 浅色主题
 * - `dark`: 深色主题
 */
export type MenuTheme = 'light' | 'dark'

/**
 * 子菜单打开方向
 * - `left`: 向左打开（子菜单在父菜单左侧）
 * - `right`: 向右打开（子菜单在父菜单右侧）
 */
export type SubMenuPlacement = 'left' | 'right'

/**
 * 菜单尺寸
 * - `small`: 小尺寸
 * - `middle`: 中等尺寸（默认）
 * - `large`: 大尺寸
 */
export type MenuSize = 'small' | 'middle' | 'large'

/**
 * 选中指示器位置
 * - `left`: 左侧指示条
 * - `right`: 右侧指示条
 * - `bottom`: 底部指示线（水平模式）
 * - `none`: 无指示器
 */
export type IndicatorPosition = 'left' | 'right' | 'bottom' | 'none'

/**
 * 菜单配置选项
 * 参考 Ant Design Menu API 设计
 */
export interface MenuConfig {
  /**
   * 菜单数据
   */
  items: MenuItem[]

  /**
   * 展示模式
   * - `vertical`: 垂直菜单
   * - `horizontal`: 水平菜单
   * - `inline`: 内嵌菜单（等同于 vertical + expandMode: inline）
   * @default 'vertical'
   */
  mode?: MenuMode

  /**
   * 子菜单展开方式（仅垂直模式有效）
   * @default 'inline'
   */
  expandMode?: ExpandMode

  /**
   * 子菜单触发方式
   * @default 'hover'（水平模式） / 'click'（垂直模式）
   */
  trigger?: TriggerMode

  /**
   * 主题
   * @default 'light'
   */
  theme?: MenuTheme

  /**
   * 菜单尺寸
   * @default 'middle'
   */
  size?: MenuSize

  /**
   * 是否折叠（仅垂直模式有效）
   * 折叠时只显示图标，悬停时弹出子菜单
   * @default false
   */
  collapsed?: boolean

  /**
   * 折叠宽度（px）
   * @default 48
   */
  collapsedWidth?: number

  /**
   * 展开宽度（px或字符串）
   * @default 240
   */
  expandedWidth?: number | string

  /**
   * 子级缩进（px）
   * @default 24
   */
  indent?: number

  /**
   * 手风琴模式（同级只允许展开一个）
   * @default false
   */
  accordion?: boolean

  /**
   * 顶层互斥展开（纵向模式下，一级菜单只允许展开一个）
   * @default true
   */
  topLevelExclusive?: boolean

  /**
   * 一级菜单是否强制显示图标占位
   * @default true
   */
  requireTopIcon?: boolean

  /**
   * 横向模式"更多"文案
   * @default '更多'
   */
  moreLabel?: string

  /**
   * 是否启用动画
   * @default true
   */
  animation?: boolean

  /**
   * 动画持续时间（ms）
   * @default 200
   */
  animationDuration?: number

  /**
   * 自动展开选中项的父级菜单
   * 当选中某个子菜单项时，自动展开其所有父级
   * @default true
   */
  autoExpandParent?: boolean

  /**
   * 子菜单弹出方向（仅 popup 模式有效）
   * @default 'right'
   */
  subMenuPlacement?: SubMenuPlacement

  /**
   * 横向菜单是否启用超出折叠（显示"更多"按钮）
   * @default true
   */
  overflowFold?: boolean

  /**
   * 横向菜单更多按钮图标
   */
  moreIcon?: string

  /**
   * 选中指示器位置
   * @default 'left'（垂直模式） / 'bottom'（水平模式）
   */
  indicatorPosition?: IndicatorPosition

  /**
   * 是否可选中
   * @default true
   */
  selectable?: boolean

  /**
   * 是否允许多选
   * @default false
   */
  multiple?: boolean

  /**
   * 弹出菜单的 z-index
   * @default 1050
   */
  popupZIndex?: number

  /**
   * 弹出菜单的容器，默认为 body
   */
  getPopupContainer?: () => HTMLElement

  /**
   * 子菜单打开延迟（ms，仅 hover 触发时有效）
   * @default 0
   */
  subMenuOpenDelay?: number

  /**
   * 子菜单关闭延迟（ms，仅 hover 触发时有效）
   * @default 100
   */
  subMenuCloseDelay?: number

  /**
   * 是否显示边框
   * @default false
   */
  bordered?: boolean

  /**
   * 圆角大小
   * @default 8
   */
  borderRadius?: number
}

/**
 * 菜单配置默认值
 * 参考 Ant Design 默认配置
 */
export const DEFAULT_MENU_CONFIG: Required<Omit<MenuConfig, 'items' | 'getPopupContainer'>> & { getPopupContainer?: () => HTMLElement } = {
  mode: 'vertical',
  expandMode: 'inline',
  trigger: 'click',
  theme: 'light',
  size: 'middle',
  collapsed: false,
  collapsedWidth: 48,
  expandedWidth: 240,
  indent: 24,
  accordion: false,
  topLevelExclusive: true,
  requireTopIcon: true,
  moreLabel: '更多',
  animation: true,
  animationDuration: 200,
  autoExpandParent: true,
  subMenuPlacement: 'right',
  overflowFold: true,
  moreIcon: '',
  indicatorPosition: 'left',
  selectable: true,
  multiple: false,
  popupZIndex: 1050,
  getPopupContainer: undefined,
  subMenuOpenDelay: 0,
  subMenuCloseDelay: 100,
  bordered: false,
  borderRadius: 8,
}

