<script setup lang="ts">
/**
 * 折叠模式演示
 * 展示菜单的折叠功能、Tooltip 提示和弹出式子菜单
 */
import { ref } from 'vue'
import { Home, Users, Settings, FileText, Folder, Database, BarChart, Bell } from 'lucide-vue-next'
import { LMenu, LMenuItem, LSubMenu } from '../src'

const selectedKey = ref('home')
const collapsed = ref(false)
const defaultOpenKeys = ['users', 'settings']

/**
 * 切换折叠状态
 */
function toggleCollapse() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <div class="demo-container">
    <h2>折叠模式演示</h2>
    
    <div class="demo-controls">
      <button @click="toggleCollapse">
        {{ collapsed ? '展开菜单' : '折叠菜单' }}
      </button>
      <span class="demo-status">
        当前状态: {{ collapsed ? '折叠' : '展开' }}
      </span>
    </div>

    <div class="demo-content">
      <!-- 垂直菜单 - 折叠模式 -->
      <div class="demo-section">
        <h3>垂直菜单（支持折叠）</h3>
        <LMenu
          v-model:selectedKey="selectedKey"
          v-model:collapsed="collapsed"
          :default-open-keys="defaultOpenKeys"
          mode="vertical"
          theme="light"
          :collapsed-width="64"
          :expanded-width="240"
        >
          <!-- 一级菜单项 - 折叠时显示 Tooltip -->
          <LMenuItem itemKey="home" label="首页" :icon="Home" />
          <LMenuItem itemKey="dashboard" label="仪表盘" :icon="BarChart" />
          
          <!-- 子菜单 - 折叠时弹出显示 -->
          <LSubMenu itemKey="users" label="用户管理" :icon="Users">
            <LMenuItem itemKey="user-list" label="用户列表" :icon="FileText" />
            <LMenuItem itemKey="user-roles" label="角色管理" :icon="Folder" />
            
            <!-- 多级子菜单 - 级联弹出 -->
            <LSubMenu itemKey="user-settings" label="用户设置" :icon="Settings">
              <LMenuItem itemKey="user-profile" label="个人资料" />
              <LMenuItem itemKey="user-security" label="安全设置" />
              <LMenuItem itemKey="user-privacy" label="隐私设置" />
            </LSubMenu>
          </LSubMenu>

          <LSubMenu itemKey="settings" label="系统设置" :icon="Settings">
            <LMenuItem itemKey="general" label="常规设置" />
            <LMenuItem itemKey="database" label="数据库配置" :icon="Database" />
            <LMenuItem itemKey="notifications" label="通知设置" :icon="Bell" />
          </LSubMenu>

          <LMenuItem itemKey="reports" label="报表中心" :icon="FileText" />
        </LMenu>
      </div>

      <!-- 深色主题 -->
      <div class="demo-section">
        <h3>深色主题（折叠模式）</h3>
        <LMenu
          v-model:selectedKey="selectedKey"
          v-model:collapsed="collapsed"
          mode="vertical"
          theme="dark"
          :collapsed-width="64"
          :expanded-width="240"
        >
          <LMenuItem itemKey="home" label="首页" :icon="Home" />
          <LMenuItem itemKey="dashboard" label="仪表盘" :icon="BarChart" />
          
          <LSubMenu itemKey="users" label="用户管理" :icon="Users">
            <LMenuItem itemKey="user-list" label="用户列表" :icon="FileText" />
            <LMenuItem itemKey="user-roles" label="角色管理" :icon="Folder" />
          </LSubMenu>

          <LSubMenu itemKey="settings" label="系统设置" :icon="Settings">
            <LMenuItem itemKey="general" label="常规设置" />
            <LMenuItem itemKey="database" label="数据库配置" :icon="Database" />
          </LSubMenu>
        </LMenu>
      </div>
    </div>

    <!-- 说明文档 -->
    <div class="demo-description">
      <h3>功能说明</h3>
      <ul>
        <li><strong>折叠模式</strong>：点击按钮切换菜单的折叠/展开状态</li>
        <li><strong>图标居中</strong>：折叠时只显示图标，图标水平居中</li>
        <li><strong>Tooltip 提示</strong>：鼠标悬停在折叠的菜单项上时，右侧显示完整文本</li>
        <li><strong>弹出式子菜单</strong>：折叠时，子菜单以浮层形式从右侧弹出</li>
        <li><strong>多级级联</strong>：支持多层嵌套的子菜单，每一层向右侧弹出</li>
        <li><strong>默认展开</strong>：通过 <code>defaultOpenKeys</code> 配置默认展开的子菜单</li>
        <li><strong>流畅动画</strong>：所有交互都有平滑的过渡动画</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.demo-controls button {
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.demo-controls button:hover {
  background: #40a9ff;
}

.demo-status {
  font-size: 14px;
  color: #666;
}

.demo-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.demo-section {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.demo-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.demo-description {
  background: #f0f9ff;
  border: 1px solid #bae7ff;
  border-radius: 8px;
  padding: 16px;
}

.demo-description h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #0050b3;
}

.demo-description ul {
  margin: 0;
  padding-left: 20px;
}

.demo-description li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: #333;
}

.demo-description code {
  background: #e6f7ff;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #0050b3;
}
</style>

