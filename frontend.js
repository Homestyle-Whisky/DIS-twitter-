const nextPage = document.querySelectorAll(".next-page");
const allPages = document.querySelectorAll(".page");

let currentPageIndex = 0;

nextPage.forEach((button) => {
  button.addEventListener("click", () => {
    // Hide current page
    allPages[currentPageIndex].classList.add("hidden");

    // Move to next page if any
    currentPageIndex = (currentPageIndex + 1) % allPages.length;

    // Show next page
    allPages[currentPageIndex].classList.remove("hidden");
  });
});
