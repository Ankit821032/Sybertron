import { useEffect, useState } from "react"
import { Cursor, WaveDivider, useMotion } from "./motion"
import Header from "./components/Header"
import Hero from "./components/Hero"
import TechStrip from "./components/TechStrip"
import Services from "./components/Services"
import Timeline from "./components/Timeline"
import Products from "./components/Products"
import Process from "./components/Process"
import Work from "./components/Work"
import Testimonials from "./components/Testimonials"
import GlobalPresence from "./components/GlobalPresence"
import CallToAction from "./components/CallToAction"
import Footer from "./components/Footer"
import ChatLauncher from "./components/ChatLauncher"
import AboutPage from "./components/about/AboutPage"
import ProductsPage from "./components/products/ProductsPage"
import ProductDetailPage from "./components/products/ProductDetailPage"
import WorkPage from "./components/work/WorkPage"
import StartPage from "./components/start/StartPage"
import UrgentPage from "./components/urgent/UrgentPage"
import CareersPage from "./components/careers/CareersPage"
import ServicesPage from "./components/services/ServicesPage"
import ServiceDetailPage from "./components/services/ServiceDetailPage"
import BlogPage from "./components/blog/BlogPage"
import BlogPostPage from "./components/blog/BlogPostPage"
import LegalPage from "./components/legal/LegalPage"
import NotFoundPage from "./components/misc/NotFoundPage"
import LitePage from "./components/misc/LitePage"
import CookieSettings from "./components/misc/CookieSettings"
import { useRouter } from "./router"

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)
  const { route, path } = useRouter()
  useMotion(["product", "service", "post", "legal"].includes(route) ? path : route)

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]")
    if (reduceMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    )
    revealItems.forEach((item) => observer.observe(item))

    let previousY = window.scrollY
    const updateScroll = () => {
      const currentY = window.scrollY
      document.documentElement.style.setProperty(
        "--scroll-progress",
        `${Math.min(1, currentY / (document.documentElement.scrollHeight - window.innerHeight))}`,
      )
      setHeaderHidden(currentY > previousY && currentY > 220)
      previousY = currentY
    }
    window.addEventListener("scroll", updateScroll, { passive: true })
    updateScroll()
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", updateScroll)
    }
  }, [route, path])

  if (route === "lite") return <LitePage />

  return (
    <div className="site-shell">
      <div className="curtain" aria-hidden="true">
        <img src="/logo-horizontal-white.svg" alt="" />
      </div>
      <Cursor />
      <div className="scroll-progress" aria-hidden="true" />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header
        hidden={headerHidden && !menuOpen}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        route={route}
      />

      <main id="main" key={path}>
        {route === "about" ? (
          <AboutPage />
        ) : route === "products" ? (
          <ProductsPage />
        ) : route === "product" ? (
          <ProductDetailPage />
        ) : route === "start" ? (
          <StartPage />
        ) : route === "urgent" ? (
          <UrgentPage />
        ) : route === "careers" ? (
          <CareersPage />
        ) : route === "blog" ? (
          <BlogPage />
        ) : route === "post" ? (
          <BlogPostPage />
        ) : route === "legal" ? (
          <LegalPage />
        ) : route === "notfound" ? (
          <NotFoundPage />
        ) : route === "service" ? (
          <ServiceDetailPage />
        ) : route === "services" ? (
          <ServicesPage />
        ) : route === "work" ? (
          <WorkPage />
        ) : (
          <>
        <Hero />
        <TechStrip />
        <Services />
        <Timeline />
        <Products />
        <Process />
        <WaveDivider from="#111512" to="#faf8f1" />
        <Work />
        <Testimonials />
        <GlobalPresence />
        <WaveDivider from="#faf8f1" to="#ffd764" />
        <CallToAction />
          </>
        )}
      </main>

      <Footer route={route} />
      <ChatLauncher />
      <CookieSettings />
    </div>
  )
}
