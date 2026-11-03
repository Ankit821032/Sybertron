import { CSSProperties, useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { categories, catalog, type CatalogItem } from "@/data/catalog"
import { SplitWords, useInView } from "../../motion"
import { Button3D } from "../ui"
import { goToContact } from "../Hero"
import GlobalPresence from "../GlobalPresence"
import ProductMock from "../ProductMock"
import { Talk } from "../about/AboutPage"
import { productHref } from "../../router"

const catLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? ""

function ProductCard({ p, flip }: { p: CatalogItem; flip: boolean }) {
  const ref = useRef<HTMLElement>(null)
  // the mock-up animates in when the card scrolls into view, not on page load
  const seen = useInView(ref, { once: true, amount: 0.3 })
  return (
    <article id={`p-${p.id}`} ref={ref} className={flip ? "pp-card is-flip" : "pp-card"} data-reveal>
      <div className="pp-copy">
        <p className="pp-family">
          <i style={{ background: p.accent }} /> {catLabel(p.cat)}
        </p>
        <h3>{p.name}</h3>
        <p className="pp-blurb">{p.blurb}</p>
        <ul>
          {p.bullets.map((b) => (
            <li key={b}>
              <i style={{ background: p.accent }} />
              {b}
            </li>
          ))}
        </ul>
        <p className="pp-platforms">{p.platforms}</p>
        <div className="pp-actions">
          <Button3D tone="ink" onClick={() => goToContact(`Demo of ${p.name}`)}>
            Explore demo <ArrowRight size={16} />
          </Button3D>
          <Button3D tone="paper" href={productHref(p.id)}>
            Details
          </Button3D>
        </div>
      </div>
      <div className="pp-mock" data-tilt data-cursor="Demo">
        <div className="pp-mock-inner"><ProductMock m={p.mock} /></div>
      </div>
    </article>
  )
}

export default function ProductsPage() {
  const [active, setActive] = useState(categories[0].id)
  const [intro] = useState(() => (performance.now() < 2500 ? ".95s" : ".1s"))
  const groups = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.cat ?? "")
        }),
      { rootMargin: "-25% 0px -65% 0px" },
    )
    groups.current.forEach((g) => g && spy.observe(g))
    return () => spy.disconnect()
  }, [])

  return (
    <>
      <section className="pp-hero" style={{ "--intro": intro } as CSSProperties}>
        <div className="hero-blob hero-blob--one" data-parallax="0.14" />
        <div className="pp-hero-inner">
          <p className="eyebrow">
            <span /> {catalog.length} ready-made products
          </p>
          <h1 aria-label="Our products, ready to run.">
            <span aria-hidden="true">
              <SplitWords text="Our products," />
              <br />
              <SplitWords text="ready to run." start={2} em />
            </span>
          </h1>
          <p className="pp-lede">
            Ready-made software we build and support ourselves. Each one can be set up for your business. Try any of
            them yourself, or book a guided demo.
          </p>
        </div>
      </section>

      <div className="pp-layout">
        <nav className="pp-cats" aria-label="Product categories">
          <p>Categories</p>
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                <a href={`#cat-${c.id}`} className={active === c.id ? "is-active" : undefined}>
                  <span>{c.label}</span>
                  <b>{catalog.filter((p) => p.cat === c.id).length}</b>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pp-groups">
          {categories.map((c, ci) => (
            <section
              key={c.id}
              id={`cat-${c.id}`}
              data-cat={c.id}
              ref={(el) => {
                groups.current[ci] = el
              }}
              className="pp-group"
              style={{ "--tone": c.tone } as CSSProperties}
            >
              <h2 className="pp-group-title" data-reveal>
                <i /> {c.label}
              </h2>
              {catalog
                .filter((p) => p.cat === c.id)
                .map((p, i) => (
                  <ProductCard key={p.id} p={p} flip={i % 2 === 1} />
                ))}
            </section>
          ))}

          <aside className="pp-fit" data-reveal="scale">
            <h2>
              Not sure which <em>one fits?</em>
            </h2>
            <p>Tell us about your business and we&apos;ll recommend the right product, or a custom build.</p>
            <div className="pp-actions">
              <Button3D tone="mint" onClick={() => goToContact("Book a guided demo")}>
                Book a guided demo <ArrowRight size={16} />
              </Button3D>
              <Button3D tone="paper" onClick={() => goToContact("Help me choose a product")}>
                Ask us
              </Button3D>
            </div>
          </aside>
        </div>
      </div>

      <GlobalPresence talk={<Talk />} />
    </>
  )
}
