import { useEffect, useRef, useState } from "react"
import { Cookie, X } from "lucide-react"
import { Button3D } from "../ui"

const KEY = "cookie-prefs"
type Prefs = { analytics: boolean; marketing: boolean }
const read = (): Prefs | null => { try { return JSON.parse(localStorage.getItem(KEY) ?? "null") } catch { return null } }

/* Opens from any link to #cookie-settings (the footer link) and from a first-visit banner. */
export default function CookieSettings() {
  const [open, setOpen] = useState(false)
  const [banner, setBanner] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>({ analytics: false, marketing: false })
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = read()
    if (saved) setPrefs(saved)
    else {
      const t = setTimeout(() => setBanner(true), 2800)
      return () => clearTimeout(t)
    }
  }, [])
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href="#cookie-settings"]')
      if (!a) return
      e.preventDefault()
      setBanner(false)
      setOpen(true)
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])
  useEffect(() => {
    if (!open) return
    box.current?.focus()
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", esc)
    return () => window.removeEventListener("keydown", esc)
  }, [open])

  const save = (p: Prefs) => {
    setPrefs(p)
    try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* storage blocked */ }
    setOpen(false)
    setBanner(false)
  }
  const rows: [keyof Prefs | "necessary", string, string][] = [
    ["necessary", "Necessary", "Keep the site working and remember this choice. Always on."],
    ["analytics", "Analytics", "Show us which pages are useful so we can improve them."],
    ["marketing", "Marketing", "Measure campaigns and show relevant ads elsewhere."],
  ]
  return (
    <>
      {banner && !open && (
        <div className="ck-banner" role="region" aria-label="Cookie notice">
          <Cookie size={20} aria-hidden />
          <p>We use cookies to run the site and, if you agree, to understand how it is used. <a href="/cookies">Cookie policy</a></p>
          <div>
            <button type="button" className="ck-link" onClick={() => setOpen(true)}>Settings</button>
            <Button3D tone="mint" onClick={() => save({ analytics: true, marketing: true })}>Accept all</Button3D>
          </div>
        </div>
      )}
      {open && (
        <div className="ck-overlay" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="ck-modal" role="dialog" aria-modal="true" aria-labelledby="ck-title" tabIndex={-1} ref={box}>
            <button type="button" className="ck-x" aria-label="Close" onClick={() => setOpen(false)}><X size={16} /></button>
            <h2 id="ck-title">Cookie settings</h2>
            <p>Choose what you are happy with. You can change this any time from the footer.</p>
            <ul>
              {rows.map(([k, t, d]) => (
                <li key={k}>
                  <div><h3>{t}</h3><p>{d}</p></div>
                  <button type="button" role="switch" aria-checked={k === "necessary" ? true : prefs[k]} disabled={k === "necessary"} className="ck-switch"
                    onClick={() => k !== "necessary" && setPrefs({ ...prefs, [k]: !prefs[k] })}><i /></button>
                </li>
              ))}
            </ul>
            <div className="ck-actions">
              <Button3D tone="paper" onClick={() => save({ analytics: false, marketing: false })}>Reject optional</Button3D>
              <Button3D tone="mint" onClick={() => save(prefs)}>Save choices</Button3D>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
