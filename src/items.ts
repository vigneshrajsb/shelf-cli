import { db } from "./db";

export interface Item {
  id: number;
  url: string;
  title: string | null;
  type: "video" | "article" | "bookmark";
  tags: string | null;
  notes: string | null;
  status: "unread" | "read";
  added_at: string;
  read_at: string | null;
}

// Video platform patterns
const VIDEO_PATTERNS = [
  /youtube\.com/i,
  /youtu\.be/i,
  /vimeo\.com/i,
  /tiktok\.com/i,
  /instagram\.com\/reel/i,
  /instagram\.com\/p\//i,
  /netflix\.com/i,
  /twitch\.tv/i,
  /dailymotion\.com/i,
  /wistia\.com/i,
  /loom\.com/i,
];

export function detectType(url: string, isBookmark: boolean): Item["type"] {
  if (isBookmark) return "bookmark";
  
  for (const pattern of VIDEO_PATTERNS) {
    if (pattern.test(url)) return "video";
  }
  
  return "article";
}

export async function fetchTitle(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; shelf-cli/1.0)",
      },
      redirect: "follow",
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    
    // Try to extract title from HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      return titleMatch[1].trim().slice(0, 500); // Limit length
    }
    
    // Try og:title
    const ogMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
    if (ogMatch) {
      return ogMatch[1].trim().slice(0, 500);
    }
    
    return null;
  } catch {
    return null;
  }
}

export async function addItem(
  url: string,
  options: {
    title?: string;
    tags?: string;
    notes?: string;
    isBookmark?: boolean;
  } = {}
): Promise<Item> {
  const type = detectType(url, options.isBookmark || false);
  
  // Auto-fetch title if not provided
  let title = options.title;
  if (!title) {
    title = await fetchTitle(url);
  }
  
  const stmt = db.prepare(`
    INSERT INTO items (url, title, type, tags, notes)
    VALUES (?, ?, ?, ?, ?)
    RETURNING *
  `);
  
  return stmt.get(url, title, type, options.tags || null, options.notes || null) as Item;
}

export function getItem(idOrUrl: string | number): Item | null {
  const stmt = db.prepare("SELECT * FROM items WHERE id = ? OR url = ?");
  return stmt.get(idOrUrl, idOrUrl) as Item | null;
}

export function listItems(options: {
  type?: Item["type"];
  status?: Item["status"];
  tag?: string;
  limit?: number;
} = {}): Item[] {
  let query = "SELECT * FROM items WHERE 1=1";
  const params: any[] = [];
  
  if (options.type) {
    query += " AND type = ?";
    params.push(options.type);
  }
  
  if (options.status) {
    query += " AND status = ?";
    params.push(options.status);
  }
  
  if (options.tag) {
    query += " AND tags LIKE ?";
    params.push(`%${options.tag}%`);
  }
  
  query += " ORDER BY added_at DESC";
  
  if (options.limit) {
    query += " LIMIT ?";
    params.push(options.limit);
  }
  
  return db.query(query).all(...params) as Item[];
}

export function markDone(idOrUrl: string | number): boolean {
  const item = getItem(idOrUrl);
  if (!item) return false;
  
  const now = new Date().toISOString();
  db.prepare("UPDATE items SET status = 'read', read_at = ? WHERE id = ?").run(now, item.id);
  return true;
}

export function markUnread(idOrUrl: string | number): boolean {
  const item = getItem(idOrUrl);
  if (!item) return false;
  
  db.prepare("UPDATE items SET status = 'unread', read_at = NULL WHERE id = ?").run(item.id);
  return true;
}

export function updateItem(
  idOrUrl: string | number,
  updates: { tags?: string; notes?: string; title?: string; type?: Item["type"] }
): boolean {
  const item = getItem(idOrUrl);
  if (!item) return false;
  
  if (updates.tags !== undefined) {
    db.prepare("UPDATE items SET tags = ? WHERE id = ?").run(updates.tags, item.id);
  }
  if (updates.notes !== undefined) {
    db.prepare("UPDATE items SET notes = ? WHERE id = ?").run(updates.notes, item.id);
  }
  if (updates.title !== undefined) {
    db.prepare("UPDATE items SET title = ? WHERE id = ?").run(updates.title, item.id);
  }
  if (updates.type !== undefined) {
    db.prepare("UPDATE items SET type = ? WHERE id = ?").run(updates.type, item.id);
  }
  
  return true;
}

export function deleteItem(idOrUrl: string | number): boolean {
  const item = getItem(idOrUrl);
  if (!item) return false;
  
  db.prepare("DELETE FROM items WHERE id = ?").run(item.id);
  return true;
}

export function searchItems(query: string, limit: number = 20): Item[] {
  const pattern = `%${query}%`;
  return db.query(`
    SELECT * FROM items 
    WHERE title LIKE ? OR url LIKE ? OR tags LIKE ? OR notes LIKE ?
    ORDER BY added_at DESC
    LIMIT ?
  `).all(pattern, pattern, pattern, pattern, limit) as Item[];
}

export function getHistory(options: { days?: number; weeks?: number; month?: string } = {}): Item[] {
  let startDate: string;
  
  if (options.month) {
    // Parse mmyy format
    const month = parseInt(options.month.slice(0, 2), 10);
    const year = 2000 + parseInt(options.month.slice(2, 4), 10);
    startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];
    
    return db.query(`
      SELECT * FROM items 
      WHERE status = 'read' AND read_at >= ? AND read_at <= ?
      ORDER BY read_at DESC
    `).all(startDate, endDate + "T23:59:59") as Item[];
  }
  
  const now = new Date();
  if (options.weeks) {
    now.setDate(now.getDate() - options.weeks * 7);
  } else {
    now.setDate(now.getDate() - (options.days || 7));
  }
  startDate = now.toISOString();
  
  return db.query(`
    SELECT * FROM items 
    WHERE status = 'read' AND read_at >= ?
    ORDER BY read_at DESC
  `).all(startDate) as Item[];
}

export function getTags(): { tag: string; count: number }[] {
  const items = db.query("SELECT tags FROM items WHERE tags IS NOT NULL AND tags != ''").all() as { tags: string }[];
  
  const tagCounts: Record<string, number> = {};
  
  for (const item of items) {
    const tags = item.tags.split(",").map(t => t.trim().toLowerCase());
    for (const tag of tags) {
      if (tag) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }
  }
  
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getRecent(days: number = 30): Item[] {
  const since = new Date();
  since.setDate(since.getDate() - days);
  
  return db.query(`
    SELECT * FROM items 
    WHERE added_at >= ?
    ORDER BY added_at DESC
  `).all(since.toISOString()) as Item[];
}
