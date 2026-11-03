import { CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { offices, urgentHelp, type Office } from "@/data/offices"
import {
  LAND_ROWS,
  MAP_COLS,
  MAP_ROWS,
  MAP_STEP_DEG,
  MAP_TOP_LAT,
} from "@/data/worldMask"
import { prefersReducedMotion, useInView } from "../motion"

const CELL = 10
const W = MAP_COLS * CELL
const H = MAP_ROWS * CELL
const LAT_SPAN = MAP_ROWS * MAP_STEP_DEG
const ARC_TIME = 1.1

/* lat/lon -> map coordinates, using the same projection the land mask was built with */
const project = (lat: number, lon: number) => ({
  x: ((lon + 180) / 360) * W,
  y: ((MAP_TOP_LAT - lat) / LAT_SPAN) * H,
})

/* every land cell becomes a zero-length stroke; round caps turn each one into a dot */
const LAND_PATH = LAND_ROWS.flatMap((row, j) =>
  Array.from(row).flatMap((c, i) =>
    c === "1" ? [`M${i * CELL + CELL / 2} ${j * CELL + CELL / 2}h0`] : [],
  ),
).join("")

/* arc between two pins, bowed to the left of the direction of travel */
function arc(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  const cx = (a.x + b.x) / 2 + (dy / len) * len * 0.24
  const cy = (a.y + b.y) / 2 - (dx / len) * len * 0.24
  return `M${a.x} ${a.y}Q${cx} ${cy} ${b.x} ${b.y}`
}

const DAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

function localStatus(o: Office, now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: o.tz,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ""
  const hh = get("hour")
  const mm = get("minute")
  const mins = Number(hh) * 60 + Number(mm)
  const isOpen =
    o.workDays.includes(DAYS[get("weekday")]) && mins >= o.open && mins < o.close
  return { time: `${hh}:${mm}`, isOpen }
}

function useNow() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 10_000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function GlobalPresence({ talk, urgentHref = urgentHelp.cta.href }: { talk?: ReactNode; urgentHref?: string }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const reduce = prefersReducedMotion()
  const now = useNow()
  const [hot, setHot] = useState<string | null>(null)

  const pins = useMemo(() => offices.map((o) => ({ o, ...project(o.lat, o.lon) })), [])
  const arcs = useMemo(() => pins.slice(1).map((p, i) => arc(pins[i], p)), [pins])
  const status = useMemo(
    () => Object.fromEntries(offices.map((o) => [o.id, now ? localStatus(o, now) : null])),
    [now],
  )

  return (
    <section
      className={inView ? "presence is-visible" : "presence"}
      id="locations"
      aria-labelledby="locations-title"
      ref={ref}
    >
      <h2 id="locations-title" className="sr-only">
        Our offices and opening hours
      </h2>

      {/* urgent help */}
      <div className="urgent" data-reveal>
        <p>
          <span className="urgent-dot" aria-hidden="true" />
          <span>
            <strong>{urgentHelp.lead}</strong> {urgentHelp.rest}
          </span>
        </p>
        <div>
          <a className="button-3d button-3d--coral" href={urgentHref}>
            {urgentHelp.cta.label}
          </a>
          <a
            className="text-link"
            href={urgentHelp.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {urgentHelp.whatsapp.label}
          </a>
        </div>
      </div>

      {talk}

      {/* dotted map */}
      <div className="map-band">
        <div className="map" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={`World map linking our offices in ${offices.map((o) => o.city).join(", ")}`}
          >
            <path
              d={LAND_PATH}
              fill="none"
              stroke="var(--ink)"
              strokeOpacity={0.28}
              strokeWidth={4.2}
              strokeLinecap="round"
            />
            {arcs.map((d, i) => {
              const begin = 0.2 + 3 * ARC_TIME * 0.8 + 0.8 + i * 1.4
              return (
                <g key={d}>
                  <path d={d} fill="none" stroke="var(--line)" strokeWidth={2} />
                  <path
                    className="map-arc"
                    d={d}
                    pathLength={1}
                    fill="none"
                    stroke="var(--lilac-deep)"
                    strokeWidth={3}
                    strokeLinecap="round"
                    style={
                      {
                        strokeDasharray: 1,
                        strokeDashoffset: inView || reduce ? 0 : 1,
                        transition: reduce
                          ? "none"
                          : `stroke-dashoffset ${ARC_TIME}s cubic-bezier(.16,1,.3,1) ${0.2 + i * ARC_TIME * 0.8}s`,
                      } as CSSProperties
                    }
                  />
                  {inView && !reduce && (
                    <circle r={5} fill="var(--coral)" stroke="var(--ink)" strokeWidth={1.5}>
                      <animateMotion dur="5.5s" begin={`${begin}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="5.5s" begin={`${begin}s`} repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              )
            })}
            {pins.map(({ o, x, y }, i) => {
              const open = status[o.id]?.isOpen
              const color = open ? "var(--lilac-deep)" : "var(--muted)"
              return (
                <g
                  key={o.id}
                  className="map-pin"
                  style={{
                    opacity: inView || reduce ? 1 : 0,
                    transition: `opacity .5s ${0.1 + i * ARC_TIME * 0.8}s`,
                  }}
                >
                  {open && <circle className="a-ring" cx={x} cy={y} r={9} fill="none" stroke={color} strokeWidth={1.5} />}
                  <circle
                    cx={x}
                    cy={y}
                    r={hot === o.id ? 13 : 10}
                    fill="var(--white)"
                    stroke="var(--ink)"
                    strokeWidth={2}
                    style={{ transition: "r .25s" }}
                  />
                  <circle cx={x} cy={y} r={4.5} fill={open ? "var(--mint-deep)" : color} />
                </g>
              )
            })}
          </svg>

          {/* city names are HTML so the text stays crisp at any map size */}
          {pins.map(({ o, x, y }) => (
            <span
              key={o.id}
              onMouseEnter={() => setHot(o.id)}
              onMouseLeave={() => setHot(null)}
              className={hot === o.id ? "map-label is-hot" : "map-label"}
              style={{
                top: `${(y / H) * 100}%`,
                ...(o.label === "left"
                  ? { right: `${100 - (x / W) * 100 + 1.6}%` }
                  : { left: `${(x / W) * 100 + 1.6}%` }),
              }}
            >
              {o.city}
            </span>
          ))}
        </div>
      </div>

      {/* local time at each office */}
      <ul className="offices" data-reveal>
        {offices.map((o, index) => {
          const s = status[o.id]
          return (
            <li
              key={o.id}
              className={hot === o.id ? "is-hot" : undefined}
              style={{ "--stagger": index } as CSSProperties}
              onMouseEnter={() => setHot(o.id)}
              onMouseLeave={() => setHot(null)}
            >
              <div className="office-top">
                <span>{o.country}</span>
                <span aria-live="polite">
                  <i className={s ? (s.isOpen ? "open" : "closed") : undefined} />
                  {s ? (s.isOpen ? "Open now" : "Closed now") : " "}
                </span>
              </div>
              <p className="office-city">{o.city}</p>
              <p className="office-time">
                <time dateTime={s?.time}>{s ? s.time : "--:--"}</time>
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
