import pandas as pd

# Load your CSV file
df = pd.read_csv("tweets_dataset.csv")  # Change this to your actual filename

# Build HTML
html_output = ""

for _, row in df.iterrows():
    html_output += f'<p>"{row["name"]}"</p>\n'
    html_output += f'<p>"{row["tweet"]}"</p>\n'
    html_output += f'<p>"{row["is_real"]}"</p>\n'
    html_output += "<hr>\n"  # Optional separator

# Save to HTML file
with open("output.html", "w", encoding="utf-8") as f:
    f.write(html_output)

print("HTML file created: output.html")
