// View: renders UI and exposes minimal hooks for controller

export class CartView {
  constructor() {
    
     this.isOpen = false;
    this.refs = {
      bagCount: document.getElementById('bag-count'),
      panel: document.getElementById('cart-panel'),
      items: document.getElementById('cart-items'),
      subtotal: document.getElementById('cart-subtotal'),
      total: document.getElementById('cart-total'),
      checkout: document.getElementById('checkout-btn'),
      close: document.getElementById('cart-close'),
      bag: document.querySelector('.shopping-bag'),
    };
  }

  currency(amount) { return `$${amount.toFixed(2)}`; }
   
  
  open() { 
    if (this.refs.panel) {
      this.refs.panel.classList.add('open');
      this.refs.panel.setAttribute('aria-hidden', 'false'); 
      this.isOpen = true;
    }
  }

    close() { 
    if (this.refs.panel) {
      this.refs.panel.classList.remove('open');
      this.refs.panel.setAttribute('aria-hidden', 'true'); 
      this.isOpen = false;
    }
  }

   toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  bindToggle(handler) {
    if (this.refs.bag) this.refs.bag.addEventListener('click', (e) => { e.stopPropagation(); handler(); });
    if (this.refs.close) this.refs.close.addEventListener('click', (e) => { e.stopPropagation(); this.close(); });
    
    // impede que cliques dentro do painel fechem
     if (this.refs.panel) {this.refs.panel.addEventListener('click', (e) => { e.stopPropagation();});

    document.addEventListener('click', () => {if (this.refs.panel && this.refs.panel.classList.contains('open')) {this.close();} });}
    
    document.addEventListener('click', (e) => {
      if (!this.refs.panel) return;
      const target = e.target;
      if (this.refs.panel.classList.contains('open')) { if (!this.refs.panel.contains(target) && !this.refs.bag.contains(target)) this.close();
      }
    });
  }

  bindCartInteractions(onIncrease, onDecrease, onSetQty, onRemove) {
    if (!this.refs.items) return;
    this.refs.items.addEventListener('click', (e) => {
      const target = e.target;
      const row = target.closest('.cart-item-row');
      if (!row) return;
      const productId = row.dataset.productId;
      if (target.classList.contains('qty-increase')) onIncrease(productId);
      else if (target.classList.contains('qty-decrease')) onDecrease(productId);
      else if (target.classList.contains('cart-remove')) onRemove(productId);
    });
    this.refs.items.addEventListener('change', (e) => {
      const target = e.target;
      if (!target.classList.contains('qty-input')) return;
      const row = target.closest('.cart-item-row');
      if (!row) return;
      const productId = row.dataset.productId;
      const value = parseInt(target.value, 10);
      onSetQty(productId, isNaN(value) ? 1 : value);
    });
  }

  bindCheckout(handler) { if (this.refs.checkout) this.refs.checkout.addEventListener('click', handler); }

  render({ cart, catalog, totals }) {
  if (this.refs.bagCount) this.refs.bagCount.textContent = totals.quantity;

  if (this.refs.items) {
    const wasOpen = this.isOpen; // salva o estado
    this.refs.items.innerHTML = '';

    Object.entries(cart).forEach(([productId, qty]) => {
      const product = catalog[productId];
      if (!product) return;
      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.dataset.productId = productId;
      row.innerHTML = `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.title}" class="cart-thumb" width="56" height="56" />
          <div class="cart-item-info">
            <div class="cart-item-title">${product.title}</div>
            <div class="cart-item-price">${this.currency(product.price)}</div>
          </div>
        </div>
        <div class="cart-qty">
          <button class="qty-decrease" aria-label="Decrease">-</button>
          <input class="qty-input" type="number" min="1" value="${qty}" />
          <button class="qty-increase" aria-label="Increase">+</button>
        </div>
        <div class="cart-subtotal">${this.currency(qty * product.price)}</div>
        <button class="cart-remove" aria-label="Remove">Remove</button>
      `;
      this.refs.items.appendChild(row);
    });

    // mantém aberto se estava aberto antes do render
    if (wasOpen) this.open();
  }

  if (this.refs.subtotal) this.refs.subtotal.textContent = this.currency(totals.subtotal);
  if (this.refs.total) this.refs.total.textContent = this.currency(totals.total);
}


}