<template>
  <ul class="ldesign-menu" :class="menuClasses" :data-mode="mode" :data-theme="theme">
    <MenuItem v-for="item in visibleItems" :key="item.id" :item="item" :level="0" :active-key="currentActiveKey"
      :expanded-keys="currentExpandedKeys" :indent="indent" :submenu-trigger="submenuTrigger" :collapsed="collapsed"
      @select="handleSelect" @expand="handleExpand" @collapse="handleCollapse" />
  </ul>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MenuItem from './MenuItem.vue'
import type { MenuConfig, MenuItem as MenuItemType } from '../../types'

interface MenuProps extends Partial<MenuConfig> {
  items?: MenuItemType[]
}

const props = withDefaults(defineProps<MenuProps>(), {
  mode: 'vertical',
  theme: 'light',
  items: () => [],
  expandMode: 'click',
  submenuTrigger: 'inline',
  collapsed: false,
  indent: 24,
  animation: true,
  defaultExpandedKeys: () => [],
  defaultActiveKey: '',
})

const emit = defineEmits<{
  select: [item: MenuItemType, event?: Event]
  expand: [item: MenuItemType]
  collapse: [item: MenuItemType]
  click: [item: MenuItemType, event: Event]
  'update:collapsed': [collapsed: boolean]
}>()

const currentActiveKey = ref<string | number | null>(props.defaultActiveKey || null)
const currentExpandedKeys = ref<Set<string | number>>(new Set(props.defaultExpandedKeys))

// 过滤隐藏的菜单项
const visibleItems = computed(() => {
  return props.items?.filter(item => !item.hidden) || []
})

const menuClasses = computed(() => {
  return [
    `ldesign-menu--${props.mode}`,
    `ldesign-menu--${props.theme}`,
    {
      'ldesign-menu--collapsed': props.collapsed,
      'ldesign-menu--no-animation': !props.animation,
    },
  ]
})

// 处理菜单选择
const handleSelect = (item: MenuItemType) => {
  currentActiveKey.value = item.id
  emit('select', item)
  props.onSelect?.(item)
}

// 处理展开
const handleExpand = (item: MenuItemType) => {
  currentExpandedKeys.value.add(item.id)
  emit('expand', item)
  props.onExpand?.(item)
}

// 处理收起
const handleCollapse = (item: MenuItemType) => {
  currentExpandedKeys.value.delete(item.id)
  emit('collapse', item)
  props.onCollapse?.(item)
}

// 监听 defaultActiveKey 变化
watch(
  () => props.defaultActiveKey,
  (newKey) => {
    if (newKey !== undefined && newKey !== null) {
      currentActiveKey.value = newKey
    }
  },
)

// 监听 defaultExpandedKeys 变化
watch(
  () => props.defaultExpandedKeys,
  (newKeys) => {
    if (newKeys) {
      currentExpandedKeys.value = new Set(newKeys)
    }
  },
  { deep: true },
)

// 暴露方法
const selectItem = (itemId: string | number) => {
  currentActiveKey.value = itemId
}

const expand = (itemId: string | number) => {
  currentExpandedKeys.value.add(itemId)
}

const collapse = (itemId: string | number) => {
  currentExpandedKeys.value.delete(itemId)
}

defineExpose({
  selectItem,
  expand,
  collapse,
})
</script>

<style scoped>
.ldesign-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
