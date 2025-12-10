<script setup lang="ts">
/**
 * 菜单 Tooltip 组件
 * 用于折叠模式下显示菜单标题和子菜单
 */
import { computed, onUnmounted, ref, watch } from 'vue'

export interface MenuTooltipProps {
  content?: string
  visible?: boolean
  placement?: 'top' | 'right' | 'bottom' | 'left'
  delay?: number
  disabled?: boolean
  hasChildren?: boolean
}

const props = withDefaults(defineProps<MenuTooltipProps>(), {
  placement: 'right',
  delay: 150,
  disabled: false,
  visible: false,
  hasChildren: false,
})

const internalVisible = ref(false)
const tooltipRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const isVisible = computed(() => {
  if (props.disabled || (!props.content && !props.hasChildren)) return false
  return props.visible !== undefined ? props.visible : internalVisible.value
})

const popupClasses = computed(() => [
  'l-menu-tooltip__popup',
  `l-menu-tooltip__popup--${props.placement}`,
])

const wrapperClasses = computed(() => [
  'l-menu-tooltip',
  props.hasChildren ? 'l-menu-tooltip--has-children' : '',
])

function show(): void {
  if (props.disabled) return

  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }

  showTimer = setTimeout(() => {
    internalVisible.value = true
  }, props.delay)
}

function hide(): void {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }

  hideTimer = setTimeout(() => {
    internalVisible.value = false
  }, 100)
}

function handlePopupMouseEnter(): void {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

function handlePopupMouseLeave(): void {
  hide()
}

onUnmounted(() => {
  if (showTimer) clearTimeout(showTimer)
  if (hideTimer) clearTimeout(hideTimer)
})

defineExpose({ show, hide })
</script>

<template>
  <div :class="wrapperClasses" @mouseenter="show" @mouseleave="hide">
    <div ref="triggerRef" class="l-menu-tooltip__trigger">
      <slot />
    </div>

    <Transition name="l-menu-tooltip">
      <div v-if="isVisible" ref="tooltipRef" :class="popupClasses" @mouseenter="handlePopupMouseEnter"
        @mouseleave="handlePopupMouseLeave">
        <span class="l-menu-tooltip__arrow" />
        <div class="l-menu-tooltip__content">
          <slot name="content">
            <template v-if="hasChildren">
              <ul class="l-menu-tooltip__menu-list">
                <slot name="children" />
              </ul>
            </template>
            <template v-else>
              {{ content }}
            </template>
          </slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
@import '../styles/menu-tooltip.css';
</style>
