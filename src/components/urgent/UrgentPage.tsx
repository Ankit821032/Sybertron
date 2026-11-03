import { CSSProperties, FormEvent, useEffect, useMemo, useRef, useState } from "react"
import {
  Ban,
  Check,
  Copy,
  CreditCard,
  Flame,
  Gauge,
  Ghost,
  Lock,
  Mail,
  MessageCircle,
  Plus,
  Server,
  ShieldAlert,
  Siren,
  Smartphone,
  TrendingDown,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"
import { contactInfo } from "@/data/about"
import { SplitWords, WaveDivider, prefersReducedMotion, useTypedText } from "../../motion"
import { ArrowUpRight, SectionHeading, Sparkles } from "../ui"
import GlobalPresence from "../GlobalPresence"
import { Talk } from "../about/AboutPage"

/* ------------------------------------------------------------------ data */
type Scope = "Tech" | "Marketing" | "Both / not sure"
type Problem = { Icon: LucideIcon; title: string; text: string; scope: Scope }

const TECH: Problem[] = [
  { Icon: Server, title: "Site or app is down", text: "Outages, server errors, failed deployments and expired domains or SSL.", scope: "Tech" },
  { Icon: ShieldAlert, title: "Hacked or infected site", text: "Malware, spam injections, defacement and suspicious admin accounts.", scope: "Tech" },
  { Icon: Smartphone, title: "App crashing or rejected", text: "Crash loops after an update, broken builds, App Store or Play rejections.", scope: "Tech" },
  { Icon: CreditCard, title: "Checkout or payments failing", text: "Orders not going through, payment gateway errors, broken carts.", scope: "Tech" },
  { Icon: Gauge, title: "Slow or unstable system", text: "Pages timing out, database overload, an ERP or portal that can't keep up.", scope: "Tech" },
  { Icon: Ghost, title: "Stalled project or missing vendor", text: "Your developer disappeared, the code is a mystery, the deadline isn't.", scope: "Tech" },
]

const MARKETING: Problem[] = [
  { Icon: Ban, title: "Ad account suspended", text: "Meta or Google ads disabled, rejected campaigns, policy flags.", scope: "Marketing" },
  { Icon: TrendingDown, title: "Traffic or sales dropped", text: "Sudden ranking loss, a broken funnel or campaigns that stopped converting.", scope: "Marketing" },
  { Icon: Lock, title: "Social account locked or hacked", text: "Lost access to pages, profiles or business manager.", scope: "Marketing" },
  { Icon: Flame, title: "Reputation under fire", text: "A wave of bad reviews or a post that went the wrong kind of viral.", scope: "Marketing" },
  { Icon: TriangleAlert, title: "Launch going wrong", text: "A product or campaign launch that isn't landing, with no time to start over.", scope: "Marketing" },
]

const TECH_TONES = ["pink", "blue", "lilac", "yellow", "mint", "pink"]
const MARKETING_TONES = ["yellow", "mint", "lilac", "pink", "blue"]

const LADDER = [
  { t: "Triage", s: "We find out what's wrong", tone: "coral" },
  { t: "Stabilise", s: "Stop the damage", tone: "yellow" },
  { t: "Fix", s: "Repair the root cause", tone: "mint" },
  { t: "Prevent", s: "Make sure it stays fixed", tone: "lilac" },
]

const STEPS = [
  { n: "01", t: "Triage", p: "Tell us what's wrong. We look at it first and tell you honestly how serious it is." },
  { n: "02", t: "Stabilise", p: "Stop the damage: restore service, secure accounts, pause what's bleeding money." },
  { n: "03", t: "Fix", p: "Find the root cause and repair it properly, not with tape." },
  { n: "04", t: "Prevent", p: "Monitoring, backups, access hygiene and a plan so it doesn't happen again." },
]

const SCOPES: Scope[] = ["Tech", "Marketing", "Both / not sure"]
const URGENCY = [
  { label: "It's down right now", tone: "coral" },
  { label: "Hurting the business", tone: "yellow" },
  { label: "Needs attention soon", tone: "mint" },
]

const PLACEHOLDERS = [
  "Our checkout stopped taking payments this morning after a plugin update…",
  "Our Meta ad account was disabled and every campaign has stopped…",
  "The site is showing spam pages and Google says it's unsafe…",
  "Our app crashes on launch since the last release…",
]

const CODES = [
  { code: "+91", label: "IN +91" },
  { code: "+1", label: "US +1" },
  { code: "+44", label: "UK +44" },
  { code: "+971", label: "AE +971" },
  { code: "+966", label: "SA +966" },
  { code: "+92", label: "PK +92" },
]

/* the phone prefix starts on the visitor's own country, using their time zone */
function guessCode() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz.startsWith("America/")) return "+1"
    if (tz === "Europe/London") return "+44"
    if (tz === "Asia/Dubai") return "+971"
    if (tz === "Asia/Riyadh") return "+966"
    if (tz === "Asia/Karachi") return "+92"
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return "+91"
  } catch {
    /* fall through to the default */
  }
  return "+91"
}

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
type Prefill = { n: number; scope: Scope; issue: string }

const scrollToRequest = () => document.getElementById("request")?.scrollIntoView({ behavior: "smooth", block: "start" })

/* ---------------------------------------------------------------- hero */
function Ladder() {
  const [i, setI] = useState(0)
  const [hold, setHold] = useState(false)

  useEffect(() => {
    if (hold || prefersReducedMotion()) return
    const id = setInterval(() => setI((n) => (n + 1) % LADDER.length), 2300)
    return () => clearInterval(id)
  }, [hold])

  return (
    <aside
      className="ladder"
      aria-label="How a rescue unfolds"
      data-tilt
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      style={{ "--p": i / (LADDER.length - 1) } as CSSProperties}
    >
      <div className="ladder-sticker" data-parallax="0.06">
        <Siren size={16} aria-hidden /> Breathe. We&apos;ve got this.
      </div>
      <header className="ladder-head">
        <span>
          <i aria-hidden="true" /> Rescue plan
        </span>
        <b aria-hidden="true">
          0{i + 1}
          <small>/04</small>
        </b>
      </header>
      <div className="ladder-body">
        <span className="ladder-rail" aria-hidden="true">
          <i />
        </span>
        <ol>
          {LADDER.map((s, n) => (
            <li
              key={s.t}
              className={`${n === i ? "is-active" : ""}${n < i ? " is-past" : ""}`}
              style={{ "--tone": `var(--${s.tone})` } as CSSProperties}
            >
              <span className="ladder-node" aria-hidden="true" />
              <button type="button" aria-current={n === i ? "step" : undefined} onClick={() => setI(n)}>
                <b>{s.t}</b>
                <small>{s.s}</small>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  )
}

function UrgentHero() {
  // on a fresh page load the intro curtain is still covering the page, so wait for it
  const [intro] = useState(() => (performance.now() < 2500 ? ".95s" : ".1s"))
  return (
    <section className="about-hero urgent-hero" style={{ "--intro": intro } as CSSProperties}>
      <div className="hero-blob hero-blob--one" data-parallax="0.14" />
      <div className="hero-blob hero-blob--two" data-parallax="-0.1" />
      <div className="about-hero-inner urgent-hero-inner">
        <div className="urgent-hero-copy">
          <p className="eyebrow">
            <span /> Crisis support · tech and marketing
          </p>
          <h1 aria-label="Need rapid response for your tech or marketing?">
            <span aria-hidden="true">
              <SplitWords text="Need rapid" />
              <br />
              <SplitWords text="response for" start={2} />
              <br />
              <SplitWords text="your tech or" start={5} />
              <br />
              <SplitWords text="marketing?" start={8} em />
            </span>
          </h1>
          <p className="about-lede">
            Facing an issue with your website, app, systems or marketing? Consult us. We&apos;ll help you stop the damage, fix the cause and get back to
            business.
          </p>
          <div className="urgent-actions">
            <a className="button-3d button-3d--coral" href="#request">
              <i className="btn-dot" aria-hidden="true" /> RAPID RESPONSE
            </a>
            <a className="button-3d button-3d--paper" href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={17} aria-hidden /> WhatsApp us
            </a>
          </div>
        </div>
        <Ladder />
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- problems */
function ProblemGrid({
  items,
  tones,
  onPick,
  extra,
}: {
  items: Problem[]
  tones: string[]
  onPick: (p: Problem) => void
  extra?: boolean
}) {
  return (
    <div className="prob-grid rv-stagger" data-reveal>
      {items.map((p, index) => (
        <button
          type="button"
          key={p.title}
          className={`prob prob--${tones[index % tones.length]}`}
          style={{ "--stagger": index } as CSSProperties}
          onClick={() => onPick(p)}
          data-tilt
          data-cursor="Help"
        >
          <span className="prob-top">
            <span className="icon-bubble">
              <p.Icon size={20} aria-hidden />
            </span>
            <small aria-hidden="true">{String(index + 1).padStart(2, "0")}</small>
          </span>
          <span className="prob-text">
            <strong>{p.title}</strong>
            <span>{p.text}</span>
          </span>
          <span className="card-arrow" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </button>
      ))}
      {extra && (
        <button
          type="button"
          className="prob prob--else"
          style={{ "--stagger": items.length } as CSSProperties}
          onClick={() => onPick({ Icon: Plus, title: "Something else", text: "", scope: "Both / not sure" })}
          data-tilt
          data-cursor="Tell us"
        >
          <span className="prob-top">
            <span className="icon-bubble">
              <Plus size={20} aria-hidden />
            </span>
          </span>
          <span className="prob-text">
            <strong>
              Not on the list? <em>Tell us.</em>
            </strong>
            <span>If it&apos;s urgent and it&apos;s tech or marketing, it&apos;s ours to fix.</span>
          </span>
          <span className="card-arrow" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </button>
      )}
    </div>
  )
}

function Problems({ onPick }: { onPick: (p: Problem) => void }) {
  return (
    <>
      <WaveDivider from="#faf8f1" to="#fffef9" />
      <section className="section prob-band" id="problems">
        <div className="prob-block" id="tech-problems">
          <SectionHeading
            eyebrow="Tech"
            title="Tech"
            em="problems."
            copy="Websites, apps, servers, ERPs and the code nobody wants to touch."
          />
          <ProblemGrid items={TECH} tones={TECH_TONES} onPick={onPick} />
        </div>
        <div className="prob-block" id="marketing-problems">
          <SectionHeading
            eyebrow="Marketing"
            title="Marketing"
            em="problems."
            copy="Ads, search, social and reputation, back under control."
          />
          <ProblemGrid items={MARKETING} tones={MARKETING_TONES} onPick={onPick} extra />
        </div>
      </section>
      <WaveDivider from="#fffef9" to="#faf8f1" />
    </>
  )
}

/* ---------------------------------------------------------------- how we help */
function HowWeHelp() {
  return (
    <section className="section urgent-how" id="how-we-help">
      <SectionHeading eyebrow="How we help" title="How we" em="help." copy="Four steps, in this order, so the panic comes down before the invoice goes up." />
      <div className="process-steps urgent-steps" data-reveal>
        <span className="urgent-runner" aria-hidden="true" />
        {STEPS.map(({ n, t, p }, index) => (
          <article key={t} style={{ "--stagger": index } as CSSProperties}>
            <span>{n}</span>
            <h3>{t}</h3>
            <p>{p}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- request form */
function Chip({ on, tone = "ink", onClick, children }: { on: boolean; tone?: string; onClick: () => void; children: string }) {
  return (
    <button type="button" role="radio" aria-checked={on} className={`chip chip--${tone}${on ? " is-on" : ""}`} onClick={onClick}>
      {children}
    </button>
  )
}

function RequestForm({ prefill }: { prefill: Prefill }) {
  const [scope, setScope] = useState<Scope>("Tech")
  const [urgency, setUrgency] = useState(URGENCY[0].label)
  const [msg, setMsg] = useState("")
  const [name, setName] = useState("")
  const [code, setCode] = useState(guessCode)
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [tried, setTried] = useState(false)
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)
  const [typing, setTyping] = useState(true)
  const area = useRef<HTMLTextAreaElement>(null)
  const lastPrefill = useRef("")
  const placeholder = useTypedText(PLACEHOLDERS, typing && !msg)

  // a problem card above fills in the form for the visitor
  useEffect(() => {
    if (!prefill.n) return
    setScope(prefill.scope)
    setDone(false)
    if (prefill.issue) {
      // only replace text we wrote ourselves; never clobber what the visitor typed
      const prev = lastPrefill.current
      const next = `${prefill.issue}: `
      setMsg((m) => (!m.trim() || m === prev ? next : m))
      lastPrefill.current = next
    }
    const id = window.setTimeout(() => {
      const el = area.current
      if (!el) return
      el.focus({ preventScroll: true })
      el.setSelectionRange(el.value.length, el.value.length)
    }, 700)
    return () => window.clearTimeout(id)
  }, [prefill.n]) // eslint-disable-line react-hooks/exhaustive-deps

  const bad = useMemo(
    () => ({
      msg: msg.trim().length < 5,
      name: !name.trim(),
      phone: phone.replace(/\D/g, "").length < 6,
      email: !EMAIL_OK.test(email.trim()),
    }),
    [msg, name, phone, email],
  )
  const invalid = bad.msg || bad.name || bad.phone || bad.email

  const text = () =>
    [
      `URGENT REQUEST (${urgency})`,
      ``,
      `Problem area: ${scope}`,
      `What's happening: ${msg.trim()}`,
      ``,
      `Name: ${name.trim()}`,
      `Call back: ${code} ${phone.trim()}`,
      `Email: ${email.trim()}`,
      `Company / website: ${company.trim() || "-"}`,
    ].join("\n")

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (invalid) return
    setDone(true)
    window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(`URGENT: ${scope} (${urgency})`)}&body=${encodeURIComponent(text())}`
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked: nothing to do */
    }
  }

  const err = (k: keyof typeof bad) => (tried && bad[k] ? "field has-error" : "field")

  if (done)
    return (
      <div className="request-done" role="status">
        <span className="start-done-badge">
          <Check size={34} strokeWidth={3} />
        </span>
        <h3>
          Thanks{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}. <em>Request ready.</em>
        </h3>
        <p>
          Your email app should have opened with your urgent request filled in. Press send and we&apos;ll pick it up. For the fastest reply, message us on
          WhatsApp too. If nothing opened, copy it and email <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>.
        </p>
        <div className="start-done-actions">
          <a className="button-3d button-3d--coral" href={`${contactInfo.whatsapp}?text=${encodeURIComponent(text())}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={17} aria-hidden /> Send on WhatsApp
          </a>
          <button type="button" className="button-3d button-3d--paper" onClick={copy}>
            {copied ? (
              <>
                Copied <Check size={16} />
              </>
            ) : (
              <>
                Copy request <Copy size={16} />
              </>
            )}
          </button>
          <button type="button" className="text-link" onClick={() => setDone(false)}>
            Edit my answers
          </button>
        </div>
        <Sparkles className="start-done-spark" size={28} />
      </div>
    )

  return (
    <form className="request-form" onSubmit={submit} noValidate>
      <fieldset>
        <legend>Where&apos;s the problem?</legend>
        <div className="chips" role="radiogroup" aria-label="Where's the problem?">
          {SCOPES.map((s) => (
            <Chip key={s} on={scope === s} onClick={() => setScope(s)}>
              {s}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>How urgent?</legend>
        <div className="chips" role="radiogroup" aria-label="How urgent?">
          {URGENCY.map((u) => (
            <Chip key={u.label} on={urgency === u.label} tone={u.tone} onClick={() => setUrgency(u.label)}>
              {u.label}
            </Chip>
          ))}
        </div>
      </fieldset>

      <label className={err("msg")}>
        <span>What&apos;s happening? *</span>
        <textarea
          ref={area}
          rows={4}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onFocus={() => setTyping(false)}
          onBlur={() => setTyping(true)}
          placeholder={placeholder || "\u00a0"}
        />
        {tried && bad.msg && <small>Tell us a little about what's going wrong.</small>}
      </label>

      <div className="fields">
        <label className={err("name")}>
          <span>Your name *</span>
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          {tried && bad.name && <small>Please tell us your name.</small>}
        </label>
        <div className={err("phone")}>
          <label className="field-label" htmlFor="urgent-phone">
            Phone (for a call back) *
          </label>
          <div className="phone">
            <select value={code} onChange={(e) => setCode(e.target.value)} aria-label="Country code">
              {CODES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <input id="urgent-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel-national" placeholder="300 1234567" />
          </div>
          {tried && bad.phone && <small>Add a number we can call back.</small>}
        </div>
        <label className={err("email")}>
          <span>Email *</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          {tried && bad.email && <small>Please enter a valid email.</small>}
        </label>
        <label className="field">
          <span>Company / website</span>
          <input value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" />
        </label>
      </div>

      <div className="request-actions">
        <button type="submit" className="button-3d button-3d--coral">
          <i className="btn-dot" aria-hidden="true" /> Send urgent request
        </button>
        {tried && invalid && <span className="wizard-warn">Fill in the starred fields to send.</span>}
      </div>
    </form>
  )
}

function Request({ prefill }: { prefill: Prefill }) {
  return (
    <section className="section urgent-request" id="request" aria-labelledby="request-title">
      <div className="request-card" data-reveal="scale">
        <div className="request-intro">
          <p className="eyebrow">
            <span /> Urgent request
          </p>
          <h2 id="request-title">
            Tell us <em>what&apos;s wrong.</em>
          </h2>
          <p className="request-copy">Urgent requests jump the queue. A short description is enough; we&apos;ll ask the rest when we call.</p>

          <p className="request-or">Or reach us directly</p>
          <ul className="direct">
            <li>
              <a className="direct-card" href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer">
                <span className="direct-ico direct-ico--wa">
                  <MessageCircle size={19} aria-hidden />
                </span>
                <span>
                  <small>WhatsApp</small>
                  <b>Chat with us now</b>
                </span>
                <ArrowUpRight className="direct-go" size={18} aria-hidden />
              </a>
            </li>
            <li>
              <a className="direct-card" href={`mailto:${contactInfo.email}`}>
                <span className="direct-ico">
                  <Mail size={19} aria-hidden />
                </span>
                <span>
                  <small>Email</small>
                  <b>{contactInfo.email}</b>
                </span>
                <ArrowUpRight className="direct-go" size={18} aria-hidden />
              </a>
            </li>
          </ul>
        </div>
        <RequestForm prefill={prefill} />
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- page */
export default function UrgentPage() {
  const [prefill, setPrefill] = useState<Prefill>({ n: 0, scope: "Tech", issue: "" })

  const pick = (p: Problem) => {
    setPrefill((x) => ({ n: x.n + 1, scope: p.scope, issue: p.text ? p.title : "" }))
    scrollToRequest()
  }

  return (
    <>
      <UrgentHero />
      <Problems onPick={pick} />
      <HowWeHelp />
      <Request prefill={prefill} />
      <GlobalPresence talk={<Talk />} urgentHref="#request" />
    </>
  )
}
