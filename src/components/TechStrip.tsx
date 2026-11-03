import {
  SiAndroid,
  SiApple,
  SiFlutter,
  SiLaravel,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiShopify,
  SiUnity,
  SiWordpress,
} from "react-icons/si"

const STACK = [
  ["Shopify", SiShopify],
  ["WordPress", SiWordpress],
  ["Laravel", SiLaravel],
  ["React", SiReact],
  ["Next.js", SiNextdotjs],
  ["Node.js", SiNodedotjs],
  ["Flutter", SiFlutter],
  ["Android", SiAndroid],
  ["iOS", SiApple],
  ["Python", SiPython],
  ["Unity", SiUnity],
] as const

export default function TechStrip() {
  return (
    <section className="social-strip" aria-label="Technologies we build with">
      <span>We build with</span>
      <div className="logos">
        <div className="logos-track">
          {[0, 1].map((copy) => (
            <div className="logos-group" key={copy} aria-hidden={copy === 1}>
              {STACK.map(([name, Icon]) => (
                <b key={name} className="tech">
                  <Icon size={20} aria-hidden /> {name}
                </b>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
