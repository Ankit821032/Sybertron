import { Button3D, ArrowUpRight, Menu } from "./ui"
import type { Route } from "../router"

export const NAV = ["Services", "Products", "Work", "About", "Careers"] as const

export function Wordmark({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={footer ? "brand-logo brand-logo--footer" : "brand-logo"}
      href="/"
      aria-label="Sybertron Technologies home"
    >
      <img
        src={footer ? "/logo-horizontal-white.svg" : "/logo-horizontal-black.svg"}
        alt="Sybertron Technologies"
        width={footer ? 260 : 156}
        height={footer ? 64 : 38}
      />
    </a>
  )
}

export default function Header({
  hidden,
  menuOpen,
  setMenuOpen,
  route = "home",
}: {
  route?: Route
  hidden: boolean
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}) {
  const section = route === "product" ? "products" : route === "service" ? "services" : route
  return (
    <header className={hidden ? "site-header is-hidden" : "site-header"}>
      <Wordmark />

      <nav
        className={menuOpen ? "nav-links is-open" : "nav-links"}
        aria-label="Main navigation"
      >
        {NAV.map((label) => (
          <a
            key={label}
            href={label === "Careers" ? "/careers" : `/${label.toLowerCase()}`}
            className={section === label.toLowerCase() ? "is-active" : undefined}
            aria-current={section === label.toLowerCase() ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
        <a
          className={route === "urgent" ? "nav-urgent is-active" : "nav-urgent"}
          href="/urgent"
          aria-current={route === "urgent" ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          <i /> RAPID RESPONSE
        </a>
      </nav>

      <div className="header-actions">
        <a
          className={route === "urgent" ? "urgent-pill is-active" : "urgent-pill"}
          href="/urgent"
          aria-current={route === "urgent" ? "page" : undefined}
        >
          <i /> RAPID RESPONSE
        </a>
        <Button3D href="/start" tone="ink">
          Start a project <ArrowUpRight size={17} />
        </Button3D>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  )
}
