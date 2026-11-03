import Photo from '../Photo'
import {servicePhoto} from '@/data/photos'
import { CSSProperties, useEffect, useState } from "react"
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react"
import { SplitWords } from "../../motion"
import { BLOG_CATS, fmtDate, posts, type Post } from "@/data/blog"
import { postHref } from "../../router"
import GlobalPresence from "../GlobalPresence"
import { Talk } from "../about/AboutPage"

export function PostCover({post}:{post:Post}) {
  return <div className="bl-cover bl-cover-photo"><Photo kind={servicePhoto[post.service]||'analytics'}/><b>{post.cat}</b></div>
}

export function PostCard({ p, i = 0 }: { p: Post; i?: number }) {
  return (
    <a href={postHref(p.slug)} className="bl-card" style={{ "--i": i } as CSSProperties} data-cursor="Read">
      <PostCover post={p} />
      <div className="bl-card-meta">
        <span className="bl-tag">{p.cat}</span>
        <span><Clock size={12} aria-hidden /> {p.read} min</span>
      </div>
      <h3>{p.title} <ArrowUpRight size={16} aria-hidden /></h3>
      <p>{p.excerpt}</p>
      <small>{fmtDate(p.date)}</small>
    </a>
  )
}

export default function BlogPage() {
  const [intro] = useState(() => (performance.now() < 2500 ? ".95s" : ".1s"))
  const [cat, setCat] = useState<string>("All")
  const [feat, ...rest] = posts
  const list = (cat === "All" ? rest : posts.filter((p) => p.cat === cat))
  return (
    <>
      <section className="about-hero bl-hero" style={{ "--intro": intro } as CSSProperties}>
        <div className="hero-blob hero-blob--one" data-parallax="0.14" />
        <div className="about-hero-inner">
          <p className="eyebrow"><span /> Blog</p>
          <h1 aria-label="Notes from the team">
            <span aria-hidden="true">
              <SplitWords text="Notes from" />
              <SplitWords text="the team" start={2} em />
            </span>
          </h1>
          <p className="about-lede">Practical writing on AI, web, apps, ecommerce and growth, from the people who build them.</p>
        </div>
      </section>

      <section className="bl-body">
        <div className="bl-wrap">
          <a href={postHref(feat.slug)} className="bl-feature" data-reveal data-cursor="Read" style={{ "--tone": feat.tone } as CSSProperties}>
            <PostCover post={feat} />
            <div>
              <span className="bl-tag">Featured · {feat.cat}</span>
              <h2>{feat.title}</h2>
              <p>{feat.excerpt}</p>
              <span className="bl-more">Read article <ArrowRight size={16} aria-hidden /></span>
            </div>
          </a>

          <div className="bl-filters" role="tablist" aria-label="Filter by topic" data-reveal>
            {["All", ...BLOG_CATS].map((c) => (
              <button key={c} type="button" role="tab" aria-selected={cat === c} className={cat === c ? "is-on" : undefined} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>

          <div className="bl-grid" key={cat}>
            {list.map((p, i) => <PostCard key={p.slug} p={p} i={i} />)}
            {list.length === 0 && <p className="bl-empty">Nothing here yet. Check back soon.</p>}
          </div>
        </div>
      </section>
      <GlobalPresence talk={<Talk />} />
    </>
  )
}
