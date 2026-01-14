<script setup lang="ts">
/**
 * 子菜单组件
 * 支持内联展开和弹出两种模式
 */
import type { Component } from 'vue'
import { computed, markRaw, onMounted, onUnmounted, ref, watch, nextTick, useSlots } from 'vue'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'
import { provideSubMenuContext, useMenuContext, useSubMenuContext } from '../composables'
import MenuTooltip from './MenuTooltip.vue'

export interface SubMenuProps {
  itemKey: string
  label?: string
  icon?: string | Component
  disabled?: boolean
  placement?: 'left' | 'right'
}

const ChevronDownIcon = markRaw(ChevronDown)
const ChevronRightIcon = markRaw(ChevronRight)

const props = withDefaults(defineProps<SubMenuProps>(), {
  disabled: false,
})

const menuContext = useMenuContext()
const parentContext = useSubMenuContext()
const slots = useSlots()

const level = computed(() => parentContext.level)

provideSubMenuContext({
  level: level.value + 1,
  parentKey: props.itemKey,
})

// 注册 SubMenu（用于插槽模式下的手风琴支持）
onMounted(() => {
  menuContext.registerSubMenu?.({
    key: props.itemKey,
    level: level.value,
    parentKey: parentContext.parentKey,
  })
})

onUnmounted(() => {
  menuContext.unregisterSubMenu?.(props.itemKey)
})

const isOpen = computed(() => menuContext.isOpen(props.itemKey))
const isActive = computed(() => menuContext.isActive(props.itemKey))
const isCollapsed = computed(() => menuContext.collapsed.value)
const isHorizontal = computed(() => menuContext.mode.value === 'horizontal')
const trigger = computed(() => menuContext.trigger?.value || 'click')
const expandMode = computed(() => menuContext.expandMode?.value || 'inline')
const accordion = computed(() => menuContext.accordion?.value ?? false)

const iconFallback = computed(() => {
  const text = (props.label || '').trim()
  return text ? text.slice(0, 1) : ''
})

const showIcon = computed(() => {
  return Boolean(props.icon || iconFallback.value || !!slots.icon)
})

const isPopupMode = computed(() => {
  if (isHorizontal.value) return true
  if (isCollapsed.value) return true
  if (expandMode.value === 'popup') return true
  if (expandMode.value === 'mixed' && level.value > 0) return true
  return false
})

const placement = computed(() => {
  if (props.placement) return props.placement
  return menuContext.subMenuPlacement?.value || 'right'
})

const isHovered = ref(false)
let hoverTimer: ReturnType<typeof setTimeout> | null = null

const contentRef = ref<HTMLElement | null>(null)
const contentHeight = ref<string>('0px')
const isAnimating = ref(false)

// 监听展开状态变化
watch(isOpen, async (open, oldOpen) => {
  if (isPopupMode.value) return
  if (oldOpen === undefined) return

  if (!contentRef.value) return

  isAnimating.value = true

  if (open) {
    // 展开动画
    // 先确保从 0 开始
    contentHeight.value = '0px'
    await nextTick()

    // 获取实际高度并设置
    const scrollHeight = contentRef.value.scrollHeight
    contentHeight.value = `${scrollHeight}px`

    // 动画完成后设置为 auto 以支持内容动态变化
    setTimeout(() => {
      if (isOpen.value) {
        contentHeight.value = 'auto'
      }
      isAnimating.value = false
    }, 280)
  } else {
    // 收起动画
    // 先获取当前高度
    const currentHeight = contentRef.value.scrollHeight
    contentHeight.value = `${currentHeight}px`

    // 强制浏览器重绘，确保高度已应用
    void contentRef.value.offsetHeight

    // 使用 requestAnimationFrame 确保下一帧再设置为 0
    requestAnimationFrame(() => {
      contentHeight.value = '0px'
    })

    setTimeout(() => {
      isAnimating.value = false
    }, 280)
  }
})

// 初始化时设置高度
watch(contentRef, (el) => {
  if (!el || isPopupMode.value) return

  if (isOpen.value) {
    contentHeight.value = 'auto'
  } else {
    contentHeight.value = '0px'
  }
}, { immediate: true })

const paddingLeft = computed(() => {
  if (isPopupMode.value) return undefined
  const baseIndent = menuContext.indent.value
  return `${baseIndent * (level.value + 1)}px`
})

const classes = computed(() => ({
  'l-submenu': true,
  'l-submenu--open': isOpen.value || (isPopupMode.value && isHovered.value),
  'l-submenu--active': isActive.value,
  'l-submenu--disabled': props.disabled,
  'l-submenu--collapsed': isCollapsed.value,
  'l-submenu--horizontal': isHorizontal.value,
  'l-submenu--popup': isPopupMode.value,
  [`l-submenu--level-${level.value}`]: true,
  [`l-submenu--placement-${placement.value}`]: isPopupMode.value,
}))

// 手风琴模式：展开前先关闭同级菜单
function closeOtherMenusIfAccordion(): void {
  if (accordion.value && !isOpen.value) {
    menuContext.closeOtherSameLevelMenus?.(props.itemKey, level.value, parentContext.parentKey)
  }
}

function handleTitleClick(event: MouseEvent): void {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  // 弹出模式下，hover 触发时点击不响应
  if (isPopupMode.value && trigger.value === 'hover') {
    return
  }

  // 弹出模式下，click 触发时切换展开状态
  if (isPopupMode.value && trigger.value === 'click') {
    // 手风琴模式：展开前先关闭同级菜单
    if (!isOpen.value) {
      closeOtherMenusIfAccordion()
    }
    menuContext.toggleOpen(props.itemKey)
    return
  }

  // 内联模式下正常切换
  // 手风琴模式：展开前先关闭同级菜单
  if (!isOpen.value) {
    closeOtherMenusIfAccordion()
  }
  menuContext.toggleOpen(props.itemKey)
}

function handleKeyDown(event: KeyboardEvent): void {
  if (props.disabled) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    menuContext.toggleOpen(props.itemKey)
  }
}

function handleMouseEnter(): void {
  if (props.disabled) return

  menuContext.setHoverKey(props.itemKey)

  // 清除关闭定时器
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }

  isHovered.value = true

  // 弹出模式 + hover 触发：鼠标进入时展开
  if (isPopupMode.value && trigger.value === 'hover') {
    if (!isOpen.value) {
      closeOtherMenusIfAccordion()
      menuContext.open(props.itemKey)
    }
  }
  // 非弹出模式 + hover 触发
  else if (trigger.value === 'hover' && !isPopupMode.value) {
    if (!isOpen.value) {
      closeOtherMenusIfAccordion()
      menuContext.open(props.itemKey)
    }
  }
}

function handleMouseLeave(): void {
  menuContext.setHoverKey(null)

  // 弹出模式 + hover 触发：鼠标离开时收起
  // 增加延迟时间，给用户足够时间移动到子菜单popup
  if (isPopupMode.value && trigger.value === 'hover') {
    hoverTimer = setTimeout(() => {
      isHovered.value = false
      if (isOpen.value) {
        menuContext.close(props.itemKey)
      }
    }, 300) // 增加延迟到300ms
  }
  // 非弹出模式 + hover 触发
  else if (trigger.value === 'hover' && !isPopupMode.value) {
    hoverTimer = setTimeout(() => {
      isHovered.value = false
      if (isOpen.value) {
        menuContext.close(props.itemKey)
      }
    }, 150)
  }
  // 弹出模式 + click 触发：不自动关闭，只更新 hover 状态
  else if (isPopupMode.value && trigger.value === 'click') {
    // 延迟更新 hover 状态，但不关闭菜单
    hoverTimer = setTimeout(() => {
      isHovered.value = false
    }, 150)
  }
}

function handlePopupMouseEnter(): void {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
  isHovered.value = true
}

function handlePopupMouseLeave(): void {
  // hover 触发时，鼠标离开 popup 后关闭
  // 增加延迟时间，给用户足够时间移动到嵌套子菜单
  if (trigger.value === 'hover') {
    hoverTimer = setTimeout(() => {
      isHovered.value = false
      if (isPopupMode.value && isOpen.value) {
        menuContext.close(props.itemKey)
      }
    }, 300) // 增加延迟到300ms，便于移动到嵌套子菜单
  }
  // click 触发时，只更新 hover 状态，不关闭
  else {
    hoverTimer = setTimeout(() => {
      isHovered.value = false
    }, 150)
  }
}

onUnmounted(() => {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
  }
})
</script>

<template>
  <!-- 折叠模式使用 Tooltip - 只显示图标，点击或hover时从右侧弹出子菜单 -->
  <MenuTooltip v-if="isCollapsed && level === 0 && label" :content="label" :has-children="true" placement="right"
    trigger="both">
    <li :class="classes" role="menuitem" :data-key="itemKey" :aria-expanded="isOpen" :aria-disabled="disabled"
      :tabindex="disabled ? -1 : 0" @keydown="handleKeyDown">
      <div class="l-submenu__title">
        <span v-if="showIcon" class="l-submenu__icon">
          <slot name="icon">
            <component v-if="icon && typeof icon !== 'string'" :is="icon" :size="18" />
            <span v-else-if="icon" class="l-submenu__icon-text">{{ icon }}</span>
            <span v-else class="l-submenu__icon-text">{{ iconFallback }}</span>
          </slot>
        </span>
        <!-- 折叠模式下不显示 label 和 arrow -->
      </div>
    </li>

    <template #children>
      <slot />
    </template>
  </MenuTooltip>

  <!-- 普通模式 -->
  <li v-else :class="classes" role="menuitem" :aria-expanded="isOpen" :aria-disabled="disabled" :data-key="itemKey"
    :tabindex="disabled ? -1 : 0" @keydown="handleKeyDown" @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave">
    <div class="l-submenu__title" :style="{ paddingLeft }" @click="handleTitleClick">
      <span v-if="showIcon" class="l-submenu__icon">
        <slot name="icon">
          <component v-if="icon && typeof icon !== 'string'" :is="icon" :size="18" />
          <span v-else-if="icon" class="l-submenu__icon-text">{{ icon }}</span>
          <span v-else class="l-submenu__icon-text">{{ iconFallback }}</span>
        </slot>
      </span>
      <span class="l-submenu__label">
        <slot name="title">{{ label }}</slot>
      </span>
      <span class="l-submenu__arrow">
        <component v-if="isHorizontal && level === 0" :is="ChevronDownIcon" :size="18" class="l-submenu__arrow-icon" />
        <component v-else-if="isPopupMode" :is="ChevronRightIcon" :size="18" class="l-submenu__arrow-icon" />
        <component v-else :is="ChevronDownIcon" :size="18" class="l-submenu__arrow-icon" />
      </span>
    </div>

    <!-- 内联子菜单 -->
    <ul v-if="!isPopupMode" ref="contentRef" class="l-submenu__content" role="menu" :style="{ height: contentHeight }">
      <slot />
    </ul>

    <!-- 弹出子菜单 -->
    <Transition name="l-popup">
      <div v-if="isPopupMode && isOpen" class="l-submenu__popup" @mouseenter="handlePopupMouseEnter"
        @mouseleave="handlePopupMouseLeave">
        <ul class="l-submenu__popup-list" role="menu">
          <slot />
        </ul>
      </div>
    </Transition>
  </li>
</template>
