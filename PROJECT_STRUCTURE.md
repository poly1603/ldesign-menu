# 📁 LDesign Menu 项目结构

## 整体目录结构

```
D:\WorkBench\ldesign\packages\menu\
├── 📄 package.json                    # 工作空间元包配置
├── 📄 pnpm-workspace.yaml             # pnpm 工作空间配置
├── 📄 README.md                       # 主文档
├── 📄 QUICK_START.md                  # 快速入门指南
├── 📄 REFACTORING_COMPLETE.md         # 重构完成报告
├── 📄 PROJECT_STRUCTURE.md            # 项目结构说明（本文件）
├── 📄 tsconfig.json                   # TypeScript 配置
├── 📄 LICENSE                         # MIT 许可证
│
├── 📁 packages/                       # 子包目录
│   ├── 📁 core/                       # @ldesign/menu-core
│   ├── 📁 vue/                        # @ldesign/menu-vue  
│   ├── 📁 react/                      # @ldesign/menu-react
│   └── 📁 lit/                        # @ldesign/menu-lit
│
└── 📁 examples/                       # 示例项目
    ├── 📁 vanilla-demo/               # 原生 JS 示例
    ├── 📁 vue-demo/                   # Vue 3 示例
    ├── 📁 react-demo/                 # React 示例
    └── 📁 lit-demo/                   # Lit 示例
```

## packages/core/ - 核心包

```
packages/core/
├── 📄 package.json                    # 包配置
├── 📄 tsconfig.json                   # TS 配置
├── 📄 ldesign.config.ts               # 构建配置
├── 📄 README.md                       # Core 文档
├── 📄 .gitignore
│
├── 📁 src/                            # 源代码
│   ├── 📄 index.ts                    # 主入口
│   │
│   ├── 📁 core/                       # 核心逻辑
│   │   ├── menu-manager.ts            # 菜单管理器
│   │   ├── state-manager.ts           # 状态管理
│   │   ├── animation-controller.ts    # 动画控制
│   │   ├── layout-engine.ts           # 布局引擎
│   │   ├── popup-manager.ts           # 弹出层管理
│   │   ├── event-delegator.ts         # 事件委托
│   │   ├── event-emitter.ts           # 事件发射器
│   │   ├── virtual-scroller.ts        # 虚拟滚动
│   │   └── index.ts
│   │
│   ├── 📁 types/                      # 类型定义
│   │   ├── menu.ts                    # 菜单类型
│   │   ├── config.ts                  # 配置类型
│   │   ├── events.ts                  # 事件类型
│   │   ├── layout.ts                  # 布局类型
│   │   └── index.ts
│   │
│   ├── 📁 utils/                      # 工具函数
│   │   ├── dom-utils.ts               # DOM 工具
│   │   ├── tree-utils.ts              # 树工具
│   │   ├── animation-utils.ts         # 动画工具
│   │   ├── keyboard-utils.ts          # 键盘工具
│   │   ├── position-utils.ts          # 定位工具
│   │   ├── validators.ts              # 验证工具
│   │   ├── logger.ts                  # 日志工具
│   │   ├── error-handler.ts           # 错误处理
│   │   ├── performance-monitor.ts     # 性能监控
│   │   └── index.ts
│   │
│   ├── 📁 features/                   # 功能模块
│   │   ├── breadcrumb.ts              # 面包屑
│   │   ├── favorites.ts               # 收藏夹
│   │   ├── search.ts                  # 搜索
│   │   ├── lazy-load.ts               # 懒加载
│   │   ├── multi-select.ts            # 多选
│   │   ├── recent-history.ts          # 历史记录
│   │   └── index.ts
│   │
│   └── 📁 styles/                     # 样式文件
│       ├── index.css                  # 主样式
│       ├── base.css                   # 基础样式
│       ├── variables.css              # CSS 变量
│       ├── animations.css             # 动画样式
│       ├── horizontal.css             # 横向布局
│       ├── vertical.css               # 纵向布局
│       └── 📁 themes/
│           ├── index.css
│           ├── default.css            # 默认主题
│           ├── material.css           # Material 主题
│           └── minimal.css            # 极简主题
│
├── 📁 es/                             # ESM 构建输出
├── 📁 lib/                            # CJS 构建输出
└── 📁 dist/                           # UMD 构建输出
```

## packages/vue/ - Vue 包

```
packages/vue/
├── 📄 package.json                    # 包配置
├── 📄 tsconfig.json                   # TS 配置
├── 📄 ldesign.config.ts               # 构建配置
├── 📄 README.md                       # Vue 文档
├── 📄 .gitignore
│
├── 📁 src/                            # 源代码
│   ├── 📄 index.ts                    # 主入口
│   │
│   ├── 📁 components/                 # Vue 组件
│   │   ├── Menu.vue                   # 菜单组件
│   │   ├── MenuItem.vue               # 菜单项组件
│   │   └── index.ts
│   │
│   ├── 📁 composables/                # Composables
│   │   ├── useMenu.ts                 # 菜单 hook
│   │   ├── useMenuState.ts            # 状态 hook
│   │   └── index.ts
│   │
│   └── 📄 plugin.ts                   # Vue 插件
│
├── 📁 es/                             # ESM 构建输出
└── 📁 lib/                            # CJS 构建输出
```

## packages/react/ - React 包

```
packages/react/
├── 📄 package.json                    # 包配置
├── 📄 tsconfig.json                   # TS 配置
├── 📄 ldesign.config.ts               # 构建配置
├── 📄 README.md                       # React 文档
├── 📄 .gitignore
│
├── 📁 src/                            # 源代码
│   ├── 📄 index.tsx                   # 主入口
│   │
│   ├── 📁 components/                 # React 组件
│   │   ├── Menu.tsx                   # 菜单组件
│   │   └── index.ts
│   │
│   ├── 📁 hooks/                      # React Hooks
│   │   ├── useMenu.ts                 # 菜单 hook
│   │   ├── useMenuState.ts            # 状态 hook
│   │   └── index.ts
│   │
│   └── 📄 context.tsx                 # React Context
│
├── 📁 es/                             # ESM 构建输出
└── 📁 lib/                            # CJS 构建输出
```

## packages/lit/ - Lit 包

```
packages/lit/
├── 📄 package.json                    # 包配置
├── 📄 tsconfig.json                   # TS 配置
├── 📄 ldesign.config.ts               # 构建配置
├── 📄 README.md                       # Lit 文档
├── 📄 .gitignore
│
├── 📁 src/                            # 源代码
│   ├── 📄 index.ts                    # 主入口
│   │
│   └── 📁 components/                 # Web Components
│       ├── menu.ts                    # <ldesign-menu>
│       ├── menu-item.ts               # <ldesign-menu-item>
│       └── index.ts
│
├── 📁 es/                             # ESM 构建输出
└── 📁 lib/                            # CJS 构建输出
```

## examples/ - 示例项目

```
examples/
├── 📄 README.md                       # 示例总览
│
├── 📁 vanilla-demo/                   # 原生 JS 示例
│   └── index.html
│
├── 📁 vue-demo/                       # Vue 3 示例
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.ts
│       └── App.vue
│
├── 📁 react-demo/                     # React 示例
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       └── App.tsx
│
└── 📁 lit-demo/                       # Lit 示例
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        └── main.ts
```

## 构建输出结构

每个包构建后的输出结构：

```
package/
├── es/                                # ESM 格式
│   ├── index.js
│   ├── index.d.ts                     # 类型定义
│   ├── index.css                      # 样式
│   └── [其他模块]
│
├── lib/                               # CommonJS 格式
│   ├── index.cjs
│   ├── index.d.ts
│   ├── index.css
│   └── [其他模块]
│
└── dist/                              # UMD 格式（仅 core）
    ├── index.js
    ├── index.min.js
    └── index.css
```

## 包依赖关系

```
@ldesign/menu (元包)
│
├── @ldesign/menu-core ────────────┐
│   └── @ldesign/shared            │
│                                  │
├── @ldesign/menu-vue              │
│   ├── 依赖 core ────────────────┘
│   └── vue (peer dependency)
│
├── @ldesign/menu-react            │
│   ├── 依赖 core ────────────────┘
│   ├── react (peer)
│   └── react-dom (peer)
│
└── @ldesign/menu-lit              │
    ├── 依赖 core ────────────────┘
    └── lit
```

## 关键文件说明

### 根目录

- `package.json` - 工作空间配置，定义了 scripts 和 exports
- `pnpm-workspace.yaml` - 声明工作空间结构
- `README.md` - 主文档，介绍多框架使用
- `QUICK_START.md` - 快速开始指南
- `REFACTORING_COMPLETE.md` - 重构完成总结

### 各子包

- `package.json` - 包的元数据和依赖
- `tsconfig.json` - TypeScript 编译配置
- `ldesign.config.ts` - @ldesign/builder 构建配置
- `README.md` - 包的使用文档
- `src/index.ts` - 包的主入口

## 工作流程

### 开发流程

1. 修改 `packages/*/src/` 中的源代码
2. 运行 `pnpm dev` 实时编译
3. 在 `examples/` 中测试

### 构建流程

1. `pnpm build` 构建所有包
2. 生成 `es/`, `lib/`, `dist/` 输出
3. 生成类型定义 `.d.ts`
4. 提取 CSS 文件

### 发布流程

1. 更新版本号
2. 运行 `pnpm build`
3. 发布到 npm

## 总结

这个结构设计具有以下优势：

✅ **清晰分层**: core → framework 的依赖关系明确
✅ **职责明确**: 每个包都有单一职责
✅ **易于维护**: 核心逻辑集中，框架实现独立
✅ **按需加载**: 用户只需安装所需的包
✅ **扩展性好**: 添加新框架支持很容易

---

更新时间: 2025-10-27

