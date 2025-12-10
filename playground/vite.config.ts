import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@ldesign/menu-core': resolve(__dirname, '../packages/core/src'),
      '@ldesign/menu-vue': resolve(__dirname, '../packages/vue/src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
