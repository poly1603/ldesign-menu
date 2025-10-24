# @ldesign/menu 快速开始

## 安装

```bash
# 从 workspace 根目录
cd packages/menu
pnpm install
```

## 构建

```bash
pnpm run build
```

## 开发模式

```bash
pnpm run dev
```

## 运行示例

### 原生 JavaScript 示例

```bash
# 在浏览器中打开
open examples/vanilla/index.html
```

或使用本地服务器：
```bash
# 从 workspace 根目录
npx serve packages/menu/examples/vanilla
```

## 基础使用

### 1. 引入

```javascript
import { MenuManager } from '@ldesign/menu'
import '@ldesign/menu/es/index.css'
```

### 2. 创建菜单数据

```javascript
const menuItems = [
  {
    id: '1',
    label: '首页',
    icon: '🏠',
  },
  {
    id: '2',
    label: '产品',
    icon: '📦',
    children: [
      { id: '2-1', label: '产品 A' },
      { id: '2-2', label: '产品 B' },
    ],
  },
]
```

### 3. 初始化菜单

```javascript
const menu = new MenuManager({
  mode: 'vertical',
  items: menuItems,
  onSelect: (item) => {
    console.log('Selected:', item)
  },
})
```

### 4. 挂载到 DOM

```javascript
menu.mount('#app')
```

## 常见场景

### 横向菜单

```javascript
const menu = new MenuManager({
  mode: 'horizontal',
  items: menuItems,
  submenuTrigger: 'popup',
})
```

### 纵向菜单（收起模式）

```javascript
const menu = new MenuManager({
  mode: 'vertical',
  collapsed: true,
  items: menuItems,
})

// 切换收起状态
menu.toggleCollapsed()
```

### 响应式菜单

```javascript
const menu = new MenuManager({
  mode: 'horizontal',
  responsive: true,
  breakpoint: 768,
  collapseMode: 'more',
  items: menuItems,
})
```

### 虚拟滚动

```javascript
const menu = new MenuManager({
  mode: 'vertical',
  virtualScroll: true,
  virtualThreshold: 100,
  items: largeMenuItems, // 1000+ 项
})
```

## API 快速参考

### MenuManager 方法

```javascript
// 挂载
menu.mount('#app')

// 展开/收起菜单项
menu.expand('item-id')
menu.collapse('item-id')
menu.toggleExpand('item-id')

// 选中菜单项
menu.selectItem('item-id')

// 收起菜单
menu.setCollapsed(true)
menu.toggleCollapsed()

// 更新菜单项
menu.setItems(newItems)

// 更新配置
menu.updateConfig({ theme: 'dark' })

// 卸载
menu.unmount()
```

### 事件监听

```javascript
menu.on('select', ({ item }) => {
  console.log('Selected:', item)
})

menu.on('expand', ({ item }) => {
  console.log('Expanded:', item)
})

menu.on('collapsed-change', ({ collapsed }) => {
  console.log('Collapsed:', collapsed)
})
```

## 样式定制

### CSS 变量

```css
:root {
  /* 颜色 */
  --menu-bg: #ffffff;
  --menu-text-color: #333333;
  --menu-bg-active: #1890ff;
  
  /* 尺寸 */
  --menu-width: 240px;
  --menu-item-height: 40px;
  --menu-border-radius: 6px;
  
  /* 动画 */
  --menu-animation-duration: 300ms;
}
```

### 暗色主题

```javascript
// 设置暗色主题
document.documentElement.setAttribute('data-theme-mode', 'dark')

// 或在配置中指定
const menu = new MenuManager({
  theme: 'dark',
  items: menuItems,
})
```

## 下一步

- 查看 [README.md](./README.md) 了解完整 API
- 查看 [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) 了解实现细节
- 查看 [examples/](./examples/) 获取更多示例

## 常见问题

### 如何自定义图标？

```javascript
const menuItems = [
  {
    id: '1',
    label: '首页',
    icon: '<svg>...</svg>', // 支持 SVG 字符串
  },
  {
    id: '2',
    label: '设置',
    icon: '⚙️', // 支持 emoji
  },
]
```

### 如何处理路由？

```javascript
const menu = new MenuManager({
  items: menuItems,
  onSelect: (item) => {
    if (item.path) {
      // 使用你的路由系统
      router.push(item.path)
    }
  },
})
```

### 如何权限控制？

```javascript
import { filterMenuByPermissions } from '@ldesign/menu'

const userPermissions = ['read', 'write']
const filteredItems = filterMenuByPermissions(menuItems, userPermissions)

const menu = new MenuManager({
  items: filteredItems,
})
```

## 性能优化建议

1. **大列表使用虚拟滚动**
   ```javascript
   virtualScroll: true
   ```

2. **禁用不必要的动画**
   ```javascript
   animation: false
   ```

3. **使用懒加载**
   ```javascript
   lazyLoad: true
   ```

4. **合理设置缓存阈值**
   ```javascript
   virtualThreshold: 100
   ```


