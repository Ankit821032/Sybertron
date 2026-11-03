-- Reference schema; created automatically by server/site-content.ts.
PRAGMA foreign_keys=ON;

CREATE TABLE cms_admins(email TEXT PRIMARY KEY, password TEXT NOT NULL);

CREATE TABLE cms_fields(page TEXT NOT NULL REFERENCES cms_pages(path), id TEXT NOT NULL, source TEXT NOT NULL, kind TEXT NOT NULL, original TEXT NOT NULL, value TEXT, format TEXT NOT NULL DEFAULT '{}', revision INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(page,id));

CREATE TABLE cms_history(id INTEGER PRIMARY KEY, page TEXT NOT NULL, field_id TEXT NOT NULL, previous TEXT NOT NULL, actor TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE cms_media(id TEXT PRIMARY KEY, filename TEXT NOT NULL, type TEXT NOT NULL, size INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE cms_pages(path TEXT PRIMARY KEY, seo TEXT NOT NULL DEFAULT '{}', updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE cms_sessions(token TEXT PRIMARY KEY, email TEXT NOT NULL REFERENCES cms_admins(email), csrf TEXT NOT NULL, expires INTEGER NOT NULL);
