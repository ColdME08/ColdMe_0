const SUPABASE_URL = "https://yevwjtobdmoijtwkplps.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_AIqVlZbxfBfmnLeBn6hEzA_hGlSW5kj";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


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


// ELEMENTS
const postForm =
  document.getElementById("post-form");

const postMessage =
  document.getElementById("post-message");

const imageInput =
  document.getElementById("post-image");


// CANCEL
document
  .getElementById("cancel-btn")
  .addEventListener("click", () => {

    window.location.href =
      "admin-dashboard.html";

  });


// PUBLISH
postForm.addEventListener("submit", async (event) => {

  event.preventDefault();


  const type =
    document.getElementById("post-type").value;

  const title =
    document.getElementById("post-title").value.trim();

  const content =
    document.getElementById("post-content").value.trim();

  const imageFile =
    imageInput.files[0];


  if (!type || !title || !content) {

    postMessage.textContent =
      "Please fill in everything.";

    return;
  }


  postMessage.textContent =
    "Publishing...";


  let imageUrl = null;


  // UPLOAD PHOTO
  if (imageFile) {

    postMessage.textContent =
      "Uploading photo...";


    const fileExtension =
      imageFile.name.split(".").pop();

    const fileName =
      Date.now() +
      "-" +
      Math.random()
        .toString(36)
        .substring(2) +
      "." +
      fileExtension;


    const filePath =
      fileName;


    const { error: uploadError } =
      await supabaseClient
        .storage
        .from("Coldme-photos")
        .upload(
          filePath,
          imageFile,
          {
            cacheControl: "3600",
            upsert: false
          }
        );


    if (uploadError) {

      console.error(
        "UPLOAD ERROR:",
        uploadError
      );

      postMessage.textContent =
        "Unable to upload photo: " +
        uploadError.message;

      return;
    }


    // GET PUBLIC PHOTO URL

    const {
      data: publicUrlData
    } =
      supabaseClient
        .storage
        .from("Coldme-photos")
        .getPublicUrl(filePath);


    imageUrl =
      publicUrlData.publicUrl;

  }


  // SAVE POST

  postMessage.textContent =
    "Saving post...";


  const { error } =
    await supabaseClient
      .from("posts")
      .insert([
        {
          title: title,
          content: content,
          type: type,
          image_url: imageUrl
        }
      ]);


  if (error) {

    console.error(
      "POST ERROR:",
      error
    );

    postMessage.textContent =
      "Unable to publish: " +
      error.message;

    return;
  }


  // SUCCESS

  postMessage.textContent =
    "Published successfully!";


  setTimeout(() => {

    window.location.href =
      "admin-dashboard.html";

  }, 1000);

});


// START
checkLogin();