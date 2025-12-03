# Menu 组件使用示例

## 基础用法

### 垂直菜单

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LMenu, LMenuItem, LSubMenu } from '@ldesign/menu-vue'
import '@ldesign/menu-vue/styles'

const selectedKey = ref('item1')
</script>

<template>
  <LMenu
    v-model:selectedKey="selectedKey"
    mode="vertical"
    theme="light"
    :indent="16"
  >
    <LMenuItem itemKey="item1" label="菜单项 1" icon="📄" />
    <LMenuItem itemKey="item2" label="菜单项 2" icon="📁" />
    
    <LSubMenu itemKey="sub1" label="子菜单" icon="📂">
      <LMenuItem itemKey="sub1-1" label="子项 1" />
      <LMenuItem itemKey="sub1-2" label="子项 2" />
    </LSubMenu>
  </LMenu>
</template>
```

### 横向菜单

```vue
<template>
  <LMenu mode="horizontal" theme="light">
    <LMenuItem itemKey="home" label="首页" />
    <LMenuItem itemKey="products" label="产品" />
    
    <LSubMenu itemKey="about" label="关于">
      <LMenuItem itemKey="company" label="公司介绍" />
      <LMenuItem itemKey="team" label="团队成员" />
    </LSubMenu>
  </LMenu>
</template>
```

## 高级用法

### 折叠菜单 + Tooltip

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LMenu, LMenuItem, LSubMenu, LMenuTooltip } from '@ldesign/menu-vue'

const collapsed = ref(false)

function toggleCollapse() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <div>
    <button @click="toggleCollapse">
      {{ collapsed ? '展开' : '折叠' }}
    </button>
    
    <LMenu
      v-model:collapsed="collapsed"
      mode="vertical"
      :collapsed-width="64"
      :expanded-width="240"
    >
      <LMenuTooltip 
        v-if="collapsed"
        content="仪表盘"
        placement="right"
      >
        <LMenuItem itemKey="dashboard" icon="📊" label="仪表盘" />
      </LMenuTooltip>
      <LMenuItem v-else itemKey="dashboard" icon="📊" label="仪表盘" />
      
      <LMenuTooltip 
        v-if="collapsed"
        content="用户管理"
        placement="right"
      >
        <LSubMenu itemKey="users" icon="👥" label="用户管理">
          <LMenuItem itemKey="user-list" label="用户列表" />
          <LMenuItem itemKey="user-roles" label="角色管理" />
        </LSubMenu>
      </LMenuTooltip>
      <LSubMenu v-else itemKey="users" icon="👥" label="用户管理">
        <LMenuItem itemKey="user-list" label="用户列表" />
        <LMenuItem itemKey="user-roles" label="角色管理" />
      </LSubMenu>
    </LMenu>
  </div>
</template>
```

### 键盘导航

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LMenu, LMenuItem, useMenuKeyboard } from '@ldesign/menu-vue'

const items = ref([
  { key: 'item1', label: '菜单项 1', type: 'item' },
  { key: 'item2', label: '菜单项 2', type: 'item' },
  { 
    key: 'sub1', 
    label: '子菜单', 
    type: 'submenu',
    children: [
      { key: 'sub1-1', label: '子项 1', type: 'item' },
      { key: 'sub1-2', label: '子项 2', type: 'item' },
    ]
  },
])

const selectedKey = ref('item1')
const openKeys = ref<string[]>([])

function handleSelect(key: string) {
  selectedKey.value = key
}

function handleToggleOpen(key: string) {
  const index = openKeys.value.indexOf(key)
  if (index > -1) {
    openKeys.value.splice(index, 1)
  } else {
    openKeys.value.push(key)
  }
}

// 启用键盘导航
const { focusedKey } = useMenuKeyboard({
  items,
  selectedKey,
  openKeys,
  onSelect: handleSelect,
  onToggleOpen: handleToggleOpen,
  enabled: true,
})
</script>

<template>
  <div>
    <p>当前焦点: {{ focusedKey }}</p>
    <p>提示: 使用方向键导航，Enter 选中，Esc 关闭</p>
    
    <LMenu
      :items="items"
      v-model:selectedKey="selectedKey"
      v-model:openKeys="openKeys"
    />
  </div>
</template>
```

### 深色主题

```vue
<template>
  <LMenu mode="vertical" theme="dark">
    <LMenuItem itemKey="item1" label="菜单项 1" icon="📄" />
    <LMenuItem itemKey="item2" label="菜单项 2" icon="📁" />
    
    <LSubMenu itemKey="sub1" label="子菜单" icon="📂">
      <LMenuItem itemKey="sub1-1" label="子项 1" />
      <LMenuItem itemKey="sub1-2" label="子项 2" />
    </LSubMenu>
  </LMenu>
</template>
```

### 手风琴模式

```vue
<template>
  <LMenu mode="vertical" :accordion="true">
    <LSubMenu itemKey="sub1" label="子菜单 1" icon="📂">
      <LMenuItem itemKey="sub1-1" label="子项 1" />
      <LMenuItem itemKey="sub1-2" label="子项 2" />
    </LSubMenu>
    
    <LSubMenu itemKey="sub2" label="子菜单 2" icon="📂">
      <LMenuItem itemKey="sub2-1" label="子项 1" />
      <LMenuItem itemKey="sub2-2" label="子项 2" />
    </LSubMenu>
  </LMenu>
</template>
```

## 自定义样式

### 使用 CSS 变量

```vue
<template>
  <LMenu 
    mode="vertical"
    style="
      --l-menu-hover-bg-color: rgba(59, 130, 246, 0.08);
      --l-menu-selected-bg-color: rgba(59, 130, 246, 0.15);
      --l-menu-selected-indicator-color: #3b82f6;
      --l-menu-border-radius: 12px;
    "
  >
    <LMenuItem itemKey="item1" label="自定义样式" />
  </LMenu>
</template>
```

### 自定义图标

```vue
<template>
  <LMenu mode="vertical">
    <LMenuItem itemKey="item1" label="自定义图标">
      <template #icon>
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
        </svg>
      </template>
    </LMenuItem>
  </LMenu>
</template>
```

## 事件处理

```vue
<script setup lang="ts">
function handleSelect(params: MenuSelectEventParams) {
  console.log('选中:', params.key, params.item)
}

function handleOpenChange(params: MenuOpenChangeEventParams) {
  console.log('展开状态变化:', params.key, params.open)
}
</script>

<template>
  <LMenu
    @select="handleSelect"
    @open-change="handleOpenChange"
  >
    <LMenuItem itemKey="item1" label="菜单项" />
  </LMenu>
</template>
```

