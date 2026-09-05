const SUPABASE_URL = "https://yevwjtobdmoijtwkplps.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_AIqVlZbxfBfmnLeBn6hEzA_hGlSW5kj";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ===============================
// CHECK LOGIN
// ===============================

async function checkLogin() {

  const {
    data: { session },
    error
  } = await supabaseClient.auth.getSession();

  if (error || !session) {

    window.location.href = "admin.html";

    return false;
  }

  return true;
}


// ===============================
// LOAD POSTS
// ===============================

async function loadPosts() {

  const postsList =
    document.getElementById("posts-list");

  postsList.innerHTML =
    "<p>Loading posts...</p>";


  const { data, error } =
    await supabaseClient
      .from("posts")
      .select("*")
      .order("created_at", {
        ascending: false
      });


  if (error) {

    console.error("POST LOAD ERROR:", error);

    postsList.innerHTML = `
      <p>Unable to load posts.</p>
      <p>${error.message}</p>
    `;

    return;
  }


  if (!data || data.length === 0) {

    postsList.innerHTML = `
      <p>No posts yet.</p>
    `;

    return;
  }


  postsList.innerHTML = data.map(post => {

    const date =
      new Date(post.created_at);

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
            ${date.toLocaleDateString()}
          </p>

        </div>

      </article>
    `;

  }).join("");

}


// ===============================
// NEW POST
// ===============================

document
  .getElementById("new-post-btn")
  .addEventListener("click", () => {

    window.location.href =
      "new-post.html";

  });


// ===============================
// LOG OUT
// ===============================

document
  .getElementById("logout-btn")
  .addEventListener("click", async () => {

    await supabaseClient.auth.signOut();

    window.location.href =
      "admin.html";

  });


// ===============================
// START
// ===============================

async function startDashboard() {

  const loggedIn =
    await checkLogin();

  if (!loggedIn) {
    return;
  }

  await loadPosts();

}

startDashboard();