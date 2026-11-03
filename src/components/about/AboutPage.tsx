import { CSSProperties, useEffect, useRef, useState } from "react"
import { ArrowRight, Cpu, Lightbulb, LifeBuoy, Mail, MessageCircle, Rocket, TrendingUp, Users } from "lucide-react"
import { FOUNDED, stats } from "@/data/company"
import { offices } from "@/data/offices"
import { projects } from "@/data/work"
import { chapters, contactInfo, mission, officeNotes, openRoles, promises, vision } from "@/data/about"
import { categories, catalog, type CatalogItem } from "@/data/catalog"
import { CountUp, SplitWords, useInView } from "../../motion"
import { ArrowUpRight, Button3D, SectionHeading, Sparkles } from "../ui"
import { BrowserFrame, mocks } from "../WorkMocks"
import GlobalPresence from "../GlobalPresence"
import ProductMock from "../ProductMock"
import { goToContact } from "../Hero"
import { productHref } from "../../router"

/* Live team photography for the about-page hero. */
const TEAM_PHOTO =
  "/images/team.webp"

const YEARS = new Date().getFullYear() - FOUNDED
const SERVICES_COUNT = 13
const COUNTRIES = new Set(offices.map((o) => o.country)).size
const stagger = (i: number) => ({ "--stagger": i }) as CSSProperties

/* ---------------------------------------------------------------- hero */
const PINS = [
  [13, 68],
  [39, 32],
  [64, 58],
  [87, 28],
] as const

function TeamPanel() {
  return (
    <figure className="about-photo" data-reveal="scale">
      {TEAM_PHOTO ? (
        <><img src={TEAM_PHOTO} alt="Professionals collaborating around a laptop in an office" /><figcaption className="team-photo-note">Representative team photography</figcaption></>
      ) : (
        <>
          <div className="about-photo-dots" aria-hidden="true" />
          <svg viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
            <path d="M130 205 Q250 60 390 95 T640 175 T870 85" fill="none" stroke="var(--ink)" strokeOpacity=".18" strokeWidth="2" />
            <path className="a-dash" d="M130 205 Q250 60 390 95 T640 175 T870 85" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {offices.map((o, i) => (
            <span
              key={o.id}
              className="about-pin"
              style={{ left: `${PINS[i][0]}%`, top: `${PINS[i][1]}%`, "--d": `${i * 0.7}s` } as CSSProperties}
            >
              <i />
              <b>{o.city}</b>
            </span>
          ))}
          <div className="about-photo-sticker" data-parallax="0.06">
            <Sparkles size={18} /> One team, four cities
          </div>
        </>
      )}
    </figure>
  )
}

function AboutHero() {
  // on a fresh page load the intro curtain is still covering the page, so wait for it
  const [intro] = useState(() => (performance.now() < 2500 ? ".95s" : ".1s"))
  return (
    <section className="about-hero" style={{ "--intro": intro } as CSSProperties}>
      <div className="hero-blob hero-blob--one" data-parallax="0.14" />
      <div className="hero-blob hero-blob--two" data-parallax="-0.1" />
      <div className="about-hero-inner">
        <p className="eyebrow">
          <span /> About Sybertron · since {FOUNDED}
        </p>
        <h1 aria-label={`${YEARS} years. Four cities. One team.`}>
          <span aria-hidden="true">
            <SplitWords text={`${YEARS} years.`} />
            <SplitWords text="Four cities." start={2} />
            <br />
            <SplitWords text="One team." start={4} em />
          </span>
        </h1>
        <p className="about-lede">
          We started as a small web studio in Delhi, India in {FOUNDED}. Today we have a presence in California, London, Dubai
          and Delhi, building websites, apps, AI and our own software products.
        </p>

        <ul className="about-offices rv-stagger" data-reveal>
          {offices.map((o, i) => (
            <li key={o.id} style={stagger(i)}>
              <span className="about-office-country">
                <i /> {o.country}
              </span>
              <h3>{o.city}</h3>
              <p>{officeNotes[o.id]}</p>
            </li>
          ))}
        </ul>

        <div className="metrics about-stats" data-reveal>
          {[
            { label: "Years building software", value: `${YEARS}` },
            { label: "Projects delivered", value: `${stats[0].value}+` },
            { label: "In-house products", value: `${stats[1].value}` },
            { label: "Services under one roof", value: `${SERVICES_COUNT}` },
            { label: "Countries on three continents", value: `${COUNTRIES}` },
          ].map((s, i) => (
            <div key={s.label} style={stagger(i)}>
              <CountUp value={s.value} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <TeamPanel />
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- story */
function Story() {
  const items = useRef<(HTMLLIElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [seen, setSeen] = useState<Set<number>>(new Set())

  useEffect(() => {
    const els = items.current.filter(Boolean) as HTMLLIElement[]
    // the chapter crossing the middle of the screen is the active one
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i))
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    )
    const enter = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const i = Number((e.target as HTMLElement).dataset.i)
          setSeen((s) => new Set(s).add(i))
          enter.unobserve(e.target)
        }),
      { threshold: 0.2 },
    )
    els.forEach((el) => {
      spy.observe(el)
      enter.observe(el)
    })
    return () => {
      spy.disconnect()
      enter.disconnect()
    }
  }, [])

  const c = chapters[active]
  return (
    <section className="section about-story" id="story">
      <div className="about-story-grid">
        <div className="about-story-side" data-reveal>
          <p className="eyebrow">
            <span /> The story so far
          </p>
          <h2>
            From one studio to four countries,
            <br />
            <em>one chapter at a time.</em>
          </h2>
          <div className="about-year" aria-hidden="true">
            <span key={c.year}>{c.year}</span>
            <small key={c.label}>{c.label}</small>
          </div>
        </div>

        <ol className="about-chapters" style={{ "--story-p": (active + 1) / chapters.length } as CSSProperties}>
          {chapters.map((ch, i) => (
            <li
              key={ch.year}
              data-i={i}
              ref={(el) => {
                items.current[i] = el
              }}
              className={`chapter${i === active ? " is-active" : ""}${i < active ? " is-past" : ""}${seen.has(i) ? " is-seen" : ""}`}
            >
              <time>{ch.year}</time>
              <h3>{ch.title}</h3>
              <p>{ch.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ products */
const toneOf = (id: string) => categories.find((c) => c.id === id)?.tone ?? "var(--lilac)"
const labelOf = (id: string) => categories.find((c) => c.id === id)?.label ?? ""

/* Compact version of the card on /products: same tint, family tag, copy and mock-up. */
function ProductTile({ p }: { p: CatalogItem }) {
  const ref = useRef<HTMLElement>(null)
  // 28 live mock-ups would be heavy, so each one mounts when its card first scrolls into view
  const seen = useInView(ref, { once: true, amount: 0.2 })
  return (
    <article ref={ref} className="ap-card" data-reveal style={{ "--tone": toneOf(p.cat) } as CSSProperties}>
      <div className="ap-mock" data-tilt>
        <div className="ap-mock-inner"><ProductMock m={p.mock} /></div>
      </div>
      <p className="ap-family">
        <i style={{ background: p.accent }} /> {labelOf(p.cat)}
      </p>
      <h3>{p.name}</h3>
      <p className="ap-blurb">{p.blurb}</p>
      <ul>
        {p.bullets.map((b) => (
          <li key={b}>
            <i style={{ background: p.accent }} />
            {b}
          </li>
        ))}
      </ul>
      <p className="ap-platforms">{p.platforms}</p>
      <div className="ap-actions">
        <Button3D tone="ink" onClick={() => goToContact(`Demo of ${p.name}`)}>
          Explore demo <ArrowRight size={16} />
        </Button3D>
        <Button3D tone="paper" href={productHref(p.id)}>
          Details
        </Button3D>
      </div>
    </article>
  )
}

/* ---------------------------------------------------------------- work */
function BuiltHere() {
  return (
    <section className="section about-work" id="built">
      <SectionHeading
        eyebrow="Built here"
        title="Client work and our own"
        em="products, side by side."
        copy={`We build websites, online stores, mobile apps and business software, and we test and look after them once they're live. Our clients range from one-person startups to companies with thousands of staff. Alongside client projects we design, build and support ${stats[1].value} products of our own.`}
      />

      <div className="about-work-grid rv-stagger" data-reveal>
        {projects.map((p, i) => {
          const Mock = mocks[p.id]
          return (
            <a className="about-work-card" href="/work" key={p.id} style={stagger(i)} data-cursor="View">
              <BrowserFrame url={p.url}>
                <Mock />
              </BrowserFrame>
              <div className="about-work-meta">
                <h3>{p.name}</h3>
                <span>{p.tags[0]}</span>
              </div>
            </a>
          )
        })}
        <a className="about-work-card about-work-card--next" href="/start" style={stagger(projects.length)}>
          <div className="about-next">
            <Sparkles size={26} />
            <strong>
              Your project, <em>next.</em>
            </strong>
            <span className="about-next-arrow">
              <ArrowUpRight size={20} />
            </span>
          </div>
          <div className="about-work-meta">
            <h3>Start a project</h3>
            <span>Reply within one business day</span>
          </div>
        </a>
      </div>

      <div className="about-products" id="our-products">
        <div className="about-products-head">
          <p className="about-label">Our products</p>
          <a className="about-products-all" href="/products">
            See all {catalog.length} products <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="ap-grid">
          {catalog.map((p) => (
            <ProductTile key={p.id} p={p} />
          ))}
          <aside className="ap-card ap-card--fit" data-reveal>
            <h3>
              Not sure which <em>one fits?</em>
            </h3>
            <p className="ap-blurb">Tell us about your business and we&apos;ll recommend a product, or a custom build.</p>
            <div className="ap-actions">
              <Button3D tone="mint" onClick={() => goToContact("Help me choose a product")}>
                Ask us <ArrowRight size={16} />
              </Button3D>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ promises */
function Promises() {
  return (
    <section className="about-promises" id="promises">
      <div className="about-inner">
        <div data-reveal>
          <p className="eyebrow">
            <span /> How we work
          </p>
          <h2>
            Four promises we hold
            <br />
            ourselves to.
          </h2>
        </div>
        <ol className="about-promise-list rv-stagger" data-reveal>
          {promises.map((p, i) => (
            <li className="about-promise" key={p.title} style={stagger(i)}>
              <h3>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {p.title}
              </h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ----------------------------------------------------- mission, vision */
const ICONS = { cpu: Cpu, bulb: Lightbulb, trend: TrendingUp, rocket: Rocket, users: Users, support: LifeBuoy } as const

function MV({ data, variant }: { data: typeof mission; variant: "mission" | "vision" }) {
  return (
    <article className={`mv-card mv-card--${variant}`}>
      <header>
        <span>{data.tag}</span>
        <small>{data.when}</small>
      </header>
      <h3>{data.title}</h3>
      <ul>
        {data.points.map((pt) => {
          const Icon = ICONS[pt.icon as keyof typeof ICONS]
          return (
            <li key={pt.text}>
              <span className="mv-icon">
                <Icon size={17} aria-hidden />
              </span>
              {pt.text}
            </li>
          )
        })}
      </ul>
    </article>
  )
}

function WhyWeExist() {
  return (
    <section className="about-why" id="why">
      <div className="about-inner">
        <div data-reveal>
          <p className="eyebrow">
            <span /> Why we exist
          </p>
          <h2>
            We succeed when our
            <br />
            <em>customers do.</em>
          </h2>
        </div>
        <div className="about-mv rv-stagger" data-reveal>
          <MV data={mission} variant="mission" />
          <div className="mv-link" style={stagger(1)} aria-hidden="true">
            <span>
              <ArrowRight size={18} />
            </span>
          </div>
          <div style={stagger(2)} className="mv-wrap">
            <MV data={vision} variant="vision" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ careers */
const TEAMS = ["Engineering", "Design", "QA", "Marketing", "Support"]

function Careers() {
  return (
    <section className="about-careers" id="join">
      <div className="about-careers-card" data-reveal="scale">
        <div className="about-careers-copy">
          <p className="eyebrow">
            <span /> Want to build with us?
          </p>
          <h2>
            <CountUp value={`${openRoles}`} /> open roles across <em>our teams.</em>
          </h2>
          <ul>
            {TEAMS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <Button3D href="/careers" tone="ink">
          See careers <ArrowUpRight size={17} />
        </Button3D>
      </div>
    </section>
  )
}

/* -------------------------------------------------------- talk + map */
export function Talk() {
  return (
    <div className="about-talk" id="contact" data-reveal>
      <div>
        <h2>
          Let&apos;s talk about <em>your project</em>
        </h2>
        <p>Tell us what you need and we&apos;ll reply within one business day.</p>
      </div>
      <div className="about-talk-actions">
        <ul>
          <li>
            <a href={`mailto:${contactInfo.email}`}>
              <span>
                <Mail size={16} aria-hidden />
              </span>
              {contactInfo.email}
            </a>
          </li>
          <li>
            <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer">
              <span>
                <MessageCircle size={16} aria-hidden />
              </span>
              Chat on WhatsApp
            </a>
          </li>
        </ul>
        <Button3D href="/start" tone="mint">
          Start a project <ArrowUpRight size={17} />
        </Button3D>
      </div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Story />
      <BuiltHere />
      <Promises />
      <WhyWeExist />
      <Careers />
      <GlobalPresence talk={<Talk />} />
    </>
  )
}

