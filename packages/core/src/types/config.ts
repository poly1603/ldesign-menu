/**
 * 菜单配置类型模块
 * 
 * @description
 * 定义菜单系统的所有配置选项、枚举类型和默认值。
 * 提供灵活的配置项以支持各种使用场景。
 */

import type { MenuItem } from './menu'

/**
 * 菜单模式类型
 * 
 * @description
 * - `horizontal`: 横向菜单，适用于顶部导航栏
 * - `vertical`: 纵向菜单，适用于侧边栏
 */
export type MenuMode = 'horizontal' | 'vertical'

/**
 * 主题类型
 * 
 * @description
 * - `light`: 亮色主题
 * - `dark`: 暗色主题
 * - `auto`: 自动根据系统主题切换
 */
export type MenuTheme = 'light' | 'dark' | 'auto'

/**
 * 展开模式类型
 * 
 * @description
 * - `hover`: 鼠标悬停时展开子菜单
 * - `click`: 点击时展开子菜单
 * - `auto`: 根据设备类型自动选择（移动端为 click，桌面端为 hover）
 */
export type ExpandMode = 'hover' | 'click' | 'auto'

/**
 * 子菜单触发方式类型
 * 
 * @description
 * - `popup`: 弹出式子菜单（浮层显示）
 * - `inline`: 内联式子菜单（在菜单内展开）
 */
export type SubmenuTrigger = 'popup' | 'inline'

/**
 * 响应式收起模式类型（横向菜单）
 * 
 * @description
 * - `more`: 超出部分收入"更多"菜单
 * - `scroll`: 超出部分可横向滚动
 */
export type CollapseMode = 'more' | 'scroll'

/**
 * Popup 定位类型
 * 
 * @description
 * 定义弹出式子菜单相对于触发元素的位置。
 * 支持12个方位，自动进行边界检测和位置翻转。
 */
export type PopupPlacement =
  | 'bottom'        // 底部居中
  | 'bottom-start'  // 底部左对齐
  | 'bottom-end'    // 底部右对齐
  | 'top'           // 顶部居中
  | 'top-start'     // 顶部左对齐
  | 'top-end'       // 顶部右对齐
  | 'right'         // 右侧居中
  | 'right-start'   // 右侧顶对齐
  | 'right-end'     // 右侧底对齐
  | 'left'          // 左侧居中
  | 'left-start'    // 左侧顶对齐
  | 'left-end'      // 左侧底对齐

/**
 * 动画类型
 * 
 * @description
 * - `fade`: 淡入淡出动画
 * - `slide`: 滑动动画
 * - `zoom`: 缩放动画
 * - `none`: 无动画
 * - 自定义字符串：支持自定义动画类型
 */
export type AnimationType =
  | 'fade'
  | 'slide'
  | 'zoom'
  | 'none'
  | string

/**
 * 菜单配置接口
 */
export interface MenuConfig {
  /** 菜单模式 */
  mode?: MenuMode
  /** 主题 */
  theme?: MenuTheme
  /** 菜单数据 */
  items?: MenuItem[]

  // 展开行为
  /** 展开模式 */
  expandMode?: ExpandMode
  /** 子菜单触发方式 */
  submenuTrigger?: SubmenuTrigger
  /** 收起模式（仅 vertical） */
  collapsed?: boolean
  /** 默认展开的菜单项 ID */
  defaultExpandedKeys?: (string | number)[]
  /** 默认激活的菜单项 ID */
  defaultActiveKey?: string | number
  /** 手风琴模式（同级只能展开一个） */
  accordion?: boolean

  // 样式配置
  /** 菜单宽度 */
  width?: string | number
  /** 收起时的宽度 */
  collapsedWidth?: string | number
  /** 子菜单缩进（px） */
  indent?: number
  /** 菜单项高度（px） */
  itemHeight?: number
  /** Popup 偏移量 */
  popupOffset?: number

  // 性能优化
  /** 启用虚拟滚动 */
  virtualScroll?: boolean
  /** 虚拟滚动阈值 */
  virtualThreshold?: number
  /** 懒加载子菜单 */
  lazyLoad?: boolean

  // 动画配置
  /** 启用动画 */
  animation?: boolean
  /** 动画类型 */
  animationType?: AnimationType
  /** 动画持续时间（ms） */
  animationDuration?: number
  /** 动画缓动函数 */
  animationEasing?: string

  // 响应式（横向菜单）
  /** 启用响应式 */
  responsive?: boolean
  /** 收起模式 */
  collapseMode?: CollapseMode
  /** 响应式断点（px） */
  breakpoint?: number

  // 键盘导航
  /** 启用键盘导航 */
  keyboardNavigation?: boolean

  // 事件回调
  /** 选择菜单项时触发 */
  onSelect?: (item: MenuItem, event?: Event) => void
  /** 展开菜单项时触发 */
  onExpand?: (item: MenuItem) => void
  /** 收起菜单项时触发 */
  onCollapse?: (item: MenuItem) => void
  /** 菜单项点击时触发 */
  onClick?: (item: MenuItem, event: Event) => void
  /** 菜单收起/展开状态变化时触发 */
  onCollapsedChange?: (collapsed: boolean) => void
}

/**
 * 默认配置
 */
export const DEFAULT_MENU_CONFIG: Required<Omit<MenuConfig, 'items' | 'onSelect' | 'onExpand' | 'onCollapse' | 'onClick' | 'onCollapsedChange'>> = {
  mode: 'vertical',
  theme: 'light',
  expandMode: 'hover',
  submenuTrigger: 'popup',
  collapsed: false,
  defaultExpandedKeys: [],
  defaultActiveKey: '',
  accordion: false,
  width: '240px',
  collapsedWidth: '64px',
  indent: 24,
  itemHeight: 40,
  popupOffset: 4,
  virtualScroll: false,
  virtualThreshold: 100,
  lazyLoad: false,
  animation: true,
  animationType: 'slide',
  animationDuration: 300,
  animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  responsive: false,
  collapseMode: 'more',
  breakpoint: 768,
  keyboardNavigation: true,
}


