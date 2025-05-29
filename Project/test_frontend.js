document.getElementById("create-account-form").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const email = event.target.email.value;
    const full_name = event.target.full_name.value;
    const password = event.target.password.value;
  
    try {
      const response = await fetch("http://localhost:5000/create_account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, full_name, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        document.getElementById("response-text").innerText = "✅ " + data.message;
      } else {
        document.getElementById("response-text").innerText = "❌ " + data.error;
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("response-text").innerText = "❌ Failed to connect to backend.";
    }
  });
  