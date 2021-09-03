// import axios from "axios";

const createCollectionForm = document.querySelector(".createCollectionForm");
const editCollectionForm = document.querySelector(".editCollectionForm");
const editCollectionBtns = document.querySelectorAll(".editCollection");
const deleteCollectionBtns = document.querySelectorAll(".deleteCollection");
const deleteTextEl = document.querySelector(".deleteText");
const confirmDeleteBtn = document.querySelector(".deleteBtnConfirm");
const cancelDeleteBtn = document.querySelector(".cancelDeleteBtn");

const createCollection = async (e) => {
  e.preventDefault();

  const collection = {};
  collection.title = e.target.title.value.trim();
  collection.description = e.target.description.value.trim();

  try {
    const res = await axios.post("/api/v1/collections", collection);

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/dashboard/collections`;
    }
  } catch (err) {
    console.error(err);
  }
};

// PREFILL EDIT FORM ON CLICK
const prefillEditForm = (e) => {
  const collection = JSON.parse(
    e.target.closest(".editCollection").dataset.collection
  );
  editCollectionForm.title.value = collection.title;
  editCollectionForm.description.value = collection.description;
  editCollectionForm.dataset.id = collection._id;
};

const editCollection = async (e) => {
  e.preventDefault();
  const collection = {};
  collection.title = e.target.title.value.trim();
  collection.description = e.target.description.value.trim();
  collection.id = e.target.dataset.id;

  try {
    const res = await axios.patch(
      `/api/v1/collections/${collection.id}`,
      collection
    );

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/dashboard/collections`;
    }
  } catch (err) {
    console.error(err);
  }
};

// DELETE collection
const displayCollectionInfo = (e) => {
  const collection = JSON.parse(
    e.target.closest(".deleteCollection").dataset.collection
  );
  deleteTextEl.textContent = `Are you sure you want to delete the ${collection.title} collection?
  This action is irreversible.`;

  confirmDeleteBtn.dataset.id = collection._id;
};

const deleteCollection = async (e) => {
  try {
    const res = await axios.delete(
      `/api/v1/collections/${e.target.dataset.id}`
    );
    if (res.status === 204) {
      window.location.href = `${window.location.origin}/dashboard/collections`;
    }
  } catch (err) {
    console.error(err);
  }
};

if (createCollectionForm) {
  createCollectionForm.addEventListener("submit", createCollection);
}

if (editCollectionForm) {
  editCollectionForm.addEventListener("submit", editCollection);
}

if (editCollectionBtns) {
  editCollectionBtns.forEach((btn) =>
    btn.addEventListener("click", prefillEditForm)
  );
}

if (deleteCollectionBtns) {
  deleteCollectionBtns.forEach((btn) =>
    btn.addEventListener("click", displayCollectionInfo)
  );
}

if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener("click", deleteCollection);
}
