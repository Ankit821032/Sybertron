import { createDatabase, passwordHash } from './site-content'
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase(), password = process.env.ADMIN_PASSWORD
if (!email || !password || password.length < 12) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in your environment or .env file.')
const db = createDatabase(process.env.DATABASE_PATH || 'data/cms.sqlite')
db.prepare('INSERT INTO cms_admins(email,password) VALUES(?,?) ON CONFLICT(email) DO UPDATE SET password=excluded.password').run(email,passwordHash(password))
db.prepare('DELETE FROM cms_sessions WHERE email=?').run(email)
db.close()
console.log('Administrator created/updated. Previous sessions revoked.')
