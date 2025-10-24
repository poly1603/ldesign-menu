/**
 * 菜单项数据结构
 */

/**
 * 菜单项接口
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
 * 扁平化菜单项（用于内部处理）
 */
export interface FlatMenuItem extends MenuItem {
  /** 层级深度 */
  level: number
  /** 父级 ID */
  parentId?: string | number
  /** 完整路径（从根到当前项的 ID 数组） */
  path: (string | number)[]
  /** 是否有子项 */
  hasChildren: boolean
  /** 索引位置 */
  index: number
}

/**
 * 菜单项状态
 */
export interface MenuItemState {
  /** 是否展开 */
  expanded: boolean
  /** 是否激活 */
  active: boolean
  /** 是否悬停 */
  hovered: boolean
  /** 是否聚焦 */
  focused: boolean
  /** 是否可见（虚拟滚动） */
  visible: boolean
}


