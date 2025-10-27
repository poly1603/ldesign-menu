<template>
  <li class="ldesign-menu-item" :class="itemClasses" :data-menu-item-id="item.id" :data-level="level">
    <!-- 菜单项内容 -->
    <div 
      ref="contentRef"
      class="ldesign-menu-item__content" 
      :style="contentStyle" 
      :tabindex="item.disabled ? -1 : 0" 
      role="menuitem"
      :aria-expanded="hasChildren ? isExpanded : undefined"
      :aria-disabled="item.disabled"
      @click="handleClick" 
      @mouseenter="handleMouseEnter"
      @keydown="handleKeyDown"
    >
      <!-- 图标 -->
      <span v-if="item.icon && (!collapsed || level > 0)" class="ldesign-menu-item__icon">
        <!-- 如果是 SVG 字符串 -->
        <span v-if="typeof item.icon === 'string' && item.icon.includes('<svg')" v-html="item.icon" />
        <!-- 如果是文本/emoji -->
        <span v-else>{{ item.icon }}</span>
      </span>

      <!-- 标签 -->
      <span v-if="!collapsed || level > 0" class="ldesign-menu-item__label">
        {{ item.label }}
      </span>

      <!-- 角标 -->
      <span v-if="item.badge && (!collapsed || level > 0)" class="ldesign-menu-item__badge">
        {{ item.badge }}
      </span>

      <!-- 展开箭头 - 使用更优雅的 SVG 图标 -->
      <span 
        v-if="hasChildren && submenuTrigger === 'inline' && (!collapsed || level > 0)"
        class="ldesign-menu-item__arrow"
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>

      <!-- 激活状态提示（折叠模式下的小圆点） -->
      <span 
        v-if="collapsed && level === 0 && isActive" 
        class="ldesign-menu-item__dot"
      />
    </div>

    <!-- 子菜单（内联模式） -->
    <Transition name="submenu-expand" @enter="onSubmenuEnter" @leave="onSubmenuLeave">
      <ul 
        v-if="hasChildren && submenuTrigger === 'inline' && isExpanded" 
        class="ldesign-menu-submenu"
        :style="submenuStyle"
      >
        <MenuItem 
          v-for="child in item.children" 
          :key="child.id" 
          :item="child" 
          :level="level + 1" 
          :active-key="activeKey"
          :expanded-keys="expandedKeys" 
          :indent="indent" 
          :submenu-trigger="submenuTrigger" 
          :collapsed="collapsed"
          @select="emit('select', $event)" 
          @expand="emit('expand', $event)" 
          @collapse="emit('collapse', $event)" 
        />
      </ul>
    </Transition>
  </li>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MenuItem as MenuItemType } from '@ldesign/menu-core'

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

const contentRef = ref<HTMLElement | null>(null)

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

const submenuStyle = computed(() => {
  return {}
})

const handleClick = (event: MouseEvent) => {
  if (props.item.disabled) {
    return
  }

  // 创建涟漪效果
  createRipple(event)

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

const handleKeyDown = (event: KeyboardEvent) => {
  if (props.item.disabled) {
    return
  }

  // Enter 或 Space 键触发点击
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick(event as unknown as MouseEvent)
  }

  // 右箭头展开，左箭头收起
  if (hasChildren.value) {
    if (event.key === 'ArrowRight' && !isExpanded.value) {
      event.preventDefault()
      emit('expand', props.item)
    }
    else if (event.key === 'ArrowLeft' && isExpanded.value) {
      event.preventDefault()
      emit('collapse', props.item)
    }
  }
}

// 创建涟漪效果
const createRipple = (event: MouseEvent) => {
  if (!contentRef.value) return

  const content = contentRef.value
  const rect = content.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // 触发 CSS 涟漪动画
  // 注意：涟漪效果已经通过 CSS ::before 伪元素实现
  // 这里不需要额外的 JS 处理
}

// 子菜单进入动画
const onSubmenuEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.maxHeight = '0'
  element.style.opacity = '0'

  // 强制重绘
  void element.offsetHeight

  // 设置最终状态
  element.style.maxHeight = `${element.scrollHeight}px`
  element.style.opacity = '1'
}

// 子菜单离开动画
const onSubmenuLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.maxHeight = `${element.scrollHeight}px`
  element.style.opacity = '1'

  // 强制重绘
  void element.offsetHeight

  // 设置最终状态
  element.style.maxHeight = '0'
  element.style.opacity = '0'
}
</script>

<style scoped>
/* 样式已在全局 CSS 中定义 */

/* 折叠模式下的激活圆点 */
.ldesign-menu-item__dot {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background-color: var(--menu-indicator-color);
  border-radius: 50%;
  animation: dot-pulse 2s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% {
    transform: translateY(-50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-50%) scale(1.2);
    opacity: 0.8;
  }
}

/* 子菜单过渡 */
.submenu-expand-enter-active,
.submenu-expand-leave-active {
  transition: max-height 0.3s cubic-bezier(0.34, 0.69, 0.1, 1),
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.submenu-expand-enter-from,
.submenu-expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>

