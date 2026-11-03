import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6"
import { FOUNDED } from "@/data/company"
import { footerGroups, legalLinks, socials, utilityLinks } from "@/data/footer"
import { offices } from "@/data/offices"
import { Wordmark } from "./Header"
import { hrefFor, type Route } from "../router"

const ICONS = { facebook: FaFacebook, instagram: FaInstagram, linkedin: FaLinkedin } as const

export default function Footer({ route = "home" }: { route?: Route }) {
  return (
    <footer>
      <div className="footer-brand">
        <Wordmark footer />
        <p>
          Websites, apps, AI and marketing for growing businesses since {FOUNDED}.
        </p>
        <ul className="footer-socials">
          {socials.map((s) => {
            const Icon = ICONS[s.id as keyof typeof ICONS]
            return (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <Icon size={17} aria-hidden />
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      <nav className="footer-groups" aria-label="Footer">
        {footerGroups.map((g) => (
          <div key={g.title}>
            <h2>{g.title}</h2>
            <ul>
              {g.links.map((l) => (
                <li key={l.label}>
                  <a href={hrefFor(l.href, route)}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="footer-meta">
        <span>&copy; {new Date().getFullYear()} Sybertron Technologies. All rights reserved.</span>
        <ul>
          {legalLinks.map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
          {utilityLinks.map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <ul>
          {offices.map((o) => (
            <li key={o.id}>
              <a href="#locations">{o.city}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
