'use strict';
// Uses Node's built-in sqlite module (node:sqlite) instead of better-sqlite3.
// This avoids native compilation entirely (no Python/node-gyp needed at deploy time),
// which is required on build servers like pxxl.run that don't have prebuilt binaries
// for every platform/libc combo. Requires Node 22.5+ (pxxl's runtime is Node 26).
const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, 'spiderhub.db'));
db.exec('PRAGMA journal_mode = WAL;');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    verified        INTEGER NOT NULL DEFAULT 0,
    verify_token    TEXT,
    verify_expires  INTEGER,
    reset_token     TEXT,
    reset_expires   INTEGER,
    created_at      INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_verify_token ON users(verify_token);
  CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
`);

module.exports = db;
