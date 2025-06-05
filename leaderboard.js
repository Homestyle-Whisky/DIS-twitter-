import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://gkkyhepijeaykkpukelb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra3loZXBpamVheWtrcHVrZWxiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzkwMzYwMiwiZXhwIjoyMDYzNDc5NjAyfQ.7vXzFlMDvqDLLWf2XA-jaz7KhLlN3jrH1Sd-EMe27n8";
const supabase = createClient(supabaseUrl, supabaseKey);

async function getTopScores() {
  const { data: topScores, error } = await supabase
    .from("games")
    .select("*")
    .order("score", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching top scores:", error);
    return [];
  }

  // Now fetch usernames for each score entry
  const scoresWithUsernames = await Promise.all(
    topScores.map(async (scoreEntry) => {
      const username = await getUsernameFromId(scoreEntry.user_id);
      return {
        ...scoreEntry,
        username: username || "Unknown",
      };
    })
  );

  console.log("Top scores with usernames:", scoresWithUsernames);
  return scoresWithUsernames;
}

async function getUsernameFromId(user_id) {
  const { data, error } = await supabase
    .from("users")
    .select("username")
    .eq("id", user_id)
    .single();

  if (error) {
    console.error(`Error fetching username for user_id ${user_id}:`, error);
    return null;
  }

  return data.username;
}

function createLeaderboard(scores) {
  const lbRank = document.querySelector(".leader-board-rang");
  const lbName = document.querySelector(".leader-board-name");
  const lbScore = document.querySelector(".leader-board-score");

  scores.forEach((entry, index) => {
    lbRank.insertAdjacentHTML(
      "beforeend",
      `<p class="padding-left">${index + 1}</p>`
    );
    lbName.insertAdjacentHTML(
      "beforeend",
      `<p class="padding-left">${entry.username}</p>`
    );
    lbScore.insertAdjacentHTML(
      "beforeend",
      `<p class="padding-left">${entry.score}</p>`
    );
  });
}

const checklb = document.querySelector(".check-leaderboard");
const lbPage = document.querySelector(".leaderboard-page");

checklb.addEventListener("click", async (e) => {
  e.preventDefault();

  // Clear previous leaderboard content
  const lb = document.querySelector(".leaderboard");
  lb.innerHTML = "";

  // Create leaderboard layout
  const lbHTML = `
    <div class="leaderboard-column leader-board-rang grid-left white-background"></div>
    <div class="leaderboard-column leader-board-name white-background"></div>
    <div class="leaderboard-column leader-board-score white-background"></div>
  `;
  lb.insertAdjacentHTML("beforeend", lbHTML);

  // Fetch updated scores and create leaderboard
  const scores = await getTopScores();
  createLeaderboard(scores);

  // Hide other screens
  document
    .querySelectorAll(".tweet-screen")
    .forEach((s) => s.classList.add("hidden"));
  document.querySelector(".end-screen").classList.add("hidden");
  document.querySelector(".game-score").classList.add("hidden");
  document.querySelector(".ready-container").classList.add("hidden");

  // Show leaderboard page
  lbPage.classList.remove("hidden");
});
