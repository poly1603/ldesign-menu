# 菜单组件优化版本 - 快速开始

## 🎉 优化亮点

菜单组件已经过全面优化，现在拥有：

- ✨ **精美的视觉设计** - 参考 TDesign 和 Ant Design
- 💫 **流畅的交互动画** - 涟漪效果、悬停动画、展开收起动画
- 🎯 **清晰的激活指示器** - 左侧/底部彩色指示条
- 🌓 **完美的深色模式支持** - 精心调整的颜色和阴影
- ⚡ **优秀的性能** - GPU 加速、智能 will-change
- ♿ **完整的无障碍支持** - 键盘导航、屏幕阅读器

## 📦 快速预览

打开 `packages/menu/examples/vue/demo.html` 查看完整的演示效果！

## 🚀 基础使用

### Vue 3

```vue
<template>
  <l-menu 
    :items="menuItems"
    mode="vertical"
    :collapsed="collapsed"
    @select="handleSelect"
  />
</template>

<script setup>
import { ref } from 'vue'

const collapsed = ref(false)

const menuItems = ref([
  {
    id: '1',
    label: '首页',
    icon: '🏠',
    path: '/'
  },
  {
    id: '2',
    label: '产品管理',
    icon: '📦',
    badge: '5',
    children: [
      { id: '2-1', label: '产品列表', path: '/products' },
      { id: '2-2', label: '添加产品', path: '/products/add' }
    ]
  },
  {
    id: '3',
    label: '用户管理',
    icon: '👥',
    path: '/users'
  }
])

const handleSelect = (item) => {
  console.log('选中菜单:', item)
}
</script>
```

## 🎨 主要优化特性

### 1. 涟漪效果

点击菜单项时会出现从点击位置扩散的涟漪效果，提供即时的视觉反馈。

```css
/* 涟漪效果已内置，无需额外配置 */
.ldesign-menu-item__content::before {
  /* 涟漪动画 */
}
```

### 2. 激活指示器

**垂直菜单** - 左侧彩色指示条：
```
│ 首页
│ 产品管理
```

**水平菜单** - 底部彩色指示条：
```
首页  产品  用户
───
```

### 3. 悬停动画

- 图标轻微放大（1.1倍）
- 菜单项微妙位移（2px）
- 颜色渐变过渡
- 背景色变化

### 4. 角标优化

```vue
{
  id: '2',
  label: '订单',
  badge: '12'  // 带渐变背景和脉动动画
}
```

### 5. 子菜单动画

- 平滑的展开/收起动画
- 子项依次淡入效果
- 每个子项延迟 30ms

## 🎯 高级配置

### 禁用动画

```vue
<l-menu 
  :items="menuItems"
  :animation="false"
/>
```

### 水平菜单

```vue
<l-menu 
  :items="menuItems"
  mode="horizontal"
/>
```

### 折叠菜单

```vue
<l-menu 
  :items="menuItems"
  :collapsed="true"
/>
```

## 🎨 自定义样式

### 使用 CSS 变量

```css
:root {
  /* 自定义菜单项高度 */
  --menu-item-height: 48px;
  
  /* 自定义激活颜色 */
  --menu-bg-active: #e6f7ff;
  --menu-text-color-active: #1890ff;
  --menu-indicator-color: #1890ff;
  
  /* 自定义动画时长 */
  --menu-animation-duration: 400ms;
  
  /* 自定义涟漪颜色 */
  --menu-ripple-color: rgba(24, 144, 255, 0.3);
}
```

### 深色主题

```html
<html data-theme-mode="dark">
  <!-- 自动应用深色主题样式 -->
</html>
```

## 📊 CSS 变量参考

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--menu-item-height` | 40px | 菜单项高度 |
| `--menu-icon-size` | 20px | 图标大小 |
| `--menu-border-radius` | 4px | 边框圆角 |
| `--menu-animation-duration` | 300ms | 动画时长 |
| `--menu-indicator-width` | 3px | 指示器宽度 |
| `--menu-ripple-duration` | 600ms | 涟漪时长 |

## 🎮 交互效果

### 键盘导航

- `Tab` - 切换焦点
- `Enter` / `Space` - 激活菜单项
- `→` - 展开子菜单
- `←` - 收起子菜单

### 鼠标交互

- **点击** - 激活菜单项（带涟漪效果）
- **悬停** - 高亮显示（图标放大、位移）
- **长按** - 涟漪效果持续

## ♿ 无障碍支持

### ARIA 属性

```html
<div
  role="menuitem"
  aria-expanded="true"
  aria-disabled="false"
  tabindex="0"
>
```

### 减少动画

自动检测用户偏好设置：

```css
@media (prefers-reduced-motion: reduce) {
  /* 所有动画时长降至最低 */
}
```

## 🎨 图标使用

### Emoji 图标

```javascript
{
  id: '1',
  icon: '🏠',
  label: '首页'
}
```

### SVG 图标

```javascript
{
  id: '2',
  icon: '<svg>...</svg>',
  label: '产品'
}
```

### 图标库（推荐）

```vue
<template>
  <l-menu :items="menuItems" />
</template>

<script setup>
import { Home, Package, Users } from '@ldesign/icons'

const menuItems = [
  {
    id: '1',
    icon: Home,
    label: '首页'
  }
]
</script>
```

## 🚀 性能优化

优化后的菜单具有出色的性能：

1. **GPU 加速** - 使用 `transform` 和 `opacity`
2. **智能 will-change** - 仅在需要时启用
3. **高效动画** - 避免触发 reflow
4. **按需加载** - 子菜单按需渲染

## 📱 响应式设计

在移动设备上自动调整：

- 菜单项高度减小至 36px
- 内边距适当缩小
- 触摸友好的点击区域

## 🎯 最佳实践

### 1. 合理使用角标

```javascript
// ✅ 好的用法
{ label: '消息', badge: '5' }

// ❌ 避免
{ label: '消息', badge: '999+' } // 太长
```

### 2. 限制菜单层级

```javascript
// ✅ 推荐 2-3 层
一级菜单
  └─ 二级菜单
      └─ 三级菜单

// ❌ 避免过深
一级 → 二级 → 三级 → 四级 → 五级
```

### 3. 合理的菜单项数量

```javascript
// ✅ 每组 5-8 个菜单项
// ❌ 避免超过 15 个菜单项
```

### 4. 使用分隔线

```javascript
[
  { id: '1', label: '首页' },
  { id: '2', label: '产品' },
  { type: 'divider' }, // 分隔线
  { id: '3', label: '设置' }
]
```

## 🎨 主题定制示例

### 品牌色定制

```css
:root {
  /* 使用品牌色 */
  --color-primary-default: #ff6b6b;
  --menu-bg-active: #ffe0e0;
  --menu-text-color-active: #ff6b6b;
  --menu-indicator-color: #ff6b6b;
}
```

### 紧凑模式

```css
:root {
  --menu-item-height: 32px;
  --menu-item-padding-x: 12px;
  --menu-item-padding-y: 6px;
}
```

### 宽松模式

```css
:root {
  --menu-item-height: 48px;
  --menu-item-padding-x: 20px;
  --menu-item-padding-y: 12px;
}
```

## 🐛 常见问题

### Q: 如何禁用涟漪效果？

```css
.ldesign-menu-item__content::before {
  display: none;
}
```

### Q: 如何修改激活指示器位置？

```css
/* 右侧指示器 */
.ldesign-menu-item--active > .ldesign-menu-item__content::after {
  left: auto;
  right: 0;
  border-radius: 2px 0 0 2px;
}
```

### Q: 如何加快动画速度？

```css
:root {
  --menu-animation-duration: 150ms;
  --menu-animation-duration-fast: 100ms;
}
```

## 📚 更多资源

- [完整文档](./README.md)
- [优化总结](./MENU_OPTIMIZATION_SUMMARY.md)
- [在线演示](./examples/vue/demo.html)
- [API 文档](./API.md)

## 🎉 开始使用

打开演示文件体验优化后的菜单：

```bash
# 在浏览器中打开
open packages/menu/examples/vue/demo.html
```

享受全新的菜单体验！✨

