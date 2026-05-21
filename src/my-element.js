import { productDatamanager } from './index.js';

export class DatamanagerDemo extends HTMLElement {
  connectedCallback() {
    this.textContent = 'Cargando producto...';
    this._loadFirstProduct();
  }

  async _loadFirstProduct() {
    const { rows } = await productDatamanager.getProducts({ limit: 1 });
    this.textContent = rows[0]?.concept || 'No hay productos disponibles';
  }
}

if (!customElements.get('datamanager-demo')) {
  customElements.define('datamanager-demo', DatamanagerDemo);
}
