<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { LMenu, LMenuItem, LSubMenu, LMenuGroup, LMenuDivider, MenuManager } from '@ldesign/menu-vue'
import type { MenuItemData } from '@ldesign/menu-vue'
import {
  Home,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  BarChart3,
  FolderOpen,
  Image,
  Video,
} from 'lucide-vue-next'

// Vue 组件渲染状态
const selectedKey = ref('home')
const openKeys = ref<string[]>(['content'])
const expandMode = ref<'inline' | 'popup' | 'mixed'>('inline')
const accordion = ref(false)

// 触发方式固定为 click
const trigger = 'click'

// JS 渲染状态
const jsMenuContainer = ref<HTMLElement | null>(null)
const jsSelectedKey = ref('home')
let jsManager: MenuManager | null = null

// JS 渲染菜单数据
const jsMenuItems: MenuItemData[] = [
  { key: 'home', label: '首页', type: 'item' },
  { key: 'dashboard', label: '仪表盘', type: 'item' },
  {
    key: 'content',
    label: '内容管理',
    type: 'submenu',
    children: [
      { key: 'articles', label: '文章管理', type: 'item' },
      { key: 'media', label: '媒体库', type: 'item' },
      { key: 'videos', label: '视频管理', type: 'item' },
    ]
  },
  {
    key: 'system',
    label: '系统管理',
    type: 'submenu',
    children: [
      { key: 'user-list', label: '用户列表', type: 'item' },
      { key: 'user-roles', label: '角色管理', type: 'item' },
      { key: 'user-permissions', label: '权限管理', type: 'item' },
    ]
  },
  { key: 'analytics', label: '数据分析', type: 'item' },
  { key: 'settings', label: '系统设置', type: 'item' },
]

function handleSelect(params: any) {
  console.log('Selected:', params)
}

// JS 渲染函数
function renderJsMenu() {
  if (!jsMenuContainer.value || !jsManager) return

  const container = jsMenuContainer.value
  const nav = document.createElement('nav')
  nav.className = 'l-menu l-menu--vertical l-menu--light'
  nav.style.width = '100%'

  const ul = document.createElement('ul')
  ul.className = 'l-menu__list'
  ul.setAttribute('role', 'menu')

  function createMenuItem(item: MenuItemData, level = 0): HTMLElement | null {
    if (item.type === 'submenu' && item.children) {
      const li = document.createElement('li')
      li.className = 'l-submenu'
      li.setAttribute('role', 'menuitem')

      const isOpen = jsManager!.getOpenKeys().includes(item.key!)
      if (isOpen) li.classList.add('l-submenu--open')

      const titleDiv = document.createElement('div')
      titleDiv.className = 'l-submenu__title'
      titleDiv.style.paddingLeft = `${24 * (level + 1)}px`

      const label = document.createElement('span')
      label.className = 'l-submenu__label'
      label.textContent = item.label || ''
      titleDiv.appendChild(label)

      const arrow = document.createElement('span')
      arrow.className = 'l-submenu__arrow'
      arrow.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transform: rotate(${isOpen ? '180deg' : '0deg'}); transition: transform 0.2s;"><polyline points="6 9 12 15 18 9"></polyline></svg>`
      titleDiv.appendChild(arrow)

      titleDiv.addEventListener('click', () => {
        jsManager!.toggleOpen(item.key!)
        renderJsMenu()
      })

      li.appendChild(titleDiv)

      const contentUl = document.createElement('ul')
      contentUl.className = 'l-submenu__content'
      contentUl.setAttribute('role', 'menu')
      contentUl.style.height = isOpen ? 'auto' : '0px'
      contentUl.style.overflow = 'hidden'
      contentUl.style.transition = 'height 0.2s ease'

      item.children.forEach((child: MenuItemData) => {
        const childEl = createMenuItem(child, level + 1)
        if (childEl) contentUl.appendChild(childEl)
      })

      li.appendChild(contentUl)
      return li
    }

    // 普通菜单项
    const li = document.createElement('li')
    li.className = 'l-menu-item'
    li.setAttribute('role', 'menuitem')
    li.setAttribute('tabindex', '0')

    if (jsManager!.getSelectedKey() === item.key) {
      li.classList.add('l-menu-item--selected')
    }

    const content = document.createElement('div')
    content.className = 'l-menu-item__content'
    content.style.paddingLeft = `${24 * (level + 1)}px`

    const labelSpan = document.createElement('span')
    labelSpan.className = 'l-menu-item__label'
    labelSpan.textContent = 'label' in item ? (item.label || '') : ''
    content.appendChild(labelSpan)

    li.appendChild(content)

    li.addEventListener('click', () => {
      jsManager!.select(item.key!)
      jsSelectedKey.value = item.key!
      renderJsMenu()
    })

    return li
  }

  jsMenuItems.forEach(item => {
    const el = createMenuItem(item)
    if (el) ul.appendChild(el)
  })

  nav.appendChild(ul)
  container.innerHTML = ''
  container.appendChild(nav)
}

onMounted(() => {
  jsManager = new MenuManager({
    items: jsMenuItems,
    defaultSelectedKey: 'home',
    defaultOpenKeys: ['content'],
  })
  nextTick(() => renderJsMenu())
})

onUnmounted(() => {
  jsManager = null
})
</script>

<template>
  <div class="demo-section">
    <h2 class="demo-section-title">侧边栏菜单</h2>
    <p class="demo-section-desc">
      垂直模式的菜单，适用于侧边栏导航。支持内嵌展开、弹出展开和混合模式。
    </p>

    <div class="demo-card">
      <div class="demo-card-header">
        <span class="demo-card-title">Vue 组件渲染</span>
      </div>
      <div class="demo-card-body">
        <!-- 控制面板 -->
        <div class="control-panel">
          <div class="control-group">
            <span class="control-label">展开方式：</span>
            <select v-model="expandMode" class="control-select">
              <option value="inline">内嵌展开 (inline)</option>
              <option value="popup">弹出展开 (popup)</option>
              <option value="mixed">混合模式 (mixed)</option>
            </select>
          </div>
          <label class="control-checkbox">
            <input type="checkbox" v-model="accordion" />
            <span>手风琴模式</span>
          </label>
        </div>

        <!-- 菜单演示 -->
        <div class="demo-container">
          <div class="demo-box">
            <div class="demo-box-title">基础用法</div>
            <div class="menu-preview menu-preview-vertical">
              <LMenu v-model:selected-key="selectedKey" v-model:open-keys="openKeys" :expand-mode="expandMode"
                :accordion="accordion" :trigger="trigger" @select="handleSelect">
                <LMenuItem item-key="home" label="首页">
                  <template #icon>
                    <Home :size="18" />
                  </template>
                </LMenuItem>
                <LMenuItem item-key="dashboard" label="仪表盘">
                  <template #icon>
                    <LayoutDashboard :size="18" />
                  </template>
                </LMenuItem>

                <LSubMenu item-key="content" label="内容管理">
                  <template #icon>
                    <FolderOpen :size="18" />
                  </template>
                  <LMenuItem item-key="articles" label="文章管理">
                    <template #icon>
                      <FileText :size="18" />
                    </template>
                  </LMenuItem>
                  <LMenuItem item-key="media" label="媒体库">
                    <template #icon>
                      <Image :size="18" />
                    </template>
                  </LMenuItem>
                  <LMenuItem item-key="videos" label="视频管理">
                    <template #icon><Video :size="18" /></template>
                  </LMenuItem>
                </LSubMenu>

                <LSubMenu item-key="system" label="系统管理">
                  <template #icon>
                    <Users :size="18" />
                  </template>
                  <LMenuItem item-key="user-list" label="用户列表" />
                  <LMenuItem item-key="user-roles" label="角色管理" />
                  <LMenuItem item-key="user-permissions" label="权限管理" />
                </LSubMenu>

                <LMenuItem item-key="analytics" label="数据分析">
                  <template #icon>
                    <BarChart3 :size="18" />
                  </template>
                </LMenuItem>
                <LMenuItem item-key="settings" label="系统设置">
                  <template #icon>
                    <Settings :size="18" />
                  </template>
                </LMenuItem>
              </LMenu>
            </div>
          </div>

          <div class="demo-box">
            <div class="demo-box-title">带分组和分割线</div>
            <div class="menu-preview menu-preview-vertical">
              <LMenu v-model:selected-key="selectedKey">
                <LMenuItem item-key="home2" label="首页">
                  <template #icon>
                    <Home :size="18" />
                  </template>
                </LMenuItem>
                <LMenuItem item-key="dashboard2" label="仪表盘">
                  <template #icon>
                    <LayoutDashboard :size="18" />
                  </template>
                </LMenuItem>

                <LMenuDivider />

                <LMenuGroup title="内容管理">
                  <LMenuItem item-key="articles2" label="文章管理">
                    <template #icon>
                      <FileText :size="18" />
                    </template>
                  </LMenuItem>
                  <LMenuItem item-key="media2" label="媒体库">
                    <template #icon>
                      <Image :size="18" />
                    </template>
                  </LMenuItem>
                </LMenuGroup>

                <LMenuGroup title="系统管理">
                  <LMenuItem item-key="users2" label="用户管理">
                    <template #icon>
                      <Users :size="18" />
                    </template>
                  </LMenuItem>
                  <LMenuItem item-key="settings2" label="系统设置">
                    <template #icon>
                      <Settings :size="18" />
                    </template>
                  </LMenuItem>
                </LMenuGroup>
              </LMenu>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-card-footer">
        <div class="demo-info">
          <span>当前选中：<code>{{ selectedKey }}</code></span>
          <span style="margin-left: 16px">展开项：<code>{{ openKeys.join(', ') || '无' }}</code></span>
        </div>
      </div>
    </div>

    <!-- JS 原生渲染 -->
    <div class="demo-card" style="margin-top: 24px;">
      <div class="demo-card-header">
        <span class="demo-card-title">原生 JavaScript 渲染</span>
      </div>
      <div class="demo-card-body">
        <p class="demo-note">使用 MenuManager 配合原生 DOM API 渲染，适用于非 Vue 项目。</p>
        <div class="demo-container">
          <div class="demo-box">
            <div class="demo-box-title">JS 渲染菜单</div>
            <div ref="jsMenuContainer" class="menu-preview menu-preview-vertical"></div>
          </div>
          <div class="demo-box">
            <div class="demo-box-title">状态信息</div>
            <div class="js-state-info">
              <p>当前选中：<code>{{ jsSelectedKey }}</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-info {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.demo-info code,
.js-state-info code {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
}

.demo-note {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.js-state-info {
  padding: 16px;
  background: var(--color-bg);
  border-radius: 8px;
}

.js-state-info p {
  margin: 8px 0;
  font-size: 13px;
}
</style>
