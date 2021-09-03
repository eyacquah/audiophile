// import axios from "axios";

const createBrandForm = document.querySelector(".createBrandForm");
const editBrandForm = document.querySelector(".editBrandForm");
const editBrandBtns = document.querySelectorAll(".editBrand");
const deleteTextEl = document.querySelector(".deleteText");
const deleteBrandBtns = document.querySelectorAll(".deleteBrand");
const confirmDeleteBtn = document.querySelector(".deleteBtnConfirm");
const cancelDeleteBtn = document.querySelector(".cancelDeleteBtn");

const createBrand = async (e) => {
  e.preventDefault();

  const brand = {};
  brand.title = e.target.title.value.trim();
  brand.description = e.target.description.value.trim();

  try {
    const res = await axios.post("/api/v1/brands", brand);

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/dashboard/brands`;
    }
  } catch (err) {
    console.error(err);
  }
};

// PREFILL EDIT FORM ON CLICK
const prefillEditForm = (e) => {
  const brand = JSON.parse(e.target.closest(".editBrand").dataset.brand);
  editBrandForm.title.value = brand.title;
  editBrandForm.description.value = brand.description;
  editBrandForm.dataset.id = brand.id;
};

const editBrand = async (e) => {
  e.preventDefault();
  const brand = {};
  brand.title = e.target.title.value.trim();
  brand.description = e.target.description.value.trim();
  brand.id = e.target.dataset.id;

  try {
    const res = await axios.patch(`/api/v1/brands/${brand.id}`, brand);

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/dashboard/brands`;
    }
  } catch (err) {
    console.error(err);
  }
};

// DELETE brand
const displayBrandInfo = (e) => {
  const brand = JSON.parse(e.target.closest(".deleteBrand").dataset.brand);
  deleteTextEl.textContent = `Are you sure you want to delete the ${brand.title} brand?
  This action is irreversible.`;

  confirmDeleteBtn.dataset.id = brand.id;
};

const deleteBrand = async (e) => {
  try {
    const res = await axios.delete(`/api/v1/brands/${e.target.dataset.id}`);
    if (res.status === 204) {
      window.location.href = `${window.location.origin}/dashboard/brands`;
    }
  } catch (err) {
    console.error(err);
  }
};

if (createBrandForm) {
  createBrandForm.addEventListener("submit", createBrand);
}

if (editBrandForm) {
  editBrandForm.addEventListener("submit", editBrand);
}

if (editBrandBtns) {
  editBrandBtns.forEach((btn) =>
    btn.addEventListener("click", prefillEditForm)
  );
}

if (deleteBrandBtns) {
  deleteBrandBtns.forEach((btn) =>
    btn.addEventListener("click", displayBrandInfo)
  );
}

if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener("click", deleteBrand);
}
