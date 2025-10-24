/**
 * 树形数据处理工具
 */
import type { FlatMenuItem, MenuItem } from '../types';
/**
 * 扁平化树形数据
 */
export declare function flattenTree(items: MenuItem[], level?: number, parentId?: string | number, path?: (string | number)[]): FlatMenuItem[];
/**
 * 根据 ID 查找菜单项
 */
export declare function findMenuItem(items: MenuItem[], id: string | number): MenuItem | undefined;
/**
 * 根据路径查找菜单项
 */
export declare function findMenuItemByPath(items: MenuItem[], path: string): MenuItem | undefined;
/**
 * 获取菜单项的所有父级
 */
export declare function getMenuItemParents(items: MenuItem[], id: string | number): MenuItem[];
/**
 * 获取菜单项的所有子级 ID
 */
export declare function getMenuItemChildrenIds(item: MenuItem): (string | number)[];
/**
 * 过滤菜单树
 */
export declare function filterMenuTree(items: MenuItem[], predicate: (item: MenuItem) => boolean): MenuItem[];
/**
 * 遍历菜单树
 */
export declare function traverseMenuTree(items: MenuItem[], callback: (item: MenuItem, level: number, parent?: MenuItem) => void, level?: number, parent?: MenuItem): void;
/**
 * 映射菜单树
 */
export declare function mapMenuTree<T>(items: MenuItem[], mapper: (item: MenuItem, level: number) => T, level?: number): T[];
/**
 * 获取菜单树的最大深度
 */
export declare function getMenuTreeDepth(items: MenuItem[]): number;
/**
 * 检查菜单项是否有权限
 */
export declare function hasPermission(item: MenuItem, userPermissions: string[]): boolean;
/**
 * 根据权限过滤菜单
 */
export declare function filterMenuByPermissions(items: MenuItem[], userPermissions: string[]): MenuItem[];
