// Model: manages catalog, cart state, persistence, and totals

export class CartModel {
  constructor(storageKey = 'cart') {
    this.storageKey = storageKey;
    this.subscribers = new Set();
    this.catalog = {
      "0001": {
        id: "0001",
        title: "Nike Dunk Low (GS) Shadow",
        price: 95.00,
        image: "Imgs%20%26%20Icons/Nike Dunk Low (GS) Shadow - 5_5Y _ COLLEGE GREY_BLACK-WHITE.jpg"
      },
      "0002": {
        id: "0002",
        title: "Nike Dunk Low Next Nature Sneakers",
        price: 120.00,
        image: "Imgs%20%26%20Icons/Nike Dunk Low Next Nature Sneakers - White.jpg"
      },
      "0003": {
        id: "0003",
        title: "Nike Dunk Low Twist",
        price: 65.00,
        image: "Imgs%20%26%20Icons/Nike%20Shoes%20_%20Nike%20Dunk%20Low%20Twist%20_%20Color_%20Brown_White%20_%20Size_%208_5.jpg"
      },
      "0004": {
        id: "0004",
        title: "Nike Dunk Panda",
        price: 120.00,
       image: "Imgs%20%26%20Icons/Nike%20Shoes%20_%20Nike%20Dunk%20Panda%20_%20Color_%20Black%20_%20Size_%209.jpg"
      },
      "0005": {
        id: "0005",
        title: "Nike Dunk Low Retro Se 'Nola' Sail Bone",
        price: 120.00,
        image: "Imgs%20%26%20Icons/Nike%20Shoes%20_%20Nike%20Mens%20Dunk%20Low%20Retro%20Se%20'Nola'%20Sail%20Bone%20Hv5750-133%20Size%2012%20_%20Color_%20Cream_Purple%20_%20Size_%2012.jpg"
      }
    };
    this.cart = {};
    //this.load();
    localStorage.removeItem(this.storageKey);

  }

  subscribe(listener) { this.subscribers.add(listener); }
  unsubscribe(listener) { this.subscribers.delete(listener); }
  notify() { this.subscribers.forEach((fn) => fn(this.getSnapshot())); }

  getSnapshot() {
    return {
      cart: { ...this.cart },
      catalog: this.catalog,
      totals: this.getTotals(),
    };
  }
  


  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      this.cart = raw ? JSON.parse(raw) : {};
    } catch (e) {
      
      this.cart = {};
    }
  }

  save() { localStorage.setItem(this.storageKey, JSON.stringify(this.cart)); }

  getTotals() {
    let quantity = 0;
    let subtotal = 0;
    Object.entries(this.cart).forEach(([productId, qty]) => {
      const product = this.catalog[productId];
      if (!product) return;
      quantity += qty;
      subtotal += qty * product.price;
    });
    return { quantity, subtotal, total: subtotal };
  }

  add(productId, qty = 1) {
    if (!this.catalog[productId]) return;
    this.cart[productId] = (this.cart[productId] || 0) + qty;
    this.save();
    this.notify();
  }

  setQuantity(productId, qty) {
    if (!this.catalog[productId]) return;
    const next = Math.max(1, Math.floor(qty || 1));
    this.cart[productId] = next;
    this.save();
    this.notify();
  }

  remove(productId) {
    delete this.cart[productId];
    this.save();
    this.notify();
  }

  clear() {
    this.cart = {};
    this.save();
    this.notify();
  }
}