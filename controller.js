// Controller: wires events and orchestrates Model <-> View

import { CartModel } from '../model/model.js';
import { CartView } from '../view/view.js';

class CartController {
  constructor() {
    this.model = new CartModel();
    this.view = new CartView();

    this.view.bindToggle(() => this.view.toggle());
    this.view.bindCartInteractions(
      (productId) => this.model.add(productId, 1),
      (productId) => this.model.setQuantity(productId, (this.model.cart[productId] || 1) - 1),
      (productId, qty) => this.model.setQuantity(productId, qty),
      (productId) => this.model.remove(productId)
    );

    this.view.bindCheckout(() => {
      const snap = this.model.getSnapshot();
      const items = Object.entries(snap.cart).map(([productId, qty]) => {
        const p = snap.catalog[productId];
        return { title: p?.title || productId, qty, line: (p?.price || 0) * qty };
      });
      const total = snap.totals.total;
      alert(`Checkout preview\n\n${items.map(i => `${i.title} x${i.qty} = $${i.line.toFixed(2)}`).join('\n')}\n\nTotal: $${total.toFixed(2)}`);
      this.model.clear();
    });

    this.model.subscribe((snapshot) => { this.view.render(snapshot); });

    document.querySelectorAll('.add-to-bag').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = btn.dataset.productId;
        this.model.add(productId, 1);
      });
    });

    this.view.render(this.model.getSnapshot());
    
  }
}

window.addEventListener('DOMContentLoaded', () => { new CartController(); });