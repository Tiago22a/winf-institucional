-- SynthWAVE.fm newsletter — D1 SQLite. No automatic access to any other WINF database.
CREATE TABLE IF NOT EXISTS synthwave_newsletter (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone_e164 TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  consent_at TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'synthwave-fm',
  status TEXT NOT NULL DEFAULT 'opted_in' CHECK(status IN ('opted_in','opted_out')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sw_newsletter_status ON synthwave_newsletter(status);
-- Purge/export processes must be performed by authorized backend administrators only.
