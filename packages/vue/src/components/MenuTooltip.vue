<script setup lang="ts">
/**
 * 菜单 Tooltip 组件
 * 用于在菜单折叠时显示完整的菜单项文本
 * @component LMenuTooltip
 */
import { computed, onMounted, onUnmounted, ref } from 'vue'

/**
 * 组件属性
 */
export interface MenuTooltipProps {
  /**
   * Tooltip 内容
   */
  content?: string

  /**
   * 是否显示
   */
  visible?: boolean

  /**
   * 弹出位置
   * @default 'right'
   */
  placement?: 'top' | 'right' | 'bottom' | 'left'

  /**
   * 延迟显示时间（毫秒）
   * @default 200
   */
  delay?: number

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
}

const props = withDefaults(defineProps<MenuTooltipProps>(), {
  placement: 'right',
  delay: 200,
  disabled: false,
  visible: false,
})

// 内部显示状态
const internalVisible = ref(false)
const tooltipRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

// 计算最终显示状态
const isVisible = computed(() => {
  if (props.disabled || !props.content) return false
  return props.visible !== undefined ? props.visible : internalVisible.value
})

// CSS 类名
const classes = computed(() => ({
  'l-menu-tooltip': true,
  'l-menu-tooltip--visible': isVisible.value,
  [`l-menu-tooltip--${props.placement}`]: true,
}))

/**
 * 显示 Tooltip
 */
function show(): void {
  if (props.disabled || !props.content) return

  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }

  showTimer = setTimeout(() => {
    internalVisible.value = true
    updatePosition()
  }, props.delay)
}

/**
 * 隐藏 Tooltip
 */
function hide(): void {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }

  hideTimer = setTimeout(() => {
    internalVisible.value = false
  }, 100)
}

/**
 * 更新 Tooltip 位置
 */
function updatePosition(): void {
  if (!tooltipRef.value || !triggerRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipEl = tooltipRef.value

  const offset = 8 // 偏移距离

  switch (props.placement) {
    case 'right':
      tooltipEl.style.left = `${triggerRect.right + offset}px`
      tooltipEl.style.top = `${triggerRect.top + triggerRect.height / 2}px`
      tooltipEl.style.transform = 'translateY(-50%)'
      break
    case 'left':
      tooltipEl.style.right = `${window.innerWidth - triggerRect.left + offset}px`
      tooltipEl.style.top = `${triggerRect.top + triggerRect.height / 2}px`
      tooltipEl.style.transform = 'translateY(-50%)'
      break
    case 'top':
      tooltipEl.style.left = `${triggerRect.left + triggerRect.width / 2}px`
      tooltipEl.style.bottom = `${window.innerHeight - triggerRect.top + offset}px`
      tooltipEl.style.transform = 'translateX(-50%)'
      break
    case 'bottom':
      tooltipEl.style.left = `${triggerRect.left + triggerRect.width / 2}px`
      tooltipEl.style.top = `${triggerRect.bottom + offset}px`
      tooltipEl.style.transform = 'translateX(-50%)'
      break
  }
}

// 清理定时器
onUnmounted(() => {
  if (showTimer) clearTimeout(showTimer)
  if (hideTimer) clearTimeout(hideTimer)
})

// 暴露方法
defineExpose({
  show,
  hide,
})
</script>

<template>
  <div class="l-menu-tooltip-wrapper" @mouseenter="show" @mouseleave="hide">
    <!-- 触发器插槽 -->
    <div ref="triggerRef" class="l-menu-tooltip-trigger">
      <slot />
    </div>

    <!-- Tooltip 内容 -->
    <Teleport to="body">
      <Transition name="l-menu-tooltip-fade">
        <div v-if="isVisible" ref="tooltipRef" :class="classes">
          <div class="l-menu-tooltip__content">
            <slot name="content">
              {{ content }}
            </slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

