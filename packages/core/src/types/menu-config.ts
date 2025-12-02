/**
 * 菜单配置类型定义
 * @module types/menu-config
 */

import type { MenuItem } from './menu-item'

/**
 * 菜单展示模式
 * - `vertical`: 垂直模式（侧边栏）
 * - `horizontal`: 水平模式（顶部导航）
 */
export type MenuMode = 'vertical' | 'horizontal'

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
 * 菜单配置选项
 */
export interface MenuConfig {
  /**
   * 菜单数据
   */
  items: MenuItem[]

  /**
   * 展示模式
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
   * 展开宽度（px）
   * @default 240
   */
  expandedWidth?: number

  /**
   * 子级缩进（px）
   * @default 16
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
}

/**
 * 菜单配置默认值
 */
export const DEFAULT_MENU_CONFIG: Required<Omit<MenuConfig, 'items'>> = {
  mode: 'vertical',
  expandMode: 'inline',
  trigger: 'click',
  theme: 'light',
  collapsed: false,
  collapsedWidth: 48,
  expandedWidth: 240,
  indent: 16,
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
}

