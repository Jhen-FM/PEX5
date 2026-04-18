import Database from 'better-sqlite3';

const db = new Database('garage.db');

// Criação das tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER,
    qty INTEGER DEFAULT 0,
    FOREIGN KEY(item_id) REFERENCES items(id)
  );

  CREATE TABLE IF NOT EXISTS movements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER,
    qty INTEGER,
    type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(item_id) REFERENCES items(id)
  );
`);

// Inserir dados iniciais apenas se estiver vazio
const itemsCount = db.prepare('SELECT COUNT(*) as count FROM items').get().count;
if (itemsCount === 0) {
  // Itens iniciais
  db.prepare('INSERT INTO items (name) VALUES (?)').run('Parafuso');
  db.prepare('INSERT INTO items (name) VALUES (?)').run('Porca');
  db.prepare('INSERT INTO items (name) VALUES (?)').run('Chave de Fenda');

  // Estoque inicial
  db.prepare('INSERT INTO stock (item_id, qty) VALUES (?, ?)').run(1, 100);
  db.prepare('INSERT INTO stock (item_id, qty) VALUES (?, ?)').run(2, 200);
  db.prepare('INSERT INTO stock (item_id, qty) VALUES (?, ?)').run(3, 50);

  // Movimentações de exemplo
  db.prepare('INSERT INTO movements (item_id, qty, type) VALUES (?, ?, ?)').run(1, 10, 'saída');
  db.prepare('INSERT INTO movements (item_id, qty, type) VALUES (?, ?, ?)').run(2, 20, 'entrada');
  db.prepare('INSERT INTO movements (item_id, qty, type) VALUES (?, ?, ?)').run(3, 5, 'saída');
}

export default db;

