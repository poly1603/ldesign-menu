import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  // 强制指定为TypeScript库
  libraryType: 'typescript',

  input: 'src/index.ts',

  output: {
    format: ['esm', 'cjs', 'umd'],

    // ESM输出 - 保留目录结构
    esm: {
      dir: 'es',
      preserveStructure: true,
    },

    // CJS输出 - 保留目录结构
    cjs: {
      dir: 'lib',
      preserveStructure: true,
    },

    // UMD输出 - 打包为单文件
    umd: {
      dir: 'dist',
      name: 'LDesignMenu',
    },
  },

  // 生成TypeScript声明文件
  dts: true,

  // 生成sourcemap
  sourcemap: true,

  // 不压缩(由builder自动处理压缩版本)
  minify: false,

  // 构建前清理
  clean: true,

  // 外部依赖(不打包)
  external: [
    'vue',
    'react',
    'react-dom',
    /^@ldesign\//,
    /^lodash/,
    /^@vue\//,
    'nanoid',
  ],

  // TypeScript配置
  typescript: {
    declaration: true,
    declarationMap: true,
  },

  // UMD构建配置(顶层，确保被识别)
  umd: {
    enabled: true,
    entry: 'src/index.ts',
    name: 'LDesignMenu',
  },

  // CSS 文件处理
  css: {
    extract: true,
    modules: false,
  },

  // 复制文件
  copy: {
    patterns: [
      { from: 'src/styles/**/*.css', to: 'es/styles' },
      { from: 'src/styles/**/*.css', to: 'lib/styles' },
    ],
  },
})

