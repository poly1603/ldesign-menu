<script setup lang="ts">
/**
 * 子菜单组件
 * @component LSubMenu
 */
import type { Component } from 'vue'
import { computed, markRaw, onMounted, onUnmounted, ref, watch } from 'vue'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'
import { provideSubMenuContext, useMenuContext, useSubMenuContext } from '../composables'

/**
 * 组件属性
 */
export interface SubMenuProps {
  /**
   * 子菜单唯一标识
   */
  itemKey: string

  /**
   * 显示文本
   */
  label?: string

  /**
   * 图标（支持字符串或 lucide-vue-next 图标组件）
   */
  icon?: string | Component

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 弹出方向覆盖
   */
  placement?: 'left' | 'right'
}

// 使用 markRaw 包装图标组件，避免响应式开销
const ChevronDownIcon = markRaw(ChevronDown)
const ChevronRightIcon = markRaw(ChevronRight)

const props = withDefaults(defineProps<SubMenuProps>(), {
  disabled: false,
})

// 注入上下文
const menuContext = useMenuContext()
const parentContext = useSubMenuContext()

// 当前层级
const level = computed(() => parentContext.level)

// 提供子菜单上下文给子组件
provideSubMenuContext({
  level: level.value + 1,
  parentKey: props.itemKey,
})

// 计算属性
const isOpen = computed(() => menuContext.isOpen(props.itemKey))
const isActive = computed(() => menuContext.isActive(props.itemKey))
const isCollapsed = computed(() => menuContext.collapsed.value)
const isHorizontal = computed(() => menuContext.mode.value === 'horizontal')
const trigger = computed(() => menuContext.trigger?.value || 'click')
const expandMode = computed(() => menuContext.expandMode?.value || 'inline')

// 判断是否使用弹出模式
const isPopupMode = computed(() => {
  // 横向菜单始终使用弹出模式
  if (isHorizontal.value) return true
  // 折叠状态使用弹出模式
  if (isCollapsed.value) return true
  // popup 模式
  if (expandMode.value === 'popup') return true
  // mixed 模式下，非顶级使用弹出模式
  if (expandMode.value === 'mixed' && level.value > 0) return true
  return false
})

// 弹出方向
const placement = computed(() => {
  if (props.placement) return props.placement
  return menuContext.subMenuPlacement?.value || 'right'
})

// 鼠标悬停状态（用于 hover 触发）
const isHovered = ref(false)
let hoverTimer: ReturnType<typeof setTimeout> | null = null

// 动画相关
const contentRef = ref<HTMLElement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const animatingHeight = ref<string | null>(null)
const isAnimating = ref(false)

// 计算内容高度样式
const contentHeight = computed(() => {
  // 动画进行中使用动画高度
  if (isAnimating.value && animatingHeight.value !== null) {
    return animatingHeight.value
  }
  // 展开状态使用 auto
  if (isOpen.value) {
    return 'auto'
  }
  // 收起状态使用 0
  return '0px'
})

// 监听展开状态变化，处理动画（仅 inline 模式）
watch(isOpen, (open, oldOpen) => {
  if (isPopupMode.value) return
  if (oldOpen === undefined) return // 初始化时不触发动画
  
  if (contentRef.value) {
    isAnimating.value = true
    
    if (open) {
      // 展开动画：0 -> 实际高度 -> auto（使用更平滑的时序）
      animatingHeight.value = '0px'
      // 使用双重 RAF 确保浏览器已完成布局计算
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (contentRef.value) {
            animatingHeight.value = `${contentRef.value.scrollHeight}px`
            // 动画完成后切换到 auto
            const timer = setTimeout(() => {
              isAnimating.value = false
              animatingHeight.value = null
            }, 250)
            // 清理函数
            return () => clearTimeout(timer)
          }
        })
      })
    }
    else {
      // 收起动画：实际高度 -> 0
      const currentHeight = contentRef.value.scrollHeight
      animatingHeight.value = `${currentHeight}px`
      // 强制重绘
      contentRef.value.offsetHeight
      requestAnimationFrame(() => {
        animatingHeight.value = '0px'
        const timer = setTimeout(() => {
          isAnimating.value = false
          animatingHeight.value = null
        }, 200)
        return () => clearTimeout(timer)
      })
    }
  }
})

// 计算缩进（仅 inline 模式）
const paddingLeft = computed(() => {
  if (isPopupMode.value) return undefined
  const baseIndent = menuContext.indent.value
  return `${baseIndent * (level.value + 1)}px`
})

// 涟漪效果状态
const ripples = ref<Array<{ id: number, x: number, y: number }>>([])
let rippleId = 0

/**
 * 创建涟漪效果
 */
function createRipple(event: MouseEvent): void {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const id = rippleId++
  ripples.value.push({ id, x, y })

  // 动画结束后移除
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== id)
  }, 600)
}

// CSS 类名
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

/**
 * 处理标题点击
 */
function handleTitleClick(event: MouseEvent): void {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  // 创建涟漪效果
  createRipple(event)

  // hover 触发模式下，点击不切换展开状态
  if (trigger.value === 'hover' && isPopupMode.value) {
    return
  }

  menuContext.toggleOpen(props.itemKey)
}

/**
 * 处理鼠标进入
 */
function handleMouseEnter(): void {
  if (props.disabled) return
  
  menuContext.setHoverKey(props.itemKey)
  
  // hover 触发模式
  if (trigger.value === 'hover' || isPopupMode.value) {
    if (hoverTimer) {
      clearTimeout(hoverTimer)
      hoverTimer = null
    }
    isHovered.value = true
    
    // 弹出模式下自动打开
    if (isPopupMode.value && !isOpen.value) {
      menuContext.open(props.itemKey)
    }
  }
}

/**
 * 处理鼠标离开
 */
function handleMouseLeave(): void {
  menuContext.setHoverKey(null)
  
  // hover 触发模式
  if (trigger.value === 'hover' || isPopupMode.value) {
    hoverTimer = setTimeout(() => {
      isHovered.value = false
      
      // 弹出模式下自动关闭
      if (isPopupMode.value && isOpen.value) {
        menuContext.close(props.itemKey)
      }
    }, 150)
  }
}

/**
 * 处理弹出菜单鼠标进入
 */
function handlePopupMouseEnter(): void {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
  isHovered.value = true
}

/**
 * 处理弹出菜单鼠标离开
 */
function handlePopupMouseLeave(): void {
  hoverTimer = setTimeout(() => {
    isHovered.value = false
    if (isPopupMode.value && isOpen.value) {
      menuContext.close(props.itemKey)
    }
  }, 150)
}

// 清理定时器
onUnmounted(() => {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
  }
})
</script>

<template>
  <li
    :class="classes"
    role="menuitem"
    :aria-expanded="isOpen"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 子菜单标题 -->
    <div class="l-submenu__title" :style="{ paddingLeft }" @click="handleTitleClick">
      <!-- 图标插槽 -->
      <span v-if="icon || $slots.icon" class="l-submenu__icon">
        <slot name="icon">
          <!-- 支持 lucide-vue-next 图标组件 -->
          <component
            v-if="typeof icon === 'object'"
            :is="icon"
            :size="16"
            class="l-submenu__icon-component"
          />
          <!-- 支持字符串图标 -->
          <span v-else class="l-submenu__icon-text">{{ icon }}</span>
        </slot>
      </span>

      <!-- 文本内容 -->
      <span class="l-submenu__label">
        <slot name="title">{{ label }}</slot>
      </span>

      <!-- 展开箭头 - 使用 lucide-vue-next 图标 -->
      <span class="l-submenu__arrow">
        <!-- 水平菜单顶层：向下箭头 -->
        <component
          v-if="isHorizontal && level === 0"
          :is="ChevronDownIcon"
          :size="14"
          class="l-submenu__arrow-icon"
        />
        <!-- 弹出模式：向右箭头 -->
        <component
          v-else-if="isPopupMode"
          :is="ChevronRightIcon"
          :size="14"
          class="l-submenu__arrow-icon l-submenu__arrow-icon--right"
        />
        <!-- 内嵌模式：向下箭头 -->
        <component
          v-else
          :is="ChevronDownIcon"
          :size="16"
          class="l-submenu__arrow-icon"
        />
      </span>

      <!-- 涟漪效果 -->
      <span
        v-for="ripple in ripples"
        :key="ripple.id"
        class="l-menu-item__ripple"
        :style="{
          left: `${ripple.x}px`,
          top: `${ripple.y}px`,
        }"
      />
    </div>

    <!-- 内联子菜单内容（inline 模式） -->
    <ul v-if="!isPopupMode" ref="contentRef" class="l-submenu__content" role="menu" :style="{ height: contentHeight }">
      <slot />
    </ul>

    <!-- 弹出子菜单（popup/horizontal 模式） -->
    <Transition name="l-submenu-popup">
      <div
        v-if="isPopupMode && (isOpen || isHovered)"
        ref="popupRef"
        class="l-submenu__popup"
        @mouseenter="handlePopupMouseEnter"
        @mouseleave="handlePopupMouseLeave"
      >
        <ul class="l-submenu__popup-list" role="menu">
          <slot />
        </ul>
      </div>
    </Transition>
  </li>
</template>
