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
      <div class="game-screen hidden tweet-screen">
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

// // Function to send guess to Flask backend
// async function sendGuess(user_id, tweet_id, user_answer, correct_answer) {
//   const response = await fetch("http://localhost:5000/submit_guess", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       user_id: user_id,
//       tweet_id: tweet_id,
//       user_answer: user_answer,
//       correct_answer: correct_answer,
//     }),
//   });

//   const result = await response.json();
//   console.log("Flask-svar:", result);
// }

// // Testfunktion kaldet af knappen
// function testGuess() {
//   sendGuess(
//     "075db9a5-1b1f-40ed-aa07-e5f37ccedc5c", // user_id
//     42, // tweet_id
//     true, // user_answer
//     false // correct_answer
//   );
// }

// Function to handle the "PLAY" button click
document.querySelector(".ready-btn").addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:5000/start_game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // You can send additional data here if needed
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Game started with ID:", data.game_id);
    // Redirect to the game page or update the UI as needed
    window.location.href = "game.html"; // Change to your game page URL
  } catch (error) {
    console.error("Error starting game:", error);
  }
});

// Existing functions...
