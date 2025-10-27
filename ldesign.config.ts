import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  input: 'src/index.ts',

  output: {
    format: ['esm', 'cjs', 'umd'],
    esm: {
      dir: 'es',
      preserveStructure: true,
    },
    cjs: {
      dir: 'lib',
      preserveStructure: true,
    },
    umd: {
      dir: 'dist',
      name: 'LDesignMenu',
    },
  },

  dts: true,
  sourcemap: true,
  minify: false,
  clean: true,

  external: [
    'vue',
    'react',
    'react-dom',
    /^@ldesign\//,
    /^lodash/,
    /^@vue\//,
    'nanoid',
  ],

  css: {
    extract: true,
    modules: false,
  },

  copy: {
    patterns: [
      { from: 'src/styles/**/*.css', to: 'es/styles' },
      { from: 'src/styles/**/*.css', to: 'lib/styles' },
    ],
  },
})
