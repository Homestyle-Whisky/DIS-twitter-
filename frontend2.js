function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function setupPageNavigation() {
  await wait(1000); // Wait 2 seconds before doing anything

  const nextPage = document.querySelectorAll(".next-page");
  const allPages = document.querySelectorAll(".page");

  let currentPageIndex = 0;

  nextPage.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent form submission or link behavior

      // Hide current page
      allPages[currentPageIndex].classList.add("hidden");

      // Move to next page
      currentPageIndex = (currentPageIndex + 1) % allPages.length;

      // Show next page
      allPages[currentPageIndex].classList.remove("hidden");
    });
  });
}

setupPageNavigation();
