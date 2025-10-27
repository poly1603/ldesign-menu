import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  input: 'src/index.tsx',

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
    'react',
    'react-dom',
    'react/jsx-runtime',
    /^@ldesign\//,
  ],

  css: {
    extract: true,
    modules: false,
  },

  vite: {
    esbuild: {
      jsx: 'automatic',
    },
  },
})

