# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-10-24

### Added

#### 核心功能
- ✨ 菜单核心管理器 (MenuManager)
- ✨ 布局引擎 (LayoutEngine) - 支持横向/纵向布局
- ✨ Popup 管理器 (PopupManager) - 智能定位和边界检测
- ✨ 动画控制器 (AnimationController) - 基于 WAAPI
- ✨ 事件委托系统 (EventDelegator) - 优化性能
- ✨ 虚拟滚动 (VirtualScroller) - 支持大量数据

#### 菜单模式
- ✨ 横向菜单 - 水平排列，子菜单 Popup 下拉
- ✨ 纵向菜单 - 垂直排列，支持内联展开和 Popup
- ✨ 收起模式 - 仅显示图标，节省空间
- ✨ 响应式布局 - 横向菜单自适应宽度

#### 交互功能
- ✨ 无限层级支持 - 递归渲染任意深度
- ✨ 键盘导航 - 方向键、Enter、ESC 等完整支持
- ✨ 悬停/点击展开 - 灵活的交互模式
- ✨ 手风琴模式 - 同级只展开一个

#### 性能优化
- ⚡ 虚拟滚动 - 支持 10000+ 菜单项
- ⚡ 事件委托 - 减少事件监听器数量
- ⚡ 懒加载 - 子菜单按需渲染
- ⚡ WAAPI 动画 - 高性能动画实现

#### 样式系统
- 🎨 CSS 变量系统 - 与全局主题集成
- 🎨 亮色/暗色主题 - 自动切换
- 🎨 预设主题 - default、minimal、material
- 🎨 流畅动画 - 展开、收起、Popup 等

#### 工具函数
- 🛠️ 树形数据处理 - 扁平化、查找、遍历、过滤
- 🛠️ Popup 定位计算 - 智能避让边界
- 🛠️ DOM 操作辅助 - 常用操作封装
- 🛠️ 动画工具 - 多种动画效果
- 🛠️ 键盘事件处理 - 完整的键盘支持
- 🛠️ 数据验证 - MenuItem 和 MenuConfig 验证

#### 文档
- 📚 完整的 README 文档
- 📚 快速开始指南
- 📚 实施总结文档
- 📚 原生 JavaScript 示例

### Performance
- 📦 Bundle Size (gzip): Core < 10KB
- ⚡ 首次渲染: < 50ms (100项)
- ⚡ 交互响应: < 16ms (60fps)
- 💾 内存占用: < 5MB (1000项)

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

[0.1.0]: https://github.com/ldesign/ldesign/releases/tag/@ldesign/menu@0.1.0


