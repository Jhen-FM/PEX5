import dbPromise from './db.js';

export default async function handler(req, res) {
  try {
    const db = await dbPromise;

    // Consumo mensal (últimos 6 meses)
    const consumoStmt = db.prepare(`
      SELECT strftime('%m/%Y', created_at) as mes, SUM(qty) as total
      FROM movements
      WHERE type = 'saída'
      GROUP BY mes
      ORDER BY mes DESC
      LIMIT 6
    `);

    const consumoMensal = [];
    while (consumoStmt.step()) {
      consumoMensal.push(consumoStmt.getAsObject());
    }
    consumoStmt.free();

    // Itens mais usados (top 5)
    const topStmt = db.prepare(`
      SELECT items.name, SUM(movements.qty) as total
      FROM movements
      JOIN items ON movements.item_id = items.id
      WHERE type = 'saída'
      GROUP BY items.name
      ORDER BY total DESC
      LIMIT 5
    `);

    const topItems = [];
    while (topStmt.step()) {
      topItems.push(topStmt.getAsObject());
    }
    topStmt.free();

    // Se não houver dados, retorna valores iniciais simulados
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
