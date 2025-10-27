/**
 * Vue3 插件
 */

import type { App } from 'vue'
import Menu from './components/Menu.vue'
import type { MenuConfig } from '../types'

export interface MenuPluginOptions {
  /** 全局默认配置 */
  defaultConfig?: Partial<MenuConfig>
  /** 组件名称前缀 */
  prefix?: string
}

export const MenuPlugin = {
  install(app: App, options: MenuPluginOptions = {}) {
    const { prefix = 'L', defaultConfig = {} } = options

    // 注册组件
    app.component(`${prefix}Menu`, Menu)

    // 提供全局配置
    app.provide('menu-default-config', defaultConfig)
  },
}

export default MenuPlugin


