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

  if (error) {
    console.error("SESSION ERROR:", error);
    return false;
  }

  if (!session) {
    window.location.href = "admin.html";
    return false;
  }

  console.log("Admin logged in:", session.user.email);

  return true;
}


// ===============================
// LOAD POSTS
// ===============================

async function loadPosts() {

  const postsList = document.getElementById("posts-list");

  postsList.innerHTML = "<p>Loading posts...</p>";

  const { data, error } = await supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", {
      ascending: false
    });


  // Show the REAL error
  if (error) {

    console.error("POST LOAD ERROR:", error);

    postsList.innerHTML = `
      <p>Unable to load posts.</p>

      <p style="font-size: 14px; margin-top: 10px;">
        ${error.message}
      </p>
    `;

    return;
  }


  console.log("POSTS:", data);


  // No posts
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
          </h3