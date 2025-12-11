/**
 * 管理器模块导出
 * @module managers
 */

export { filterMenuItems } from './menu-filter'
export type { MenuFilterConfig } from './menu-filter'

export { MenuManager } from './menu-manager'
export type { MenuManagerConfig } from './menu-manager'

export {
  OverflowManager,
  calculatePopupDirection,
  handleOverflowPopupClick,
  handleOverflowPopupHover,
} from './overflow-manager'
export type { OverflowManagerConfig, OverflowEventMap } from './overflow-manager'

