// Shared game state
let score = 0;
let currentIndex = 0;
const tweets = [
  { text: "I had spaghetti and it was very nice i enjoyed it", isReal: true },
  { text: "The robot uprising begins tomorrow. #AI",       isReal: false },
  // Add more tweets here
];

// Update tweet content dynamically
function loadTweet() {
  const tweet = tweets[currentIndex];
  if (!tweet) {
    localStorage.setItem('score', score);
    window.location.href = 'end.html';
    return;
  }
  document.querySelector('.tweet-content').textContent = tweet.text;
}

// Show correct/wrong popup
function showFeedback(isCorrect) {
  const popup   = document.getElementById('feedback-popup');
  const title   = document.getElementById('feedback-title');
  const subtext = document.getElementById('feedback-subtext');
  const icon    = document.getElementById('feedback-icon');

  if (isCorrect) {
    title.textContent   = "Correct!";
    subtext.textContent = "That tweet was real";
    icon.src            = "Pickle_green.png";
  } else {
    title.textContent   = "Wrong!";
    subtext.textContent = "That tweet was AI";
    icon.src            = "Red_pickle.png";
  }

  popup.classList.remove('hidden');
  setTimeout(() => popup.classList.add('hidden'), 2000);
}

// Handle user guess
function handleChoice(isRealChosen) {
  const tweet     = tweets[currentIndex];
  const isCorrect = tweet.isReal === isRealChosen;

  if (isCorrect) score++;
  document.getElementById('score').textContent = score;
  showFeedback(isCorrect);

  currentIndex++;
  setTimeout(loadTweet, 600);
}

// INIT logic on each page
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("createAccount");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email    = document.getElementById("email").value;
    const name     = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password })
      });

      const data = await res.json();
      console.log("Signup result:", data);

      if (res.ok) {
        alert("Account created successfully!");
        window.location.href = "ready.html";
      } else {
        alert("Signup failed: " + (data.error || "Unknown error"));
      }

    } catch (err) {
      console.error("Signup error:", err);
      alert("Network or CORS error: " + err.message);
    }

  });  // end signupForm listener
  
  // ───── Ready page ─────
  if (page === 'ready.html') {
    document.querySelector('.ready-btn').addEventListener('click', () => {
      score = 0;
      currentIndex = 0;
      window.location.href = 'game.html';
    });
  }

  // ───── Game page ─────
  if (page === 'game.html') {
    document.querySelectorAll('.choice-button')[0]
            .addEventListener('click', () => handleChoice(false));
    document.querySelectorAll('.choice-button')[1]
            .addEventListener('click', () => handleChoice(true));

    // inject feedback popup
    const popup = document.createElement('div');
    popup.id    = 'feedback-popup';
    popup.className = 'feedback-popup hidden';
    popup.innerHTML = `
      <div class="feedback-text">
        <strong id="feedback-title">Correct!</strong><br>
        <span id="feedback-subtext">That tweet was real</span>
      </div>
      <img id="feedback-icon" src="Correct.png" alt="Feedback Icon">
    `;
    document.body.appendChild(popup);

    loadTweet();
    document.getElementById('score').textContent = score;
  }

  // ───── End page ─────
  if (page === 'end.html') {
    const finalScore = localStorage.getItem('score') || 0;
    document.getElementById('final-score').textContent = finalScore;
    document.querySelector('.restart-button')
            .addEventListener('click', () => {
              score = 0;
              currentIndex = 0;
              window.location.href = 'ready.html';
            });
  }
}); 
