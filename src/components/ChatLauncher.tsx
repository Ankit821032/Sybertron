import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import { ArrowUpRight, Bot, RotateCcw, Send, X } from "lucide-react"
import { contactInfo } from "@/data/about"
import { FIRST_CHIPS, fallbackReply, reply, type Bot as BotReply, type Ctx, type Link } from "../chat/engine"
import { navigate } from "../router"
import "../chat.css"

/* Floating "Talk to us" button and chat window, bottom right.
   Answers come from the site's own data (see chat/engine.ts). Optional back ends:
   VITE_CHAT_ENDPOINT  POST { messages: [{ role, content }] } -> { reply: string }   (AI answers for unmatched questions)
   VITE_LEAD_ENDPOINT  POST { name, email, need, details, page }                     (delivers project enquiries) */
const CHAT_URL = import.meta.env?.VITE_CHAT_ENDPOINT as string | undefined
const LEAD_URL = import.meta.env?.VITE_LEAD_ENDPOINT as string | undefined
const KEY = "syb-chat-v1"

type Msg = { id: number; role: "bot" | "user"; text: string; links?: Link[]; chips?: string[] }
type Step = "name" | "email" | "need" | "details"
type Lead = { step: Step; name: string; email: string; need: string; details: string }
type Saved = { msgs: Msg[]; lead: Lead | null; ctx: Ctx; open: boolean }

const GREETING: Omit<Msg, "id"> = {
  role: "bot",
  text: "Hi, I'm the Sybertron assistant. Ask me about our services, products, offices or jobs, or tell me about your project and I'll pass it to the team.",
  chips: FIRST_CHIPS,
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const NEEDS = ["Website or portal", "Mobile app", "AI automation", "Ecommerce store", "ERP or SaaS", "Something else"]

function load(): Saved | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Saved) : null
  } catch {
    return null
  }
}

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced() ? 80 : ms))

export default function ChatLauncher() {
  const saved = useRef(load()).current
  const [open, setOpen] = useState(saved?.open ?? false)
  const [msgs, setMsgs] = useState<Msg[]>(saved?.msgs ?? [{ id: 0, ...GREETING }])
  const [lead, setLead] = useState<Lead | null>(saved?.lead ?? null)
  const [ctx, setCtx] = useState<Ctx>(saved?.ctx ?? {})
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState("")
  const nextId = useRef(Math.max(0, ...(saved?.msgs ?? []).map((m) => m.id)) + 1)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const busy = useRef(false)

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ msgs, lead, ctx, open } satisfies Saved))
    } catch {
      /* storage can be blocked; the chat still works for this page view */
    }
  }, [msgs, lead, ctx, open])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced() ? "auto" : "smooth" })
  }, [msgs, typing, open])

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const push = useCallback((m: Omit<Msg, "id">) => setMsgs((list) => [...list, { ...m, id: nextId.current++ }]), [])

  /* the bot "types" for a moment, so replies don't snap in all at once */
  const say = useCallback(
    async (b: BotReply | Omit<Msg, "id" | "role">) => {
      setTyping(true)
      await wait(420 + Math.min(700, b.text.length * 3))
      setTyping(false)
      push({ role: "bot", text: b.text, links: b.links, chips: b.chips })
    },
    [push],
  )

  const startLead = useCallback(
    async (need?: string) => {
      const l: Lead = { step: "name", name: "", email: "", need: need ?? "", details: "", }
      setLead(l)
      await say({ text: "First, what's your name?", chips: ["Cancel"] })
    },
    [say],
  )

  const finishLead = useCallback(
    async (l: Lead) => {
      setLead(null)
      const page = location.pathname
      const summary = `New project enquiry\nName: ${l.name}\nEmail: ${l.email}\nNeed: ${l.need}\nDetails: ${l.details || "(none)"}\nSent from: ${location.origin}${page}`
      try {
        sessionStorage.setItem("project-idea", `${l.need}${l.details ? `: ${l.details}` : ""}`)
      } catch {
        /* optional */
      }
      let delivered = false
      if (LEAD_URL) {
        try {
          const res = await fetch(LEAD_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: l.name, email: l.email, need: l.need, details: l.details, page }) })
          delivered = res.ok
        } catch {
          delivered = false
        }
      }
      const mail = `mailto:${contactInfo.email}?subject=${encodeURIComponent(`Project enquiry: ${l.need}`)}&body=${encodeURIComponent(summary)}`
      const wa = `${contactInfo.whatsapp}${contactInfo.whatsapp.includes("?") ? "&" : "?"}text=${encodeURIComponent(summary)}`
      await say(
        delivered
          ? { text: `Thanks ${l.name.split(" ")[0]}, your enquiry is with the team. We'll reply to ${l.email} within one business day.`, links: [{ label: "See our work", href: "/work" }], chips: ["Our services", "Our products"] }
          : {
              text: `Thanks ${l.name.split(" ")[0]}, your request is ready. Tap one of these to send it to the team, and we'll reply to ${l.email} within one business day.`,
              links: [{ label: "Send by email", href: mail, external: true }, { label: "Send on WhatsApp", href: wa, external: true }, { label: "Use the full form", href: "/start" }],
              chips: ["Our services", "Our products"],
            },
      )
    },
    [say],
  )

  const handleLead = useCallback(
    async (input: string, l: Lead) => {
      const v = input.trim()
      if (/^(cancel|stop|never ?mind|exit|quit)$/i.test(v)) {
        setLead(null)
        return say({ text: "No problem, I've cleared that. What else can I help with?", chips: ["Our services", "Our products", "Contact details"] })
      }
      if (l.step === "name") {
        const next = { ...l, name: v.slice(0, 80), step: "email" as Step }
        setLead(next)
        return say({ text: `Nice to meet you, ${next.name.split(" ")[0]}. What's the best email to reach you on?`, chips: ["Cancel"] })
      }
      if (l.step === "email") {
        if (!EMAIL_RE.test(v)) return say({ text: "That doesn't look like a valid email. It should look like name@company.com.", chips: ["Cancel"] })
        const next: Lead = { ...l, email: v, step: l.need ? "details" : "need" }
        setLead(next)
        return say(l.need ? { text: `Got it. Anything else the team should know about "${l.need}"? Budget, deadline, links, anything helps.`, chips: ["Skip", "Cancel"] } : { text: "What do you need help with?", chips: [...NEEDS, "Cancel"] })
      }
      if (l.step === "need") {
        const next: Lead = { ...l, need: v.slice(0, 120), step: "details" }
        setLead(next)
        return say({ text: "Thanks. Anything else the team should know? Budget, deadline, links, anything helps.", chips: ["Skip", "Cancel"] })
      }
      const done: Lead = { ...l, details: /^skip$/i.test(v) ? "" : v.slice(0, 1000) }
      return finishLead(done)
    },
    [say, finishLead],
  )

  const send = useCallback(
    async (raw: string) => {
      const v = raw.trim()
      if (!v || busy.current) return
      busy.current = true
      setText("")
      push({ role: "user", text: v })
      try {
        if (lead) {
          await handleLead(v, lead)
        } else {
          const r = reply(v, ctx)
          setCtx(r.ctx)
          if (r.bot.lead) {
            await say(r.bot)
            await startLead(r.bot.lead.need)
          } else if (CHAT_URL && r.bot.text === fallbackReply().text) {
            setTyping(true)
            let answer: string | null = null
            try {
              const history = [...msgs, { role: "user", text: v }].slice(-10).map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }))
              const res = await fetch(CHAT_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) })
              if (res.ok) answer = ((await res.json()) as { reply?: string }).reply ?? null
            } catch {
              answer = null
            }
            setTyping(false)
            await say(answer ? { text: answer, chips: ["Start a project", "Talk to a person"] } : r.bot)
          } else {
            await say(r.bot)
          }
        }
      } finally {
        busy.current = false
        inputRef.current?.focus({ preventScroll: true })
      }
    },
    [lead, ctx, msgs, push, say, handleLead, startLead],
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void send(text)
  }

  const reset = () => {
    setMsgs([{ id: nextId.current++, ...GREETING }])
    setLead(null)
    setCtx({})
    setTyping(false)
  }

  const onLink = (e: React.MouseEvent<HTMLAnchorElement>, l: Link) => {
    if (l.external || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    const [path, hash] = l.href.split("#")
    navigate(path || location.pathname)
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 120)
    if (window.matchMedia("(max-width: 640px)").matches) setOpen(false)
  }

  const lastBot = [...msgs].reverse().find((m) => m.role === "bot")
  const placeholder = lead
    ? { name: "Your name", email: "you@company.com", need: "What do you need?", details: "Budget, deadline, links (or type skip)" }[lead.step]
    : "Ask about services, products, offices..."

  return (
    <>
      {open && (
        <section ref={panelRef} className="chat-panel" role="dialog" aria-label="Chat with Sybertron" aria-modal="false">
          <header className="chat-head">
            <span className="chat-bot chat-bot--lg">
              <Bot size={20} aria-hidden />
              <i aria-hidden />
            </span>
            <div>
              <strong>Sybertron assistant</strong>
              <small>Answers instantly, team replies within a business day</small>
            </div>
            <button type="button" className="chat-icon" onClick={reset} aria-label="Start a new chat" title="New chat">
              <RotateCcw size={16} aria-hidden />
            </button>
            <button type="button" className="chat-icon" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} aria-hidden />
            </button>
          </header>

          <div className="chat-log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions">
            {msgs.map((m) => (
              <div key={m.id} className={`chat-msg chat-msg--${m.role}`}>
                <p>{m.text}</p>
                {m.links && (
                  <div className="chat-links">
                    {m.links.map((l) => (
                      <a key={l.label + l.href} href={l.href} onClick={(e) => onLink(e, l)} {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        {l.label} <ArrowUpRight size={14} aria-hidden />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="chat-msg chat-msg--bot chat-typing" aria-label="Assistant is typing">
                <i />
                <i />
                <i />
              </div>
            )}
          </div>

          {lastBot?.chips && !typing && (
            <div className="chat-chips" key={lastBot.id}>
              {lastBot.chips.map((c) => (
                <button key={c} type="button" onClick={() => void send(c)}>
                  {c}
                </button>
              ))}
            </div>
          )}

          <form className="chat-form" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              aria-label="Your message"
              maxLength={500}
              autoComplete={lead?.step === "email" ? "email" : lead?.step === "name" ? "name" : "off"}
              inputMode={lead?.step === "email" ? "email" : "text"}
            />
            <button type="submit" disabled={!text.trim()} aria-label="Send message">
              <Send size={17} aria-hidden />
            </button>
          </form>
        </section>
      )}

      <button type="button" className="chat-launcher" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? "Close chat" : "Open chat"}>
        <span className="chat-bot">
          {open ? <X size={18} aria-hidden /> : <Bot size={18} aria-hidden />}
          <i aria-hidden />
        </span>
        {open ? "Close" : "Talk to us"}
      </button>
    </>
  )
}
