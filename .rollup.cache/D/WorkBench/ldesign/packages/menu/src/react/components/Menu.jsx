/**
 * React 菜单组件
 */
import { forwardRef, useImperativeHandle } from 'react';
import { useMenu } from '../hooks/useMenu';
import { useMenuContext } from '../context';
export const Menu = forwardRef((props, ref) => {
    const { items = [], mode = 'vertical', theme = 'light', collapsed = false, animation = true, keyboardNavigation = true, className, style, children, ...restProps } = props;
    const { defaultConfig } = useMenuContext();
    const mergedProps = { ...defaultConfig, ...restProps, mode, theme, items, collapsed, animation, keyboardNavigation };
    const { containerRef, menuRef, expandedKeys, activeKey, collapsed: collapsedState, expand, collapse: collapseItem, toggleExpand, selectItem, setCollapsed, toggleCollapsed, setItems, updateConfig, } = useMenu(mergedProps);
    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
        expand,
        collapse: collapseItem,
        toggleExpand,
        selectItem,
        setCollapsed,
        toggleCollapsed,
        setItems,
        updateConfig,
    }));
    const menuClasses = [
        'ldesign-menu',
        `ldesign-menu--${mode}`,
        `ldesign-menu--${theme}`,
        collapsedState && 'ldesign-menu--collapsed',
        !animation && 'ldesign-menu--no-animation',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    return (<div ref={containerRef} className={menuClasses} style={style} data-mode={mode} data-theme={theme}>
      {children}
    </div>);
});
Menu.displayName = 'Menu';
//# sourceMappingURL=Menu.jsx.map