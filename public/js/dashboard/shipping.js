// import axios from "axios";

const createShippingForm = document.querySelector(".createShippingForm");
const editShippingForm = document.querySelector(".editShippingForm");
const editShippingBtns = document.querySelectorAll(".editShipping");
const deleteShippingBtns = document.querySelectorAll(".deleteShipping");
const deleteTextEl = document.querySelector(".deleteText");
const confirmDeleteBtn = document.querySelector(".deleteBtnConfirm");
const cancelDeleteBtn = document.querySelector(".cancelDeleteBtn");

const createShipping = async (e) => {
  e.preventDefault();

  const shipping = {};
  shipping.title = e.target.title.value.trim();
  shipping.description = e.target.description.value.trim();
  shipping.fee = +e.target.fee.value;
  shipping.duration = e.target.duration.value;

  try {
    const res = await axios.post("/api/v1/shipping", shipping);

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/dashboard/shipping`;
    }
  } catch (err) {
    console.error(err);
  }
};

// PREFILL EDIT FORM ON CLICK
const prefillEditForm = (e) => {
  const shipping = JSON.parse(
    e.target.closest(".editShipping").dataset.shipping
  );

  editShippingForm.title.value = shipping.title;
  editShippingForm.description.value = shipping.description;
  editShippingForm.fee.value = shipping.fee;
  editShippingForm.duration.value = shipping.duration;
  editShippingForm.dataset.id = shipping._id;
};

const editShipping = async (e) => {
  e.preventDefault();
  const shipping = {};
  shipping.title = e.target.title.value.trim();
  shipping.description = e.target.description.value.trim();
  shipping.fee = +e.target.fee.value;
  shipping.duration = e.target.duration.value.trim();
  shipping.id = e.target.dataset.id;

  try {
    const res = await axios.patch(`/api/v1/shipping/${shipping.id}`, shipping);

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/dashboard/shipping`;
    }
  } catch (err) {
    console.error(err);
  }
};

// DELETE shipping
const displayShippingInfo = (e) => {
  const shipping = JSON.parse(
    e.target.closest(".deleteShipping").dataset.shipping
  );
  deleteTextEl.textContent = `Are you sure you want to delete the ${shipping.title} shipping method?
  This action is irreversible.`;
  confirmDeleteBtn.dataset.id = shipping._id;
};

const deleteShipping = async (e) => {
  try {
    const res = await axios.delete(`/api/v1/shipping/${e.target.dataset.id}`);
    if (res.status === 204) {
      window.location.href = `${window.location.origin}/dashboard/shipping`;
    }
  } catch (err) {
    console.error(err);
  }
};

if (createShippingForm) {
  createShippingForm.addEventListener("submit", createShipping);
}

if (editShippingForm) {
  editShippingForm.addEventListener("submit", editShipping);
}

if (editShippingBtns) {
  editShippingBtns.forEach((btn) =>
    btn.addEventListener("click", prefillEditForm)
  );
}

if (deleteShippingBtns) {
  deleteShippingBtns.forEach((btn) =>
    btn.addEventListener("click", displayShippingInfo)
  );
}

if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener("click", deleteShipping);
}
