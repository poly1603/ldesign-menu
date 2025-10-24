/**
 * DOM 操作工具
 */
/**
 * 创建元素
 */
export function createElement(tag, className, attributes) {
    const element = document.createElement(tag);
    if (className) {
        element.className = className;
    }
    if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    return element;
}
/**
 * 添加类名
 */
export function addClass(element, ...classNames) {
    element.classList.add(...classNames);
}
/**
 * 移除类名
 */
export function removeClass(element, ...classNames) {
    element.classList.remove(...classNames);
}
/**
 * 切换类名
 */
export function toggleClass(element, className, force) {
    element.classList.toggle(className, force);
}
/**
 * 检查是否包含类名
 */
export function hasClass(element, className) {
    return element.classList.contains(className);
}
/**
 * 设置样式
 */
export function setStyle(element, styles) {
    Object.entries(styles).forEach(([key, value]) => {
        // @ts-expect-error - 动态样式设置
        element.style[key] = value;
    });
}
/**
 * 获取计算后的样式
 */
export function getComputedStyle(element) {
    return window.getComputedStyle(element);
}
/**
 * 查找最近的父元素
 */
export function closest(element, selector) {
    return element.closest(selector);
}
/**
 * 查询单个元素
 */
export function query(selector, parent = document) {
    return parent.querySelector(selector);
}
/**
 * 查询所有元素
 */
export function queryAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}
/**
 * 监听事件
 */
export function on(element, event, handler, options) {
    element.addEventListener(event, handler, options);
}
/**
 * 移除事件监听
 */
export function off(element, event, handler, options) {
    element.removeEventListener(event, handler, options);
}
/**
 * 一次性事件监听
 */
export function once(element, event, handler) {
    const wrappedHandler = (ev) => {
        handler.call(element, ev);
        off(element, event, wrappedHandler);
    };
    on(element, event, wrappedHandler);
}
/**
 * 获取元素的数据属性
 */
export function getData(element, key) {
    return element.getAttribute(`data-${key}`);
}
/**
 * 设置元素的数据属性
 */
export function setData(element, key, value) {
    element.setAttribute(`data-${key}`, value);
}
/**
 * 移除元素的数据属性
 */
export function removeData(element, key) {
    element.removeAttribute(`data-${key}`);
}
/**
 * 检查元素是否包含另一个元素
 */
export function contains(parent, child) {
    return parent.contains(child);
}
/**
 * 获取元素的索引
 */
export function getElementIndex(element) {
    return Array.from(element.parentElement?.children || []).indexOf(element);
}
/**
 * 插入 HTML
 */
export function insertHTML(element, html, position = 'beforeend') {
    element.insertAdjacentHTML(position, html);
}
/**
 * 移除元素
 */
export function remove(element) {
    element.remove();
}
/**
 * 清空元素内容
 */
export function empty(element) {
    element.innerHTML = '';
}
/**
 * 节流函数
 */
export function throttle(func, wait) {
    let timeout = null;
    let previous = 0;
    return function (...args) {
        const now = Date.now();
        const remaining = wait - (now - previous);
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(this, args);
        }
        else if (!timeout) {
            timeout = window.setTimeout(() => {
                previous = Date.now();
                timeout = null;
                func.apply(this, args);
            }, remaining);
        }
    };
}
/**
 * 防抖函数
 */
export function debounce(func, wait) {
    let timeout = null;
    return function (...args) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = window.setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}
//# sourceMappingURL=dom-utils.js.map