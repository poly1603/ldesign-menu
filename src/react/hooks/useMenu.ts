/**
 * React 菜单 Hook
 */

import { useEffect, useRef, useState } from 'react'
import { MenuManager } from '../../core/menu-manager'
import type { MenuConfig, MenuItem } from '../../types'

export interface UseMenuOptions extends MenuConfig {
  container?: HTMLElement | null
}

export function useMenu(options: UseMenuOptions = {}) {
  const menuRef = useRef<MenuManager | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [expandedKeys, setExpandedKeys] = useState<Set<string | number>>(
    new Set(options.defaultExpandedKeys || []),
  )
  const [activeKey, setActiveKey] = useState<string | number | null>(
    options.defaultActiveKey || null,
  )
  const [collapsed, setCollapsedState] = useState(options.collapsed || false)

  // 初始化菜单
  useEffect(() => {
    const container = options.container || containerRef.current
    if (!container) {
      return
    }

    const menu = new MenuManager({
      ...options,
      onSelect: (item, event) => {
        setActiveKey(item.id)
        options.onSelect?.(item, event)
      },
      onExpand: (item) => {
        setExpandedKeys(prev => new Set(prev).add(item.id))
        options.onExpand?.(item)
      },
      onCollapse: (item) => {
        setExpandedKeys((prev) => {
          const next = new Set(prev)
          next.delete(item.id)
          return next
        })
        options.onCollapse?.(item)
      },
      onCollapsedChange: (newCollapsed) => {
        setCollapsedState(newCollapsed)
        options.onCollapsedChange?.(newCollapsed)
      },
    })

    menu.mount(container)
    menuRef.current = menu

    return () => {
      menu.destroy()
    }
  }, [options.container])

  // 更新菜单项
  useEffect(() => {
    if (options.items && menuRef.current) {
      menuRef.current.setItems(options.items)
    }
  }, [options.items])

  // 更新收起状态
  useEffect(() => {
    if (options.collapsed !== undefined && menuRef.current) {
      menuRef.current.setCollapsed(options.collapsed)
    }
  }, [options.collapsed])

  // 展开菜单项
  const expand = (itemId: string | number) => {
    menuRef.current?.expand(itemId)
  }

  // 收起菜单项
  const collapse = (itemId: string | number) => {
    menuRef.current?.collapse(itemId)
  }

  // 切换展开状态
  const toggleExpand = (itemId: string | number) => {
    menuRef.current?.toggleExpand(itemId)
  }

  // 选中菜单项
  const selectItem = (itemId: string | number) => {
    menuRef.current?.selectItem(itemId)
  }

  // 设置收起状态
  const setCollapsed = (value: boolean) => {
    menuRef.current?.setCollapsed(value)
  }

  // 切换收起状态
  const toggleCollapsed = () => {
    menuRef.current?.toggleCollapsed()
  }

  // 更新菜单项
  const setItems = (items: MenuItem[]) => {
    menuRef.current?.setItems(items)
  }

  // 更新配置
  const updateConfig = (config: Partial<MenuConfig>) => {
    menuRef.current?.updateConfig(config)
  }

  return {
    containerRef,
    menuRef,
    expandedKeys,
    activeKey,
    collapsed,
    expand,
    collapse,
    toggleExpand,
    selectItem,
    setCollapsed,
    toggleCollapsed,
    setItems,
    updateConfig,
  }
}


