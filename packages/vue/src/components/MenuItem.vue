<script setup lang="ts">
/**
 * 菜单项组件
 */
import type { Component } from 'vue'
import { computed } from 'vue'
import { useMenuContext, useSubMenuContext } from '../composables'
import MenuTooltip from './MenuTooltip.vue'

export interface MenuItemProps {
  itemKey: string
  label?: string
  icon?: string | Component
  disabled?: boolean
  danger?: boolean
  href?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
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
    </component>
  </li>
</template>
