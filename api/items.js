import db from './db.js';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const items = db.prepare('SELECT * FROM items').all();
    res.status(200).json(items);
  } else if (req.method === 'POST') {
    const { name } = req.body;
    db.prepare('INSERT INTO items (name) VALUES (?)').run(name);
    res.status(201).json({ message: 'Item cadastrado com sucesso!' });
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
