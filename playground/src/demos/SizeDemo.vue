<script setup lang="ts">
import { ref } from 'vue'
import { LMenu, LMenuItem, LSubMenu } from '@ldesign/menu-vue'
import { Home, Settings, Users, FolderOpen, FileText } from 'lucide-vue-next'

const selectedKey = ref('home')
</script>

<template>
  <div class="demo-section">
    <h2 class="demo-section-title">菜单尺寸</h2>
    <p class="demo-section-desc">
      菜单支持三种尺寸：small、middle（默认）、large，适应不同的界面场景。
    </p>

    <div class="demo-grid demo-grid-3">
      <!-- 小尺寸 -->
      <div class="demo-card">
        <div class="demo-card-header">
          <span class="demo-card-title">小尺寸 (Small)</span>
        </div>
        <div class="demo-card-body">
          <div class="menu-preview menu-preview-vertical">
            <LMenu v-model:selected-key="selectedKey" size="small">
              <LMenuItem item-key="home" label="首页">
                <template #icon>
                  <Home :size="14" />
                </template>
              </LMenuItem>
              <LSubMenu item-key="content" label="内容管理">
                <template #icon>
                  <FolderOpen :size="14" />
                </template>
                <LMenuItem item-key="articles" label="文章管理">
                  <template #icon>
                    <FileText :size="14" />
                  </template>
                </LMenuItem>
              </LSubMenu>
              <LMenuItem item-key="users" label="用户管理">
                <template #icon>
                  <Users :size="14" />
                </template>
              </LMenuItem>
              <LMenuItem item-key="settings" label="系统设置">
                <template #icon>
                  <Settings :size="14" />
                </template>
              </LMenuItem>
            </LMenu>
          </div>
        </div>
      </div>

      <!-- 中尺寸（默认） -->
      <div class="demo-card">
        <div class="demo-card-header">
          <span class="demo-card-title">中尺寸 (Middle)</span>
          <span class="demo-tag">默认</span>
        </div>
        <div class="demo-card-body">
          <div class="menu-preview menu-preview-vertical">
            <LMenu v-model:selected-key="selectedKey" size="middle">
              <LMenuItem item-key="home" label="首页">
                <template #icon>
                  <Home :size="16" />
                </template>
              </LMenuItem>
              <LSubMenu item-key="content" label="内容管理">
                <template #icon>
                  <FolderOpen :size="16" />
                </template>
                <LMenuItem item-key="articles" label="文章管理">
                  <template #icon>
                    <FileText :size="16" />
                  </template>
                </LMenuItem>
              </LSubMenu>
              <LMenuItem item-key="users" label="用户管理">
                <template #icon>
                  <Users :size="16" />
                </template>
              </LMenuItem>
              <LMenuItem item-key="settings" label="系统设置">
                <template #icon>
                  <Settings :size="16" />
                </template>
              </LMenuItem>
            </LMenu>
          </div>
        </div>
      </div>

      <!-- 大尺寸 -->
      <div class="demo-card">
        <div class="demo-card-header">
          <span class="demo-card-title">大尺寸 (Large)</span>
        </div>
        <div class="demo-card-body">
          <div class="menu-preview menu-preview-vertical">
            <LMenu v-model:selected-key="selectedKey" size="large">
              <LMenuItem item-key="home" label="首页">
                <template #icon>
                  <Home :size="18" />
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

    <!-- 尺寸参数说明 -->
    <div class="demo-card" style="margin-top: 24px;">
      <div class="demo-card-header">
        <span class="demo-card-title">尺寸参数</span>
      </div>
      <div class="demo-card-body">
        <table class="param-table">
          <thead>
            <tr>
              <th>尺寸</th>
              <th>行高</th>
              <th>字号</th>
              <th>图标大小</th>
              <th>适用场景</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>small</code></td>
              <td>32px</td>
              <td>13px</td>
              <td>14px</td>
              <td>紧凑型界面、工具栏</td>
            </tr>
            <tr>
              <td><code>middle</code></td>
              <td>40px</td>
              <td>14px</td>
              <td>16px</td>
              <td>常规界面（默认）</td>
            </tr>
            <tr>
              <td><code>large</code></td>
              <td>48px</td>
              <td>16px</td>
              <td>18px</td>
              <td>宽松型界面、触屏设备</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.param-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.param-table th,
.param-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.param-table th {
  background: var(--color-bg-secondary);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.param-table td code {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
}

.demo-tag {
  background: #e6f4ff;
  color: #1677ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
}
</style>
