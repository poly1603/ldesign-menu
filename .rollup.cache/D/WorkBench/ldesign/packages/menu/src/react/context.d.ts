/**
 * React Context
 */
import React from 'react';
import type { MenuConfig } from '../types';
export interface MenuContextValue {
    defaultConfig?: Partial<MenuConfig>;
}
export interface MenuProviderProps {
    children: React.ReactNode;
    defaultConfig?: Partial<MenuConfig>;
}
export declare function MenuProvider({ children, defaultConfig }: MenuProviderProps): import("vue/jsx-runtime").JSX.Element;
export declare function useMenuContext(): any;
