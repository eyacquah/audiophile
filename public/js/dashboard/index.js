// import regeneratorRuntime from "regenerator-runtime";
console.log("Connected!");

// import { createOrUpdateProduct, deleteProduct } from "./products";
// import { createBrand, deleteBrand } from "./brand";
// import { login, logout } from "./login";
// import { updateOrder, deleteOrder } from "./order";
// import { updateSlider } from "./slider";

const productForms = document.querySelectorAll(".productForm");
const confirmDeleteProductBtns = document.querySelectorAll(".confirmDelete");
const deleteBrandBtn = document.querySelector(".deleteBrand");
const loginForm = document.querySelector(".loginForm");
const logoutBtn = document.querySelector(".logout");
const orderForm = document.querySelector(".orderForm");
const deleteOrderBtn = document.querySelector(".deleteOrder");
// const searchInput = document.querySelector(".searchInput");
const searchInputForm = document.querySelector(".searchInputForm");
const sliderForm = document.querySelector(".sliderForm");

///////////// HANDLER FUNCTIONS

// async function handleProductForms(e) {
//   e.preventDefault();
//   await createOrUpdateProduct(this);
// }

// async function handleProductDelete(e) {
//   e.preventDefault();
//   await deleteProduct(e.target.dataset.id);
// }

// async function handleBrandForm(e) {
//   e.preventDefault();
//   await createBrand(this);
// }

// async function handleDeleteBrand(e) {
//   e.preventDefault();
//   await deleteBrand(e.target.dataset.id);
// }

// async function handleLoginForm(e) {
//   e.preventDefault();
//   await login(this);
// }

// async function handleLogout(e) {
//   e.preventDefault();
//   await logout();
// }

// async function handleOrderForm(e) {
//   e.preventDefault();
//   await updateOrder(this);
// }

// async function handleDeleteOrder(e) {
//   e.preventDefault();
//   await deleteOrder(this.dataset.id);
// }

// function handleSearchForm(e) {
//   e.preventDefault();

//   window.location.assign(
//     `/dashboard/search?product=${this.searchInput.value.trim()}`
//   );
// }

// async function handleSliderForm(e) {
//   e.preventDefault();
//   console.log("I'm working okay?");

//   await updateSlider(this);
// }
// ASSIGN HANDLERS

// if (productForms) {
//   productForms.forEach((form) => {
//     form.addEventListener("submit", handleProductForms);
//   });
// }

// if (confirmDeleteProductBtns) {
//   confirmDeleteProductBtns.forEach((btn) =>
//     btn.addEventListener("click", handleProductDelete)
//   );
// }

// if (brandForm) brandForm.addEventListener("submit", handleBrandForm);
// if (deleteBrandBtn) deleteBrandBtn.addEventListener("click", handleDeleteBrand);

// if (loginForm) loginForm.addEventListener("submit", handleLoginForm);

// if (orderForm) orderForm.addEventListener("submit", handleOrderForm);

// if (deleteOrderBtn) deleteOrderBtn.addEventListener("click", handleDeleteOrder);

// if (sliderForm) sliderForm.addEventListener("submit", handleSliderForm);

// searchInputForm.addEventListener("submit", handleSearchForm);

// logoutBtn.addEventListener("click", handleLogout);
