/**
 * @ldesign/menu-vue
 * LDesign 菜单系统 - Vue 3 组件
 * @packageDocumentation
 */

// 组件导出
export * from './components'

// Composables 导出
export * from './composables'

// 重新导出类型和工具函数（排除与组件名冲突的类型）
export type {
  ExpandMode,
  FlatMenuItem,
  IndicatorPosition,
  MenuConfig,
  MenuDividerItem,
  MenuEventHandler,
  MenuEventMap,
  MenuFilterConfig,
  MenuGroupItem,
  MenuHoverEventParams,
  MenuItemBase,
  // MenuItem 类型与组件名冲突，使用 MenuItemData 别名
  MenuItem as MenuItemData,
  MenuItemPath,
  MenuItemTarget,
  MenuItemType,
  MenuLeafItem,
  MenuMode,
  MenuOpenChangeEventParams,
  MenuOverflowEventParams,
  MenuSelectEventParams,
  MenuSize,
  MenuState,
  MenuSubItem,
  MenuTheme,
  SubMenuPlacement,
  TriggerMode,
} from './types'

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
} from './types'

