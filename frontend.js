const createAccountBtn = document.querySelector(".create-account");
const slide1 = document.querySelector(".slide-1");

createAccountBtn.addEventListener("click", (e) => {
  e.preventDefault(); // prevent form from submitting
  slide1.classList.add("hidden");
});
