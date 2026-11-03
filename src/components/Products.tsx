import { useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { products } from "@/data/products"
import { useInView } from "../motion"
import ProductMock from "./ProductMock"
import { Button3D } from "./ui"

const DURATION = 6 // seconds per product

export default function Products() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const [i, setI] = useState(0)
  const [hover, setHover] = useState(false)
  const p = products[i]
  const paused = hover || !inView

  return (
    <section className="showcase products" id="products" ref={ref}>
      <div className="showcase-intro" data-reveal>
        <p>Try a live demo</p>
        <h2>
          Our products,
          <br />
          <em>ready to run.</em>
        </h2>
      </div>

      <div
        className="browser-card"
        data-reveal="scale"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="browser-bar">
          <div>
            <i />
            <i />
            <i />
          </div>
          <span key={p.id} className="url-swap">
            {p.url}
          </span>
          <button aria-label={`Open ${p.name}`}>
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="product-stage">
          <div className="product-mock" data-tilt>
            <div key={p.id} className="product-mock-swap">
              <ProductMock m={p.mock} />
            </div>
          </div>

          <div className="product-copy" key={p.id}>
            <p className="product-cat">
              <i style={{ background: p.accent }} /> {p.category}
            </p>
            <h3>{p.name}</h3>
            <p className="product-blurb">{p.blurb}</p>
            <ul>
              {p.bullets.map((b) => (
                <li key={b}>
                  <i style={{ background: p.accent }} />
                  {b}
                </li>
              ))}
            </ul>
            <p className="product-platforms">{p.platforms}</p>
            <div className="product-actions">
              <Button3D href="#contact" tone="mint">
                Explore demo <ArrowRight size={17} />
              </Button3D>
              <Button3D href="#contact" tone="paper">
                Book a demo
              </Button3D>
            </div>
          </div>
        </div>
      </div>

      <div className="product-tabs" role="tablist" aria-label="Products" data-reveal>
        {products.map((x, k) => {
          const on = k === i
          return (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setI(k)}
              className="product-tab"
            >
              {x.name}
              {on && (
                <span
                  key={x.id}
                  className="p-fill"
                  style={{
                    animationDuration: `${DURATION}s`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                  onAnimationEnd={() => setI((n) => (n + 1) % products.length)}
                />
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
