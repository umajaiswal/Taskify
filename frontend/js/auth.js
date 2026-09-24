// Handles the login and register forms.
const messageBox = document.getElementById("message");
const submitBtn = document.getElementById("submit-btn");

// Already logged in? Go straight to the dashboard.
if (getToken()) window.location.href = "dashboard.html";

function showMessage(text, type = "error") {
  messageBox.textContent = text;
  messageBox.className = "message " + type;
}

function setLoading(isLoading, loadingText, normalText) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? loadingText : normalText;
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
      showMessage("Enter your username and password.");
      return;
    }

    setLoading(true, "Logging in...", "Log in");
    try {
      const result = await api.login({ username, password });
      saveToken(result.token);
      window.location.href = "dashboard.html";
    } catch (error) {
      showMessage(error.message);
      setLoading(false, "Logging in...", "Log in");
    }
  });
}

const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const user = {
      name: document.getElementById("name").value.trim(),
      username: document.getElementById("username").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
    };

    if (!user.name || !user.username || !user.email || !user.password) {
      showMessage("Fill in every field.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      showMessage("Enter a valid email address.");
      return;
    }
    if (user.password.length < 6) {
      showMessage("Use a password with at least 6 characters.");
      return;
    }

    setLoading(true, "Creating account...", "Create account");
    try {
      await api.register(user);
      showMessage("Account created. Taking you to login...", "success");
      setTimeout(() => (window.location.href = "login.html"), 1200);
    } catch (error) {
      showMessage(error.message);
      setLoading(false, "Creating account...", "Create account");
    }
  });
}
