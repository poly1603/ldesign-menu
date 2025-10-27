# @ldesign/menu-lit

Lit Web Components for LDesign Menu, built on top of `@ldesign/menu-core`.

## Features

- 🌐 **Web Components**: Standard-based, framework-agnostic
- 🎨 **Consistent UI**: Shares the same design system as Vue and React versions
- 🔧 **Flexible**: Support for horizontal/vertical layouts, infinite nesting
- 📱 **Responsive**: Mobile-friendly with collapse support
- ⚡ **Performance**: Virtual scrolling for large menus
- 🎭 **Themeable**: Multiple built-in themes
- 🔒 **Type Safe**: Full TypeScript support
- ♿ **Accessible**: Full keyboard navigation
- 🎯 **Lit-powered**: Built with Lit for optimal performance

## Installation

```bash
pnpm add @ldesign/menu-lit
```

## Quick Start

### In HTML

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@ldesign/menu-lit/es/index.css">
  <script type="module" src="node_modules/@ldesign/menu-lit/es/index.js"></script>
</head>
<body>
  <ldesign-menu id="menu"></ldesign-menu>

  <script type="module">
    const menu = document.getElementById('menu')
    menu.items = [
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

    menu.addEventListener('select', (e) => {
      console.log('Selected:', e.detail)
    })
  </script>
</body>
</html>
```

### In TypeScript/JavaScript

```typescript
import '@ldesign/menu-lit'
import '@ldesign/menu-lit/es/index.css'

const menu = document.createElement('ldesign-menu')
menu.items = [
  { id: '1', label: 'Home', icon: '🏠' },
  { 
    id: '2', 
    label: 'Products',
    children: [
      { id: '2-1', label: 'Product A' },
      { id: '2-2', label: 'Product B' }
    ]
  }
]

menu.mode = 'vertical'
menu.theme = 'light'

menu.addEventListener('select', (e) => {
  console.log('Selected:', e.detail)
})

document.body.appendChild(menu)
```

### In React (via Web Components)

```tsx
import '@ldesign/menu-lit'
import { useRef, useEffect } from 'react'

function App() {
  const menuRef = useRef<any>(null)

  useEffect(() => {
    const menu = menuRef.current
    if (menu) {
      menu.items = [
        { id: '1', label: 'Home', icon: '🏠' },
        { id: '2', label: 'Products', children: [...] }
      ]
      
      menu.addEventListener('select', (e: CustomEvent) => {
        console.log('Selected:', e.detail)
      })
    }
  }, [])

  return <ldesign-menu ref={menuRef} mode="vertical" theme="light" />
}
```

### In Vue

```vue
<template>
  <ldesign-menu 
    ref="menuRef"
    mode="vertical" 
    theme="light"
    @select="handleSelect"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import '@ldesign/menu-lit'

const menuRef = ref()

onMounted(() => {
  if (menuRef.value) {
    menuRef.value.items = [
      { id: '1', label: 'Home', icon: '🏠' },
      { id: '2', label: 'Products', children: [...] }
    ]
  }
})

function handleSelect(e: CustomEvent) {
  console.log('Selected:', e.detail)
}
</script>
```

## Properties (Attributes)

| Property | Attribute | Type | Default | Description |
|----------|-----------|------|---------|-------------|
| `items` | - | `MenuItem[]` | `[]` | Menu items data |
| `mode` | `mode` | `'horizontal' \| 'vertical'` | `'vertical'` | Menu layout mode |
| `theme` | `theme` | `'light' \| 'dark' \| 'material'` | `'light'` | Theme style |
| `collapsed` | `collapsed` | `boolean` | `false` | Collapse state |
| `defaultExpandedKeys` | - | `(string \| number)[]` | `[]` | Default expanded items |
| `defaultActiveKey` | `default-active-key` | `string \| number` | - | Default active item |
| `accordion` | `accordion` | `boolean` | `false` | Accordion mode |
| `indent` | `indent` | `number` | `24` | Indent size per level |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `select` | `MenuItem` | Fired when item is selected |
| `expand` | `MenuItem` | Fired when item is expanded |
| `collapse` | `MenuItem` | Fired when item is collapsed |

## Methods

```typescript
const menu = document.querySelector('ldesign-menu')

// Expand menu item
menu.expand('2')

// Collapse menu item
menu.collapse('2')

// Select menu item
menu.selectItem('2-1')

// Set collapsed state
menu.setCollapsed(true)
```

## Custom Styling

```css
ldesign-menu {
  --menu-bg: #ffffff;
  --menu-text: #333333;
  --menu-hover-bg: #f5f5f5;
  --menu-active-bg: #e6f7ff;
  --menu-active-text: #1890ff;
}

ldesign-menu::part(item) {
  padding: 12px 16px;
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Any browser supporting Web Components

## Examples

See the `examples/lit-demo` directory for complete examples.

## License

MIT © LDesign Team

