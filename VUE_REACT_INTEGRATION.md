# @ldesign/menu - Vue3 & React 集成指南

## ✅ 完成状态

Vue3 和 React 封装已 100% 完成！

## 📦 Vue3 集成

### 文件结构

```
src/vue/
├── components/
│   └── Menu.vue              ✅ 菜单主组件
├── composables/
│   ├── useMenu.ts            ✅ 核心 Composable
│   ├── useMenuState.ts       ✅ 状态管理
│   └── index.ts
├── plugin.ts                 ✅ Vue 插件
└── index.ts
```

### 使用方式

#### 1. 安装

```bash
pnpm add @ldesign/menu
```

#### 2. 全局注册（插件方式）

```typescript
import { createApp } from 'vue'
import { MenuPlugin } from '@ldesign/menu/vue'
import '@ldesign/menu/es/styles/index.css'

const app = createApp(App)
app.use(MenuPlugin, {
  prefix: 'L',  // 组件前缀，默认 'L'
  defaultConfig: {
    mode: 'vertical',
    animation: true,
  }
})
```

#### 3. 组件使用

```vue
<template>
  <LMenu
    :items="menuItems"
    mode="vertical"
    :collapsed="collapsed"
    @select="handleSelect"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const collapsed = ref(false)
const menuItems = [
  { id: '1', label: '首页', icon: '🏠' },
  // ...
]

const handleSelect = (item) => {
  console.log('Selected:', item)
}
</script>
```

#### 4. 按需导入

```vue
<template>
  <Menu :items="items" @select="handleSelect" />
</template>

<script setup lang="ts">
import { Menu } from '@ldesign/menu/vue'
import '@ldesign/menu/es/styles/index.css'
</script>
```

### Composables 使用

#### useMenu

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useMenu } from '@ldesign/menu/vue'

const containerRef = ref(null)
const {
  menuRef,
  expandedKeys,
  activeKey,
  collapsed,
  expand,
  collapse,
  toggleCollapsed,
  selectItem,
} = useMenu({
  container: containerRef,
  items: menuItems,
  mode: 'vertical',
})

// 手动控制菜单
const handleToggle = () => {
  toggleCollapsed()
}
</script>

<template>
  <div>
    <button @click="handleToggle">切换收起</button>
    <div ref="containerRef" />
  </div>
</template>
```

#### useMenuState

```vue
<script setup lang="ts">
import { useMenuState } from '@ldesign/menu/vue'

const {
  expandedKeys,
  activeKey,
  collapsed,
  isExpanded,
  isActive,
  expand,
  collapse,
  toggleExpand,
  setActive,
  toggleCollapsed,
} = useMenuState({
  expandedKeys: new Set(['1', '2']),
  activeKey: '1',
  collapsed: false,
})

// 使用状态
console.log(isExpanded('1'))  // true
console.log(isActive('1'))    // true
</script>
```

### Menu 组件 Props

```typescript
interface MenuProps {
  // 基础配置
  items?: MenuItem[]
  mode?: 'horizontal' | 'vertical'
  theme?: 'light' | 'dark' | 'auto'
  
  // 展开行为
  expandMode?: 'hover' | 'click' | 'auto'
  submenuTrigger?: 'popup' | 'inline'
  collapsed?: boolean
  
  // 样式
  width?: string | number
  indent?: number
  itemHeight?: number
  
  // 功能
  animation?: boolean
  virtualScroll?: boolean
  keyboardNavigation?: boolean
  
  // 事件
  onSelect?: (item: MenuItem) => void
  onExpand?: (item: MenuItem) => void
  onCollapse?: (item: MenuItem) => void
}
```

### Menu 组件 Events

```vue
<Menu
  @select="handleSelect"
  @expand="handleExpand"
  @collapse="handleCollapse"
  @click="handleClick"
  @update:collapsed="handleCollapsedUpdate"
/>
```

### Menu 组件 Expose

```vue
<script setup>
const menuRef = ref()

// 调用暴露的方法
menuRef.value?.expand('item-id')
menuRef.value?.collapse('item-id')
menuRef.value?.toggleExpand('item-id')
menuRef.value?.selectItem('item-id')
menuRef.value?.setCollapsed(true)
menuRef.value?.toggleCollapsed()
</script>

<template>
  <Menu ref="menuRef" :items="items" />
</template>
```

## 📦 React 集成

### 文件结构

```
src/react/
├── components/
│   ├── Menu.tsx              ✅ 菜单主组件
│   └── index.ts
├── hooks/
│   ├── useMenu.ts            ✅ 核心 Hook
│   ├── useMenuState.ts       ✅ 状态管理
│   └── index.ts
├── context.tsx               ✅ Context Provider
└── index.tsx
```

### 使用方式

#### 1. 基础使用

```tsx
import { Menu } from '@ldesign/menu/react'
import '@ldesign/menu/es/styles/index.css'

function App() {
  const [collapsed, setCollapsed] = useState(false)
  
  const menuItems = [
    { id: '1', label: 'Home', icon: '🏠' },
    { id: '2', label: 'Products', children: [...] },
  ]

  return (
    <Menu
      items={menuItems}
      mode="vertical"
      collapsed={collapsed}
      onSelect={(item) => console.log(item)}
      onCollapsedChange={setCollapsed}
    />
  )
}
```

#### 2. 使用 Context Provider

```tsx
import { MenuProvider } from '@ldesign/menu/react'

function App() {
  return (
    <MenuProvider defaultConfig={{ mode: 'vertical', animation: true }}>
      <Menu items={menuItems} />
    </MenuProvider>
  )
}
```

#### 3. 使用 Ref

```tsx
import { useRef } from 'react'
import { Menu } from '@ldesign/menu/react'
import type { MenuRef } from '@ldesign/menu/react'

function App() {
  const menuRef = useRef<MenuRef>(null)

  const handleToggle = () => {
    menuRef.current?.toggleCollapsed()
  }

  return (
    <>
      <button onClick={handleToggle}>Toggle</button>
      <Menu ref={menuRef} items={menuItems} />
    </>
  )
}
```

### Hooks 使用

#### useMenu

```tsx
import { useMenu } from '@ldesign/menu/react'

function MyMenu() {
  const {
    containerRef,
    menuRef,
    expandedKeys,
    activeKey,
    collapsed,
    expand,
    collapse,
    toggleCollapsed,
  } = useMenu({
    items: menuItems,
    mode: 'vertical',
  })

  return (
    <div>
      <button onClick={toggleCollapsed}>Toggle</button>
      <div ref={containerRef} />
    </div>
  )
}
```

#### useMenuState

```tsx
import { useMenuState } from '@ldesign/menu/react'

function MyMenu() {
  const {
    expandedKeys,
    activeKey,
    collapsed,
    isExpanded,
    isActive,
    expand,
    collapse,
    toggleExpand,
  } = useMenuState({
    expandedKeys: new Set(['1']),
    activeKey: '1',
  })

  return (
    <div>
      <p>Item 1 is {isExpanded('1') ? 'expanded' : 'collapsed'}</p>
      <button onClick={() => toggleExpand('1')}>Toggle</button>
    </div>
  )
}
```

### Menu 组件 Props

```typescript
interface MenuProps {
  // 基础配置
  items?: MenuItem[]
  mode?: 'horizontal' | 'vertical'
  theme?: 'light' | 'dark' | 'auto'
  
  // 展开行为
  expandMode?: 'hover' | 'click' | 'auto'
  submenuTrigger?: 'popup' | 'inline'
  collapsed?: boolean
  
  // 样式
  className?: string
  style?: React.CSSProperties
  width?: string | number
  
  // 功能
  animation?: boolean
  virtualScroll?: boolean
  keyboardNavigation?: boolean
  
  // 事件
  onSelect?: (item: MenuItem, event?: Event) => void
  onExpand?: (item: MenuItem) => void
  onCollapse?: (item: MenuItem) => void
  onClick?: (item: MenuItem, event: Event) => void
  onCollapsedChange?: (collapsed: boolean) => void
}
```

## 🎨 样式定制

### Vue

```vue
<template>
  <Menu :items="items" class="custom-menu" />
</template>

<style>
.custom-menu {
  --menu-bg: #f0f0f0;
  --menu-text-color: #333;
  --menu-border-radius: 8px;
}
</style>
```

### React

```tsx
<Menu
  items={items}
  style={{
    '--menu-bg': '#f0f0f0',
    '--menu-text-color': '#333',
  } as React.CSSProperties}
/>
```

## 🚀 高级用法

### 自定义图标渲染（Vue）

```vue
<template>
  <Menu :items="items">
    <template #icon="{ item }">
      <component :is="item.icon" />
    </template>
  </Menu>
</template>
```

### 自定义图标渲染（React）

```tsx
const CustomMenu = () => {
  const menuItems = [
    {
      id: '1',
      label: 'Home',
      icon: <HomeIcon />,
    },
  ]
  
  return <Menu items={menuItems} />
}
```

## 📊 性能建议

### 大量菜单项

```typescript
// Vue
<Menu
  :items="largeMenuItems"
  :virtual-scroll="true"
  :virtual-threshold="100"
/>

// React
<Menu
  items={largeMenuItems}
  virtualScroll={true}
  virtualThreshold={100}
/>
```

### 禁用动画（性能优先）

```typescript
// Vue
<Menu :items="items" :animation="false" />

// React
<Menu items={items} animation={false} />
```

## ✨ 总结

Vue3 和 React 封装提供了：

✅ **原生体验** - 符合各框架的使用习惯  
✅ **类型安全** - 完整的 TypeScript 支持  
✅ **响应式** - 自动追踪状态变化  
✅ **易于集成** - 最少的配置即可使用  
✅ **高性能** - 优化的渲染和更新策略  

---

**状态**: ✅ 完成  
**版本**: 0.1.0  
**文档**: README.md, API.md


