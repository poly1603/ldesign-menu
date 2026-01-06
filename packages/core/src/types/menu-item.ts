/**
 * 菜单项类型定义
 * @module types/menu-item
 */

/**
 * 菜单项类型枚举
 * - `item`: 普通菜单项（叶子节点，可点击选中）
 * - `submenu`: 子菜单（可展开，包含子项）
 * - `group`: 菜单分组（仅作为分类标题，不可点击）
 * - `divider`: 分隔线（视觉分隔元素）
 */
export type MenuItemType = 'item' | 'submenu' | 'group' | 'divider'

/**
 * 菜单项链接打开方式
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target
 */
export type MenuItemTarget = '_self' | '_blank' | '_parent' | '_top'

/**
 * 徽标类型
 * - `dot`: 红点徽标
 * - `count`: 数字徽标
 * - `text`: 文本徽标
 */
export type BadgeType = 'dot' | 'count' | 'text'

/**
 * 徽标状态
 * - `default`: 默认（蓝色）
 * - `success`: 成功（绿色）
 * - `warning`: 警告（橙色）
 * - `error`: 错误（红色）
 */
export type BadgeStatus = 'default' | 'success' | 'warning' | 'error'

/**
 * 徽标配置
 * @example
 * ```ts
 * // 红点徽标
 * { type: 'dot' }
 *
 * // 数字徽标
 * { type: 'count', count: 5 }
 *
 * // 文本徽标
 * { type: 'text', text: 'NEW' }
 * ```
 */
export interface MenuBadge {
  /**
   * 徽标类型
   * @default 'dot'
   */
  type?: BadgeType

  /**
   * 数字（仅 count 类型有效）
   */
  count?: number

  /**
   * 文本内容（仅 text 类型有效）
   */
  text?: string

  /**
   * 最大显示数字，超过显示 max+
   * @default 99
   */
  max?: number

  /**
   * 徽标状态
   * @default 'error'
   */
  status?: BadgeStatus

  /**
   * 是否显示
   * @default true
   */
  show?: boolean

  /**
   * 自定义类名
   */
  className?: string
}

/**
 * 菜单项基础接口
 * 所有菜单项类型的公共属性
 */
export interface MenuItemBase {
  /**
   * 菜单项唯一标识
   * 必须在同一菜单中唯一
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
   * 可以是图标名称字符串（如 'home'）或 Vue 组件
   */
  icon?: string

  /**
   * 是否禁用
   * 禁用的菜单项无法点击和交互
   * @default false
   */
  disabled?: boolean

  /**
   * 是否隐藏
   * 隐藏的菜单项不会渲染
   * @default false
   */
  hidden?: boolean

  /**
   * 链接地址
   * 设置后菜单项会渲染为 <a> 标签
   */
  href?: string

  /**
   * 链接打开方式
   * 仅在设置 href 时有效
   * @default '_self'
   */
  target?: MenuItemTarget

  /**
   * 路由路径
   * 用于 Vue Router 等路由库的导航
   */
  path?: string

  /**
   * 权限标识列表
   * 用于权限过滤，任意一个权限匹配即可显示
   */
  permissions?: string[]

  /**
   * 角色标识列表
   * 用于角色过滤，任意一个角色匹配即可显示
   */
  roles?: string[]

  /**
   * 徽标配置
   * 用于显示红点、数字或文本徽标
   */
  badge?: MenuBadge

  /**
   * 额外数据
   * 可存储任意自定义数据
   */
  meta?: Record<string, unknown>
}

/**
 * 普通菜单项（叶子节点）
 * 可点击选中的最终菜单项
 */
export interface MenuLeafItem extends MenuItemBase {
  /**
   * 菜单项类型
   * @default 'item'
   */
  type?: 'item'

  /**
   * 是否为危险操作
   * 危险操作会显示为红色
   * @default false
   */
  danger?: boolean
}

/**
 * 子菜单项（可展开，包含子项）
 * 可以包含任意类型的子菜单项
 */
export interface MenuSubItem extends MenuItemBase {
  /**
   * 菜单项类型
   */
  type: 'submenu'

  /**
   * 子菜单项列表
   * @minItems 1
   */
  children: MenuItem[]

  /**
   * 子菜单独立主题
   * 可以为子菜单设置不同于父菜单的主题
   */
  theme?: 'light' | 'dark'
}

/**
 * 菜单分组
 * 用于对菜单项进行分类，显示分组标题
 */
export interface MenuGroupItem extends MenuItemBase {
  /**
   * 菜单项类型
   */
  type: 'group'

  /**
   * 分组下的菜单项
   */
  children: MenuItem[]
}

/**
 * 分隔线
 * 用于视觉上分隔菜单项
 */
export interface MenuDividerItem {
  /**
   * 菜单项类型
   */
  type: 'divider'

  /**
   * 分隔线 key（可选）
   * 如果不提供，会自动生成
   */
  key?: string

  /**
   * 是否为虚线
   * @default false
   */
  dashed?: boolean
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

