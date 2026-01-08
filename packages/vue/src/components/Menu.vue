<script setup lang="ts">
import type {
  ExpandMode,
  IndicatorPosition,
  MenuFilterConfig,
  MenuItem,
  MenuMode,
  MenuSelectEventParams,
  MenuSize,
  MenuTheme,
  SubMenuPlacement,
  TriggerMode,
} from '../types'
/**
 * 菜单组件
 * 参考 Ant Design Menu 组件设计
 * @component LMenu
 */
import { computed, toRef, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ChevronDown as ChevronDownIcon } from 'lucide-vue-next'
import {
  OverflowManager,
  calculatePopupDirection as calcPopupDir,
  handleOverflowPopupClick,
  handleOverflowPopupHover,
} from '@ldesign/menu-core'
import { provideMenuContext, provideSubMenuContext, useMenuState } from '../composables'
import MenuTree from './MenuTree.vue'

/**
 * 渲染模式
 * - `full`: 完整渲染所有菜单项
 * - `rootOnly`: 只渲染一级菜单项（用于 Mix 布局顶部导航）
 * - `childrenOf`: 只渲染指定 parentKey 的子菜单（用于 Mix 布局侧边栏）
 */
export type MenuRenderMode = 'full' | 'rootOnly' | 'childrenOf'

/**
 * 组件属性
 * 参考 Ant Design Menu API 设计
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
   * 渲染模式
   * - `full`: 完整渲染所有菜单项
   * - `rootOnly`: 只渲染一级菜单项（不展开子菜单，点击触发 root-select 事件）
   * - `childrenOf`: 只渲染指定 parentKey 的子菜单
   * @default 'full'
   */
  renderMode?: MenuRenderMode

  /**
   * 父级菜单 key，配合 renderMode='childrenOf' 使用
   * 指定后只渲染该父级下的子菜单
   */
  parentKey?: string

  /**
   * 是否继承父容器的文字颜色
   * 开启后菜单会自动适配深色/浅色背景
   * @default true
   */
  inheritColor?: boolean

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
   * 菜单尺寸
   * @default 'middle'
   */
  size?: MenuSize

  /**
   * 是否折叠
   * @default false
   */
  collapsed?: boolean

  /**
   * 折叠宽度
   * @default 80
   */
  collapsedWidth?: number

  /**
   * 展开宽度
   * @default 256
   */
  expandedWidth?: number | string

  /**
   * 子级缩进
   * @default 24
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
   * 选中指示器位置
   * @default 'left'
   */
  indicatorPosition?: IndicatorPosition

  /**
   * 是否显示边框
   * @default false
   */
  bordered?: boolean

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
  size: 'middle',
  collapsed: false,
  collapsedWidth: 80,
  expandedWidth: 256,
  indent: 24,
  accordion: false,
  trigger: 'click',
  autoExpandParent: true,
  subMenuPlacement: 'right',
  indicatorPosition: 'left',
  bordered: false,
  renderMode: 'full',
  inheritColor: true,
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
  /**
   * rootOnly 模式下点击一级菜单触发
   */
  'root-select': [key: string, item: MenuItem]
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
  accordion: toRef(props, 'accordion'),
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

// 根据 renderMode 计算实际要渲染的菜单项
const renderedItems = computed(() => {
  const items = filteredItems.value
  console.log('[LMenu] renderedItems computed - filteredItems count:', items.length, 'renderMode:', props.renderMode)
  
  if (props.renderMode === 'rootOnly') {
    // 只渲染一级菜单项，移除 children
    return items.map(item => {
      if ('children' in item && item.children) {
        // 返回新对象，不包含 children
        const { children, ...rest } = item as any
        return { ...rest, type: 'item' } as MenuItem
      }
      return item
    })
  }
  
  if (props.renderMode === 'childrenOf' && props.parentKey) {
    // 查找指定 parentKey 的菜单项，返回其 children
    const findChildren = (items: MenuItem[], targetKey: string): MenuItem[] => {
      for (const item of items) {
        if ('key' in item && item.key === targetKey) {
          return ('children' in item && item.children) ? item.children : []
        }
        if ('children' in item && item.children) {
          const found = findChildren(item.children, targetKey)
          if (found.length > 0) return found
        }
      }
      return []
    }
    return findChildren(items, props.parentKey)
  }
  
  return items
})

// SubMenu 注册表（用于插槽模式下的手风琴支持）
const subMenuRegistry = new Map<string, { level: number; parentKey?: string }>()

// 注册 SubMenu
function registerSubMenu(info: { key: string; level: number; parentKey?: string }): void {
  subMenuRegistry.set(info.key, { level: info.level, parentKey: info.parentKey })
}

// 注销 SubMenu
function unregisterSubMenu(key: string): void {
  subMenuRegistry.delete(key)
}

// 关闭同级的其他菜单（手风琴模式）
function closeOtherSameLevelMenus(key: string, level: number, parentKey?: string): void {
  // 找到同级的其他菜单
  const siblings: string[] = []
  subMenuRegistry.forEach((info, k) => {
    if (k !== key && info.level === level && info.parentKey === parentKey) {
      siblings.push(k)
    }
  })

  // 关闭同级菜单及其所有子菜单
  siblings.forEach(siblingKey => {
    if (openKeys.value.includes(siblingKey)) {
      close(siblingKey)
      // 同时关闭该菜单下的所有子菜单
      closeChildMenus(siblingKey)
    }
  })
}

// 关闭指定菜单下的所有子菜单
function closeChildMenus(parentKey: string): void {
  subMenuRegistry.forEach((info, key) => {
    if (info.parentKey === parentKey && openKeys.value.includes(key)) {
      close(key)
      closeChildMenus(key)
    }
  })
}

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
  accordion: toRef(props, 'accordion'),
  select,
  toggleOpen,
  open,
  close,
  setHoverKey,
  isOpen: (key: string) => openKeys.value.includes(key),
  isSelected: (key: string) => selectedKey.value === key,
  isActive: (key: string) => state.value.activePath.includes(key),
  closeAllPopups,
  registerSubMenu,
  unregisterSubMenu,
  closeOtherSameLevelMenus,
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
  if (collapsed.value) {
    return typeof props.collapsedWidth === 'number' ? `${props.collapsedWidth}px` : props.collapsedWidth
  }
  return typeof props.expandedWidth === 'number' ? `${props.expandedWidth}px` : props.expandedWidth
})

// 菜单引用
const menuRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)

// 溢出折叠相关（使用 core 的 OverflowManager）
const isMoreOpen = ref(false)
const moreButtonRef = ref<HTMLElement | null>(null)
const morePopupRef = ref<HTMLElement | null>(null)
const overflowItemsHtml = ref('')
const morePopupDirection = ref<'top' | 'bottom'>('bottom')

// OverflowManager 实例
let overflowManager: OverflowManager | null = null

// 计算是否需要显示"更多"按钮
const showMoreButton = computed(() => {
  return props.mode === 'horizontal' && overflowItemsHtml.value.length > 0
})

// 监听"更多"弹出层打开
watch(isMoreOpen, (open) => {
  if (open) {
    // 暂停溢出计算
    overflowManager?.pause()
    // 计算弹出方向
    if (moreButtonRef.value) {
      morePopupDirection.value = calcPopupDir(moreButtonRef.value)
    }
  } else {
    // 恢复溢出计算
    overflowManager?.resume()
  }
})

// 处理"更多"弹出层中的点击事件
function onMorePopupClick(event: MouseEvent): void {
  handleOverflowPopupClick(event, {
    onMenuItemClick: (itemKey) => {
      select(itemKey)
      isMoreOpen.value = false
    },
  })
}

// 处理"更多"弹出层中的hover事件
function onMorePopupMouseOver(event: MouseEvent): void {
  if (morePopupRef.value) {
    handleOverflowPopupHover(event, morePopupRef.value, props.trigger)
  }
}

// 切换"更多"菜单
function toggleMore(): void {
  isMoreOpen.value = !isMoreOpen.value
}

// 处理"更多"菜单的鼠标事件
let moreHoverTimer: ReturnType<typeof setTimeout> | null = null

function handleMoreMouseEnter(): void {
  if (moreHoverTimer) {
    clearTimeout(moreHoverTimer)
    moreHoverTimer = null
  }
  if (props.trigger === 'hover') {
    isMoreOpen.value = true
  }
}

function handleMoreMouseLeave(): void {
  if (props.trigger === 'hover') {
    moreHoverTimer = setTimeout(() => {
      isMoreOpen.value = false
    }, 150)
  }
}

function handleMoreClick(): void {
  if (props.trigger === 'click') {
    isMoreOpen.value = !isMoreOpen.value
  }
}

// 关闭所有 popup
function closeAllPopups(): void {
  if (props.expandMode === 'popup' || props.collapsed) {
    openKeys.value.forEach(key => close(key))
  }
}

// 点击外部关闭 popup
function handleClickOutside(event: MouseEvent): void {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeAllPopups()
  }
}

// 初始化 OverflowManager
function initOverflowManager(): void {
  if (overflowManager) {
    overflowManager.destroy()
    overflowManager = null
  }

  if (props.mode === 'horizontal' && menuRef.value && listRef.value) {
    overflowManager = new OverflowManager({
      container: menuRef.value,
      listElement: listRef.value,
    })

    // 监听溢出变化
    overflowManager.on('overflowChange', (data) => {
      overflowItemsHtml.value = data.overflowItemsHtml
    })
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // 初始化溢出管理器
  nextTick(() => {
    initOverflowManager()
  })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (overflowManager) {
    overflowManager.destroy()
    overflowManager = null
  }
  if (moreHoverTimer) {
    clearTimeout(moreHoverTimer)
  }
})

// 监听模式变化
watch(() => props.mode, () => {
  nextTick(() => {
    initOverflowManager()
  })
})

// CSS 类名
const classes = computed(() => ({
  'l-menu': true,
  [`l-menu--${props.mode}`]: true,
  [`l-menu--${props.theme}`]: true,
  [`l-menu--${props.size}`]: props.size !== 'middle',
  'l-menu--collapsed': collapsed.value,
  'l-menu--bordered': props.bordered,
  [`l-menu--indicator-${props.indicatorPosition}`]: true,
  'l-menu--inherit-color': props.inheritColor,
  [`l-menu--render-${props.renderMode}`]: true,
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
  <nav ref="menuRef" :class="classes" :style="{ width: menuWidth }" role="navigation">
    <ul ref="listRef" class="l-menu__list" role="menu" :class="{ 'l-menu__list--overflow': showMoreButton }">
      <slot>
        <MenuTree v-if="renderedItems.length > 0" :items="renderedItems" :render-mode="renderMode" />
      </slot>

      <!-- 更多按钮 -->
      <li v-if="showMoreButton" ref="moreButtonRef" class="l-menu__more l-submenu l-submenu--level-0"
        :class="{ 'l-submenu--open': isMoreOpen }" @mouseenter="handleMoreMouseEnter" @mouseleave="handleMoreMouseLeave"
        @click="handleMoreClick">
        <div class="l-submenu__title">
          <span class="l-menu__more-label">更多</span>
          <span class="l-submenu__arrow">
            <ChevronDownIcon :size="18" class="l-submenu__arrow-icon" />
          </span>
        </div>

        <!-- 更多菜单弹出层 -->
        <Transition name="l-popup">
          <div v-if="isMoreOpen" ref="morePopupRef" class="l-submenu__popup l-menu__more-popup"
            :class="{ 'l-menu__more-popup--top': morePopupDirection === 'top' }" @mouseenter="handleMoreMouseEnter"
            @mouseleave="handleMoreMouseLeave" @click="onMorePopupClick" @mouseover="onMorePopupMouseOver">
            <ul class="l-submenu__popup-list l-menu__more-list" role="menu" v-html="overflowItemsHtml">
            </ul>
          </div>
        </Transition>
      </li>
    </ul>
  </nav>
</template>
