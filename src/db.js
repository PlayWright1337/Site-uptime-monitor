const { DatabaseSync } = require("node:sqlite");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(path.join(dataDir, "monitor.db"));

db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");
db.exec("PRAGMA synchronous = NORMAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS sites (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    name                 TEXT    NOT NULL,
    url                  TEXT    NOT NULL UNIQUE,
    status               TEXT    NOT NULL DEFAULT 'unknown',
    response_time        INTEGER,
    last_check           TEXT,
    consecutive_failures INTEGER NOT NULL DEFAULT 0,
    downtime_start       TEXT,
    created_at           TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

const _insertSetting = db.prepare(
  "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)",
);
_insertSetting.run("check_interval", "5");
_insertSetting.run("timeout", "10");
_insertSetting.run("alert_threshold", "1");
_insertSetting.run("language", "ru");

module.exports = {
  getAllSites: () => db.prepare("SELECT * FROM sites ORDER BY name ASC").all(),

  getSiteById: (id) => db.prepare("SELECT * FROM sites WHERE id = ?").get(id),

  getSiteByUrl: (url) =>
    db.prepare("SELECT * FROM sites WHERE url = ?").get(url),

  addSite: (name, url) =>
    db.prepare("INSERT INTO sites (name, url) VALUES (?, ?)").run(name, url),

  removeSite: (id) => db.prepare("DELETE FROM sites WHERE id = ?").run(id),

  updateSiteStatus: (id, status, responseTime) => {
    const site = db.prepare("SELECT * FROM sites WHERE id = ?").get(id);
    if (!site) return null;

    const previousStatus = site.status;
    const oldDowntimeStart = site.downtime_start;

    let consecutiveFailures = site.consecutive_failures;
    let downtimeStart = site.downtime_start;

    if (status === "down") {
      consecutiveFailures += 1;
      if (!downtimeStart) downtimeStart = new Date().toISOString();
    } else {
      consecutiveFailures = 0;
      downtimeStart = null;
    }

    const lastCheck = new Date().toLocaleString("ru-RU", {
      timeZone: "Europe/Moscow",
    });

    db.prepare(
      `
      UPDATE sites SET
        status               = ?,
        response_time        = ?,
        last_check           = ?,
        consecutive_failures = ?,
        downtime_start       = ?
      WHERE id = ?
    `,
    ).run(
      status,
      responseTime ?? null,
      lastCheck,
      consecutiveFailures,
      downtimeStart,
      id,
    );

    return { previousStatus, oldDowntimeStart, consecutiveFailures };
  },

  getSetting: (key) => {
    const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key);
    return row ? row.value : null;
  },

  setSetting: (key, value) =>
    db
      .prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)")
      .run(key, String(value)),

  getAllSettings: () => {
    const rows = db.prepare("SELECT * FROM settings").all();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  },
};
