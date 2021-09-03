const searchForms = document.querySelectorAll(".searchForm");

const handleSearchForm = (e) => {
  e.preventDefault();

  // const searchInput = document.querySelectorAll(".searchInput").value;
  console.log(e.target.searchInput.value);

  window.location.href = `/search?product=${e.target.searchInput.value}`;
  e.target.searchInput.value = "";
};

if (searchForms) {
  searchForms.forEach((form) =>
    form.addEventListener("submit", handleSearchForm)
  );
}
