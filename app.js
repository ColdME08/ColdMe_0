const SUPABASE_URL = "https://yevwjtobdmoijtwkplps.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_AIqVlZbxfBfmnLeBn6hEzA_hGlSW5kj";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


// =========================
// LOAD LETTERS
// =========================

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

  container.innerHTML =
    "<p>Unable to load letters.</p>";

  return;
}


  if (!data || data.length === 0) {

    container.innerHTML =
      "<p>No letters yet.</p>";

    return;
  }


  container.innerHTML =
    data.map(post => {

      const date =
        new Date(post.created_at);

      const formattedDate =
        date.toLocaleDateString(
          "en-US",
          {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
          }
        );


      const paragraphs =
        post.content
          .split(/\n\s*\n/)
          .map(paragraph => `
            <p>
              ${paragraph.replace(
                /\n/g,
                "<br>"
              )}
            </p>
          `)
          .join("");


      const image =
        post.image_url
          ? `
            <img
              src="${post.image_url}"
              alt="${post.title || "COLDME photo"}"
              class="letter-image">
          `
          : "";


      return `
        <article class="letter">

          <div class="meta">
            ${formattedDate} · LETTER
          </div>

          <h3>
            ${post.title || "Untitled"}
          </h3>

          ${image}

          ${paragraphs}

        </article>
      `;

    }).join("");

}


// =========================
// LOAD MEMORIES
// =========================

async function loadMemories() {

  const container =
    document.getElementById("memories-container");

  if (!container) {
    return;
  }


  const { data, error } =
    await supabaseClient
      .from("posts")
      .select("*")
      .eq("type", "Memory")
      .order("created_at", {
        ascending: false
      });


  if (error) {

    console.error(
      "MEMORY ERROR:",
      error
    );

    container.innerHTML =
      "<p>Unable to load memories.</p>";

    return;
  }


  if (!data || data.length === 0) {

    container.innerHTML =
      "<p>No memories yet.</p>";

    return;
  }


  container.innerHTML =
    data.map(post => {

      const image =
        post.image_url
          ? `
            <img
              src="${post.image_url}"
              alt="${post.title || "COLDME memory"}"
              class="memory-image">
          `
          : "";


      const paragraphs =
        post.content
          .split(/\n\s*\n/)
          .map(paragraph => `
            <p>
              ${paragraph.replace(
                /\n/g,
                "<br>"
              )}
            </p>
          `)
          .join("");


      return `
        <article class="memory">

          ${image}

          <div class="memory-content">

            <div class="meta">
              MEMORY
            </div>

            <h3>
              ${post.title || "Untitled"}
            </h3>

            ${paragraphs}

          </div>

        </article>
      `;

    }).join("");

}


// =========================
// START
// =========================

// =========================
// LOAD JOURNAL
// =========================

async function loadJournal() {

  const container =
    document.getElementById("journal-container");

  if (!container) {
    return;
  }


  const { data, error } =
    await supabaseClient
      .from("posts")
      .select("*")
      .eq("type", "Journal")
      .order("created_at", {
        ascending: false
      });


  if (error) {

    console.error(
      "JOURNAL ERROR:",
      error
    );

    container.innerHTML =
      "<p>Unable to load journal.</p>";

    return;
  }


  if (!data || data.length === 0) {

    container.innerHTML =
      "<p>No journal entries yet.</p>";

    return;
  }


  container.innerHTML =
    data.map(post => {

      const date =
        new Date(post.created_at);

      const formattedDate =
        date.toLocaleDateString(
          "en-US",
          {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
          }
        );


      const paragraphs =
        post.content
          .split(/\n\s*\n/)
          .map(paragraph => `
            <p>
              ${paragraph.replace(
                /\n/g,
                "<br>"
              )}
            </p>
          `)
          .join("");


      const image =
        post.image_url
          ? `
            <img
              src="${post.image_url}"
              alt="${post.title || "COLDME journal photo"}"
              class="letter-image">
          `
          : "";


      return `
        <article class="letter">

          <div class="meta">
            ${formattedDate} · JOURNAL
          </div>

          <h3>
            ${post.title || "Untitled"}
          </h3>

          ${image}

          ${paragraphs}

        </article>
      `;

    }).join("");

}


// =========================
// START
// =========================

loadLetters();
loadMemories();
loadJournal();