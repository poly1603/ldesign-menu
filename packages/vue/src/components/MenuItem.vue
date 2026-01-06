<script setup lang="ts">
/**
 * 菜单项组件
 * 支持图标、徽标、危险操作、链接等功能
 */
import type { Component } from 'vue'
import type { MenuBadge } from '../types'
import { computed } from 'vue'
import { useMenuContext, useSubMenuContext } from '../composables'
import MenuTooltip from './MenuTooltip.vue'

/**
 * 菜单项组件属性
 */
export interface MenuItemProps {
  /** 菜单项唯一标识 */
  itemKey: string
  /** 显示文本 */
  label?: string
  /** 图标（字符串或组件） */
  icon?: string | Component
  /** 是否禁用 */
  disabled?: boolean
  /** 是否为危险操作 */
  danger?: boolean
  /** 链接地址 */
  href?: string
  /** 链接打开方式 */
  target?: '_self' | '_blank' | '_parent' | '_top'
  /** 徽标配置 */
  badge?: MenuBadge
}

const props = withDefaults(defineProps<MenuItemProps>(), {
  disabled: false,
  danger: false,
  target: '_self',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const menuContext = useMenuContext()
const subMenuContext = useSubMenuContext()

const isSelected = computed(() => menuContext.isSelected(props.itemKey))
const isActive = computed(() => menuContext.isActive(props.itemKey))
const level = computed(() => subMenuContext.level)
const isCollapsed = computed(() => menuContext.collapsed.value)

const paddingLeft = computed(() => {
  if (isCollapsed.value) return undefined
  const baseIndent = menuContext.indent.value
  return `${baseIndent * (level.value + 1)}px`
})

const classes = computed(() => ({
  'l-menu-item': true,
  'l-menu-item--selected': isSelected.value,
  'l-menu-item--active': isActive.value,
  'l-menu-item--disabled': props.disabled,
  'l-menu-item--danger': props.danger,
}))

// 徽标计算
const showBadge = computed(() => {
  if (!props.badge) return false
  return props.badge.show !== false
})

const badgeText = computed(() => {
  if (!props.badge) return ''
  const { type = 'dot', count = 0, max = 99, text = '' } = props.badge

  if (type === 'dot') return ''
  if (type === 'text') return text
  if (type === 'count') {
    return count > max ? `${max}+` : String(count)
  }
  return ''
})

const badgeClasses = computed(() => {
  if (!props.badge) return {}
  const { type = 'dot', status = 'error', className } = props.badge
  return {
    'l-menu-badge': true,
    [`l-menu-badge--${type}`]: true,
    [`l-menu-badge--${status}`]: true,
    [className || '']: !!className,
  }
})

function handleClick(event: MouseEvent): void {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  emit('click', event)
  menuContext.select(props.itemKey, event)

  // 选中后关闭所有弹出菜单
  menuContext.closeAllPopups?.()
}

function handleMouseEnter(): void {
  if (!props.disabled) {
    menuContext.setHoverKey(props.itemKey)
  }
}

function handleMouseLeave(): void {
  menuContext.setHoverKey(null)
}
</script>

<template>
  <!-- 折叠模式且是顶级菜单项时使用 Tooltip -->
  <MenuTooltip v-if="isCollapsed && level === 0 && label" :content="label" placement="right">
    <li :class="classes" role="menuitem" :aria-disabled="disabled" :tabindex="disabled ? -1 : 0" @click="handleClick"
      @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <component :is="href ? 'a' : 'div'" class="l-menu-item__content" :href="href" :target="href ? target : undefined">
        <span v-if="icon || $slots.icon" class="l-menu-item__icon">
          <slot name="icon">
            <component v-if="icon && typeof icon !== 'string'" :is="icon" :size="18" />
            <span v-else-if="icon" class="l-menu-item__icon-text">{{ icon }}</span>
          </slot>
        </span>
        <span class="l-menu-item__label">
          <slot>{{ label }}</slot>
        </span>
      <span v-if="$slots.suffix" class="l-menu-item__suffix">
          <slot name="suffix" />
        </span>
        <!-- 徽标 -->
        <span v-if="showBadge" :class="badgeClasses">{{ badgeText }}</span>
      </component>
    </li>
  </MenuTooltip>

  <!-- 非折叠模式 -->
  <li v-else :class="classes" role="menuitem" :data-key="itemKey" :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <component :is="href ? 'a' : 'div'" class="l-menu-item__content" :href="href" :target="href ? target : undefined"
      :style="{ paddingLeft }">
      <span v-if="icon || $slots.icon" class="l-menu-item__icon">
        <slot name="icon">
          <component v-if="icon && typeof icon !== 'string'" :is="icon" :size="18" />
          <span v-else-if="icon" class="l-menu-item__icon-text">{{ icon }}</span>
        </slot>
      </span>
      <span class="l-menu-item__label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="$slots.suffix" class="l-menu-item__suffix">
        <slot name="suffix" />
      </span>
      <!-- 徽标 -->
      <span v-if="showBadge" :class="badgeClasses">{{ badgeText }}</span>
    </component>
  </li>
</template>
