import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://gkkyhepijeaykkpukelb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra3loZXBpamVheWtrcHVrZWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzkwMzYwMiwiZXhwIjoyMDYzNDc5NjAyfQ.7vXzFlMDvqDLLWf2XA-jaz7KhLlN3jrH1Sd-EMe27n8";
const supabase = createClient(supabaseUrl, supabaseKey);

document.querySelectorAll(".password-wrapper").forEach((wrapper) => {
  const input = wrapper.querySelector(".password-field");
  const icon = wrapper.querySelector(".eye-icon");

  icon.addEventListener("click", () => {
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    icon.src = isHidden ? "Visual/show_pw.png" : "Visual/Hide_icon.png";
  });
});

async function fetchData() {
  const { data: tweet_data, error } = await supabase
    .from("tweet_data")
    .select("*");
  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }
  return tweet_data;
}

async function main(tweet_num) {
  const tweets = await fetchData();
  return tweets[tweet_num];
}

function createCard() {
  let tempListTweet = [];
  for (let i = 0; i < 10; i++) {
    const randomNumber = Math.floor(Math.random() * 120);
    if (tempListTweet.includes(randomNumber)) {
      return (i = i - 1);
    } else {
      tempListTweet.push(randomNumber);
      main(randomNumber).then((tweet) => {
        if (!tweet) return;

        let {
          name,
          tweet: message,
          image_url: img,
          username,
          is_real: valid,
        } = tweet;

        const htmlString = `
      <div class="game-screen hidden page tweet-screen">
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
          <div class="score next-tweet hidden">Next tweet</div>
        </div>
    </div>`;
        document
          .querySelector(".ready-container")
          .insertAdjacentHTML("afterend", htmlString);
      });
    }
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function submitFinalScore(score) {
  const user_id = localStorage.getItem("user_id");
  const game_id = localStorage.getItem("game_id");

  const { data, error } = await supabase
    .from("games")
    .update({ score: score })
    .eq("game_id", game_id);

  if (error) {
    console.error("Error updating score:", error);
  } else {
    console.log("Score updated successfully:", data);
  }
}

async function setupPageNavigation() {
  await wait(1000);

  const tweetScreens = document.querySelectorAll(".tweet-screen");
  const nextBtns = document.querySelectorAll(".next-tweet");
  const answerAI = document.querySelectorAll(".answer-ai");
  const answerReal = document.querySelectorAll(".answer-real");
  const wrongAI = document.querySelectorAll(".wrong-ai");
  const rightAI = document.querySelectorAll(".right-ai");
  const wrongReal = document.querySelectorAll(".wrong-real");
  const rightReal = document.querySelectorAll(".right-real");
  const score = document.getElementById("score");
  const finalScore = document.querySelector(".final-score");
  const endScreen = document.querySelector(".end-screen");

  let currentTweet = 0;
  let currentScore = 0;
  let timeAnswered = 0;

  nextBtns[tweetScreens.length - 1].innerText = `End game!`;
  nextBtns[tweetScreens.length - 1].classList.add("end-game");
  const endgame = document.querySelector(".end-game");

  endgame.addEventListener("click", () => {
    submitFinalScore(currentScore);
    wait(1000);
  });

  nextBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      if (index < tweetScreens.length - 1) {
        tweetScreens[currentTweet].classList.add("hidden");
        currentTweet++;
        tweetScreens[currentTweet].classList.remove("hidden");
        timeAnswered = 0;
      } else {
        finalScore.innerHTML = `Score: <strong>${currentScore}</strong>`;
        endScreen.classList.remove("hidden");
      }
    });
  });

  answerAI.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (timeAnswered === 0) {
        if (btn.classList.contains("false")) {
          rightAI[currentTweet].classList.remove("hidden");
          currentScore++;
          score.innerHTML = `${currentScore}`;
        } else {
          wrongReal[currentTweet].classList.remove("hidden");
        }
        nextBtns[currentTweet].classList.remove("hidden");
        timeAnswered = 1;
      }
    });
  });

  answerReal.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (timeAnswered === 0) {
        if (btn.classList.contains("false")) {
          wrongAI[currentTweet].classList.remove("hidden");
        } else {
          rightReal[currentTweet].classList.remove("hidden");
          currentScore++;
          score.innerHTML = `${currentScore}`;
        }
        nextBtns[currentTweet].classList.remove("hidden");
        timeAnswered = 1;
      }
    });
  });
}

async function playgame() {
  const user_id = localStorage.getItem("user_id");
  if (!user_id) {
    alert("Not logged in.");
    return;
  }

  const { data, error } = await supabase
    .from("games")
    .insert({ user_id, score: 0 })
    .select();

  if (error) {
    console.error("Game creation failed:", error.message);
    return;
  }

  const game_id = data[0].game_id;
  localStorage.setItem("game_id", game_id);
  console.log("Game started:", game_id);

  createCard();
  await wait(1000);

  document.querySelector(".ready-container").classList.add("hidden");
  document.querySelector(".game-screen").classList.remove("hidden");
  document.querySelector(".game-score").classList.remove("hidden");

  setupPageNavigation();
}

function restart() {
  const tweetScreens = document.querySelectorAll(".tweet-screen");
  const allPages = document.querySelectorAll(".page");
  const score = document.getElementById("score");
  const finalScore = document.querySelector(".final-score");
  const endScreen = document.querySelector(".end-screen");
  const gameScore = document.querySelector(".game-score");

  tweetScreens.forEach((s) => s.remove());
  allPages[2].classList.remove("hidden");
  endScreen.classList.add("hidden");
  gameScore.classList.add("hidden");
  score.innerHTML = `0`;
  finalScore.innerHTML = `0`;
}

const playAgain = document.querySelector(".play-again");
const lbPage = document.querySelector(".leaderboard-page");
playAgain.addEventListener("click", (e) => {
  e.preventDefault();
  const leaderBoard = document.querySelector(".leaderboard");
  leaderBoard.innerHTML = "";
  lbPage.classList.add("hidden");
  restart();
});

// Wait for DOM to load before hooking up events
document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.querySelector(".ready-btn");
  const restartBtn = document.querySelector(".restart-button");

  playBtn.addEventListener("click", (e) => {
    e.preventDefault();
    playgame();
  });

  restartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    restart();
  });

  // Login form setup
  const loginForm = document.getElementById("login-form");
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login failed:", error.message);
      return;
    }

    const user_id = data.user.id;
    localStorage.setItem("user_id", user_id);
    console.log("Logged in as:", user_id);

    document.querySelector("#login-container").classList.add("hidden");
    document.querySelector("#ready-container").classList.remove("hidden");
  });
});
