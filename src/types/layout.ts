/**
 * 布局相关类型
 */

/**
 * 位置信息
 */
export interface Position {
  x: number
  y: number
}

/**
 * 尺寸信息
 */
export interface Size {
  width: number
  height: number
}

/**
 * 矩形区域
 */
export interface Rect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

/**
 * Popup 定位信息
 */
export interface PopupPosition {
  /** 定位类型 */
  placement: string
  /** 绝对位置 */
  position: Position
  /** 是否需要翻转 */
  flipped: boolean
  /** 实际使用的定位 */
  actualPlacement: string
}

/**
 * 布局计算结果
 */
export interface LayoutResult {
  /** 可见项索引范围 */
  visibleRange: {
    start: number
    end: number
  }
  /** 总高度/宽度 */
  totalSize: number
  /** 偏移量 */
  offset: number
  /** 每项的位置信息 */
  itemPositions: Map<string | number, Position>
}

/**
 * 滚动状态
 */
export interface ScrollState {
  /** 滚动位置 */
  scrollTop: number
  scrollLeft: number
  /** 可见区域高度 */
  clientHeight: number
  clientWidth: number
  /** 总高度 */
  scrollHeight: number
  scrollWidth: number
}


