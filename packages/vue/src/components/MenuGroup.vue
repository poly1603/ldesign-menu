<script setup lang="ts">
/**
 * 菜单分组组件
 * @component LMenuGroup
 */
import { computed } from 'vue'
import { provideSubMenuContext, useMenuContext, useSubMenuContext } from '../composables'

/**
 * 组件属性
 */
export interface MenuGroupProps {
  /**
   * 分组标题
   */
  title?: string
}

defineProps<MenuGroupProps>()

// 注入上下文
const menuContext = useMenuContext()
const parentContext = useSubMenuContext()

// 当前层级
const level = computed(() => parentContext.level)

// 提供子菜单上下文给子组件
provideSubMenuContext({
  level: level.value + 1,
})

// 计算缩进
const paddingLeft = computed(() => {
  const baseIndent = menuContext.indent.value
  return `${baseIndent * (level.value + 1)}px`
})

// CSS 类名
const classes = computed(() => ({
  'l-menu-group': true,
}))
</script>

<template>
  <li :class="classes" role="group">
    <!-- 分组标题 -->
    <div v-if="title || $slots.title" class="l-menu-group__title" :style="{ paddingLeft }">
      <slot name="title">
        {{ title }}
      </slot>
    </div>

    <!-- 分组内容 -->
    <ul class="l-menu-group__content" role="menu">
      <slot />
    </ul>
  </li>
</template>
