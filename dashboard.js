const SUPABASE_URL = "https://yevwjtobdmoijtwkplps.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_AIqVlZbxfBfmnLeBn6hEzA_hGlSW5kj";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// Check if the admin is logged in
async function checkLogin() {

  const { data, error } = await supabaseClient.auth.getSession();

  if (error || !data.session) {
    window.location.href = "admin.html";
    return false;
  }

  return true;
}


// Load posts
async function loadPosts() {

  const postsList = document.getElementById("posts-list");

  const { data, error } = await supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    postsList.innerHTML = `
      <p>Unable to load posts.</p>
    `;

    return;
  }


  // No posts yet
  if (!data || data.length === 0) {

    postsList.innerHTML = `
      <p>No posts yet.</p>
    `;

    return;
  }


  // Display posts
  postsList.innerHTML = data.map(post => {

    const date = new Date(post.created_at);

    const formattedDate = date.toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );


    return `
      <article class="admin-post">

        <div>

          <p class="admin-post-type">
            ${post.type || "POST"}
          </p>

          <h3>
            ${post.title || "Untitled"}
          </h3>

          <p class="admin-post-date">
            ${formattedDate}
          </p>

        </div>

        <div class="admin-post-actions">

          <button
            class="edit-button"
            data-id="${post.id}">
            EDIT
          </button>

          <button
            class="delete-button"
            data-id="${post.id}">
            DELETE
          </button>

        </div>

      </article>
    `;

  }).join("");

}


// Log out
async function logout() {

  await supabaseClient.auth.signOut();

  window.location.href = "admin.html";

}


// New post button
document
  .getElementById("new-post-btn")
  .addEventListener("click", () => {

    window.location.href = "new-post.html";

  });


// Logout button
document
  .getElementById("logout-btn")
  .addEventListener("click", logout);


// Start dashboard
async function startDashboard() {

  const loggedIn = await checkLogin();

  if (!loggedIn) {
    return;
  }

  await loadPosts();

}

startDashboard();