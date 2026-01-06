/**
 * @ldesign/menu
 * LDesign 菜单系统 - 现代化菜单组件
 *
 * 本包统一导出 core 和 vue 包的所有功能
 *
 * @example
 * ```ts
 * import { LMenu, LMenuItem, MenuManager } from '@ldesign/menu'
 * import type { MenuItem, MenuConfig } from '@ldesign/menu'
 * ```
 *
 * @packageDocumentation
 */

// 从 core 包导出所有内容（类型、管理器、工具函数）
export * from '@ldesign/menu-core'

// 从 vue 包重新导出（组件和 Composables）
// 注意：MenuItem 组件导出为 MenuItemComponent 以避免与 MenuItem 类型冲突
export {
  // 组件（L 前缀别名）
  LMenu,
  LMenuItem,
  LSubMenu,
  LMenuGroup,
  LMenuDivider,
  LMenuTooltip,
  // 组件（无前缀）
  Menu,
  SubMenu,
  MenuGroup,
  MenuDivider,
  MenuTooltip,
  // Vue 组件 MenuItem 使用别名导出
  MenuItem as MenuItemComponent,
  // Composables
  useMenuContext,
  useSubMenuContext,
  useMenuLevel,
  useMenuState,
  useMenuKeyboard,
  provideMenuContext,
  provideSubMenuContext,
  // 上下文 Keys
  MENU_CONTEXT_KEY,
  SUB_MENU_CONTEXT_KEY,
} from '@ldesign/menu-vue'
