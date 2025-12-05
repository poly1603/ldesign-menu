<script setup lang="ts">
/**
 * Menu 组件 Lucide 图标示例
 * 展示如何使用 lucide-vue-next 图标库
 */
import { ref } from 'vue'
import { 
  Home, 
  Settings, 
  Users, 
  FileText, 
  Folder, 
  Database,
  BarChart,
  Bell,
  Mail,
  Calendar,
  Shield,
  Package,
} from 'lucide-vue-next'
import { LMenu, LMenuItem, LSubMenu } from '../src'
import '../src/styles/index.css'

const selectedKey = ref('home')
const collapsed = ref(false)

function toggleCollapse() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <div class="demo-container">
    <h1>Menu 组件 - Lucide 图标示例</h1>
    
    <div class="demo-controls">
      <button @click="toggleCollapse">
        {{ collapsed ? '展开菜单' : '折叠菜单' }}
      </button>
    </div>

    <div class="demo-content">
      <!-- 垂直菜单 -->
      <div class="demo-section">
        <h2>垂直菜单（使用 Lucide 图标）</h2>
        <LMenu
          v-model:selectedKey="selectedKey"
          v-model:collapsed="collapsed"
          mode="vertical"
          theme="light"
          :indent="16"
          :collapsed-width="64"
          :expanded-width="240"
        >
          <LMenuItem itemKey="home" label="首页" :icon="Home" />
          <LMenuItem itemKey="dashboard" label="仪表盘" :icon="BarChart" />
          
          <LSubMenu itemKey="users" label="用户管理" :icon="Users">
            <LMenuItem itemKey="user-list" label="用户列表" :icon="FileText" />
            <LMenuItem itemKey="user-roles" label="角色管理" :icon="Shield" />
          </LSubMenu>
          
          <LSubMenu itemKey="content" label="内容管理" :icon="Folder">
            <LMenuItem itemKey="articles" label="文章管理" :icon="FileText" />
            <LMenuItem itemKey="media" label="媒体库" :icon="Package" />
            
            <LSubMenu itemKey="categories" label="分类管理" :icon="Database">
              <LMenuItem itemKey="cat-list" label="分类列表" />
              <LMenuItem itemKey="cat-tags" label="标签管理" />
            </LSubMenu>
          </LSubMenu>
          
          <LMenuItem itemKey="notifications" label="通知中心" :icon="Bell" />
          <LMenuItem itemKey="messages" label="消息" :icon="Mail" />
          <LMenuItem itemKey="calendar" label="日历" :icon="Calendar" />
          <LMenuItem itemKey="settings" label="设置" :icon="Settings" />
        </LMenu>
      </div>

      <!-- 水平菜单 -->
      <div class="demo-section">
        <h2>水平菜单（使用 Lucide 图标）</h2>
        <LMenu
          v-model:selectedKey="selectedKey"
          mode="horizontal"
          theme="light"
        >
          <LMenuItem itemKey="home" label="首页" :icon="Home" />
          <LMenuItem itemKey="dashboard" label="仪表盘" :icon="BarChart" />
          
          <LSubMenu itemKey="users" label="用户" :icon="Users">
            <LMenuItem itemKey="user-list" label="用户列表" :icon="FileText" />
            <LMenuItem itemKey="user-roles" label="角色管理" :icon="Shield" />
          </LSubMenu>
          
          <LMenuItem itemKey="settings" label="设置" :icon="Settings" />
        </LMenu>
      </div>

      <!-- 深色主题 -->
      <div class="demo-section" data-theme-mode="dark">
        <h2>深色主题（使用 Lucide 图标）</h2>
        <LMenu
          v-model:selectedKey="selectedKey"
          mode="vertical"
          theme="dark"
          :indent="16"
        >
          <LMenuItem itemKey="home" label="首页" :icon="Home" />
          <LMenuItem itemKey="dashboard" label="仪表盘" :icon="BarChart" />
          
          <LSubMenu itemKey="users" label="用户管理" :icon="Users">
            <LMenuItem itemKey="user-list" label="用户列表" :icon="FileText" />
            <LMenuItem itemKey="user-roles" label="角色管理" :icon="Shield" />
          </LSubMenu>
          
          <LMenuItem itemKey="settings" label="设置" :icon="Settings" />
        </LMenu>
      </div>
    </div>

    <div class="demo-info">
      <h3>当前选中: {{ selectedKey }}</h3>
      <h3>菜单状态: {{ collapsed ? '折叠' : '展开' }}</h3>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-controls {
  margin: 16px 0;
}

.demo-controls button {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.demo-controls button:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.demo-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 24px 0;
}

.demo-section {
  padding: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
}

.demo-section[data-theme-mode="dark"] {
  background: #1f1f1f;
  color: white;
}

.demo-info {
  margin-top: 24px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>

