/**
 * DOM 操作工具
 */
/**
 * 创建元素
 */
export declare function createElement<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, attributes?: Record<string, string>): HTMLElementTagNameMap[K];
/**
 * 添加类名
 */
export declare function addClass(element: HTMLElement, ...classNames: string[]): void;
/**
 * 移除类名
 */
export declare function removeClass(element: HTMLElement, ...classNames: string[]): void;
/**
 * 切换类名
 */
export declare function toggleClass(element: HTMLElement, className: string, force?: boolean): void;
/**
 * 检查是否包含类名
 */
export declare function hasClass(element: HTMLElement, className: string): boolean;
/**
 * 设置样式
 */
export declare function setStyle(element: HTMLElement, styles: Partial<CSSStyleDeclaration> | Record<string, string>): void;
/**
 * 获取计算后的样式
 */
export declare function getComputedStyle(element: HTMLElement): CSSStyleDeclaration;
/**
 * 查找最近的父元素
 */
export declare function closest(element: HTMLElement, selector: string): HTMLElement | null;
/**
 * 查询单个元素
 */
export declare function query(selector: string, parent?: HTMLElement | Document): HTMLElement | null;
/**
 * 查询所有元素
 */
export declare function queryAll(selector: string, parent?: HTMLElement | Document): HTMLElement[];
/**
 * 监听事件
 */
export declare function on<K extends keyof HTMLElementEventMap>(element: HTMLElement | Document | Window, event: K, handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
/**
 * 移除事件监听
 */
export declare function off<K extends keyof HTMLElementEventMap>(element: HTMLElement | Document | Window, event: K, handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
/**
 * 一次性事件监听
 */
export declare function once<K extends keyof HTMLElementEventMap>(element: HTMLElement | Document | Window, event: K, handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any): void;
/**
 * 获取元素的数据属性
 */
export declare function getData(element: HTMLElement, key: string): string | null;
/**
 * 设置元素的数据属性
 */
export declare function setData(element: HTMLElement, key: string, value: string): void;
/**
 * 移除元素的数据属性
 */
export declare function removeData(element: HTMLElement, key: string): void;
/**
 * 检查元素是否包含另一个元素
 */
export declare function contains(parent: HTMLElement, child: HTMLElement): boolean;
/**
 * 获取元素的索引
 */
export declare function getElementIndex(element: HTMLElement): number;
/**
 * 插入 HTML
 */
export declare function insertHTML(element: HTMLElement, html: string, position?: InsertPosition): void;
/**
 * 移除元素
 */
export declare function remove(element: HTMLElement): void;
/**
 * 清空元素内容
 */
export declare function empty(element: HTMLElement): void;
/**
 * 节流函数
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * 防抖函数
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
