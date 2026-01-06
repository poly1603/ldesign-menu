/**
 * 类型重新导出
 * @module types
 */

// 从 core 包导入类型
export type {
  BadgeStatus,
  BadgeType,
  ExpandMode,
  FlatMenuItem,
  IndicatorPosition,
  MenuBadge,
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
  MenuSearchConfig,
  MenuSearchResult,
  MenuSelectEventParams,
  MenuSize,
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
  filterMenuItemsBySearch,
  findItemByKey,
  flattenItems,
  getExpandKeysForSearch,
  getItemKey,
  getItemPath,
  getParentKeys,
  hasChildren,
  highlightKeyword,
  isDisabled,
  isDivider,
  isGroup,
  isHidden,
  MenuManager,
  searchMenuItems,
} from '@ldesign/menu-core'

