import { CSSProperties, useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { testimonials } from "@/data/testimonials"
import { useInView } from "../motion"
import { SectionHeading } from "./ui"

const DURATION = 8 // seconds per page

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const [per, setPer] = useState(2)
  const [page, setPage] = useState(0)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)")
    const set = () => {
      setPer(mq.matches ? 2 : 1)
      setPage(0)
    }
    set()
    mq.addEventListener("change", set)
    return () => mq.removeEventListener("change", set)
  }, [])

  const pages = Math.ceil(testimonials.length / per)
  const go = (n: number) => setPage((n + pages) % pages)
  const items = testimonials.slice(page * per, page * per + per)
  const paused = hover || !inView

  return (
    <section className="section testimonials" id="testimonials" ref={ref}>
      <SectionHeading
        eyebrow="Nice things, unprompted"
        title="What our clients"
        em="say."
        copy="Good partnerships make better work. Here is what a few of ours have told us."
      />

      <div
        className="testimonial-grid is-visible"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-live="polite"
      >
        {items.map((t, index) => (
          <figure
            key={`${per}-${page}-${t.name}`}
            className="quote-card"
            style={{ "--stagger": index } as CSSProperties}
          >
            <div className="quote-mark">“</div>
            <blockquote>
              {t.quote.split(" ").map((w, i) => (
                <span
                  key={i}
                  className="q-word"
                  style={{ "--w": `${0.25 + index * 0.14 + i * 0.018}s` } as CSSProperties}
                >
                  {w}
                </span>
              ))}
            </blockquote>
            <figcaption>
              <b>{t.name}</b>
              <span>{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="t-controls">
        <button type="button" onClick={() => go(page - 1)} aria-label="Previous testimonials">
          <ArrowLeft size={18} />
        </button>
        <div className="t-dots" role="tablist" aria-label="Testimonial pages">
          {Array.from({ length: pages }).map((_, n) => {
            const on = n === page
            return (
              <button
                key={n}
                type="button"
                role="tab"
                aria-selected={on}
                aria-label={`Page ${n + 1}`}
                onClick={() => go(n)}
                className={on ? "is-on" : undefined}
              >
                {on && (
                  <span
                    key={`${per}-${page}`}
                    className="p-fill"
                    style={{
                      animationDuration: `${DURATION}s`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                    onAnimationEnd={() => setPage((p) => (p + 1) % pages)}
                  />
                )}
              </button>
            )
          })}
        </div>
        <button type="button" onClick={() => go(page + 1)} aria-label="Next testimonials">
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  )
}
