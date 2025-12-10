<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Settings,
  Palette,
  Code,
  Layers,
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// 状态
const sidebarCollapsed = ref(false)
const darkMode = ref(false)

// 侧边栏菜单项
const sidebarItems = [
  { key: 'sidebar', path: '/sidebar', label: '侧边栏菜单', icon: LayoutDashboard },
  { key: 'horizontal', path: '/horizontal', label: '水平菜单', icon: Layers },
  { key: 'theme', path: '/theme', label: '主题切换', icon: Palette },
  { key: 'size', path: '/size', label: '尺寸变体', icon: Settings },
  { key: 'collapsed', path: '/collapsed', label: '折叠模式', icon: PanelLeftClose },
  { key: 'native', path: '/native', label: '原生渲染', icon: Code },
]

// 当前选中的菜单项
const activeKey = computed(() => {
  const item = sidebarItems.find(item => item.path === route.path)
  return item?.key || 'sidebar'
})

// 当前页面标题
const pageTitle = computed(() => {
  const item = sidebarItems.find(item => item.key === activeKey.value)
  return item?.label || ''
})

function handleMenuClick(item: typeof sidebarItems[0]) {
  router.push(item.path)
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function toggleDarkMode() {
  darkMode.value = !darkMode.value
  document.documentElement.setAttribute('data-theme-mode', darkMode.value ? 'dark' : 'light')
}
</script>

<template>
  <div class="playground" :class="{ 'dark-mode': darkMode }">
    <!-- 侧边栏 -->
    <aside class="playground-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <Palette :size="24" color="#1677ff" />
        <h1 v-show="!sidebarCollapsed">Menu Playground</h1>
      </div>

      <nav class="sidebar-menu">
        <div v-for="item in sidebarItems" :key="item.key" class="sidebar-item"
          :class="{ active: activeKey === item.key }" @click="handleMenuClick(item)">
          <component :is="item.icon" :size="20" />
          <span v-show="!sidebarCollapsed" class="sidebar-item-label">{{ item.label }}</span>
        </div>
      </nav>
    </aside>

    <!-- 主内容 -->
    <main class="playground-main">
      <!-- 头部 -->
      <header class="playground-header">
        <button class="btn btn-icon" @click="toggleSidebar" :title="sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'">
          <PanelLeft v-if="sidebarCollapsed" :size="20" />
          <PanelLeftClose v-else :size="20" />
        </button>

        <div class="header-nav">
          <h2 class="page-title">{{ pageTitle }}</h2>
        </div>

        <div class="header-actions">
          <button class="btn btn-icon" @click="toggleDarkMode" :title="darkMode ? '切换浅色模式' : '切换深色模式'">
            <Moon v-if="darkMode" :size="20" />
            <Sun v-else :size="20" />
          </button>
        </div>
      </header>

      <!-- 内容区 -->
      <div class="playground-content">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>
  </div>
</template>

<style scoped>
.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin: 2px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-text-secondary);
}

.sidebar-item:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--color-text);
}

.sidebar-item.active {
  background: #e6f4ff;
  color: #1677ff;
}

.sidebar-item-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
}

/* 深色模式 */
.dark-mode {
  --color-bg: #141414;
  --color-bg-elevated: #1f1f1f;
  --color-text: rgba(255, 255, 255, 0.85);
  --color-text-secondary: rgba(255, 255, 255, 0.65);
  --color-border: rgba(255, 255, 255, 0.12);
}

.dark-mode .sidebar-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.dark-mode .sidebar-item.active {
  background: rgba(22, 119, 255, 0.15);
  color: #1677ff;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
