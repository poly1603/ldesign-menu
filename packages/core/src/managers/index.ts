/**
 * 管理器模块导出
 * @module managers
 */

// 菜单过滤器
export { filterMenuItems } from './menu-filter'
export type { MenuFilterConfig } from './menu-filter'

// 菜单状态管理器
export { MenuManager } from './menu-manager'
export type { MenuManagerConfig } from './menu-manager'

// 水平溢出管理器
export {
  OverflowManager,
  calculatePopupDirection,
  handleOverflowPopupClick,
  handleOverflowPopupHover,
} from './overflow-manager'
export type { OverflowManagerConfig, OverflowEventMap } from './overflow-manager'

