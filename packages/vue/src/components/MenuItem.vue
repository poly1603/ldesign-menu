<script setup lang="ts">
/**
 * 菜单项组件
 * @component LMenuItem
 */
import type { Component } from 'vue'
import { computed, ref } from 'vue'

import { useMenuContext, useSubMenuContext } from '../composables'
import MenuTooltip from './MenuTooltip.vue'

/**
 * 组件属性
 */
export interface MenuItemProps {
  /**
   * 菜单项唯一标识
   */
  itemKey: string

  /**
   * 显示文本
   */
  label?: string

  /**
   * 图标（支持字符串或 lucide-vue-next 图标组件）
   * @example
   * ```vue
   * <!-- 使用字符串 -->
   * <LMenuItem icon="📄" />
   *
   * <!-- 使用 lucide-vue-next 图标组件 -->
   * <script setup>
   * import { Home } from 'lucide-vue-next'
   * </script>
   * <LMenuItem :icon="Home" />
   * ```
   */
  icon?: string | Component

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 链接地址
   */
  href?: string

  /**
   * 链接打开方式
   */
  target?: '_self' | '_blank' | '_parent' | '_top'
}

const props = withDefaults(defineProps<MenuItemProps>(), {
  disabled: false,
  target: '_self',
})

const emit = defineEmits<{
  /**
   * 点击事件
   */
  click: [event: MouseEvent]
}>()

// 注入上下文
const menuContext = useMenuContext()
const subMenuContext = useSubMenuContext()

// 计算属性
const isSelected = computed(() => menuContext.isSelected(props.itemKey))
const isActive = computed(() => menuContext.isActive(props.itemKey))
const level = computed(() => subMenuContext.level)

// 计算缩进
const paddingLeft = computed(() => {
  const baseIndent = menuContext.indent.value
  return `${baseIndent * (level.value + 1)}px`
})

// CSS 类名
const classes = computed(() => ({
  'l-menu-item': true,
  'l-menu-item--selected': isSelected.value,
  'l-menu-item--active': isActive.value,
  'l-menu-item--disabled': props.disabled,
}))

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

/**
 * 处理点击事件
 */
function handleClick(event: MouseEvent): void {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  // 创建涟漪效果
  createRipple(event)

  emit('click', event)
  menuContext.select(props.itemKey, event)
}

/**
 * 处理鼠标进入
 */
function handleMouseEnter(): void {
  if (!props.disabled) {
    menuContext.setHoverKey(props.itemKey)
  }
}

/**
 * 处理鼠标离开
 */
function handleMouseLeave(): void {
  menuContext.setHoverKey(null)
}
</script>

<template>
  <!-- 折叠模式下使用 Tooltip -->
  <MenuTooltip
    v-if="menuContext.collapsed.value && label"
    :content="label"
    placement="right"
  >
    <li
      :class="classes"
      role="menuitem"
      :aria-disabled="disabled"
      :tabindex="disabled ? -1 : 0"
      @click="handleClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <component
        :is="href ? 'a' : 'div'"
        class="l-menu-item__content"
        :href="href"
        :target="href ? target : undefined"
        :style="{ paddingLeft }"
      >
        <!-- 图标插槽 -->
        <span v-if="icon || $slots.icon" class="l-menu-item__icon">
          <slot name="icon">
            <!-- 支持 lucide-vue-next 图标组件 -->
            <component
              v-if="typeof icon === 'object'"
              :is="icon"
              :size="16"
              class="l-menu-item__icon-component"
            />
            <!-- 支持字符串图标 -->
            <span v-else class="l-menu-item__icon-text">{{ icon }}</span>
          </slot>
        </span>

        <!-- 文本内容 -->
        <span class="l-menu-item__label">
          <slot>{{ label }}</slot>
        </span>

        <!-- 后缀插槽 -->
        <span v-if="$slots.suffix" class="l-menu-item__suffix">
          <slot name="suffix" />
        </span>
      </component>

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
    </li>
  </MenuTooltip>

  <!-- 非折叠模式 -->
  <li
    v-else
    :class="classes"
    role="menuitem"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <component
      :is="href ? 'a' : 'div'"
      class="l-menu-item__content"
      :href="href"
      :target="href ? target : undefined"
      :style="{ paddingLeft }"
    >
      <!-- 图标插槽 -->
      <span v-if="icon || $slots.icon" class="l-menu-item__icon">
        <slot name="icon">
          <!-- 支持 lucide-vue-next 图标组件 -->
          <component
            v-if="typeof icon === 'object'"
            :is="icon"
            :size="16"
            class="l-menu-item__icon-component"
          />
          <!-- 支持字符串图标 -->
          <span v-else class="l-menu-item__icon-text">{{ icon }}</span>
        </slot>
      </span>

      <!-- 文本内容 -->
      <span class="l-menu-item__label">
        <slot>{{ label }}</slot>
      </span>

      <!-- 后缀插槽 -->
      <span v-if="$slots.suffix" class="l-menu-item__suffix">
        <slot name="suffix" />
      </span>
    </component>

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
  </li>
</template>
