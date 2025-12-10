<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { MenuManager } from '@ldesign/menu-vue'
import type { MenuItemData } from '@ldesign/menu-vue'

// 容器引用
const menuContainer1 = ref<HTMLElement | null>(null)
const menuContainer2 = ref<HTMLElement | null>(null)

// MenuManager 实例
let manager1: MenuManager | null = null
let manager2: MenuManager | null = null

// 状态
const selectedKey1 = ref('home')
const selectedKey2 = ref('dashboard')

// 菜单数据
const menuItems1: MenuItemData[] = [
  { key: 'home', label: '首页', type: 'item' },
  { key: 'dashboard', label: '仪表盘', type: 'item' },
  {
    key: 'content',
    label: '内容管理',
    type: 'submenu',
    children: [
      { key: 'articles', label: '文章管理', type: 'item' },
      { key: 'media', label: '媒体库', type: 'item' },
    ]
  },
  { key: 'settings', label: '系统设置', type: 'item' },
]

const menuItems2: MenuItemData[] = [
  { key: 'home', label: '首页', type: 'item' },
  { key: 'dashboard', label: '仪表盘', type: 'item' },
  { type: 'divider' },
  {
    key: 'content-group',
    type: 'group',
    label: '内容管理',
    children: [
      { key: 'articles', label: '文章管理', type: 'item' },
      { key: 'media', label: '媒体库', type: 'item' },
    ]
  },
  {
    key: 'system-group',
    type: 'group',
    label: '系统管理',
    children: [
      { key: 'users', label: '用户管理', type: 'item' },
      { key: 'settings', label: '系统设置', type: 'item' },
    ]
  },
]

// 使用原生 JS 渲染菜单
function renderMenu(container: HTMLElement, items: MenuItemData[], manager: MenuManager) {
  const nav = document.createElement('nav')
  nav.className = 'l-menu l-menu--vertical l-menu--light'
  nav.style.width = '100%'

  const ul = document.createElement('ul')
  ul.className = 'l-menu__list'
  ul.setAttribute('role', 'menu')

  function createMenuItem(item: MenuItemData, level = 0): HTMLElement | null {
    if (item.type === 'divider') {
      const li = document.createElement('li')
      li.className = 'l-menu-divider'
      li.setAttribute('role', 'separator')
      return li
    }

    if (item.type === 'group' && item.children) {
      const li = document.createElement('li')
      li.className = 'l-menu-group'
      li.setAttribute('role', 'group')

      if (item.label) {
        const title = document.createElement('div')
        title.className = 'l-menu-group__title'
        title.style.paddingLeft = `${24 * (level + 1)}px`
        title.textContent = item.label
        li.appendChild(title)
      }

      const groupUl = document.createElement('ul')
      groupUl.className = 'l-menu-group__content'
      groupUl.setAttribute('role', 'menu')

      item.children.forEach((child: MenuItemData) => {
        const childEl = createMenuItem(child, level + 1)
        if (childEl) groupUl.appendChild(childEl)
      })

      li.appendChild(groupUl)
      return li
    }

    if (item.type === 'submenu' && item.children) {
      const li = document.createElement('li')
      li.className = 'l-submenu'
      li.setAttribute('role', 'menuitem')

      const isOpen = manager.getOpenKeys().includes(item.key!)
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
      arrow.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>'
      titleDiv.appendChild(arrow)

      titleDiv.addEventListener('click', () => {
        manager.toggleOpen(item.key!)
        renderMenuToContainer()
      })

      li.appendChild(titleDiv)

      const contentUl = document.createElement('ul')
      contentUl.className = 'l-submenu__content'
      contentUl.setAttribute('role', 'menu')
      contentUl.style.height = isOpen ? 'auto' : '0px'
      contentUl.style.overflow = 'hidden'

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

    if (manager.getSelectedKey() === item.key) {
      li.classList.add('l-menu-item--selected')
    }

    const content = document.createElement('div')
    content.className = 'l-menu-item__content'
    content.style.paddingLeft = `${24 * (level + 1)}px`

    const labelSpan = document.createElement('span')
    labelSpan.className = 'l-menu-item__label'
    labelSpan.textContent = item.label || ''
    content.appendChild(labelSpan)

    li.appendChild(content)

    li.addEventListener('click', () => {
      manager.select(item.key!)
      renderMenuToContainer()
    })

    return li
  }

  items.forEach(item => {
    const el = createMenuItem(item)
    if (el) ul.appendChild(el)
  })

  nav.appendChild(ul)
  container.innerHTML = ''
  container.appendChild(nav)
}

function renderMenuToContainer() {
  if (menuContainer1.value && manager1) {
    renderMenu(menuContainer1.value, menuItems1, manager1)
    selectedKey1.value = manager1.getSelectedKey() || ''
  }
  if (menuContainer2.value && manager2) {
    renderMenu(menuContainer2.value, menuItems2, manager2)
    selectedKey2.value = manager2.getSelectedKey() || ''
  }
}

onMounted(() => {
  // 创建 MenuManager 实例
  manager1 = new MenuManager({
    items: menuItems1,
    defaultSelectedKey: 'home',
    defaultOpenKeys: ['content'],
  })

  manager2 = new MenuManager({
    items: menuItems2,
    defaultSelectedKey: 'dashboard',
  })

  renderMenuToContainer()
})

onUnmounted(() => {
  manager1 = null
  manager2 = null
})
</script>

<template>
  <div class="demo-section">
    <h2 class="demo-section-title">原生 JavaScript 渲染</h2>
    <p class="demo-section-desc">
      使用 @ldesign/menu-core 的 MenuManager 类配合原生 DOM 操作渲染菜单。
      适用于非 Vue 项目或需要更底层控制的场景。
    </p>

    <div class="demo-grid">
      <!-- 基础菜单 -->
      <div class="demo-card">
        <div class="demo-card-header">
          <span class="demo-card-title">基础菜单（带子菜单）</span>
        </div>
        <div class="demo-card-body">
          <div ref="menuContainer1" class="menu-preview menu-preview-vertical"></div>
          <div class="demo-status">当前选中：<code>{{ selectedKey1 }}</code></div>
        </div>
      </div>

      <!-- 带分组菜单 -->
      <div class="demo-card">
        <div class="demo-card-header">
          <span class="demo-card-title">带分组和分割线</span>
        </div>
        <div class="demo-card-body">
          <div ref="menuContainer2" class="menu-preview menu-preview-vertical"></div>
          <div class="demo-status">当前选中：<code>{{ selectedKey2 }}</code></div>
        </div>
      </div>
    </div>

    <!-- API 说明 -->
    <div class="demo-card" style="margin-top: 24px;">
      <div class="demo-card-header">
        <span class="demo-card-title">使用示例</span>
      </div>
      <div class="demo-card-body">
        <pre class="code-block"><code>import { 
  createMenuEngine, 
  createMenuItem, 
  createSubMenu, 
  createMenuGroup, 
  createMenuDivider 
} from '@ldesign/menu'

// 创建菜单引擎
const menu = createMenuEngine(container, {
  mode: 'vertical',
  expandMode: 'inline',
  theme: 'light',
  selectedKey: 'home',
  onSelect: (params) => console.log('Selected:', params),
})

// 添加菜单项
menu.addItem(createMenuItem({ 
  key: 'home', 
  label: '首页', 
  iconName: 'home' 
}))

// 添加子菜单
menu.addItem(createSubMenu({ 
  key: 'content', 
  label: '内容管理',
  children: [
    createMenuItem({ key: 'articles', label: '文章' }),
    createMenuItem({ key: 'media', label: '媒体' }),
  ]
}))

// 渲染菜单
menu.render()

// 销毁菜单
menu.destroy()</code></pre>
      </div>
    </div>

    <!-- API 列表 -->
    <div class="demo-card" style="margin-top: 24px;">
      <div class="demo-card-header">
        <span class="demo-card-title">核心 API</span>
      </div>
      <div class="demo-card-body">
        <table class="api-table">
          <thead>
            <tr>
              <th>方法</th>
              <th>说明</th>
              <th>参数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>createMenuEngine</code></td>
              <td>创建菜单引擎实例</td>
              <td>(container, options)</td>
            </tr>
            <tr>
              <td><code>createMenuItem</code></td>
              <td>创建菜单项</td>
              <td>({ key, label, iconName?, disabled? })</td>
            </tr>
            <tr>
              <td><code>createSubMenu</code></td>
              <td>创建子菜单</td>
              <td>({ key, label, iconName?, children })</td>
            </tr>
            <tr>
              <td><code>createMenuGroup</code></td>
              <td>创建菜单分组</td>
              <td>({ title, children })</td>
            </tr>
            <tr>
              <td><code>createMenuDivider</code></td>
              <td>创建分割线</td>
              <td>()</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-block {
  background: #282c34;
  color: #abb2bf;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}

.code-block code {
  font-family: 'Fira Code', 'Consolas', monospace;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.api-table th,
.api-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.api-table th {
  background: var(--color-bg-secondary);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.api-table td code {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  color: #d63384;
}
</style>
