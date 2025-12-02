/**
 * 组件属性类型定义
 * @module components/types
 */

import type {
  ExpandMode,
  MenuItem,
  MenuMode,
  MenuTheme,
} from '../types'

/**
 * 菜单组件属性
 */
export interface MenuProps {
  /**
   * 菜单数据
   */
  items?: MenuItem[]

  /**
   * 展示模式
   * @default 'vertical'
   */
  mode?: MenuMode

  /**
   * 子菜单展开方式
   * @default 'inline'
   */
  expandMode?: ExpandMode

  /**
   * 主题
   * @default 'light'
   */
  theme?: MenuTheme

  /**
   * 是否折叠
   * @default false
   */
  collapsed?: boolean

  /**
   * 折叠宽度
   * @default 48
   */
  collapsedWidth?: number

  /**
   * 展开宽度
   * @default 240
   */
  expandedWidth?: number

  /**
   * 子级缩进
   * @default 16
   */
  indent?: number

  /**
   * 手风琴模式
   * @default false
   */
  accordion?: boolean

  /**
   * 选中的菜单项 key（受控）
   */
  selectedKey?: string

  /**
   * 默认选中的菜单项 key
   */
  defaultSelectedKey?: string

  /**
   * 展开的菜单项 key 列表（受控）
   */
  openKeys?: string[]

  /**
   * 默认展开的菜单项 key 列表
   */
  defaultOpenKeys?: string[]
}

/**
 * 菜单项组件属性
 */
export interface MenuItemProps {
  /**
   * 菜单项唯一标识
   */
  itemKey: string

  /**
   * 显示文本
   */
  label?: string

  /**
   * 图标
   */
  icon?: string

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 链接地址
   */
  href?: string

  /**
   * 链接打开方式
   */
  target?: '_self' | '_blank' | '_parent' | '_top'
}

/**
 * 子菜单组件属性
 */
export interface SubMenuProps {
  /**
   * 子菜单唯一标识
   */
  itemKey: string

  /**
   * 显示文本
   */
  label?: string

  /**
   * 图标
   */
  icon?: string

  /**
   * 是否禁用
   */
  disabled?: boolean
}

/**
 * 菜单分组组件属性
 */
export interface MenuGroupProps {
  /**
   * 分组标题
   */
  title?: string
}

