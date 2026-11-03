import { CSSProperties, useEffect, useRef, useState } from "react"
import {
  BadgeCheck,
  Check,
  FlaskConical,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react"
import { stats } from "@/data/company"
import { prefersReducedMotion, useInView } from "../motion"
import { ArrowRight, Button3D, SectionHeading } from "./ui"

const CARDS = [
  {
    Icon: BadgeCheck,
    title: "Expertise and experience",
    text: `Project managers, analysts, designers, developers and QA engineers who have shipped more than ${stats[0].value.toLocaleString("en-US")} projects together.`,
  },
  {
    Icon: FlaskConical,
    title: "New technology, tested first",
    text: "We try new tools on our own products before we suggest them to you, so you only pay for what has proved itself.",
  },
  {
    Icon: SlidersHorizontal,
    title: "Built around your business",
    text: "We start by learning how your business runs, then build to fit it, rather than squeezing you into a template.",
  },
  {
    Icon: ShieldCheck,
    title: "Reliable support",
    text: "Many of our clients have been with us for years. We look after their sites and apps after launch and fix problems before they cost money.",
  },
]

const MENU = [
  { c: "Starters", n: "Logo & brand kit" },
  { c: "Starters", n: "Social media pages" },
  { c: "Mains", n: "Business website" },
  { c: "Mains", n: "Online store" },
  { c: "Sides", n: "Mobile app" },
  { c: "Desserts", n: "SEO" },
]
// items the menu ticks by itself until the visitor takes over
const DEMO_ORDER = [2, 3, 0, 4]

export function Proposal() {
  const sheet = useRef<HTMLDivElement>(null)
  const inView = useInView(sheet, { once: true, amount: 0.35 })
  const [picked, setPicked] = useState<number[]>([])
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!inView || !auto || prefersReducedMotion()) return
    const id = setInterval(
      () =>
        setPicked((p) =>
          p.length >= DEMO_ORDER.length ? [] : [...p, DEMO_ORDER[p.length]],
        ),
      1400,
    )
    return () => clearInterval(id)
  }, [inView, auto])

  const toggle = (i: number) => {
    setAuto(false)
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))
  }

  return (
    <section className="proposal" id="proposal">
      <div className="proposal-copy" data-reveal="left">
        <p className="eyebrow">
          <span /> Build your project
        </p>
        <h2>
          Prepare
          <br />
          your own
          <br />
          <em>proposal.</em>
        </h2>
        <p>
          Our services, laid out like a restaurant menu: starters like a logo
          or social pages, a website or app for your main, then sides, dessert
          and coffee. Tap a few dishes to start your order, and we&apos;ll
          draft a detailed proposal with a timeline and an estimated cost in
          about a minute.
        </p>
        <div className="proposal-cta">
          <Button3D href="/start" tone="mint">
            Open the full menu <ArrowRight size={17} />
          </Button3D>
          <span>Free · no sign-up</span>
        </div>
        <div className="proposal-total">
          <span>Your selection</span>
          <strong>
            {picked.length} {picked.length === 1 ? "course" : "courses"}
          </strong>
        </div>
      </div>

      <div className="menu-wrap" data-reveal="right" ref={sheet}>
        <div className="menu-sheet">
          <div className="menu-heading">
            <span>Sybertron Technologies</span>
            <b>Tonight&apos;s menu</b>
            <small>Tap to order</small>
          </div>
          {MENU.map(({ c, n }, index) => {
            const selected = picked.includes(index)
            return (
              <button
                type="button"
                className={selected ? "menu-item is-selected" : "menu-item"}
                key={n}
                aria-pressed={selected}
                onClick={() => toggle(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <b>{n}</b>
                  <small>{c}</small>
                </span>
                <i>{selected ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}</i>
              </button>
            )
          })}
          <div className="menu-footer">Made fresh for every project</div>
        </div>

        <div className="receipt">
          <div className="receipt-head">
            <span>Your order</span>
            <span>
              {picked.length} {picked.length === 1 ? "item" : "items"}
            </span>
          </div>
          <ul>
            {picked.length === 0 && <li className="empty">Nothing yet. Tap a dish.</li>}
            {picked.map((i) => (
              <li key={i}>
                <Check size={11} strokeWidth={3} /> {MENU[i].n}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function Process() {
  return (
    <>
      <section className="section process" id="how-we-work">
        <SectionHeading
          className="process-heading"
          eyebrow="How we work"
          title="Good work needs"
          em="good chemistry."
          copy="What you can expect on every project, whatever its size."
        />
        <div className="process-steps" data-reveal>
          {CARDS.map(({ Icon, title, text }, index) => (
            <article key={title} style={{ "--stagger": index } as CSSProperties}>
              <span>
                <Icon size={18} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <Proposal />
    </>
  )
}
