/* Sybertron assistant: a small, offline answer engine built on the site's own data.
   It never invents prices or promises; anything it cannot answer is handed to the team. */
import { FOUNDED, stats } from "@/data/company"
import { catalog, categories, type CatalogItem } from "@/data/catalog"
import { DETAILS, getService } from "@/data/serviceDetail"
import { offices, urgentHelp, type Office } from "@/data/offices"
import { roles } from "@/data/careers"
import { contactInfo } from "@/data/about"
import { SERVICES } from "@/components/services/ServicesPage"
import { productHref, serviceHref } from "../router"

export type Link = { label: string; href: string; external?: boolean }
export type Bot = {
  text: string
  links?: Link[]
  chips?: string[]
  /** start the "tell us about your project" flow, optionally with the need already filled in */
  lead?: { need?: string }
}
export type Ctx = { lastProduct?: string; lastService?: string }

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9+&/\s-]/g, " ").replace(/\s+/g, " ").trim()
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "")
const has = (t: string, re: RegExp) => re.test(t)
const STOP = new Set("the a an and or of to for in on at is are do you we can how what does your our with it my me i be about any have has will would could should this that there from by as if so not no yes please tell us".split(" "))
const words = (s: string) => norm(s).split(" ").filter((w) => w.length > 2 && !STOP.has(w))

export const FIRST_CHIPS = ["What do you build?", "Show me your products", "Where are your offices?", "Start a project"]
const HOME_CHIPS = ["Our services", "Our products", "Pricing", "Talk to a person"]

/* ------------------------------------------------------------- offices */
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
function localNow(tz: string, now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0"
  const hour = Number(get("hour")) % 24
  return { day: DAYS.indexOf(get("weekday")), minutes: hour * 60 + Number(get("minute")), label: `${String(hour).padStart(2, "0")}:${get("minute")}` }
}
export function officeStatus(o: Office, now = new Date()) {
  const l = localNow(o.tz, now)
  const open = o.workDays.includes(l.day) && l.minutes >= o.open && l.minutes < o.close
  return { open, time: l.label }
}
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`

function officesReply(): Bot {
  const lines = offices.map((o) => {
    const s = officeStatus(o)
    const days = o.workDays.includes(0) ? "Sun to Thu" : "Mon to Fri"
    return `• ${o.city}, ${o.country}: ${s.open ? "open now" : "closed now"} (local time ${s.time}), ${days} ${hhmm(o.open)} to ${hhmm(o.close)}`
  })
  return {
    text: `We work from ${offices.length} cities: ${offices.map((o) => o.city).join(", ")}.\n${lines.join("\n")}\nDelhi, India is where we started in ${FOUNDED}. Messages sent outside office hours are answered within one business day.`,
    links: [{ label: "See the map", href: "/about#locations" }],
    chips: ["Contact details", "Start a project"],
  }
}

/* ------------------------------------------------------------- products */
const ALIASES: Record<string, RegExp> = {
  invoicehub: /invoic|gst|billing software/, retailpos: /\bpos\b|point of sale|retail|checkout|barcode/, dineos: /restaurant|cafe|dine|kitchen|menu/,
  salonplanner: /salon|spa\b|barber/, stockpilot: /inventory|stock|warehouse|purchase order/, smartfacility: /facility|building|tenant|lease/,
  fleettracker: /fleet|vehicle|driver|truck/, assettracker: /asset/, fieldservice: /field service|technician|work order|dispatch/,
  propertymanager: /property|rental|landlord|real estate/, peopledesk: /\bhr\b|payroll|attendance|leave|employee/, visitorpass: /visitor|reception|gate pass/,
  clinicdesk: /clinic|doctor|patient|hospital|medical/, gymmanager: /\bgym|fitness|membership/, leadflow: /\bcrm\b|\blead|sales pipeline|follow.?up/,
  bookingengine: /booking|appointment|reservation|schedul/, orderportal: /order portal|wholesale|b2b order|reorder/, aichatbot: /ai chatbot|chatbot product/,
  aianalytics: /analytics|insights|forecast/, documentvault: /document vault|document storage|e-?sign|paperwork/, securitysuite: /security|compliance|audit|iso\b|soc ?2/,
  cloudbackup: /cloud infra|backup|hosting|devops|disaster/, vrshowroom: /showroom/, virtualtours: /virtual tour|360 tour|walkthrough/,
  vrgaming: /vr gam/, hologuide: /holo|hologram/, school360: /school|student|teacher|parents?\b/, learningplatform: /\blms\b|e-?learning|learning platform|courses?\b/,
}

function findProducts(t: string): CatalogItem[] {
  const sq = squash(t)
  const exact = catalog.filter((p) => sq.includes(squash(p.name)))
  if (exact.length) return exact
  return catalog.filter((p) => ALIASES[p.id]?.test(t))
}
const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? ""

function productReply(p: CatalogItem): Bot {
  return {
    text: `${p.name} (${catLabel(p.cat)}): ${p.blurb}\n${p.bullets.map((b) => `• ${b}`).join("\n")}\nAvailable as: ${p.platforms}. We set it up for your business, so you are not stuck with a template.`,
    links: [{ label: `${p.name} details`, href: productHref(p.id) }],
    chips: [`Book a demo of ${p.name}`, `Pricing for ${p.name}`, "Other products"],
  }
}

function productsOverview(): Bot {
  const lines = categories.map((c) => `• ${c.label}: ${catalog.filter((p) => p.cat === c.id).map((p) => p.name).join(", ")}`)
  return {
    text: `We build and support ${catalog.length} ready-made products. Each one can be set up for your business.\n${lines.join("\n")}\nTell me what you do (a restaurant, a clinic, a warehouse...) and I'll suggest one.`,
    links: [{ label: "Browse all products", href: "/products" }],
    chips: ["I run a restaurant", "I need invoicing and GST", "I need an HR system"],
  }
}

/* ------------------------------------------------------------- services */
const SERVICE_KEYS: [string, RegExp][] = [
  ["ai-agents", /agent/], ["ai-models", /\bmodels?\b|gpt|claude|gemini|llm|openai|llama/], ["ai", /\bai\b|artificial|automat|chatbot|machine learning|\bml\b/],
  ["ecommerce", /shopify|woocommerce|magento|e-?commerce|online (store|shop)|\bstore\b/], ["mobile-apps", /mobile|android|\bios\b|iphone|flutter|react native|\bapps?\b/],
  ["games", /\bgam(e|es|ing)\b|unity|unreal/], ["ar-vr", /\bar\b|\bvr\b|augmented|virtual reality|metaverse/],
  ["marketing", /marketing|\bseo\b|\bads?\b|social media|branding|ppc|content|growth/], ["plugins", /plugin|wordpress|\bwix\b|extension/],
  ["erp", /\berp\b|resource planning|tally/], ["saas", /saas|subscription|\bmvp\b|multi.?tenant|startup/],
  ["web-portals", /portal|dashboard|web ?app|website|web site|web development/], ["custom", /custom|bespoke|software development|tailor|internal tool/],
]
const svcTitle = (id: string) => SERVICES.find((s) => s.id === id)?.title ?? id

function bestFaq(t: string, ids: string[]): { q: string; a: string; id: string } | null {
  const w = new Set(words(t))
  let best: { q: string; a: string; id: string; s: number } | null = null
  for (const id of ids) {
    for (const [q, a] of getService(id)?.faq ?? []) {
      const s = words(q).filter((x) => w.has(x)).length
      if (s >= 2 && (!best || s > best.s)) best = { q, a, id, s }
    }
  }
  return best
}

function serviceReply(id: string, t: string): Bot {
  const d = getService(id)
  const s = SERVICES.find((x) => x.id === id)
  const faq = bestFaq(t, [id])
  const more = d?.more.slice(0, 2).map((m) => svcTitle(m)) ?? []
  const text = faq
    ? `${faq.a}`
    : `${svcTitle(id)}: ${d?.lede ?? s?.desc ?? ""}${d ? `\nHow we work: ${d.steps.join(" → ")}` : ""}`
  const prods = (d?.prods ?? []).map((pid) => catalog.find((p) => p.id === pid)?.name).filter(Boolean) as string[]
  return {
    text: faq ? text : text + (prods.length ? `\nRelated products: ${prods.join(", ")}.` : ""),
    links: [{ label: `${svcTitle(id)} page`, href: serviceHref(id) }],
    chips: [`Start a project: ${svcTitle(id)}`, ...more.map((m) => `Tell me about ${m}`)].slice(0, 3),
  }
}

function servicesOverview(): Bot {
  return {
    text: `We cover ${SERVICES.length} services under one roof:\n${SERVICES.map((s) => `• ${s.title}`).join("\n")}\nTell me what you're trying to build and I'll point you to the right one.`,
    links: [{ label: "All services", href: "/services" }],
    chips: ["AI automation", "Mobile apps", "Ecommerce", "ERP systems"],
  }
}

/* ------------------------------------------------------------- the rest */
const contactReply = (): Bot => ({
  text: `You can reach the team here:\n• Email: ${contactInfo.email}\n• WhatsApp: use the button below\nWe reply within one business day. Something broken right now? Use the RAPID RESPONSE page.`,
  links: [
    { label: "Email us", href: `mailto:${contactInfo.email}`, external: true },
    { label: "WhatsApp", href: contactInfo.whatsapp, external: true },
    { label: "RAPID RESPONSE", href: urgentHelp.cta.href },
  ],
  chips: ["Start a project", "Where are your offices?"],
})

function careersReply(): Bot {
  const open = roles.filter((r) => r.open)
  return {
    text: `We have ${open.length} open roles:\n${open.map((r) => `• ${r.title} (${r.type}${r.location ? `, ${r.location}` : ""})`).join("\n")}\nSee the careers page for details and how to apply.`,
    links: [{ label: "Careers", href: "/careers" }],
    chips: ["What do you build?", "Where are your offices?"],
  }
}

function aboutReply(): Bot {
  const yrs = new Date().getFullYear() - FOUNDED
  return {
    text: `Sybertron started in Delhi, India in ${FOUNDED}, so we have been building software for ${yrs} years. Today that's ${stats[0].value.toLocaleString("en-US")}+ projects delivered, ${stats[1].value} in-house products and a presence in ${stats[2].value} countries (USA, UK, UAE and India).`,
    links: [{ label: "Our story", href: "/about" }, { label: "Our work", href: "/work" }],
    chips: ["What do you build?", "We're hiring?"],
  }
}

const pricingReply = (name?: string): Bot => ({
  text: `${name ? `${name} is` : "Projects are"} priced to fit the scope, so I don't want to guess a number. Price depends on what you need built, how many people use it and how quickly you need it. Give us a few details and the team will come back with a clear quote within one business day, no obligation.`,
  chips: name ? [`Book a demo of ${name}`, "Start a project"] : ["Start a project", "How long does a project take?"],
})

const timelineReply = (): Bot => ({
  text: "It depends on the size. A focused website or small tool is a matter of weeks. A mobile app, portal or ERP is usually months, delivered in stages so you can use and test it along the way. Ready-made products from our catalogue can be set up much faster. Share your idea and we'll give you a realistic plan.",
  chips: ["Start a project", "Pricing"],
})

const urgentReply = (): Bot => ({
  text: `${urgentHelp.lead} ${urgentHelp.rest} Use RAPID RESPONSE and tell us what's broken, or message us on WhatsApp for the fastest reply.`,
  links: [{ label: urgentHelp.cta.label, href: urgentHelp.cta.href }, { label: "WhatsApp", href: contactInfo.whatsapp, external: true }],
})

export const fallbackReply = (): Bot => ({
  text: "I'm not sure I have a good answer to that one. I can tell you about our services, products, offices and jobs, or I can pass your question to the team and they'll reply within one business day.",
  chips: ["What do you build?", "Show me your products", "Talk to a person"],
  links: [{ label: "Email the team", href: `mailto:${contactInfo.email}`, external: true }],
})

/* ------------------------------------------------------------- main */
export function reply(input: string, ctx: Ctx = {}): { bot: Bot; ctx: Ctx } {
  const t = norm(input)
  const done = (bot: Bot, c: Ctx = {}) => ({ bot, ctx: { ...ctx, ...c } })

  if (!t) return done(fallbackReply())

  // small talk (only when the message is short, so "hi, I need an app" still gets a real answer)
  const short = t.split(" ").length <= 4
  if (short && has(t, /^(hi|hey|hello|hola|salam|assalam|namaste|good (morning|afternoon|evening)|yo)\b/))
    return done({ text: "Hi! I'm the Sybertron assistant. Ask me about our services, products, offices or jobs, or tell me about your project.", chips: FIRST_CHIPS })
  if (short && has(t, /^(thanks|thank you|thx|ty|cheers|great|perfect|awesome|cool|ok(ay)?)\b/))
    return done({ text: "Happy to help. Anything else you'd like to know?", chips: HOME_CHIPS })
  if (short && has(t, /^(bye|goodbye|see you|cya|good night)\b/))
    return done({ text: "Thanks for stopping by. If you want to talk to the team, we reply within one business day.", chips: ["Start a project"] })

  if (has(t, /urgent|emergency|asap|broken|\bdown\b|crash|hacked|not working|outage|bug fix|site is down/)) return done(urgentReply())

  // demo / quote / start a project => lead flow
  const prodForDemo = findProducts(t)[0]
  if (has(t, /\bdemo\b|book a (call|meeting)|schedule a call/)) {
    const p = prodForDemo ?? catalog.find((x) => x.id === ctx.lastProduct)
    return done({ text: `Great, let's set up ${p ? `a demo of ${p.name}` : "a demo"}. I just need a few details.`, lead: { need: p ? `Demo of ${p.name}` : "Book a demo" } })
  }
  if (has(t, /start (a|my|the)? ?(\w+ )?project|get a quote|request a quote|free quote|hire (you|us|sybertron)|work with (you|us)|get started|build (me|us) |i (want|need|would like) (to )?(build|make|develop|hire)|talk to (sales|someone)|get in touch|contact sales|proposal/)) {
    const sid = SERVICE_KEYS.find(([, re]) => re.test(t))?.[0]
    return done({ text: "Happy to help. A few quick questions and I'll package it for the team.", lead: { need: sid ? svcTitle(sid) : undefined } })
  }

  if (has(t, /career|\bjobs?\b|hiring|vacanc|openings?|internship|work (for|at|with) sybertron|join (the )?team|we.?re hiring/)) return done(careersReply())
  if (has(t, /talk to (a )?(person|human|someone|agent|team)|real person|human|speak to|live (agent|chat)|call (me|you)|phone|whatsapp|e-?mail|contact (details|info|us)|how (can|do) i (reach|contact)/))
    return done(contactReply())
  if (has(t, /office|location|where are you|based|address|city|country|countries|timezone|time zone|open now|working hours|office hours|business hours|when (are|do) you (open|work)/)) return done(officesReply())

  const prods = findProducts(t)
  if (has(t, /pric|cost|how much|budget|rate|fee|quote|afford|cheap|expens|charge/)) {
    const p = prods[0] ?? (prods.length === 0 ? catalog.find((x) => x.id === ctx.lastProduct && /\b(it|this|that)\b/.test(t)) : undefined)
    return done(pricingReply(p?.name))
  }
  if (has(t, /how long|timeline|turnaround|deliver(y)? time|how fast|how soon|deadline|duration|weeks|months/)) return done(timelineReply())

  // a specific product wins over generic words
  if (prods.length === 1) return done(productReply(prods[0]), { lastProduct: prods[0].id })
  if (prods.length > 1 && !has(t, /\bservices?\b/))
    return done({ text: `A few of our products could fit: ${prods.slice(0, 4).map((p) => p.name).join(", ")}. Which one would you like to know more about?`, chips: prods.slice(0, 4).map((p) => `Tell me about ${p.name}`) })

  const cat = categories.find((c) => t.includes(norm(c.label)))
  if (cat) {
    const list = catalog.filter((p) => p.cat === cat.id)
    return done({ text: `${cat.label} products:\n${list.map((p) => `• ${p.name}: ${p.blurb}`).join("\n")}`, chips: list.slice(0, 3).map((p) => `Tell me about ${p.name}`), links: [{ label: "Browse all products", href: "/products" }] })
  }

  const sid = SERVICE_KEYS.find(([, re]) => re.test(t))?.[0]
  if (sid && !has(t, /^(what do you (build|do|make|offer)|services?)\??$/)) return done(serviceReply(sid, t), { lastService: sid })

  // FAQ lookup across every service page
  const faq = bestFaq(t, DETAILS.map((d) => d.id))
  if (faq) return done({ text: faq.a, links: [{ label: `${svcTitle(faq.id)} page`, href: serviceHref(faq.id) }], chips: ["Start a project", "Talk to a person"] }, { lastService: faq.id })

  if (has(t, /product|software|solutions?|catalog/) && !has(t, /\bservices?\b/)) return done(productsOverview())
  if (has(t, /service|what do you (build|do|make|offer)|what can you|capabilit|offer|help me with|specialis|expertise/)) return done(servicesOverview())
  if (has(t, /about|who are you|who is sybertron|company|history|story|founded|since when|how (old|long have)|experience|team size|clients?|portfolio|case stud|work you.?ve done|past work|projects/)) return done(aboutReply())
  if (has(t, /\bi (run|own|have|manage) (a |an |the )?\w+|for my (business|shop|store|company)|small business|\bsme\b/)) return done(productsOverview())

  return done(fallbackReply())
}
