import { CSSProperties, KeyboardEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowLeft, Bot, Check, Code2, Copy, Cpu, CornerDownLeft, Gamepad2, Glasses, Mail, Megaphone, MonitorSmartphone,
  Puzzle, Server, ShoppingCart, Smartphone, Sparkles as SparklesIcon, Workflow, type LucideIcon,
} from "lucide-react"
import { contactInfo } from "@/data/about"
import { offices } from "@/data/offices"
import { SplitWords } from "../../motion"
import { ArrowRight, ArrowUpRight, Sparkles } from "../ui"
import GlobalPresence from "../GlobalPresence"
import { Talk } from "../about/AboutPage"

/* ------------------------------------------------------------ question data */
const SCOPE: { label: string; Icon?: LucideIcon }[] = [
  { label: "AI Automations", Icon: Cpu },
  { label: "AI Agent Development", Icon: Bot },
  { label: "AI Model Integration", Icon: Workflow },
  { label: "Web Portals", Icon: MonitorSmartphone },
  { label: "Ecommerce", Icon: ShoppingCart },
  { label: "Mobile Apps", Icon: Smartphone },
  { label: "Game Development", Icon: Gamepad2 },
  { label: "AR/VR", Icon: Glasses },
  { label: "Digital Marketing", Icon: Megaphone },
  { label: "Custom Development", Icon: Code2 },
  { label: "Plugin Development", Icon: Puzzle },
  { label: "ERP Systems", Icon: Server },
  { label: "SaaS Product Development", Icon: SparklesIcon },
  { label: "Not sure yet" },
]

const STAGE = ["Just an idea", "I have a brief or spec", "Existing product needs work", "Something is broken, urgently"]
const BUDGET = ["Under $2,000", "$2,000 – $5,000", "$5,000 – $15,000", "$15,000 – $50,000", "$50,000+", "Not sure yet"]
const TIMELINE = ["As soon as possible", "Within a month", "In 1 – 3 months", "Just exploring"]

type Step = { id: string; pill: string; row: string; title: string; hint: string }
const STEPS: Step[] = [
  { id: "scope", pill: "Scope", row: "What", title: "What are we building?", hint: "Pick everything that applies." },
  { id: "stage", pill: "Stage", row: "Stage", title: "Where are you at?", hint: "Pick the one that fits best." },
  { id: "budget", pill: "Budget", row: "Budget", title: "What budget are you working with?", hint: "A rough range is fine. It helps us suggest the right approach." },
  { id: "timeline", pill: "Timeline", row: "Start", title: "When would you like to start?", hint: "Pick the one that fits best." },
  { id: "details", pill: "Details", row: "Details", title: "Anything we should know?", hint: "Optional. Links, goals, constraints, anything helpful." },
  { id: "contact", pill: "Contact", row: "Contact", title: "Where should we reply?", hint: "We answer within one business day." },
]

type Answers = {
  scope: string[]
  stage: string
  budget: string
  timeline: string
  details: string
  name: string
  email: string
  phone: string
  company: string
}
const EMPTY: Answers = { scope: [], stage: "", budget: "", timeline: "", details: "", name: "", email: "", phone: "", company: "" }
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* a step is "answered" when it has what we need; details is optional but counts once filled */
const answered = (a: Answers): boolean[] => [
  a.scope.length > 0,
  !!a.stage,
  !!a.budget,
  !!a.timeline,
  a.details.trim().length > 0,
  a.name.trim().length > 0 && EMAIL_OK.test(a.email.trim()),
]
const summary = (a: Answers): string[] => [
  a.scope.join(", "),
  a.stage,
  a.budget,
  a.timeline,
  a.details.trim(),
  a.name.trim() ? `${a.name.trim()}${a.email.trim() ? ` · ${a.email.trim()}` : ""}` : "",
]

function briefText(a: Answers) {
  return [
    `New project brief`,
    ``,
    `Scope: ${a.scope.join(", ") || "-"}`,
    `Stage: ${a.stage || "-"}`,
    `Budget: ${a.budget || "-"}`,
    `Start: ${a.timeline || "-"}`,
    `Details: ${a.details.trim() || "-"}`,
    ``,
    `Name: ${a.name.trim()}`,
    `Email: ${a.email.trim()}`,
    `Phone / WhatsApp: ${a.phone.trim() || "-"}`,
    `Company: ${a.company.trim() || "-"}`,
  ].join("\n")
}

/* ---------------------------------------------------------------- hero */
function StartHero() {
  // on a fresh page load the intro curtain is still covering the page, so wait for it
  const [intro] = useState(() => (performance.now() < 2500 ? ".95s" : ".1s"))
  return (
    <section className="about-hero start-hero" style={{ "--intro": intro } as CSSProperties}>
      <div className="hero-blob hero-blob--one" data-parallax="0.14" />
      <div className="about-hero-inner start-hero-inner">
        <h1 aria-label="Start a project">
          <span aria-hidden="true">
            <SplitWords text="Start a" />
            <SplitWords text="project" start={2} em />
          </span>
        </h1>
        <p className="about-lede">Answer a few quick questions and we&apos;ll get back to you within one business day.</p>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- option */
function Option({ selected, onClick, multi, children }: { selected: boolean; onClick: () => void; multi?: boolean; children: ReactNode }) {
  return (
    <button type="button" className={selected ? "opt is-selected" : "opt"} onClick={onClick} role={multi ? "checkbox" : "radio"} aria-checked={selected}>
      {children}
      <i aria-hidden="true">{selected && <Check size={13} strokeWidth={3} />}</i>
    </button>
  )
}

/* ---------------------------------------------------------------- wizard */
function Wizard() {
  const [a, setA] = useState<Answers>(EMPTY)
  const [step, setStep] = useState(0)
  const [maxStep, setMaxStep] = useState(0)
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tried, setTried] = useState(false)
  const panel = useRef<HTMLDivElement>(null)

  const ok = useMemo(() => answered(a), [a])
  const sum = useMemo(() => summary(a), [a])
  const count = ok.filter(Boolean).length
  const last = step === STEPS.length - 1
  const canContinue = step === 4 ? true : ok[step]

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((p) => ({ ...p, [k]: v }))
  const toggleScope = (label: string) =>
    setA((p) => {
      if (label === "Not sure yet") return { ...p, scope: p.scope.includes(label) ? [] : [label] }
      const rest = p.scope.filter((s) => s !== "Not sure yet")
      return { ...p, scope: rest.includes(label) ? rest.filter((s) => s !== label) : [...rest, label] }
    })

  const go = (i: number) => {
    setStep(i)
    setMaxStep((m) => Math.max(m, i))
    setTried(false)
  }
  const next = () => {
    if (!canContinue) {
      setTried(true)
      return
    }
    if (last) {
      setDone(true)
      window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(`Project enquiry: ${a.scope.join(", ")}`)}&body=${encodeURIComponent(briefText(a))}`
      return
    }
    // single-choice answers move on by themselves, so keep the focus predictable
    go(step + 1)
  }

  // Enter continues, except inside the textarea
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" || e.shiftKey) return
    if ((e.target as HTMLElement).tagName === "TEXTAREA") return
    e.preventDefault()
    next()
  }

  // bring the question into view on small screens when the step changes
  useEffect(() => {
    if (step === 0 && !maxStep) return
    if (window.innerWidth < 900) panel.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(briefText(a))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked: nothing to do */
    }
  }

  const S = STEPS[step]
  const emailBad = tried && step === 5 && !EMAIL_OK.test(a.email.trim())
  const nameBad = tried && step === 5 && !a.name.trim()

  return (
    <section className="start" id="start">
      <div className="start-grid">
        {/* ------------------------------------------------ brief summary */}
        <aside className="brief" aria-label="Your brief">
          <header>
            <h2>Your brief</h2>
            <span>
              <b>{count}</b> of {STEPS.length} answered
            </span>
          </header>
          <div className="brief-bar" aria-hidden="true">
            <i style={{ transform: `scaleX(${count / STEPS.length})` }} />
          </div>
          <dl>
            {STEPS.map((s, i) => (
              <div key={s.id} className={`${i === step && !done ? "is-current" : ""}${ok[i] ? " is-done" : ""}`}>
                <dt>{s.row}</dt>
                <dd>
                  <button type="button" onClick={() => (i <= maxStep || ok[i - 1] ? go(i) : undefined)} disabled={!(i <= maxStep || ok[i - 1])}>
                    {sum[i] ? <span key={sum[i]}>{sum[i]}</span> : <em>Not answered yet</em>}
                  </button>
                </dd>
              </div>
            ))}
          </dl>
        </aside>

        {/* ------------------------------------------------ question panel */}
        <div className="wizard" ref={panel} onKeyDown={onKey}>
          {done ? (
            <div className="start-done" role="status">
              <span className="start-done-badge">
                <Check size={34} strokeWidth={3} />
              </span>
              <h2>
                Thanks{a.name.trim() ? `, ${a.name.trim().split(" ")[0]}` : ""}. <em>Brief ready.</em>
              </h2>
              <p>
                Your email app should have opened with your brief filled in. Press send and we&apos;ll reply within one business day. If nothing opened, copy it
                and email <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>.
              </p>
              <div className="start-done-actions">
                <button type="button" className="button-3d button-3d--mint" onClick={copy}>
                  {copied ? (
                    <>
                      Copied <Check size={16} />
                    </>
                  ) : (
                    <>
                      Copy my brief <Copy size={16} />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    setDone(false)
                    setStep(0)
                  }}
                >
                  Edit my answers
                </button>
              </div>
              <Sparkles className="start-done-spark" size={28} />
            </div>
          ) : (
            <>
              <ol className="steps" aria-label="Steps">
                {STEPS.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={`step-pill${i === step ? " is-current" : ""}${i < step || ok[i] ? " is-done" : ""}`}
                      aria-current={i === step ? "step" : undefined}
                      disabled={i > maxStep && !ok[i - 1]}
                      onClick={() => go(i)}
                    >
                      <b>{i + 1}</b> {s.pill}
                    </button>
                  </li>
                ))}
              </ol>

              <div className="question" key={S.id}>
                <h2>{S.title}</h2>
                <p className="question-hint">{S.hint}</p>

                {step === 0 && (
                  <div className="opts" role="group" aria-label={S.title}>
                    {SCOPE.map(({ label, Icon }, i) => (
                      <div key={label} style={{ "--i": i } as CSSProperties}>
                        <Option selected={a.scope.includes(label)} onClick={() => toggleScope(label)} multi>
                          {Icon ? <Icon size={18} aria-hidden /> : <span className="opt-q">?</span>}
                          <span>{label}</span>
                        </Option>
                      </div>
                    ))}
                  </div>
                )}

                {step >= 1 && step <= 3 && (
                  <div className="opts opts--2" role="radiogroup" aria-label={S.title}>
                    {(step === 1 ? STAGE : step === 2 ? BUDGET : TIMELINE).map((label, i) => {
                      const key = step === 1 ? "stage" : step === 2 ? "budget" : "timeline"
                      return (
                        <div key={label} style={{ "--i": i } as CSSProperties}>
                          <Option selected={a[key] === label} onClick={() => set(key, label)}>
                            <span>{label}</span>
                          </Option>
                        </div>
                      )
                    })}
                  </div>
                )}

                {step === 4 && (
                  <label className="field">
                    <span className="sr-only">Project details</span>
                    <textarea
                      rows={6}
                      value={a.details}
                      onChange={(e) => set("details", e.target.value)}
                      placeholder="What are you trying to achieve? Any links, competitors or deadlines?"
                      autoFocus
                    />
                  </label>
                )}

                {step === 5 && (
                  <div className="fields">
                    <label className={nameBad ? "field has-error" : "field"}>
                      <span>Your name</span>
                      <input value={a.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" autoFocus />
                      {nameBad && <small>Please tell us your name.</small>}
                    </label>
                    <label className={emailBad ? "field has-error" : "field"}>
                      <span>Email</span>
                      <input type="email" value={a.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
                      {emailBad && <small>Please enter a valid email.</small>}
                    </label>
                    <label className="field">
                      <span>Phone / WhatsApp (optional)</span>
                      <input value={a.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
                    </label>
                    <label className="field">
                      <span>Company (optional)</span>
                      <input value={a.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />
                    </label>
                  </div>
                )}
              </div>

              <div className="wizard-actions">
                {step > 0 && (
                  <button type="button" className="wizard-back" onClick={() => go(step - 1)} aria-label="Back">
                    <ArrowLeft size={18} />
                  </button>
                )}
                <button type="button" className={canContinue ? "button-3d button-3d--mint" : "button-3d button-3d--mint is-disabled"} onClick={next} aria-disabled={!canContinue}>
                  {last ? "Send my brief" : step === 4 && !a.details.trim() ? "Skip" : "Continue"}
                  <kbd aria-hidden="true">
                    <CornerDownLeft size={12} />
                  </kbd>
                </button>
                {tried && !canContinue && <span className="wizard-warn">{step === 5 ? "Add your name and a valid email to send." : "Pick an answer to continue."}</span>}
              </div>
            </>
          )}
        </div>
      </div>

      <p className="start-foot">
        <span>
          Prefer email? <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
        </span>
        <i aria-hidden="true">·</i>
        <span>
          Rather pick from a menu?{" "}
          <a href="/services#proposal">
            Prepare your own proposal <ArrowRight size={13} />
          </a>
        </span>
        <i aria-hidden="true">·</i>
        <span>{offices.map((o) => o.city).join(" / ")}</span>
      </p>
    </section>
  )
}

export default function StartPage() {
  return (
    <>
      <StartHero />
      <Wizard />
      <GlobalPresence talk={<Talk />} />
    </>
  )
}
