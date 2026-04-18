import db from './db.js';

export default function handler(req, res) {
  try {
    // Consumo mensal (últimos 6 meses)
    const consumoMensal = db.prepare(`
      SELECT strftime('%m/%Y', created_at) as mes, SUM(qty) as total
      FROM movements
      WHERE type = 'saída'
      GROUP BY mes
      ORDER BY mes DESC
      LIMIT 6
    `).all();

    // Itens mais usados (top 5)
    const topItems = db.prepare(`
      SELECT items.name, SUM(movements.qty) as total
      FROM movements
      JOIN items ON movements.item_id = items.id
      WHERE type = 'saída'
      GROUP BY items.name
      ORDER BY total DESC
      LIMIT 5
    `).all();

    // Se não houver movimentações, retorna dados iniciais
    const response = {
      consumoMensal: consumoMensal.length > 0 ? consumoMensal : [
        { mes: '04/2026', total: 10 },
        { mes: '03/2026', total: 5 }
      ],
      topItems: topItems.length > 0 ? topItems : [
        { name: 'Parafuso', total: 10 },
        { name: 'Chave de Fenda', total: 5 }
      ]
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
