/**
 * 数据验证工具
 */

import type { MenuItem, MenuConfig } from '../types'

/**
 * 验证菜单项
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
 */
export function validateMenuConfig(config: any): config is MenuConfig {
  if (!config || typeof config !== 'object') {
    return false
  }

  if ('mode' in config && !['horizontal', 'vertical'].includes(config.mode)) {
    return false
  }

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
 */
export function isValidId(id: any): id is string | number {
  return typeof id === 'string' || typeof id === 'number'
}

/**
 * 检查是否为有效的颜色值
 */
export function isValidColor(color: string): boolean {
  // 简单的颜色验证
  const colorRegex = /^(#[0-9a-f]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|[a-z]+)$/i
  return colorRegex.test(color)
}

/**
 * 检查是否为有效的尺寸值
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
 * 规范化尺寸值（添加 px 单位）
 */
export function normalizeSize(size: string | number): string {
  if (typeof size === 'number') {
    return `${size}px`
  }
  return size
}

/**
 * 检查两个菜单项是否相同
 */
export function isEqualMenuItem(a: MenuItem, b: MenuItem): boolean {
  return a.id === b.id
}

/**
 * 深度克隆菜单项
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
 */
export function cloneMenuItems(items: MenuItem[]): MenuItem[] {
  return items.map(item => cloneMenuItem(item))
}


