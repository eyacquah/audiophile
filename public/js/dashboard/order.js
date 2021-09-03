// import axios from "axios";
import { showAlert, renderSpinner } from "../helpers/helpers.js";

const updateForm = document.querySelector(".updateOrder");
const updateOrderBtn = document.querySelector(".updateOrderBtn");

const deleteTextEl = document.querySelector(".deleteText");
const deleteOrderBtns = document.querySelectorAll(".deleteOrder");
const confirmDeleteBtn = document.querySelector(".deleteBtnConfirm");

export const updateOrder = async () => {
  renderSpinner("updateOrderBtn", "render", "Saving..");

  try {
    const data = {
      paid: updateForm.payment.checked ? true : false,
      delivered: updateForm.delivery.checked ? true : false,
    };

    const res = await axios.patch(
      `/api/v1/orders/${updateForm.dataset.id}`,
      data
    );

    if (res.data.status === "success") {
      location.assign("/dashboard");
    }
  } catch (err) {
    console.error(err);
    showAlert("error", "Something Went Wrong", "insertAlert");
  }
};

// DELETE order
const displayOrderInfo = (e) => {
  const order = JSON.parse(e.target.closest(".deleteOrder").dataset.order);
  deleteTextEl.textContent = `Are you sure you want to delete order ${order.orderNum} by ${order.customer.name}?
  This action is irreversible.`;

  confirmDeleteBtn.dataset.id = order._id;
};

const deleteOrder = async (e) => {
  console.log("Deleting..", e.target.dataset.id);
  try {
    const res = await axios.delete(`/api/v1/orders/${e.target.dataset.id}`);
    if (res.status === 204) {
      location.assign(`/dashboard`);
    }
  } catch (err) {
    console.error(err);
  }
};

if (updateOrderBtn) updateOrderBtn.addEventListener("click", updateOrder);

if (deleteOrderBtns) {
  deleteOrderBtns.forEach((btn) =>
    btn.addEventListener("click", displayOrderInfo)
  );
}

if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener("click", deleteOrder);
}
