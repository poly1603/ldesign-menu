<template>
  <li class="ldesign-menu-item" :class="itemClasses" :data-menu-item-id="item.id" :data-level="level">
    <!-- 菜单项内容 -->
    <div class="ldesign-menu-item__content" :style="contentStyle" :tabindex="item.disabled ? -1 : 0" role="menuitem"
      @click="handleClick" @mouseenter="handleMouseEnter">
      <!-- 图标 -->
      <span v-if="item.icon && (!collapsed || level > 0)" class="ldesign-menu-item__icon">
        {{ item.icon }}
      </span>

      <!-- 标签 -->
      <span v-if="!collapsed || level > 0" class="ldesign-menu-item__label">
        {{ item.label }}
      </span>

      <!-- 角标 -->
      <span v-if="item.badge && (!collapsed || level > 0)" class="ldesign-menu-item__badge">
        {{ item.badge }}
      </span>

      <!-- 展开箭头 -->
      <span v-if="hasChildren && submenuTrigger === 'inline' && (!collapsed || level > 0)"
        class="ldesign-menu-item__arrow">
        ▶
      </span>
    </div>

    <!-- 子菜单（内联模式） -->
    <ul v-if="hasChildren && submenuTrigger === 'inline' && isExpanded" class="ldesign-menu-submenu">
      <MenuItem v-for="child in item.children" :key="child.id" :item="child" :level="level + 1" :active-key="activeKey"
        :expanded-keys="expandedKeys" :indent="indent" :submenu-trigger="submenuTrigger" :collapsed="collapsed"
        @select="emit('select', $event)" @expand="emit('expand', $event)" @collapse="emit('collapse', $event)" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MenuItem as MenuItemType } from '../../types'

interface MenuItemProps {
  item: MenuItemType
  level: number
  activeKey: string | number | null
  expandedKeys: Set<string | number>
  indent?: number
  submenuTrigger?: 'popup' | 'inline'
  collapsed?: boolean
}

const props = withDefaults(defineProps<MenuItemProps>(), {
  indent: 24,
  submenuTrigger: 'inline',
  collapsed: false,
})

const emit = defineEmits<{
  select: [item: MenuItemType]
  expand: [item: MenuItemType]
  collapse: [item: MenuItemType]
}>()

const hasChildren = computed(() => {
  return props.item.children && props.item.children.length > 0
})

const isActive = computed(() => {
  return props.activeKey === props.item.id
})

const isExpanded = computed(() => {
  return props.expandedKeys.has(props.item.id)
})

const itemClasses = computed(() => {
  return {
    'ldesign-menu-item--active': isActive.value,
    'ldesign-menu-item--disabled': props.item.disabled,
    'ldesign-menu-item--has-children': hasChildren.value,
    'ldesign-menu-item--expanded': isExpanded.value,
  }
})

const contentStyle = computed(() => {
  if (props.level > 0 && !props.collapsed) {
    return {
      paddingLeft: `${props.indent * (props.level + 1)}px`,
    }
  }
  return {}
})

const handleClick = (event: MouseEvent) => {
  if (props.item.disabled) {
    return
  }

  if (hasChildren.value) {
    // 切换展开状态
    if (isExpanded.value) {
      emit('collapse', props.item)
    }
    else {
      emit('expand', props.item)
    }
  }
  else {
    // 选中菜单项
    emit('select', props.item)
  }
}

const handleMouseEnter = () => {
  // 可以在这里处理悬停逻辑
}
</script>

<style scoped>
/* 样式已在全局 CSS 中定义 */
</style>

