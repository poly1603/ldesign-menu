# Menu 组件快速开始

## 安装

```bash
# npm
npm install @ldesign/menu-vue

# pnpm
pnpm add @ldesign/menu-vue

# yarn
yarn add @ldesign/menu-vue
```

## 基础使用

### 1. 导入组件和样式

```typescript
import { LMenu, LMenuItem, LSubMenu } from '@ldesign/menu-vue'
import '@ldesign/menu-vue/styles'
```

### 2. 创建简单菜单

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LMenu, LMenuItem, LSubMenu } from '@ldesign/menu-vue'
import '@ldesign/menu-vue/styles'

const selectedKey = ref('home')
</script>

<template>
  <LMenu v-model:selectedKey="selectedKey">
    <LMenuItem itemKey="home" label="首页" icon="🏠" />
    <LMenuItem itemKey="about" label="关于" icon="ℹ️" />
    
    <LSubMenu itemKey="products" label="产品" icon="📦">
      <LMenuItem itemKey="product-1" label="产品 1" />
      <LMenuItem itemKey="product-2" label="产品 2" />
    </LSubMenu>
  </LMenu>
</template>
```

## 核心特性

### 🎨 涟漪效果

点击菜单项时自动显示涟漪效果，无需额外配置。

```vue
<LMenuItem itemKey="item1" label="点击我看涟漪效果" />
```

### ⌨️ 键盘导航

```vue
<script setup lang="ts">
import { useMenuKeyboard } from '@ldesign/menu-vue'

// 启用键盘导航
const { focusedKey } = useMenuKeyboard({
  items,
  selectedKey,
  openKeys,
  onSelect: (key) => console.log('选中:', key),
  onToggleOpen: (key) => console.log('切换:', key),
})
</script>
```

**支持的按键**：
- `↑` `↓` - 上下移动
- `←` `→` - 展开/收起
- `Enter` `Space` - 选中
- `Esc` - 关闭
- `Home` `End` - 跳转首尾

### 💡 Tooltip (折叠时)

```vue
<script setup lang="ts">
import { LMenuTooltip } from '@ldesign/menu-vue'

const collapsed = ref(true)
</script>

<template>
  <LMenu v-model:collapsed="collapsed">
    <LMenuTooltip 
      v-if="collapsed"
      content="这是完整的菜单项文本"
      placement="right"
    >
      <LMenuItem itemKey="item1" label="菜单项" />
    </LMenuTooltip>
  </LMenu>
</template>
```

### 🌓 深色主题

```vue
<LMenu theme="dark">
  <LMenuItem itemKey="item1" label="深色主题" />
</LMenu>
```

### 📱 响应式

```vue
<LMenu 
  mode="vertical"
  :collapsed-width="64"
  :expanded-width="240"
>
  <LMenuItem itemKey="item1" label="响应式菜单" />
</LMenu>
```

## 常用配置

### 垂直菜单（侧边栏）

```vue
<LMenu
  mode="vertical"
  theme="light"
  :indent="16"
  :collapsed="false"
  :collapsed-width="64"
  :expanded-width="240"
>
  <!-- 菜单项 -->
</LMenu>
```

### 横向菜单（导航栏）

```vue
<LMenu
  mode="horizontal"
  theme="light"
>
  <!-- 菜单项 -->
</LMenu>
```

### 手风琴模式

```vue
<LMenu :accordion="true">
  <LSubMenu itemKey="sub1" label="子菜单 1">
    <!-- 子项 -->
  </LSubMenu>
  <LSubMenu itemKey="sub2" label="子菜单 2">
    <!-- 子项 -->
  </LSubMenu>
</LMenu>
```

## 自定义样式

### 使用 CSS 变量

```vue
<LMenu 
  style="
    --l-menu-hover-bg-color: rgba(59, 130, 246, 0.08);
    --l-menu-selected-bg-color: rgba(59, 130, 246, 0.15);
    --l-menu-border-radius: 12px;
  "
>
  <!-- 菜单项 -->
</LMenu>
```

### 可用的 CSS 变量

```css
/* 颜色 */
--l-menu-hover-bg-color
--l-menu-hover-text-color
--l-menu-selected-bg-color
--l-menu-selected-text-color
--l-menu-selected-indicator-color

/* 尺寸 */
--l-menu-item-height
--l-menu-border-radius
--l-menu-indicator-width

/* 动画 */
--l-menu-transition-duration
--l-menu-transition-timing
--l-menu-ripple-duration
```

## 事件处理

```vue
<script setup lang="ts">
import type { MenuSelectEventParams } from '@ldesign/menu-vue'

function handleSelect(params: MenuSelectEventParams) {
  console.log('选中:', params.key)
  console.log('菜单项:', params.item)
  console.log('路径:', params.path)
}

function handleOpenChange(params) {
  console.log('展开状态:', params.open)
  console.log('所有展开项:', params.openKeys)
}
</script>

<template>
  <LMenu
    @select="handleSelect"
    @open-change="handleOpenChange"
  >
    <!-- 菜单项 -->
  </LMenu>
</template>
```

## 最佳实践

### ✅ 推荐

1. 使用 CSS 变量自定义主题
2. 启用键盘导航提升可访问性
3. 在折叠模式下使用 Tooltip
4. 合理使用动画，避免过度

### ❌ 避免

1. 不要在菜单项中放置过多内容
2. 不要嵌套过深（建议最多 3 层）
3. 不要禁用所有动画（影响用户体验）
4. 不要忘记添加 `itemKey` 属性

## 下一步

- 查看 [完整示例](./EXAMPLES.md)
- 了解 [优化详情](./OPTIMIZATION.md)
- 查看 [更新日志](./CHANGELOG_OPTIMIZATION.md)
- 访问 [API 文档](./README.md)

## 问题反馈

如有问题或建议，欢迎提交 Issue 或 PR。

