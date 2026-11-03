import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { randomBytes } from 'node:crypto'
import { pathToFileURL } from 'node:url'
import {
  createDatabase,
  digest,
  verifyPassword,
  registerFields,
  snapshot,
  saveField,
  safeUrl,
} from './site-content'

const root = process.cwd()
const port = Number(process.env.PORT || 4000)

// SITE_URL is the canonical origin of this CMS deployment.
function parseOrigin(value: string, label: string): string {
  let url: URL

  try {
    url = new URL(value)
  } catch {
    throw new Error(`${label} must be a valid absolute URL`)
  }

  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.pathname !== '/' ||
    url.search !== '' ||
    url.hash !== '' ||
    url.username !== '' ||
    url.password !== ''
  ) {
    throw new Error(`${label} must be an absolute origin without a path`)
  }

  return url.origin
}

const origin = parseOrigin(
  process.env.SITE_URL || `http://localhost:${port}`,
  'SITE_URL',
)

// Add only browser origins that are explicitly trusted. In the hosted Airo
// deployment, set ALLOWED_ORIGINS to the exact preview/custom domain.
const allowedOrigins = new Set<string>([
  origin,
  ...(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => parseOrigin(value, 'ALLOWED_ORIGINS entry')),
])

function isAllowedRequestOrigin(req: express.Request): boolean {
  const requestOrigin = req.get('Origin')

  // Requests without an Origin header are allowed through this check.
  // Admin write requests are still protected by the session + CSRF token.
  if (!requestOrigin) return true

  try {
    const parsed = new URL(requestOrigin)
    return (
      parsed.origin === requestOrigin &&
      ['http:', 'https:'].includes(parsed.protocol) &&
      allowedOrigins.has(parsed.origin)
    )
  } catch {
    return false
  }
}

export const db = createDatabase(
  process.env.DATABASE_PATH || 'data/cms.sqlite',
)

const uploadDir = path.resolve(process.env.UPLOAD_DIR || 'data/uploads')
fs.mkdirSync(uploadDir, { recursive: true })

const bundle = path.join(root, 'dist-server/entry-server.js')
if (!fs.existsSync(bundle)) throw new Error('Run npm run build first')

const renderer = await import(pathToFileURL(bundle).href)

export const app = express()
app.disable('x-powered-by')

app.use((_req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'SAMEORIGIN',
  })
  next()
})

app.use(express.json({ limit: '8mb' }))

const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const escape = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (character) => htmlEntities[character])

registerFields(
  db,
  '*',
  JSON.parse(
    fs.readFileSync(
      path.join(root, 'server/generated/content-library.json'),
      'utf8',
    ),
  ),
)

function plain(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

for (const route of renderer.routes) {
  registerFields(db, route, [])

  const initial = snapshot(db, route)
  const rendered = renderer.render(route, initial)

  registerFields(db, route, rendered.fields)

  if (!Object.keys(initial.seo).length) {
    const heading = plain(
      rendered.html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ||
        route.slice(1) ||
        'Digital products, AI & web engineering',
    )

    const paragraphs = [...rendered.html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((match) => plain(match[1]))

    const description = (
      paragraphs.find((paragraph) => paragraph.length > 70) ||
      'Sybertron builds websites, apps, AI workflows and digital products.'
    ).slice(0, 170)

    const imagePath = rendered.html.match(
      /<img\b[^>]*src="(\/images\/[^\"]+)"/i,
    )?.[1] || '/logo-horizontal-black.png'

    db.prepare('UPDATE cms_pages SET seo=? WHERE path=?').run(
      JSON.stringify({
        title: heading + ' | Sybertron',
        description,
        keywords: '',
        canonical: '',
        ogImage: imagePath,
        noindex: false,
      }),
      route,
    )
  }
}

function session(req: express.Request) {
  const token = req.headers.cookie
    ?.split(';')
    .map((value) => value.trim())
    .find((value) => value.startsWith('syb_session='))
    ?.slice('syb_session='.length)

  if (!token) return undefined

  return db
    .prepare('SELECT * FROM cms_sessions WHERE token=? AND expires>?')
    .get(digest(token), Date.now()) as any
}

// Protect all admin API routes except the login endpoint.
app.use('/api/admin', (req: any, res, next) => {
  res.set('Cache-Control', 'no-store')

  if (req.path === '/login') return next()

  const current = session(req)
  if (!current) {
    return res.status(401).json({ error: 'Please sign in' })
  }

  req.admin = current

  if (
    !['GET', 'HEAD'].includes(req.method) &&
    (
      req.headers['x-csrf-token'] !== current.csrf ||
      !isAllowedRequestOrigin(req)
    )
  ) {
    return res.status(403).json({
      error: 'Invalid CSRF token or origin',
    })
  }

  next()
})

const attempts = new Map<string, { count: number; until: number }>()

app.post('/api/admin/login', (req, res) => {
  if (!isAllowedRequestOrigin(req)) {
    return res.status(403).json({ error: 'Invalid request origin' })
  }

  const key = req.socket.remoteAddress || 'local'
  let limit = attempts.get(key)

  if (!limit || limit.until < Date.now()) {
    limit = { count: 0, until: Date.now() + 900000 }
    attempts.set(key, limit)
  }

  if (++limit.count > 10) {
    return res.status(429).json({
      error: 'Too many attempts. Try in 15 minutes.',
    })
  }

  const email = String(req.body.email || '').toLowerCase().trim()
  const password = String(req.body.password || '')

  if (password.length > 1024) {
    return res.status(400).json({ error: 'Invalid credentials' })
  }

  const admin: any = db
    .prepare('SELECT * FROM cms_admins WHERE email=?')
    .get(email)

  if (!admin || !verifyPassword(password, admin.password)) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  attempts.delete(key)

  const token = randomBytes(32).toString('hex')
  const csrf = randomBytes(32).toString('hex')
  const expires = Date.now() + 28800000

  db.prepare('DELETE FROM cms_sessions WHERE expires<?').run(Date.now())
  db.prepare('INSERT INTO cms_sessions VALUES(?,?,?,?)').run(
    digest(token),
    email,
    csrf,
    expires,
  )

  const secureCookie = origin.startsWith('https:') ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `syb_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${secureCookie}`,
  )

  return res.json({ email, csrf })
})

app.get('/api/admin/me', (req: any, res) => {
  return res.json({ email: req.admin.email, csrf: req.admin.csrf })
})

app.post('/api/admin/logout', (req: any, res) => {
  db.prepare('DELETE FROM cms_sessions WHERE token=?').run(req.admin.token)
  res.setHeader(
    'Set-Cookie',
    'syb_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0',
  )
  return res.json({ ok: true })
})

app.get('/api/admin/pages', (_req, res) => {
  return res.json({
    pages: db.prepare('SELECT * FROM cms_pages ORDER BY path').all(),
  })
})

app.get('/api/admin/content', (req, res) => {
  return res.json(snapshot(db, String(req.query.page || '/')))
})

app.post('/api/admin/discover', (req, res) => {
  const page = String(req.body.page)
  if (!renderer.routes.includes(page)) {
    return res.status(404).json({ error: 'Unknown page' })
  }

  const fields = Array.isArray(req.body.fields) ? req.body.fields : []

  if (
    fields.length > 8000 ||
    fields.some(
      (field: any) =>
        !field ||
        ['id', 'source', 'kind', 'original'].some(
          (key) => typeof field[key] !== 'string' || field[key].length > 30000,
        ),
    )
  ) {
    return res.status(400).json({ error: 'Invalid fields' })
  }

  registerFields(db, page, fields)
  return res.json({ ok: true })
})

app.put('/api/admin/field', (req: any, res) => {
  return res.json(
    saveField(db, String(req.body.page), String(req.body.id), req.body, req.admin.email),
  )
})

app.get('/api/admin/history', (req, res) => {
  return res.json({
    history: db
      .prepare(
        'SELECT * FROM cms_history WHERE page=? AND field_id=? ORDER BY id DESC LIMIT 30',
      )
      .all(String(req.query.page), String(req.query.id)),
  })
})

app.put('/api/admin/seo', (req, res) => {
  const page = String(req.body.page)
  const seo = req.body.seo || {}
  const clean: any = {}

  if (!renderer.routes.includes(page)) {
    return res.status(404).json({ error: 'Unknown page' })
  }

  for (const key of ['title', 'description', 'keywords', 'canonical', 'ogImage']) {
    if (typeof seo[key] !== 'string' || seo[key].length > 4000) {
      return res.status(400).json({ error: 'Invalid SEO fields' })
    }
    clean[key] = seo[key]
  }

  for (const key of ['canonical', 'ogImage']) {
    if (clean[key] && !safeUrl(clean[key])) {
      return res.status(400).json({ error: 'Invalid URL' })
    }
  }

  clean.noindex = seo.noindex === true

  db.prepare(
    'UPDATE cms_pages SET seo=?,updated_at=CURRENT_TIMESTAMP WHERE path=?',
  ).run(JSON.stringify(clean), page)

  return res.json({ ok: true })
})

app.get('/api/admin/media', (_req, res) => {
  const bundled = JSON.parse(
    fs.readFileSync(path.join(root, 'src/data/photoCredits.json'), 'utf8'),
  ).map((photo: any) => ({
    id: 'stock:' + photo.key,
    filename: photo.key + '.webp',
    url: photo.file,
    type: 'image/webp',
    source: photo.source,
    size: fs.statSync(path.join(root, 'public', photo.file)).size,
  }))

  return res.json({
    media: [
      ...db.prepare('SELECT * FROM cms_media ORDER BY created_at DESC').all(),
      ...bundled,
    ],
  })
})

app.post('/api/admin/media', (req, res) => {
  const type = String(req.body.type)
  const types: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
  }

  if (!types[type] || typeof req.body.base64 !== 'string') {
    return res.status(400).json({
      error: 'Upload PNG, JPEG, WebP or GIF',
    })
  }

  const bytes = Buffer.from(req.body.base64, 'base64')
  const valid =
    type === 'image/png'
      ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : type === 'image/jpeg'
        ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        : type === 'image/gif'
          ? /^GIF8[79]a$/.test(bytes.subarray(0, 6).toString())
          : bytes.subarray(0, 4).toString() === 'RIFF' &&
            bytes.subarray(8, 12).toString() === 'WEBP'

  if (!valid || bytes.length > 5242880) {
    return res.status(400).json({
      error: 'Invalid image or larger than 5 MB',
    })
  }

  const id = randomBytes(16).toString('hex')
  const filename = id + '.' + types[type]

  fs.writeFileSync(path.join(uploadDir, filename), bytes)
  db.prepare('INSERT INTO cms_media(id,filename,type,size) VALUES(?,?,?,?)').run(
    id,
    filename,
    type,
    bytes.length,
  )

  return res.json({ url: '/uploads/' + filename })
})

app.get('/api/admin/export', (_req, res) => {
  res.setHeader(
    'Content-Disposition',
    'attachment; filename="sybertron-content-backup.json"',
  )

  return res.json({
    version: 1,
    pages: db.prepare('SELECT * FROM cms_pages').all(),
    fields: db.prepare('SELECT * FROM cms_fields').all(),
    media: db.prepare('SELECT * FROM cms_media').all(),
  })
})

app.use(
  '/uploads',
  express.static(uploadDir, {
    immutable: true,
    maxAge: '1y',
    dotfiles: 'deny',
  }),
)

app.get('/api/health', (_req, res) => {
  return res.json({ ok: true, service: 'sybertron-cms' })
})

app.use('/api', (_req, res) => {
  return res.status(404).json({ error: 'Endpoint not found' })
})

app.get('/admin', (_req, res) => {
  res.set({
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex, nofollow',
  })
  return res.sendFile(path.join(root, 'server/admin/index.html'))
})

app.get('/robots.txt', (_req, res) => {
  return res.type('text').send(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`,
  )
})

app.get('/sitemap.xml', (_req, res) => {
  const urls = renderer.routes
    .filter((page: string) => !snapshot(db, page).seo.noindex)
    .map(
      (page: string) =>
        `<url><loc>${escape(origin + page)}</loc><lastmod>${new Date(
          snapshot(db, page).updatedAt + 'Z',
        ).toISOString()}</lastmod></url>`,
    )
    .join('')

  return res
    .type('xml')
    .send(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    )
})

app.use(express.static(path.join(root, 'dist'), { index: false }))

app.get('/{*path}', (req, res) => {
  const route = req.path.replace(/\/+$/, '') || '/'
  const known = renderer.routes.includes(route)
  const state = snapshot(db, route)

  state.fields = Object.fromEntries(
    Object.entries(state.fields).filter(([, field]: any) => field.value !== null),
  )

  const result = renderer.render(route, state)
  const seo = state.seo

  const title =
    seo.title ||
    ((route === '/'
      ? 'Digital products, AI & web engineering'
      : route.split('/').at(-1)?.replaceAll('-', ' ')) + ' | Sybertron')

  const description =
    seo.description ||
    'Sybertron builds websites, apps, AI workflows and digital products.'

  const canonical = seo.canonical
    ? new URL(seo.canonical, origin).href
    : origin + route

  const image = new URL(
    seo.ogImage || '/logo-horizontal-black.png',
    origin,
  ).href

  const metadata =
    `<title>${escape(title)}</title>` +
    `<meta name="description" content="${escape(description)}">` +
    `<meta name="keywords" content="${escape(seo.keywords || '')}">` +
    `<meta name="robots" content="${seo.noindex || !known ? 'noindex, follow' : 'index, follow'}">` +
    `<link rel="canonical" href="${escape(canonical)}">` +
    `<meta property="og:title" content="${escape(title)}">` +
    `<meta property="og:description" content="${escape(description)}">` +
    `<meta property="og:url" content="${escape(canonical)}">` +
    '<meta property="og:type" content="website">' +
    `<meta property="og:image" content="${escape(image)}">` +
    '<meta name="twitter:card" content="summary_large_image">' +
    `<meta name="twitter:title" content="${escape(title)}">` +
    `<meta name="twitter:description" content="${escape(description)}">` +
    `<meta name="twitter:image" content="${escape(image)}">`

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: canonical,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Sybertron',
      url: origin,
    },
  }).replaceAll('<', '\\u003c')

  const json = JSON.stringify(state).replaceAll('<', '\\u003c')

  let shell = fs
    .readFileSync(path.join(root, 'dist/index.html'), 'utf8')
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(
      /<meta\b[^>]*(?:name=["'](?:description|keywords|robots|twitter:[^"']+)["']|property=["']og:[^"']+["'])[^>]*>/gi,
      '',
    )

  shell = shell
    .replace(
      '</head>',
      metadata +
        '<script type="application/ld+json">' +
        schema +
        '</script></head>',
    )
    .replace(
      '<div id="root"></div>',
      `<div id="root">${result.html}</div><script>window.__CMS__=${json}</script>`,
    )

  return res
    .status(known ? 200 : 404)
    .set('Cache-Control', 'no-cache')
    .type('html')
    .send(shell)
})

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.message)
  return res
    .status(err.status || 500)
    .json({ error: err.status ? err.message : 'Unexpected server error' })
})

if (process.env.CMS_TEST !== '1') {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Sybertron: ${origin} | Admin: ${origin}/admin`)
    console.log(`Allowed admin origins: ${[...allowedOrigins].join(', ')}`)
  })
}
