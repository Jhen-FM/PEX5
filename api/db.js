import initSqlJs from 'sql.js';

// Inicializa banco em memória
let dbPromise = initSqlJs().then(SQL => {
  const db = new SQL.Database();

  // Criação das tabelas
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER,
      qty INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER,
      qty INTEGER,
      type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Inserir dados iniciais
  db.run("INSERT INTO items (name) VALUES ('Parafuso')");
  db.run("INSERT INTO items (name) VALUES ('Porca')");
  db.run("INSERT INTO items (name) VALUES ('Chave de Fenda')");

  db.run("INSERT INTO stock (item_id, qty) VALUES (1, 100)");
  db.run("INSERT INTO stock (item_id, qty) VALUES (2, 200)");
  db.run("INSERT INTO stock (item_id, qty) VALUES (3, 50)");

  db.run("INSERT INTO movements (item_id, qty, type) VALUES (1, 10, 'saída')");
  db.run("INSERT INTO movements (item_id, qty, type) VALUES (2, 20, 'entrada')");
  db.run("INSERT INTO movements (item_id, qty, type) VALUES (3, 5, 'saída')");

  return db;
});

export default dbPromise;

