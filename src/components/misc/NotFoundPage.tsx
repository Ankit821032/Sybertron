import { CSSProperties, useEffect, useState } from "react"
import { ArrowRight, Home } from "lucide-react"
import { SplitWords } from "../../motion"
import { Button3D } from "../ui"

const LINKS: [string, string][] = [["Services", "/services"], ["Products", "/products"], ["Work", "/work"], ["Blog", "/blog"], ["Careers", "/careers"], ["RAPID RESPONSE", "/urgent"]]

export default function NotFoundPage() {
  const [intro] = useState(() => (performance.now() < 2500 ? ".95s" : ".1s"))
  return (
    <section className="about-hero nf-hero" style={{ "--intro": intro } as CSSProperties}>
      <div className="hero-blob hero-blob--one" data-parallax="0.14" />
      <div className="about-hero-inner nf-inner">
        <p className="eyebrow"><span /> Error 404</p>
        <div className="nf-num" aria-hidden="true"><span>4</span><span className="nf-o">0</span><span>4</span></div>
        <h1 aria-label="This page wandered off"><span aria-hidden="true"><SplitWords text="This page" /><SplitWords text="wandered off" start={2} em /></span></h1>
        <p className="about-lede">The link may be old or mistyped. Head home or jump to one of these.</p>
        <div className="nf-actions">
          <Button3D tone="mint" href="/"><Home size={16} /> Back home</Button3D>
          <Button3D tone="paper" href="/start">Start a project <ArrowRight size={16} /></Button3D>
        </div>
        <ul className="nf-links">{LINKS.map(([l, h]) => <li key={h}><a href={h}>{l} <ArrowRight size={14} aria-hidden /></a></li>)}</ul>
      </div>
    </section>
  )
}
