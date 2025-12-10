import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/sidebar',
  },
  {
    path: '/sidebar',
    name: 'sidebar',
    component: () => import('../demos/SidebarDemo.vue'),
    meta: { title: '侧边栏菜单', icon: 'LayoutDashboard' },
  },
  {
    path: '/horizontal',
    name: 'horizontal',
    component: () => import('../demos/HorizontalDemo.vue'),
    meta: { title: '水平菜单', icon: 'Layers' },
  },
  {
    path: '/theme',
    name: 'theme',
    component: () => import('../demos/ThemeDemo.vue'),
    meta: { title: '主题切换', icon: 'Palette' },
  },
  {
    path: '/size',
    name: 'size',
    component: () => import('../demos/SizeDemo.vue'),
    meta: { title: '尺寸变体', icon: 'Settings' },
  },
  {
    path: '/collapsed',
    name: 'collapsed',
    component: () => import('../demos/CollapsedDemo.vue'),
    meta: { title: '折叠模式', icon: 'PanelLeftClose' },
  },
  {
    path: '/native',
    name: 'native',
    component: () => import('../demos/NativeDemo.vue'),
    meta: { title: '原生渲染', icon: 'Code' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
