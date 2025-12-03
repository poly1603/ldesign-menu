# Menu 组件优化说明

## 优化概览

本次优化参考 TDesign 设计规范，全面提升了 Menu 组件的交互体验和视觉效果。

## 已完成的优化

### 1. CSS 变量和样式系统优化 ✅

#### 新增设计 Token
- **颜色系统**：细化了 hover、active、selected、focus 等状态的颜色
- **尺寸系统**：支持 compact、default、large 三种尺寸
- **动画系统**：新增多种缓动函数，包括 spring 弹性动画
- **阴影系统**：优化弹出菜单阴影，增强层次感

#### 优化的 CSS 变量
```css
/* 新增 Hover 状态颜色 */
--l-menu-hover-text-color

/* 新增 Focus 状态样式 */
--l-menu-focus-outline-color
--l-menu-focus-outline-width
--l-menu-focus-outline-offset

/* 新增选中指示器变量 */
--l-menu-indicator-width
--l-menu-indicator-height
--l-menu-selected-indicator-color

/* 新增动画曲线 */
--l-menu-transition-timing-ease-out
--l-menu-transition-timing-ease-in-out
--l-menu-transition-timing-spring

/* 新增涟漪效果变量 */
--l-menu-ripple-color
--l-menu-ripple-duration
```

### 2. 交互动效优化 ✅

#### 涟漪效果（Ripple Effect）
- 为 MenuItem 和 SubMenu 添加了点击涟漪效果
- 使用原生 CSS 动画，性能优异
- 支持深色主题自动适配

#### 动画优化
- **选中指示器动画**：使用 `slideInLeft` 关键帧动画
- **展开/收起动画**：优化了 height 和 opacity 的过渡
- **弹出菜单动画**：使用 scale + translate 组合，更流畅
- **图标动画**：hover 时图标缩放效果

#### 视觉反馈增强
- **Hover 状态**：更明显的背景色和文字颜色变化
- **Focus 状态**：添加了键盘导航的焦点指示器
- **Active 状态**：优化了激活路径的视觉反馈
- **Disabled 状态**：使用 `pointer-events: none` 防止误操作

### 3. 键盘导航支持 ✅

#### 新增 `useMenuKeyboard` Composable
提供完整的键盘导航功能：

**支持的按键**：
- `ArrowDown` / `ArrowUp`：上下移动焦点
- `ArrowRight` / `ArrowLeft`：展开/收起子菜单
- `Enter` / `Space`：选中当前项
- `Escape`：关闭子菜单
- `Home` / `End`：跳转到第一项/最后一项

**特性**：
- 自动过滤禁用和隐藏的项
- 支持嵌套子菜单导航
- 可配置是否启用
- 支持自定义容器

**使用示例**：
```typescript
import { useMenuKeyboard } from '@ldesign/menu-vue'

const { focusedKey, setFocus, focusNext, focusPrev } = useMenuKeyboard({
  items,
  selectedKey,
  openKeys,
  onSelect: handleSelect,
  onToggleOpen: handleToggleOpen,
  enabled: true,
})
```

### 4. Tooltip 组件 ✅

#### 新增 `MenuTooltip` 组件
用于在菜单折叠时显示完整的菜单项文本。

**特性**：
- 支持 4 个方向：top、right、bottom、left
- 可配置延迟显示时间
- 自动定位，使用 Teleport 渲染到 body
- 支持深色主题
- 带箭头指示器
- 流畅的淡入淡出动画

**使用示例**：
```vue
<MenuTooltip content="完整的菜单项文本" placement="right">
  <MenuItem itemKey="item1" label="菜单项" />
</MenuTooltip>
```

## 设计规范对比

### TDesign 设计原则
1. **一致性**：统一的视觉语言和交互模式
2. **反馈**：及时、明确的操作反馈
3. **效率**：减少用户操作步骤
4. **可控**：用户可以控制界面元素

### 本次优化的体现
- ✅ **一致性**：统一的颜色、间距、动画系统
- ✅ **反馈**：涟漪效果、hover 状态、焦点指示器
- ✅ **效率**：键盘导航、快捷键支持
- ✅ **可控**：可配置的动画、主题、尺寸

## 性能优化

### CSS 优化
- 使用 `will-change` 提示浏览器优化
- 使用 `transform` 和 `opacity` 实现动画（GPU 加速）
- 避免使用 `box-shadow` 动画，改用 `filter`

### JavaScript 优化
- 涟漪效果使用定时器自动清理
- 键盘导航使用事件委托
- Tooltip 使用延迟显示，避免频繁触发

## 无障碍性改进

### ARIA 属性
- 添加 `tabindex` 支持键盘导航
- 使用 `aria-disabled` 标记禁用状态
- 使用 `aria-expanded` 标记展开状态

### 焦点管理
- 添加 `focus-visible` 样式
- 支持键盘导航
- 焦点指示器清晰可见

## 下一步优化计划

### 搜索功能
- [ ] 实现 MenuSearch 组件
- [ ] 支持拼音搜索
- [ ] 高亮匹配结果

### 性能优化
- [ ] 虚拟滚动（长列表）
- [ ] 懒加载子菜单
- [ ] 优化渲染性能

### 功能增强
- [ ] 拖拽排序
- [ ] 右键菜单
- [ ] 自定义主题
- [ ] 响应式布局优化

## 使用建议

### 最佳实践
1. 使用 CSS 变量自定义主题
2. 启用键盘导航提升可访问性
3. 在折叠模式下使用 Tooltip
4. 合理使用动画，避免过度

### 注意事项
1. 涟漪效果需要 `overflow: hidden`
2. Tooltip 需要 Teleport 支持
3. 键盘导航需要正确的 tabindex
4. 深色主题需要配置对应的 CSS 变量

## 兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 参考资料

- [TDesign 设计规范](https://tdesign.tencent.com/design/values)
- [Material Design - Ripple Effect](https://material.io/design/interaction/states.html)
- [WCAG 2.1 无障碍指南](https://www.w3.org/WAI/WCAG21/quickref/)

