/**
 * 菜单上下文管理
 * @module composables/useMenu
 */

import type { InjectionKey, Ref } from 'vue'
import type { ExpandMode, MenuMode, MenuState, MenuTheme, SubMenuPlacement, TriggerMode } from '../types'
import { inject, provide } from 'vue'

/**
 * 菜单上下文
 */
export interface MenuContext {
  /**
   * 菜单模式
   */
  mode: Ref<MenuMode>

  /**
   * 菜单主题
   */
  theme: Ref<MenuTheme>

  /**
   * 子菜单展开方式
   */
  expandMode?: Ref<ExpandMode>

  /**
   * 子菜单触发方式
   */
  trigger?: Ref<TriggerMode>

  /**
   * 子菜单弹出方向
   */
  subMenuPlacement?: Ref<SubMenuPlacement>

  /**
   * 是否折叠
   */
  collapsed: Ref<boolean>

  /**
   * 缩进大小
   */
  indent: Ref<number>

  /**
   * 当前状态
   */
  state: Ref<MenuState>

  /**
   * 选中菜单项
   */
  select: (key: string, event?: Event) => void

  /**
   * 切换展开状态
   */
  toggleOpen: (key: string) => void

  /**
   * 展开子菜单
   */
  open: (key: string) => void

  /**
   * 收起子菜单
   */
  close: (key: string) => void

  /**
   * 设置悬停的菜单项
   */
  setHoverKey: (key: string | null) => void

  /**
   * 获取菜单项的展开状态
   */
  isOpen: (key: string) => boolean

  /**
   * 获取菜单项的选中状态
   */
  isSelected: (key: string) => boolean

  /**
   * 获取菜单项是否在激活路径上
   */
  isActive: (key: string) => boolean
}

/**
 * 菜单上下文注入键
 */
export const MENU_CONTEXT_KEY: InjectionKey<MenuContext> = Symbol('menu-context')

/**
 * 子菜单上下文
 */
export interface SubMenuContext {
  /**
   * 当前层级
   */
  level: number

  /**
   * 父级 key
   */
  parentKey?: string
}

/**
 * 子菜单上下文注入键
 */
export const SUB_MENU_CONTEXT_KEY: InjectionKey<SubMenuContext> = Symbol('sub-menu-context')

/**
 * 提供菜单上下文
 * @param context - 菜单上下文
 */
export function provideMenuContext(context: MenuContext): void {
  provide(MENU_CONTEXT_KEY, context)
}

/**
 * 注入菜单上下文
 * @returns 菜单上下文
 * @throws 如果未在 Menu 组件内部使用会抛出错误
 */
export function useMenuContext(): MenuContext {
  const context = inject(MENU_CONTEXT_KEY)
  if (!context) {
    throw new Error('[LMenu] useMenuContext must be used inside a Menu component')
  }
  return context
}

/**
 * 提供子菜单上下文
 * @param context - 子菜单上下文
 */
export function provideSubMenuContext(context: SubMenuContext): void {
  provide(SUB_MENU_CONTEXT_KEY, context)
}

/**
 * 注入子菜单上下文
 * @returns 子菜单上下文，如果不在子菜单内则返回默认值
 */
export function useSubMenuContext(): SubMenuContext {
  return inject(SUB_MENU_CONTEXT_KEY, { level: 0 })
}

/**
 * 获取当前菜单项的层级
 * @returns 当前层级
 */
export function useMenuLevel(): number {
  const context = useSubMenuContext()
  return context.level
}

