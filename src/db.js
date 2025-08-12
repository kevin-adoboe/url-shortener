const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const databaseFilePath = path.join(__dirname, '..', 'data.sqlite');
const database = new sqlite3.Database(databaseFilePath);

database.serialize(() => {
  database.run(
    `CREATE TABLE IF NOT EXISTS urls (
      id TEXT PRIMARY KEY,
      original_url TEXT NOT NULL,
      hits INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
  );
});

module.exports = database;

