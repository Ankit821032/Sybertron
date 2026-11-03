import { useEffect, useRef, useState } from "react"
import { FOUNDED, locations, stats } from "@/data/company"
import { prefersReducedMotion, useInView } from "../motion"
import { ArrowUpRight, Button3D, Sparkles } from "./ui"

const ROTATING = ["AI system?", "online store?", "mobile app?", "ERP?", "SaaS product?"]
const SERVICES = [
  "AI agent development",
  "Shopify & ecommerce development",
  "iOS & Android app development",
  "Web portal development",
  "SaaS product development",
  "Digital marketing & SEO",
  "AI automation",
  "Custom software development",
]

export default function CallToAction() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const [w, setW] = useState(0)

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return
    const id = setInterval(() => setW((n) => (n + 1) % ROTATING.length), 2400)
    return () => clearInterval(id)
  }, [inView])

  return (
    <section className="cta-section" id="contact" data-reveal ref={ref}>
      <div className="cta-star" data-parallax="0.12">
        <Sparkles size={32} />
      </div>
      <p className="eyebrow">
        <span /> Software development company
        {locations.map((l) => ` · ${l}`)}
      </p>
      <h2>
        Ready to build your
        <br />
        website, app or
        <br />
        <em className="rotator">
          <span key={w}>{ROTATING[w]}</span>
        </em>
      </h2>
      <p>
        Since {FOUNDED} we have delivered more than{" "}
        {stats[0].value.toLocaleString("en-US")} projects: custom websites and
        web portals, Shopify and WooCommerce stores, iOS and Android apps, AI
        agents and automations, SaaS products, ERP systems and digital
        marketing. Tell us what you need and we will reply within one business
        day.
      </p>
      <div className="cta-actions">
        <Button3D href="#quote" tone="mint">
          Get a free project quote <ArrowUpRight size={17} />
        </Button3D>
        <Button3D href="#products" tone="paper">
          Try a product demo
        </Button3D>
      </div>
      <div className="cta-services">
        <p>Popular services</p>
        <ul>
          {SERVICES.map((s) => (
            <li key={s}>
              <a className="text-link" href="#services">
                {s}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
