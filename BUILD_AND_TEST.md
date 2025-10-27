# Menu 包构建和测试指南

## ✅ 已完成工作

### 1. 项目重构
- ✅ 删除旧的 src 和 examples 目录
- ✅ 创建 packages/core, packages/vue, packages/react, packages/lit 子包
- ✅ 配置 .ldesign/builder.config.ts 构建文件
- ✅ 修复包依赖（使用 link: 引用 builder）
- ✅ 修复 Vue 组件类型导入（改为从 @ldesign/menu-core 导入）

### 2. 构建测试状态

| 包 | 状态 | 说明 |
|---|---|---|
| @ldesign/menu-core | ✅ 成功 | 5.14s, 140文件, 1.63MB |
| @ldesign/menu-vue | ✅ 成功 | 8.07s, 164文件, 964KB |
| @ldesign/menu-react | ⏳ 待测试 | 需要修复类型导入 |
| @ldesign/menu-lit | ⏳ 待测试 | 需要修复类型导入 |

## 🔧 修复 React 和 Lit 包

### React 包
需要修复的文件：
- `packages/react/src/components/Menu.tsx` - 从 @ldesign/menu-core 导入类型
- `packages/react/src/hooks/useMenu.ts` - 从 @ldesign/menu-core 导入
- `packages/react/src/hooks/useMenuState.ts` - 从 @ldesign/menu-core 导入
- `packages/react/src/context.tsx` - 从 @ldesign/menu-core 导入

### Lit 包
需要修复的文件：
- `packages/lit/src/components/menu.ts` - 从 @ldesign/menu-core 导入
- `packages/lit/src/components/menu-item.ts` - 从 @ldesign/menu-core 导入

### 修复命令
```bash
# 在所有文件中批量替换
# 将 from '../../types' 改为 from '@ldesign/menu-core'
# 将 from '../../core/menu-manager' 改为 from '@ldesign/menu-core'
```

## 📦 构建所有包

```bash
cd D:\WorkBench\ldesign\packages\menu

# 构建单个包
pnpm build:core      # ✅ 已成功
pnpm build:vue       # ✅ 已成功  
pnpm build:react     # ⏳ 需要先修复导入
pnpm build:lit       # ⏳ 需要先修复导入

# 构建所有包
pnpm build
```

## 🚀 创建示例项目

需要为每个框架创建完整的 Vite 示例项目：

### 1. Core (Vanilla JS) 示例
```bash
cd examples
pnpm create vite core-demo --template vanilla-ts
cd core-demo
pnpm install
pnpm add ../../packages/core
```

### 2. Vue 示例
```bash
cd examples
pnpm create vite vue-demo --template vue-ts
cd vue-demo
pnpm install
pnpm add ../../packages/vue
pnpm add ../../packages/core
```

### 3. React 示例
```bash
cd examples
pnpm create vite react-demo --template react-ts
cd react-demo
pnpm install
pnpm add ../../packages/react
pnpm add ../../packages/core
```

### 4. Lit 示例
```bash
cd examples
pnpm create vite lit-demo --template lit-ts
cd lit-demo
pnpm install
pnpm add ../../packages/lit
pnpm add ../../packages/core
```

## 🎯 示例项目要求

每个示例项目需要展示：

1. **基础使用**
   - 简单的菜单渲染
   - 菜单项点击事件

2. **布局模式**
   - 横向布局示例
   - 纵向布局示例

3. **主题切换**
   - Light 主题
   - Dark 主题
   - Material 主题

4. **交互功能**
   - 菜单展开/收起
   - 子菜单
   - 手风琴模式

5. **高级功能**
   - 动态更新菜单数据
   - 搜索过滤
   - 键盘导航

## 📝 下一步操作

1. **修复 React 包导入** - 批量替换相对路径为 @ldesign/menu-core
2. **修复 Lit 包导入** - 批量替换相对路径为 @ldesign/menu-core
3. **测试构建** - 确保 React 和 Lit 包构建成功
4. **创建示例项目** - 为每个框架创建完整的 Vite 项目
5. **编写示例代码** - 实现所有功能演示
6. **测试运行** - 启动每个示例项目，在浏览器中测试

## 🐛 已知问题

1. ✅ **已修复**: Core 包 error-handler.ts 语法错误
2. ✅ **已修复**: Vue 包类型导入路径错误
3. ⏳ **待修复**: React 包类型导入路径
4. ⏳ **待修复**: Lit 包类型导入路径

## 📊 项目统计

- **总包数**: 4 (core, vue, react, lit)
- **已构建成功**: 2 (core, vue)
- **待构建**: 2 (react, lit)
- **构建总大小**: ~2.6MB
- **构建总时间**: ~13s (core + vue)

---

**更新时间**: 2025-10-27 15:50
**状态**: 进行中 (50% 完成)

