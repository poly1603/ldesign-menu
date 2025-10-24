/**
 * 虚拟滚动器
 */
/**
 * 虚拟滚动器类
 */
export class VirtualScroller {
    constructor(config = {}) {
        this.items = [];
        this.visibleRange = { start: 0, end: 0 };
        this.config = {
            itemHeight: config.itemHeight || 40,
            threshold: config.threshold || 100,
            overscan: config.overscan || 3,
        };
        this.scrollState = {
            scrollTop: 0,
            scrollLeft: 0,
            clientHeight: 0,
            clientWidth: 0,
            scrollHeight: 0,
            scrollWidth: 0,
        };
    }
    /**
     * 设置菜单项
     */
    setItems(items) {
        this.items = items;
        this.calculateVisibleRange();
    }
    /**
     * 更新滚动状态
     */
    updateScrollState(state) {
        this.scrollState = {
            ...this.scrollState,
            ...state,
        };
        this.calculateVisibleRange();
    }
    /**
     * 计算可见范围
     */
    calculateVisibleRange() {
        if (this.items.length === 0) {
            this.visibleRange = { start: 0, end: 0 };
            return;
        }
        const { scrollTop, clientHeight } = this.scrollState;
        const { itemHeight, overscan } = this.config;
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        const endIndex = Math.min(this.items.length - 1, Math.ceil((scrollTop + clientHeight) / itemHeight) + overscan);
        this.visibleRange = {
            start: startIndex,
            end: endIndex,
        };
    }
    /**
     * 获取可见范围
     */
    getVisibleRange() {
        return this.visibleRange;
    }
    /**
     * 获取可见的菜单项
     */
    getVisibleItems() {
        const { start, end } = this.visibleRange;
        return this.items.slice(start, end + 1);
    }
    /**
     * 获取总高度
     */
    getTotalHeight() {
        return this.items.length * this.config.itemHeight;
    }
    /**
     * 获取偏移量
     */
    getOffset() {
        return this.visibleRange.start * this.config.itemHeight;
    }
    /**
     * 滚动到指定项
     */
    scrollToItem(index) {
        const scrollTop = index * this.config.itemHeight;
        return scrollTop;
    }
    /**
     * 判断是否需要启用虚拟滚动
     */
    shouldEnable() {
        return this.items.length >= this.config.threshold;
    }
    /**
     * 更新配置
     */
    updateConfig(config) {
        this.config = {
            ...this.config,
            ...config,
        };
        this.calculateVisibleRange();
    }
}
//# sourceMappingURL=virtual-scroller.js.map