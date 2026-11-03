import { useCmsPhrase, useCmsMetric } from './cms/runtime'
import { CSSProperties, Fragment, RefObject, useEffect, useRef, useState } from "react"

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const reduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches

/* ------------------------------------------------------------------ */
/* Scroll-driven motion: hero sink, parallax, SUBMERGE project cards,  */
/* active nav link                                                     */
/* ------------------------------------------------------------------ */
function useScrollMotion(route: string) {
  useEffect(() => {
    // active nav link works even with reduced motion
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".nav-links a"),
    )
    const sections = links
      .filter((a) => a.getAttribute("href")?.startsWith("#"))
      .map((a) => document.querySelector(a.getAttribute("href") || ""))
      .filter(Boolean) as Element[]
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          links.forEach((a) =>
            a.classList.toggle(
              "is-active",
              a.getAttribute("href") === `#${entry.target.id}`,
            ),
          )
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    )
    sections.forEach((s) => spy.observe(s))

    if (reduced()) return () => spy.disconnect()

    const hero = document.querySelector<HTMLElement>(".hero-inner")
    const heroBg = document.querySelector<HTMLElement>(".hero")
    const parallax = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    )
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(".project-card"),
    )
    let stickyTop: number[] = []
    let isSticky = false

    const measure = () => {
      isSticky = cards[0]
        ? getComputedStyle(cards[0]).position === "sticky"
        : false
      stickyTop = cards.map((c) => parseFloat(getComputedStyle(c).top) || 0)
    }

    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const y = window.scrollY

      if (hero) hero.style.setProperty("--hero-p", clamp(y / (vh * 0.85)).toFixed(3))
      if (heroBg) heroBg.style.setProperty("--hero-bg", `${(y * 0.18).toFixed(1)}px`)

      parallax.forEach((el) => {
        const ref = el.parentElement
        if (!ref) return
        const r = ref.getBoundingClientRect()
        if (r.bottom < -200 || r.top > vh + 200) return
        const speed = parseFloat(el.dataset.parallax || "0.1")
        const center = r.top + r.height / 2 - vh / 2
        el.style.setProperty("--pary", `${(-center * speed).toFixed(1)}px`)
      })

      // submerge: each card sinks, blurs and tints blue as the next one covers it
      cards.forEach((card, i) => {
        const next = cards[i + 1]
        let sink = 0
        let emerge = 1
        if (isSticky) {
          if (next) {
            const target = stickyTop[i + 1]
            const nt = next.getBoundingClientRect().top
            sink = clamp(1 - (nt - target) / Math.max(1, vh - target))
          }
          emerge = clamp((vh - card.getBoundingClientRect().top) / (vh * 0.55))
        }
        card.style.setProperty("--sink", sink.toFixed(3))
        card.style.setProperty("--emerge", emerge.toFixed(3))
      })
    }
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const onResize = () => {
      measure()
      request()
    }
    measure()
    update()
    window.addEventListener("scroll", request, { passive: true })
    window.addEventListener("resize", onResize)
    window.addEventListener("load", onResize)
    return () => {
      spy.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", request)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("load", onResize)
    }
  }, [route])
}

/* ------------------------------------------------------------------ */
/* Pointer motion: 3D tilt + spotlight, magnetic buttons, hero parallax */
/* ------------------------------------------------------------------ */
function usePointerMotion(route: string) {
  useEffect(() => {
    if (reduced() || !finePointer()) return
    const cleanups: Array<() => void> = []

    document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const x = clamp((e.clientX - r.left) / r.width)
        const y = clamp((e.clientY - r.top) / r.height)
        el.style.setProperty("--tilt-x", (x * 2 - 1).toFixed(3))
        el.style.setProperty("--tilt-y", (y * 2 - 1).toFixed(3))
        el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`)
        el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`)
      }
      const leave = () => {
        el.style.setProperty("--tilt-x", "0")
        el.style.setProperty("--tilt-y", "0")
      }
      el.addEventListener("pointermove", move)
      el.addEventListener("pointerleave", leave)
      cleanups.push(() => {
        el.removeEventListener("pointermove", move)
        el.removeEventListener("pointerleave", leave)
      })
    })

    document
      .querySelectorAll<HTMLElement>(".button-3d, .menu-button, .hero-chips button")
      .forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          const dx = e.clientX - (r.left + r.width / 2)
          const dy = e.clientY - (r.top + r.height / 2)
          el.style.setProperty("--mag-x", `${(dx * 0.22).toFixed(1)}px`)
          el.style.setProperty("--mag-y", `${(dy * 0.28).toFixed(1)}px`)
        }
        const leave = () => {
          el.style.setProperty("--mag-x", "0px")
          el.style.setProperty("--mag-y", "0px")
        }
        el.addEventListener("pointermove", move)
        el.addEventListener("pointerleave", leave)
        cleanups.push(() => {
          el.removeEventListener("pointermove", move)
          el.removeEventListener("pointerleave", leave)
        })
      })

    const hero = document.querySelector<HTMLElement>(".hero")
    if (hero) {
      const move = (e: PointerEvent) => {
        const r = hero.getBoundingClientRect()
        hero.style.setProperty("--hx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
        hero.style.setProperty("--hy", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
      }
      hero.addEventListener("pointermove", move)
      cleanups.push(() => hero.removeEventListener("pointermove", move))
    }

    return () => cleanups.forEach((fn) => fn())
  }, [route])
}

export function useMotion(route = "home") {
  useScrollMotion(route)
  usePointerMotion(route)
}

/* ------------------------------------------------------------------ */
/* Cursor follower (ring grows on links, shows labels on [data-cursor]) */
/* ------------------------------------------------------------------ */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduced() || !finePointer()) return
    const d = dot.current!
    const r = ring.current!
    let x = -100,
      y = -100,
      cx = -100,
      cy = -100,
      raf = 0

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      d.style.transform = `translate3d(${x}px,${y}px,0)`
      d.classList.add("is-on")
      r.classList.add("is-on")
      const t = e.target as Element | null
      const tagged = t?.closest<HTMLElement>("[data-cursor]")
      const interactive = t?.closest("a, button, input, [data-tilt]")
      r.classList.toggle("is-link", !!interactive && !tagged)
      r.classList.toggle("is-label", !!tagged)
      d.classList.toggle("is-hidden", !!tagged || !!interactive)
      if (label.current) label.current.textContent = tagged?.dataset.cursor ?? ""
    }
    const onLeave = () => {
      d.classList.remove("is-on")
      r.classList.remove("is-on")
    }
    const onDown = () => r.classList.add("is-down")
    const onUp = () => r.classList.remove("is-down")
    const loop = () => {
      cx += (x - cx) * 0.17
      cy += (y - cy) * 0.17
      r.style.transform = `translate3d(${cx}px,${cy}px,0)`
      raf = requestAnimationFrame(loop)
    }
    loop()
    window.addEventListener("pointermove", onMove)
    document.addEventListener("pointerleave", onLeave)
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true">
        <span className="cursor-ring-inner">
          <span ref={label} />
        </span>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Count-up number that starts when scrolled into view                  */
/* ------------------------------------------------------------------ */
export function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\d+)(.*)$/)
  const target = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : ""
  const [n, setN] = useState(reduced() ? target : 0)
  const hasNumber = !!match
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!hasNumber || reduced()) return
    const el = ref.current!
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const dur = 1700
        const tick = (now: number) => {
          const t = clamp((now - start) / dur)
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
          setN(Math.round(target * eased))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target, hasNumber])

  return (
    <strong ref={ref} aria-label={value}>
      {n.toLocaleString("en-US")}
      {suffix}
    </strong>
  )
}

/* ------------------------------------------------------------------ */
/* Headline words that slide up out of a mask                           */
/* ------------------------------------------------------------------ */
export function SplitWords({
  text,
  start = 0,
  em = false,
}: {
  text: string
  start?: number
  em?: boolean
}) {
  const phrase = useCmsPhrase(text)
  const words = phrase.text.split(" ").map((w, i) => (
    <Fragment key={i}>
      <span className="word">
        <span style={{ ...phrase.style, "--i": start + i } as CSSProperties}>{w}</span>
      </span>{" "}
    </Fragment>
  ))
  return <span data-cms-field={phrase.id} style={phrase.style}>{em ? <em>{words}</em> : <>{words}</>}</span>
}

/* ------------------------------------------------------------------ */
/* Input with a typewriter placeholder                                  */
/* ------------------------------------------------------------------ */
export function TypedInput({
  id,
  value,
  onChange,
  phrases,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  phrases: string[]
}) {
  const [text, setText] = useState(phrases[0])

  useEffect(() => {
    if (reduced()) return
    let phrase = 0
    let chars = 0
    let deleting = false
    let timer = 0
    const step = () => {
      const full = phrases[phrase]
      chars += deleting ? -1 : 1
      setText(full.slice(0, chars))
      let wait = deleting ? 28 : 62
      if (!deleting && chars === full.length) {
        deleting = true
        wait = 1700
      } else if (deleting && chars === 0) {
        deleting = false
        phrase = (phrase + 1) % phrases.length
        wait = 350
      }
      timer = window.setTimeout(step, wait)
    }
    timer = window.setTimeout(step, 2400)
    return () => window.clearTimeout(timer)
  }, [phrases])

  return (
    <input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={text || "\u00a0"}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Typewriter text for placeholders (textareas, or anything that can    */
/* not use TypedInput). Pass `active = false` to freeze it.             */
/* ------------------------------------------------------------------ */
export function useTypedText(phrases: string[], active = true) {
  const [text, setText] = useState(phrases[0])
  useEffect(() => {
    if (reduced() || !active) {
      setText(phrases[0])
      return
    }
    let phrase = 0
    let chars = 0
    let deleting = false
    let timer = 0
    const step = () => {
      const full = phrases[phrase]
      chars += deleting ? -2 : 1
      chars = Math.max(0, chars)
      setText(full.slice(0, chars))
      let wait = deleting ? 18 : 42
      if (!deleting && chars === full.length) {
        deleting = true
        wait = 2200
      } else if (deleting && chars === 0) {
        deleting = false
        phrase = (phrase + 1) % phrases.length
        wait = 400
      }
      timer = window.setTimeout(step, wait)
    }
    timer = window.setTimeout(step, 2600)
    return () => window.clearTimeout(timer)
  }, [phrases, active])
  return text
}

/* ------------------------------------------------------------------ */
/* Animated wave divider (the "waterline" between sections)             */
/* ------------------------------------------------------------------ */
const WAVE =
  "M0 60 Q150 0 300 60 T600 60 T900 60 T1200 60 T1500 60 T1800 60 T2100 60 T2400 60"

export function WaveDivider({ from, to }: { from: string; to: string }) {
  return (
    <div className="wave" style={{ background: from }} aria-hidden="true">
      <svg className="wave-layer wave-layer--back" viewBox="0 0 2400 120" preserveAspectRatio="none">
        <path d={`${WAVE} V120 H0Z`} fill={to} opacity=".45" />
      </svg>
      <svg className="wave-layer wave-layer--front" viewBox="0 0 2400 120" preserveAspectRatio="none">
        <path d={`${WAVE} V120 H0Z`} fill={to} />
        <path d={WAVE} fill="none" stroke="var(--ink)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* In-view hook (once or live) and a count-up hook                      */
/* ------------------------------------------------------------------ */
export function useInView(
  ref: RefObject<Element | null>,
  { once = false, amount = 0.3 }: { once?: boolean; amount?: number } = {},
) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) io.disconnect()
      },
      { threshold: amount },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, once, amount])
  return inView
}

export function useCountUp(to: number, run: boolean, duration = 1400) {
  to = useCmsMetric(to)
  const [v, setV] = useState(typeof window === 'undefined' || reduced() ? to : 0)
  useEffect(() => {
    if (!run || reduced()) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = clamp((now - start) / duration)
      setV(Math.round(to * (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to, duration])
  return v
}

export const prefersReducedMotion = reduced
