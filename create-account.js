// showSlide helper
function showSlide(id) {
  document
    .querySelectorAll(".page")
    .forEach((el) => el.classList.add("hidden"));
  const slide = document.getElementById(id);
  if (slide) slide.classList.remove("hidden");
}

// INIT logic on each page
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("createAccount");
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    // Email regex check
    const emailPattern =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|org|net|edu|io|gov)$/;
    if (!emailPattern.test(email)) {
      alert("error please enter a valid email address");
      return;
      // <— exit early: never hit fetch() if invalid
    }

    try {
      const res = await fetch("https://dis-twitter.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return alert("Sign-up failed: " + (data.error || data.details));
      }

      alert("Account created! Please log in.");
      showSlide("login-container");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Network or CORS error: " + err.message);
    }
  });

  // Loginform Listener
  const loginForm = document.querySelector("#login-container form");
  if (!loginForm) {
    console.error("Could not find the login <form> inside #login-container");
  } else {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      // Email regex check
      const emailPattern =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|org|net|edu|io|gov)$/;
      if (!emailPattern.test(email)) {
        alert("error please enter a valid email address");
        return;
        // <— exit early: never hit fetch() if invalid
      }

      const res = await fetch("https://dis-twitter.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return alert("Login Failed:" + data.error);
      }

      localStorage.setItem("sb-access-token", data.session.access_token);
      localStorage.setItem("sb-refresh-token", data.session.refresh_token);
      localStorage.setItem("user_id", data.user.id);
      showSlide("ready-container");
    });
    // end Loginform listener

    // login knap funktionalitet
    const toLoginLink = document.querySelector(
      "#create-account-container .login-link a"
    );
    toLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      showSlide("login-container");
    });

    // register knap funktionalitet
    const toRegisterLink = document.querySelector(
      ".login-link.register-page a"
    );
    if (toRegisterLink) {
      toRegisterLink.addEventListener("click", (e) => {
        e.preventDefault();
        showSlide("create-account-container");
      });
    }
  }
});
