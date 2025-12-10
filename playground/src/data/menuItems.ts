/**
 * 演示菜单数据
 */
import {
  Home,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  BarChart3,
  Mail,
  Calendar,
  Bell,
  Shield,
  Database,
  Cloud,
  Palette,
  FolderOpen,
  Image,
  Video,
  Music,
  type LucideIcon,
} from 'lucide-vue-next'

export interface MenuItemData {
  key: string
  label: string
  icon?: LucideIcon
  disabled?: boolean
  danger?: boolean
  children?: MenuItemData[]
  type?: 'group' | 'divider'
}

// 基础菜单项
export const basicMenuItems: MenuItemData[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  {
    key: 'content',
    label: '内容管理',
    icon: FolderOpen,
    children: [
      { key: 'articles', label: '文章管理', icon: FileText },
      { key: 'media', label: '媒体库', icon: Image },
      { key: 'videos', label: '视频管理', icon: Video },
    ],
  },
  {
    key: 'users',
    label: '用户管理',
    icon: Users,
    children: [
      { key: 'user-list', label: '用户列表' },
      { key: 'user-roles', label: '角色管理' },
      { key: 'user-permissions', label: '权限管理' },
    ],
  },
  { key: 'analytics', label: '数据分析', icon: BarChart3 },
  { key: 'settings', label: '系统设置', icon: Settings },
]

// 带分组的菜单项
export const groupedMenuItems: MenuItemData[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { type: 'divider', key: 'divider-1', label: '' },
  {
    type: 'group',
    key: 'group-content',
    label: '内容管理',
    children: [
      { key: 'articles', label: '文章管理', icon: FileText },
      { key: 'media', label: '媒体库', icon: Image },
    ],
  },
  {
    type: 'group',
    key: 'group-system',
    label: '系统管理',
    children: [
      { key: 'users', label: '用户管理', icon: Users },
      { key: 'settings', label: '系统设置', icon: Settings },
    ],
  },
]

// 水平菜单项
export const horizontalMenuItems: MenuItemData[] = [
  { key: 'home', label: '首页', icon: Home },
  {
    key: 'products',
    label: '产品',
    children: [
      { key: 'product-list', label: '产品列表' },
      { key: 'product-category', label: '产品分类' },
      { key: 'product-review', label: '产品评价' },
    ],
  },
  {
    key: 'services',
    label: '服务',
    children: [
      { key: 'service-1', label: '云计算', icon: Cloud },
      { key: 'service-2', label: '数据库', icon: Database },
      { key: 'service-3', label: '安全', icon: Shield },
    ],
  },
  { key: 'about', label: '关于我们' },
  { key: 'contact', label: '联系我们', icon: Mail },
]

// 多级嵌套菜单
export const nestedMenuItems: MenuItemData[] = [
  { key: 'home', label: '首页', icon: Home },
  {
    key: 'system',
    label: '系统管理',
    icon: Settings,
    children: [
      {
        key: 'user-management',
        label: '用户管理',
        icon: Users,
        children: [
          { key: 'user-list', label: '用户列表' },
          { key: 'user-create', label: '创建用户' },
          {
            key: 'user-roles',
            label: '角色管理',
            children: [
              { key: 'role-list', label: '角色列表' },
              { key: 'role-permissions', label: '权限配置' },
            ],
          },
        ],
      },
      { key: 'logs', label: '操作日志', icon: FileText },
      { key: 'notifications', label: '通知设置', icon: Bell },
    ],
  },
  {
    key: 'workspace',
    label: '工作空间',
    icon: LayoutDashboard,
    children: [
      { key: 'projects', label: '项目管理' },
      { key: 'tasks', label: '任务列表' },
      { key: 'schedule', label: '日程安排', icon: Calendar },
    ],
  },
]

// 导出图标映射（用于原生渲染）
export const iconMap: Record<string, LucideIcon> = {
  Home,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  BarChart3,
  Mail,
  Calendar,
  Bell,
  Shield,
  Database,
  Cloud,
  Palette,
  FolderOpen,
  Image,
  Video,
  Music,
}
