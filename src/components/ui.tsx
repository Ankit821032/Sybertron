import { ReactNode } from "react"
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  Sparkles,
  type LucideProps,
} from "lucide-react"

export { ArrowRight, ArrowUpRight, Menu, Sparkles }
export type { LucideProps }

export function Button3D({
  children,
  href,
  tone = "mint",
  type = "button",
  onClick,
}: {
  children: ReactNode
  href?: string
  tone?: "mint" | "ink" | "lilac" | "paper" | "coral" | "yellow"
  type?: "button" | "submit"
  onClick?: () => void
}) {
  const className = `button-3d button-3d--${tone}`
  if (href)
    return (
      <a className={className} href={href}>
        {children}
      </a>
    )
  return (
    <button className={className} type={type} onClick={onClick}>
      {children}
    </button>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  em,
  copy,
  className = "",
}: {
  eyebrow: string
  title: ReactNode
  em?: ReactNode
  copy?: ReactNode
  className?: string
}) {
  return (
    <div className={`section-heading ${className}`} data-reveal>
      <div>
        <p className="eyebrow">
          <span /> {eyebrow}
        </p>
        <h2>
          {title}
          {em && (
            <>
              <br />
              <em>{em}</em>
            </>
          )}
        </h2>
      </div>
      {copy && <p>{copy}</p>}
    </div>
  )
}
