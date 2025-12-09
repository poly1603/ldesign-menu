<script setup lang="ts">
/**
 * 菜单分隔线组件
 * @component LMenuDivider
 */
import { computed } from 'vue'

export interface MenuDividerProps {
  /**
   * 是否为虚线
   */
  dashed?: boolean
}

const props = withDefaults(defineProps<MenuDividerProps>(), {
  dashed: false,
})

const classes = computed(() => ({
  'l-menu-divider': true,
  'l-menu-divider--dashed': props.dashed,
}))
</script>

<template>
  <li :class="classes" role="separator" />
</template>

