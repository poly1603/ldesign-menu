<script setup lang="ts">
/**
 * 菜单树组件
 * 用于递归渲染菜单项
 */
import type { MenuItem } from '../types'
import MenuItemComponent from './MenuItem.vue'
import SubMenuComponent from './SubMenu.vue'
import MenuGroupComponent from './MenuGroup.vue'
import MenuDividerComponent from './MenuDivider.vue'

interface Props {
  items: MenuItem[]
  renderMode?: 'full' | 'rootOnly' | 'childrenOf'
}

const props = withDefaults(defineProps<Props>(), {
  renderMode: 'full'
})

// 判断菜单项类型
function isSubMenu(item: MenuItem): boolean {
  // rootOnly 模式下不渲染为 submenu
  if (props.renderMode === 'rootOnly') {
    return false
  }
  return item.type === 'submenu' || (!!(item as any).children && item.type !== 'group')
}

function isGroup(item: MenuItem): boolean {
  return item.type === 'group'
}

function isDivider(item: MenuItem): boolean {
  return item.type === 'divider'
}
</script>

<template>
  <template v-for="item in props.items" :key="item.key">
    <!-- 分组 -->
    <MenuGroupComponent
      v-if="isGroup(item)"
      :label="item.label"
    >
      <template #title v-if="item.label">{{ item.label }}</template>
      <MenuTree :items="(item as any).children || []" />
    </MenuGroupComponent>

    <!-- 子菜单 -->
    <SubMenuComponent
      v-else-if="isSubMenu(item)"
      :item-key="item.key"
      :label="item.label"
      :icon="item.icon"
      :disabled="item.disabled"
    >
      <template #icon v-if="item.icon">
        <component v-if="typeof item.icon !== 'string'" :is="item.icon" />
        <span v-else>{{ item.icon }}</span>
      </template>
      <MenuTree :items="(item as any).children || []" />
    </SubMenuComponent>

    <!-- 分割线 -->
    <MenuDividerComponent
      v-else-if="isDivider(item)"
      :dashed="(item as any).dashed"
    />

    <!-- 普通菜单项 -->
    <MenuItemComponent
      v-else
      :item-key="item.key"
      :label="item.label"
      :icon="item.icon"
      :disabled="item.disabled"
      :danger="(item as any).danger"
      :href="item.href"
      :target="item.target"
      :badge="item.badge"
    >
      <template #icon v-if="item.icon">
        <component v-if="typeof item.icon !== 'string'" :is="item.icon" />
        <span v-else>{{ item.icon }}</span>
      </template>
    </MenuItemComponent>
  </template>
</template>
