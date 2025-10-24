/**
 * Vue3 封装导出
 */

import Menu from './components/Menu.vue'
import MenuItem from './components/MenuItem.vue'
import MenuPlugin from './plugin'

export { Menu, MenuItem, MenuPlugin }
export * from './components'
export * from './composables'
export * from './plugin'

// 默认导出
export default MenuPlugin

