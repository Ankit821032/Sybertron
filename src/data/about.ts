import { roles } from "./careers"
/* SAMPLE CONTENT: replace with Sybertron's real story, products and promises. */
import { FOUNDED } from "./company"
import { catalogNames } from "./catalog"

export const officeNotes: Record<string, string> = {
  california: "US clients, since 2010",
  london: "Client team, since 2015",
  dubai: "UAE and Gulf region, since 2019",
  delhi: `Where it started, in ${FOUNDED}`,
}

export type Chapter = { year: number; label: string; title: string; text: string }

export const chapters: Chapter[] = [
  { year: FOUNDED, label: "Founded", title: "Sybertron is founded in Delhi, India", text: "We start out with a focus on custom websites and web development for growing businesses." },
  { year: 2010, label: "California", title: "Presence in California", text: "Our first base outside India brings us closer to clients in the United States." },
  { year: 2012, label: "First product", title: "Our first product: timesheet management", text: "We develop our first in-house product, a timesheet management system for tracking staff hours and project time." },
  { year: 2014, label: "100 websites", title: "100 websites delivered", text: "We reach 100 websites delivered to clients." },
  { year: 2015, label: "London", title: "Presence in London", text: "We start working in London to serve clients across the United Kingdom." },
  { year: 2016, label: "Mobile", title: "First mobile app launched", text: "We develop our first mobile app, and mobile development becomes a core service." },
  { year: 2018, label: "Enterprise", title: "Enterprise systems and ERP", text: "We extend our services to ERP, dashboards and workflow platforms for larger organisations." },
  { year: 2019, label: "Dubai", title: "Presence in Dubai", text: "We set up in Dubai to support clients in the UAE and the wider Gulf region." },
  { year: 2020, label: "Marketing", title: "360° digital marketing", text: "We add SEO, paid media and content, so clients can build and grow with one team." },
  { year: 2021, label: "SaaS", title: "Our SaaS range launches", text: "We launch software for SMEs, shaped by what we keep hearing from client teams." },
  { year: 2023, label: "AI", title: "AI development practice", text: "We introduce AI agents, chatbots and document automation for clients and our own products." },
  { year: new Date().getFullYear(), label: "Today", title: "28 in-house products", text: "Today we offer 28 in-house products alongside client work, with a presence in four countries." },
]

export const ownProducts = catalogNames

export const promises = [
  { title: "Expertise and experience", text: "Project managers, analysts, designers, developers and QA engineers who have shipped more than 1,000 projects together." },
  { title: "New technology, tested first", text: "We try new tools on our own products before we suggest them to you, so you only pay for what has proved itself." },
  { title: "Built around your business", text: "We start by learning how your business runs, then build to fit it, rather than squeezing you into a template." },
  { title: "Reliable support", text: "Many of our clients have been with us for years. We look after their sites and apps after launch and fix problems before they cost money." },
]

export const mission = {
  tag: "Mission", when: "Today",
  title: "Help every business run better, and keep getting better at it ourselves.",
  points: [
    { icon: "cpu", text: "Learn new technology early, and use it carefully" },
    { icon: "bulb", text: "A team that cares about the details" },
    { icon: "trend", text: "Help clients run smoother and get more done" },
  ],
}
export const vision = {
  tag: "Vision", when: "Tomorrow",
  title: "Technology that once took a big budget, within reach of every business.",
  points: [
    { icon: "rocket", text: "Custom software, cloud and AI at small-business prices" },
    { icon: "users", text: "Better ways to reach and keep customers" },
    { icon: "support", text: "Real people who answer when you need them" },
  ],
}

export const openRoles = roles.filter((r) => r.open).length
export const contactInfo = { email: "hello@sybertron.com", whatsapp: "https://wa.me/10000000000" }
