# @ldesign/menu-core

Framework-agnostic menu system core logic for LDesign.

## Features

- **Framework Independent**: Pure TypeScript/JavaScript, no framework dependencies
- **Complete Menu Logic**: Menu management, state management, event handling
- **Animation System**: Built-in animation controller for smooth transitions
- **Layout Engine**: Flexible layout calculations for both horizontal and vertical modes
- **Popup Management**: Advanced popup positioning and management
- **Virtual Scrolling**: Efficient rendering for large menu trees
- **Event System**: Comprehensive event delegation and keyboard navigation
- **Type Safe**: Full TypeScript support with detailed type definitions

## Installation

```bash
pnpm add @ldesign/menu-core
```

## Usage

```typescript
import { MenuManager } from '@ldesign/menu-core'
import '@ldesign/menu-core/es/index.css'

const menu = new MenuManager({
  mode: 'vertical',
  theme: 'light',
  items: [
    { id: '1', label: 'Home', icon: '🏠' },
    { 
      id: '2', 
      label: 'Products',
      children: [
        { id: '2-1', label: 'Product A' },
        { id: '2-2', label: 'Product B' }
      ]
    }
  ],
  onSelect: (item) => {
    console.log('Selected:', item.label)
  }
})

// Mount to DOM
menu.mount('#app')

// API
menu.expand('2')           // Expand menu item
menu.selectItem('2-1')     // Select menu item
menu.setCollapsed(true)    // Collapse menu

// Cleanup
menu.destroy()
```

## Core Modules

- **MenuManager**: Main menu controller
- **StateManager**: Menu state management
- **AnimationController**: Animation orchestration
- **LayoutEngine**: Layout calculations
- **PopupManager**: Popup positioning and lifecycle
- **EventDelegator**: Event handling and keyboard navigation
- **VirtualScroller**: Virtual scrolling for performance

## Framework Integration

This core package is designed to be wrapped by framework-specific implementations:

- `@ldesign/menu-vue` - Vue 3 components
- `@ldesign/menu-react` - React components
- `@ldesign/menu-lit` - Lit Web Components

## License

MIT © LDesign Team

