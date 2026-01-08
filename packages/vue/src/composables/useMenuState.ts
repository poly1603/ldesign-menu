/**
 * 菜单状态管理组合式函数
 * @module composables/useMenuState
 */

import type { Ref } from 'vue'
import type {
  MenuConfig,
  MenuEventMap,
  MenuFilterConfig,
  MenuItem,
  MenuState,
} from '../types'
import { computed, ref, watch } from 'vue'
import { MenuManager } from '../types'

/**
 * useMenuState 参数
 */
export interface UseMenuStateOptions {
  /**
   * 菜单数据
   */
  items: MenuItem[] | Ref<MenuItem[]>

  /**
   * 菜单配置
   */
  config?: Partial<MenuConfig>

  /**
   * 选中的菜单项 key（受控）
   */
  selectedKey?: string | Ref<string | undefined>

  /**
   * 展开的菜单项 key 列表（受控）
   */
  openKeys?: string[] | Ref<string[]>

  /**
   * 默认选中的菜单项 key
   */
  defaultSelectedKey?: string

  /**
   * 默认展开的菜单项 key 列表
   */
  defaultOpenKeys?: string[]

  /**
   * 是否折叠
   */
  collapsed?: boolean | Ref<boolean>

  /**
   * 手风琴模式（受控）
   */
  accordion?: boolean | Ref<boolean>

  /**
   * 权限过滤配置
   */
  filterConfig?: MenuFilterConfig | Ref<MenuFilterConfig>
}

/**
 * useMenuState 返回值
 */
export interface UseMenuStateReturn {
  /**
   * 菜单管理器
   */
  manager: MenuManager

  /**
   * 过滤后的菜单项
   */
  items: Ref<MenuItem[]>

  /**
   * 当前状态
   */
  state: Ref<MenuState>

  /**
   * 选中的菜单项 key
   */
  selectedKey: Ref<string | undefined>

  /**
   * 展开的菜单项 key 列表
   */
  openKeys: Ref<string[]>

  /**
   * 是否折叠
   */
  collapsed: Ref<boolean>

  /**
   * 选中菜单项
   */
  select: (key: string, event?: Event) => void

  /**
   * 切换展开状态
   */
  toggleOpen: (key: string) => void

  /**
   * 展开子菜单
   */
  open: (key: string) => void

  /**
   * 收起子菜单
   */
  close: (key: string) => void

  /**
   * 设置展开的菜单项
   */
  setOpenKeys: (keys: string[]) => void

  /**
   * 展开所有
   */
  openAll: () => void

  /**
   * 收起所有
   */
  closeAll: () => void

  /**
   * 切换折叠状态
   */
  toggleCollapsed: () => void

  /**
   * 设置悬停的菜单项
   */
  setHoverKey: (key: string | null) => void

  /**
   * 订阅事件
   */
  on: <K extends keyof MenuEventMap>(
    event: K,
    handler: (params: MenuEventMap[K]) => void
  ) => () => void
}

/**
 * 菜单状态管理
 * 提供菜单的响应式状态管理功能
 * @param options - 配置选项
 * @returns 菜单状态和操作方法
 */
export function useMenuState(options: UseMenuStateOptions): UseMenuStateReturn {
  const {
    items: itemsOption,
    config = {},
    selectedKey: selectedKeyOption,
    openKeys: openKeysOption,
    defaultSelectedKey,
    defaultOpenKeys,
    collapsed: collapsedOption,
    accordion: accordionOption,
    filterConfig: filterConfigOption,
  } = options

  // 解析响应式参数
  const itemsRef = computed(() =>
    Array.isArray(itemsOption) ? itemsOption : itemsOption.value,
  )

  const filterConfigRef = computed(() => {
    if (!filterConfigOption) return {}
    return 'value' in filterConfigOption ? filterConfigOption.value : filterConfigOption
  })

  // 创建管理器
  const manager = new MenuManager({
    items: itemsRef.value,
    ...config,
    defaultSelectedKey,
    defaultOpenKeys,
    filterConfig: filterConfigRef.value,
  })

  // 响应式状态
  const state = ref<MenuState>(manager.getState())
  const items = ref<MenuItem[]>(manager.getItems()) as Ref<MenuItem[]>
  const selectedKey = ref<string | undefined>(manager.getSelectedKey())
  const openKeys = ref<string[]>(manager.getOpenKeys())
  const collapsed = ref(config.collapsed ?? false)

  // 监听数据变化 - 添加 immediate: true 确保初始值被处理
  watch(itemsRef, (newItems) => {
    manager.updateItems(newItems)
    items.value = manager.getItems()
    state.value = manager.getState()
    selectedKey.value = manager.getSelectedKey()
    openKeys.value = manager.getOpenKeys()
  }, { immediate: true })

  // 监听过滤配置变化
  watch(filterConfigRef, (newConfig) => {
    manager.updateFilterConfig(newConfig)
    items.value = manager.getItems()
  })

  // 监听受控的 selectedKey
  if (selectedKeyOption !== undefined) {
    const selectedKeyRef = computed(() =>
      typeof selectedKeyOption === 'string' ? selectedKeyOption : selectedKeyOption.value,
    )

    // 立即同步初始值
    if (selectedKeyRef.value !== undefined) {
      manager.select(selectedKeyRef.value)
      syncState()
    }

    watch(selectedKeyRef, (newKey) => {
      if (newKey !== undefined && newKey !== selectedKey.value) {
        manager.select(newKey)
        syncState()
      }
    })
  }

  // 监听受控的 openKeys
  if (openKeysOption !== undefined) {
    const openKeysRef = computed(() =>
      Array.isArray(openKeysOption) ? openKeysOption : openKeysOption.value,
    )

    // 立即同步初始值
    if (openKeysRef.value && openKeysRef.value.length > 0) {
      manager.setOpenKeys(openKeysRef.value)
      syncState()
    }

    watch(openKeysRef, (newKeys) => {
      manager.setOpenKeys(newKeys)
      syncState()
    })
  }

  // 监听受控的 collapsed
  if (collapsedOption !== undefined) {
    const collapsedRef = computed(() =>
      typeof collapsedOption === 'boolean' ? collapsedOption : collapsedOption.value,
    )
    watch(collapsedRef, (newValue) => {
      collapsed.value = newValue
      manager.setCollapsed(newValue)
    })
  }

  // 监听受控的 accordion
  if (accordionOption !== undefined) {
    const accordionRef = computed(() =>
      typeof accordionOption === 'boolean' ? accordionOption : accordionOption.value,
    )

    // 立即同步初始值
    if (accordionRef.value !== undefined) {
      manager.updateConfig({ accordion: accordionRef.value })
    }

    watch(accordionRef, (newValue) => {
      manager.updateConfig({ accordion: newValue })
    })
  }

  // 同步状态
  function syncState(): void {
    state.value = manager.getState()
    selectedKey.value = manager.getSelectedKey()
    openKeys.value = manager.getOpenKeys()
  }

  // 操作方法
  function select(key: string, event?: Event): void {
    manager.select(key, event)
    syncState()
  }

  function toggleOpen(key: string): void {
    manager.toggleOpen(key)
    syncState()
  }

  function open(key: string): void {
    manager.open(key)
    syncState()
  }

  function close(key: string): void {
    manager.close(key)
    syncState()
  }

  function setOpenKeys(keys: string[]): void {
    manager.setOpenKeys(keys)
    syncState()
  }

  function openAll(): void {
    manager.openAll()
    syncState()
  }

  function closeAll(): void {
    manager.closeAll()
    syncState()
  }

  function toggleCollapsed(): void {
    collapsed.value = !collapsed.value
    manager.setCollapsed(collapsed.value)
  }

  function setHoverKey(key: string | null): void {
    manager.setHoverKey(key)
    state.value = manager.getState()
  }

  return {
    manager,
    items,
    state,
    selectedKey,
    openKeys,
    collapsed,
    select,
    toggleOpen,
    open,
    close,
    setOpenKeys,
    openAll,
    closeAll,
    toggleCollapsed,
    setHoverKey,
    on: manager.on.bind(manager),
  }
}

