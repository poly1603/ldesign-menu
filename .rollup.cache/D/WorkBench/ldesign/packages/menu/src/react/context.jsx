/**
 * React Context
 */
import { createContext, useContext } from 'react';
const MenuContext = createContext({});
export function MenuProvider({ children, defaultConfig }) {
    return (<MenuContext.Provider value={{ defaultConfig }}>
      {children}
    </MenuContext.Provider>);
}
export function useMenuContext() {
    return useContext(MenuContext);
}
//# sourceMappingURL=context.jsx.map