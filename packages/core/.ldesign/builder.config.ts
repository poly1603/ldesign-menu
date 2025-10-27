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
      name: 'LDesignMenuCore',
    },
  },

  dts: true,
  sourcemap: true,
  minify: false,
  clean: true,

  external: [
    /^@ldesign\//,
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

