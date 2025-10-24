/**
 * 事件类型定义
 */

import type { MenuItem } from './menu'

/**
 * 菜单事件类型
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
 * 菜单事件数据
 */
export interface MenuEventData {
  /** 菜单项 */
  item?: MenuItem
  /** 原生事件 */
  event?: Event
  /** 菜单项 ID */
  itemId?: string | number
  /** 额外数据 */
  payload?: any
}

/**
 * 菜单事件回调
 */
export type MenuEventCallback = (data: MenuEventData) => void

/**
 * 事件监听器映射
 */
export interface MenuEventListeners {
  select?: MenuEventCallback
  expand?: MenuEventCallback
  collapse?: MenuEventCallback
  click?: MenuEventCallback
  hover?: MenuEventCallback
  focus?: MenuEventCallback
  blur?: MenuEventCallback
  'popup-open'?: MenuEventCallback
  'popup-close'?: MenuEventCallback
  'collapsed-change'?: MenuEventCallback
  'active-change'?: MenuEventCallback
}

/**
 * 键盘事件按键
 */
export enum KeyCode {
  ENTER = 'Enter',
  SPACE = ' ',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  ESC = 'Escape',
  TAB = 'Tab',
  HOME = 'Home',
  END = 'End',
}


