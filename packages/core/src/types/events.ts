/**
 * 事件类型定义模块
 * 
 * @description
 * 定义菜单组件的所有事件类型、事件数据结构和回调函数类型。
 * 提供完整的事件系统类型支持，确保类型安全的事件处理。
 */

import type { MenuItem } from './menu'

/**
 * 菜单事件类型
 * 
 * @description
 * 定义菜单组件可以触发的所有事件类型。
 * 
 * - `select`: 选中菜单项
 * - `expand`: 展开菜单项（有子菜单时）
 * - `collapse`: 收起菜单项
 * - `click`: 点击菜单项
 * - `hover`: 鼠标悬停
 * - `focus`: 键盘聚焦
 * - `blur`: 失去焦点
 * - `popup-open`: 弹出菜单打开
 * - `popup-close`: 弹出菜单关闭
 * - `collapsed-change`: 菜单收起状态变化
 * - `active-change`: 激活项变化
 */
export type MenuEventType =
  | 'select'
  | 'expand'
  | 'collapse'
  | 'click'
  | 'hover'
  | 'focus'
  | 'blur'
  | 'popup-open'
  | 'popup-close'
  | 'collapsed-change'
  | 'active-change'

/**
 * 菜单事件数据接口
 * 
 * @description
 * 事件触发时传递的数据对象，包含菜单项信息、原生事件等。
 * 
 * @example
 * ```ts
 * menu.on('select', (data: MenuEventData) => {
 *   console.log('选中的菜单项:', data.item?.label)
 *   console.log('菜单项ID:', data.itemId)
 * })
 * ```
 */
export interface MenuEventData {
  /** 菜单项对象（可选） */
  item?: MenuItem
  /** 原生事件对象（可选） */
  event?: Event
  /** 菜单项 ID（可选） */
  itemId?: string | number
  /** 额外的自定义数据（可选） */
  payload?: any
}

/**
 * 菜单事件回调函数类型
 * 
 * @description
 * 事件监听器的函数签名，接收 MenuEventData 作为参数。
 * 
 * @example
 * ```ts
 * const handleSelect: MenuEventCallback = (data) => {
 *   if (data.item) {
 *     console.log(`选中: ${data.item.label}`)
 *   }
 * }
 * ```
 */
export type MenuEventCallback = (data: MenuEventData) => void

/**
 * 事件监听器映射接口
 * 
 * @description
 * 定义所有可用事件的监听器映射。
 * 用于批量注册事件监听器。
 * 
 * @example
 * ```ts
 * const listeners: MenuEventListeners = {
 *   select: (data) => console.log('选中:', data.item),
 *   expand: (data) => console.log('展开:', data.item),
 *   collapse: (data) => console.log('收起:', data.item)
 * }
 * 
 * Object.entries(listeners).forEach(([event, callback]) => {
 *   menu.on(event, callback)
 * })
 * ```
 */
export interface MenuEventListeners {
  /** 选中菜单项事件 */
  select?: MenuEventCallback
  /** 展开菜单项事件 */
  expand?: MenuEventCallback
  /** 收起菜单项事件 */
  collapse?: MenuEventCallback
  /** 点击菜单项事件 */
  click?: MenuEventCallback
  /** 鼠标悬停事件 */
  hover?: MenuEventCallback
  /** 聚焦事件 */
  focus?: MenuEventCallback
  /** 失焦事件 */
  blur?: MenuEventCallback
  /** 弹出菜单打开事件 */
  'popup-open'?: MenuEventCallback
  /** 弹出菜单关闭事件 */
  'popup-close'?: MenuEventCallback
  /** 菜单收起状态变化事件 */
  'collapsed-change'?: MenuEventCallback
  /** 激活项变化事件 */
  'active-change'?: MenuEventCallback
}

/**
 * 键盘事件按键枚举
 * 
 * @description
 * 定义菜单组件支持的所有键盘按键。
 * 遵循标准的 KeyboardEvent.key 值。
 * 
 * @example
 * ```ts
 * if (event.key === KeyCode.ENTER) {
 *   handleActivate()
 * } else if (event.key === KeyCode.ARROW_DOWN) {
 *   focusNext()
 * }
 * ```
 */
export enum KeyCode {
  /** 回车键 - 激活菜单项 */
  ENTER = 'Enter',
  /** 空格键 - 激活菜单项 */
  SPACE = ' ',
  /** 向上箭头 - 移动到上一项 */
  ARROW_UP = 'ArrowUp',
  /** 向下箭头 - 移动到下一项 */
  ARROW_DOWN = 'ArrowDown',
  /** 向左箭头 - 收起子菜单或移动到父菜单 */
  ARROW_LEFT = 'ArrowLeft',
  /** 向右箭头 - 展开子菜单或移动到子菜单 */
  ARROW_RIGHT = 'ArrowRight',
  /** Esc键 - 关闭弹出菜单 */
  ESC = 'Escape',
  /** Tab键 - 移动到下一个可聚焦元素 */
  TAB = 'Tab',
  /** Home键 - 移动到第一项 */
  HOME = 'Home',
  /** End键 - 移动到最后一项 */
  END = 'End',
}


