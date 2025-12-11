<script setup lang="ts">
import { ref } from 'vue'
import { LMenu, LMenuItem, LSubMenu } from '@ldesign/menu-vue'
import {
  Home,
  Package,
  Cloud,
  Database,
  Shield,
  Mail,
  Settings,
  Users,
  FileText,
  BarChart3,
  ShoppingCart,
  CreditCard,
  HelpCircle,
  Bell,
  Layers,
  Globe,
  Smartphone,
  Monitor,
} from 'lucide-vue-next'

const selectedKey = ref('home')
</script>

<template>
  <div class="demo-section">
    <h2 class="demo-section-title">水平菜单</h2>
    <p class="demo-section-desc">
      水平模式的菜单，适用于顶部导航栏。子菜单以弹出方式展示。
    </p>

    <!-- 基础水平菜单 -->
    <div class="demo-card">
      <div class="demo-card-header">
        <span class="demo-card-title">基础水平导航</span>
      </div>
      <div class="demo-card-body">
        <div class="menu-preview menu-preview-horizontal">
          <LMenu v-model:selected-key="selectedKey" mode="horizontal" expand-mode="popup" trigger="hover">
            <LMenuItem item-key="home" label="首页">
              <template #icon>
                <Home :size="18" />
              </template>
            </LMenuItem>

            <LSubMenu item-key="products" label="产品">
              <template #icon>
                <Package :size="18" />
              </template>
              <LMenuItem item-key="product-list" label="产品列表" />
              <LMenuItem item-key="product-category" label="产品分类" />
              <LMenuItem item-key="product-review" label="产品评价" />
            </LSubMenu>

            <LSubMenu item-key="services" label="服务">
              <LMenuItem item-key="cloud" label="云计算">
                <template #icon>
                  <Cloud :size="18" />
                </template>
              </LMenuItem>
              <LMenuItem item-key="database" label="数据库">
                <template #icon>
                  <Database :size="18" />
                </template>
              </LMenuItem>
              <LMenuItem item-key="security" label="安全服务">
                <template #icon>
                  <Shield :size="18" />
                </template>
              </LMenuItem>
            </LSubMenu>

            <LMenuItem item-key="about" label="关于我们" />
            <LMenuItem item-key="contact" label="联系我们">
              <template #icon>
                <Mail :size="18" />
              </template>
            </LMenuItem>
          </LMenu>
        </div>
      </div>
    </div>

    <!-- 多级子菜单 -->
    <div class="demo-card" style="margin-top: 24px;">
      <div class="demo-card-header">
        <span class="demo-card-title">多级子菜单（二级、三级）</span>
      </div>
      <div class="demo-card-body">
        <div class="menu-preview menu-preview-horizontal">
          <LMenu v-model:selected-key="selectedKey" mode="horizontal" expand-mode="popup" trigger="hover">
            <LMenuItem item-key="home2" label="首页">
              <template #icon>
                <Home :size="18" />
              </template>
            </LMenuItem>

            <!-- 二级子菜单 -->
            <LSubMenu item-key="products2" label="产品中心">
              <template #icon>
                <Package :size="18" />
              </template>

              <!-- 嵌套三级菜单 -->
              <LSubMenu item-key="software" label="软件产品">
                <template #icon>
                  <Monitor :size="18" />
                </template>
                <LMenuItem item-key="erp" label="ERP系统" />
                <LMenuItem item-key="crm" label="CRM系统" />
                <LMenuItem item-key="oa" label="OA办公" />
              </LSubMenu>

              <LSubMenu item-key="hardware" label="硬件产品">
                <template #icon>
                  <Smartphone :size="18" />
                </template>
                <LMenuItem item-key="server" label="服务器" />
                <LMenuItem item-key="storage" label="存储设备" />
                <LMenuItem item-key="network" label="网络设备" />
              </LSubMenu>

              <LMenuItem item-key="solutions" label="解决方案">
                <template #icon>
                  <Layers :size="18" />
                </template>
              </LMenuItem>
            </LSubMenu>

            <!-- 另一个二级子菜单 -->
            <LSubMenu item-key="services2" label="服务支持">
              <LSubMenu item-key="tech-support" label="技术支持">
                <LMenuItem item-key="online-support" label="在线支持" />
                <LMenuItem item-key="phone-support" label="电话支持" />
                <LMenuItem item-key="onsite-support" label="现场支持" />
              </LSubMenu>

              <LSubMenu item-key="training" label="培训服务">
                <LMenuItem item-key="online-training" label="线上培训" />
                <LMenuItem item-key="offline-training" label="线下培训" />
              </LSubMenu>

              <LMenuItem item-key="consulting" label="咨询服务" />
            </LSubMenu>

            <LMenuItem item-key="pricing" label="价格" />
            <LMenuItem item-key="docs" label="文档">
              <template #icon>
                <FileText :size="18" />
              </template>
            </LMenuItem>
          </LMenu>
        </div>
      </div>
    </div>

    <!-- 多个一级菜单项 -->
    <div class="demo-card" style="margin-top: 24px;">
      <div class="demo-card-header">
        <span class="demo-card-title">多个一级菜单项</span>
      </div>
      <div class="demo-card-body">
        <div class="menu-preview menu-preview-horizontal" style="overflow: visible;">
          <LMenu v-model:selected-key="selectedKey" mode="horizontal" expand-mode="popup" trigger="hover">
            <LMenuItem item-key="h-home" label="首页">
              <template #icon>
                <Home :size="18" />
              </template>
            </LMenuItem>
            <LMenuItem item-key="h-dashboard" label="仪表盘">
              <template #icon>
                <BarChart3 :size="18" />
              </template>
            </LMenuItem>
            <LSubMenu item-key="h-products" label="产品">
              <template #icon>
                <Package :size="18" />
              </template>
              <LMenuItem item-key="h-product-list" label="产品列表" />
              <LMenuItem item-key="h-product-add" label="添加产品" />
            </LSubMenu>
            <LSubMenu item-key="h-orders" label="订单">
              <template #icon>
                <ShoppingCart :size="18" />
              </template>
              <LMenuItem item-key="h-order-list" label="订单列表" />
              <LMenuItem item-key="h-order-pending" label="待处理订单" />
            </LSubMenu>
            <LMenuItem item-key="h-users" label="用户">
              <template #icon>
                <Users :size="18" />
              </template>
            </LMenuItem>
            <LMenuItem item-key="h-finance" label="财务">
              <template #icon>
                <CreditCard :size="18" />
              </template>
            </LMenuItem>
            <LMenuItem item-key="h-reports" label="报表">
              <template #icon>
                <FileText :size="18" />
              </template>
            </LMenuItem>
            <LMenuItem item-key="h-notifications" label="通知">
              <template #icon>
                <Bell :size="18" />
              </template>
            </LMenuItem>
            <LSubMenu item-key="h-settings" label="设置">
              <template #icon>
                <Settings :size="18" />
              </template>
              <LMenuItem item-key="h-general" label="通用设置" />
              <LMenuItem item-key="h-security" label="安全设置" />
              <LMenuItem item-key="h-integrations" label="集成设置" />
            </LSubMenu>
            <LMenuItem item-key="h-help" label="帮助">
              <template #icon>
                <HelpCircle :size="18" />
              </template>
            </LMenuItem>
            <LMenuItem item-key="h-analytics" label="分析">
              <template #icon>
                <BarChart3 :size="18" />
              </template>
            </LMenuItem>
            <LMenuItem item-key="h-messages" label="消息">
              <template #icon>
                <Mail :size="18" />
              </template>
            </LMenuItem>
            <LSubMenu item-key="h-tools" label="工具">
              <template #icon>
                <Layers :size="18" />
              </template>
              <LMenuItem item-key="h-tool1" label="代码生成" />
              <LMenuItem item-key="h-tool2" label="数据导入" />
              <LMenuItem item-key="h-tool3" label="批量处理" />
            </LSubMenu>
            <LMenuItem item-key="h-calendar" label="日历">
              <template #icon>
                <Database :size="18" />
              </template>
            </LMenuItem>
            <LMenuItem item-key="h-team" label="团队">
              <template #icon>
                <Users :size="18" />
              </template>
            </LMenuItem>
            <LMenuItem item-key="h-cloud" label="云服务">
              <template #icon>
                <Cloud :size="18" />
              </template>
            </LMenuItem>
            <LMenuItem item-key="h-security" label="安全">
              <template #icon>
                <Shield :size="18" />
              </template>
            </LMenuItem>
          </LMenu>
        </div>
        <p class="demo-hint">当菜单项较多时，容器可以设置 overflow-x: auto 来支持横向滚动</p>
      </div>
    </div>

    <!-- 深色主题 -->
    <div class="demo-card" style="margin-top: 24px;">
      <div class="demo-card-header">
        <span class="demo-card-title">深色主题 + 多级菜单</span>
      </div>
      <div class="demo-card-body">
        <div class="menu-preview menu-preview-horizontal menu-preview-dark">
          <LMenu v-model:selected-key="selectedKey" mode="horizontal" expand-mode="popup" trigger="hover" theme="dark">
            <LMenuItem item-key="d-home" label="首页">
              <template #icon>
                <Home :size="18" />
              </template>
            </LMenuItem>

            <LSubMenu item-key="d-products" label="产品">
              <template #icon>
                <Package :size="18" />
              </template>

              <LSubMenu item-key="d-cloud" label="云服务">
                <template #icon>
                  <Cloud :size="18" />
                </template>
                <LMenuItem item-key="d-compute" label="云计算" />
                <LMenuItem item-key="d-storage" label="云存储" />
                <LMenuItem item-key="d-cdn" label="CDN加速" />
              </LSubMenu>

              <LSubMenu item-key="d-data" label="数据服务">
                <template #icon>
                  <Database :size="18" />
                </template>
                <LMenuItem item-key="d-mysql" label="MySQL" />
                <LMenuItem item-key="d-redis" label="Redis" />
                <LMenuItem item-key="d-mongodb" label="MongoDB" />
              </LSubMenu>

              <LMenuItem item-key="d-ai" label="AI服务" />
            </LSubMenu>

            <LSubMenu item-key="d-solutions" label="解决方案">
              <template #icon>
                <Globe :size="18" />
              </template>
              <LMenuItem item-key="d-enterprise" label="企业版" />
              <LMenuItem item-key="d-startup" label="创业版" />
              <LMenuItem item-key="d-education" label="教育版" />
            </LSubMenu>

            <LMenuItem item-key="d-pricing" label="价格" />
            <LMenuItem item-key="d-docs" label="文档">
              <template #icon>
                <FileText :size="18" />
              </template>
            </LMenuItem>
            <LMenuItem item-key="d-support" label="支持">
              <template #icon>
                <HelpCircle :size="18" />
              </template>
            </LMenuItem>
          </LMenu>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-hint {
  margin-top: 12px;
  font-size: 13px;
  color: var(--color-text-secondary);
}
</style>
