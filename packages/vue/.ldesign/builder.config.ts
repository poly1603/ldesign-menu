import { defineConfig } from '@ldesign/builder'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  input: 'src/index.ts',

  output: {
    format: ['esm', 'cjs'],
    esm: {
      dir: 'es',
      preserveStructure: true,
    },
    cjs: {
      dir: 'lib',
      preserveStructure: true,
    },
    umd: {
      enabled: false,
    },
  },

  dts: true,
  sourcemap: true,
  minify: false,
  clean: true,

  external: [
    'vue',
    /^@vue\//,
    /^@ldesign\//,
  ],

  css: {
    extract: true,
    modules: false,
  },

  vite: {
    plugins: [vue()],
  },
})

