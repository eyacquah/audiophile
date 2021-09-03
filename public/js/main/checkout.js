// import Paystack from "paystack";

import { showAlert, renderSpinner } from "../helpers/helpers.js";
// import axios from "axios";

const productContainer = document.querySelector(".productContainer");
const finalOrderItemContainer = document.querySelector(
  ".productContainerSummary"
);

const completeOrderBtns = document.querySelectorAll(".completeOrder");
const orderTotalEl = document.querySelector(".orderTotal");
const orderSubtotalEl = document.querySelector(".orderSubtotal");
const shippingFeeEl = document.querySelector(".shippingFee");

const shippingDetailsContainer = document.querySelector(".shippingDetails");

const sameAddressEl = document.getElementById("sameAddress");
const billingAddressForm = document.querySelector(".billingAddress");
const shippingAddressForm = document.querySelector(".shippingAddress");

const shippingMethodEls = document.querySelectorAll(".shippingMethod");
const paymentMethodEls = document.querySelectorAll(".paymentMethod");

const proceedToShippingBtns = document.querySelectorAll(".proceedToShipping");
const proceedToPaymentBtns = document.querySelectorAll(".paymentBtn");
const proceedToSummaryBtns = document.querySelectorAll(".orderSummaryBtn");

let ref;

const paystackPublic = "pk_live_097bde6b0acce3b13267ed2640d64b252815d2ae";

class Order {
  constructor() {
    this.items = [];
    this.subtotal = 0;
    this.total = 0;
    this.shippingAddress = {};
    this.billingAddress = {};
    this.paymentMethod = "";
    this.shippingMethod = {
      title: "",
      fee: 0,
      description: "",
    };
  }

  /////////////////////////////////////////////
  //  RETREIVING FORM DATA

  retreiveOrderAddress() {
    // Prevent Order Creation If Cart is Empty
    if (!this.items.length) return this._preventOrderWithoutProducts();

    // 1. Check if all required fields have been filled
    if (!this._verifiedAddressFormData("shipping")) return;

    // 2. Organize the data
    this.shippingAddress.name = `${shippingAddressForm.firstName.value.trim()} ${shippingAddressForm.lastName.value.trim()}`;
    this.shippingAddress.phoneNumber = shippingAddressForm.phone.value.trim();
    this.shippingAddress.email = shippingAddressForm.email.value.trim();
    this.shippingAddress.company = shippingAddressForm.company.value.trim();
    this.shippingAddress.country = shippingAddressForm.country.value;
    this.shippingAddress.region = shippingAddressForm.region.value;
    this.shippingAddress.streetAddress = `${shippingAddressForm.address1.value.trim()} | ${shippingAddressForm.address2.value.trim()}`;

    // 3. Check if shippingAddress === billingAddress
    if (sameAddressEl.checked) {
      this.billingAddress = this.shippingAddress;
      this.saveToLocalStorage();
      return location.assign("/shipping");
    }

    if (!this._verifiedAddressFormData("billing")) return;
    this.billingAddress.name = `${billingAddressForm.firstName.value.trim()} ${billingAddressForm.lastName.value.trim()}`;
    this.billingAddress.phoneNumber = billingAddressForm.phone.value.trim();
    this.billingAddress.email = billingAddressForm.email.value.trim();
    this.billingAddress.company = billingAddressForm.company.value.trim();
    this.billingAddress.country = billingAddressForm.country.value;
    this.billingAddress.region = billingAddressForm.region.value;
    this.billingAddress.streetAddress = `${billingAddressForm.address1.value.trim()} | ${billingAddressForm.address2.value.trim()}`;

    this.saveToLocalStorage();
    return location.assign("/shipping");
  }

  retreiveShippingRate(e) {
    const shippingMethod = e.target.checked
      ? JSON.parse(e.target.dataset.shipping)
      : null;

    this.shippingMethod.fee = shippingMethod.fee;
    this.shippingMethod.title = shippingMethod.title;
    this.shippingMethod.description = shippingMethod.description;
    return this.renderOrderSummary();
  }

  proceedToPayment() {
    // Prevent Order Creation If Cart is Empty
    if (!this.items.length) return this._preventOrderWithoutProducts();

    let selectedShipping = false;

    shippingMethodEls.forEach((el) => {
      if (el.checked) selectedShipping = true;
    });

    if (!selectedShipping)
      return showAlert("error", "Select a shipping method", "insertAlert");

    this.saveToLocalStorage();
    return location.assign("/payment");
  }

  retreivePaymentMethod() {
    // Prevent Order Creation If Cart is Empty
    if (!this.items.length) return this._preventOrderWithoutProducts();

    let paymentMethod = null;
    paymentMethodEls.forEach((el) => {
      if (el.checked) paymentMethod = el.value;
    });

    this.paymentMethod = paymentMethod;
    this.saveToLocalStorage();
    return location.assign("/order-summary");
  }

  /////////////////////////////////////////////
  //  HANDLING PAYMENTS

  async completeOrder() {
    // Prevent Order Creation If Cart is Empty
    if (!this.items.length) return this._preventOrderWithoutProducts();

    renderSpinner("completeOrder", "render", "Creating your order..");

    this._calcTotals();

    const order = {
      customer: this.billingAddress,
      products: this.items,
      subtotal: this.subtotal,
      shippingMethod: this.shippingMethod,
      total: this.total,
      shippingAddress: this.shippingAddress,
      paymentMethod: this.paymentMethod,
    };

    order.paymentMethod === "paystack"
      ? await this.payWithPaystack(order)
      : await this.payCashOnDelivery(order);
  }

  async payCashOnDelivery(orderData) {
    try {
      const res = await axios.post(`/api/v1/orders`, orderData);

      if (res.data.status === "success") location.assign("/order/complete");
    } catch (err) {
      showAlert("error", "Something Went Wrong", "insertAlert");

      renderSpinner("completeOrder", "end", "");

      console.error(err);
    }
  }
  async payWithPaystack(orderData) {
    const res = await this._generateRef(this.billingAddress.name);
    ref = res.data;

    this._calcTotals();

    const handler = PaystackPop.setup({
      key: paystackPublic,
      email: this.billingAddress.email,
      amount: this.total * 100,
      currency: "GHS",
      ref: ref,
      metadata: orderData,
      callback: this._paymentComplete,
      onClose: this._paymentCancelled,
    });

    handler.openIframe();
  }

  _paymentComplete() {
    return location.assign(`/api/v1/orders/verify/${ref}`);
  }

  _paymentCancelled() {
    return location.assign("/order-summary");
  }

  async _generateRef(name) {
    const res = await axios.get(`/api/v1/orders/create-ref/${name}`);
    return res.data;
  }

  /////////////////////////////////////////////
  // HTML RENDERING

  renderOrderSummary() {
    this._calcTotals();

    productContainer.innerHTML = "";
    this.items.forEach((item) => {
      const html = this._createItemHTML(item);
      productContainer.insertAdjacentHTML("afterbegin", html);
    });

    orderSubtotalEl.textContent = `GHS ${this.subtotal.toFixed(2)}`;
    shippingFeeEl.textContent = `GHS ${this.shippingMethod.fee.toFixed(2)}`;
    orderTotalEl.textContent = `GHS ${this.total.toFixed(2)}`;
  }

  renderFinalOrderInfo() {
    // Render Totals
    this._calcTotals();

    // Render cart items
    finalOrderItemContainer.innerHTML = "";
    console.log("Rendering!");

    this.items.forEach((item) => {
      const html = this._createItemHTMLFinal(item);
      finalOrderItemContainer.insertAdjacentHTML("afterbegin", html);
    });

    orderSubtotalEl.textContent = `GHS ${this.subtotal.toFixed(2)}`;
    shippingFeeEl.textContent = `GHS ${this.shippingMethod.fee.toFixed(2)}`;
    orderTotalEl.textContent = `GHS ${this.total.toFixed(2)}`;

    // Render Shipping details
    const shippingDetailsHtml = this._createShippingDetailsHTML();
    shippingDetailsContainer.innerHTML = "";
    shippingDetailsContainer.insertAdjacentHTML(
      "afterbegin",
      shippingDetailsHtml
    );
  }

  /////////////////////////////////////////////
  // FORM VALIDATORS

  _verifiedAddressFormData(formName) {
    const form = document.querySelector(`.${formName}Address`);

    if (
      !form.firstName.value ||
      !form.lastName.value ||
      !form.email.value ||
      !form.phone.value ||
      !form.address1.value ||
      form.region.value.trim().toLowerCase().startsWith("choose")
    ) {
      showAlert(
        "error",
        "These fields are required: name, email, phone number, region and address",
        "insertAlert"
      );
      return false;
    }

    if (
      !validator.isEmail(form.email.value.trim()) ||
      !validator.isMobilePhone(form.phone.value.trim())
    ) {
      showAlert(
        "error",
        "Enter a valid email address and phone number",
        "insertAlert"
      );
      return false;
    }

    return true;
  }

  /////////////////////////////////////////////
  // LISTENERS & HELPERS

  _preventOrderWithoutProducts() {
    // Prevent Order Creation If Cart is Empty
    if (!this.items.length)
      return showAlert(
        "error",
        "There are no items in your cart",
        "insertAlert"
      );
  }

  _calcTotals() {
    this.items = JSON.parse(localStorage.getItem("items"));
    this.subtotal = JSON.parse(localStorage.getItem("subtotal"));
    this.total = this.subtotal + this.shippingMethod.fee;
  }

  addListenersToBtns() {
    proceedToShippingBtns.forEach((btn) =>
      btn.addEventListener("click", this.retreiveOrderAddress.bind(this))
    );

    shippingMethodEls.forEach((el) =>
      el.addEventListener("change", this.retreiveShippingRate.bind(this))
    );

    proceedToPaymentBtns.forEach((btn) =>
      btn.addEventListener("click", this.proceedToPayment.bind(this))
    );

    proceedToSummaryBtns.forEach((btn) =>
      btn.addEventListener("click", this.retreivePaymentMethod.bind(this))
    );

    completeOrderBtns.forEach((btn) =>
      btn.addEventListener("click", this.completeOrder.bind(this))
    );
  }

  /////////////////////////////////////////////
  // LOCAL STORAGE

  saveToLocalStorage() {
    localStorage.setItem("billingAddress", JSON.stringify(this.billingAddress));
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify(this.shippingAddress)
    );
    localStorage.setItem("shippingMethod", JSON.stringify(this.shippingMethod));
    localStorage.setItem("paymentMethod", JSON.stringify(this.paymentMethod));
  }

  init() {
    const billingAddress = localStorage.getItem("billingAddress");
    const shippingAddress = localStorage.getItem("shippingAddress");
    const shippingMethod = localStorage.getItem("shippingMethod");
    const paymentMethod = localStorage.getItem("paymentMethod");

    if (billingAddress || shippingAddress) {
      this.billingAddress = JSON.parse(billingAddress);
      this.shippingAddress = JSON.parse(shippingAddress);
    }

    if (shippingMethod) this.shippingMethod = JSON.parse(shippingMethod);
    if (paymentMethod) this.paymentMethod = JSON.parse(paymentMethod);
  }

  /////////////////////////////////////////////
  // HTML GENERATION

  hideOrShowBilling(e) {
    e.preventDefault();
    e.target.checked
      ? (billingAddressForm.style.display = "none")
      : (billingAddressForm.style.display = "initial");

    return;
  }

  _createItemHTMLFinal(product) {
    const html = `<div class="d-sm-flex justify-content-between my-4 pb-3 border-bottom">
    <div class="d-sm-flex text-center text-sm-start"><a class="d-inline-block flex-shrink-0 mx-auto me-sm-4" href=/products/${
      product.slug
    }"><img src="${product.images[0]}" width="160" alt="${product.title}" /></a>
        <div class="pt-2">
            <h3 class="product-title fs-base mb-2"><a href="/products/${
              product.slug
            }">${product.title} - ${product.colour}</a></h3>
            <div class="fs-lg text-accent pt-2">GHS ${product.price.toFixed(
              0
            )}<small></small></div>
        </div>
    </div>
    <div class="pt-2 pt-sm-0 ps-sm-3 mx-auto mx-sm-0 text-center text-sm-end" style="max-width: 9rem;">
        <p class="mb-0"><span class="text-muted fs-sm">Quantity:</span><span>&nbsp;${
          product.orderQuantity
        }</span></p><a class="btn btn-link px-0" type="button" href="/cart"><i class="ci-edit me-2"></i><span class="fs-sm">Edit</span></a>
    </div>
</div>`;

    return html;
  }

  _createItemHTML(product) {
    const html = `<div class="d-flex align-items-center py-2 border-bottom"><a class="d-block flex-shrink-0" href="/products/${
      product.slug
    }"><img src="${product.images[0]}" width="64" alt="${product.title}" /></a>
    <div class="ps-2">
        <h6 class="widget-product-title"><a href="/products/${product.slug}">${
      product.title
    }- ${product.colour}</a></h6>
        <div class="widget-product-meta"><span class="text-accent me-2">GHS ${product.price.toFixed(
          2
        )}<small></small></span><span class="text-muted">x ${
      product.orderQuantity
    }</span></div>
    </div>
</div>`;
    return html;
  }

  _createShippingDetailsHTML() {
    const html = `
    <div class="col-sm-6">
      <h4 class="h6">Shipping to:</h4>
      <ul class="list-unstyled fs-sm">
        <li><span class="text-muted">Client:&nbsp;</span>${this.shippingAddress.name}</li>
        <li><span class="text-muted">Address:&nbsp;</span>${this.shippingAddress.streetAddress} ${this.shippingAddress.region}, ${this.shippingAddress.country}</li>
        <li><span class="text-muted">Phone:&nbsp;</span>${this.shippingAddress.phoneNumber}</li>
      </ul>
    </div>`;

    return html;
  }
}

export const order = new Order();

order.init();

if (sameAddressEl) {
  billingAddressForm.style.display = "none";
  sameAddressEl.addEventListener("change", order.hideOrShowBilling);
}

if (
  proceedToShippingBtns.length ||
  proceedToPaymentBtns.length ||
  proceedToSummaryBtns
) {
  order.addListenersToBtns();
}
