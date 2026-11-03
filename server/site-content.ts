import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import path from 'node:path'
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
export const digest = (v: string) => createHash('sha256').update(v).digest('hex')
export function passwordHash(password: string) { const salt = randomBytes(16).toString('hex'); return salt + ':' + scryptSync(password, salt, 64).toString('hex') }
export function verifyPassword(password: string, stored: string) { const [salt, hash] = stored.split(':'); const actual = scryptSync(password, salt, 64); return !!hash && hash.length === 128 && timingSafeEqual(actual, Buffer.from(hash, 'hex')) }
export function createDatabase(filename: string) {
  if (filename !== ':memory:') fs.mkdirSync(path.dirname(filename), { recursive: true })
  const db = new DatabaseSync(filename)
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS cms_pages(path TEXT PRIMARY KEY, seo TEXT NOT NULL DEFAULT '{}', updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS cms_fields(page TEXT NOT NULL REFERENCES cms_pages(path), id TEXT NOT NULL, source TEXT NOT NULL, kind TEXT NOT NULL, original TEXT NOT NULL, value TEXT, format TEXT NOT NULL DEFAULT '{}', revision INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(page,id));
    CREATE TABLE IF NOT EXISTS cms_history(id INTEGER PRIMARY KEY, page TEXT NOT NULL, field_id TEXT NOT NULL, previous TEXT NOT NULL, actor TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS cms_admins(email TEXT PRIMARY KEY, password TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS cms_sessions(token TEXT PRIMARY KEY, email TEXT NOT NULL REFERENCES cms_admins(email), csrf TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS cms_media(id TEXT PRIMARY KEY, filename TEXT NOT NULL, type TEXT NOT NULL, size INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);`)
  return db
}
export function registerFields(db: DatabaseSync, page: string, fields: any[]) {
  db.exec('BEGIN')
  try {
    db.prepare('INSERT OR IGNORE INTO cms_pages(path) VALUES(?)').run(page)
    const insert = db.prepare('INSERT OR IGNORE INTO cms_fields(page,id,source,kind,original) VALUES(?,?,?,?,?)')
    db.prepare('INSERT OR IGNORE INTO cms_pages(path) VALUES(?)').run('*')
    for (const f of fields) {
      const scope = /components\/(Header|Footer|ChatLauncher|misc\/CookieSettings)\.tsx:/.test(f.source) ? '*' : page
      insert.run(scope, f.id, f.source, f.kind, f.original)
    }
    db.exec('COMMIT')
  } catch(e) { db.exec('ROLLBACK'); throw e }
}
export function snapshot(db: DatabaseSync, page: string) {
  const p: any = db.prepare('SELECT * FROM cms_pages WHERE path=?').get(page)
  const fields: Record<string, any> = {}
  for (const row of db.prepare("SELECT * FROM cms_fields WHERE page=? OR page='*' ORDER BY page").all(page) as any[]) fields[row.id] = {...row, format: JSON.parse(row.format)}
  return {fields, seo: p ? JSON.parse(p.seo) : {}, updatedAt:p?.updated_at}
}
export function safeUrl(v: string, link = false) { return /^\/(?!\/)/.test(v) || /^https?:\/\/[^\s<>"']+$/i.test(v) || (link && /^(#[\w-]*|mailto:[^\s<>"']+|tel:[+\d ()-]+)$/.test(v)) }
export function saveField(db: DatabaseSync, page: string, id: string, body: any, actor: string) {
  const old: any = db.prepare('SELECT * FROM cms_fields WHERE page=? AND id=?').get(page,id)
  if (!old) throw Object.assign(new Error('Unknown content field'), {status:404})
  if (body.revision !== old.revision) throw Object.assign(new Error('This field changed. Reload before saving.'), {status:409})
  const value = body.value === null ? null : String(body.value ?? '')
  if (value !== null && value.length > 30000) throw Object.assign(new Error('Content is too long'), {status:400})
  if (value !== null && old.kind === 'number' && (!value.trim() || !Number.isFinite(Number(value)) || Number(value)<0 || Number(value)>1e9)) throw Object.assign(new Error('Enter a number from 0 to 1,000,000,000'),{status:400})
  if (value && ['href','src','poster','backgroundImage','illustration'].includes(old.kind) && !safeUrl(value,old.kind==='href')) throw Object.assign(new Error('Use an https URL or site-relative path'),{status:400})
  const f = body.format ?? {}, format: Record<string,any> = {}
  for (const key of ['bold','italic','underline','strike']) format[key] = f[key] === true
  for (const key of ['color','highlight']) if (f[key] && /^#[a-f0-9]{6}$/i.test(f[key])) format[key] = f[key]
  db.exec('BEGIN')
  try {
    db.prepare('INSERT INTO cms_history(page,field_id,previous,actor) VALUES(?,?,?,?)').run(page,id,JSON.stringify(old),actor)
    db.prepare('UPDATE cms_fields SET value=?,format=?,revision=revision+1 WHERE page=? AND id=?').run(value,JSON.stringify(format),page,id)
    db.prepare('UPDATE cms_pages SET updated_at=CURRENT_TIMESTAMP WHERE path=?').run(page)
    db.exec('COMMIT')
  } catch(e) {db.exec('ROLLBACK');throw e}
  return snapshot(db,page).fields[id]
}
