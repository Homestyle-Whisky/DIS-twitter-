import pandas as pd

# Load your CSV file
df = pd.read_csv("tweets_dataset.csv")  # Change this to your actual filename

print(df["name"][0])
print(df["tweet"][0])
print(df["is_real"][0])

def buildHTML(data):
    html_output = ""
    # for i in range(0, len(data)-1):
    for i in range(0, 1):
        html_output += f"""
    <div class="game-screen hidden page">
      <div class="game-score">
        <div class="score">Score: <span id="score">0</span></div>
      </div>
      <div>
        <h1 class="game-h1">Is this tweet real or AI?</h1>
      </div>
      <div class="tweet-card">
        <div class="tweet-header">
          <img src="" alt="Profile picture" class="avatar" />
          <div class="tweet-user">
            <strong class="tweet-name">{data["name"][i]}</strong><br />
            <span class="handle">@ryanrenolds</span>
          </div>
        </div>
        <div class="tweet-content">
          {data["tweet"][i]}
        </div>
      </div>

      <div class="choice-buttons">
        <button class="choice-button {data["is_real"][i]}">← AI</button>
        <button class="choice-button {data["is_real"][i]}">Real →</button>
      </div>
      <div class="game-answer right hidden">
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
      <div class="game-answer wrong">
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
    </div>
    """
    return html_output
