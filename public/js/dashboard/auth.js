// import axios from "axios";
const loginForm = document.querySelector(".loginForm");

const login = async (e) => {
  e.preventDefault();
  const form = e.target;
  try {
    const email = form.email.value;
    const password = form.password.value;

    const res = await axios.post("/api/v1/users/login", {
      email,
      password,
    });

    if (res.data.status === "success") {
      location.assign("/dashboard");
    }
  } catch (err) {
    showAlert("error", "Incorrect Login Credentials", "alert");
    console.error(err);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get("/api/v1/users/logout");

    if (res.data.status === "success") {
      window.location.href = window.location.href;
    }
  } catch (err) {
    console.error(err);
  }
};

if (loginForm) {
  loginForm.addEventListener("submit", login);
}

////////////////////////////////////////////////////////////////////////////////////////
///// HELPERS
function showAlert(type, msg, insertClass) {
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
}
