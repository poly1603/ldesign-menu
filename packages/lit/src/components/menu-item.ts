/**
 * LDesign Menu Item Web Component (Lit)
 */

import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { MenuItem as MenuItemType } from '@ldesign/menu-core'

@customElement('ldesign-menu-item')
export class MenuItem extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `

  @property({ type: Object }) item!: MenuItemType
  @property({ type: Number }) level = 0
  @property({ type: Boolean }) active = false
  @property({ type: Boolean }) expanded = false
  @property({ type: Boolean }) disabled = false

  private handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault()
      return
    }

    this.dispatchEvent(new CustomEvent('item-click', {
      detail: this.item,
      bubbles: true,
      composed: true,
    }))
  }

  render() {
    const classes = {
      'ldesign-menu-item': true,
      'ldesign-menu-item--active': this.active,
      'ldesign-menu-item--expanded': this.expanded,
      'ldesign-menu-item--disabled': this.disabled,
    }

    return html`
      <li class="${classMap(classes)}" @click="${this.handleClick}">
        <div class="ldesign-menu-item__content">
          ${this.item.icon ? html`<span class="ldesign-menu-item__icon">${this.item.icon}</span>` : ''}
          <span class="ldesign-menu-item__label">${this.item.label}</span>
          ${this.item.badge ? html`<span class="ldesign-menu-item__badge">${this.item.badge}</span>` : ''}
        </div>
      </li>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ldesign-menu-item': MenuItem
  }
}

