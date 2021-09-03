const detailContainer = document.querySelector(".productDetail");

if (detailContainer) {
  const detail = detailContainer.dataset.detail;

  detailContainer.innerHTML = detail;
}
