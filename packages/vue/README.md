# @ldesign/menu-vue

Vue 3 menu components for LDesign, built on top of `@ldesign/menu-core`.

## Features

- 🎯 **Vue 3 Composition API**: Modern Vue 3 with `<script setup>`
- 🎨 **Consistent UI**: Shares the same design system as React and Lit versions
- 🔧 **Flexible**: Support for horizontal/vertical layouts, infinite nesting
- 📱 **Responsive**: Mobile-friendly with collapse support
- ⚡ **Performance**: Virtual scrolling for large menus
- 🎭 **Themeable**: Multiple built-in themes
- 🌍 **i18n Ready**: Internationalization support
- ♿ **Accessible**: Full keyboard navigation

## Installation

```bash
pnpm add @ldesign/menu-vue
```

## Quick Start

```vue
<script setup lang="ts">
import { Menu, MenuItem } from '@ldesign/menu-vue'
import '@ldesign/menu-vue/es/index.css'

const menuItems = [
  { id: '1', label: 'Home', icon: '🏠' },
  { 
    id: '2', 
    label: 'Products',
    children: [
      { id: '2-1', label: 'Product A' },
      { id: '2-2', label: 'Product B' }
    ]
  },
  { id: '3', label: 'About', icon: 'ℹ️' }
]

function handleSelect(item) {
  console.log('Selected:', item)
}
</script>

<template>
  <Menu 
    :items="menuItems"
    mode="vertical"
    theme="light"
    @select="handleSelect"
  />
</template>
```

## Using as Plugin

```typescript
import { createApp } from 'vue'
import { MenuPlugin } from '@ldesign/menu-vue'
import App from './App.vue'

const app = createApp(App)
app.use(MenuPlugin)
app.mount('#app')
```

Then use globally:

```vue
<template>
  <l-menu :items="menuItems" />
</template>
```

## Component Props

### Menu

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `MenuItem[]` | `[]` | Menu items data |
| `mode` | `'horizontal' \| 'vertical'` | `'vertical'` | Menu layout mode |
| `theme` | `'light' \| 'dark' \| 'material'` | `'light'` | Theme style |
| `collapsed` | `boolean` | `false` | Collapse state |
| `defaultExpandedKeys` | `(string \| number)[]` | `[]` | Default expanded items |
| `defaultActiveKey` | `string \| number` | - | Default active item |
| `accordion` | `boolean` | `false` | Accordion mode |
| `indent` | `number` | `24` | Indent size per level |

### Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `select` | `(item: MenuItem)` | Fired when item is selected |
| `expand` | `(item: MenuItem)` | Fired when item is expanded |
| `collapse` | `(item: MenuItem)` | Fired when item is collapsed |
| `click` | `(item: MenuItem, event: Event)` | Fired when item is clicked |

## Composables

### useMenu

```typescript
import { useMenu } from '@ldesign/menu-vue'

const {
  containerRef,
  menuRef,
  expand,
  collapse,
  selectItem,
  setCollapsed
} = useMenu({
  mode: 'vertical',
  items: menuItems
})
```

### useMenuState

```typescript
import { useMenuState } from '@ldesign/menu-vue'

const {
  activeKey,
  expandedKeys,
  collapsed
} = useMenuState()
```

## Examples

See the `examples/vue-demo` directory for complete examples.

## License

MIT © LDesign Team

