class Inventory {
  constructor(name, price, img, id, qty, orders) {
    this.inventoryName = name;
    this.inventoryPrice = price;
    this.published = false;
    this.productImg = img || null;
    this.productId = id || null;
    this.quantity = qty || 0;
    this.orders = orders || [];
  }
}

export default Inventory;
