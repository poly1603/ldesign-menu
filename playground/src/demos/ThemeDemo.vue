<script setup lang="ts">
import { ref } from 'vue'
import { LMenu, LMenuItem, LSubMenu } from '@ldesign/menu-vue'
import { Home, LayoutDashboard, Settings, Users, FileText, FolderOpen } from 'lucide-vue-next'

const selectedKey = ref('home')
const openKeys = ref(['content'])
</script>

<template>
  <div class="demo-section">
    <h2 class="demo-section-title">主题切换</h2>
    <p class="demo-section-desc">
      菜单支持浅色（light）和深色（dark）两种主题，与 Ant Design 配色一致。
    </p>

    <div class="demo-grid">
      <!-- 浅色主题 -->
      <div class="demo-card">
        <div class="demo-card-header">
          <span class="demo-card-title">浅色主题 (Light)</span>
        </div>
        <div class="demo-card-body">
          <div class="menu-preview menu-preview-vertical">
            <LMenu v-model:selected-key="selectedKey" v-model:open-keys="openKeys" theme="light">
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
              </LSubMenu>

              <LMenuItem item-key="users" label="用户管理">
                <template #icon>
                  <Users :size="18" />
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
      </div>

      <!-- 深色主题 -->
      <div class="demo-card">
        <div class="demo-card-header">
          <span class="demo-card-title">深色主题 (Dark)</span>
        </div>
        <div class="demo-card-body">
          <div class="menu-preview menu-preview-vertical menu-preview-dark">
            <LMenu v-model:selected-key="selectedKey" v-model:open-keys="openKeys" theme="dark">
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
              </LSubMenu>

              <LMenuItem item-key="users" label="用户管理">
                <template #icon>
                  <Users :size="18" />
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
      </div>
    </div>

    <!-- 主题配色说明 -->
    <div class="demo-card" style="margin-top: 24px;">
      <div class="demo-card-header">
        <span class="demo-card-title">配色说明</span>
      </div>
      <div class="demo-card-body">
        <div class="color-palette">
          <div class="color-group">
            <h4>浅色主题</h4>
            <div class="color-item">
              <span class="color-box" style="background: #ffffff;"></span>
              <span>背景色</span>
            </div>
            <div class="color-item">
              <span class="color-box" style="background: #1677ff;"></span>
              <span>主色调</span>
            </div>
            <div class="color-item">
              <span class="color-box" style="background: #e6f4ff;"></span>
              <span>选中背景</span>
            </div>
            <div class="color-item">
              <span class="color-box" style="background: rgba(0,0,0,0.88);"></span>
              <span>文字颜色</span>
            </div>
          </div>
          <div class="color-group">
            <h4>深色主题</h4>
            <div class="color-item">
              <span class="color-box" style="background: #001529;"></span>
              <span>背景色</span>
            </div>
            <div class="color-item">
              <span class="color-box" style="background: #1677ff;"></span>
              <span>主色调</span>
            </div>
            <div class="color-item">
              <span class="color-box" style="background: #1677ff;"></span>
              <span>选中背景</span>
            </div>
            <div class="color-item">
              <span class="color-box" style="background: rgba(255,255,255,0.85);"></span>
              <span>文字颜色</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-palette {
  display: flex;
  gap: 48px;
}

.color-group h4 {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
}

.color-box {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}
</style>
