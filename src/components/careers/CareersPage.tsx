import { CSSProperties, useState } from "react"
import { Code2, Megaphone, Pause, Play, Palette, ShieldCheck, Headset } from "lucide-react"
import { contactInfo } from "@/data/about"
import { roles, type Role } from "@/data/careers"
import { SplitWords } from "../../motion"
import { ArrowUpRight, Button3D, Sparkles } from "../ui"
import GlobalPresence from "../GlobalPresence"
import { Talk } from "../about/AboutPage"

/* Team media for the careers page. */
const MEDIA =
  "/images/collaboration.webp"

const mail = (subject: string) => `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}`

/* ---------------------------------------------------------------- hero */
function CareersHero() {
  // on a fresh page load the intro curtain is still covering the page, so wait for it
  const [intro] = useState(() => (performance.now() < 2500 ? ".95s" : ".1s"))
  return (
    <section className="about-hero careers-hero" style={{ "--intro": intro } as CSSProperties}>
      <div className="hero-blob hero-blob--one" data-parallax="0.14" />
      <div className="hero-blob hero-blob--two" data-parallax="-0.1" />
      <div className="about-hero-inner">
        <p className="eyebrow">
          <span /> Careers
        </p>
        <h1 aria-label="Careers at Sybertron">
          <span aria-hidden="true">
            <SplitWords text="Careers at" />
            <br />
            <SplitWords text="Sybertron" start={2} em />
          </span>
        </h1>
        <p className="about-lede">We hire curious people who like shipping. Interns work on real client projects from week one.</p>
      </div>
    </section>
  )
}

/* --------------------------------------------------------- media panel */
const TEAMS = [
  { Icon: Code2, label: "Engineering", style: { left: "9%", top: "20%" } },
  { Icon: Palette, label: "Design", style: { left: "66%", top: "14%" } },
  { Icon: ShieldCheck, label: "QA", style: { left: "78%", top: "62%" } },
  { Icon: Megaphone, label: "Marketing", style: { left: "14%", top: "66%" } },
  { Icon: Headset, label: "Support", style: { left: "44%", top: "74%" } },
]

function MediaPanel() {
  const [paused, setPaused] = useState(false)
  const isVideo = /\.(mp4|webm)$/i.test(MEDIA)
  return (
    <figure className={paused ? "careers-media is-paused" : "careers-media"} data-reveal="scale">
      {MEDIA ? (
        isVideo ? (
          <video src={MEDIA} autoPlay loop muted playsInline aria-label="Life at Sybertron" />
        ) : (
          <><img src={MEDIA} alt="Professionals collaborating around a laptop in an office" /><figcaption className="team-photo-note">Representative team photography</figcaption></>
        )
      ) : (
        <>
          <div className="about-photo-dots" aria-hidden="true" />
          <svg viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
            <path className="a-dash" d="M120 120 Q300 330 480 290 T820 90 M480 290 Q560 120 700 70" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {TEAMS.map(({ Icon, label, style }, i) => (
            <span key={label} className="careers-chip" style={{ ...style, "--d": `${i * 0.7}s` } as CSSProperties}>
              <i>
                <Icon size={16} aria-hidden />
              </i>
              {label}
            </span>
          ))}
          <div className="careers-bubble careers-bubble--a">Ship it 🚀</div>
          <div className="careers-bubble careers-bubble--b">LGTM ✅</div>
          <div className="about-photo-sticker" data-parallax="0.06">
            <Sparkles size={18} /> Real projects from week one
          </div>
        </>
      )}
      <button
        type="button"
        className="careers-pause"
        onClick={() => {
          setPaused((p) => !p)
          const v = document.querySelector<HTMLVideoElement>(".careers-media video")
          if (v) paused ? v.play() : v.pause()
        }}
        aria-label={paused ? "Play animation" : "Pause animation"}
      >
        {paused ? <Play size={16} /> : <Pause size={16} />}
      </button>
    </figure>
  )
}

/* --------------------------------------------------------------- roles */
function RoleRow({ r, i }: { r: Role; i: number }) {
  return (
    <li className={r.open ? "role" : "role is-filled"} style={{ "--stagger": i } as CSSProperties}>
      <div className="role-main">
        <h3>{r.title}</h3>
        <p className="role-meta">
          <span>{r.team}</span>
          <span>{r.type}</span>
          {r.location && <span>{r.location}</span>}
        </p>
      </div>
      <p className="role-summary">{r.summary}</p>
      {r.open ? (
        <a className="role-apply" href={mail(`Application: ${r.title}`)} aria-label={`Apply for ${r.title}`}>
          Apply <ArrowUpRight size={15} />
        </a>
      ) : (
        <span className="role-filled">Position filled</span>
      )}
    </li>
  )
}

function OpenRoles() {
  const open = roles.filter((r) => r.open)
  const filled = roles.filter((r) => !r.open)
  return (
    <section className="section careers-roles" id="roles">
      <div className="about-inner">
        <MediaPanel />

        <div className="careers-roles-head" data-reveal>
          <p className="eyebrow">
            <span /> Open roles
          </p>
          <span className="careers-count">
            <b>{open.length}</b> open · {filled.length} filled
          </span>
        </div>
        <ul className="role-list rv-stagger" data-reveal>
          {[...open, ...filled].map((r, i) => (
            <RoleRow key={r.id} r={r} i={i} />
          ))}
        </ul>

        <div className="careers-intro" data-reveal="scale">
          <div>
            <h2>Don&apos;t see your role?</h2>
            <p>Introduce yourself anyway, in a one-minute video. We keep every intro and get in touch when something fits.</p>
          </div>
          <Button3D href={mail("Intro video")} tone="mint">
            Introduce yourself <ArrowUpRight size={17} />
          </Button3D>
        </div>
      </div>
    </section>
  )
}

export default function CareersPage() {
  return (
    <>
      <CareersHero />
      <OpenRoles />
      <GlobalPresence talk={<Talk />} />
    </>
  )
}
