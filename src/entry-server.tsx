import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { CmsContext, type Field, type Snapshot } from './cms/runtime'
import { catalog } from './data/catalog'
import { DETAILS } from './data/serviceDetail'
import { posts } from './data/blog'
export const routes = ['/', '/about', '/services', '/products', '/work', '/careers', '/start', '/urgent', '/blog', '/privacy', '/terms', '/cookies', '/lite',
  ...catalog.map(p => '/products/' + p.id), ...DETAILS.map(p => '/services/' + p.id), ...posts.map(p => '/blog/' + p.slug)]
export function render(path: string, snapshot: Snapshot) {
  const fields = new Map<string, Field>()
  const html = renderToString(<CmsContext.Provider value={{ path, snapshot, collect: f => fields.set(f.id, f) }}><App /></CmsContext.Provider>)
  return { html, fields: [...fields.values()] }
}
