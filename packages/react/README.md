# @ldesign/menu-react

React menu components for LDesign, built on top of `@ldesign/menu-core`.

## Features

- ⚛️ **React 18+**: Built with modern React features
- 🎨 **Consistent UI**: Shares the same design system as Vue and Lit versions
- 🔧 **Flexible**: Support for horizontal/vertical layouts, infinite nesting
- 📱 **Responsive**: Mobile-friendly with collapse support
- ⚡ **Performance**: Virtual scrolling for large menus
- 🎭 **Themeable**: Multiple built-in themes
- 🔒 **Type Safe**: Full TypeScript support
- ♿ **Accessible**: Full keyboard navigation

## Installation

```bash
pnpm add @ldesign/menu-react
```

## Quick Start

```tsx
import { Menu } from '@ldesign/menu-react'
import '@ldesign/menu-react/es/index.css'

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

function App() {
  const handleSelect = (item) => {
    console.log('Selected:', item)
  }

  return (
    <Menu 
      items={menuItems}
      mode="vertical"
      theme="light"
      onSelect={handleSelect}
    />
  )
}
```

## Using with Context

```tsx
import { MenuProvider, Menu } from '@ldesign/menu-react'

function App() {
  return (
    <MenuProvider
      defaultConfig={{
        theme: 'dark',
        animation: true
      }}
    >
      <Menu items={menuItems} />
    </MenuProvider>
  )
}
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
| `className` | `string` | - | Additional CSS class |
| `style` | `React.CSSProperties` | - | Inline styles |

### Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `onSelect` | `(item: MenuItem)` | Fired when item is selected |
| `onExpand` | `(item: MenuItem)` | Fired when item is expanded |
| `onCollapse` | `(item: MenuItem)` | Fired when item is collapsed |
| `onClick` | `(item: MenuItem, event: Event)` | Fired when item is clicked |

## Hooks

### useMenu

```tsx
import { useMenu } from '@ldesign/menu-react'

function MyMenu() {
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

  return <div ref={containerRef}>...</div>
}
```

### useMenuState

```tsx
import { useMenuState } from '@ldesign/menu-react'

function MyMenu() {
  const {
    activeKey,
    expandedKeys,
    collapsed
  } = useMenuState()

  return <div>Active: {activeKey}</div>
}
```

## Ref Methods

```tsx
import { useRef } from 'react'
import { Menu, MenuRef } from '@ldesign/menu-react'

function App() {
  const menuRef = useRef<MenuRef>(null)

  const handleExpand = () => {
    menuRef.current?.expand('2')
  }

  return (
    <>
      <button onClick={handleExpand}>Expand Item 2</button>
      <Menu ref={menuRef} items={menuItems} />
    </>
  )
}
```

## Examples

See the `examples/react-demo` directory for complete examples.

## License

MIT © LDesign Team

