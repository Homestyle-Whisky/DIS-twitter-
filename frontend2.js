function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function setupPageNavigation() {
  await wait(1000); // Wait 1 seconds before doing anything

  const nextPage = document.querySelectorAll(".next-page");
  const allTweet = document.querySelectorAll(".next-tweet");
  const allPages = document.querySelectorAll(".page");
  const allTrue = document.querySelectorAll(".true");
  const allFalse = document.querySelectorAll(".false");
  const answerAI = document.querySelectorAll(".answer-ai");
  const answerReal = document.querySelectorAll(".answer-real");
  const wrongAI = document.querySelectorAll(".wrong-ai");
  const rightAI = document.querySelectorAll(".right-ai");
  const wrongReal = document.querySelectorAll(".wrong-real");
  const rightReal = document.querySelectorAll(".right-real");
  const score = document.getElementById("score");
  const gameScore = document.querySelector(".game-score");
  const playBtn = document.querySelector(".ready-btn ");

  console.log(answerAI);
  console.log(answerReal);
  console.log(allFalse);
  console.log(allTrue);
  console.log(wrongAI);
  console.log(rightAI);
  console.log(wrongReal);
  console.log(rightReal);

  let currentPageIndex = 0;
  let timeAnswered = 0;

  nextPage.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent form submission or link behavior

      // Hide current page
      allPages[currentPageIndex].classList.add("hidden");

      // Move to next page
      currentPageIndex = (currentPageIndex + 1) % allPages.length;
      timeAnswered = 0;

      // Show next page
      allPages[currentPageIndex].classList.remove("hidden");
    });
  });

  playBtn.addEventListener("click", (event) => {
    event.preventDefault();
    gameScore.classList.remove("hidden");
  });

  let currentTweet = 0;
  let currentScore = 0;

  answerAI.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent form submission or link behavior
      if (timeAnswered == 0) {
        if (button.classList.contains("false")) {
          rightAI[currentTweet].classList.remove("hidden");
          allTweet[currentTweet].classList.remove("hidden");
          currentScore = currentScore + 1;
          score.innerHTML = `${currentScore}`;
        } else {
          wrongReal[currentTweet].classList.remove("hidden");
          allTweet[currentTweet].classList.remove("hidden");
        }
        currentTweet = (currentTweet + 1) % allTweet.length;
        timeAnswered = 1;
      }
    });
  });

  answerReal.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent form submission or link behavior
      if (timeAnswered == 0) {
        if (button.classList.contains("false")) {
          wrongAI[currentTweet].classList.remove("hidden");
          allTweet[currentTweet].classList.remove("hidden");
        } else {
          rightReal[currentTweet].classList.remove("hidden");
          allTweet[currentTweet].classList.remove("hidden");
          currentScore = currentScore + 1;
          score.innerHTML = `${currentScore}`;
        }
        currentTweet = (currentTweet + 1) % allTweet.length;
        timeAnswered = 1;
      }
    });
  });
}

setupPageNavigation();
