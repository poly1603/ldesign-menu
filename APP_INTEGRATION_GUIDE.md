# App 集成 Menu 多包结构指南

## 📝 更改说明

由于 menu 包已经重构为多包结构，使用它的 app 需要更新导入方式。

## ✅ 已完成的更改

### 1. 工作空间配置

**文件**: `D:\WorkBench\ldesign\pnpm-workspace.yaml`

添加了 menu 子包路径：
```yaml
packages:
  - packages/**
  - packages/menu/packages/**  # 新增
  - libraries/**
  - libraries/*/packages/**
  - tools/**
  - apps/*
```

### 2. App 依赖配置

**文件**: `D:\WorkBench\ldesign\apps\app\package.json`

更新依赖：
```json
{
  "dependencies": {
    // ...
    "@ldesign/menu-vue": "workspace:*",  // 原来是 @ldesign/menu
    // ...
  }
}
```

### 3. 组件导入

**文件**: `D:\WorkBench\ldesign\apps\app\src\components\layout\NavigationMenu.vue`

**旧的导入方式**:
```typescript
import { Menu } from '@ldesign/menu/vue'
import type { MenuItem as LMenuItem } from '@ldesign/menu'
import '@ldesign/menu/es/index.css'
```

**新的导入方式**:
```typescript
import { Menu } from '@ldesign/menu-vue'
import type { MenuItem as LMenuItem } from '@ldesign/menu-core'
import '@ldesign/menu-vue/es/index.css'
```

## 🔄 重启开发服务器

更改完成后，需要重启 Vite 开发服务器：

```bash
# 停止当前服务器 (Ctrl+C)

# 重启
cd D:\WorkBench\ldesign\apps\app
pnpm dev
```

## 📦 Menu 包结构

现在 menu 包的结构：

```
packages/menu/
├── packages/
│   ├── core/              # @ldesign/menu-core (核心逻辑)
│   ├── vue/               # @ldesign/menu-vue (Vue 3)
│   ├── react/             # @ldesign/menu-react (React)
│   └── lit/               # @ldesign/menu-lit (Lit/Web Components)
```

## 🎯 不同框架的导入方式

### Vue 3
```typescript
import { Menu } from '@ldesign/menu-vue'
import type { MenuItem } from '@ldesign/menu-core'
import '@ldesign/menu-vue/es/index.css'
```

### React
```typescript
import { Menu } from '@ldesign/menu-react'
import type { MenuItem } from '@ldesign/menu-core'
import '@ldesign/menu-react/es/index.css'
```

### Lit (Web Components)
```typescript
import '@ldesign/menu-lit'
import type { MenuItem } from '@ldesign/menu-core'
import '@ldesign/menu-lit/es/index.css'
```

### 原生 JS
```typescript
import { MenuManager } from '@ldesign/menu-core'
import type { MenuItem } from '@ldesign/menu-core'
import '@ldesign/menu-core/es/index.css'
```

## ⚠️ 注意事项

1. **类型导入**: 所有类型定义都从 `@ldesign/menu-core` 导入
2. **样式导入**: 根据使用的框架包导入对应的样式
3. **工作空间**: 确保 pnpm-workspace.yaml 包含了 menu 子包路径
4. **依赖关系**: 框架包（vue/react/lit）都依赖 core 包

## 🐛 故障排除

### 错误: Failed to resolve import "@ldesign/menu-vue"

**原因**: 工作空间未识别新的包结构

**解决方案**:
1. 确认 `pnpm-workspace.yaml` 包含 `packages/menu/packages/**`
2. 重新安装依赖: `pnpm install --force`
3. 重启开发服务器

### 错误: Module not found

**原因**: 依赖未更新

**解决方案**:
1. 检查 `package.json` 中的依赖是否已更新
2. 删除 `node_modules` 和 `pnpm-lock.yaml`
3. 重新安装: `pnpm install`

## ✅ 验证

访问 http://localhost:3330/ 应该能看到：
- 应用正常启动
- 左侧导航菜单正常显示
- 没有模块解析错误

## 📚 相关文档

- [Menu 重构完成报告](./REFACTORING_COMPLETE.md)
- [Menu 构建成功总结](./🎉_BUILD_SUCCESS.md)
- [Menu 快速开始](./QUICK_START.md)

---

**更新时间**: 2025-10-27 15:58
**状态**: ✅ 更改完成，等待开发服务器重启

