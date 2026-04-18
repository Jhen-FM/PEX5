import db from './db.js';

export default function handler(req, res) {
  // Consumo mensal (últimos 6 meses)
  const consumoMensal = db.prepare(`
    SELECT strftime('%m/%Y', created_at) as mes, SUM(qty) as total
    FROM movements
    WHERE type = 'saída'
    GROUP BY mes
    ORDER BY mes DESC
    LIMIT 6
  `).all();

  // Itens mais usados
  const topItems = db.prepare(`
    SELECT items.name, SUM(movements.qty) as total
    FROM movements
    JOIN items ON movements.item_id = items.id
    WHERE type = 'saída'
    GROUP BY items.name
    ORDER BY total DESC
    LIMIT 5
  `).all();

  res.status(200).json({ consumoMensal, topItems });
}
