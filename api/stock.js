import dbPromise from './db.js';

export default async function handler(req, res) {
  const db = await dbPromise;
  const stmt = db.prepare(`
    SELECT items.name, stock.qty
    FROM stock
    JOIN items ON stock.item_id = items.id
  `);
  const result = [];
  while (stmt.step()) {
    result.push(stmt.getAsObject());
  }
  res.status(200).json(result);
}
