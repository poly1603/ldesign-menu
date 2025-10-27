/**
 * 错误处理工具模块
 * 
 * @description
 * 提供统一的错误处理机制，包括错误捕获、错误报告和友好的错误提示。
 * 在开发模式下提供详细的错误堆栈，在生产模式下可上报错误到服务器。
 */

import { logger } from './logger'

/**
 * 错误类型枚举
 */
export enum ErrorType {
  /** 配置错误 */
  CONFIG_ERROR = 'CONFIG_ERROR',
  /** 渲染错误 */
  RENDER_ERROR = 'RENDER_ERROR',
  /** 事件处理错误 */
  EVENT_ERROR = 'EVENT_ERROR',
  /** 数据验证错误 */
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  /** 网络错误 */
  NETWORK_ERROR = 'NETWORK_ERROR',
  /** 未知错误 */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * 菜单错误类
 * 
 * @description
 * 自定义的错误类，包含错误类型、上下文信息等。
 * 
 * @example
 * ```ts
 * throw new MenuError(
 *   ErrorType.CONFIG_ERROR,
 *   '无效的菜单模式',
 *   { mode: 'invalid' }
 * )
 * ```
 */
export class MenuError extends Error {
  /** 错误类型 */
  type: ErrorType
  /** 上下文信息 */
  context?: any
  /** 时间戳 */
  timestamp: number

  constructor(type: ErrorType, message: string, context?: any) {
    super(message)
    this.name = 'MenuError'
    this.type = type
    this.context = context
    this.timestamp = Date.now()

    // 保持错误堆栈
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MenuError)
    }
  }
}

/**
 * 错误处理器配置接口
 */
export interface ErrorHandlerConfig {
  /** 是否在开发模式 */
  isDev: boolean
  /** 错误报告回调 */
  onError?: (error: MenuError) => void
  /** 是否显示用户友好的错误提示 */
  showUserMessage: boolean
  /** 是否在控制台输出错误 */
  logToConsole: boolean
}

/**
 * 错误处理器类
 * 
 * @description
 * 统一处理菜单组件的所有错误，提供错误捕获、记录和上报功能。
 * 
 * @example
 * ```ts
 * const errorHandler = new ErrorHandler({
 *   isDev: process.env.NODE_ENV === 'development',
 *   onError: (error) => {
 *     // 上报到错误监控服务
 *     sendToSentry(error)
 *   }
 * })
 * 
 * errorHandler.handle(new MenuError(
 *   ErrorType.CONFIG_ERROR,
 *   '配置无效'
 * ))
 * ```
 */
export class ErrorHandler {
  private config: ErrorHandlerConfig
  private errorCount = 0
  private errorHistory: MenuError[] = []
  private maxHistorySize = 50

  constructor(config: Partial<ErrorHandlerConfig> = {}) {
    this.config = {
      isDev: config.isDev ?? process.env.NODE_ENV === 'development',
      onError: config.onError,
      showUserMessage: config.showUserMessage ?? false,
      logToConsole: config.logToConsole ?? true,
    }
  }

  /**
   * 处理错误
   * 
   * @description
   * 统一处理错误，包括记录、报告和提示。
   * 
   * @param error - 错误对象
   * 
   * @example
   * ```ts
   * try {
   *   // 可能出错的代码
   *   renderMenu()
   * } catch (err) {
   *   errorHandler.handle(err)
   * }
   * ```
   */
  handle(error: Error | MenuError): void {
    // 转换为 MenuError
    const menuError = error instanceof MenuError
      ? error
      : new MenuError(ErrorType.UNKNOWN_ERROR, error.message, { originalError: error })

    // 增加错误计数
    this.errorCount++

    // 记录到历史
    this.errorHistory.push(menuError)
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift()
    }

    // 输出到控制台
    if (this.config.logToConsole) {
      logger.error(`菜单错误 [${menuError.type}]:`, menuError.message, menuError.context)
      if (this.config.isDev && menuError.stack) {
        console.error(menuError.stack)
      }
    }

    // 触发错误回调
    if (this.config.onError) {
      try {
        this.config.onError(menuError)
      }
      catch (callbackError) {
        // 避免回调错误导致死循环
        console.error('错误处理回调失败:', callbackError)
      }
    }

    // 显示用户友好提示
    if (this.config.showUserMessage && this.config.isDev) {
      this.showErrorMessage(menuError)
    }
  }

  /**
   * 显示错误提示
   * 
   * @description
   * 在页面上显示友好的错误提示（仅开发模式）。
   * 
   * @param error - 菜单错误对象
   * 
   * @private
   */
  private showErrorMessage(error: MenuError): void {
    const message = this.getUser  FriendlyMessage(error)
    // 这里可以集成 toast 或 notification 组件
    console.warn('用户提示:', message)
  }

  /**
   * 获取用户友好的错误消息
   * 
   * @description
   * 将技术性错误消息转换为用户可理解的提示。
   * 
   * @param error - 菜单错误对象
   * @returns 友好的错误消息
   * 
   * @private
   */
  private getUserFriendlyMessage(error: MenuError): string {
    const messages: Record<ErrorType, string> = {
      [ErrorType.CONFIG_ERROR]: '菜单配置有误，请检查配置项',
      [ErrorType.RENDER_ERROR]: '菜单渲染失败，请刷新页面重试',
      [ErrorType.EVENT_ERROR]: '操作失败，请重试',
      [ErrorType.VALIDATION_ERROR]: '数据格式错误，请检查输入',
      [ErrorType.NETWORK_ERROR]: '网络请求失败，请检查网络连接',
      [ErrorType.UNKNOWN_ERROR]: '发生未知错误，请联系技术支持',
    }

    return messages[error.type] || messages[ErrorType.UNKNOWN_ERROR]
  }

  /**
   * 获取错误统计
   * 
   * @description
   * 获取错误处理的统计信息。
   * 
   * @returns 错误统计对象
   * 
   * @example
   * ```ts
   * const stats = errorHandler.getStats()
   * console.log(`共发生 ${stats.totalErrors} 个错误`)
   * ```
   */
  getStats(): {
    totalErrors: number
    recentErrors: MenuError[]
    errorsByType: Record<ErrorType, number>
  } {
    const errorsByType: Record<ErrorType, number> = {
      [ErrorType.CONFIG_ERROR]: 0,
      [ErrorType.RENDER_ERROR]: 0,
      [ErrorType.EVENT_ERROR]: 0,
      [ErrorType.VALIDATION_ERROR]: 0,
      [ErrorType.NETWORK_ERROR]: 0,
      [ErrorType.UNKNOWN_ERROR]: 0,
    }

    this.errorHistory.forEach((error) => {
      errorsByType[error.type]++
    })

    return {
      totalErrors: this.errorCount,
      recentErrors: this.errorHistory.slice(-10),
      errorsByType,
    }
  }

  /**
   * 清空错误历史
   * 
   * @description
   * 清空错误历史记录和计数。
   * 
   * @example
   * ```ts
   * errorHandler.clearHistory()
   * ```
   */
  clearHistory(): void {
    this.errorHistory = []
    this.errorCount = 0
  }
}

/**
 * 默认错误处理器实例
 * 
 * @description
 * 全局共享的默认错误处理器，可直接使用。
 * 
 * @example
 * ```ts
 * import { errorHandler } from '@ldesign/menu/utils'
 * 
 * try {
 *   menu.render()
 * } catch (error) {
 *   errorHandler.handle(error)
 * }
 * ```
 */
export const errorHandler = new ErrorHandler()

/**
 * 创建错误处理包装器
 * 
 * @description
 * 将函数包装在错误处理逻辑中，自动捕获和处理错误。
 * 
 * @param fn - 要包装的函数
 * @param errorType - 错误类型
 * @param context - 上下文信息
 * @returns 包装后的函数
 * 
 * @example
 * ```ts
 * const safeRender = withErrorHandler(
 *   () => menu.render(),
 *   ErrorType.RENDER_ERROR,
 *   { menuId: '1' }
 * )
 * 
 * safeRender() // 自动捕获错误
 * ```
 */
export function withErrorHandler<T extends (...args: any[]) => any>(
  fn: T,
  errorType: ErrorType = ErrorType.UNKNOWN_ERROR,
  context?: any,
): T {
  return ((...args: any[]) => {
    try {
      return fn(...args)
    }
    catch (error) {
      const menuError = new MenuError(
        errorType,
        error instanceof Error ? error.message : String(error),
        { ...context, originalError: error },
      )
      errorHandler.handle(menuError)
      throw menuError
    }
  }) as T
}

/**
 * 断言函数
 * 
 * @description
 * 断言条件为真，否则抛出错误。
 * 用于开发时的参数验证和前置条件检查。
 * 
 * @param condition - 要断言的条件
 * @param message - 错误消息
 * @param errorType - 错误类型
 * @param context - 上下文信息
 * 
 * @example
 * ```ts
 * assert(items.length > 0, '菜单项不能为空', ErrorType.VALIDATION_ERROR)
 * assert(isValidId(id), '无效的菜单项ID', ErrorType.VALIDATION_ERROR, { id })
 * ```
 */
export function assert(
  condition: any,
  message: string,
  errorType: ErrorType = ErrorType.VALIDATION_ERROR,
  context?: any,
): asserts condition {
  if (!condition) {
    throw new MenuError(errorType, message, context)
  }
}

/**
 * 安全执行函数
 * 
 * @description
 * 安全地执行函数，捕获所有错误并返回结果或默认值。
 * 不会抛出错误，适用于不希望中断执行的场景。
 * 
 * @param fn - 要执行的函数
 * @param defaultValue - 出错时的默认返回值
 * @param errorType - 错误类型
 * @returns 函数执行结果或默认值
 * 
 * @example
 * ```ts
 * const items = safeExecute(
 *   () => JSON.parse(menuData),
 *   [],  // 解析失败返回空数组
 *   ErrorType.VALIDATION_ERROR
 * )
 * ```
 */
export function safeExecute<T>(
  fn: () => T,
  defaultValue: T,
  errorType: ErrorType = ErrorType.UNKNOWN_ERROR,
): T {
  try {
    return fn()
  }
  catch (error) {
    const menuError = new MenuError(
      errorType,
      error instanceof Error ? error.message : String(error),
      { originalError: error },
    )
    errorHandler.handle(menuError)
    return defaultValue
  }
}


