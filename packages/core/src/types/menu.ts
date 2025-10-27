/**
 * 菜单项数据结构模块
 * 
 * @description
 * 定义菜单系统中所有菜单项相关的数据结构，包括基础菜单项、
 * 扁平化菜单项、菜单项状态等类型定义。
 */

/**
 * 菜单项接口
 * 
 * @description
 * 菜单项的核心数据结构，支持无限层级嵌套、权限控制、自定义渲染等功能。
 * 
 * @example
 * ```ts
 * const menuItem: MenuItem = {
 *   id: '1',
 *   label: '首页',
 *   icon: '🏠',
 *   path: '/home',
 *   children: [
 *     { id: '1-1', label: '概览', path: '/home/overview' },
 *     { id: '1-2', label: '统计', path: '/home/stats' }
 *   ]
 * }
 * ```
 */
export interface MenuItem {
  /** 唯一标识 */
  id: string | number
  /** 菜单项文本 */
  label: string
  /** 图标（字符串、VNode、ReactNode 等） */
  icon?: any
  /** 是否禁用 */
  disabled?: boolean
  /** 是否隐藏 */
  hidden?: boolean
  /** 子菜单项 */
  children?: MenuItem[]

  // 扩展字段
  /** 路由路径 */
  path?: string
  /** 权限控制 */
  permissions?: string[]
  /** 角标 */
  badge?: string | number
  /** 提示文本 */
  tooltip?: string
  /** 自定义元数据 */
  metadata?: any
  /** 是否可点击 */
  clickable?: boolean
  /** 分隔符（渲染为分隔线） */
  divider?: boolean
  /** 分组标题 */
  group?: boolean

  // 自定义渲染函数
  /** 自定义整体渲染 */
  render?: (item: MenuItem) => any
  /** 自定义图标渲染 */
  renderIcon?: (item: MenuItem) => any
  /** 自定义标签渲染 */
  renderLabel?: (item: MenuItem) => any
}

/**
 * 扁平化菜单项接口
 * 
 * @description
 * 从树形结构扁平化后的菜单项，包含额外的位置和层级信息。
 * 主要用于内部处理，如虚拟滚动、快速查找等场景。
 * 
 * @example
 * ```ts
 * const flatItem: FlatMenuItem = {
 *   id: '2-1',
 *   label: '产品A',
 *   level: 1,              // 第二层级
 *   parentId: '2',          // 父级ID
 *   path: ['2', '2-1'],     // 完整路径
 *   hasChildren: false,     // 无子项
 *   index: 3                // 在扁平列表中的索引
 * }
 * ```
 */
export interface FlatMenuItem extends MenuItem {
  /** 层级深度（0 表示根级别） */
  level: number
  /** 父级菜单项 ID（根级菜单项为 undefined） */
  parentId?: string | number
  /** 完整路径（从根到当前项的 ID 数组，用于面包屑导航） */
  path: (string | number)[]
  /** 是否有子项 */
  hasChildren: boolean
  /** 在扁平列表中的索引位置（用于虚拟滚动计算） */
  index: number
}

/**
 * 菜单项状态接口
 * 
 * @description
 * 记录菜单项的各种状态，用于控制渲染和交互行为。
 * 状态变化会触发相应的视觉更新和事件。
 * 
 * @example
 * ```ts
 * const itemState: MenuItemState = {
 *   expanded: true,   // 子菜单已展开
 *   active: true,     // 当前激活项
 *   hovered: false,   // 未悬停
 *   focused: false,   // 未聚焦
 *   visible: true     // 在可见区域内
 * }
 * ```
 */
export interface MenuItemState {
  /** 是否展开（仅对有子项的菜单项有效） */
  expanded: boolean
  /** 是否为当前激活项（通常高亮显示） */
  active: boolean
  /** 是否处于悬停状态（鼠标移入时） */
  hovered: boolean
  /** 是否处于聚焦状态（键盘导航时） */
  focused: boolean
  /** 是否在可见区域内（虚拟滚动时使用） */
  visible: boolean
}


