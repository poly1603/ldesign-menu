# LDesign Menu 设计文档

> 参考 Ant Design 菜单组件设计，提供框架无关的核心实现和 Vue 3 封装。

## 设计目标

1. **Ant Design 风格**：遵循 Ant Design 的设计规范和交互模式
2. **框架无关**：核心逻辑与框架解耦，可适配任意前端框架
3. **高度可定制**：通过 CSS 变量和配置项实现主题定制
4. **流畅动画**：参考 Ant Design 实现优雅的过渡动画
5. **无障碍访问**：支持键盘导航和屏幕阅读器

---

## 菜单模式

### 1. 垂直模式 (vertical)
- **内嵌展开 (inline)**：子菜单在父菜单下方展开
- **弹出展开 (popup)**：子菜单以浮层形式弹出
- **混合模式 (mixed)**：一级内嵌，子级弹出

### 2. 水平模式 (horizontal)
- 菜单项水平排列
- 子菜单以下拉形式弹出
- 支持溢出折叠（更多按钮）

### 3. 折叠模式 (collapsed)
- 只显示图标
- 悬停时显示工具提示
- 子菜单以弹出形式展示

---

## 主题系统

### 浅色主题 (light)
```css
--l-menu-bg-color: transparent;
--l-menu-text-color: #1f2937;
--l-menu-selected-bg-color: #eef2ff;
--l-menu-selected-text-color: #6366f1;
```

### 深色主题 (dark)
```css
--l-menu-bg-color: #1f2937;
--l-menu-text-color: rgba(255, 255, 255, 0.9);
--l-menu-selected-bg-color: rgba(99, 102, 241, 0.2);
--l-menu-selected-text-color: #a5b4fc;
```

---

## 动画效果

### 1. 选中状态动画
- **指示器滑入**：从左侧滑入的选中指示条
- **背景渐变**：背景色平滑过渡
- **文字颜色**：颜色平滑变化

### 2. 内嵌展开动画
- **高度过渡**：使用 `max-height` 或动态高度计算
- **透明度渐变**：内容淡入淡出
- **箭头旋转**：展开箭头 180° 旋转

### 3. 弹出菜单动画
- **缩放+位移**：从触发点展开
- **透明度渐变**：淡入淡出效果
- **spring 缓动**：使用弹簧曲线

### 4. 悬停效果
- **背景高亮**：悬停时背景色变化
- **涟漪效果**：点击时的涟漪反馈

---

## 菜单项类型

### MenuItemType (普通菜单项)
```typescript
interface MenuItemType {
  key: string
  label?: string
  icon?: string | Component
  disabled?: boolean
  danger?: boolean
  href?: string
  target?: '_self' | '_blank'
}
```

### SubMenuType (子菜单)
```typescript
interface SubMenuType {
  key: string
  label?: string
  icon?: string | Component
  disabled?: boolean
  children: MenuItem[]
  theme?: 'light' | 'dark'  // 子菜单可独立设置主题
}
```

### MenuItemGroupType (菜单分组)
```typescript
interface MenuItemGroupType {
  type: 'group'
  label?: string
  children: MenuItem[]
}
```

### MenuDividerType (分隔线)
```typescript
interface MenuDividerType {
  type: 'divider'
  dashed?: boolean
}
```

---

## 核心 API

### MenuConfig (配置项)
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `items` | `MenuItem[]` | `[]` | 菜单数据 |
| `mode` | `'vertical' \| 'horizontal'` | `'vertical'` | 菜单模式 |
| `expandMode` | `'inline' \| 'popup' \| 'mixed'` | `'inline'` | 子菜单展开方式 |
| `theme` | `'light' \| 'dark'` | `'light'` | 主题 |
| `trigger` | `'hover' \| 'click'` | `'click'` | 触发方式 |
| `collapsed` | `boolean` | `false` | 是否折叠 |
| `accordion` | `boolean` | `false` | 手风琴模式 |
| `indent` | `number` | `24` | 缩进像素 |

### 事件
| 事件 | 参数 | 说明 |
|------|------|------|
| `select` | `{ key, item, path }` | 选中菜单项 |
| `openChange` | `{ key, open, openKeys }` | 展开/收起 |
| `hover` | `{ key, item }` | 悬停变化 |

---

## 目录结构

```
packages/menu/
├── packages/
│   ├── core/                    # 核心包（框架无关）
│   │   └── src/
│   │       ├── types/           # 类型定义
│   │       │   ├── menu-item.ts
│   │       │   ├── menu-config.ts
│   │       │   └── menu-state.ts
│   │       ├── managers/        # 状态管理
│   │       │   ├── menu-manager.ts
│   │       │   └── menu-filter.ts
│   │       └── utils/           # 工具函数
│   │           ├── event-emitter.ts
│   │           └── item-helpers.ts
│   │
│   └── vue/                     # Vue 3 封装
│       └── src/
│           ├── components/      # Vue 组件
│           │   ├── Menu.vue
│           │   ├── MenuItem.vue
│           │   ├── SubMenu.vue
│           │   ├── MenuGroup.vue
│           │   ├── MenuDivider.vue
│           │   └── MenuTooltip.vue
│           ├── composables/     # Vue Composables
│           │   ├── useMenu.ts
│           │   └── useMenuContext.ts
│           └── styles/          # 样式文件
│               ├── variables.css
│               ├── menu.css
│               └── animations.css
```

---

## 使用示例

### 基础用法
```vue
<template>
  <LMenu :items="menuItems" @select="handleSelect" />
</template>

<script setup>
import { LMenu } from '@ldesign/menu-vue'

const menuItems = [
  { key: 'home', label: '首页', icon: HomeIcon },
  {
    key: 'settings',
    label: '设置',
    icon: SettingsIcon,
    children: [
      { key: 'profile', label: '个人资料' },
      { key: 'security', label: '安全设置' },
    ]
  }
]
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

### 深色主题
```vue
<template>
  <LMenu theme="dark" :items="menuItems" />
</template>
```

---

## 动画实现细节

### 内嵌展开动画
```css
.l-submenu__content {
  overflow: hidden;
  transition: 
    height 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease;
}

.l-submenu--open > .l-submenu__content {
  opacity: 1;
}

.l-submenu:not(.l-submenu--open) > .l-submenu__content {
  height: 0 !important;
  opacity: 0;
}
```

### 选中指示器动画
```css
.l-menu-item--selected::before {
  animation: indicatorSlideIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes indicatorSlideIn {
  from {
    transform: translateY(-50%) scaleY(0);
    opacity: 0;
  }
  to {
    transform: translateY(-50%) scaleY(1);
    opacity: 1;
  }
}
```

### 弹出菜单动画
```css
.l-submenu-popup-enter-active {
  transition: 
    opacity 0.2s ease,
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.l-submenu-popup-enter-from {
  opacity: 0;
  transform: translateX(-8px) scale(0.95);
}
```

---

## 版本历史

- **v1.0.0** - 初始版本，实现基础功能
- **v1.1.0** - 参考 Ant Design 优化动画和交互
