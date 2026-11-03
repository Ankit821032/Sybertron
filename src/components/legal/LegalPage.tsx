import { useRouter as useCmsRoute } from '../../router'
import { CSSProperties, useEffect, useState } from "react"
import { SplitWords } from "../../motion"
import { getLegal, LEGAL } from "@/data/legal"
import GlobalPresence from "../GlobalPresence"
import { Talk } from "../about/AboutPage"

export default function LegalPage() {
  const id = useCmsRoute().path.replace(/\/+$/, "").slice(1)
  const doc = getLegal(id)
  const [intro] = useState(() => (performance.now() < 2500 ? ".95s" : ".1s"))
  const [active, setActive] = useState(0)

  useEffect(() => {
  }, [doc])
  useEffect(() => {
    const hs = Array.from(document.querySelectorAll<HTMLElement>(".lg-doc section"))
    const on = () => {
      let a = 0
      hs.forEach((h, i) => { if (h.getBoundingClientRect().top < window.innerHeight * 0.4) a = i })
      setActive(a)
    }
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [doc])

  if (!doc) return null
  const words = doc.title.split(" ")
  return (
    <>
      <section className="about-hero lg-hero" style={{ "--intro": intro } as CSSProperties}>
        <div className="hero-blob hero-blob--one" data-parallax="0.14" />
        <div className="about-hero-inner">
          <p className="eyebrow"><span /> Legal</p>
          <h1 aria-label={doc.title}>
            <span aria-hidden="true">
              <SplitWords text={words.slice(0, -1).join(" ")} />
              <SplitWords text={words[words.length - 1]} start={words.length - 1} em />
            </span>
          </h1>
          <p className="about-lede">{doc.lede}</p>
          <p className="lg-updated">Last updated {doc.updated}</p>
        </div>
      </section>

      <div className="lg-grid">
        <aside className="lg-side">
          <p>On this page</p>
          <ol>{doc.secs.map((s, i) => <li key={s.id} className={i === active ? "is-on" : undefined}><a href={`#${s.id}`}>{s.h}</a></li>)}</ol>
          <p className="lg-other">Other policies</p>
          <ul>{LEGAL.filter((l) => l.id !== doc.id).map((l) => <li key={l.id}><a href={`/${l.id}`}>{l.title}</a></li>)}</ul>
        </aside>
        <div className="lg-doc">
          {doc.secs.map((s, i) => (
            <section key={s.id} id={s.id} data-reveal>
              <span className="lg-no">{String(i + 1).padStart(2, "0")}</span>
              <h2>{s.h}</h2>
              {s.p.map((t) => <p key={t}>{t}</p>)}
              {s.ul && <ul>{s.ul.map((li) => <li key={li}>{li}</li>)}</ul>}
            </section>
          ))}
        </div>
      </div>
      <GlobalPresence talk={<Talk />} />
    </>
  )
}
