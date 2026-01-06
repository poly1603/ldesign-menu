/**
 * 工具函数导出
 * @module utils
 */

export { EventEmitter } from './event-emitter'
export type { EventHandler } from './event-emitter'

export {
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
} from './menu-utils'

export {
  filterMenuItemsBySearch,
  getExpandKeysForSearch,
  highlightKeyword,
  searchMenuItems,
} from './menu-search'
export type {
  MenuSearchConfig,
  MenuSearchResult,
} from './menu-search'

