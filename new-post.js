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
// FORM
// ===============================

const postForm = document.getElementById("post-form");
const postMessage = document.getElementById("post-message");


// ===============================
// CANCEL
// ===============================

document
  .getElementById("cancel-btn")
  .addEventListener("click", () => {

    window.location.href = "admin-dashboard.html";

  });


// ===============================
// PUBLISH
// ===============================

postForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const type =
    document.getElementById("post-type").value;

  const title =
    document.getElementById("post-title").value.trim();

  const content =
    document.getElementById("post-content").value.trim();


  if (!type || !title || !content) {

    postMessage.textContent =
      "Please fill in everything.";

    return;
  }


  postMessage.textContent =
    "Publishing...";


  // Save post to Supabase
  const { error } =
    await supabaseClient
      .from("posts")
      .insert([
        {
          title: title,
          content: content,
          type: type
        }
      ]);


  if (error) {

    console.error("POST ERROR:", error);

    postMessage.textContent =
      "Unable to publish: " + error.message;

    return;
  }


  // Success
  postMessage.textContent =
    "Published successfully!";


  setTimeout(() => {

    window.location.href =
      "admin-dashboard.html";

  }, 1000);

});


// ===============================
// START
// ===============================

checkLogin();