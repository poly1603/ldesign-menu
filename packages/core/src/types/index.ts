/**
 * 菜单系统类型定义导出
 * @module types
 */

// 菜单配置类型
export type {
  ExpandMode,
  MenuConfig,
  MenuMode,
  MenuTheme,
  SubMenuPlacement,
  TriggerMode,
} from './menu-config'

export { DEFAULT_MENU_CONFIG } from './menu-config'

// 菜单项类型
export type {
  FlatMenuItem,
  MenuDividerItem,
  MenuGroupItem,
  MenuItem,
  MenuItemBase,
  MenuItemPath,
  MenuItemTarget,
  MenuItemType,
  MenuLeafItem,
  MenuSubItem,
} from './menu-item'

// 菜单状态类型
export type {
  MenuEventHandler,
  MenuEventMap,
  MenuHoverEventParams,
  MenuOpenChangeEventParams,
  MenuOverflowEventParams,
  MenuSelectEventParams,
  MenuState,
} from './menu-state'

export { DEFAULT_MENU_STATE } from './menu-state'

