# @ldesign/menu

现代化菜单组件，支持横向/纵向布局、无限层级、多种展开模式，内置 Vue3 和 React 封装。

## ✨ 特性

🎯 **多种模式** - 支持横向和纵向菜单布局  
🎨 **主题系统** - 基于 CSS 变量，支持亮色/暗色主题  
📱 **响应式** - 横向菜单支持响应式收起  
🎯 **无限层级** - 支持任意深度的菜单嵌套  
🚀 **高性能** - 虚拟滚动、事件委托、懒加载  
💫 **动画流畅** - 基于 WAAPI 的高性能动画  
⌨️ **键盘导航** - 完整的键盘访问支持  
🎭 **灵活定制** - 支持自定义图标、渲染函数  
🔌 **框架支持** - 原生 JS、Vue3、React 全覆盖  
📦 **体积小** - 核心代码 < 10KB (gzip)

## 📦 安装

```bash
pnpm add @ldesign/menu
```

## 🚀 快速开始

### 原生 JavaScript

```javascript
import { MenuManager } from '@ldesign/menu'
import '@ldesign/menu/es/index.css'

const menu = new MenuManager({
  mode: 'vertical',
  items: [
    {
      id: '1',
      label: '首页',
      icon: '🏠',
    },
    {
      id: '2',
      label: '产品',
      children: [
        { id: '2-1', label: '产品 A' },
        { id: '2-2', label: '产品 B' },
      ],
    },
  ],
  onSelect: (item) => {
    console.log('Selected:', item)
  },
})

menu.mount('#app')
```

### Vue 3

```vue
<template>
  <Menu
    :items="menuItems"
    mode="vertical"
    :collapsed="collapsed"
    @select="handleSelect"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Menu } from '@ldesign/menu/vue'
import '@ldesign/menu/es/index.css'

const collapsed = ref(false)
const menuItems = [
  {
    id: '1',
    label: '首页',
    icon: '🏠',
  },
  // ...
]

const handleSelect = (item) => {
  console.log('Selected:', item)
}
</script>
```

### React

```tsx
import { useState } from 'react'
import { Menu } from '@ldesign/menu/react'
import '@ldesign/menu/es/index.css'

function App() {
  const [collapsed, setCollapsed] = useState(false)
  
  const menuItems = [
    {
      id: '1',
      label: '首页',
      icon: '🏠',
    },
    // ...
  ]

  return (
    <Menu
      items={menuItems}
      mode="horizontal"
      collapsed={collapsed}
      onSelect={(item) => console.log(item)}
      onCollapsedChange={setCollapsed}
    />
  )
}
```

## 📖 配置选项

### MenuConfig

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mode` | `'horizontal' \| 'vertical'` | `'vertical'` | 菜单模式 |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | 主题 |
| `items` | `MenuItem[]` | `[]` | 菜单数据 |
| `expandMode` | `'hover' \| 'click' \| 'auto'` | `'hover'` | 展开模式 |
| `submenuTrigger` | `'popup' \| 'inline'` | `'popup'` | 子菜单触发方式 |
| `collapsed` | `boolean` | `false` | 收起模式（仅纵向） |
| `width` | `string \| number` | `'240px'` | 菜单宽度 |
| `indent` | `number` | `24` | 子菜单缩进 |
| `animation` | `boolean` | `true` | 启用动画 |
| `virtualScroll` | `boolean` | `false` | 启用虚拟滚动 |
| `keyboardNavigation` | `boolean` | `true` | 启用键盘导航 |

### MenuItem

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | `string \| number` | 唯一标识 |
| `label` | `string` | 菜单项文本 |
| `icon` | `any` | 图标 |
| `disabled` | `boolean` | 是否禁用 |
| `hidden` | `boolean` | 是否隐藏 |
| `children` | `MenuItem[]` | 子菜单项 |
| `path` | `string` | 路由路径 |
| `badge` | `string \| number` | 角标 |
| `permissions` | `string[]` | 权限控制 |

完整 API 请查看 [API.md](./API.md)

## 🎨 主题定制

使用 CSS 变量自定义主题：

```css
:root {
  --menu-bg: #ffffff;
  --menu-text-color: #333333;
  --menu-bg-active: #1890ff;
  --menu-border-radius: 6px;
  --menu-animation-duration: 300ms;
}
```

## 🔧 高级用法

### 虚拟滚动

```javascript
const menu = new MenuManager({
  virtualScroll: true,
  virtualThreshold: 100,
  items: largeMenuItems, // 1000+ 项
})
```

### 权限控制

```javascript
import { filterMenuByPermissions } from '@ldesign/menu'

const userPermissions = ['read', 'write']
const filteredItems = filterMenuByPermissions(menuItems, userPermissions)
```

### Vue Composable

```vue
<script setup>
import { useMenu } from '@ldesign/menu/vue'

const { 
  containerRef, 
  expand, 
  collapse, 
  toggleCollapsed 
} = useMenu({
  items: menuItems,
  mode: 'vertical'
})
</script>
```

### React Hook

```tsx
import { useMenu } from '@ldesign/menu/react'

function MyMenu() {
  const { 
    containerRef, 
    expand, 
    collapse, 
    toggleCollapsed 
  } = useMenu({
    items: menuItems,
    mode: 'vertical'
  })
  
  return <div ref={containerRef} />
}
```

## 📊 性能

- **Bundle Size (gzip)**: Core < 10KB, Vue < 5KB, React < 5KB
- **首次渲染**: < 50ms (100项)
- **交互响应**: < 16ms (60fps)
- **虚拟滚动**: 支持 10000+ 项

## 🌐 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📚 文档

- [快速开始](./QUICK_START.md)
- [API 文档](./API.md)
- [实施总结](./IMPLEMENTATION_SUMMARY.md)
- [项目总结](./PROJECT_SUMMARY.md)

## 🔗 示例

- [原生 JavaScript](./examples/vanilla/index.html)
- [Vue 3](./examples/vue/index.html)
- [React](./examples/react/index.html)

## 📄 License

MIT

## 🤝 贡献

欢迎贡献代码！请查看 [贡献指南](../../CONTRIBUTING.md)。

---

**版本**: 0.1.0  
**作者**: LDesign Team  
**仓库**: https://github.com/ldesign/ldesign
