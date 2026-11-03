/* SAMPLE CONTENT: category-level copy, filled in with each product's own name, blurb, bullets and platforms.
   Replace any field for a single product by adding it to OVERRIDES at the bottom. */
import { catalog, categories, type CatalogItem } from "./catalog"
import type { Mock } from "./products"

export type Plan = {
  name: string
  price: string
  unit: string
  note: string
  items: string[]
  cta: string
  featured?: boolean
}

export type ProductDetail = {
  item: CatalogItem
  family: string
  host: string
  runsOn: string
  builtFor: string
  compliance: string
  headline: string
  overview: string
  tags: string[]
  problems: string[]
  modules: { t: string; d: string }[]
  features: string[]
  plans: Plan[]
  faq: { q: string; a: string }[]
  related: CatalogItem[]
}

type Tpl = {
  builtFor: string
  compliance: string
  tags: string[]
  overview: (n: string) => string
  problems: string[]
  modules: [string, string][]
  features: string[] // 9 extra features (the product's own 3 bullets are added on top)
  price: [number, number]
  unit: string
  trial: string
}

const TPL: Record<string, Tpl> = {
  "finance-pos": {
    builtFor: "Shops, restaurants, salons, small businesses and finance teams",
    compliance: "GST invoices · e-way bills · UPI",
    tags: ["Retail & stores", "Small businesses", "Finance teams", "Growing brands"],
    overview: (n) =>
      `${n} connects billing, payments and stock so every sale is recorded once and shows up everywhere it should: the till, the ledger, the GST return and the owner's phone.`,
    problems: [
      "Paper bills and spreadsheet totals",
      "GST and tax rules that keep changing",
      "Cash, card and UPI counted in different places",
      "No clear view of profit, stock and dues",
    ],
    modules: [
      ["Billing & invoicing", "GST-ready bills and invoices with QR codes, discounts, returns and PDF or WhatsApp sharing."],
      ["Customers & ledger", "Customer and supplier balances, credit limits, reminders and a full statement for every account."],
      ["Stock & purchasing", "Live stock by branch, purchase orders, supplier bills and low-stock alerts."],
      ["Payments", "UPI, card and cash in one place, with end-of-day cash count and settlement reports."],
      ["Staff & shifts", "Cashier logins, shift handover, commissions and permission levels."],
      ["Offers & loyalty", "Coupons, memberships and loyalty points that apply at checkout automatically."],
      ["Reports", "Sales, profit, tax, expense and stock reports you can export for your accountant."],
      ["Control", "Several branches under one login, with roles, approvals and a full activity log."],
    ],
    features: [
      "Multi-branch dashboard",
      "QR codes on every bill",
      "Sales, tax and profit reports",
      "Customer and supplier ledgers",
      "Staff roles and permissions",
      "Coupons and memberships",
      "Share bills on WhatsApp and email",
      "Backups and activity log",
      "Data import from Excel",
    ],
    price: [999, 2499],
    unit: "month",
    trial: "a free 14-day trial with sample data",
  },
  operations: {
    builtFor: "Operations heads, facility teams, warehouses and field managers",
    compliance: "Audit trail · role-based access",
    tags: ["Operations teams", "Facility managers", "Warehouses", "Service companies"],
    overview: (n) =>
      `${n} replaces scattered sheets and phone calls with one live record of what you own, where it is and what needs doing next, so nothing is chased by hand.`,
    problems: [
      "Updates that live in WhatsApp and spreadsheets",
      "No clear owner for each task or asset",
      "Surprises: late jobs, missing items, expired services",
      "Reports that take a day to put together",
    ],
    modules: [
      ["Live dashboard", "One screen for status, open work, exceptions and what needs attention today."],
      ["Records & registry", "Every item, site, vehicle or job with its history, documents and owner."],
      ["Tasks & scheduling", "Assign, schedule and track work with reminders that escalate when something slips."],
      ["Mobile apps", "Field staff update status, scan codes and capture photos or signatures from a phone."],
      ["Alerts & reminders", "Service dates, expiries and delays reach the right person before they become a problem."],
      ["Vendors & purchasing", "Vendors, quotes, orders and costs linked back to the work they belong to."],
      ["Reports", "Utilisation, cost, turnaround and compliance reports, scheduled to your inbox."],
      ["Control", "Roles, approvals and a complete activity log across every site and team."],
    ],
    features: [
      "Live status dashboard",
      "QR and barcode scanning",
      "Task assignment and reminders",
      "Photo and signature capture",
      "Maintenance and service schedules",
      "Vendor and cost tracking",
      "Scheduled email reports",
      "Multi-site support",
      "Roles, approvals and activity log",
    ],
    price: [1499, 3499],
    unit: "month",
    trial: "a free 14-day trial with sample data",
  },
  people: {
    builtFor: "Front desks, clinics, gyms, HR teams and offices",
    compliance: "Role-based access · data privacy controls",
    tags: ["Front desk teams", "Clinics & studios", "HR & admin", "Multi-branch groups"],
    overview: (n) =>
      `${n} takes the paperwork out of dealing with people: sign-ins, appointments, records and reminders run themselves, and your team sees who needs attention right now.`,
    problems: [
      "Registers and notebooks nobody can search",
      "Missed appointments, renewals and follow-ups",
      "Records that sit with one person",
      "No audit trail of who came, who left and who approved",
    ],
    modules: [
      ["Check-in & registration", "QR, kiosk or desk check-in with pre-registration and instant confirmation."],
      ["People & records", "A searchable profile for every person with notes, documents and history."],
      ["Scheduling", "Appointments, shifts and classes with waitlists and automatic reminders."],
      ["Billing & plans", "Fees, memberships and packages with online payment and receipts."],
      ["Notifications", "SMS, WhatsApp and email alerts to the host, staff member or customer."],
      ["Staff & roles", "Reception, manager and admin logins, each seeing only what they should."],
      ["Reports", "Footfall, attendance, revenue and no-show reports by day, branch or team."],
      ["Control", "Privacy settings, data export and a full activity log for audits."],
    ],
    features: [
      "QR check-in",
      "Searchable people records",
      "Automatic reminders",
      "Waitlists and rescheduling",
      "Online payments and receipts",
      "SMS, WhatsApp and email alerts",
      "Attendance and footfall reports",
      "Multi-branch support",
      "Privacy controls and audit log",
    ],
    price: [899, 2199],
    unit: "month",
    trial: "a free 14-day trial with sample data",
  },
  commerce: {
    builtFor: "Distributors, wholesalers, service businesses and online sellers",
    compliance: "GST invoicing · secure payments",
    tags: ["Distributors", "Service businesses", "Online sellers", "Sales teams"],
    overview: (n) =>
      `${n} turns enquiries into paid orders without the back-and-forth, with prices, availability and follow-ups handled in one place your customers can also use.`,
    problems: [
      "Orders arriving by phone, chat and email",
      "Price lists and credit limits kept in someone's head",
      "Follow-ups that depend on memory",
      "No view of what is booked, paid or pending",
    ],
    modules: [
      ["Orders & bookings", "Take orders or bookings online with live availability and instant confirmation."],
      ["Customers & CRM", "Every enquiry, customer and conversation on one timeline with owners and reminders."],
      ["Pricing & rules", "Customer-specific prices, tiers, deposits, credit limits and approval rules."],
      ["Payments", "Deposits, prepayment and invoices with online payment links."],
      ["Customer portal", "Customers reorder, rebook and track status without calling you."],
      ["Reminders", "SMS, WhatsApp and email nudges that cut no-shows and late payments."],
      ["Reports", "Pipeline, order value, conversion and no-show reports by team and channel."],
      ["Control", "Roles, approvals and an activity log across every sales channel."],
    ],
    features: [
      "Online order and booking pages",
      "Customer-specific price lists",
      "Deposits and prepayment",
      "Credit limits and approvals",
      "Reorder from past orders",
      "WhatsApp, SMS and email reminders",
      "Sales rep mobile access",
      "Order and conversion reports",
      "Roles and activity log",
    ],
    price: [1299, 2999],
    unit: "month",
    trial: "a free 14-day trial with sample data",
  },
  "ai-data": {
    builtFor: "Support, operations and leadership teams with data or documents to put to work",
    compliance: "Your data stays yours · role-based access",
    tags: ["Support teams", "Operations", "Leadership", "Data teams"],
    overview: (n) =>
      `${n} puts AI to work on your own content and data, with answers you can trace back to the source and a person always able to step in.`,
    problems: [
      "Answers buried in documents nobody reads",
      "The same questions asked again and again",
      "Reports that wait for an analyst",
      "AI tools with no control over what they see",
    ],
    modules: [
      ["Knowledge base", "Connect documents, sites and databases. Answers cite the source they came from."],
      ["Ask in plain language", "Anyone on the team asks a question and gets an answer, a chart or a draft."],
      ["Automations", "Route, tag, extract and summarise automatically, and flag anything uncertain."],
      ["Human handover", "Low-confidence cases go to a person with the full context attached."],
      ["Channels", "Website widget, WhatsApp, email and an API for your own apps."],
      ["Accuracy tools", "Review queues, feedback buttons and test sets to keep answers reliable."],
      ["Reports", "Usage, resolution, accuracy and saved-time reports, scheduled or on demand."],
      ["Control", "Access rules per team, data retention settings and a full audit log."],
    ],
    features: [
      "Answers with source links",
      "Documents, sites and database connectors",
      "Plain-language questions",
      "Human handover with context",
      "WhatsApp and website channels",
      "Review queue for low-confidence cases",
      "Scheduled reports",
      "Access control by team",
      "Audit log and data retention",
    ],
    price: [2999, 7999],
    unit: "month",
    trial: "a free pilot on a sample of your own content",
  },
  "security-cloud": {
    builtFor: "IT teams, compliance owners and companies running business-critical systems",
    compliance: "Encrypted at rest and in transit · audit-ready",
    tags: ["IT teams", "Compliance owners", "Growing companies", "Regulated sectors"],
    overview: (n) =>
      `${n} keeps a steady eye on the things that cannot go wrong, and gives your team clear alerts, clean evidence and fast recovery when something does.`,
    problems: [
      "Alerts everywhere and no single view",
      "Backups nobody has ever tested",
      "Audit season that takes weeks of screenshots",
      "Cloud bills that creep up unnoticed",
    ],
    modules: [
      ["Overview dashboard", "Health, alerts and risk across every system on a single screen."],
      ["Monitoring", "Logins, access changes and unusual activity, with alerts to email or chat."],
      ["Backups & recovery", "Scheduled, encrypted backups with tested one-click restores."],
      ["Compliance checklists", "Policies, controls and evidence tracked against the standards you follow."],
      ["Access control", "Who can reach what, reviewed regularly and revoked in one click."],
      ["Cost control", "Usage and cost by workload, with spike alerts and savings suggestions."],
      ["Reports", "Audit-ready exports and scheduled summaries for management."],
      ["Control", "Roles, approvals and a tamper-evident activity log."],
    ],
    features: [
      "Login and access monitoring",
      "Alerts by email and chat",
      "Scheduled encrypted backups",
      "One-click restore",
      "Compliance checklists and evidence",
      "Access reviews",
      "Usage and cost reports",
      "Audit-ready exports",
      "Tamper-evident activity log",
    ],
    price: [3499, 8999],
    unit: "month",
    trial: "a free 14-day trial on a non-production workload",
  },
  "ar-vr": {
    builtFor: "Brands, developers, venues, trainers and real-estate teams",
    compliance: "Comfort-tested · privacy-first analytics",
    tags: ["Brands & retail", "Real estate", "Training teams", "Venues & events"],
    overview: (n) =>
      `${n} turns spaces and products into experiences people can step into, from a headset, a phone or a browser, and measures what they actually look at.`,
    problems: [
      "Products and spaces that are hard to show remotely",
      "Training that does not stick",
      "Content that is expensive to update",
      "No data on what visitors actually do",
    ],
    modules: [
      ["Scene builder", "Assemble scenes from your 3D models, 360° photos and video without writing code."],
      ["Interaction", "Hotspots, guided steps, product swaps and calls to action inside the scene."],
      ["Device support", "Headsets, phones, tablets and the browser from one published build."],
      ["Content updates", "Edit text, models and media yourself and publish without a new release."],
      ["Embeds & sharing", "Drop an experience into your website or share it as a link or QR code."],
      ["Analytics", "Sessions, time per scene, hotspot clicks and completion rates."],
      ["Comfort & performance", "Frame-rate and motion-comfort tuning for affordable hardware."],
      ["Control", "Roles, versioning and an approval step before anything goes live."],
    ],
    features: [
      "Drag-and-drop scene builder",
      "Hotspots and guided steps",
      "Headset, phone and browser support",
      "Update content without a release",
      "Website embeds and QR links",
      "Session and engagement analytics",
      "Comfort-first performance tuning",
      "Versioning and approvals",
      "Multi-language support",
    ],
    price: [24999, 74999],
    unit: "project",
    trial: "a free sample scene built from your own material",
  },
  education: {
    builtFor: "Schools, academies, coaching centres and training providers",
    compliance: "Student data privacy · parent-safe access",
    tags: ["Schools", "Academies", "Coaching centres", "Training providers"],
    overview: (n) =>
      `${n} brings admissions, teaching, fees and communication into one system that staff, students and parents all actually use.`,
    problems: [
      "Fees chased by hand every month",
      "Attendance and marks in different files",
      "Parents who never see what is going on",
      "Results and reports that take days to prepare",
    ],
    modules: [
      ["Admissions", "Enquiries, applications and enrolment with documents and fee set-up."],
      ["Students & classes", "Profiles, sections, timetables and attendance in a few taps."],
      ["Fees & payments", "Fee vouchers, instalments, online payment and automatic reminders."],
      ["Learning", "Courses, lessons, question banks, assignments and live classes."],
      ["Exams & results", "Marks entry, grading rules, report cards and ranked results."],
      ["Parent & student app", "Notices, homework, attendance, fees and results on a phone."],
      ["Reports", "Attendance, collection, performance and teacher workload reports."],
      ["Control", "Roles for admin, teacher, parent and student, with a full activity log."],
    ],
    features: [
      "Online admissions",
      "Attendance by class and subject",
      "Fee vouchers and online payments",
      "Report cards and results",
      "Question banks and tests",
      "Live classes",
      "Parent and student app",
      "Notices by SMS and app",
      "Roles and activity log",
    ],
    price: [1499, 3499],
    unit: "month",
    trial: "a free 14-day trial with sample data",
  },
}

/* Spare features used when a product's own bullets overlap with the category list. */
const SPARE = [
  "Data export to Excel and CSV",
  "Custom branding",
  "Mobile-friendly interface",
  "Regular updates included",
  "Email and chat support",
  "Import from your existing data",
]
const STOP = new Set(["and", "the", "for", "your", "with", "per", "by", "in", "on", "of", "to", "a"])
const words = (f: string) => new Set(f.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)))
const similar = (a: string, b: string) => {
  const A = words(a), B = words(b)
  const common = [...A].filter((w) => B.has(w)).length
  return common > 0 && common / Math.min(A.size, B.size) >= 0.6
}
function pickFeatures(own: string[], extra: string[]) {
  const out: string[] = []
  for (const f of [...own, ...extra, ...SPARE]) if (!out.some((o) => similar(o, f))) out.push(f)
  return out.slice(0, 12)
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`

const OVERRIDES: Record<string, Partial<Omit<ProductDetail, "item" | "related">>> = {}

export function getProduct(id: string): ProductDetail | null {
  const item = catalog.find((p) => p.id === id)
  if (!item) return null
  const t = TPL[item.cat]
  const family = categories.find((c) => c.id === item.cat)?.label ?? ""
  const n = item.name
  const [lo, hi] = t.price
  const platforms = item.platforms.split(" · ")
  const hasMobile = /phone|app|tablet|kiosk|handheld/i.test(item.platforms)

  const features = pickFeatures(item.bullets, t.features)

  const plans: Plan[] = [
    {
      name: "Starter",
      price: `${t.unit === "project" ? "From " : ""}${fmt(lo)}`,
      unit: t.unit,
      note: `For small teams getting started with ${n}.`,
      items: [features[0], features[1], "Core reports", "Email support"],
      cta: "Try it free",
    },
    {
      name: "Pro",
      price: `${t.unit === "project" ? "From " : ""}${fmt(hi)}`,
      unit: t.unit,
      note: "For businesses that want full control and automation.",
      items: ["Everything in Starter", features[2], "Multi-branch and roles", `All ${features.length} features`],
      cta: "Try it free",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "On request",
      unit: "",
      note: "For larger companies with custom needs. Yearly billing.",
      items: ["Everything in Pro", "Custom set-up and integrations", "Dedicated support"],
      cta: "Talk to us",
    },
  ]

  const faq = [
    {
      q: `What is ${n}?`,
      a: `${item.blurb} It is built and supported by Sybertron, so the people who answer your questions are the people who wrote the software.`,
    },
    {
      q: `Is ${n} secure?`,
      a: `Yes. Data is encrypted in transit and at rest, access is controlled by role, and every important action is written to an activity log. ${t.compliance}.`,
    },
    {
      q: `Can I try ${n} before subscribing?`,
      a: `Yes. We offer ${t.trial}. You can also book a 30-minute guided walkthrough, online or on-site.`,
    },
    {
      q: "Is there a mobile app?",
      a: hasMobile
        ? `${n} runs on ${platforms.join(", ")}. Everything stays in sync, so staff can work from whichever device is closest.`
        : `${n} runs on ${platforms.join(", ")}, and the web version works in the browser on phones and tablets as well.`,
    },
    {
      q: "Can it be set up for my business?",
      a: "Yes. We set it up with your products, branches, roles and branding, import your existing data, and can add custom features or integrations when you need them.",
    },
  ]

  // up to three siblings from the same category, then fill from the rest of the catalogue
  const same = catalog.filter((p) => p.cat === item.cat && p.id !== id)
  const rest = catalog.filter((p) => p.cat !== item.cat)
  const idx = catalog.findIndex((p) => p.id === id)
  const related = [...same, ...rest.slice(idx % Math.max(rest.length - 3, 1))].slice(0, 3)

  return {
    item,
    family,
    host: `${id}.sybertron.com`,
    runsOn: item.platforms,
    builtFor: t.builtFor,
    compliance: t.compliance,
    headline: item.blurb,
    overview: t.overview(n),
    tags: t.tags,
    problems: t.problems,
    modules: t.modules.map(([title, d]) => ({ t: title, d })),
    features,
    plans,
    faq,
    related,
    ...OVERRIDES[id],
  }
}

/* The same mock-up, redrawn as another view, for the overview gallery. */
const LIST_P = [92, 85, 78, 96, 70, 88]
const TILE_P = [90, 20, 60, 5, 60, 90, 20, 5, 60, 90, 5, 20]
const CHART_P = [28, 36, 30, 48, 44, 58, 52, 70]

export function asVariant(m: Mock, variant: Mock["variant"], crumbTail: string): Mock {
  const labels = ["Team A", "Team B", "Team C", "Team D", "Team E", "Team F"]
  const rows =
    variant === "list"
      ? labels.map((n, k) => ({ n, p: LIST_P[k], t: `${LIST_P[k]}%` }))
      : variant === "chart"
        ? CHART_P.map((p, k) => ({ n: `W${k + 1}`, p, t: "" }))
        : TILE_P.map((p, k) => ({ n: `T${k + 1}`, p, t: "" }))
  const head = m.crumb.split(" / ")[0]
  return { ...m, variant, rows, crumb: `${head} / ${crumbTail}`, title: crumbTail }
}
