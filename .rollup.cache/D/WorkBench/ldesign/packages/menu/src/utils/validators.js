/**
 * 数据验证工具
 */
/**
 * 验证菜单项
 */
export function validateMenuItem(item) {
    if (!item || typeof item !== 'object') {
        return false;
    }
    if (!('id' in item) || (typeof item.id !== 'string' && typeof item.id !== 'number')) {
        return false;
    }
    if (!('label' in item) || typeof item.label !== 'string') {
        return false;
    }
    if ('children' in item && item.children !== undefined) {
        if (!Array.isArray(item.children)) {
            return false;
        }
        return item.children.every((child) => validateMenuItem(child));
    }
    return true;
}
/**
 * 验证菜单配置
 */
export function validateMenuConfig(config) {
    if (!config || typeof config !== 'object') {
        return false;
    }
    if ('mode' in config && !['horizontal', 'vertical'].includes(config.mode)) {
        return false;
    }
    if ('items' in config && config.items !== undefined) {
        if (!Array.isArray(config.items)) {
            return false;
        }
        return config.items.every((item) => validateMenuItem(item));
    }
    return true;
}
/**
 * 检查是否为有效的 ID
 */
export function isValidId(id) {
    return typeof id === 'string' || typeof id === 'number';
}
/**
 * 检查是否为有效的颜色值
 */
export function isValidColor(color) {
    // 简单的颜色验证
    const colorRegex = /^(#[0-9a-f]{3,8}|rgb\(|rgba\(|hsl\(|hsla\(|[a-z]+)$/i;
    return colorRegex.test(color);
}
/**
 * 检查是否为有效的尺寸值
 */
export function isValidSize(size) {
    if (typeof size === 'number') {
        return !Number.isNaN(size) && size >= 0;
    }
    if (typeof size === 'string') {
        const sizeRegex = /^(\d+(\.\d+)?(px|em|rem|%|vh|vw)?|auto|inherit|initial|unset)$/;
        return sizeRegex.test(size);
    }
    return false;
}
/**
 * 规范化尺寸值（添加 px 单位）
 */
export function normalizeSize(size) {
    if (typeof size === 'number') {
        return `${size}px`;
    }
    return size;
}
/**
 * 检查两个菜单项是否相同
 */
export function isEqualMenuItem(a, b) {
    return a.id === b.id;
}
/**
 * 深度克隆菜单项
 */
export function cloneMenuItem(item) {
    const cloned = {
        ...item,
    };
    if (item.children) {
        cloned.children = item.children.map(child => cloneMenuItem(child));
    }
    return cloned;
}
/**
 * 深度克隆菜单数据
 */
export function cloneMenuItems(items) {
    return items.map(item => cloneMenuItem(item));
}
//# sourceMappingURL=validators.js.map