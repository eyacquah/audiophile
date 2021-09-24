const detailContainer = document.querySelector(".productDetail");
const specsContainer = document.querySelector(".productSpecs");

if (detailContainer) {
  const detail = detailContainer.dataset.detail;

  detailContainer.innerHTML = detail;
}

if (specsContainer) {
  const specs = specsContainer.dataset.specs;
  specsContainer.innerHTML = specs;
}
