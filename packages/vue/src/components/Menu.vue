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
  expandedWidth?: number

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
  return collapsed.value ? `${props.collapsedWidth}px` : `${props.expandedWidth}px`
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
  return props.mode === 'horizontal' && overflowManager?.showMoreButton
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
      <slot />

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
