const SUPABASE_URL = "https://yevwjtobdmoijtwkplps.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_AIqVlZbxfBfmnLeBn6hEzA_hGlSW5kj";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  loginMessage.textContent = "Logging in...";

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    loginMessage.textContent = "Login failed: " + error.message;
    return;
  }

  loginMessage.textContent = "Login successful.";

  window.location.href = "admin-dashboard.html";
});