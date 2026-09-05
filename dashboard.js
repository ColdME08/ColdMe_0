const SUPABASE_URL = "https://yevwjtobdmoijtwkplps.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_AIqVlZbxfBfmnLeBn6hEzA_hGlSW5kj";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ===============================
// BUTTONS
// ===============================

document.getElementById("logout-btn").addEventListener("click", async () => {

  await supabaseClient.auth.signOut();

  window.location.href = "admin.html";

});


document.getElementById("new-post-btn").addEventListener("click", () => {

  alert("New Post is coming next.");

});


// ===============================
// LOAD POSTS
// ===============================

async function loadPosts() {

  const postsList = document.getElementById("posts-list");

  postsList.innerHTML = "<p>Loading posts...</p>";

  try {

    const result = await supabaseClient
      .from("posts")
      .select("*")
      .order("created_at", {
        ascending: false
      });

    console.log("Supabase result:", result);

    if (result.error) {

      console.error("Supabase error:", result.error);

      postsList.innerHTML = `
        <p>Unable to load posts.</p>
        <p>${result.error.message}</p>
      `;

      return;
    }

    const posts = result.data;

    if (!posts || posts.length === 0) {

      postsList.innerHTML = `
        <p>No posts yet.</p>
      `;

      return;
    }

    postsList.innerHTML = posts.map(post => {

      const date = new Date(post.created_at);

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

  } catch (error) {

    console.error("Dashboard error:", error);

    postsList.innerHTML = `
      <p>Dashboard error:</p>
      <p>${error.message}</p>
    `;

  }

}


// ===============================
// CHECK LOGIN
// ===============================

async function startDashboard() {

  const { data, error } =
    await supabaseClient.auth.getSession();

  console.log("Session:", data);

  if (error) {

    console.error("Session error:", error);

    return;
  }

  if (!data.session) {

    window.location.href = "admin.html";

    return;
  }

  loadPosts();

}


startDashboard();