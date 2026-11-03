import { CmsContext } from './cms/runtime'
import { useEffect, useState, useContext } from "react"
import { catalog } from "@/data/catalog"
import { DETAILS } from "@/data/serviceDetail"
import { posts } from "@/data/blog"

export type Route = "home" | "about" | "products" | "work" | "services" | "careers" | "start" | "urgent" | "product" | "service" | "blog" | "post" | "legal" | "lite" | "notfound"
const PAGES: Record<string, Route> = { "/about": "about", "/products": "products", "/work": "work", "/services": "services", "/careers": "careers", "/start": "start", "/urgent": "urgent", "/blog": "blog", "/privacy": "legal", "/terms": "legal", "/cookies": "legal", "/lite": "lite" }
const norm = (path: string) => path.replace(/\/+$/, "")
/* "/products/hisaabii" style detail pages */
export const productIdOf = (path: string): string | null => {
  const m = norm(path).match(/^\/products\/([^/]+)$/)
  return m ? decodeURIComponent(m[1]) : null
}
/* "/services/ai" style detail pages */
export const serviceIdOf = (path: string): string | null => {
  const m = norm(path).match(/^\/services\/([^/]+)$/)
  return m ? decodeURIComponent(m[1]) : null
}
export const postSlugOf = (path: string): string | null => {
  const m = norm(path).match(/^\/blog\/([^/]+)$/)
  return m ? decodeURIComponent(m[1]) : null
}
export const postHref = (slug: string) => `/blog/${slug}`
export const serviceHref = (id: string) => `/services/${id}`
export const productHref = (id: string) => `/products/${id}`
const toRoute = (path: string): Route => {
  const id = productIdOf(path)
  if (id) return catalog.some((p) => p.id === id) ? "product" : "products"
  const sid = serviceIdOf(path)
  if (sid) return DETAILS.some((d) => d.id === sid) ? "service" : "services"
  const slug = postSlugOf(path)
  if (slug) return posts.some((p) => p.slug === slug) ? "post" : "notfound"
  const n = norm(path)
  return PAGES[n] ?? (n === "" ? "home" : "notfound")
}
const isKnown = (path: string) => norm(path) === "" || norm(path) in PAGES || productIdOf(path) !== null || serviceIdOf(path) !== null || postSlugOf(path) !== null

/* Anchors that exist on both pages stay local; the rest point back to the home page. */
const LOCAL_ON_ABOUT = ["#contact", "#locations"]
export const hrefFor = (href: string, route: Route) =>
  route !== "home" && href.startsWith("#") && !LOCAL_ON_ABOUT.includes(href)
    ? `/${href}`
    : href

/* Programmatic navigation for buttons that are not anchors (the hero chips, for example). */
export function navigate(path: string) {
  window.location.assign(path)
}

/* Tiny client-side router for "/" and "/about" (no dependency). */
export function useRouter(): { route: Route; path: string } {
  const server = useContext(CmsContext)
  const [path, setPath] = useState<string>(() => norm(typeof location === "undefined" ? server.path : location.pathname))

  useEffect(() => {
    const sync = () => setPath(norm(location.pathname))

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href]")
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin) return
      if (!isKnown(url.pathname)) return // unknown path: let the browser handle it
      if (url.pathname === location.pathname && url.hash) return // same-page anchor: native smooth scroll

      return // native navigation keeps SSR metadata and CMS snapshots current
      e.preventDefault()
      history.pushState(null, "", url.pathname + url.search + url.hash)
      setPath(norm(url.pathname))
      window.setTimeout(() => {
        const target = url.hash ? document.querySelector(url.hash) : null
        if (target) target.scrollIntoView({ behavior: "smooth" })
        else window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
      }, 60)
    }

    window.addEventListener("popstate", sync)
    document.addEventListener("click", onClick)
    return () => {
      window.removeEventListener("popstate", sync)
      document.removeEventListener("click", onClick)
    }
  }, [])

  return { route: toRoute(path), path }
}

export const useRoute = (): Route => useRouter().route
