/**
 * 组件导出
 * @module components
 */

import Menu from './Menu.vue'
import MenuDivider from './MenuDivider.vue'
import MenuGroup from './MenuGroup.vue'
import MenuItem from './MenuItem.vue'
import MenuTooltip from './MenuTooltip.vue'
import SubMenu from './SubMenu.vue'

export {
  Menu as LMenu,
  MenuDivider as LMenuDivider,
  MenuGroup as LMenuGroup,
  MenuItem as LMenuItem,
  MenuTooltip as LMenuTooltip,
  SubMenu as LSubMenu,
  Menu,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuTooltip,
  SubMenu,
}

// 类型需要从单独的文件导出
export type { MenuProps } from './types'
export type { MenuItemProps } from './types'
export type { SubMenuProps } from './types'
export type { MenuGroupProps } from './types'
export type { MenuTooltipProps } from './MenuTooltip.vue'

