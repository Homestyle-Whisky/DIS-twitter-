import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://gkkyhepijeaykkpukelb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra3loZXBpamVheWtrcHVrZWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzkwMzYwMiwiZXhwIjoyMDYzNDc5NjAyfQ.7vXzFlMDvqDLLWf2XA-jaz7KhLlN3jrH1Sd-EMe27n8";
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchData() {
  const { data: tweet_data, error } = await supabase
    .from("tweet_data")
    .select("*");

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    return tweet_data;
  }
}

async function main(tweet_num) {
  const tweets = await fetchData(); // <-- Waits for the promise to resolve
  return tweets[tweet_num]; // Access the first element of the array
}

function createCard() {
  for (let i = 0; i < 4; i++) {
    const randomNumber = Math.floor(Math.random() * 120) + 1;
    main(randomNumber).then((tweet) => {
      let name = tweet.name;
      let message = tweet.tweet;
      let img = tweet.image_url;
      let username = tweet.username;
      let valid = tweet.is_real;
      const htmlString = `
      <div class="game-screen hidden page">
  <div>
    <h1 class="game-h1">Is this tweet real or AI?</h1>
  </div>
  <div class="tweet-card">
    <div class="tweet-header">
      <img src="${img}" alt="Profile picture" class="avatar" />
      <div class="tweet-user">
        <strong class="tweet-name">${name}</strong>
        <br />
        <span class="handle">${username}</span>
      </div>
    </div>
    <div class="tweet-content">${message}</div>
  </div>

  <div class="choice-buttons">
    <button class="choice-button answer-ai ${valid}">← AI</button>
    <button class="choice-button answer-real ${valid}">Real →</button>
  </div>
  <div class="game-answer right-real hidden">
    <div>
      <p class="answer">Correct!</p>
      <p class="answer-comment">That tweet was real</p>
    </div>
    <div>
      <img
        src="Visual/Pickle_green.png"
        alt="Correct-pickle"
        class="answer-pickle"
      />
    </div>
  </div>
  <div class="game-answer wrong-real hidden">
    <div>
      <p class="answer">Wrong!</p>
      <p class="answer-comment">That tweet was real</p>
    </div>
    <div>
      <img
        src="Visual/Red_pickle.png"
        alt="Correct-pickle"
        class="answer-pickle"
      />
    </div>
  </div>
  <div class="game-answer wrong-ai hidden">
    <div>
      <p class="answer">Wrong!</p>
      <p class="answer-comment">That tweet was AI</p>
    </div>
    <div>
      <img
        src="Visual/Red_pickle.png"
        alt="Correct-pickle"
        class="answer-pickle"
      />
    </div>
    </div>
    <div class="game-answer right-ai hidden">
      <div>
        <p class="answer">Correct!</p>
        <p class="answer-comment">That tweet was AI</p>
      </div>
      <div>
        <img
         src="Visual/Pickle_green.png"
        alt="Correct-pickle"
        class="answer-pickle"
        />
      </div>
    </div>

    <div class="game-next-slide">
      <div class="score next-tweet next-page hidden">Next tweet</div>
    </div>
</div>
      `;

      document
        .querySelector(".ready-container")
        .insertAdjacentHTML("afterend", htmlString);
    });
  }
}

function first3slides() {
  let nextPage = document.querySelectorAll(".next-page");
  let allPages = document.querySelectorAll(".page");

  let currentPageIndex = 0;
  let timeAnswered = 0;
  nextPage.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent form submission or link behavior
      // Hide current page
      allPages[currentPageIndex].classList.add("hidden");

      // Move to next page
      currentPageIndex = currentPageIndex + 1;
      timeAnswered = 0;

      // Show next page
      allPages[currentPageIndex].classList.remove("hidden");
    });
  });
}

first3slides();

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function setupPageNavigation() {
  await wait(1000); // Wait 1 seconds before doing anything
  const allTweet = document.querySelectorAll(".next-tweet");
  const answerAI = document.querySelectorAll(".answer-ai");
  const answerReal = document.querySelectorAll(".answer-real");
  const wrongAI = document.querySelectorAll(".wrong-ai");
  const rightAI = document.querySelectorAll(".right-ai");
  const wrongReal = document.querySelectorAll(".wrong-real");
  const rightReal = document.querySelectorAll(".right-real");
  const score = document.getElementById("score");
  const finalScore = document.querySelector(".final-score");
  const endScreen = document.querySelector(".end-screen");
  const gameScore = document.querySelector(".game-score");
  const playBtn = document.querySelector(".ready-btn");
  const restartBtn = document.querySelector(".restart-button");
  const game = document.querySelectorAll(".game-screen");

  let currentPageIndex = 0;
  let timeAnswered = 0;

  nextPage[allPages.length].innerHTML = `End game!`;

  nextPage.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent form submission or link behavior

      if (currentPageIndex < allPages.length - 1) {
        // Hide current page
        allPages[currentPageIndex].classList.add("hidden");

        // Move to next page
        currentPageIndex = currentPageIndex + 1;
        timeAnswered = 0;

        // Show next page
        allPages[currentPageIndex].classList.remove("hidden");
      } else {
        finalScore.innerHTML = `Score: <strong>${currentScore}</strong>`;
        endScreen.classList.remove("hidden");
      }
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
        currentTweet = currentTweet + 1;
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

  restartBtn.addEventListener("click", (event) => {
    event.preventDefault();
    allPages[currentPageIndex].classList.add("hidden");
    currentPageIndex = 2;
    allPages[currentPageIndex].classList.remove("hidden");
    endScreen.classList.add("hidden");
    currentScore = 0;
    score.innerHTML = `${currentScore}`;
    gameScore.classList.add("hidden");
    finalScore.innerHTML = `${currentScore}`;

    game.forEach((g) => {
      g.remove();
    });
  });
}

const playbtn = document.querySelector(".ready-btn");
playbtn.addEventListener("click", (event) => {
  event.preventDefault();
  createCard();
});
