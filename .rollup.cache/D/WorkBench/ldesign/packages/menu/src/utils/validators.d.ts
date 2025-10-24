/**
 * 数据验证工具
 */
import type { MenuItem, MenuConfig } from '../types';
/**
 * 验证菜单项
 */
export declare function validateMenuItem(item: any): item is MenuItem;
/**
 * 验证菜单配置
 */
export declare function validateMenuConfig(config: any): config is MenuConfig;
/**
 * 检查是否为有效的 ID
 */
export declare function isValidId(id: any): id is string | number;
/**
 * 检查是否为有效的颜色值
 */
export declare function isValidColor(color: string): boolean;
/**
 * 检查是否为有效的尺寸值
 */
export declare function isValidSize(size: string | number): boolean;
/**
 * 规范化尺寸值（添加 px 单位）
 */
export declare function normalizeSize(size: string | number): string;
/**
 * 检查两个菜单项是否相同
 */
export declare function isEqualMenuItem(a: MenuItem, b: MenuItem): boolean;
/**
 * 深度克隆菜单项
 */
export declare function cloneMenuItem(item: MenuItem): MenuItem;
/**
 * 深度克隆菜单数据
 */
export declare function cloneMenuItems(items: MenuItem[]): MenuItem[];
