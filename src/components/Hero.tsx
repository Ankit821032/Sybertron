import { FormEvent, useState } from "react"
import { Sparkles, ArrowRight, Button3D } from "./ui"
import { SplitWords, TypedInput } from "../motion"
import { navigate } from "../router"

const PROMPTS = [
  "I want an online store for my brand",
  "Can you build an AI chatbot for support?",
  "We need a mobile app for our customers",
  "Our website is slow, can you fix it?",
  "I'd like a custom CRM for my team",
  "Can you automate our manual reports?",
  "We want to launch a booking platform",
  "Help me get more leads online",
]

const CHIPS = [
  "Online store",
  "AI chatbot",
  "Business website",
  "Mobile app",
  "Game",
  "Marketing",
  "Build my quote",
  "Urgent fix",
]

export const goToContact = (text: string) => {
  try {
    sessionStorage.setItem("project-idea", text)
  } catch {
    /* storage can be blocked; the scroll still works */
  }
  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
}

export default function Hero() {
  const [idea, setIdea] = useState("")

  const submit = (event: FormEvent) => {
    event.preventDefault()
    goToContact(idea || PROMPTS[0])
  }

  return (
    <section className="hero">
      <div className="hero-blob hero-blob--one" data-parallax="0.14" />
      <div className="hero-blob hero-blob--two" data-parallax="-0.1" />
      <div className="hero-sticker hero-sticker--top" data-parallax="0.08">
        <Sparkles size={20} /> 1,000+ projects shipped
      </div>
      <div className="hero-inner">
        <p className="eyebrow">
          <span /> Software, AI and digital engineering
        </p>
        <h1 aria-label="What do you want to build?">
          <span aria-hidden="true">
            <SplitWords text="What do you want" />
            <br />
            <SplitWords text="to" start={3} />
            <SplitWords text="build?" start={4} em />
          </span>
        </h1>
        <p className="hero-copy">
          Websites, apps, AI and cloud engineering built to scale — from one
          team, so you don&apos;t have to manage three agencies.
        </p>

        <form className="idea-form" onSubmit={submit}>
          <label htmlFor="project-idea">Tell us what you&apos;re building</label>
          <div className="idea-field">
            <TypedInput
              id="project-idea"
              value={idea}
              onChange={setIdea}
              phrases={PROMPTS}
            />
            <Button3D type="submit" tone="mint">
              <span>Let&apos;s talk</span>
              <ArrowRight size={20} />
            </Button3D>
          </div>
        </form>

        <div className="hero-chips" aria-label="Popular project types">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className={chip === "Urgent fix" ? "is-urgent" : undefined}
              onClick={() => {
                if (chip === "Urgent fix") return navigate("/urgent")
                setIdea(chip)
                goToContact(chip)
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
      <a className="scroll-cue" href="#services">
        <span>Scroll for the good stuff</span>
        <span className="scroll-line" />
      </a>
    </section>
  )
}
