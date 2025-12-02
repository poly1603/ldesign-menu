/**
 * 类型重新导出
 * @module types
 */

// 从 core 包导入类型
export type {
  ExpandMode,
  FlatMenuItem,
  MenuConfig,
  MenuDividerItem,
  MenuEventHandler,
  MenuEventMap,
  MenuFilterConfig,
  MenuGroupItem,
  MenuHoverEventParams,
  MenuItem,
  MenuItemBase,
  MenuItemPath,
  MenuItemTarget,
  MenuItemType,
  MenuLeafItem,
  MenuMode,
  MenuOpenChangeEventParams,
  MenuOverflowEventParams,
  MenuSelectEventParams,
  MenuState,
  MenuSubItem,
  MenuTheme,
  SubMenuPlacement,
  TriggerMode,
} from '@ldesign/menu-core'

export {
  DEFAULT_MENU_CONFIG,
  DEFAULT_MENU_STATE,
  EventEmitter,
  filterMenuItems,
  findItemByKey,
  flattenItems,
  getItemKey,
  getItemPath,
  getParentKeys,
  hasChildren,
  isDisabled,
  isDivider,
  isGroup,
  isHidden,
  MenuManager,
} from '@ldesign/menu-core'

