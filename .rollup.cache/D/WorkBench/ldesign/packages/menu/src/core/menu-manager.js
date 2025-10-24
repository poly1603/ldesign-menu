/**
 * 菜单管理器 - 核心类
 */
import { findMenuItem, getMenuItemChildrenIds } from '../utils/tree-utils';
import { createElement, setData, setStyle } from '../utils/dom-utils';
import { AnimationController } from './animation-controller';
import { EventDelegator } from './event-delegator';
import { EventEmitter } from './event-emitter';
import { LayoutEngine } from './layout-engine';
import { PopupManager } from './popup-manager';
import { VirtualScroller } from './virtual-scroller';
/**
 * 菜单管理器类
 */
export class MenuManager extends EventEmitter {
    constructor(config = {}) {
        super();
        this.container = null;
        this.items = [];
        // 状态管理
        this.expandedKeys = new Set();
        this.activeKey = null;
        this.collapsed = false;
        this.itemStates = new Map();
        // 合并默认配置
        this.config = {
            mode: config.mode || 'vertical',
            theme: config.theme || 'light',
            items: config.items || [],
            expandMode: config.expandMode || 'hover',
            submenuTrigger: config.submenuTrigger || 'popup',
            collapsed: config.collapsed || false,
            defaultExpandedKeys: config.defaultExpandedKeys || [],
            defaultActiveKey: config.defaultActiveKey || '',
            accordion: config.accordion || false,
            width: config.width || '240px',
            collapsedWidth: config.collapsedWidth || '64px',
            indent: config.indent || 24,
            itemHeight: config.itemHeight || 40,
            popupOffset: config.popupOffset || 4,
            virtualScroll: config.virtualScroll || false,
            virtualThreshold: config.virtualThreshold || 100,
            lazyLoad: config.lazyLoad || false,
            animation: config.animation !== false,
            animationType: config.animationType || 'slide',
            animationDuration: config.animationDuration || 300,
            animationEasing: config.animationEasing || 'cubic-bezier(0.4, 0, 0.2, 1)',
            responsive: config.responsive || false,
            collapseMode: config.collapseMode || 'more',
            breakpoint: config.breakpoint || 768,
            keyboardNavigation: config.keyboardNavigation !== false,
            onSelect: config.onSelect,
            onExpand: config.onExpand,
            onCollapse: config.onCollapse,
            onClick: config.onClick,
            onCollapsedChange: config.onCollapsedChange,
        };
        this.items = this.config.items;
        this.collapsed = this.config.collapsed;
        this.expandedKeys = new Set(this.config.defaultExpandedKeys);
        this.activeKey = this.config.defaultActiveKey || null;
        // 初始化子模块
        this.layoutEngine = new LayoutEngine(this.config);
        this.popupManager = new PopupManager(this.config.popupOffset);
        this.animationController = new AnimationController({
            type: this.config.animationType,
            duration: this.config.animationDuration,
            easing: this.config.animationEasing,
        });
        this.eventDelegator = new EventDelegator({
            onItemClick: this.handleItemClick.bind(this),
            onItemHover: this.handleItemHover.bind(this),
            onKeyboardNav: this.handleKeyboardNav.bind(this),
        });
        this.virtualScroller = new VirtualScroller({
            itemHeight: this.config.itemHeight,
            threshold: this.config.virtualThreshold,
        });
        // 设置菜单项
        this.layoutEngine.setItems(this.items);
    }
    /**
     * 挂载到容器
     */
    mount(containerOrSelector) {
        const container = typeof containerOrSelector === 'string'
            ? document.querySelector(containerOrSelector)
            : containerOrSelector;
        if (!container) {
            throw new Error('Container not found');
        }
        this.container = container;
        this.render();
        this.eventDelegator.attach(container);
    }
    /**
     * 渲染菜单
     */
    render() {
        if (!this.container) {
            return;
        }
        // 清空容器
        this.container.innerHTML = '';
        // 设置容器类名和属性
        this.container.className = this.getContainerClasses();
        setData(this.container, 'mode', this.config.mode);
        setData(this.container, 'theme', this.config.theme);
        // 设置容器样式
        this.updateContainerStyles();
        // 渲染菜单项
        const menuList = this.renderMenuItems(this.items, 0);
        this.container.appendChild(menuList);
    }
    /**
     * 获取容器类名
     */
    getContainerClasses() {
        const classes = [
            'ldesign-menu',
            `ldesign-menu--${this.config.mode}`,
            `ldesign-menu--${this.config.theme}`,
        ];
        if (this.collapsed) {
            classes.push('ldesign-menu--collapsed');
        }
        return classes.join(' ');
    }
    /**
     * 更新容器样式
     */
    updateContainerStyles() {
        if (!this.container) {
            return;
        }
        const width = this.collapsed
            ? this.config.collapsedWidth
            : this.config.width;
        if (this.config.mode === 'vertical') {
            setStyle(this.container, {
                width: typeof width === 'number' ? `${width}px` : width,
            });
        }
    }
    /**
     * 渲染菜单项列表
     */
    renderMenuItems(items, level) {
        const menuList = createElement('ul', 'ldesign-menu-list');
        setData(menuList, 'level', String(level));
        items.forEach((item) => {
            if (item.hidden) {
                return;
            }
            const menuItem = this.renderMenuItem(item, level);
            menuList.appendChild(menuItem);
        });
        return menuList;
    }
    /**
     * 渲染单个菜单项
     */
    renderMenuItem(item, level) {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = this.expandedKeys.has(item.id);
        const isActive = this.activeKey === item.id;
        // 创建菜单项元素
        const menuItem = createElement('li', 'ldesign-menu-item');
        setData(menuItem, 'menu-item-id', String(item.id));
        setData(menuItem, 'level', String(level));
        if (item.disabled) {
            menuItem.classList.add('ldesign-menu-item--disabled');
        }
        if (isActive) {
            menuItem.classList.add('ldesign-menu-item--active');
        }
        if (hasChildren) {
            menuItem.classList.add('ldesign-menu-item--has-children');
        }
        if (isExpanded) {
            menuItem.classList.add('ldesign-menu-item--expanded');
        }
        // 创建菜单项内容
        const itemContent = createElement('div', 'ldesign-menu-item__content');
        itemContent.setAttribute('tabindex', item.disabled ? '-1' : '0');
        itemContent.setAttribute('role', 'menuitem');
        // 图标
        if (item.icon) {
            const iconEl = createElement('span', 'ldesign-menu-item__icon');
            if (typeof item.icon === 'string') {
                iconEl.innerHTML = item.icon;
            }
            itemContent.appendChild(iconEl);
        }
        // 标签
        if (!this.collapsed || level > 0) {
            const labelEl = createElement('span', 'ldesign-menu-item__label');
            labelEl.textContent = item.label;
            itemContent.appendChild(labelEl);
            // 角标
            if (item.badge) {
                const badgeEl = createElement('span', 'ldesign-menu-item__badge');
                badgeEl.textContent = String(item.badge);
                itemContent.appendChild(badgeEl);
            }
            // 展开箭头
            if (hasChildren && this.config.submenuTrigger === 'inline') {
                const arrowEl = createElement('span', 'ldesign-menu-item__arrow');
                arrowEl.innerHTML = '▶';
                itemContent.appendChild(arrowEl);
            }
        }
        menuItem.appendChild(itemContent);
        // 子菜单
        if (hasChildren && this.config.submenuTrigger === 'inline' && isExpanded) {
            const submenu = this.renderMenuItems(item.children, level + 1);
            submenu.classList.add('ldesign-menu-submenu');
            menuItem.appendChild(submenu);
        }
        return menuItem;
    }
    /**
     * 处理菜单项点击
     */
    handleItemClick(itemId, event) {
        const item = findMenuItem(this.items, itemId);
        if (!item || item.disabled) {
            return;
        }
        // 触发点击事件
        if (this.config.onClick) {
            this.config.onClick(item, event);
        }
        this.emit('click', { item, event });
        const hasChildren = item.children && item.children.length > 0;
        if (hasChildren) {
            // 切换展开状态
            this.toggleExpand(itemId);
        }
        else {
            // 选中菜单项
            this.selectItem(itemId);
        }
    }
    /**
     * 处理菜单项悬停
     */
    handleItemHover(itemId, event) {
        if (this.config.expandMode !== 'hover') {
            return;
        }
        const item = findMenuItem(this.items, itemId);
        if (!item || item.disabled) {
            return;
        }
        const hasChildren = item.children && item.children.length > 0;
        if (hasChildren && this.config.submenuTrigger === 'popup') {
            // 显示 popup 子菜单
            this.showSubmenuPopup(itemId, event.currentTarget);
        }
    }
    /**
     * 处理键盘导航
     */
    handleKeyboardNav(key, itemId, event) {
        this.emit('keyboard-nav', { key, itemId, event });
    }
    /**
     * 展开菜单项
     */
    expand(itemId) {
        const item = findMenuItem(this.items, itemId);
        if (!item || !item.children) {
            return;
        }
        // 手风琴模式：关闭同级其他菜单
        if (this.config.accordion) {
            const parents = this.getItemParents(itemId);
            const siblingIds = this.getSiblingIds(itemId);
            siblingIds.forEach(id => this.collapse(id));
        }
        this.expandedKeys.add(itemId);
        if (this.config.onExpand) {
            this.config.onExpand(item);
        }
        this.emit('expand', { item });
        this.render();
    }
    /**
     * 收起菜单项
     */
    collapse(itemId) {
        const item = findMenuItem(this.items, itemId);
        if (!item) {
            return;
        }
        this.expandedKeys.delete(itemId);
        // 同时收起所有子项
        const childrenIds = getMenuItemChildrenIds(item);
        childrenIds.forEach(id => this.expandedKeys.delete(id));
        if (this.config.onCollapse) {
            this.config.onCollapse(item);
        }
        this.emit('collapse', { item });
        this.render();
    }
    /**
     * 切换展开状态
     */
    toggleExpand(itemId) {
        if (this.expandedKeys.has(itemId)) {
            this.collapse(itemId);
        }
        else {
            this.expand(itemId);
        }
    }
    /**
     * 选中菜单项
     */
    selectItem(itemId) {
        const item = findMenuItem(this.items, itemId);
        if (!item || item.disabled) {
            return;
        }
        this.activeKey = itemId;
        if (this.config.onSelect) {
            this.config.onSelect(item);
        }
        this.emit('select', { item });
        this.render();
    }
    /**
     * 显示子菜单 Popup
     */
    showSubmenuPopup(itemId, triggerElement) {
        const item = findMenuItem(this.items, itemId);
        if (!item || !item.children) {
            return;
        }
        const placement = this.config.mode === 'horizontal' ? 'bottom-start' : 'right-start';
        const submenu = this.renderMenuItems(item.children, 1);
        this.popupManager.open(`submenu-${itemId}`, triggerElement, submenu, placement, () => {
            this.emit('popup-close', { itemId });
        });
        this.emit('popup-open', { itemId });
    }
    /**
     * 切换收起状态
     */
    toggleCollapsed() {
        this.setCollapsed(!this.collapsed);
    }
    /**
     * 设置收起状态
     */
    setCollapsed(collapsed) {
        this.collapsed = collapsed;
        if (this.config.onCollapsedChange) {
            this.config.onCollapsedChange(collapsed);
        }
        this.emit('collapsed-change', { collapsed });
        this.updateContainerStyles();
        this.render();
    }
    /**
     * 更新菜单项
     */
    setItems(items) {
        this.items = items;
        this.layoutEngine.setItems(items);
        this.render();
    }
    /**
     * 更新配置
     */
    updateConfig(config) {
        this.config = {
            ...this.config,
            ...config,
        };
        this.layoutEngine.updateConfig(this.config);
        this.animationController.updateConfig({
            type: this.config.animationType,
            duration: this.config.animationDuration,
            easing: this.config.animationEasing,
        });
        this.render();
    }
    /**
     * 获取菜单项的父级 ID
     */
    getItemParents(itemId) {
        // 简化实现
        return [];
    }
    /**
     * 获取同级菜单项 ID
     */
    getSiblingIds(itemId) {
        // 简化实现
        return [];
    }
    /**
     * 卸载
     */
    unmount() {
        this.eventDelegator.destroy();
        this.popupManager.destroy();
        this.animationController.destroy();
        if (this.container) {
            this.container.innerHTML = '';
            this.container = null;
        }
        this.removeAllListeners();
    }
    /**
     * 销毁
     */
    destroy() {
        this.unmount();
    }
}
//# sourceMappingURL=menu-manager.js.map