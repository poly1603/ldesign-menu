/**
 * 性能监控工具模块
 * 
 * @description
 * 提供菜单组件的性能监控和分析功能。
 * 监控渲染时间、交互响应、内存使用等关键指标。
 * 帮助开发者发现和优化性能瓶颈。
 */

import { logger } from './logger'

/**
 * 性能指标接口
 */
export interface PerformanceMetrics {
  /** 首次渲染时间（毫秒） */
  firstRenderTime?: number
  /** 平均渲染时间（毫秒） */
  averageRenderTime?: number
  /** 交互响应时间（毫秒） */
  interactionTime?: number
  /** 内存使用（MB） */
  memoryUsage?: number
  /** FPS（帧率） */
  fps?: number
  /** 渲染次数 */
  renderCount: number
  /** 事件触发次数 */
  eventCount: number
}

/**
 * 性能记录接口
 */
export interface PerformanceRecord {
  /** 记录名称 */
  name: string
  /** 开始时间 */
  startTime: number
  /** 结束时间 */
  endTime?: number
  /** 持续时间（毫秒） */
  duration?: number
  /** 额外数据 */
  metadata?: any
}

/**
 * 性能监控器类
 * 
 * @description
 * 监控和分析菜单组件的性能指标。
 * 支持性能标记、测量、报告生成等功能。
 * 
 * @example
 * ```ts
 * const monitor = new PerformanceMonitor()
 * 
 * // 标记渲染开始
 * monitor.mark('render-start')
 * renderMenu()
 * monitor.mark('render-end')
 * 
 * // 测量渲染时间
 * const renderTime = monitor.measure('render', 'render-start', 'render-end')
 * console.log(`渲染耗时: ${renderTime}ms`)
 * 
 * // 获取性能报告
 * const report = monitor.getReport()
 * console.log(report)
 * ```
 */
export class PerformanceMonitor {
  private enabled = true
  private marks: Map<string, number> = new Map()
  private records: PerformanceRecord[] = new Map()
  private metrics: PerformanceMetrics = {
    renderCount: 0,
    eventCount: 0,
  }
  private renderTimes: number[] = []
  private maxRecords = 100

  /**
   * 标记性能时间点
   * 
   * @description
   * 在关键时间点设置标记，用于后续性能测量。
   * 
   * @param name - 标记名称
   * 
   * @example
   * ```ts
   * monitor.mark('render-start')
   * performExpensiveOperation()
   * monitor.mark('render-end')
   * ```
   */
  mark(name: string): void {
    if (!this.enabled) {
      return
    }

    this.marks.set(name, performance.now())

    // 使用浏览器原生 Performance API（如果可用）
    if (typeof performance !== 'undefined' && performance.mark) {
      try {
        performance.mark(name)
      }
      catch (e) {
        // 忽略错误（某些环境可能不支持）
      }
    }
  }

  /**
   * 测量性能
   * 
   * @description
   * 测量两个标记之间的时间差。
   * 
   * @param name - 测量名称
   * @param startMark - 开始标记名称
   * @param endMark - 结束标记名称
   * @returns 持续时间（毫秒），如果标记不存在则返回 null
   * 
   * @example
   * ```ts
   * monitor.mark('render-start')
   * renderMenu()
   * monitor.mark('render-end')
   * 
   * const time = monitor.measure('render', 'render-start', 'render-end')
   * console.log(`渲染耗时: ${time}ms`)
   * ```
   */
  measure(name: string, startMark: string, endMark: string): number | null {
    if (!this.enabled) {
      return null
    }

    const startTime = this.marks.get(startMark)
    const endTime = this.marks.get(endMark)

    if (startTime === undefined || endTime === undefined) {
      logger.warn('性能标记不存在:', { startMark, endMark })
      return null
    }

    const duration = endTime - startTime

    // 记录测量结果
    const record: PerformanceRecord = {
      name,
      startTime,
      endTime,
      duration,
    }

    this.records.push(record)

    // 限制记录数量
    if (this.records.length > this.maxRecords) {
      this.records.shift()
    }

    // 使用浏览器原生 Performance API
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark)
      }
      catch (e) {
        // 忽略错误
      }
    }

    return duration
  }

  /**
   * 记录渲染时间
   * 
   * @description
   * 记录一次渲染的耗时，用于计算平均渲染时间。
   * 
   * @param duration - 渲染持续时间（毫秒）
   * 
   * @example
   * ```ts
   * const start = performance.now()
   * renderMenu()
   * const duration = performance.now() - start
   * monitor.recordRenderTime(duration)
   * ```
   */
  recordRenderTime(duration: number): void {
    this.metrics.renderCount++
    this.renderTimes.push(duration)

    // 保留最近100次渲染时间
    if (this.renderTimes.length > 100) {
      this.renderTimes.shift()
    }

    // 更新首次渲染时间
    if (!this.metrics.firstRenderTime) {
      this.metrics.firstRenderTime = duration
    }

    // 计算平均渲染时间
    this.metrics.averageRenderTime = 
      this.renderTimes.reduce((sum, time) => sum + time, 0) / this.renderTimes.length
  }

  /**
   * 记录事件触发
   * 
   * @description
   * 记录事件触发次数。
   * 
   * @param eventName - 事件名称
   * 
   * @example
   * ```ts
   * menu.on('select', () => {
   *   monitor.recordEvent('select')
   * })
   * ```
   */
  recordEvent(eventName: string): void {
    this.metrics.eventCount++
  }

  /**
   * 测量FPS（帧率）
   * 
   * @description
   * 测量当前的帧率，用于评估动画流畅度。
   * 
   * @param duration - 测量持续时间（毫秒），默认1000ms
   * @returns Promise，resolve时返回测量的FPS
   * 
   * @example
   * ```ts
   * const fps = await monitor.measureFPS(1000)
   * console.log(`当前FPS: ${fps}`)
   * ```
   */
  async measureFPS(duration = 1000): Promise<number> {
    return new Promise((resolve) => {
      let frameCount = 0
      const startTime = performance.now()

      const countFrame = () => {
        frameCount++
        const elapsedTime = performance.now() - startTime

        if (elapsedTime < duration) {
          requestAnimationFrame(countFrame)
        }
        else {
          const fps = Math.round((frameCount / elapsedTime) * 1000)
          this.metrics.fps = fps
          resolve(fps)
        }
      }

      requestAnimationFrame(countFrame)
    })
  }

  /**
   * 获取内存使用情况
   * 
   * @description
   * 获取当前的内存使用情况（如果浏览器支持）。
   * 
   * @returns 内存使用（MB），如果不支持则返回 null
   * 
   * @example
   * ```ts
   * const memory = monitor.getMemoryUsage()
   * if (memory !== null) {
   *   console.log(`内存使用: ${memory}MB`)
   * }
   * ```
   */
  getMemoryUsage(): number | null {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory
      const usedJSHeapSize = memory.usedJSHeapSize / 1024 / 1024
      this.metrics.memoryUsage = usedJSHeapSize
      return usedJSHeapSize
    }
    return null
  }

  /**
   * 获取性能指标
   * 
   * @description
   * 获取当前收集的所有性能指标。
   * 
   * @returns 性能指标对象
   * 
   * @example
   * ```ts
   * const metrics = monitor.getMetrics()
   * console.log('性能指标:', metrics)
   * ```
   */
  getMetrics(): PerformanceMetrics {
    // 更新内存使用
    this.getMemoryUsage()

    return { ...this.metrics }
  }

  /**
   * 获取性能报告
   * 
   * @description
   * 生成详细的性能分析报告。
   * 
   * @returns 性能报告对象
   * 
   * @example
   * ```ts
   * const report = monitor.getReport()
   * console.table(report)
   * ```
   */
  getReport(): {
    metrics: PerformanceMetrics
    records: PerformanceRecord[]
    summary: string
  } {
    const metrics = this.getMetrics()

    let summary = '性能报告:\n'
    summary += `- 渲染次数: ${metrics.renderCount}\n`
    summary += `- 首次渲染: ${metrics.firstRenderTime?.toFixed(2)}ms\n`
    summary += `- 平均渲染: ${metrics.averageRenderTime?.toFixed(2)}ms\n`
    summary += `- 事件触发: ${metrics.eventCount}次\n`

    if (metrics.fps) {
      summary += `- 帧率(FPS): ${metrics.fps}\n`
    }

    if (metrics.memoryUsage) {
      summary += `- 内存使用: ${metrics.memoryUsage.toFixed(2)}MB\n`
    }

    return {
      metrics,
      records: [...this.records],
      summary,
    }
  }

  /**
   * 清空所有数据
   * 
   * @description
   * 清空所有性能标记、记录和指标。
   * 
   * @example
   * ```ts
   * monitor.clear()
   * console.log('性能数据已清空')
   * ```
   */
  clear(): void {
    this.marks.clear()
    this.records = []
    this.renderTimes = []
    this.metrics = {
      renderCount: 0,
      eventCount: 0,
    }

    // 清空浏览器原生性能数据
    if (typeof performance !== 'undefined' && performance.clearMarks) {
      performance.clearMarks()
      performance.clearMeasures()
    }
  }

  /**
   * 启用监控
   * 
   * @description
   * 启用性能监控功能。
   */
  enable(): void {
    this.enabled = true
  }

  /**
   * 禁用监控
   * 
   * @description
   * 禁用性能监控功能（生产环境建议禁用以提升性能）。
   */
  disable(): void {
    this.enabled = false
  }

  /**
   * 检查是否启用
   * 
   * @returns 是否启用监控
   */
  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * 打印性能报告到控制台
   * 
   * @description
   * 以易读的格式将性能报告打印到控制台。
   * 
   * @example
   * ```ts
   * monitor.printReport()
   * ```
   */
  printReport(): void {
    const report = this.getReport()
    console.log(report.summary)
    
    if (report.records.length > 0) {
      console.table(report.records.slice(-10)) // 显示最近10条记录
    }
  }
}

/**
 * 默认性能监控器实例
 * 
 * @description
 * 全局共享的性能监控器，可直接使用。
 * 开发环境默认启用，生产环境默认禁用。
 * 
 * @example
 * ```ts
 * import { performanceMonitor } from '@ldesign/menu/utils'
 * 
 * performanceMonitor.mark('render-start')
 * renderMenu()
 * performanceMonitor.mark('render-end')
 * performanceMonitor.measure('render', 'render-start', 'render-end')
 * 
 * // 查看报告
 * performanceMonitor.printReport()
 * ```
 */
export const performanceMonitor = new PerformanceMonitor()

// 开发环境默认启用，生产环境默认禁用
if (process.env.NODE_ENV === 'production') {
  performanceMonitor.disable()
}

/**
 * 性能装饰器
 * 
 * @description
 * 装饰器函数，自动测量被装饰方法的执行时间。
 * 
 * @param name - 测量名称
 * @returns 装饰器函数
 * 
 * @example
 * ```ts
 * class Menu {
 *   @measurePerformance('render')
 *   render() {
 *     // 渲染逻辑
 *   }
 * }
 * ```
 */
export function measurePerformance(name: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      const startMark = `${name}-start-${Date.now()}`
      const endMark = `${name}-end-${Date.now()}`

      performanceMonitor.mark(startMark)
      const result = originalMethod.apply(this, args)
      performanceMonitor.mark(endMark)
      performanceMonitor.measure(name, startMark, endMark)

      return result
    }

    return descriptor
  }
}

/**
 * 测量函数执行时间
 * 
 * @description
 * 包装函数并自动测量其执行时间。
 * 
 * @param fn - 要测量的函数
 * @param name - 测量名称
 * @returns 包装后的函数
 * 
 * @example
 * ```ts
 * const timedRender = withPerformanceMeasure(
 *   () => menu.render(),
 *   'render'
 * )
 * 
 * timedRender() // 自动记录性能
 * ```
 */
export function withPerformanceMeasure<T extends (...args: any[]) => any>(
  fn: T,
  name: string,
): T {
  return ((...args: any[]) => {
    const startMark = `${name}-start-${Date.now()}`
    const endMark = `${name}-end-${Date.now()}`

    performanceMonitor.mark(startMark)
    const result = fn(...args)
    performanceMonitor.mark(endMark)
    
    const duration = performanceMonitor.measure(name, startMark, endMark)
    
    if (duration && duration > 16) {
      logger.warn(`${name} 执行时间超过 16ms:`, `${duration.toFixed(2)}ms`)
    }

    return result
  }) as T
}

/**
 * 性能计时器
 * 
 * @description
 * 便捷的性能计时工具，自动管理开始和结束标记。
 * 
 * @example
 * ```ts
 * const timer = createTimer('render')
 * renderMenu()
 * const duration = timer.end()
 * console.log(`耗时: ${duration}ms`)
 * ```
 */
export function createTimer(name: string) {
  const startMark = `${name}-start-${Date.now()}`
  const endMark = `${name}-end-${Date.now()}`

  performanceMonitor.mark(startMark)

  return {
    /**
     * 结束计时
     * 
     * @returns 持续时间（毫秒）
     */
    end(): number | null {
      performanceMonitor.mark(endMark)
      return performanceMonitor.measure(name, startMark, endMark)
    },

    /**
     * 取消计时
     */
    cancel(): void {
      // 不记录测量结果
    },
  }
}


