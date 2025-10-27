/**
 * 布局相关类型定义模块
 * 
 * @description
 * 定义菜单布局计算所需的所有数据结构。
 * 包括位置、尺寸、矩形区域、popup定位、滚动状态等类型。
 */

/**
 * 位置信息接口
 * 
 * @description
 * 表示二维坐标系中的一个点。
 * 
 * @example
 * ```ts
 * const position: Position = { x: 100, y: 200 }
 * element.style.left = `${position.x}px`
 * element.style.top = `${position.y}px`
 * ```
 */
export interface Position {
  /** 水平坐标（像素） */
  x: number
  /** 垂直坐标（像素） */
  y: number
}

/**
 * 尺寸信息接口
 * 
 * @description
 * 表示元素的宽度和高度。
 * 
 * @example
 * ```ts
 * const size: Size = { width: 200, height: 400 }
 * element.style.width = `${size.width}px`
 * element.style.height = `${size.height}px`
 * ```
 */
export interface Size {
  /** 宽度（像素） */
  width: number
  /** 高度（像素） */
  height: number
}

/**
 * 矩形区域接口
 * 
 * @description
 * 表示元素的完整边界信息，包括位置和尺寸。
 * 通常从 getBoundingClientRect() 获取。
 * 
 * @example
 * ```ts
 * const rect: Rect = element.getBoundingClientRect()
 * console.log(`位置: (${rect.left}, ${rect.top})`)
 * console.log(`尺寸: ${rect.width} x ${rect.height}`)
 * ```
 */
export interface Rect {
  /** 顶部边缘距视口顶部的距离（像素） */
  top: number
  /** 左边缘距视口左侧的距离（像素） */
  left: number
  /** 右边缘距视口左侧的距离（像素） */
  right: number
  /** 底部边缘距视口顶部的距离（像素） */
  bottom: number
  /** 宽度（像素） */
  width: number
  /** 高度（像素） */
  height: number
}

/**
 * Popup 定位信息接口
 * 
 * @description
 * 计算 popup 定位后返回的完整信息，包括期望位置、实际位置和翻转状态。
 * 
 * @example
 * ```ts
 * const popupPos: PopupPosition = calculatePopupPosition(trigger, popup, 'bottom-start')
 * 
 * popup.style.left = `${popupPos.position.x}px`
 * popup.style.top = `${popupPos.position.y}px`
 * 
 * if (popupPos.flipped) {
 *   console.log(`位置从 ${popupPos.placement} 翻转到 ${popupPos.actualPlacement}`)
 * }
 * ```
 */
export interface PopupPosition {
  /** 期望的定位类型（如 'bottom-start'） */
  placement: string
  /** 计算后的绝对位置坐标 */
  position: Position
  /** 是否因边界检测而翻转了位置 */
  flipped: boolean
  /** 实际使用的定位类型（翻转后） */
  actualPlacement: string
}

/**
 * 布局计算结果接口
 * 
 * @description
 * 布局引擎计算后返回的完整布局信息。
 * 包含可见范围、总尺寸、偏移量和每个菜单项的位置。
 * 
 * @example
 * ```ts
 * const layout: LayoutResult = layoutEngine.getLayout()
 * 
 * console.log(`可见范围: ${layout.visibleRange.start} - ${layout.visibleRange.end}`)
 * console.log(`总尺寸: ${layout.totalSize}px`)
 * 
 * const itemPos = layout.itemPositions.get('item-1')
 * if (itemPos) {
 *   console.log(`菜单项位置: (${itemPos.x}, ${itemPos.y})`)
 * }
 * ```
 */
export interface LayoutResult {
  /** 可见菜单项的索引范围（用于虚拟滚动） */
  visibleRange: {
    /** 起始索引 */
    start: number
    /** 结束索引 */
    end: number
  }
  /** 总尺寸（横向模式为总宽度，纵向模式为总高度） */
  totalSize: number
  /** 可见区域的偏移量（用于定位虚拟滚动内容） */
  offset: number
  /** 每个菜单项的位置映射表（ID -> Position） */
  itemPositions: Map<string | number, Position>
}

/**
 * 滚动状态接口
 * 
 * @description
 * 记录容器的滚动状态和尺寸信息。
 * 用于虚拟滚动的可见范围计算。
 * 
 * @example
 * ```ts
 * const scrollState: ScrollState = {
 *   scrollTop: container.scrollTop,
 *   scrollLeft: container.scrollLeft,
 *   clientHeight: container.clientHeight,
 *   clientWidth: container.clientWidth,
 *   scrollHeight: container.scrollHeight,
 *   scrollWidth: container.scrollWidth
 * }
 * 
 * virtualScroller.updateScrollState(scrollState)
 * ```
 */
export interface ScrollState {
  /** 垂直滚动位置（像素） */
  scrollTop: number
  /** 水平滚动位置（像素） */
  scrollLeft: number
  /** 可见区域高度（像素） */
  clientHeight: number
  /** 可见区域宽度（像素） */
  clientWidth: number
  /** 可滚动内容总高度（像素） */
  scrollHeight: number
  /** 可滚动内容总宽度（像素） */
  scrollWidth: number
}


