import { renderSpinner, showAlert } from "../helpers/helpers.js";
import { order } from "./checkout.js";

const addToCartBtns = document.querySelectorAll(".addToCart");
const updateCartBtn = document.querySelector(".updateCart");

const cartQtyEls = document.querySelectorAll(".cartQty");
const itemQtyEl = document.querySelector(".itemQty");

const cartContainer = document.querySelector(".cartContainer");
const itemContainer = document.querySelector(".itemContainer");

const cartSubtotalEl = document.querySelector(".cartSubtotal");
const myCartSubtotalEl = document.querySelector(".myCartSubtotal");
const cartPageSubtotal = document.querySelector(".cartPageSubtotal");
const cartTotalFooter = document.querySelector(".cartTotal");

const itemColourEls = document.querySelectorAll(".productColour");

const productContainer = document.querySelector(".productContainer");
const finalOrderItemContainer = document.querySelector(
  ".productContainerSummary"
);

const orderConfirmedEl = document.querySelector(".orderConfirmed");

class Cart {
  constructor() {
    this.items = [];
    this.subtotal = 0;
    this.itemQuantity = 0;
  }

  addToCart(btn) {
    const product = JSON.parse(btn.dataset.product);
    const item = {
      title: product.title,
      type: product.id,
      price: product.priceDiscount || product.price,
      images: product.images,
      colour: this._findSelectedColour(),
    };

    // return console.log(item);
    this.itemQuantity++;

    // 1. Check for duplicates
    if (this.checkForDuplicates(item)) return;

    // 2. Add to items array or increase quantity
    item.orderQuantity = +itemQtyEl?.value || 1;

    this.items.push(item);
    this._calcTotals();
    this.renderCartIcon();
  }

  renderCartIcon() {
    cartContainer.innerHTML = "";
    this.items.forEach((item) => {
      const html = this._createItemHTML(item);
      cartContainer.insertAdjacentHTML("afterbegin", html);
    });

    cartQtyEls.forEach((el) => (el.textContent = this.itemQuantity));
    myCartSubtotalEl.innerHTML = `<small>My Cart</small>GHS ${this.subtotal}`;
    cartSubtotalEl.textContent = `GHS ${this.subtotal.toFixed(2)}`;
    cartTotalFooter.textContent = `GHS ${this.subtotal.toFixed(2)}`;
    this._addListenersRemoveBtns();
    this.saveToLocalStorage();

    if (finalOrderItemContainer) order.renderFinalOrderInfo();

    if (productContainer) order.renderOrderSummary();
  }

  _findSelectedColour() {
    let selectedColour = "";

    itemColourEls.forEach((el) => {
      if (!el) return;

      if (el.checked) selectedColour = el.value;
    });

    return selectedColour;
  }

  renderCartPage() {
    itemContainer.innerHTML = "";
    this.items.forEach((item) => {
      const html = this._createCartPageHTML(item);
      itemContainer.insertAdjacentHTML("afterbegin", html);
    });
    cartPageSubtotal.textContent = `GHS ${this.subtotal.toFixed(2)}`;
    cartTotalFooter.textContent = `GHS ${this.subtotal.toFixed(2)}`;
    this._addListenersRemoveBtns();
    this.saveToLocalStorage();
  }

  updateCart() {
    const cartPageItemEls = document.querySelectorAll(".cartItem");

    renderSpinner("updateCart", "render", "Updating Cart...");
    cartPageItemEls.forEach((el) => {
      // Find the Product
      const itemToUpdate = this.items.find(
        (item) => item.title === el.dataset.title
      );
      itemToUpdate.orderQuantity = +el.value;
    });

    this._calcTotals();
    this.renderCartIcon();
    this.renderCartPage();

    setTimeout(() => renderSpinner("updateCart", "remove"), 500);
  }

  handleRemoveFromCart(e) {
    const removedItemIdx = this.items.findIndex(
      (item) => item.title === e.target.dataset.title
    );

    this.items.splice(removedItemIdx, 1);

    this._calcTotals();
    this.renderCartIcon();
    if (cartPageSubtotal) this.renderCartPage();
  }

  _addListenersRemoveBtns() {
    const removeBtns = document.querySelectorAll(".removeItem");
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", this.handleRemoveFromCart.bind(this));
    });
  }

  _calcTotals() {
    this.subtotal = 0;
    this.itemQuantity = 0;

    this.items.forEach((item) => {
      const price = item.priceDiscount || item.price;
      this.subtotal += price * item.orderQuantity;
      this.itemQuantity += item.orderQuantity;
    });

    return this;
  }

  checkForDuplicates(cartItem) {
    if (!this.items.length) return false;

    const duplicate = this.items.find(
      (item) => item.title === cartItem.title && item.colour === cartItem.colour
    );
    if (duplicate) {
      duplicate.orderQuantity += +itemQtyEl?.value || 1;
      // console.log("Duplicate Found!", duplicate);
    }

    this._calcTotals();
    this.renderCartIcon();
    return duplicate;
  }

  saveToLocalStorage() {
    localStorage.setItem("items", JSON.stringify(this.items));
    localStorage.setItem("subtotal", JSON.stringify(this.subtotal));
    localStorage.setItem("itemQuantity", JSON.stringify(this.itemQuantity));
  }

  init() {
    const items = localStorage.getItem("items");
    const subtotal = localStorage.getItem("subtotal");
    const itemQuantity = localStorage.getItem("itemQuantity");

    if (items) {
      this.items = JSON.parse(items);
      this.subtotal = JSON.parse(subtotal);
      this.itemQuantity = JSON.parse(itemQuantity);
      this.renderCartIcon();
    }

    // localStorage.clear();
  }

  clearCart() {
    localStorage.clear();
    this.items = [];
    this.subtotal = 0;
    this.itemQuantity = 0;
    this.renderCartIcon();
  }

  _createItemHTML(product) {
    const html = `<div class="widget-cart-item py-2 border-bottom"><button class="btn-close text-danger" type="button" aria-label="Remove"><span class="removeItem" data-title="${
      product.title
    }" aria-hidden="true">&times;</span></button>
    <div class="d-flex align-items-center"><a class="flex-shrink-0" href="products/${
      product.slug
    }"><img src="${product.images[0]}" width="64" alt="${product.title}" /></a>
        <div class="ps-2">
            <h6 class="widget-product-title"><a href="/products/${
              product.slug
            }">${product.title} - ${product.colour}</a></h6>
            <div class="widget-product-meta"><span class="text-accent me-2">GHS ${
              product.priceDiscount || product.price
            }.<small>00</small></span><span class="text-muted">x ${
      product.orderQuantity
    }</span></div>
        </div>
    </div>
</div>`;

    return html;
  }

  _createCartPageHTML(product) {
    const html = `<div class="d-sm-flex justify-content-between align-items-center my-2 pb-3 border-bottom">
    <div class="d-block d-sm-flex align-items-center text-center text-sm-start"><a class="d-inline-block flex-shrink-0 mx-auto me-sm-4" href="/products/${
      product.slug
    }"><img src="${product.images[0]}" width="160" alt="${product.title}" /></a>
        <div class="pt-2">
            <h3 class="product-title fs-base mb-2"><a href="/products/${
              product.slug
            }">${product.title} - ${product.colour}</a></h3>
            <div class="fs-lg text-accent pt-2">GHS ${
              product.priceDiscount || product.price
            }<small></small></div>
        </div>
    </div>
    <div class="pt-2 pt-sm-0 ps-sm-3 mx-auto mx-sm-0 text-center text-sm-start" style="max-width: 9rem;"><label class="form-label" for="quantity2">Quantity</label><input class="form-control cartItem" data-title="${
      product.title
    }" id="quantity2" type="number" min="1" value="${
      product.orderQuantity
    }" /><button class="removeItem btn btn-link px-0 text-danger"  data-title="${
      product.title
    }" type="button"><i class="ci-close-circle me-2"></i><span class="fs-sm">Remove</span></button></div>
</div>`;

    return html;
  }
}

export const cart = new Cart();

if (cartContainer) {
  cart.init();
}

if (itemContainer) {
  cart.renderCartPage();
}

if (addToCartBtns) {
  addToCartBtns.forEach((btn) =>
    btn.addEventListener("click", handleAddToCart)
  );
}
if (updateCartBtn) updateCartBtn.addEventListener("click", handleUpdateCart);

if (orderConfirmedEl) cart.clearCart();

// //// EVENT HANDLERS

function handleAddToCart(e) {
  e.preventDefault();
  cart.addToCart(this);
}

function handleUpdateCart(e) {
  e.preventDefault();
  cart.updateCart();
}
