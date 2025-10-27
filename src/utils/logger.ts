/**
 * 日志工具模块
 * 
 * @description
 * 提供统一的日志记录功能，支持不同日志级别和开发/生产模式。
 * 在开发模式下提供详细的调试信息，在生产模式下可选择性禁用日志。
 */

/**
 * 日志级别枚举
 */
export enum LogLevel {
  /** 调试信息（最详细） */
  DEBUG = 0,
  /** 一般信息 */
  INFO = 1,
  /** 警告信息 */
  WARN = 2,
  /** 错误信息 */
  ERROR = 3,
  /** 静默（不输出任何日志） */
  SILENT = 4,
}

/**
 * 日志配置接口
 */
export interface LoggerConfig {
  /** 当前日志级别 */
  level: LogLevel
  /** 是否启用日志 */
  enabled: boolean
  /** 日志前缀 */
  prefix: string
  /** 是否显示时间戳 */
  timestamp: boolean
  /** 自定义日志处理器 */
  customHandler?: (level: LogLevel, message: string, ...args: any[]) => void
}

/**
 * 日志工具类
 * 
 * @description
 * 统一的日志管理器，支持不同级别的日志输出和自定义处理。
 * 
 * @example
 * ```ts
 * const logger = new Logger({ level: LogLevel.INFO })
 * 
 * logger.debug('调试信息')     // 不会输出（级别太低）
 * logger.info('一般信息')      // 会输出
 * logger.warn('警告信息')      // 会输出
 * logger.error('错误信息')     // 会输出
 * ```
 */
export class Logger {
  private config: LoggerConfig

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: config.level ?? (process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG),
      enabled: config.enabled ?? true,
      prefix: config.prefix ?? '[LDesign Menu]',
      timestamp: config.timestamp ?? true,
      customHandler: config.customHandler,
    }
  }

  /**
   * 调试日志
   * 
   * @description
   * 输出调试级别的日志，用于开发调试。
   * 生产环境下默认不输出。
   * 
   * @param message - 日志消息
   * @param args - 额外参数
   * 
   * @example
   * ```ts
   * logger.debug('菜单项数据:', menuItems)
   * logger.debug('当前状态:', { expanded, active })
   * ```
   */
  debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, ...args)
  }

  /**
   * 信息日志
   * 
   * @description
   * 输出一般信息日志，用于记录关键操作。
   * 
   * @param message - 日志消息
   * @param args - 额外参数
   * 
   * @example
   * ```ts
   * logger.info('菜单已挂载')
   * logger.info('选中菜单项:', item.label)
   * ```
   */
  info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args)
  }

  /**
   * 警告日志
   * 
   * @description
   * 输出警告信息，表示潜在问题但不影响功能。
   * 
   * @param message - 日志消息
   * @param args - 额外参数
   * 
   * @example
   * ```ts
   * logger.warn('菜单项ID重复:', duplicateId)
   * logger.warn('配置项已废弃:', oldConfig)
   * ```
   */
  warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, ...args)
  }

  /**
   * 错误日志
   * 
   * @description
   * 输出错误信息，表示严重问题。
   * 始终输出，除非完全禁用日志。
   * 
   * @param message - 日志消息
   * @param args - 额外参数
   * 
   * @example
   * ```ts
   * logger.error('菜单渲染失败:', error)
   * logger.error('无效的菜单配置:', config)
   * ```
   */
  error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, ...args)
  }

  /**
   * 输出日志
   * 
   * @description
   * 根据配置的日志级别决定是否输出日志。
   * 支持自定义日志处理器。
   * 
   * @param level - 日志级别
   * @param message - 日志消息
   * @param args - 额外参数
   * 
   * @private
   */
  private log(level: LogLevel, message: string, ...args: any[]): void {
    // 检查是否启用日志
    if (!this.config.enabled) {
      return
    }

    // 检查日志级别
    if (level < this.config.level) {
      return
    }

    // 构建日志消息
    const timestamp = this.config.timestamp ? `[${new Date().toISOString()}]` : ''
    const levelName = LogLevel[level]
    const fullMessage = `${timestamp} ${this.config.prefix} [${levelName}] ${message}`

    // 使用自定义处理器或默认控制台输出
    if (this.config.customHandler) {
      this.config.customHandler(level, message, ...args)
      return
    }

    // 默认控制台输出
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(fullMessage, ...args)
        break
      case LogLevel.INFO:
        console.info(fullMessage, ...args)
        break
      case LogLevel.WARN:
        console.warn(fullMessage, ...args)
        break
      case LogLevel.ERROR:
        console.error(fullMessage, ...args)
        break
    }
  }

  /**
   * 设置日志级别
   * 
   * @description
   * 动态更改日志输出级别。
   * 
   * @param level - 新的日志级别
   * 
   * @example
   * ```ts
   * // 开发环境：显示所有日志
   * logger.setLevel(LogLevel.DEBUG)
   * 
   * // 生产环境：只显示警告和错误
   * logger.setLevel(LogLevel.WARN)
   * ```
   */
  setLevel(level: LogLevel): void {
    this.config.level = level
  }

  /**
   * 启用日志
   * 
   * @description
   * 启用日志输出。
   */
  enable(): void {
    this.config.enabled = true
  }

  /**
   * 禁用日志
   * 
   * @description
   * 禁用所有日志输出。
   */
  disable(): void {
    this.config.enabled = false
  }

  /**
   * 更新配置
   * 
   * @description
   * 动态更新日志配置。
   * 
   * @param config - 部分配置对象
   * 
   * @example
   * ```ts
   * logger.updateConfig({
   *   prefix: '[我的菜单]',
   *   timestamp: false
   * })
   * ```
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    }
  }
}

/**
 * 默认日志实例
 * 
 * @description
 * 全局共享的默认日志实例，可直接使用。
 * 
 * @example
 * ```ts
 * import { logger } from '@ldesign/menu/utils'
 * 
 * logger.info('菜单初始化完成')
 * logger.error('发生错误:', error)
 * ```
 */
export const logger = new Logger()

/**
 * 创建命名空间日志器
 * 
 * @description
 * 创建带有自定义前缀的日志实例，用于区分不同模块的日志。
 * 
 * @param namespace - 命名空间（作为日志前缀）
 * @param config - 日志配置
 * @returns 日志实例
 * 
 * @example
 * ```ts
 * const menuLogger = createLogger('Menu Manager')
 * const popupLogger = createLogger('Popup Manager')
 * 
 * menuLogger.info('菜单渲染完成')
 * popupLogger.info('Popup已打开')
 * ```
 */
export function createLogger(namespace: string, config: Partial<LoggerConfig> = {}): Logger {
  return new Logger({
    ...config,
    prefix: `[LDesign Menu:${namespace}]`,
  })
}


