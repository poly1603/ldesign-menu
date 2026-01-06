# @ldesign/menu

> LDesign 菜单组件 - 现代化、高性能的菜单系统，支持 Vue 3

[![npm version](https://img.shields.io/npm/v/@ldesign/menu.svg)](https://www.npmjs.com/package/@ldesign/menu)
[![license](https://img.shields.io/npm/l/@ldesign/menu.svg)](https://github.com/ldesign/menu/blob/main/LICENSE)

## ✨ 特性

- 🎨 **Ant Design 风格** - 遵循 Ant Design 设计规范，简洁美观
- 📦 **框架无关核心** - 核心逻辑与框架解耦，可适配任意前端框架
- 🚀 **高性能** - 智能溢出检测、防抖优化、最小化重渲染
- 💪 **TypeScript** - 完整的类型定义，提供出色的开发体验
- 🎯 **多种模式** - 支持垂直、水平、折叠等多种展示模式
- 🔐 **权限控制** - 内置权限和角色过滤功能
- 🔍 **搜索支持** - 支持菜单项搜索和高亮
- 📱 **响应式** - 自适应不同屏幕尺寸
- 🌙 **深色模式** - 内置浅色/深色主题支持
- ♿ **无障碍** - 支持键盘导航和 ARIA

## 📦 安装

```bash
# pnpm
pnpm add @ldesign/menu

# npm
npm install @ldesign/menu

# yarn
yarn add @ldesign/menu
```

## 🚀 快速开始

### 基础用法

```vue
<template>
  <LMenu :items="menuItems" @select="handleSelect" />
</template>

<script setup lang="ts">
import { LMenu } from '@ldesign/menu'
import type { MenuItemData } from '@ldesign/menu'
import { Home, Settings, Users } from 'lucide-vue-next'

const menuItems: MenuItemData[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'users', label: '用户管理', icon: Users },
  {
    key: 'settings',
    label: '系统设置',
    icon: Settings,
    type: 'submenu',
    children: [
      { key: 'profile', label: '个人资料' },
      { key: 'security', label: '安全设置' },
    ],
  },
]

function handleSelect({ key, item, path }) {
  console.log('选中:', key)
}
</script>
```

### 插槽模式

```vue
<template>
  <LMenu>
    <LMenuItem item-key="home" label="首页" :icon="HomeIcon" />
    <LSubMenu item-key="settings" label="设置">
      <LMenuItem item-key="profile" label="个人资料" />
      <LMenuItem item-key="security" label="安全设置" />
    </LSubMenu>
    <LMenuDivider />
    <LMenuGroup title="其他">
      <LMenuItem item-key="help" label="帮助" />
    </LMenuGroup>
  </LMenu>
</template>
```

### 水平菜单

```vue
<template>
  <LMenu mode="horizontal" :items="navItems" />
</template>
```

### 折叠菜单

```vue
<template>
  <LMenu :collapsed="isCollapsed" :items="menuItems" />
</template>
```

### 深色主题

```vue
<template>
  <LMenu theme="dark" :items="menuItems" />
</template>
```

### 徽标显示

```vue
<template>
  <LMenuItem
    item-key="messages"
    label="消息"
    :badge="{ type: 'count', count: 5 }"
  />
</template>
```

## 📖 API

### Menu 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `items` | `MenuItem[]` | `[]` | 菜单数据 |
| `mode` | `'vertical' \| 'horizontal'` | `'vertical'` | 菜单模式 |
| `expandMode` | `'inline' \| 'popup' \| 'mixed'` | `'inline'` | 子菜单展开方式 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题 |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | 尺寸 |
| `collapsed` | `boolean` | `false` | 是否折叠 |
| `collapsedWidth` | `number` | `80` | 折叠宽度（px） |
| `expandedWidth` | `number` | `256` | 展开宽度（px） |
| `indent` | `number` | `24` | 子级缩进（px） |
| `accordion` | `boolean` | `false` | 手风琴模式 |
| `trigger` | `'hover' \| 'click'` | `'click'` | 触发方式 |
| `selectedKey` | `string` | - | 选中的菜单项 key（受控） |
| `defaultSelectedKey` | `string` | - | 默认选中的菜单项 key |
| `openKeys` | `string[]` | - | 展开的菜单项 keys（受控） |
| `defaultOpenKeys` | `string[]` | - | 默认展开的菜单项 keys |
| `autoExpandParent` | `boolean` | `true` | 自动展开选中项的父级 |
| `bordered` | `boolean` | `false` | 是否显示边框 |
| `indicatorPosition` | `'left' \| 'right' \| 'bottom' \| 'none'` | `'left'` | 选中指示器位置 |

### Menu 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `select` | `{ key, item, path, event }` | 选中菜单项 |
| `openChange` | `keys: string[]` | 展开/收起变化 |
| `update:selectedKey` | `key: string` | 选中 key 变化（v-model） |
| `update:openKeys` | `keys: string[]` | 展开 keys 变化（v-model） |

### MenuItem 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `itemKey` | `string` | - | 唯一标识（必填） |
| `label` | `string` | - | 显示文本 |
| `icon` | `string \| Component` | - | 图标 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `danger` | `boolean` | `false` | 是否为危险操作 |
| `href` | `string` | - | 链接地址 |
| `target` | `string` | `'_self'` | 链接打开方式 |
| `badge` | `MenuBadge` | - | 徽标配置 |

### SubMenu 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `itemKey` | `string` | - | 唯一标识（必填） |
| `label` | `string` | - | 显示文本 |
| `icon` | `string \| Component` | - | 图标 |
| `disabled` | `boolean` | `false` | 是否禁用 |

### MenuBadge 配置

```ts
interface MenuBadge {
  type?: 'dot' | 'count' | 'text'  // 徽标类型
  count?: number                    // 数字（count 类型）
  text?: string                     // 文本（text 类型）
  max?: number                      // 最大数字，默认 99
  status?: 'default' | 'success' | 'warning' | 'error'  // 状态颜色
  show?: boolean                    // 是否显示
}
```

### MenuItem 数据结构

```ts
// 普通菜单项
interface MenuLeafItem {
  key: string
  label?: string
  icon?: string
  disabled?: boolean
  danger?: boolean
  href?: string
  target?: '_self' | '_blank'
  badge?: MenuBadge
  permissions?: string[]
  roles?: string[]
}

// 子菜单
interface MenuSubItem {
  key: string
  type: 'submenu'
  label?: string
  icon?: string
  disabled?: boolean
  children: MenuItem[]
}

// 分组
interface MenuGroupItem {
  key: string
  type: 'group'
  label?: string
  children: MenuItem[]
}

// 分隔线
interface MenuDividerItem {
  type: 'divider'
  key?: string
  dashed?: boolean
}
```

## 🔍 搜索功能

```ts
import { searchMenuItems, filterMenuItemsBySearch, highlightKeyword } from '@ldesign/menu'

// 搜索菜单项
const results = searchMenuItems(menuItems, {
  keyword: '设置',
  matchPath: true,
  matchKey: false,
})

// 过滤菜单项（保留匹配项及其父级）
const filtered = filterMenuItemsBySearch(menuItems, { keyword: '设置' })

// 高亮关键字
const html = highlightKeyword('系统设置', '设置')
// => '系统<span class="l-menu-highlight">设置</span>'
```

## 🔐 权限过滤

```vue
<template>
  <LMenu :items="menuItems" :filter-config="filterConfig" />
</template>

<script setup>
const filterConfig = {
  permissions: ['admin', 'user.view'],
  roles: ['admin'],
  customFilter: (item) => !item.meta?.hidden,
}
</script>
```

## 🎨 主题定制

通过 CSS 变量自定义主题：

```css
:root {
  /* 主题色 */
  --l-menu-primary-color: #1677ff;
  --l-menu-primary-bg: #e6f4ff;

  /* 文字颜色 */
  --l-menu-text-color: rgba(0, 0, 0, 0.88);
  --l-menu-text-color-secondary: rgba(0, 0, 0, 0.65);

  /* 背景颜色 */
  --l-menu-bg-color: transparent;
  --l-menu-hover-bg-color: rgba(0, 0, 0, 0.04);
  --l-menu-selected-bg-color: #e6f4ff;

  /* 尺寸 */
  --l-menu-item-height: 40px;
  --l-menu-font-size: 14px;
  --l-menu-border-radius: 8px;

  /* 动画 */
  --l-menu-transition-duration: 0.2s;
}
```

## 📁 包结构

```
@ldesign/menu
├── @ldesign/menu-core    # 框架无关的核心逻辑
│   ├── managers/         # 状态管理器
│   ├── types/            # 类型定义
│   └── utils/            # 工具函数
│
└── @ldesign/menu-vue     # Vue 3 组件
    ├── components/       # Vue 组件
    ├── composables/      # Composition API
    └── styles/           # CSS 样式
```

## 🤝 贡献

欢迎贡献代码！请阅读 [贡献指南](./CONTRIBUTING.md)。

## 📄 License

[MIT](./LICENSE) © LDesign Team
