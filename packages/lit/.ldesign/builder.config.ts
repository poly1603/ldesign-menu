import { defineConfig } from '@ldesign/builder'

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
  },

  dts: true,
  sourcemap: true,
  minify: false,
  clean: true,

  external: [
    'lit',
    'lit-element',
    'lit-html',
    /^lit\//,
    /^@lit\//,
    /^@ldesign\//,
  ],

  css: {
    extract: true,
    modules: false,
  },
})

