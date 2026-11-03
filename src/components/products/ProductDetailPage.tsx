import { useRouter as useCmsRoute } from '../../router'
import { CSSProperties, useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Check,
  FileText,
  LayoutGrid,
  Minus,
  Plus,
  Settings2,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react"
import { SplitWords, useCountUp, useInView } from "../../motion"
import { Button3D } from "../ui"
import { goToContact } from "../Hero"
import GlobalPresence from "../GlobalPresence"
import ProductMock from "../ProductMock"
import { Talk } from "../about/AboutPage"
import { categories } from "@/data/catalog"
import { asVariant, getProduct } from "@/data/productDetail"
import { productHref, productIdOf } from "../../router"

const MODULE_ICONS = [FileText, Users, Boxes, Wallet, LayoutGrid, BarChart3, ShieldCheck, Settings2]
const pad = (n: number) => String(n + 1).padStart(2, "0")

/* A mock-up that only starts animating once it scrolls into view. */
function LiveMock({ m, amount = 0.25 }: { m: Parameters<typeof ProductMock>[0]["m"]; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, amount })
  return (
    <div ref={ref} className="pd-live">
      <ProductMock m={m} />
    </div>
  )
}

/* Section wrapper: reveals on scroll and exposes --i for staggered children. */
function Block({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`pd-block ${className}`}>
      <div className="pd-wrap">{children}</div>
    </section>
  )
}

function Problem({ text, i, on }: { text: string; i: number; on: boolean }) {
  return (
    <li style={{ "--i": i } as CSSProperties} className={on ? "is-on" : undefined}>
      <span className="pd-prob-ic" aria-hidden="true">
        <Minus size={14} />
      </span>
      <span className="pd-prob-t">{text}</span>
      <span className="pd-switch" aria-hidden="true">
        <i />
      </span>
      <span className="sr-only">{on ? "Solved" : "Problem"}</span>
    </li>
  )
}

function Faq({ q, a, open, onToggle, i }: { q: string; a: string; open: boolean; onToggle: () => void; i: number }) {
  return (
    <div className={open ? "pd-faq is-open" : "pd-faq"} style={{ "--i": i } as CSSProperties}>
      <h3>
        <button type="button" aria-expanded={open} onClick={onToggle}>
          <span>{q}</span>
          {open ? <Minus size={16} aria-hidden /> : <Plus size={16} aria-hidden />}
        </button>
      </h3>
      <div className="pd-faq-body">
        <p>{a}</p>
      </div>
    </div>
  )
}

export default function ProductDetailPage() {
  const id = productIdOf(useCmsRoute().path) ?? ""
  const d = getProduct(id)
  const [intro] = useState(() => (performance.now() < 2500 ? ".95s" : ".1s"))
  const [open, setOpen] = useState(0)

  const probRef = useRef<HTMLUListElement>(null)
  const probOn = useInView(probRef, { once: true, amount: 0.5 })
  const featRef = useRef<HTMLDivElement>(null)
  const featIn = useInView(featRef, { once: true, amount: 0.35 })
  const count = useCountUp(d?.features.length ?? 0, featIn)

  useEffect(() => {
  }, [d])

  if (!d) return null
  const { item } = d
  const tone = categories.find((c) => c.id === item.cat)?.tone ?? "#c9b7ff"
  const style = { "--tone": tone, "--accent": item.accent } as CSSProperties
  const m = item.mock
  const gallery = [
    { m, cap: `${item.name} dashboard, live view`, cls: "pd-shot--lg" },
    { m: asVariant(m, m.variant === "list" ? "chart" : "list", "Reports"), cap: "Reports ready to share", cls: "" },
    { m: asVariant(m, m.variant === "tiles" ? "chart" : "tiles", "Overview"), cap: "Status at a glance", cls: "" },
    { m: asVariant(m, m.variant === "chart" ? "list" : "chart", "Teams"), cap: "Work by team and branch", cls: "pd-shot--wide" },
  ]

  return (
    <div className="pd" style={style}>
      {/* ------------------------------------------------------------ hero */}
      <section className="pd-hero" style={{ "--intro": intro } as CSSProperties}>
        <div className="hero-blob hero-blob--one" data-parallax="0.14" />
        <div className="pd-wrap pd-hero-grid">
          <div className="pd-hero-copy">
            <nav className="pd-crumb" aria-label="Breadcrumb">
              <a href="/products">Products</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{item.name}</span>
            </nav>
            <h1 aria-label={item.name}>
              <span aria-hidden="true">
                <SplitWords text={item.name} />
              </span>
            </h1>
            <p className="pd-lede">{d.headline}</p>
            <div className="pd-actions">
              <Button3D tone="mint" onClick={() => goToContact(`Demo of ${item.name}`)}>
                Explore demo <ArrowRight size={16} />
              </Button3D>
              <Button3D tone="paper" onClick={() => goToContact(`Book a demo of ${item.name}`)}>
                Book a demo
              </Button3D>
            </div>
            <a className="text-link pd-visit" href={`https://${d.host}`} target="_blank" rel="noopener noreferrer">
              Visit {d.host} <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
          <div className="pd-hero-mock" data-tilt data-cursor="Demo">
            <div className="pp-mock-inner">
              <ProductMock m={m} />
            </div>
          </div>
        </div>

        <dl className="pd-wrap pd-meta" data-reveal>
          <div>
            <dt>Category</dt>
            <dd>{d.family}</dd>
          </div>
          <div>
            <dt>Runs on</dt>
            <dd>{d.runsOn}</dd>
          </div>
          <div>
            <dt>Built for</dt>
            <dd>{d.builtFor}</dd>
          </div>
          <div>
            <dt>Compliance</dt>
            <dd>{d.compliance}</dd>
          </div>
        </dl>
      </section>

      {/* -------------------------------------------------------- overview */}
      <Block id="overview" className="pd-overview">
        <div className="pd-overview-top" data-reveal>
          <div className="pd-title">
            <span className="pd-ic" aria-hidden="true">
              <FileText size={20} />
            </span>
            <h2>Overview</h2>
            <ul className="pd-tags">
              {d.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="pd-overview-copy">
            <p className="pd-pull">{d.headline}</p>
            <p>{d.overview}</p>
          </div>
        </div>

        <div className="pd-gallery" data-reveal>
          {gallery.map((g, i) => (
            <figure key={g.cap} className={`pd-shot ${g.cls}`} style={{ "--i": i } as CSSProperties}>
              <div className="pd-shot-frame" data-tilt>
                <LiveMock m={g.m} amount={0.2} />
              </div>
              <figcaption>{g.cap}</figcaption>
            </figure>
          ))}
        </div>
      </Block>

      {/* --------------------------------------------------------- problems */}
      <Block id="problems" className="pd-problems">
        <h2 className="pd-h" data-reveal>
          Problems it <em>solves</em>
        </h2>
        <ul className="pd-probs" ref={probRef}>
          {d.problems.map((p, i) => (
            <Problem key={p} text={p} i={i} on={probOn} />
          ))}
        </ul>

        <p className="pd-kicker" data-reveal>
          How it fits together
        </p>
        <div className="pd-modules" data-reveal>
          {d.modules.map((x, i) => {
            const Icon = MODULE_ICONS[i % MODULE_ICONS.length]
            return (
              <article key={x.t} style={{ "--i": i } as CSSProperties}>
                <span className="pd-mod-no">{pad(i)}</span>
                <span className="pd-mod-ic" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <h3>{x.t}</h3>
                <p>{x.d}</p>
              </article>
            )
          })}
        </div>
      </Block>

      {/* ---------------------------------------------------------- features */}
      <Block id="features" className="pd-features">
        <div className="pd-features-grid" ref={featRef}>
          <div className="pd-features-lead" data-reveal>
            <h2 className="pd-h">Features</h2>
            <div className="pd-count">
              <strong aria-label={`${d.features.length} features`}>{count}</strong>
              <p>
                features, ready
                <br />
                on day one
              </p>
            </div>
            <p className="pd-features-note">
              What {item.name} does out of the box. Anything missing can be added for your business.
            </p>
          </div>
          <ol className={featIn ? "pd-flist is-in" : "pd-flist"}>
            {d.features.map((f, i) => (
              <li key={f} style={{ "--i": i } as CSSProperties}>
                <span className="pd-f-no">{pad(i)}</span>
                <span className="pd-f-ic" aria-hidden="true">
                  <Check size={15} />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ol>
        </div>
      </Block>

      {/* ------------------------------------------------------------- plans */}
      <Block id="plans" className="pd-plans">
        <div className="pd-plans-head" data-reveal>
          <h2 className="pd-h">Plans</h2>
          <p>
            Prices as listed on {d.host}. Yearly billing saves around 17%.
          </p>
        </div>
        <div className="pd-plan-grid" data-reveal>
          {d.plans.map((p, i) => (
            <article key={p.name} className={p.featured ? "pd-plan is-featured" : "pd-plan"} style={{ "--i": i } as CSSProperties}>
              {p.featured && <span className="pd-badge">Most popular</span>}
              <h3>{p.name}</h3>
              <p className="pd-price">
                <strong>{p.price}</strong>
                {p.unit && <span> / {p.unit}</span>}
              </p>
              <p className="pd-plan-note">{p.note}</p>
              <ul>
                {p.items.map((it) => (
                  <li key={it}>
                    <Check size={14} aria-hidden /> {it}
                  </li>
                ))}
              </ul>
              <Button3D
                tone={p.featured ? "mint" : "paper"}
                onClick={() => goToContact(`${p.name} plan: ${item.name}`)}
              >
                {p.cta}
              </Button3D>
            </article>
          ))}
        </div>
      </Block>

      {/* --------------------------------------------------------- questions */}
      <Block id="faq" className="pd-faqs">
        <div className="pd-faq-grid">
          <h2 className="pd-h" data-reveal>
            Questions
          </h2>
          <div className="pd-faq-list" data-reveal>
            {d.faq.map((f, i) => (
              <Faq key={f.q} {...f} i={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </Block>

      {/* --------------------------------------------------------- see live */}
      <Block id="live" className="pd-see">
        <div className="pd-see-card" data-reveal="scale">
          <div>
            <h2 className="pd-h">
              See {item.name} <em>live.</em>
            </h2>
            <p>Explore it yourself right now, or book a 30-minute guided walkthrough, online or on-site.</p>
          </div>
          <div className="pd-actions">
            <Button3D tone="mint" onClick={() => goToContact(`Demo of ${item.name}`)}>
              Explore {item.name} <ArrowRight size={16} />
            </Button3D>
            <Button3D tone="paper" onClick={() => goToContact(`Book a guided demo of ${item.name}`)}>
              Book a guided demo
            </Button3D>
          </div>
        </div>
      </Block>

      {/* ----------------------------------------------------------- related */}
      <Block id="related" className="pd-related">
        <p className="pd-kicker" data-reveal>
          Related products
        </p>
        <div className="pd-rel-grid" data-reveal>
          {d.related.map((r, i) => (
            <a key={r.id} href={productHref(r.id)} className="pd-rel" style={{ "--i": i, "--accent": r.accent } as CSSProperties}>
              <div className="pd-rel-mock" data-cursor="View">
                <LiveMock m={r.mock} amount={0.2} />
              </div>
              <small>{categories.find((c) => c.id === r.cat)?.label}</small>
              <h3>
                {r.name} <ArrowUpRight size={16} aria-hidden />
              </h3>
              <p>{r.blurb}</p>
            </a>
          ))}
        </div>
      </Block>

      <GlobalPresence talk={<Talk />} />
    </div>
  )
}
