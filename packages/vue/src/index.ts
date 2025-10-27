/**
 * @ldesign/menu-vue
 * Vue 3 Menu Components
 */

// Re-export core functionality
export * from '@ldesign/menu-core'

// Export Vue components
export { default as Menu } from './components/Menu.vue'
export { default as MenuItem } from './components/MenuItem.vue'
export * from './components'

// Export Vue composables
export * from './composables'

// Export Vue plugin
export { default as MenuPlugin } from './plugin'
export * from './plugin'

// Import core styles
import '@ldesign/menu-core/es/index.css'
