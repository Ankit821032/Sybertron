import { useRouter as useCmsRoute } from '../../router'
import { CSSProperties, useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, Clock, Link2 } from "lucide-react"
import { SplitWords } from "../../motion"
import { fmtDate, getPost, posts } from "@/data/blog"
import { SERVICES } from "../services/ServicesPage"
import { postSlugOf, serviceHref } from "../../router"
import { Button3D } from "../ui"
import { goToContact } from "../Hero"
import GlobalPresence from "../GlobalPresence"
import { Talk } from "../about/AboutPage"
import { PostCard, PostCover } from "./BlogPage"

export default function BlogPostPage() {
  const post = getPost(postSlugOf(useCmsRoute().path) ?? "")
  const [intro] = useState(() => (performance.now() < 2500 ? ".95s" : ".1s"))
  const [copied, setCopied] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
  }, [post])

  useEffect(() => {
    const hs = Array.from(document.querySelectorAll<HTMLElement>(".bp-article h2"))
    const on = () => {
      let a = 0
      hs.forEach((h, i) => { if (h.getBoundingClientRect().top < window.innerHeight * 0.35) a = i })
      setActive(a)
    }
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [post])

  if (!post) return null
  const svc = SERVICES.find((s) => s.id === post.service)
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3)
  const copy = async () => {
    try { await navigator.clipboard.writeText(location.href); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* clipboard blocked */ }
  }
  return (
    <article className="bp" style={{ "--tone": post.tone } as CSSProperties}>
      <section className="about-hero bp-hero" style={{ "--intro": intro } as CSSProperties}>
        <div className="hero-blob hero-blob--one" data-parallax="0.14" style={{ background: post.tone }} />
        <div className="about-hero-inner">
          <a className="bp-back" href="/blog"><ArrowLeft size={14} aria-hidden /> All articles</a>
          <p className="eyebrow"><span /> {post.cat}</p>
          <h1 aria-label={post.title}><span aria-hidden="true"><SplitWords text={post.title} /></span></h1>
          <p className="about-lede bp-meta">{fmtDate(post.date)} · <Clock size={13} aria-hidden /> {post.read} min read</p>
        </div>
      </section>

      <div className="bp-cover" data-reveal="scale"><PostCover post={post} /></div>

      <div className="bp-grid">
        <aside className="bp-toc" aria-label="In this article">
          <p>In this article</p>
          <ol>
            {post.body.map((b, i) => (
              <li key={b.h} className={i === active ? "is-on" : undefined}><a href={`#s${i}`}>{b.h}</a></li>
            ))}
          </ol>
          <button type="button" onClick={copy}><Link2 size={14} aria-hidden /> {copied ? "Link copied" : "Copy link"}</button>
        </aside>

        <div className="bp-article">
          <p className="bp-excerpt" data-reveal>{post.excerpt}</p>
          {post.body.map((b, i) => (
            <section key={b.h} data-reveal>
              <h2 id={`s${i}`}>{b.h}</h2>
              {b.p.map((t) => <p key={t}>{t}</p>)}
              {b.ul && <ul>{b.ul.map((li) => <li key={li}>{li}</li>)}</ul>}
            </section>
          ))}
          <div className="bp-cta" data-reveal>
            <div>
              <h3>Want help with this?</h3>
              <p>Tell us what you are working on and we will reply within one business day.</p>
            </div>
            <div className="bp-cta-actions">
              <Button3D tone="mint" onClick={() => goToContact(`Question about: ${post.title}`)}>Talk to us <ArrowRight size={16} /></Button3D>
              {svc && <a className="text-link" href={serviceHref(svc.id)}>See our {svc.title} service</a>}
            </div>
          </div>
        </div>
      </div>

      <section className="bl-body bp-more">
        <div className="bl-wrap">
          <p className="bl-kicker" data-reveal>Keep reading</p>
          <div className="bl-grid">{more.map((p, i) => <PostCard key={p.slug} p={p} i={i} />)}</div>
        </div>
      </section>
      <GlobalPresence talk={<Talk />} />
    </article>
  )
}
