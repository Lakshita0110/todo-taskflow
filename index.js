document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userForm");
  const error = document.getElementById("error");

  const userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) window.location.href = "app.html";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const dob = new Date(document.getElementById("dob").value);
    const age = new Date().getFullYear() - dob.getFullYear();

    if (!name || isNaN(dob)) {
      error.textContent = "Please enter valid name and date.";
      return;
    }

    if (age <= 10) {
      error.textContent = "You must be older than 10.";
    } else {
      const data = { name, dob: dob.toISOString() };
      localStorage.setItem("userData", JSON.stringify(data));
      window.location.href = "app.html";
    }
  });
});
