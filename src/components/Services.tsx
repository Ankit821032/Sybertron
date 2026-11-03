import Photo from "./Photo"
import { CSSProperties, ReactNode } from "react"
import {
  Cpu,
  Gamepad2,
  Glasses,
  Megaphone,
  MonitorSmartphone,
  ShoppingCart,
  Smartphone,
  type LucideIcon,
} from "lucide-react"
import { ArrowRight, SectionHeading } from "./ui"

type Service = {
  id: string
  title: string
  desc: string
  Icon: LucideIcon
  art: ReactNode
  tone: string
  size: "lg" | "md" | "wide"
}

const SERVICES: Service[] = [
  {
    id: "ai",
    title: "AI Automations",
    desc: "AI agents, chatbots and automated workflows that take repetitive work off your team.",
    Icon: Cpu,
    art: <Photo kind="cloud" />,
    tone: "lilac",
    size: "lg",
  },
  {
    id: "web-portals",
    title: "Web Portals",
    desc: "Customer, partner and staff portals with dashboards, roles and self-service.",
    Icon: MonitorSmartphone,
    art: <Photo kind="team" />,
    tone: "mint",
    size: "md",
  },
  {
    id: "ecommerce",
    title: "Ecommerce",
    desc: "Online stores on Shopify, WooCommerce, Magento and more, or a custom cart, built to sell.",
    Icon: ShoppingCart,
    art: <Photo kind="fashion" />,
    tone: "yellow",
    size: "md",
  },
  {
    id: "mobile-apps",
    title: "Mobile Apps",
    desc: "Native and cross-platform apps for iOS and Android, from first sketch to store.",
    Icon: Smartphone,
    art: <Photo kind="mobile" />,
    tone: "pink",
    size: "md",
  },
  {
    id: "games",
    title: "Game Development",
    desc: "Mobile, PC and web games, from first prototype to store launch and live updates.",
    Icon: Gamepad2,
    art: <Photo kind="gaming" />,
    tone: "blue",
    size: "md",
  },
  {
    id: "ar-vr",
    title: "AR/VR",
    desc: "Augmented and virtual reality for training, retail, property and events.",
    Icon: Glasses,
    art: <Photo kind="vr" />,
    tone: "coral",
    size: "wide",
  },
  {
    id: "marketing",
    title: "Digital Marketing",
    desc: "Brand, search, paid, social, content and analytics run as one growth engine.",
    Icon: Megaphone,
    art: <Photo kind="analytics" />,
    tone: "mint",
    size: "wide",
  },
]

export default function Services() {
  return (
    <section className="section services" id="services">
      <SectionHeading
        eyebrow="What we do"
        title="Serious skills."
        em="Zero stiff vibes."
        copy="Design, development and marketing from one team, so you don't have to manage three agencies."
      />

      <div className="service-grid service-grid--bento" data-reveal>
        {SERVICES.map((s, index) => (
          <a
            href={`/services/${s.id}`}
            className={`service-card service-card--${s.tone} service-card--${s.size}`}
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

      <div className="services-more" data-reveal>
        <a href="/services" className="text-link">
          See all services, including AI agents, SaaS, custom development and ERP
        </a>
      </div>
    </section>
  )
}
