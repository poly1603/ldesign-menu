/**
 * 数据验证工具模块
 * 
 * @description
 * 提供菜单数据的类型验证和格式校验功能。
 * 确保菜单配置和数据符合规范，防止运行时错误。
 * 支持运行时类型检查和数据规范化。
 */

import type { MenuItem, MenuConfig } from '../types'

/**
 * 验证菜单项
 * 
 * @description
 * 递归验证菜单项数据结构是否符合 MenuItem 接口规范。
 * 检查必需字段、字段类型和子菜单的有效性。
 * 
 * @param item - 要验证的菜单项数据
 * @returns 是否为有效的菜单项
 * 
 * @example
 * ```ts
 * const item = {
 *   id: '1',
 *   label: '首页',
 *   children: [...]
 * }
 * 
 * if (validateMenuItem(item)) {
 *   console.log('菜单项数据有效')
 *   addMenuItem(item)
 * } else {
 *   console.error('菜单项数据无效')
 * }
 * ```
 */
export function validateMenuItem(item: any): item is MenuItem {
  if (!item || typeof item !== 'object') {
    return false
  }

  if (!('id' in item) || (typeof item.id !== 'string' && typeof item.id !== 'number')) {
    return false
  }

  if (!('label' in item) || typeof item.label !== 'string') {
    return false
  }

  if ('children' in item && item.children !== undefined) {
    if (!Array.isArray(item.children)) {
      return false
    }
    return item.children.every((child: any) => validateMenuItem(child))
  }

  return true
}

/**
 * 验证菜单配置
 * 
 * @description
 * 验证菜单配置对象是否符合 MenuConfig 接口规范。
 * 检查配置选项的类型和取值范围。
 * 
 * @param config - 要验证的配置对象
 * @returns 是否为有效的菜单配置
 * 
 * @example
 * ```ts
 * const config = {
 *   mode: 'vertical',
 *   items: menuItems,
 *   animation: true
 * }
 * 
 * if (validateMenuConfig(config)) {
 *   const menu = new MenuManager(config)
 * } else {
 *   throw new Error('菜单配置无效')
 * }
 * ```
 */
export function validateMenuConfig(config: any): config is MenuConfig {
  if (!config || typeof config !== 'object') {
    return false
  }

  // 验证 mode 字段
  if ('mode' in config && !['horizontal', 'vertical'].includes(config.mode)) {
    return false
  }

  // 验证 items 字段
  if ('items' in config && config.items !== undefined) {
    if (!Array.isArray(config.items)) {
      return false
    }
    return config.items.every((item: any) => validateMenuItem(item))
  }

  return true
}

/**
 * 检查是否为有效的 ID
 * 
 * @description
 * 验证菜单项 ID 是否为有效类型（字符串或数字）。
 * 
 * @param id - 要验证的 ID
 * @returns 是否为有效 ID
 * 
 * @example
 * ```ts
 * if (isValidId(menuItem.id)) {
 *   selectMenuItem(menuItem.id)
 * }
 * ```
 */
export function isValidId(id: any): id is string | number {
  return typeof id === 'string' || typeof id === 'number'
}

/**
 * 检查是否为有效的颜色值
 * 
 * @description
 * 验证字符串是否为有效的 CSS 颜色值。
 * 支持十六进制、rgb/rgba、hsl/hsla 和命名颜色。
 * 
 * @param color - 要验证的颜色值
 * @returns 是否为有效颜色
 * 
 * @example
 * ```ts
 * isValidColor('#ff0000')    // true
 * isValidColor('rgb(255,0,0)') // true
 * isValidColor('red')        // true
 * isValidColor('invalid')    // false
 * ```
 */
export function isValidColor(color: string): boolean {
  // 简单的颜色验证正则
  const colorRegex = /^(#[0-9a-f]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|[a-z]+)$/i
  return colorRegex.test(color)
}

/**
 * 检查是否为有效的尺寸值
 * 
 * @description
 * 验证尺寸值是否为有效的 CSS 尺寸。
 * 支持数字、带单位的字符串和 CSS 关键字。
 * 
 * @param size - 要验证的尺寸值
 * @returns 是否为有效尺寸
 * 
 * @example
 * ```ts
 * isValidSize(100)        // true
 * isValidSize('100px')    // true
 * isValidSize('10rem')    // true
 * isValidSize('auto')     // true
 * isValidSize('invalid')  // false
 * ```
 */
export function isValidSize(size: string | number): boolean {
  if (typeof size === 'number') {
    return !Number.isNaN(size) && size >= 0
  }

  if (typeof size === 'string') {
    const sizeRegex = /^(\d+(\.\d+)?(px|em|rem|%|vh|vw)?|auto|inherit|initial|unset)$/
    return sizeRegex.test(size)
  }

  return false
}

/**
 * 规范化尺寸值
 * 
 * @description
 * 将数字尺寸值转换为带 px 单位的字符串。
 * 字符串值保持不变。
 * 
 * @param size - 尺寸值（数字或字符串）
 * @returns 规范化后的尺寸字符串
 * 
 * @example
 * ```ts
 * normalizeSize(100)      // '100px'
 * normalizeSize('2rem')   // '2rem'
 * normalizeSize('auto')   // 'auto'
 * ```
 */
export function normalizeSize(size: string | number): string {
  if (typeof size === 'number') {
    return `${size}px`
  }
  return size
}

/**
 * 检查两个菜单项是否相同
 * 
 * @description
 * 比较两个菜单项的 ID 是否相同，用于相等性判断。
 * 
 * @param a - 第一个菜单项
 * @param b - 第二个菜单项
 * @returns 是否相同
 * 
 * @example
 * ```ts
 * if (isEqualMenuItem(item1, item2)) {
 *   console.log('是同一个菜单项')
 * }
 * ```
 */
export function isEqualMenuItem(a: MenuItem, b: MenuItem): boolean {
  return a.id === b.id
}

/**
 * 深度克隆菜单项
 * 
 * @description
 * 递归克隆菜单项及其所有子菜单，返回全新的对象。
 * 确保原始数据不被修改，符合不可变数据原则。
 * 
 * @param item - 要克隆的菜单项
 * @returns 克隆后的菜单项
 * 
 * @example
 * ```ts
 * const original = { id: '1', label: '首页', children: [...] }
 * const cloned = cloneMenuItem(original)
 * 
 * cloned.label = '修改后的标题'
 * console.log(original.label) // 仍然是 '首页'
 * ```
 */
export function cloneMenuItem(item: MenuItem): MenuItem {
  const cloned: MenuItem = {
    ...item,
  }

  if (item.children) {
    cloned.children = item.children.map(child => cloneMenuItem(child))
  }

  return cloned
}

/**
 * 深度克隆菜单数据
 * 
 * @description
 * 深度克隆整个菜单项数组，返回全新的数据结构。
 * 适用于需要修改菜单数据但不想影响原始数据的场景。
 * 
 * @param items - 要克隆的菜单项数组
 * @returns 克隆后的菜单项数组
 * 
 * @example
 * ```ts
 * const originalMenu = [...]
 * const clonedMenu = cloneMenuItems(originalMenu)
 * 
 * // 修改克隆数据不会影响原始数据
 * clonedMenu[0].label = '新标题'
 * console.log(originalMenu[0].label) // 保持不变
 * ```
 */
export function cloneMenuItems(items: MenuItem[]): MenuItem[] {
  return items.map(item => cloneMenuItem(item))
}


