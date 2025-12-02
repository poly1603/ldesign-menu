<script setup lang="ts">
import type {
  ExpandMode,
  MenuFilterConfig,
  MenuItem,
  MenuMode,
  MenuSelectEventParams,
  MenuTheme,
  SubMenuPlacement,
  TriggerMode,
} from '../types'
/**
 * 菜单组件
 * @component LMenu
 */
import { computed, toRef } from 'vue'
import { provideMenuContext, provideSubMenuContext, useMenuState } from '../composables'

/**
 * 组件属性
 */
export interface MenuProps {
  /**
   * 菜单数据
   */
  items?: MenuItem[]

  /**
   * 展示模式
   * @default 'vertical'
   */
  mode?: MenuMode

  /**
   * 子菜单展开方式
   * @default 'inline'
   */
  expandMode?: ExpandMode

  /**
   * 主题
   * @default 'light'
   */
  theme?: MenuTheme

  /**
   * 是否折叠
   * @default false
   */
  collapsed?: boolean

  /**
   * 折叠宽度
   * @default 48
   */
  collapsedWidth?: number

  /**
   * 展开宽度
   * @default 240
   */
  expandedWidth?: number

  /**
   * 子级缩进
   * @default 16
   */
  indent?: number

  /**
   * 手风琴模式
   * @default false
   */
  accordion?: boolean

  /**
   * 子菜单触发方式
   * @default 'click'
   */
  trigger?: TriggerMode

  /**
   * 自动展开选中项的父级菜单
   * @default true
   */
  autoExpandParent?: boolean

  /**
   * 子菜单弹出方向
   * @default 'right'
   */
  subMenuPlacement?: SubMenuPlacement

  /**
   * 选中的菜单项 key（受控）
   */
  selectedKey?: string

  /**
   * 默认选中的菜单项 key
   */
  defaultSelectedKey?: string

  /**
   * 展开的菜单项 key 列表（受控）
   */
  openKeys?: string[]

  /**
   * 默认展开的菜单项 key 列表
   */
  defaultOpenKeys?: string[]

  /**
   * 权限过滤配置
   */
  filterConfig?: MenuFilterConfig
}

const props = withDefaults(defineProps<MenuProps>(), {
  items: () => [],
  mode: 'vertical',
  expandMode: 'inline',
  theme: 'light',
  collapsed: false,
  collapsedWidth: 48,
  expandedWidth: 240,
  indent: 16,
  accordion: false,
  trigger: 'click',
  autoExpandParent: true,
  subMenuPlacement: 'right',
})

const emit = defineEmits<{
  /**
   * 选中菜单项
   */
  select: [params: MenuSelectEventParams]
  /**
   * 展开/收起变化
   */
  openChange: [keys: string[]]
  /**
   * 更新选中的 key
   */
  'update:selectedKey': [key: string | undefined]
  /**
   * 更新展开的 keys
   */
  'update:openKeys': [keys: string[]]
}>()

// 使用菜单状态管理
const {
  items: filteredItems,
  state,
  selectedKey,
  openKeys,
  collapsed,
  select,
  toggleOpen,
  open,
  close,
  setHoverKey,
  on,
} = useMenuState({
  items: toRef(props, 'items'),
  config: {
    mode: props.mode,
    expandMode: props.expandMode,
    theme: props.theme,
    collapsed: props.collapsed,
    collapsedWidth: props.collapsedWidth,
    expandedWidth: props.expandedWidth,
    indent: props.indent,
    accordion: props.accordion,
    trigger: props.trigger,
    autoExpandParent: props.autoExpandParent,
    subMenuPlacement: props.subMenuPlacement,
  },
  selectedKey: toRef(props, 'selectedKey'),
  openKeys: toRef(props, 'openKeys'),
  defaultSelectedKey: props.defaultSelectedKey,
  defaultOpenKeys: props.defaultOpenKeys,
  collapsed: toRef(props, 'collapsed'),
  filterConfig: toRef(props, 'filterConfig'),
})

// 监听事件并触发 emit
on('select', (params) => {
  emit('select', params)
  emit('update:selectedKey', params.key)
})

on('openChange', (params) => {
  emit('openChange', params.openKeys)
  emit('update:openKeys', params.openKeys)
})

// 提供菜单上下文
provideMenuContext({
  mode: toRef(props, 'mode'),
  theme: toRef(props, 'theme'),
  expandMode: toRef(props, 'expandMode'),
  trigger: toRef(props, 'trigger'),
  subMenuPlacement: toRef(props, 'subMenuPlacement'),
  collapsed,
  indent: toRef(props, 'indent'),
  state,
  select,
  toggleOpen,
  open,
  close,
  setHoverKey,
  isOpen: (key: string) => openKeys.value.includes(key),
  isSelected: (key: string) => selectedKey.value === key,
  isActive: (key: string) => state.value.activePath.includes(key),
})

// 提供子菜单上下文（根级别）
provideSubMenuContext({
  level: 0,
})

// 计算宽度
const menuWidth = computed(() => {
  if (props.mode === 'horizontal') {
    return 'auto'
  }
  return collapsed.value ? `${props.collapsedWidth}px` : `${props.expandedWidth}px`
})

// CSS 类名
const classes = computed(() => ({
  'l-menu': true,
  [`l-menu--${props.mode}`]: true,
  [`l-menu--${props.theme}`]: true,
  'l-menu--collapsed': collapsed.value,
}))

// 暴露方法
defineExpose({
  /**
   * 选中菜单项
   */
  select,
  /**
   * 切换展开状态
   */
  toggleOpen,
  /**
   * 展开子菜单
   */
  open,
  /**
   * 收起子菜单
   */
  close,
  /**
   * 获取过滤后的菜单项
   */
  getItems: () => filteredItems.value,
  /**
   * 获取当前状态
   */
  getState: () => state.value,
})
</script>

<template>
  <nav :class="classes" :style="{ width: menuWidth }" role="navigation">
    <ul class="l-menu__list" role="menu">
      <slot />
    </ul>
  </nav>
</template>
