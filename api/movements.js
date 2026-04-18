import db from './db.js';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { item_id, qty, type } = req.body;

    db.prepare('INSERT INTO movements (item_id, qty, type) VALUES (?, ?, ?)')
      .run(item_id, qty, type);

    if (type === 'entrada') {
      db.prepare('UPDATE stock SET qty = qty + ? WHERE item_id = ?').run(qty, item_id);
    } else if (type === 'saída') {
      db.prepare('UPDATE stock SET qty = qty - ? WHERE item_id = ?').run(qty, item_id);
    }

    res.status(201).json({ message: 'Movimentação registrada!' });
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
