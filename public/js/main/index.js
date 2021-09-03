import regeneratorRuntime from "../../node_modules/regenerator-runtime";
import { createStore } from "./storeForm";
import { createProduct } from "./productForm";
import { cart } from "./cart";
import { order } from "./checkout";

const storeForm = document.querySelector(".storeForm");
const productForm = document.querySelector(".productForm");
const addToCartBtns = document.querySelectorAll(".addToCart");
const updateCartBtn = document.querySelector(".updateCart");
const productContainer = document.querySelector(".productContainer");
const completeOrderBtns = document.querySelectorAll(".completeOrder");

function handleStoreForm(e) {
  e.preventDefault();
  createStore(this);
}

function handleProductForm(e) {
  e.preventDefault();
  createProduct(this);
}

function handleAddToCart(e) {
  e.preventDefault();
  cart.addToCart(this);
}

function handleUpdateCart(e) {
  e.preventDefault();
  cart.updateCart();
}

function handleOrderComplete(e) {
  order.payWithPaystack();
}

if (storeForm) storeForm.addEventListener("submit", handleStoreForm);
if (productForm) productForm.addEventListener("submit", handleProductForm);
if (addToCartBtns) {
  addToCartBtns.forEach((btn) =>
    btn.addEventListener("click", handleAddToCart)
  );
}
if (updateCartBtn) updateCartBtn.addEventListener("click", handleUpdateCart);

if (productContainer) order.renderOrderSummary();
if (completeOrderBtns) {
  completeOrderBtns.forEach((btn) =>
    btn.addEventListener("click", handleOrderComplete)
  );
}
