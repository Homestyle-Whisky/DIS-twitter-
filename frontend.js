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






// Function to send guess to Flask backend
async function sendGuess(user_id, tweet_id, user_answer, correct_answer) {
  const response = await fetch("http://localhost:5000/submit_guess", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: user_id,
      tweet_id: tweet_id,
      user_answer: user_answer,
      correct_answer: correct_answer
    })
  });

  const result = await response.json();
  console.log("Flask-svar:", result);
}

// Testfunktion kaldet af knappen
function testGuess() {
  sendGuess(
    "075db9a5-1b1f-40ed-aa07-e5f37ccedc5c", // user_id
    42,                                     // tweet_id
    true,                                   // user_answer
    false                                   // correct_answer
  );
}