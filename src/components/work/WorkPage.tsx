import { CSSProperties, useRef, useState } from "react"
import { FOUNDED, stats } from "@/data/company"
import { offices } from "@/data/offices"
import { CATEGORIES, allProjects, type Category, type WorkItem } from "@/data/work"
import { CountUp, SplitWords, useInView } from "../../motion"
import { ArrowUpRight, Sparkles } from "../ui"
import { BrowserFrame, WorkVisual } from "../WorkMocks"
import GlobalPresence from "../GlobalPresence"
import { Talk } from "../about/AboutPage"

type Filter = "All" | Category

const COUNTRIES = new Set(offices.map((o) => o.country)).size
const YEARS = new Date().getFullYear() - FOUNDED
const countOf = (f: Filter) => (f === "All" ? allProjects.length : allProjects.filter((p) => p.category === f).length)

/* ---------------------------------------------------------------- hero */
function WorkHero() {
  // on a fresh page load the intro curtain is still covering the page, so wait for it
  const [intro] = useState(() => (performance.now() < 2500 ? ".95s" : ".1s"))
  return (
    <section className="about-hero work-hero" style={{ "--intro": intro } as CSSProperties}>
      <div className="hero-blob hero-blob--one" data-parallax="0.14" />
      <div className="hero-blob hero-blob--two" data-parallax="-0.1" />
      <div className="about-hero-inner">
        <p className="eyebrow">
          <span /> Our work
        </p>
        <h1 aria-label="Our work, live and in use.">
          <span aria-hidden="true">
            <SplitWords text="Our work," />
            <br />
            <SplitWords text="live and in use." start={2} em />
          </span>
        </h1>
        <p className="about-lede">
          A selection of websites, online stores, platforms, apps and games we have designed, built and
          launched for clients, from one-person startups to companies with thousands of staff.
        </p>

        <div className="metrics about-stats work-stats" data-reveal>
          {[
            { label: "Projects delivered", value: `${stats[0].value}+` },
            { label: "Kinds of work", value: `${CATEGORIES.length}` },
            { label: "Countries where we work", value: `${COUNTRIES}` },
            { label: "Years of shipping", value: `${YEARS}` },
          ].map((s, i) => (
            <div key={s.label} style={{ "--stagger": i } as CSSProperties}>
              <CountUp value={s.value} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- card */
function WorkCard({ p, index }: { p: WorkItem; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.15 })
  return (
    <a
      ref={ref}
      className={seen ? "work-card is-in" : "work-card"}
      href="/start"
      data-cursor="View"
      style={{ "--stagger": index % 3 } as CSSProperties}
      aria-label={`${p.name}: ${p.summary} Discuss a similar project.`}
    >
      <BrowserFrame url={p.url}>
        <WorkVisual item={p} />
      </BrowserFrame>
      <div className="work-card-meta">
        <div className="work-card-tags">
          {p.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <h3>{p.name}</h3>
        <p>{p.summary}</p>
        <span className="work-card-more">
          Start a similar project
          <i aria-hidden="true">
            <ArrowUpRight size={15} />
          </i>
        </span>
      </div>
    </a>
  )
}

function NextCard({ index }: { index: number }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.15 })
  return (
    <a
      ref={ref}
      className={seen ? "work-card work-card--next is-in" : "work-card work-card--next"}
      href="/start"
      style={{ "--stagger": index % 3 } as CSSProperties}
    >
      <div className="about-next">
        <Sparkles size={26} />
        <strong>
          Your project, <em>next.</em>
        </strong>
        <span className="about-next-arrow">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="work-card-meta">
        <h3>Start a project</h3>
        <p>Tell us what you need and we&apos;ll reply within one business day.</p>
      </div>
    </a>
  )
}

/* ---------------------------------------------------------------- grid */
function Portfolio() {
  const [filter, setFilter] = useState<Filter>("All")
  const items = filter === "All" ? allProjects : allProjects.filter((p) => p.category === filter)
  const filters: Filter[] = ["All", ...CATEGORIES]

  return (
    <section className="section work-portfolio" id="work">
      <div className="work-tabs" role="group" aria-label="Filter projects by type" data-reveal>
        {filters.map((f) => (
          <button key={f} className="work-tab" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f}
            <sup>{countOf(f)}</sup>
          </button>
        ))}
      </div>
      <p className="work-count" aria-live="polite">
        Showing <b>{items.length}</b> {items.length === 1 ? "project" : "projects"}
        {filter !== "All" && (
          <>
            {" "}
            in <em>{filter}</em>
          </>
        )}
      </p>

      {/* key remounts the grid, so every filter change replays the card entrance */}
      <div className="work-grid" key={filter}>
        {items.map((p, i) => (
          <WorkCard key={p.id} p={p} index={i} />
        ))}
        <NextCard index={items.length} />
      </div>
    </section>
  )
}

export default function WorkPage() {
  return (
    <>
      <WorkHero />
      <Portfolio />
      <GlobalPresence talk={<Talk />} />
    </>
  )
}
