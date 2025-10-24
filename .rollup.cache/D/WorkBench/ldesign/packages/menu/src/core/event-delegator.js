/**
 * 事件委托器
 */
import { KeyCode } from '../types/events';
import { closest, getData, off, on } from '../utils/dom-utils';
import { createKeyboardHandler, focusFirst, focusLast, focusNext, focusPrevious, } from '../utils/keyboard-utils';
/**
 * 事件委托器类
 */
export class EventDelegator {
    constructor(config = {}) {
        this.container = null;
        this.keyboardEnabled = true;
        this.config = config;
    }
    /**
     * 绑定容器
     */
    attach(container) {
        if (this.container) {
            this.detach();
        }
        this.container = container;
        // 点击事件
        on(container, 'click', this.handleClick.bind(this));
        // 鼠标悬停事件
        on(container, 'mouseenter', this.handleMouseEnter.bind(this), true);
        on(container, 'mouseleave', this.handleMouseLeave.bind(this), true);
        // 键盘导航
        if (this.keyboardEnabled) {
            on(container, 'keydown', this.handleKeydown.bind(this));
            on(container, 'focus', this.handleFocus.bind(this), true);
            on(container, 'blur', this.handleBlur.bind(this), true);
        }
    }
    /**
     * 解绑容器
     */
    detach() {
        if (!this.container) {
            return;
        }
        off(this.container, 'click', this.handleClick.bind(this));
        off(this.container, 'mouseenter', this.handleMouseEnter.bind(this), true);
        off(this.container, 'mouseleave', this.handleMouseLeave.bind(this), true);
        if (this.keyboardEnabled) {
            off(this.container, 'keydown', this.handleKeydown.bind(this));
            off(this.container, 'focus', this.handleFocus.bind(this), true);
            off(this.container, 'blur', this.handleBlur.bind(this), true);
        }
        this.container = null;
    }
    /**
     * 处理点击事件
     */
    handleClick(event) {
        const target = event.target;
        const menuItem = closest(target, '[data-menu-item-id]');
        if (menuItem) {
            const itemId = getData(menuItem, 'menu-item-id');
            if (itemId && this.config.onItemClick) {
                this.config.onItemClick(itemId, event);
            }
        }
    }
    /**
     * 处理鼠标进入事件
     */
    handleMouseEnter(event) {
        const target = event.target;
        const menuItem = closest(target, '[data-menu-item-id]');
        if (menuItem) {
            const itemId = getData(menuItem, 'menu-item-id');
            if (itemId && this.config.onItemHover) {
                this.config.onItemHover(itemId, event);
            }
        }
    }
    /**
     * 处理鼠标离开事件
     */
    handleMouseLeave(event) {
        // 可以在这里处理鼠标离开逻辑
    }
    /**
     * 处理聚焦事件
     */
    handleFocus(event) {
        const target = event.target;
        const menuItem = closest(target, '[data-menu-item-id]');
        if (menuItem) {
            const itemId = getData(menuItem, 'menu-item-id');
            if (itemId && this.config.onItemFocus) {
                this.config.onItemFocus(itemId, event);
            }
        }
    }
    /**
     * 处理失焦事件
     */
    handleBlur(event) {
        const target = event.target;
        const menuItem = closest(target, '[data-menu-item-id]');
        if (menuItem) {
            const itemId = getData(menuItem, 'menu-item-id');
            if (itemId && this.config.onItemBlur) {
                this.config.onItemBlur(itemId, event);
            }
        }
    }
    /**
     * 处理键盘事件
     */
    handleKeydown(event) {
        if (!this.container) {
            return;
        }
        const target = event.target;
        const menuItem = closest(target, '[data-menu-item-id]');
        if (!menuItem) {
            return;
        }
        const itemId = getData(menuItem, 'menu-item-id');
        if (!itemId) {
            return;
        }
        const handler = createKeyboardHandler({
            [KeyCode.ARROW_UP]: (e) => {
                e.preventDefault();
                focusPrevious(this.container, menuItem);
                if (this.config.onKeyboardNav) {
                    this.config.onKeyboardNav(KeyCode.ARROW_UP, itemId, e);
                }
            },
            [KeyCode.ARROW_DOWN]: (e) => {
                e.preventDefault();
                focusNext(this.container, menuItem);
                if (this.config.onKeyboardNav) {
                    this.config.onKeyboardNav(KeyCode.ARROW_DOWN, itemId, e);
                }
            },
            [KeyCode.ARROW_LEFT]: (e) => {
                e.preventDefault();
                if (this.config.onKeyboardNav) {
                    this.config.onKeyboardNav(KeyCode.ARROW_LEFT, itemId, e);
                }
            },
            [KeyCode.ARROW_RIGHT]: (e) => {
                e.preventDefault();
                if (this.config.onKeyboardNav) {
                    this.config.onKeyboardNav(KeyCode.ARROW_RIGHT, itemId, e);
                }
            },
            [KeyCode.ENTER]: (e) => {
                e.preventDefault();
                if (this.config.onKeyboardNav) {
                    this.config.onKeyboardNav(KeyCode.ENTER, itemId, e);
                }
            },
            [KeyCode.SPACE]: (e) => {
                e.preventDefault();
                if (this.config.onKeyboardNav) {
                    this.config.onKeyboardNav(KeyCode.SPACE, itemId, e);
                }
            },
            [KeyCode.ESC]: (e) => {
                e.preventDefault();
                if (this.config.onKeyboardNav) {
                    this.config.onKeyboardNav(KeyCode.ESC, itemId, e);
                }
            },
            [KeyCode.HOME]: (e) => {
                e.preventDefault();
                focusFirst(this.container);
                if (this.config.onKeyboardNav) {
                    this.config.onKeyboardNav(KeyCode.HOME, itemId, e);
                }
            },
            [KeyCode.END]: (e) => {
                e.preventDefault();
                focusLast(this.container);
                if (this.config.onKeyboardNav) {
                    this.config.onKeyboardNav(KeyCode.END, itemId, e);
                }
            },
        });
        handler(event);
    }
    /**
     * 启用键盘导航
     */
    enableKeyboard() {
        this.keyboardEnabled = true;
        if (this.container) {
            on(this.container, 'keydown', this.handleKeydown.bind(this));
        }
    }
    /**
     * 禁用键盘导航
     */
    disableKeyboard() {
        this.keyboardEnabled = false;
        if (this.container) {
            off(this.container, 'keydown', this.handleKeydown.bind(this));
        }
    }
    /**
     * 更新配置
     */
    updateConfig(config) {
        this.config = {
            ...this.config,
            ...config,
        };
    }
    /**
     * 销毁
     */
    destroy() {
        this.detach();
    }
}
//# sourceMappingURL=event-delegator.js.map