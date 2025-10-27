/**
 * LDesign Menu Web Component (Lit)
 */

import { LitElement, html, css, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { classMap } from 'lit/directives/class-map.js'
import { MenuManager, MenuItem as MenuItemType, MenuConfig } from '@ldesign/menu-core'

@customElement('ldesign-menu')
export class Menu extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `

  @property({ type: Array }) items: MenuItemType[] = []
  @property({ type: String }) mode: 'horizontal' | 'vertical' = 'vertical'
  @property({ type: String }) theme: 'light' | 'dark' | 'material' = 'light'
  @property({ type: Boolean }) collapsed = false
  @property({ type: Boolean }) animation = true
  @property({ type: Boolean }) accordion = false
  @property({ type: Number }) indent = 24
  @property({ type: Array }) defaultExpandedKeys: (string | number)[] = []
  @property({ type: String, attribute: 'default-active-key' }) defaultActiveKey: string | number = ''

  @state() private expandedKeys: Set<string | number> = new Set()
  @state() private activeKey: string | number | null = null

  private menuManager?: MenuManager

  connectedCallback() {
    super.connectedCallback()
    this.expandedKeys = new Set(this.defaultExpandedKeys)
    this.activeKey = this.defaultActiveKey || null
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties)
    this.initializeMenu()
  }

  private initializeMenu() {
    const config: MenuConfig = {
      mode: this.mode,
      theme: this.theme,
      items: this.items,
      collapsed: this.collapsed,
      animation: this.animation,
      accordion: this.accordion,
      indent: this.indent,
      defaultExpandedKeys: Array.from(this.expandedKeys),
      defaultActiveKey: this.activeKey || undefined,
      onSelect: (item) => this.handleSelect(item),
      onExpand: (item) => this.handleExpand(item),
      onCollapse: (item) => this.handleCollapse(item),
    }

    // Use the core MenuManager
    this.menuManager = new MenuManager(config)

    // Mount to shadow root
    const container = this.shadowRoot?.querySelector('#menu-container')
    if (container) {
      this.menuManager.mount(container as HTMLElement)
    }
  }

  private handleSelect(item: MenuItemType) {
    this.activeKey = item.id
    this.dispatchEvent(new CustomEvent('select', {
      detail: item,
      bubbles: true,
      composed: true,
    }))
  }

  private handleExpand(item: MenuItemType) {
    this.expandedKeys.add(item.id)
    this.requestUpdate()
    this.dispatchEvent(new CustomEvent('expand', {
      detail: item,
      bubbles: true,
      composed: true,
    }))
  }

  private handleCollapse(item: MenuItemType) {
    this.expandedKeys.delete(item.id)
    this.requestUpdate()
    this.dispatchEvent(new CustomEvent('collapse', {
      detail: item,
      bubbles: true,
      composed: true,
    }))
  }

  // Public methods
  public expand(itemId: string | number) {
    this.menuManager?.expand(itemId)
  }

  public collapse(itemId: string | number) {
    this.menuManager?.collapse(itemId)
  }

  public selectItem(itemId: string | number) {
    this.menuManager?.selectItem(itemId)
  }

  public setCollapsed(collapsed: boolean) {
    this.collapsed = collapsed
    this.menuManager?.setCollapsed(collapsed)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.menuManager?.destroy()
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties)

    if (changedProperties.has('items') ||
      changedProperties.has('mode') ||
      changedProperties.has('theme')) {
      // Reinitialize menu if major props change
      this.menuManager?.destroy()
      this.initializeMenu()
    }
  }

  render() {
    return html`
      <link rel="stylesheet" href="./menu-core.css">
      <div id="menu-container"></div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ldesign-menu': Menu
  }
}

