import { useEffect } from "react"
import { SERVICES } from "../services/ServicesPage"
import { catalog } from "@/data/catalog"
import { posts } from "@/data/blog"
import { contactInfo } from "@/data/about"
import { LEGAL } from "@/data/legal"

/* Plain, fast, text-only version of the site. No animation, images or scripts beyond this page. */
export default function LitePage() {
  return (
    <div className="lite">
      <header>
        <a href="/" className="lite-brand">Sybertron Technologies</a>
        <a href="/">Full site</a>
      </header>
      <main id="main">
        <h1>Sybertron Technologies</h1>
        <p>Websites, apps, AI and marketing for growing businesses. This is the lightweight text version of our site.</p>
        <p><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a> · <a href={contactInfo.whatsapp}>WhatsApp</a> · <a href="/start">Start a project</a> · <a href="/urgent">RAPID RESPONSE</a></p>

        <h2>Services</h2>
        <ul>{SERVICES.map((s) => <li key={s.id}><a href={`/services/${s.id}`}>{s.title}</a>: {s.desc}</li>)}</ul>

        <h2>Products</h2>
        <ul>{catalog.map((p) => <li key={p.id}><a href={`/products/${p.id}`}>{p.name}</a>: {p.blurb}</li>)}</ul>

        <h2>Articles</h2>
        <ul>{posts.map((p) => <li key={p.slug}><a href={`/blog/${p.slug}`}>{p.title}</a></li>)}</ul>

        <h2>Company</h2>
        <ul>
          <li><a href="/about">About</a></li><li><a href="/work">Work</a></li><li><a href="/careers">Careers</a></li>
          {LEGAL.map((l) => <li key={l.id}><a href={`/${l.id}`}>{l.title}</a></li>)}
        </ul>
      </main>
    </div>
  )
}
