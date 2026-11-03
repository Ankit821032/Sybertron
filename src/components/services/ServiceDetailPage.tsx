import { useRouter as useCmsRoute } from '../../router'
import { CSSProperties, useEffect, useRef, useState } from "react"
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Bot, Check, FileSearch, Gauge, Layers, Lock, MessageCircle,
  Minus, Plug, Plus, ShieldCheck, Sparkles, Workflow, Zap, type LucideIcon,
} from "lucide-react"
import { SplitWords, useInView } from "../../motion"
import { Button3D } from "../ui"
import { goToContact } from "../Hero"
import GlobalPresence from "../GlobalPresence"
import ProductMock from "../ProductMock"
import { BrowserFrame, WorkVisual } from "../WorkMocks"
import { Talk } from "../about/AboutPage"
import { SERVICES } from "./ServicesPage"
import { DETAILS, getService, type Cap, type Vis } from "@/data/serviceDetail"
import { allProjects } from "@/data/work"
import { catalog, categories } from "@/data/catalog"
import { productHref, serviceHref, serviceIdOf } from "../../router"

const ICONS: LucideIcon[] = [MessageCircle, Bot, Workflow, FileSearch, BarChart3, Sparkles, ShieldCheck, Lock, Zap, Layers, Plug, Gauge]
const TONES: Record<string, string> = { lilac: "#c9b7ff", blue: "#a9dcff", pink: "#ffb8c6", mint: "#b8f36b", yellow: "#ffd764", coral: "#ff9f8f" }
const pad = (n: number) => String(n + 1).padStart(2, "0")
const idx = (i: number) => ({ "--i": i }) as CSSProperties

/* -------------------------------------------------------- capability visual */
function Visual({ v }: { v: Vis }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.35 })
  const max = v.k === "bars" ? Math.max(...v.nums) : 1
  return (
    <div ref={ref} className={seen ? `sd-vis sd-vis--${v.k} is-in` : `sd-vis sd-vis--${v.k}`} data-tilt>
      <div className="sd-vis-bar">
        <i /><i /><i />
        <span>{v.title}</span>
      </div>
      {v.k === "chat" && (
        <div className="sd-chat">
          <p className="me" style={idx(0)}>{v.items[0]}</p>
          <p className="typing" style={idx(1)} aria-hidden><i /><i /><i /></p>
          <p className="bot" style={idx(2)}>{v.items[1]}</p>
          <p className="me" style={idx(3)}>{v.items[2]}</p>
        </div>
      )}
      {v.k === "flow" && (
        <ol className="sd-flow">
          {v.items.map((t, i) => (
            <li key={t} style={idx(i)} className={i === v.items.length - 1 ? "is-last" : undefined}>
              <span><Check size={12} aria-hidden /></span>
              {t}
            </li>
          ))}
        </ol>
      )}
      {v.k === "bars" && (
        <div className="sd-bars">
          {v.nums.map((n, i) => (
            <div key={i} style={{ ...idx(i), "--h": `${Math.round((n / max) * 100)}%` } as CSSProperties} className={i === v.nums.length - 1 ? "is-peak" : undefined}>
              <b>{v.items[i]}</b>
              <i />
            </div>
          ))}
        </div>
      )}
      {v.k === "list" && (
        <ul className="sd-list">
          {v.items.map((row, i) => {
            const [t, tag] = row.split("|")
            return (
              <li key={row} style={idx(i)}>
                <span>{t}</span>
                <small>{tag}</small>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function Capability({ c, i, tone }: { c: Cap; i: number; tone: string }) {
  return (
    <section id={`cap-${i}`} className={`sd-cap${i % 2 ? " is-flip" : ""}`}>
      <div className="sd-wrap sd-cap-grid">
        <div className="sd-cap-copy" data-reveal>
          <span className="sd-rule" style={{ background: tone }} />
          <h2 className="sd-h">{c.h}</h2>
          <p>{c.d}</p>
          <ul className="sd-subs">
            {c.subs.map(([t, d], k) => {
              const Icon = ICONS[(i * 2 + k + (i > 1 ? 3 : 0)) % ICONS.length]
              return (
                <li key={t} style={idx(k)}>
                  <span className="sd-sub-ic" style={{ background: tone }}><Icon size={18} aria-hidden /></span>
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="sd-cap-vis" data-reveal="scale">
          <Visual v={c.vis} />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ pays off list */
function Pays({ title, rows }: { title: string; rows: string[] }) {
  const ref = useRef<HTMLUListElement>(null)
  const on = useInView(ref, { once: true, amount: 0.4 })
  return (
    <section className="sd-pays" id="pays-off">
      <div className="sd-wrap sd-pays-grid">
        <h2 className="sd-h" data-reveal>{title}</h2>
        <ul ref={ref} className={on ? "sd-pays-list is-in" : "sd-pays-list"}>
          {rows.map((r, i) => (
            <li key={r} style={idx(i)}>
              <span className="sd-pays-no">{pad(i)}</span>
              <span>{r}</span>
              <span className="sd-pays-dot" aria-hidden><Check size={13} /></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------- team word cloud */
function Team({ words, note, tone }: { words: string[]; note: string; tone: string }) {
  return (
    <section className="sd-team">
      <div className="sd-wrap">
        <div className="sd-cloud" data-reveal="scale" style={{ "--tone": tone } as CSSProperties}>
          {words.map((w, i) => (
            <span key={w} style={idx(i)} className={`w${i % 5}`}>{w}</span>
          ))}
          <b aria-hidden>Teamwork</b>
        </div>
        <p className="sd-cap-note" data-reveal>{note}</p>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- how we work */
function Steps({ steps }: { steps: [string, string, string] }) {
  const rows = [
    ["Week 1", "Find the workflow", steps[0]],
    ["Weeks 2-3", "Prototype", steps[1]],
    ["Weeks 4+", "Build and connect", steps[2]],
    ["Launch", "Test and roll out", `We test against real examples, release to a small group first and widen once it is behaving.`],
    ["Every month", "Measure and improve", "We track what is saved, what breaks and what users ask for, then keep improving."],
  ]
  return (
    <section className="sd-how" id="how-we-work">
      <div className="sd-wrap">
        <h2 className="sd-h" data-reveal>How we work</h2>
        <ol className="sd-steps" data-reveal>
          {rows.map(([when, t, d], i) => (
            <li key={t} style={idx(i)}>
              <small>{when}</small>
              <span className="sd-step-no">{pad(i)}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------------------------------------------- products and client work */
type Slide = { key: string; kind: "work" | "product"; title: string; tag: string; text: string; href: string; node: React.ReactNode }

function Carousel({ title, work, prods }: { title: string; work: string[]; prods: string[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(0)
  const slides: Slide[] = [
    ...work.flatMap((id) => {
      const w = allProjects.find((p) => p.id === id)
      return w ? [{ key: w.id, kind: "work" as const, title: w.name, tag: `Client work · ${w.tags[0]}`, text: w.summary, href: "/work", node: <BrowserFrame url={w.url}><WorkVisual item={w} /></BrowserFrame> }] : []
    }),
    ...prods.flatMap((id) => {
      const p = catalog.find((c) => c.id === id)
      return p ? [{ key: p.id, kind: "product" as const, title: p.name, tag: `Our product · ${categories.find((c) => c.id === p.cat)?.label}`, text: p.blurb, href: productHref(p.id), node: <div className="sd-prodmock"><ProductMock m={p.mock} /></div> }] : []
    }),
  ]
  const go = (dir: number) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector<HTMLElement>(".sd-slide")
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 400) + 20), behavior: "smooth" })
  }
  const onScroll = () => {
    const el = track.current
    const card = el?.querySelector<HTMLElement>(".sd-slide")
    if (el && card) setPos(Math.round(el.scrollLeft / (card.offsetWidth + 20)))
  }
  return (
    <section className="sd-slides" id="work">
      <div className="sd-wrap">
        <div className="sd-slides-head" data-reveal>
          <h2 className="sd-h-sm">{title}</h2>
          <a className="text-link" href="/products">All products</a>
        </div>
      </div>
      <div className="sd-track" ref={track} onScroll={onScroll} data-reveal>
        {slides.map((s, i) => (
          <a key={s.key} href={s.href} className="sd-slide" style={idx(i)} data-cursor="View">
            <div className="sd-slide-media">{s.node}</div>
            <small>{s.tag}</small>
            <h3>{s.title} <ArrowUpRight size={16} aria-hidden /></h3>
            <p>{s.text}</p>
          </a>
        ))}
      </div>
      <div className="sd-wrap sd-slides-ctl">
        <button type="button" aria-label="Previous" onClick={() => go(-1)} disabled={pos <= 0}><ArrowLeft size={18} /></button>
        <button type="button" aria-label="Next" onClick={() => go(1)} disabled={pos >= slides.length - 1}><ArrowRight size={18} /></button>
        <span>{String(Math.min(pos + 1, slides.length)).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ page */
export default function ServiceDetailPage() {
  const id = serviceIdOf(useCmsRoute().path) ?? ""
  const d = getService(id)
  const svc = SERVICES.find((s) => s.id === id)
  const [intro] = useState(() => (performance.now() < 2500 ? ".95s" : ".1s"))
  const [open, setOpen] = useState(0)

  useEffect(() => {
  }, [svc])

  if (!d || !svc) return null
  const tone = TONES[svc.tone] ?? TONES.lilac
  const style = { "--tone": tone } as CSSProperties
  const more = d.more.map((m) => SERVICES.find((s) => s.id === m)).filter(Boolean) as typeof SERVICES

  return (
    <div className="sd" style={style}>
      {/* ------------------------------------------------------------ hero */}
      <section className="sd-hero" style={{ "--intro": intro } as CSSProperties}>
        <div className="hero-blob hero-blob--one" data-parallax="0.14" />
        <div className="sd-wrap">
          <nav className="sd-crumb" aria-label="Breadcrumb">
            <a href="/services">Services</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{svc.title}</span>
          </nav>
          <h1 aria-label={svc.title}>
            <span aria-hidden="true"><SplitWords text={svc.title} /></span>
          </h1>
          <p className="sd-lede">{d.lede}</p>
          <div className="sd-actions">
            <Button3D tone="mint" onClick={() => goToContact(`${svc.title} project`)}>
              Start a project <ArrowUpRight size={16} />
            </Button3D>
          </div>
          <div className="sd-hero-art" data-tilt data-cursor="Talk">
            <div className="sd-hero-art-in">{svc.art}</div>
            <a className="sd-talk" href="#contact"><i /> Talk to us</a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- statement */}
      <section className="sd-intro" id="overview">
        <div className="sd-wrap sd-intro-grid">
          <h2 className="sd-h" data-reveal>{d.stmt}</h2>
          <div className="sd-intro-copy" data-reveal>
            <p>{d.p[0]}</p>
            <p>{d.p[1]}</p>
          </div>
        </div>
        <div className="sd-wrap">
          <p className="sd-kicker" data-reveal>{d.capsTitle}</p>
          <div className="sd-chips" data-reveal>
            {d.caps.map((c, i) => (
              <a key={c.chip} href={`#cap-${i}`} style={idx(i)}>
                <span>{c.chip}</span>
                <ArrowRight size={16} aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- capabilities */}
      {d.caps.map((c, i) => (
        <Capability key={c.h} c={c} i={i} tone={tone} />
      ))}

      <Pays title={d.paysTitle} rows={d.pays} />
      <Team words={d.words} note={d.teamNote} tone={tone} />
      <Steps steps={d.steps} />
      <Carousel title={`Our products and client work for ${svc.title}`} work={d.work} prods={d.prods} />

      {/* ------------------------------------------------------- questions */}
      <section className="sd-faqs" id="faq">
        <div className="sd-wrap pd-faq-grid">
          <h2 className="sd-h" data-reveal>Questions</h2>
          <div className="pd-faq-list" data-reveal>
            {d.faq.map(([q, a], i) => (
              <div key={q} className={open === i ? "pd-faq is-open" : "pd-faq"} style={idx(i)}>
                <h3>
                  <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                    <span>{q}</span>
                    {open === i ? <Minus size={16} aria-hidden /> : <Plus size={16} aria-hidden />}
                  </button>
                </h3>
                <div className="pd-faq-body"><p>{a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- more */}
      <section className="sd-more">
        <div className="sd-wrap">
          <p className="sd-kicker" data-reveal>More services</p>
          <div className="sd-more-grid" data-reveal>
            {more.map((m, i) => (
              <a key={m.id} href={serviceHref(m.id)} style={idx(i)}>
                <span>{m.title}</span>
                <ArrowRight size={18} aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </section>

      <GlobalPresence talk={<Talk />} />
    </div>
  )
}

export { DETAILS }
