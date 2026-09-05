const SUPABASE_URL = "https://yevwjtobdmoijtwkplps.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_AIqVlZbxfBfmnLeBn6hEzA_hGlSW5kj";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

async function loadPosts() {
  const { data, error } = await supabaseClient
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading posts:", error);
    return;
  }

  console.log("COLDME posts:", data);
}

loadPosts();