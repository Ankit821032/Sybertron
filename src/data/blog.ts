/* SAMPLE CONTENT: replace with Sybertron's real articles. */
export type Block = { h: string; p: string[]; ul?: string[] }
export type Post = {
  slug: string; cat: string; title: string; excerpt: string; date: string; read: number
  tone: string; service: string; body: Block[]
}
export const BLOG_CATS = ["AI", "Web & apps", "Ecommerce", "Marketing", "Product"] as const

export const posts: Post[] = [
  {
    slug: "start-ai-with-one-workflow", cat: "AI", tone: "#c9b7ff", service: "ai", date: "2026-10-21", read: 6,
    title: "Start your AI project with one workflow, not a model",
    excerpt: "The teams that get value from AI pick one boring, high-volume job first. Here is how to find yours.",
    body: [
      { h: "Why starting with the model goes wrong", p: ["Most stalled AI projects began with a question like which model should we use. The better question is where your team loses the most hours to work that follows rules.", "A workflow gives you a baseline, a clear owner and a number to beat. A model gives you a demo."] },
      { h: "How to spot a good first workflow", p: ["Look for work that is repeated daily, follows clear rules and has an obvious right answer most of the time."], ul: ["Answering the same customer questions", "Re-typing data from PDFs or emails", "Sorting tickets, leads or applications", "Building the same weekly report"] },
      { h: "Measure before you automate", p: ["Time a handful of real cases by hand. Write down accuracy, hours and cost. After launch you compare against those numbers, not against a feeling.", "Keep a person in the loop for anything involving money or customers until the numbers earn your trust."] },
    ],
  },
  {
    slug: "shopify-or-woocommerce", cat: "Ecommerce", tone: "#ffd764", service: "ecommerce", date: "2026-10-08", read: 5,
    title: "Shopify, WooCommerce or custom: how to choose in 2026",
    excerpt: "A plain comparison of speed, cost and flexibility, based on stores we have launched.",
    body: [
      { h: "Start with your catalogue and your team", p: ["A store with a few dozen products and no developer is a different problem from a store with thousands of variants and an ERP."] },
      { h: "When Shopify wins", p: ["You want to launch quickly, accept payments reliably and not think about servers. Apps cover most needs, and the trade-off is monthly fees and less control over checkout."] },
      { h: "When WooCommerce or custom wins", p: ["You need unusual pricing, deep integrations or full ownership of the code. You pay for that flexibility with more setup and maintenance."], ul: ["Complex B2B price lists", "Custom order flows", "Heavy ERP or POS integration"] },
      { h: "Our rule of thumb", p: ["Choose the simplest platform that can do what you need for the next two years, and design the data so you can move later."] },
    ],
  },
  {
    slug: "what-a-portal-should-answer", cat: "Web & apps", tone: "#b8f36b", service: "web-portals", date: "2026-09-24", read: 5,
    title: "Five questions every customer portal should answer",
    excerpt: "If your team still answers these by phone, your portal is not finished.",
    body: [
      { h: "Where is my order?", p: ["Status and tracking, without logging a ticket."] },
      { h: "Where is my invoice?", p: ["Every invoice and receipt, searchable and downloadable."] },
      { h: "What do I owe?", p: ["Balances, due dates and a way to pay."] },
      { h: "Can you change this for me?", p: ["Addresses, contacts and plans that the customer can edit directly, with changes logged."] },
      { h: "Who do I talk to?", p: ["A clear route to a person when self-service is not enough, with the context attached."] },
    ],
  },
  {
    slug: "mobile-app-first-version", cat: "Web & apps", tone: "#ffb8c6", service: "mobile-apps", date: "2026-09-10", read: 4,
    title: "What belongs in the first version of a mobile app",
    excerpt: "Cut it down to the one journey people will open the app for, then add the rest.",
    body: [
      { h: "Pick one journey", p: ["Booking, ordering, tracking or learning: choose the single task your users repeat and make it excellent."] },
      { h: "What can wait", p: ["Social features, deep settings and rare edge cases can ship in version two once real usage tells you what matters."], ul: ["Profiles with every field", "Multiple languages on day one", "Complex admin screens"] },
      { h: "Plan the launch", p: ["Allow time for store review, beta testers and analytics, so your first release teaches you something."] },
    ],
  },
  {
    slug: "marketing-reports-you-can-read", cat: "Marketing", tone: "#a9dcff", service: "marketing", date: "2026-08-27", read: 4,
    title: "Marketing reports you can actually read",
    excerpt: "Spend, leads, sales and next steps. Everything else is decoration.",
    body: [
      { h: "Start with money in, money out", p: ["How much did you spend, how many leads did it bring and how many became customers? Put those three numbers at the top."] },
      { h: "Explain changes in one sentence", p: ["Every number that moved needs a short reason and a decision: keep, fix or stop."] },
      { h: "End with the plan", p: ["The last section should say what happens next month and what we need from you."] },
    ],
  },
  {
    slug: "saas-mvp-checklist", cat: "Product", tone: "#ffb59e", service: "saas", date: "2026-08-12", read: 7,
    title: "A SaaS MVP checklist for founders",
    excerpt: "The accounts, billing and analytics you need before your first paying customer.",
    body: [
      { h: "The product", p: ["One job, done well. If you cannot describe it in a sentence, the scope is still too big."] },
      { h: "The plumbing", p: ["Customers will not wait for you to add the basics later."], ul: ["Sign-up, login and password reset", "Teams and roles", "Subscriptions and invoices", "Email notifications", "Backups and monitoring"] },
      { h: "The learning loop", p: ["Add product analytics from day one so you can see activation and drop-off, and talk to your first ten customers."] },
    ],
  },
  {
    slug: "when-to-build-custom-software", cat: "Product", tone: "#9eebd2", service: "custom", date: "2026-07-30", read: 5,
    title: "When custom software beats off-the-shelf",
    excerpt: "Three signs that you have outgrown spreadsheets and generic tools.",
    body: [
      { h: "Your process is your advantage", p: ["If how you work is what makes you better than competitors, forcing it into a generic tool removes the edge."] },
      { h: "Your tools do not talk to each other", p: ["When staff copy data between systems all day, integration or a purpose-built tool pays for itself quickly."] },
      { h: "Costs scale with headcount", p: ["Per-seat pricing can get expensive. An owned system has a build cost but a flatter running cost."] },
    ],
  },
]
export const getPost = (slug: string) => posts.find((p) => p.slug === slug) ?? null
export const fmtDate = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
