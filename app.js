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


  // LETTER LIST

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

      return `
        <article class="letter-preview">

          <div class="meta">
            ${formattedDate} · LETTER
          </div>

          <h3>
            ${post.title || "Untitled"}
          </h3>

          <button
            class="letter-more"
            data-id="${post.id}">
            SEE MORE →
          </button>

        </article>
      `;

    }).join("");


  // SEE MORE BUTTONS

  document
    .querySelectorAll(".letter-more")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const id =
            button.getAttribute("data-id");

          showLetterEntry(
            data,
            id
          );

        }
      );

    });

}


// =========================
// SHOW LETTER
// =========================

function showLetterEntry(
  posts,
  id
) {

  const container =
    document.getElementById("letters-container");

  const post =
    posts.find(
      item => String(item.id) === String(id)
    );

  if (!post) {
    return;
  }


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


  container.innerHTML = `

    <article class="letter-full">

      <div class="meta">
        ${formattedDate} · LETTER
      </div>

      <h3>
        ${post.title || "Untitled"}
      </h3>

      ${image}

      <div class="letter-content">
        ${paragraphs}
      </div>

      <button
        id="back-to-letters"
        class="journal-back">
        ← BACK TO LETTERS
      </button>

    </article>

  `;


  document
    .getElementById("back-to-letters")
    .addEventListener(
      "click",
      () => {

        loadLetters();

      }
    );


  document
    .getElementById("letters")
    .scrollIntoView({
      behavior: "smooth"
    });

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

    console.error("MEMORY ERROR:", error);

    container.innerHTML =
      "<p>Unable to load memories.</p>";

    return;
  }

  if (!data || data.length === 0) {

    container.innerHTML =
      "<p>No memories yet.</p>";

    return;
  }


  // MEMORY LIST

  container.innerHTML =
    data.map(post => {

      const image =
        post.image_url
          ? `
            <img
              src="${post.image_url}"
              alt="${post.title || "COLDME memory"}"
              class="memory-preview-image">
          `
          : "";

      return `
        <article class="memory-preview">

          ${image}

          <div class="memory-preview-content">

            <div class="meta">
              MEMORY
            </div>

            <h3>
              ${post.title || "Untitled"}
            </h3>

            <button
              class="memory-more"
              data-id="${post.id}">
              SEE MORE →
            </button>

          </div>

        </article>
      `;

    }).join("");


  // SEE MORE BUTTONS

  document
    .querySelectorAll(".memory-more")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const id =
            button.getAttribute("data-id");

          showMemoryEntry(
            data,
            id
          );

        }
      );

    });

}


// =========================
// SHOW MEMORY
// =========================

function showMemoryEntry(
  posts,
  id
) {

  const container =
    document.getElementById("memories-container");

  const post =
    posts.find(
      item => String(item.id) === String(id)
    );

  if (!post) {
    return;
  }


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


  container.innerHTML = `

    <article class="memory-full">

      ${image}

      <div class="memory-content">

        <div class="meta">
          MEMORY
        </div>

        <h3>
          ${post.title || "Untitled"}
        </h3>

        ${paragraphs}

        <button
          id="back-to-memories"
          class="journal-back">
          ← BACK TO MEMORIES
        </button>

      </div>

    </article>

  `;


  document
    .getElementById("back-to-memories")
    .addEventListener(
      "click",
      () => {

        loadMemories();

      }
    );


  document
    .getElementById("memories")
    .scrollIntoView({
      behavior: "smooth"
    });

}


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

    console.error("JOURNAL ERROR:", error);

    container.innerHTML =
      "<p>Unable to load journal.</p>";

    return;
  }

  if (!data || data.length === 0) {

    container.innerHTML =
      "<p>No journal entries yet.</p>";

    return;
  }


  // JOURNAL LIST

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

      return `
        <article class="journal-preview">

          <div class="meta">
            ${formattedDate} · JOURNAL
          </div>

          <h3>
            ${post.title || "Untitled"}
          </h3>

          <button
            class="journal-more"
            data-id="${post.id}">
            SEE MORE →
          </button>

        </article>
      `;

    }).join("");


  // SEE MORE BUTTONS

  document
    .querySelectorAll(".journal-more")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const id =
            button.getAttribute("data-id");

          showJournalEntry(
            data,
            id
          );

        }
      );

    });

}


// =========================
// SHOW JOURNAL
// =========================

function showJournalEntry(
  posts,
  id
) {

  const container =
    document.getElementById("journal-container");

  const post =
    posts.find(
      item => String(item.id) === String(id)
    );

  if (!post) {
    return;
  }


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


  container.innerHTML = `

    <article class="journal-full">

      <div class="meta">
        ${formattedDate} · JOURNAL
      </div>

      <h3>
        ${post.title || "Untitled"}
      </h3>

      ${image}

      <div class="journal-content">
        ${paragraphs}
      </div>

      <button
        id="back-to-journal"
        class="journal-back">
        ← BACK TO JOURNAL
      </button>

    </article>

  `;


  document
    .getElementById("back-to-journal")
    .addEventListener(
      "click",
      () => {

        loadJournal();

      }
    );


  document
    .getElementById("journal")
    .scrollIntoView({
      behavior: "smooth"
    });

}


// =========================
// START
// =========================

loadLetters();
loadMemories();
loadJournal();