/**
 * React Context
 */

import React, { createContext, useContext } from 'react'
import type { MenuConfig } from '../types'

export interface MenuContextValue {
  defaultConfig?: Partial<MenuConfig>
}

const MenuContext = createContext<MenuContextValue>({})

export interface MenuProviderProps {
  children: React.ReactNode
  defaultConfig?: Partial<MenuConfig>
}

export function MenuProvider({ children, defaultConfig }: MenuProviderProps) {
  return (
    <MenuContext.Provider value={{ defaultConfig }}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenuContext() {
  return useContext(MenuContext)
}


