import { renderSpinner, showAlert } from "../helpers/helpers.js";

const productForm = document.querySelector(".productForm");
const deleteProductBtns = document.querySelectorAll(".deleteProduct");
const confirmDeleteBtn = document.querySelector(".confirmDeleteProduct");
const deleteTextEl = document.querySelector(".deleteText");
const collectionEls = document.querySelectorAll(".collection");

const createOrUpdateProduct = async (e) => {
  e.preventDefault();
  // const images = document.getElementById("images")?.files;
  // console.log(images);
  const form = e.target;
  const productId = form.dataset.id;

  if (!form.title.value || !form.description.value || !form.price.value) {
    return showAlert(
      "error",
      "You must fill all required fields of this form",
      "productForm"
    );
  }

  const productForm = new FormData();

  const visibility =
    form.visibility.selectedOptions[0].dataset.bool === "yes" ? true : false;

  productForm.append("title", form.title.value);
  productForm.append("description", form.description.value);
  productForm.append("price", form.price.value);
  productForm.append("priceDiscount", form.priceDiscount.value);
  productForm.append("stockQuantity", +form.stockQuantity.value);

  productForm.append("brand", form.brand.selectedOptions[0].dataset.id);
  productForm.append("isVisible", visibility);

  const colours = form.colours.value.trim().split(",");

  colours.forEach((colour) => {
    if (colour) productForm.append("colours", colour);
  });

  collectionEls.forEach((el) =>
    el.checked ? productForm.append("collections", el.dataset.id) : ""
  );

  // return;
  const images = document.getElementById("images")?.files;

  if (images.length === 0) {
    return await updateProduct(productForm, productId);
  }

  for (let i = 0; i < images.length; i++) {
    productForm.append("images", images[i]);
  }

  if (productId) return await updateProduct(productForm, productId);

  return await createProduct(productForm);
};

const updateProduct = async (data, id) => {
  // return console.log(data);
  try {
    renderSpinner("productBtn", "render", "Updating...");

    const res = await axios.patch(`/api/v1/products/${id}`, data);

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/dashboard/products/all`;
    }
  } catch (err) {
    showAlert("error", "Product not updated", "productForm");
    showAlert("error", err.message, "productForm");
    renderSpinner("productBtn", "remove", "");
    console.error(err);
  }
};

const createProduct = async (data) => {
  try {
    renderSpinner("productBtn", "render", "Uploading...");
    const res = await axios.post("/api/v1/products", data);

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/dashboard/products/add`;
    }
  } catch (err) {
    showAlert("error", "Product not uploaded", "productForm");
    showAlert("error", err.message, "productForm");
    renderSpinner("productBtn", "remove", "");
    console.error(err);
  }
};

// DELETE PRODUCT
const displayDeleteWarning = (e) => {
  const product = JSON.parse(
    e.target.closest(".deleteProduct").dataset.product
  );
  deleteTextEl.textContent = `Are you sure you want to delete ${product.title}?
  This action is irreversible.`;

  confirmDeleteBtn.dataset.id = product.id;
};

const deleteProduct = async (e) => {
  try {
    const res = await axios.delete(`/api/v1/products/${e.target.dataset.id}`);
    if (res.status === 204) {
      window.location.href = `${window.location.origin}/dashboard/products/all`;
    }
  } catch (err) {
    console.error(err);
  }
};

if (productForm) {
  productForm.addEventListener("submit", createOrUpdateProduct);
}

if (deleteProductBtns) {
  deleteProductBtns.forEach((btn) =>
    btn.addEventListener("click", displayDeleteWarning)
  );
}

if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener("click", deleteProduct);
}
