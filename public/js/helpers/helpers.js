export const showAlert = (type, msg, insertClass) => {
  const html = `
  <div class="alert alert-${
    type === "success" ? "success" : "danger"
  } alert-dismissible fade show" role="alert">
  <span class="fw-medium">${
    type === "success" ? "PRO TIP" : type.toUpperCase()
  } :</span> ${msg}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
  `;

  const pos = document.querySelector(`.${insertClass}`);
  pos.insertAdjacentHTML("afterbegin", html);
};

const spinner = {
  hasNotSpan: true,
  originalHTML: "",
};

export const renderSpinner = (btnClass, type, text) => {
  const spinnerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
  ${text}`;
  const btn = document.querySelector(`.${btnClass}`);
  //   const originalBtn = btn.innerHTML;
  if (spinner.hasNotSpan) {
    spinner.originalHTML = btn.innerHTML;
    spinner.hasNotSpan = false;
  }

  btn.innerHTML = type === "render" ? spinnerHTML : spinner.originalHTML;
};
