<script setup lang="ts">
import { ref } from 'vue'
import { LMenu, LMenuItem, LSubMenu } from '@ldesign/menu-vue'
import { Home, Settings, Users, FolderOpen, FileText, BarChart3, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'

const selectedKey = ref('home')
const openKeys = ref<string[]>([])
const collapsed = ref(false)

function toggleCollapse() {
  collapsed.value = !collapsed.value
  if (collapsed.value) {
    openKeys.value = []
  }
}
</script>

<template>
  <div class="demo-section">
    <h2 class="demo-section-title">折叠菜单</h2>
    <p class="demo-section-desc">
      侧边栏菜单支持折叠模式，折叠后仅显示图标，悬停时显示完整内容的 Tooltip。
    </p>

    <div class="demo-card">
      <div class="demo-card-header">
        <span class="demo-card-title">折叠/展开切换</span>
        <button class="collapse-btn" @click="toggleCollapse">
          <component :is="collapsed ? PanelLeftOpen : PanelLeftClose" :size="18" />
          <span>{{ collapsed ? '展开' : '折叠' }}</span>
        </button>
      </div>
      <div class="demo-card-body">
        <div class="collapsed-demo-container">
          <div class="menu-preview menu-preview-vertical collapsed-preview"
            :style="{ width: collapsed ? '64px' : '240px' }">
            <LMenu v-model:selected-key="selectedKey" v-model:open-keys="openKeys" :collapsed="collapsed"
              expand-mode="popup">
              <LMenuItem item-key="home" label="首页">
                <template #icon>
                  <Home :size="18" />
                </template>
              </LMenuItem>
              <LMenuItem item-key="dashboard" label="仪表盘">
                <template #icon>
                  <BarChart3 :size="18" />
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
                <LMenuItem item-key="media" label="媒体库" />
              </LSubMenu>

              <LSubMenu item-key="system" label="系统管理">
                <template #icon>
                  <Settings :size="18" />
                </template>
                <LMenuItem item-key="users" label="用户管理">
                  <template #icon>
                    <Users :size="18" />
                  </template>
                </LMenuItem>
                <LMenuItem item-key="roles" label="角色管理" />
                <LMenuItem item-key="settings" label="系统设置">
                  <template #icon>
                    <Settings :size="18" />
                  </template>
                </LMenuItem>
              </LSubMenu>
            </LMenu>
          </div>

          <div class="content-preview">
            <div class="content-header">
              <h3>当前页面</h3>
            </div>
            <div class="content-body">
              <p>选中的菜单项：<code>{{ selectedKey }}</code></p>
              <p>折叠状态：<code>{{ collapsed ? '已折叠' : '已展开' }}</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 深色主题折叠 -->
    <div class="demo-card" style="margin-top: 24px;">
      <div class="demo-card-header">
        <span class="demo-card-title">深色主题折叠</span>
      </div>
      <div class="demo-card-body">
        <div class="demo-grid">
          <div class="menu-preview menu-preview-vertical menu-preview-dark" style="width: 64px;">
            <LMenu v-model:selected-key="selectedKey" theme="dark" collapsed expand-mode="popup">
              <LMenuItem item-key="home" label="首页">
                <template #icon>
                  <Home :size="18" />
                </template>
              </LMenuItem>
              <LMenuItem item-key="dashboard" label="仪表盘">
                <template #icon>
                  <BarChart3 :size="18" />
                </template>
              </LMenuItem>
              <LSubMenu item-key="content" label="内容管理">
                <template #icon>
                  <FolderOpen :size="18" />
                </template>
                <LMenuItem item-key="articles" label="文章管理" />
              </LSubMenu>
              <LMenuItem item-key="settings" label="设置">
                <template #icon>
                  <Settings :size="18" />
                </template>
              </LMenuItem>
            </LMenu>
          </div>
          <div class="menu-preview menu-preview-vertical menu-preview-dark" style="width: 240px;">
            <LMenu v-model:selected-key="selectedKey" theme="dark" expand-mode="inline">
              <LMenuItem item-key="home" label="首页">
                <template #icon>
                  <Home :size="18" />
                </template>
              </LMenuItem>
              <LMenuItem item-key="dashboard" label="仪表盘">
                <template #icon>
                  <BarChart3 :size="18" />
                </template>
              </LMenuItem>
              <LSubMenu item-key="content" label="内容管理">
                <template #icon>
                  <FolderOpen :size="18" />
                </template>
                <LMenuItem item-key="articles" label="文章管理" />
              </LSubMenu>
              <LMenuItem item-key="settings" label="设置">
                <template #icon>
                  <Settings :size="18" />
                </template>
              </LMenuItem>
            </LMenu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.collapse-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.collapse-btn:hover {
  background: var(--color-primary-hover);
}

.collapsed-demo-container {
  display: flex;
  gap: 24px;
}

.collapsed-preview {
  transition: width 0.3s ease;
  flex-shrink: 0;
}

.content-preview {
  flex: 1;
  background: var(--color-bg-secondary);
  border-radius: 8px;
  padding: 16px;
}

.content-header h3 {
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: 600;
}

.content-body {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.content-body p {
  margin: 8px 0;
}

.content-body code {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
}
</style>
