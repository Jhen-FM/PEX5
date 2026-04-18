import db from './db.js';

export default function handler(req, res) {
  const stock = db.prepare(`
    SELECT items.name, stock.qty
    FROM stock
    JOIN items ON stock.item_id = items.id
  `).all();
  res.status(200).json(stock);
}
