import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL ?? process.env.NETLIFY_DATABASE_URL;
if (!databaseUrl) {
  console.error("ERROR: DATABASE_URL or NETLIFY_DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function setup() {
  console.log("Running DB setup...");

  await sql`
    CREATE TABLE IF NOT EXISTS items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      asset_number TEXT,
      category TEXT,
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log("✓ items table ready");

  await sql`
    CREATE TABLE IF NOT EXISTS loan_records (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      item_id UUID NOT NULL REFERENCES items(id),
      borrower_name TEXT NOT NULL,
      loaned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      returned_at TIMESTAMPTZ
    )
  `;
  console.log("✓ loan_records table ready");

  console.log("DB setup complete.");
}

setup().catch((err) => {
  console.error("DB setup failed:", err);
  process.exit(1);
});
