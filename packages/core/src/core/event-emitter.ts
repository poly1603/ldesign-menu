/**
 * 事件发射器模块
 * 
 * @description
 * 提供轻量级的事件发布/订阅机制，用于组件间通信和状态变化通知。
 * 支持事件监听、一次性事件、事件移除等完整功能。
 */

/**
 * 事件处理函数类型
 */
type EventHandler = (...args: any[]) => void

/**
 * 事件发射器类
 * 
 * @description
 * 实现发布/订阅模式的事件管理器，用于菜单组件的事件通信。
 * 提供了完整的事件生命周期管理功能。
 * 
 * @example
 * ```ts
 * const emitter = new EventEmitter()
 * 
 * // 监听事件
 * const unsubscribe = emitter.on('select', (data) => {
 *   console.log('菜单项被选中:', data)
 * })
 * 
 * // 触发事件
 * emitter.emit('select', { itemId: '1', label: '首页' })
 * 
 * // 取消监听
 * unsubscribe()
 * ```
 */
export class EventEmitter {
  /** 事件映射表，使用 Map 存储事件名和对应的处理函数集合 */
  private events: Map<string, Set<EventHandler>> = new Map()

  /**
   * 注册事件监听器
   * 
   * @description
   * 为指定事件添加监听函数，返回取消监听的函数。
   * 使用 Set 存储处理函数，自动去重。
   * 
   * @param event - 事件名称
   * @param handler - 事件处理函数
   * @returns 取消监听的函数
   * 
   * @example
   * ```ts
   * const unsubscribe = emitter.on('expand', (item) => {
   *   console.log('展开菜单项:', item.label)
   * })
   * ```
   */
  on(event: string, handler: EventHandler): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }

    this.events.get(event)!.add(handler)

    // 返回取消监听的函数
    return () => this.off(event, handler)
  }

  /**
   * 注册一次性事件监听器
   * 
   * @description
   * 注册只触发一次就自动移除的事件监听器，适用于一次性事件。
   * 
   * @param event - 事件名称
   * @param handler - 事件处理函数
   * @returns 取消监听的函数
   * 
   * @example
   * ```ts
   * emitter.once('first-render', () => {
   *   console.log('首次渲染完成')
   * })
   * ```
   */
  once(event: string, handler: EventHandler): () => void {
    const wrappedHandler = (...args: any[]) => {
      handler(...args)
      this.off(event, wrappedHandler)
    }

    return this.on(event, wrappedHandler)
  }

  /**
   * 移除事件监听器
   * 
   * @description
   * 移除指定事件的监听器。如果不提供 handler 参数，则移除该事件的所有监听器。
   * 
   * @param event - 事件名称
   * @param handler - 要移除的事件处理函数（可选）
   * 
   * @example
   * ```ts
   * // 移除特定处理函数
   * emitter.off('select', handleSelect)
   * 
   * // 移除该事件的所有监听器
   * emitter.off('select')
   * ```
   */
  off(event: string, handler?: EventHandler): void {
    if (!handler) {
      // 移除所有该事件的监听器
      this.events.delete(event)
      return
    }

    const handlers = this.events.get(event)
    if (handlers) {
      handlers.delete(handler)
      // 如果没有监听器了，删除该事件键
      if (handlers.size === 0) {
        this.events.delete(event)
      }
    }
  }

  /**
   * 触发事件
   * 
   * @description
   * 触发指定事件，依次调用所有已注册的监听器。
   * 每个监听器都包裹在 try-catch 中，避免单个监听器错误影响其他监听器。
   * 
   * @param event - 事件名称
   * @param args - 传递给监听器的参数
   * 
   * @example
   * ```ts
   * emitter.emit('select', { itemId: '1', label: '首页' })
   * emitter.emit('expand', menuItem, mouseEvent)
   * ```
   */
  emit(event: string, ...args: any[]): void {
    const handlers = this.events.get(event)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(...args)
        }
        catch (error) {
          console.error(`Error in event handler for "${event}":`, error)
        }
      })
    }
  }

  /**
   * 获取事件监听器数量
   * 
   * @description
   * 获取指定事件当前注册的监听器数量。
   * 
   * @param event - 事件名称
   * @returns 监听器数量
   * 
   * @example
   * ```ts
   * const count = emitter.listenerCount('select')
   * console.log(`select 事件有 ${count} 个监听器`)
   * ```
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.size || 0
  }

  /**
   * 获取所有事件名称
   * 
   * @description
   * 返回当前已注册监听器的所有事件名称数组。
   * 
   * @returns 事件名称数组
   * 
   * @example
   * ```ts
   * const events = emitter.eventNames()
   * console.log('已注册的事件:', events) // ['select', 'expand', 'collapse']
   * ```
   */
  eventNames(): string[] {
    return Array.from(this.events.keys())
  }

  /**
   * 清除所有事件监听器
   * 
   * @description
   * 清除指定事件或所有事件的监听器。
   * 如果提供事件名称，只清除该事件的监听器；否则清除所有事件的监听器。
   * 
   * @param event - 事件名称（可选）
   * 
   * @example
   * ```ts
   * // 清除特定事件的所有监听器
   * emitter.removeAllListeners('select')
   * 
   * // 清除所有事件的监听器
   * emitter.removeAllListeners()
   * ```
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event)
    }
    else {
      this.events.clear()
    }
  }
}


