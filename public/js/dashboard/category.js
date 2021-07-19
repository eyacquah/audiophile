// import axios from "axios";

const createCategoryForm = document.querySelector(".createCategoryForm");
const editCategoryForm = document.querySelector(".editCategoryForm");
const editCategoryBtns = document.querySelectorAll(".editCategory");
const deleteCategoryBtns = document.querySelectorAll(".deleteCategory");
const deleteTextEl = document.querySelector(".deleteText");
const confirmDeleteBtn = document.querySelector(".deleteBtnConfirm");
const cancelDeleteBtn = document.querySelector(".cancelDeleteBtn");

const createCategory = async (e) => {
  e.preventDefault();

  const category = {};
  category.title = e.target.title.value.trim();
  category.description = e.target.description.value.trim();

  try {
    const res = await axios.post("/api/v1/categories", category);

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/dashboard/categories`;
    }
  } catch (err) {
    console.error(err);
  }
};

// PREFILL EDIT FORM ON CLICK
const prefillEditForm = (e) => {
  const category = JSON.parse(
    e.target.closest(".editCategory").dataset.category
  );
  editCategoryForm.title.value = category.title;
  editCategoryForm.description.value = category.description;
  editCategoryForm.dataset.id = category.id;
};

const editCategory = async (e) => {
  e.preventDefault();
  const category = {};
  category.title = e.target.title.value.trim();
  category.description = e.target.description.value.trim();
  category.id = e.target.dataset.id;

  try {
    const res = await axios.patch(
      `/api/v1/categories/${category.id}`,
      category
    );

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/dashboard/categories`;
    }
  } catch (err) {
    console.error(err);
  }
};

// DELETE CATEGORY
const displayCatInfo = (e) => {
  const category = JSON.parse(
    e.target.closest(".deleteCategory").dataset.category
  );
  deleteTextEl.textContent = `Are you sure you want to delete the ${category.title} category?
  This action is irreversible.`;

  confirmDeleteBtn.dataset.id = category.id;
};

const deleteCategory = async (e) => {
  try {
    const res = await axios.delete(`/api/v1/categories/${e.target.dataset.id}`);
    if (res.status === 204) {
      window.location.href = `${window.location.origin}/dashboard/categories`;
    }
  } catch (err) {
    console.error(err);
  }
};

if (createCategoryForm) {
  createCategoryForm.addEventListener("submit", createCategory);
}

if (editCategoryForm) {
  editCategoryForm.addEventListener("submit", editCategory);
}

if (editCategoryBtns) {
  editCategoryBtns.forEach((btn) =>
    btn.addEventListener("click", prefillEditForm)
  );
}

if (deleteCategoryBtns) {
  deleteCategoryBtns.forEach((btn) =>
    btn.addEventListener("click", displayCatInfo)
  );
}

if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener("click", deleteCategory);
}
