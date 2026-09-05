const SUPABASE_URL = "https://yevwjtobdmoijtwkplps.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_AIqVlZbxfBfmnLeBn6hEzA_hGlSW5kj";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// ===============================
// LOAD LETTERS
// ===============================

async function loadLetters() {

  const container =
    document.getElementById("letters-container");

  if (!container) {
    return;
  }


  const { data, error } =
    await supabaseClient
      .from("posts")
      .select("*")
      .eq("type", "Letter")
      .order("created_at", {
        ascending: false
      });


  if (error) {

    console.error("LETTER ERROR:", error);

    container.innerHTML = `
      <p>Unable to load letters.</p>
    `;

    return;
  }


  if (!data || data.length === 0) {

    container.innerHTML = `
      <p>No letters yet.</p>
    `;

    return;
  }


  container.innerHTML = data.map(post => {

    const date =
      new Date(post.created_at);

    const formattedDate =
      date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric"
      });


    // Convert line breaks into paragraphs
    const paragraphs =
      post.content
        .split(/\n\s*\n/)
        .map(paragraph => `
          <p>${paragraph.replace(/\n/g, "<br>")}</p>
        `)
        .join("");


    return `
      <article class="letter">

        <div class="meta">
          ${formattedDate} · LETTER
        </div>

        <h3>
          ${post.title || "Untitled"}
        </h3>

        ${paragraphs}

      </article>
    `;

  }).join("");

}


// ===============================
// START
// ===============================

loadLetters();