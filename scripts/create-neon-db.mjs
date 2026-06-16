import pg from "pg";

const password = process.env.NEON_PASSWORD;
if (!password) {
  console.error("NEON_PASSWORD is required");
  process.exit(1);
}

const host =
  "ep-delicate-bird-aepydbfp-pooler.c-2.us-east-2.aws.neon.tech";
const user = "neondb_owner";
const adminDb = process.env.NEON_ADMIN_DB || "postgres";
const newDb = process.env.NEON_NEW_DB || "donaangela";

const client = new pg.Client({
  host,
  port: 5432,
  user,
  password,
  database: adminDb,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  const exists = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [newDb],
  );
  if (exists.rowCount > 0) {
    console.log(`Database "${newDb}" already exists.`);
  } else {
    await client.query(`CREATE DATABASE "${newDb}"`);
    console.log(`Database "${newDb}" created.`);
  }
} finally {
  await client.end();
}
