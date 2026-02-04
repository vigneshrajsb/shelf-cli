import { Database } from "bun:sqlite";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

// Support test database via environment variable
const isTest = process.env.RIL_TEST === "1";

// Safety: detect if running under bun test without RIL_TEST set
const isBunTest = process.argv.some(arg => arg.includes("bun") && arg.includes("test"));
if (isBunTest && !isTest) {
  console.error("⚠️  Warning: Running under bun test without RIL_TEST=1. Using in-memory DB for safety.");
}

// Use in-memory DB if test mode OR if running under bun test (safety fallback)
const useTestDb = isTest || isBunTest;
const DATA_DIR = useTestDb ? "/tmp/ril-test" : join(homedir(), ".shelf");
const DB_PATH = useTestDb ? ":memory:" : join(DATA_DIR, "shelf.db");

// Ensure data directory exists (skip for in-memory)
if (DB_PATH !== ":memory:" && !existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

export const db = new Database(DB_PATH);

// Initialize schema
export function initDb() {
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL UNIQUE,
      title TEXT,
      type TEXT NOT NULL DEFAULT 'article',
      tags TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'unread',
      added_at TEXT DEFAULT CURRENT_TIMESTAMP,
      read_at TEXT
    )
  `);

  // Create indexes for common queries
  db.run(`CREATE INDEX IF NOT EXISTS idx_items_status ON items(status)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_items_type ON items(type)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_items_added ON items(added_at)`);
}

export function getDbPath(): string {
  return DB_PATH;
}
