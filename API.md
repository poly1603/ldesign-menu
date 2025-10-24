# @ldesign/menu API 文档

## MenuManager

### 构造函数

```typescript
new MenuManager(config?: MenuConfig)
```

#### 参数

- `config` - 菜单配置对象（可选）

### 方法

#### mount(container)

挂载菜单到 DOM 容器。

```typescript
mount(containerOrSelector: HTMLElement | string): void
```

**参数**
- `containerOrSelector` - DOM 元素或选择器字符串

**示例**
```javascript
menu.mount('#app')
// 或
menu.mount(document.getElementById('app'))
```

---

#### unmount()

卸载菜单，清理所有资源。

```typescript
unmount(): void
```

---

#### expand(itemId)

展开指定菜单项。

```typescript
expand(itemId: string | number): void
```

**参数**
- `itemId` - 菜单项 ID

---

#### collapse(itemId)

收起指定菜单项。

```typescript
collapse(itemId: string | number): void
```

**参数**
- `itemId` - 菜单项 ID

---

#### toggleExpand(itemId)

切换菜单项的展开状态。

```typescript
toggleExpand(itemId: string | number): void
```

**参数**
- `itemId` - 菜单项 ID

---

#### selectItem(itemId)

选中指定菜单项。

```typescript
selectItem(itemId: string | number): void
```

**参数**
- `itemId` - 菜单项 ID

---

#### setCollapsed(collapsed)

设置菜单收起状态（仅纵向菜单）。

```typescript
setCollapsed(collapsed: boolean): void
```

**参数**
- `collapsed` - 是否收起

---

#### toggleCollapsed()

切换菜单收起状态。

```typescript
toggleCollapsed(): void
```

---

#### setItems(items)

更新菜单项数据。

```typescript
setItems(items: MenuItem[]): void
```

**参数**
- `items` - 新的菜单项数组

---

#### updateConfig(config)

更新菜单配置。

```typescript
updateConfig(config: Partial<MenuConfig>): void
```

**参数**
- `config` - 要更新的配置项

---

#### destroy()

销毁菜单实例。

```typescript
destroy(): void
```

---

### 事件

MenuManager 继承自 EventEmitter，支持以下事件：

#### select

选中菜单项时触发。

```typescript
menu.on('select', ({ item }) => {
  console.log('Selected:', item)
})
```

---

#### expand

展开菜单项时触发。

```typescript
menu.on('expand', ({ item }) => {
  console.log('Expanded:', item)
})
```

---

#### collapse

收起菜单项时触发。

```typescript
menu.on('collapse', ({ item }) => {
  console.log('Collapsed:', item)
})
```

---

#### click

点击菜单项时触发。

```typescript
menu.on('click', ({ item, event }) => {
  console.log('Clicked:', item)
})
```

---

#### collapsed-change

菜单收起状态变化时触发。

```typescript
menu.on('collapsed-change', ({ collapsed }) => {
  console.log('Collapsed:', collapsed)
})
```

---

#### popup-open

Popup 打开时触发。

```typescript
menu.on('popup-open', ({ itemId }) => {
  console.log('Popup opened for:', itemId)
})
```

---

#### popup-close

Popup 关闭时触发。

```typescript
menu.on('popup-close', ({ itemId }) => {
  console.log('Popup closed for:', itemId)
})
```

---

## 类型定义

### MenuConfig

```typescript
interface MenuConfig {
  // 基础配置
  mode?: 'horizontal' | 'vertical'
  theme?: 'light' | 'dark' | 'auto'
  items?: MenuItem[]

  // 展开行为
  expandMode?: 'hover' | 'click' | 'auto'
  submenuTrigger?: 'popup' | 'inline'
  collapsed?: boolean
  defaultExpandedKeys?: (string | number)[]
  defaultActiveKey?: string | number
  accordion?: boolean

  // 样式配置
  width?: string | number
  collapsedWidth?: string | number
  indent?: number
  itemHeight?: number
  popupOffset?: number

  // 性能优化
  virtualScroll?: boolean
  virtualThreshold?: number
  lazyLoad?: boolean

  // 动画配置
  animation?: boolean
  animationType?: AnimationType
  animationDuration?: number
  animationEasing?: string

  // 响应式
  responsive?: boolean
  collapseMode?: 'more' | 'scroll'
  breakpoint?: number

  // 键盘导航
  keyboardNavigation?: boolean

  // 事件回调
  onSelect?: (item: MenuItem, event?: Event) => void
  onExpand?: (item: MenuItem) => void
  onCollapse?: (item: MenuItem) => void
  onClick?: (item: MenuItem, event: Event) => void
  onCollapsedChange?: (collapsed: boolean) => void
}
```

### MenuItem

```typescript
interface MenuItem {
  // 必填字段
  id: string | number
  label: string

  // 可选字段
  icon?: any
  disabled?: boolean
  hidden?: boolean
  children?: MenuItem[]

  // 扩展字段
  path?: string
  permissions?: string[]
  badge?: string | number
  tooltip?: string
  metadata?: any
  clickable?: boolean
  divider?: boolean
  group?: boolean

  // 自定义渲染
  render?: (item: MenuItem) => any
  renderIcon?: (item: MenuItem) => any
  renderLabel?: (item: MenuItem) => any
}
```

### MenuMode

```typescript
type MenuMode = 'horizontal' | 'vertical'
```

### MenuTheme

```typescript
type MenuTheme = 'light' | 'dark' | 'auto'
```

### ExpandMode

```typescript
type ExpandMode = 'hover' | 'click' | 'auto'
```

### SubmenuTrigger

```typescript
type SubmenuTrigger = 'popup' | 'inline'
```

### AnimationType

```typescript
type AnimationType = 'fade' | 'slide' | 'zoom' | 'none' | string
```

---

## 工具函数

### 树形数据处理

#### flattenTree

扁平化树形数据。

```typescript
function flattenTree(
  items: MenuItem[],
  level?: number,
  parentId?: string | number,
  path?: (string | number)[]
): FlatMenuItem[]
```

---

#### findMenuItem

根据 ID 查找菜单项。

```typescript
function findMenuItem(
  items: MenuItem[],
  id: string | number
): MenuItem | undefined
```

---

#### findMenuItemByPath

根据路径查找菜单项。

```typescript
function findMenuItemByPath(
  items: MenuItem[],
  path: string
): MenuItem | undefined
```

---

#### filterMenuTree

过滤菜单树。

```typescript
function filterMenuTree(
  items: MenuItem[],
  predicate: (item: MenuItem) => boolean
): MenuItem[]
```

---

#### filterMenuByPermissions

根据权限过滤菜单。

```typescript
function filterMenuByPermissions(
  items: MenuItem[],
  userPermissions: string[]
): MenuItem[]
```

---

### 验证函数

#### validateMenuItem

验证菜单项数据。

```typescript
function validateMenuItem(item: any): item is MenuItem
```

---

#### validateMenuConfig

验证菜单配置。

```typescript
function validateMenuConfig(config: any): config is MenuConfig
```

---

## CSS 变量

### 颜色变量

```css
--menu-bg                    /* 菜单背景色 */
--menu-bg-hover              /* 菜单项悬停背景色 */
--menu-bg-active             /* 菜单项激活背景色 */
--menu-submenu-bg            /* 子菜单背景色 */
--menu-popup-bg              /* Popup 背景色 */
--menu-text-color            /* 文字颜色 */
--menu-text-color-hover      /* 悬停文字颜色 */
--menu-text-color-active     /* 激活文字颜色 */
--menu-border-color          /* 边框颜色 */
```

### 尺寸变量

```css
--menu-width                 /* 菜单宽度 */
--menu-collapsed-width       /* 收起时宽度 */
--menu-item-height           /* 菜单项高度 */
--menu-item-padding-x        /* 菜单项水平内边距 */
--menu-item-padding-y        /* 菜单项垂直内边距 */
--menu-indent                /* 子菜单缩进 */
--menu-icon-size             /* 图标尺寸 */
--menu-border-radius         /* 边框圆角 */
```

### 动画变量

```css
--menu-animation-duration    /* 动画持续时间 */
--menu-animation-easing      /* 动画缓动函数 */
```

### 阴影变量

```css
--menu-shadow                /* 菜单阴影 */
--menu-popup-shadow          /* Popup 阴影 */
```

---

## 示例

### 完整示例

```javascript
import { MenuManager } from '@ldesign/menu'
import '@ldesign/menu/es/index.css'

const menuItems = [
  {
    id: '1',
    label: '首页',
    icon: '🏠',
    path: '/',
  },
  {
    id: '2',
    label: '产品',
    icon: '📦',
    children: [
      { id: '2-1', label: '产品 A', path: '/products/a' },
      { id: '2-2', label: '产品 B', path: '/products/b' },
      {
        id: '2-3',
        label: '产品 C',
        children: [
          { id: '2-3-1', label: '子产品 1' },
          { id: '2-3-2', label: '子产品 2' },
        ],
      },
    ],
  },
  {
    id: '3',
    label: '设置',
    icon: '⚙️',
    permissions: ['admin'],
  },
]

const menu = new MenuManager({
  mode: 'vertical',
  items: menuItems,
  collapsed: false,
  animation: true,
  virtualScroll: true,
  keyboardNavigation: true,
  
  onSelect: (item) => {
    if (item.path) {
      // 路由跳转
      router.push(item.path)
    }
  },
  
  onCollapsedChange: (collapsed) => {
    localStorage.setItem('menu-collapsed', collapsed)
  },
})

// 挂载
menu.mount('#app')

// 监听事件
menu.on('select', ({ item }) => {
  console.log('Selected:', item)
})

// 切换收起
document.getElementById('toggle-btn').addEventListener('click', () => {
  menu.toggleCollapsed()
})
```


