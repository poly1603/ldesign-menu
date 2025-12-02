/**
 * 菜单项类型定义
 * @module types/menu-item
 */

/**
 * 菜单项类型
 * - `item`: 普通菜单项（叶子节点）
 * - `submenu`: 子菜单（可展开）
 * - `group`: 菜单分组（仅作为分类标题）
 * - `divider`: 分隔线
 */
export type MenuItemType = 'item' | 'submenu' | 'group' | 'divider'

/**
 * 菜单项目标打开方式
 */
export type MenuItemTarget = '_self' | '_blank' | '_parent' | '_top'

/**
 * 菜单项基础接口
 */
export interface MenuItemBase {
  /**
   * 菜单项唯一标识
   * @required
   */
  key: string

  /**
   * 菜单项类型
   * @default 'item'
   */
  type?: MenuItemType

  /**
   * 菜单项显示文本
   */
  label?: string

  /**
   * 菜单项图标
   * 可以是图标名称字符串或自定义渲染内容
   */
  icon?: string

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean

  /**
   * 是否隐藏
   * @default false
   */
  hidden?: boolean

  /**
   * 链接地址
   */
  href?: string

  /**
   * 链接打开方式
   * @default '_self'
   */
  target?: MenuItemTarget

  /**
   * 路由路径（用于 Vue Router 等路由库）
   */
  path?: string

  /**
   * 权限标识列表
   * 用于权限过滤
   */
  permissions?: string[]

  /**
   * 角色标识列表
   * 用于角色过滤
   */
  roles?: string[]

  /**
   * 额外数据
   */
  meta?: Record<string, unknown>
}

/**
 * 普通菜单项（叶子节点）
 */
export interface MenuLeafItem extends MenuItemBase {
  type?: 'item'
}

/**
 * 子菜单项（可展开，包含子项）
 */
export interface MenuSubItem extends MenuItemBase {
  type: 'submenu'

  /**
   * 子菜单项列表
   */
  children: MenuItem[]
}

/**
 * 菜单分组
 */
export interface MenuGroupItem extends MenuItemBase {
  type: 'group'

  /**
   * 分组下的菜单项
   */
  children: MenuItem[]
}

/**
 * 分隔线
 */
export interface MenuDividerItem {
  type: 'divider'
  key?: string
}

/**
 * 菜单项联合类型
 */
export type MenuItem = MenuLeafItem | MenuSubItem | MenuGroupItem | MenuDividerItem

/**
 * 菜单项路径信息
 */
export interface MenuItemPath {
  /**
   * 路径上的所有 key
   */
  keys: string[]

  /**
   * 路径上的所有菜单项
   */
  items: MenuItem[]
}

/**
 * 扁平化的菜单项（包含层级信息）
 */
export interface FlatMenuItem {
  /**
   * 菜单项
   */
  item: MenuItem

  /**
   * 层级（从 0 开始）
   */
  level: number

  /**
   * 父级 key
   */
  parentKey?: string

  /**
   * 从根到当前项的路径
   */
  path: string[]
}

