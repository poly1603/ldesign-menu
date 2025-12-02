import { defineConfig } from '@ldesign/builder'

/**
 * @ldesign/menu-vue 构建配置
 *
 * 菜单系统 Vue 3 适配器
 */
export default defineConfig({
  // 入口文件
  input: 'src/index.ts',

  // 输出配置
  output: {
    // ESM 模块
    esm: {
      dir: 'esm',
      sourcemap: true,
    },

    // CJS 模块
    cjs: {
      dir: 'cjs',
      sourcemap: true,
    },

    // UMD 模块 - 禁用，因为没有 index-lib.ts
    umd: {
      enabled: false,
    },
  },

  // 外部依赖
  external: [
    'vue',
    '@ldesign/menu-core',
    'tslib',
    /^node:/,
  ],

  // 全局变量映射 (UMD 使用)
  globals: {
    'vue': 'Vue',
    '@ldesign/menu-core': 'LDesignMenuCore',
  },

  // 库类型
  libraryType: 'vue3',

  // 打包器
  bundler: 'rollup',

  // 类型声明
  dts: {
    enabled: true,
  },
})

