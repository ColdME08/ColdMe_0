const SUPABASE_URL = "https://yevwjtobdmoijtwkplps.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_AIqVlZbxfBfmnLeBn6hEzA_hGlSW5kj";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// GET POST ID
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");


// ELEMENTS
const form = document.getElementById("edit-form");
const message = document.getElementById("edit-message");


// CHECK LOGIN
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


// LOAD POST
async function loadPost() {

  if (!postId) {
    message.textContent = "No post selected.";
    return;
  }

  message.textContent = "Loading post...";

  const { data, error } = await supabaseClient
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error) {

    console.error("LOAD POST ERROR:", error);

    message.textContent =
      "Unable to load post: " + error.message;

    return;
  }

  document.getElementById("post-type").value =
    data.type || "Letter";

  document.getElementById("post-title").value =
    data.title || "";

  document.getElementById("post-content").value =
    data.content || "";

  message.textContent = "";
}


// SAVE CHANGES
form.addEventListener("submit", async (event) => {

  event.preventDefault();

  const type =
    document.getElementById("post-type").value;

  const title =
    document.getElementById("post-title").value.trim();

  const content =
    document.getElementById("post-content").value.trim();

  if (!title || !content) {
    message.textContent =
      "Please fill in everything.";
    return;
  }

  message.textContent = "Saving...";

  const { error } = await supabaseClient
    .from("posts")
    .update({
      type: type,
      title: title,
      content: content
    })
    .eq("id", postId);

  if (error) {

    console.error("UPDATE ERROR:", error);

    message.textContent =
      "Unable to save: " + error.message;

    return;
  }

  message.textContent =
    "Changes saved!";

  setTimeout(() => {
    window.location.href =
      "admin-dashboard.html";
  }, 1000);

});


// CANCEL
document
  .getElementById("cancel-btn")
  .addEventListener("click", () => {

    window.location.href =
      "admin-dashboard.html";

  });


// START
async function start() {

  const loggedIn = await checkLogin();

  if (!loggedIn) {
    return;
  }

  await loadPost();

}

start();