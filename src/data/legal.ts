/* SAMPLE CONTENT: starter legal text. Have a lawyer review and adapt it before publishing. */
export type Sec = { id: string; h: string; p: string[]; ul?: string[] }
export type Legal = { id: "privacy" | "terms" | "cookies"; title: string; lede: string; updated: string; secs: Sec[] }
const C = "hello@sybertron.com"

export const LEGAL: Legal[] = [
  {
    id: "privacy", title: "Privacy policy", updated: "2 November 2026",
    lede: "What we collect when you use our website or work with us, why we collect it and the choices you have.",
    secs: [
      { id: "who", h: "Who we are", p: [`Sybertron Technologies ("we", "us") builds websites, apps, AI and marketing for businesses. You can reach us about privacy at ${C}.`] },
      { id: "collect", h: "What we collect", p: ["We collect only what we need to respond to you and deliver our work."], ul: ["Details you give us: name, email, phone, company and project information", "Messages sent through forms, email, chat or WhatsApp", "Technical data such as device, browser and pages visited, through cookies and similar tools", "Business information shared during a project, such as files and access credentials"] },
      { id: "use", h: "How we use it", p: ["We use your information to reply to enquiries, prepare proposals, deliver and support projects, send updates you asked for, keep our site secure and understand how it is used."] },
      { id: "share", h: "Who we share it with", p: ["We do not sell personal data. We share it only with service providers who help us run our business, such as hosting, email, analytics and payment tools, and where the law requires it."] },
      { id: "keep", h: "How long we keep it", p: ["Enquiry data is kept while we talk and for a reasonable period afterwards. Project data is kept for the life of the contract and the period needed for legal and accounting reasons."] },
      { id: "rights", h: "Your rights", p: ["Depending on where you live, you can ask to access, correct, delete or export your data, or object to certain uses.", `Email ${C} and we will respond within a reasonable time.`] },
      { id: "security", h: "Security", p: ["We use encryption in transit, access controls and regular backups. No system is perfectly secure, so we also limit what we collect."] },
      { id: "changes", h: "Changes", p: ["We may update this policy. The date above shows the latest version."] },
    ],
  },
  {
    id: "terms", title: "Terms and conditions", updated: "2 November 2026",
    lede: "The rules for using our website and the basis on which we offer our services.",
    secs: [
      { id: "using", h: "Using this website", p: ["You may use this site for lawful purposes. Do not attempt to disrupt it, scrape it at scale or use it to send spam."] },
      { id: "services", h: "Our services", p: ["Each project is covered by a written proposal or agreement that sets out scope, price, timeline and responsibilities. If it differs from these terms, the agreement wins."] },
      { id: "payment", h: "Fees and payment", p: ["Fees, milestones and payment dates are listed in your proposal. Late payments may pause work and may incur reasonable interest."] },
      { id: "ip", h: "Ownership and intellectual property", p: ["Once you have paid in full, you own the custom work we create for you. We keep ownership of our pre-existing tools, libraries and know-how, and give you a licence to use them as part of your project.", "Third-party components remain under their own licences."] },
      { id: "client", h: "What we need from you", p: ["Timely feedback, accurate information and the access needed to do the work. Delays on your side may move the timeline."] },
      { id: "warranty", h: "Warranty and liability", p: ["We work with professional care and will fix defects reported within the support period in your agreement. To the extent the law allows, we are not liable for indirect or consequential losses, and our total liability is limited to the fees paid for the work in question."] },
      { id: "confidentiality", h: "Confidentiality", p: ["We keep your business information confidential and expect the same of you for ours."] },
      { id: "law", h: "Governing law", p: ["These terms are governed by the laws of India. Disputes will be handled by the courts of the city named in your agreement."] },
      { id: "contact", h: "Contact", p: [`Questions about these terms: ${C}.`] },
    ],
  },
  {
    id: "cookies", title: "Cookie policy", updated: "2 November 2026",
    lede: "What cookies are, which ones we use and how to change your mind at any time.",
    secs: [
      { id: "what", h: "What cookies are", p: ["Cookies are small files stored on your device. They help a site remember you and understand how it is used."] },
      { id: "types", h: "Cookies we use", p: ["You can switch the optional categories on or off from Cookie settings in the footer."], ul: ["Necessary: keep the site working, such as remembering your cookie choice. Always on.", "Analytics: show us which pages are useful so we can improve them.", "Marketing: help us measure campaigns and show relevant ads elsewhere."] },
      { id: "manage", h: "Managing cookies", p: ["Use Cookie settings in the footer to change your choices. You can also block or delete cookies in your browser settings, though parts of the site may then stop working."] },
      { id: "third", h: "Third-party tools", p: ["Analytics and advertising providers may set their own cookies. Their policies explain how they use data."] },
      { id: "contact", h: "Contact", p: [`Questions about cookies: ${C}.`] },
    ],
  },
]
export const getLegal = (id: string) => LEGAL.find((l) => l.id === id) ?? null
