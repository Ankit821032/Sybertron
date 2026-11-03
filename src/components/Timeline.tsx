import { CSSProperties, useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { FOUNDED, milestones, stats } from "@/data/company"
import { CountUp, prefersReducedMotion, useCountUp, useInView } from "../motion"

const END = new Date().getFullYear()
// one slot per year, plus a final "Now" slot
const SLOTS: (number | "Now")[] = [
  ...Array.from({ length: END - FOUNDED }, (_, i) => FOUNDED + i),
  "Now",
]
const YEARS = END - FOUNDED

export default function Timeline() {
  const wrap = useRef<HTMLElement>(null)
  const inView = useInView(wrap, { once: true, amount: 0.25 })
  const [active, setActive] = useState(Math.min(4, milestones.length - 1))
  const [auto, setAuto] = useState(true)
  const years = useCountUp(YEARS, inView)

  const go = (i: number, manual = true) => {
    setActive((i + milestones.length) % milestones.length)
    if (manual) setAuto(false)
  }

  // gentle autoplay until the visitor takes over
  useEffect(() => {
    if (!inView || !auto || prefersReducedMotion()) return
    const id = setInterval(
      () => setActive((a) => (a + 1) % milestones.length),
      4200,
    )
    return () => clearInterval(id)
  }, [inView, auto])

  const m = milestones[active]
  const activeSlot = SLOTS.indexOf(m.year)
  const progress = ((activeSlot + 0.5) / SLOTS.length) * 100

  return (
    <section className="section story" id="about" ref={wrap}>
      <div className="story-intro" data-reveal>
        <p className="eyebrow">
          <span /> Delivering solutions since {FOUNDED}
        </p>
        <h2>
          <span className="years-count">{years}</span> years of building
          <br />
          <em>software that scales.</em>
        </h2>
        <p>
          We have grown by staying curious, keeping teams close, and turning
          what we learn on client work into products of our own.
        </p>
      </div>

      <div className="metrics" data-reveal>
        {stats.map((s, index) => (
          <div key={s.label} style={{ "--stagger": index } as CSSProperties}>
            <CountUp value={`${s.value}${s.suffix}`} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="year-bars" data-reveal>
        <div className="year-bars-inner">
          <div className="year-rail">
            <i style={{ width: `${progress}%` }} />
          </div>
          <div
            className="year-grid"
            style={{ gridTemplateColumns: `repeat(${SLOTS.length}, minmax(0, 1fr))` }}
          >
            {SLOTS.map((y, i) => {
              const idx = milestones.findIndex((x) => x.year === y)
              const has = idx >= 0
              const isActive = i === activeSlot
              const past = i <= activeSlot
              const cls = `year-bar${has ? " has" : ""}${past ? " is-past" : ""}${isActive ? " is-active" : ""}`
              return (
                <div key={String(y)} className="year-slot">
                  {has ? (
                    <button
                      type="button"
                      onClick={() => go(idx)}
                      aria-label={`Show ${y}`}
                      aria-current={isActive}
                    >
                      <span className={cls} style={{ "--i": i } as CSSProperties} />
                      <small className={isActive ? "is-active" : undefined}>{y}</small>
                    </button>
                  ) : (
                    <>
                      <span className={cls} style={{ "--i": i } as CSSProperties} />
                      <small aria-hidden="true">&nbsp;</small>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="milestone" onMouseEnter={() => setAuto(false)} data-reveal>
        <div className="milestone-body" key={active}>
          <span className="milestone-year">{m.year}</span>
          <div>
            <p className="milestone-tag">{m.tag}</p>
            <h3>{m.title}</h3>
            <p className="milestone-text">{m.text}</p>
          </div>
        </div>
        <div className="milestone-nav">
          <button type="button" onClick={() => go(active - 1)} aria-label="Previous milestone">
            <ArrowLeft size={18} />
          </button>
          <button type="button" onClick={() => go(active + 1)} aria-label="Next milestone">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
