function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function setupPageNavigation() {
  await wait(1000); // Wait 1 seconds before doing anything

  const nextPage = document.querySelectorAll(".next-page");
  const allPages = document.querySelectorAll(".page");
  const allTrue = document.querySelectorAll(".true");
  const allFalse = document.querySelectorAll(".false");
  const answerAI = document.querySelectorAll(".answer-ai");
  const answerReal = document.querySelectorAll(".answer-true");
  const wrongAI = document.querySelectorAll(".wrong-ai");
  const rightAI = document.querySelectorAll(".rightai");
  const wrongReal = document.querySelectorAll(".wrong-real");
  const rightReal = document.querySelectorAll(".right-real");

  console.log(answerAI);
  console.log(answerReal);
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

  answerAI.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (button.classList.contains("false")) {
        event.preventDefault(); // Prevent form submission or link behavior
        rightAI[currentPageIndex].classList.remove("hidden");
        nextPage[currentPageIndex].classList.remove("hidden");
      }
    });
  });

  answerReal.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent form submission or link behavior
      if (button.classList.contains("false")) {
        console.log("Wrong It was AI");
      }
    });
  });
}

setupPageNavigation();
