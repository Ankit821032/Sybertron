import Photo from "../Photo"
import { CSSProperties, ReactNode, useState } from "react"
import {
  Bot,
  Cloud,
  Code2,
  Cpu,
  Gamepad2,
  Glasses,
  Megaphone,
  MonitorSmartphone,
  Puzzle,
  Server,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles as SparklesIcon,
  Workflow,
  type LucideIcon,
} from "lucide-react"
import {
  SiAndroid, SiAnthropic, SiApple, SiExpress, SiFirebase, SiGoogleads, SiGoogleanalytics, SiGooglecloud,
  SiGooglegemini, SiLaravel, SiMeta, SiMongodb, SiMysql, SiNextdotjs, SiNodedotjs, SiPostgresql, SiReact,
  SiShopify, SiTailwindcss, SiUnity, SiWix, SiWoocommerce, SiWordpress,
} from "react-icons/si"
import { SplitWords } from "../../motion"
import { ArrowRight } from "../ui"
import { Proposal } from "../Process"
import GlobalPresence from "../GlobalPresence"
import { Talk } from "../about/AboutPage"

export type Service = { id: string; title: string; desc: string; Icon: LucideIcon; art: ReactNode; tone: string; size?: "lg" }

/* Order matters: the first card fills a 2x2 block, the rest are single cells. */
export const SERVICES: Service[] = [
  { id: "ai", title: "AI Automations", desc: "AI agents, chatbots and automated workflows that take repetitive work off your team.", Icon: Cpu, art: <Photo kind="cloud" />, tone: "lilac", size: "lg" },
  { id: "ai-agents", title: "AI Agent Development", desc: "Custom AI agents that plan, act and finish multi-step work across your tools.", Icon: Bot, art: <Photo kind="code" />, tone: "blue" },
  { id: "ai-models", title: "AI Model Integration", desc: "Bring GPT, Claude, Gemini and open-source models into your products and systems.", Icon: Workflow, art: <Photo kind="cloud" />, tone: "pink" },
  { id: "web-portals", title: "Web Portals", desc: "Customer, partner and staff portals with dashboards, roles and self-service.", Icon: MonitorSmartphone, art: <Photo kind="team" />, tone: "mint" },
  { id: "ecommerce", title: "Ecommerce", desc: "Online stores on Shopify, WooCommerce, Magento and more, or a custom cart, built to sell.", Icon: ShoppingCart, art: <Photo kind="fashion" />, tone: "yellow" },
  { id: "mobile-apps", title: "Mobile Apps", desc: "Native and cross-platform apps for iOS and Android, from first sketch to store.", Icon: Smartphone, art: <Photo kind="mobile" />, tone: "pink" },
  { id: "games", title: "Game Development", desc: "Mobile, PC and web games, from first prototype to store launch and live updates.", Icon: Gamepad2, art: <Photo kind="gaming" />, tone: "blue" },
  { id: "ar-vr", title: "AR/VR", desc: "Augmented and virtual reality for training, retail, property and events.", Icon: Glasses, art: <Photo kind="vr" />, tone: "coral" },
  { id: "marketing", title: "Digital Marketing", desc: "Brand, search, paid, social, content and analytics run as one growth engine.", Icon: Megaphone, art: <Photo kind="analytics" />, tone: "mint" },
  { id: "custom", title: "Custom Development", desc: "Software built the way you work, from a small internal tool to a full platform.", Icon: Code2, art: <Photo kind="code" />, tone: "yellow" },
  { id: "plugins", title: "Plugin Development", desc: "Plugins and apps that extend WordPress, Shopify, Magento and Wix.", Icon: Puzzle, art: <Photo kind="code" />, tone: "lilac" },
  { id: "erp", title: "ERP Systems", desc: "Enterprise resource planning built for your business, at a price you can afford.", Icon: Server, art: <Photo kind="logistics" />, tone: "blue" },
  { id: "saas", title: "SaaS Product Development", desc: "Subscription software built to launch, sell and scale, from MVP to multi-tenant platform.", Icon: SparklesIcon, art: <Photo kind="analytics" />, tone: "mint" },
]

type Chip = [string, (p: { size?: number }) => ReactNode]
const GROUPS: { label: string; items: Chip[] }[] = [
  { label: "Ecommerce & CMS", items: [["Shopify", SiShopify], ["WooCommerce", SiWoocommerce], ["Magento", ShoppingBag], ["WordPress", SiWordpress], ["Wix", SiWix]] },
  { label: "Web & SaaS", items: [["Laravel", SiLaravel], ["React", SiReact], ["Next.js", SiNextdotjs], ["Node.js", SiNodedotjs], ["Express", SiExpress], ["Tailwind CSS", SiTailwindcss]] },
  { label: "Mobile apps", items: [["React Native", SiReact], ["iOS", SiApple], ["Android", SiAndroid], ["Firebase", SiFirebase]] },
  { label: "AI models", items: [["OpenAI", Bot], ["Claude", SiAnthropic], ["Google Gemini", SiGooglegemini]] },
  { label: "Cloud & data", items: [["AWS", Cloud], ["Google Cloud", SiGooglecloud], ["MySQL", SiMysql], ["PostgreSQL", SiPostgresql], ["MongoDB", SiMongodb]] },
  { label: "Games & AR/VR", items: [["Unity", SiUnity], ["Meta Quest", SiMeta]] },
  { label: "Marketing", items: [["Google Ads", SiGoogleads], ["Google Analytics", SiGoogleanalytics], ["Meta Ads", SiMeta]] },
]

/* ---------------------------------------------------------------- hero */
function ServicesHero() {
  // on a fresh page load the intro curtain is still covering the page, so wait for it
  const [intro] = useState(() => (performance.now() < 2500 ? ".95s" : ".1s"))
  return (
    <section className="about-hero services-hero" style={{ "--intro": intro } as CSSProperties}>
      <div className="hero-blob hero-blob--one" data-parallax="0.14" />
      <div className="about-hero-inner">
        <p className="eyebrow">
          <span /> What we do
        </p>
        <h1 aria-label="Our services">
          <span aria-hidden="true">
            <SplitWords text="Our" />
            <SplitWords text="services" start={1} em />
          </span>
        </h1>
        <p className="about-lede">
          Pick a discipline to see what we deliver, or tell us the problem and we&apos;ll point the right people at it.
        </p>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- grid */
function ServiceGrid() {
  return (
    <section className="section services services-page-grid" id="services">
      <div className="service-grid service-grid--bento" data-reveal>
        {SERVICES.map((s, index) => (
          <a
            href={`/services/${s.id}`}
            id={s.id}
            className={`service-card service-card--${s.tone}${s.size ? ` service-card--${s.size}` : ""}`}
            key={s.id}
            data-tilt
            style={{ "--stagger": index } as CSSProperties}
          >
            <div className="service-top">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span className="icon-bubble">
                <s.Icon size={20} />
              </span>
            </div>
            <div className="service-art">{s.art}</div>
            <div className="service-text">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
            <span className="card-arrow">
              <ArrowRight size={20} />
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- stack */
function Stack() {
  return (
    <section className="section stack" id="technologies">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">
            <span /> Our toolbox
          </p>
          <h2>
            Platforms and technologies
            <br />
            <em>we build with</em>
          </h2>
        </div>
        <p>The tools behind our client projects and our own products, grouped by the service they power.</p>
      </div>

      <div className="stack-list rv-stagger" data-reveal>
        {GROUPS.map((g, gi) => (
          <div className="stack-row" key={g.label} style={{ "--stagger": gi } as CSSProperties}>
            <h3>{g.label}</h3>
            <ul>
              {g.items.map(([name, Icon]) => (
                <li key={name}>
                  <Icon size={16} />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="stack-note">Product names and logos are trademarks of their owners and are shown only to describe what we build with.</p>
    </section>
  )
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServiceGrid />
      <Proposal />
      <Stack />
      <GlobalPresence talk={<Talk />} />
    </>
  )
}
