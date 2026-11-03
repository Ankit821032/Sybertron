import { CSSProperties } from "react"
import { projects } from "@/data/work"
import { BrowserFrame, mocks } from "./WorkMocks"
import { ArrowUpRight, Button3D } from "./ui"

const BUBBLES = [
  ["8%", ".9rem", "0s"],
  ["22%", ".5rem", "1.4s"],
  ["41%", "1.2rem", "2.6s"],
  ["63%", ".6rem", ".7s"],
  ["79%", "1rem", "3.3s"],
  ["92%", ".5rem", "2s"],
]
const TONES = ["blue", "green", "pink", "yellow", "lilac"]

export default function Work() {
  return (
    <section className="projects" id="work">
      <div className="projects-heading" data-reveal>
        <p className="eyebrow">
          <span /> Recent work
        </p>
        <h2>
          Stores, platforms
          <br />
          <em>and games we shipped.</em>
        </h2>
        <p className="projects-sub">
          Online stores, platforms, business websites and games we&apos;ve
          designed and built for our clients.
        </p>
      </div>
      <div className="project-stack">
        {projects.map((p, index) => {
          const Mock = mocks[p.id]
          return (
            <article
              className={`project-card project-card--${TONES[index % TONES.length]}`}
              key={p.id}
              data-tilt
              data-cursor="View"
              style={{ "--card-index": index } as CSSProperties}
            >
              <div className="bubbles" aria-hidden="true">
                {BUBBLES.map(([x, size, delay], b) => (
                  <i
                    key={b}
                    style={{ "--x": x, "--s": size, "--d": delay } as CSSProperties}
                  />
                ))}
              </div>
              <div className="project-card-copy">
                <span>
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>
                <h3 className={p.name.length > 9 ? "is-long" : undefined}>{p.name}</h3>
                <p>{p.summary}</p>
                <div>
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="project-visual">
                <div className="project-frame">
                  <BrowserFrame url={p.url}>
                    <Mock />
                  </BrowserFrame>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      <div className="projects-more" data-reveal>
        <Button3D href="/work" tone="ink">
          See all work <ArrowUpRight size={17} />
        </Button3D>
      </div>
    </section>
  )
}
