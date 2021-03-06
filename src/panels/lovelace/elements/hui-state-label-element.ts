import { html, LitElement, TemplateResult } from "lit-element";

import "../../../components/entity/ha-state-label-badge";

import computeStateDisplay from "../../../common/entity/compute_state_display";
import { computeTooltip } from "../common/compute-tooltip";
import { handleClick } from "../common/handle-click";
import { longPress } from "../common/directives/long-press-directive";
import { LovelaceElement, LovelaceElementConfig } from "./types";
import { HomeAssistant } from "../../../types";

interface Config extends LovelaceElementConfig {
  prefix?: string;
  suffix?: string;
}

class HuiStateLabelElement extends LitElement implements LovelaceElement {
  public hass?: HomeAssistant;
  private _config?: Config;

  static get properties() {
    return { hass: {}, _config: {} };
  }

  public setConfig(config: Config): void {
    if (!config.entity) {
      throw Error("Invalid Configuration: 'entity' required");
    }

    this._config = config;
  }

  protected render(): TemplateResult | void {
    if (!this._config) {
      return html``;
    }

    const state = this.hass!.states[this._config.entity!];
    return html`
      ${this.renderStyle()}
      <div
        .title="${computeTooltip(this.hass!, this._config)}"
        @ha-click="${this._handleTap}"
        @ha-hold="${this._handleHold}"
        .longPress="${longPress()}"
      >
        ${this._config.prefix}${state
          ? computeStateDisplay(this.hass!.localize, state, this.hass!.language)
          : "-"}${this._config.suffix}
      </div>
    `;
  }

  private _handleTap() {
    handleClick(this, this.hass!, this._config!, false);
  }

  private _handleHold() {
    handleClick(this, this.hass!, this._config!, true);
  }

  private renderStyle(): TemplateResult {
    return html`
      <style>
        :host {
          cursor: pointer;
        }
        div {
          padding: 8px;
          white-space: nowrap;
        }
      </style>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hui-state-label-element": HuiStateLabelElement;
  }
}

customElements.define("hui-state-label-element", HuiStateLabelElement);
