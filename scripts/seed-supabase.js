/**
 * Supabase Seeding Script for Pro Tech Enterprises
 * Syncs the initial seed dataset into Supabase PostgreSQL tables.
 *
 * Usage:
 *   node scripts/seed-supabase.js
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "";

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

if (!supabaseUrl || !supabaseKey) {
  console.log("Supabase URL or Key not found in environment variables.");
  console.log("Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_URL and SUPABASE_KEY) are set.");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function runSeed() {
  const dataFile = path.join(__dirname, "..", "data", "pte_database.json");
  if (!fs.existsSync(dataFile)) {
    console.error("data/pte_database.json not found.");
    process.exit(1);
  }

  const raw = fs.readFileSync(dataFile, "utf-8");
  const data = JSON.parse(raw);

  console.log(`Connecting to Supabase at: ${supabaseUrl}`);

  try {
    // 1. Categories
    if (data.categories?.length) {
      console.log(`Seeding ${data.categories.length} categories...`);
      const { error: catErr } = await supabase
        .from("categories")
        .upsert(data.categories, { onConflict: "id" });
      if (catErr) console.warn("Notice seeding categories:", catErr.message);
      else console.log("✓ Categories synced successfully.");
    }

    // 2. Products
    if (data.products?.length) {
      console.log(`Seeding ${data.products.length} products...`);
      const { error: prodErr } = await supabase
        .from("products")
        .upsert(data.products, { onConflict: "id" });
      if (prodErr) console.warn("Notice seeding products:", prodErr.message);
      else console.log("✓ Products synced successfully.");
    }

    // 3. Settings
    if (data.settings) {
      console.log("Seeding application settings...");
      const { error: setErr } = await supabase
        .from("application_settings")
        .upsert([{ id: 1, ...data.settings }], { onConflict: "id" });
      if (setErr) console.warn("Notice seeding settings:", setErr.message);
      else console.log("✓ Settings synced successfully.");
    }

    console.log("Supabase synchronization check completed!");
  } catch (err) {
    console.error("Unexpected error during Supabase sync:", err.message);
  }
}

runSeed();
