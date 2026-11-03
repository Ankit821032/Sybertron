/* SAMPLE CONTENT: copy for every /services/<id> page. Replace any field with Sybertron's real wording. */
export type Vis =
  | { k: "chat"; title: string; items: [string, string, string] }
  | { k: "flow"; title: string; items: [string, string, string, string] }
  | { k: "bars"; title: string; items: string[]; nums: number[] }
  | { k: "list"; title: string; items: string[] } // "label|tag"

export type Cap = { chip: string; h: string; d: string; subs: [string, string][]; vis: Vis }

export type ServiceDetail = {
  id: string
  lede: string
  stmt: string
  p: [string, string]
  capsTitle: string
  caps: [Cap, Cap, Cap, Cap]
  paysTitle: string
  pays: [string, string, string, string, string]
  words: string[]
  teamNote: string
  steps: [string, string, string]
  faq: [string, string][]
  work: string[]
  prods: string[]
  more: [string, string, string]
}

const flow = (title: string, a: string, b: string, c: string, d: string): Vis => ({ k: "flow", title, items: [a, b, c, d] })
const chat = (title: string, a: string, b: string, c: string): Vis => ({ k: "chat", title, items: [a, b, c] })
const bars = (title: string, items: string[], nums: number[]): Vis => ({ k: "bars", title, items, nums })
const list = (title: string, ...items: string[]): Vis => ({ k: "list", title, items })
const W6 = ["W1", "W2", "W3", "W4", "W5", "W6"]
const M6 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

export const DETAILS: ServiceDetail[] = [
  {
    id: "ai",
    lede: "We build AI for the jobs where it actually saves time or money: assistants that answer customers, agents that work through routine tasks, and models that make sense of your data.",
    stmt: "Every engagement starts with a workflow, not a model.",
    p: ["We find the step where people lose the most time or the business loses the most money, prototype an AI solution against your real data, and measure it before we scale it.", "We build on leading foundation models and open-source stacks, connect them to your systems through secure APIs, and keep humans in the loop where judgement matters."],
    capsTitle: "Where AI takes work off your team",
    caps: [
      { chip: "Answer customers instantly", h: "Answer customers instantly", d: "A chatbot or copilot trained on your products, policies and orders answers common questions day and night, and hands anything tricky to a person with the conversation attached.", subs: [["Chatbots & copilots", "Customer-facing assistants and internal tools grounded in your own content, in Arabic, English and more."], ["Smart handover", "Escalates to your team with the full context, so nobody asks the customer to repeat themselves."]], vis: chat("Support assistant", "Where is my order #4421?", "It left our warehouse this morning and arrives tomorrow. Want the tracking link?", "Yes please") },
      { chip: "Automate the busywork", h: "Automate the busywork", d: "Agents read emails, invoices and forms, check them against your rules and update your systems, so your team only handles the exceptions.", subs: [["AI agents & automation", "Agents that read, decide and act across your tools, such as triaging tickets, routing leads and updating records."], ["Document & vision AI", "Extract, classify and verify invoices, IDs, resumes and forms at scale."]], vis: flow("Invoice, start to finish", "Invoice arrives by email", "AI reads the PDF", "Checked against the purchase order", "Posted to your accounts") },
      { chip: "Turn data into decisions", h: "Turn data into decisions", d: "Models forecast demand, flag risk and spot patterns in your data, then the findings show up in the dashboards your team already uses.", subs: [["Machine learning & analytics", "Forecasting, scoring and anomaly detection built on your own data."], ["AI inside your product", "Add search, summaries, recommendations and voice to your web and mobile apps."]], vis: bars("Weekly order forecast", W6, [45, 52, 58, 66, 74, 88]) },
      { chip: "Keep it safe and accurate", h: "Keep it safe and accurate", d: "Every AI feature is tested on real examples before launch and watched afterwards, with limits on what it may do and a person on the loop for anything important.", subs: [["Evaluation & guardrails", "Accuracy testing, cost control, privacy and safety checks before and after launch."], ["Access & audit", "Role-based access, redaction of personal data and a log of every AI action."]], vis: list("Before it goes live", "Tested on 500 real questions|Passed", "Personal data masked before it reaches the model|On", "Every answer and action logged|On", "Refunds over $100 need a person's approval|Active") },
    ],
    paysTitle: "Where AI pays off first",
    pays: ["Your team answers the same questions all day", "Staff re-type data from PDFs, emails or forms into another system", "Decisions wait on someone pulling a report together", "You screen large volumes of applications, leads or tickets by hand", "Customers expect answers outside office hours"],
    words: ["Agents", "Chatbots", "Automation", "Forecasts", "RAG", "Vision", "Guardrails", "Workflows", "Copilots", "Insights"],
    teamNote: "The team behind your project: analysts, designers, developers and testers working as one.",
    steps: ["Pick one workflow, map where the hours go and agree how we will measure success.", "A working prototype on your real data that you can judge before committing to the full build.", "We build it properly, connect it to your systems and add the logs and approvals it needs."],
    faq: [["Where should we start with AI?", "With one repetitive, high-volume job that already has clear rules, such as answering order questions or processing invoices. It is quick to measure, and it builds trust before you automate more."], ["Is our data safe?", "Yes. We mask personal data before it reaches a model, use providers that do not train on your data, apply role-based access and keep an audit log. We can also run models inside your own cloud."], ["What if the AI gets something wrong?", "We design for it. Important actions need approval, low-confidence answers go to a person, and we track accuracy after launch so problems show up early."], ["Will it work with our current systems?", "Almost always. We connect through APIs, webhooks, databases or, when there is nothing else, the screens your team already uses."]],
    work: ["learnloop", "tablechat", "ledgerly"], prods: ["aichatbot", "aianalytics", "documentvault"], more: ["ai-agents", "ai-models", "web-portals"],
  },
  {
    id: "ai-agents",
    lede: "Custom AI agents that plan, use your tools and finish multi-step work, with approvals where they matter and a clear record of everything they did.",
    stmt: "An agent is only useful if it can finish the job.",
    p: ["We design agents around a real process: what triggers it, which tools it may use, when it must ask, and what done looks like.", "Each agent runs with limits on spend, access and actions, and every step is logged so you can see why it did what it did."],
    capsTitle: "Where agents take work off your team",
    caps: [
      { chip: "Plan and act", h: "Agents that plan and act", d: "Give an agent a goal and it breaks it into steps, calls the right tools and checks its own work before reporting back.", subs: [["Multi-step planning", "Research, draft, check and submit without someone babysitting every step."], ["Tool use", "Connects to your CRM, email, calendar, database and internal APIs."]], vis: flow("Lead follow-up agent", "New enquiry arrives", "Agent researches the company", "Drafts a personal reply", "Rep approves and sends") },
      { chip: "Work across tools", h: "Work across your tools", d: "Agents move between systems the way a person would, but faster, and without copy-paste errors.", subs: [["System integrations", "Read from one tool, decide, then update three others in one run."], ["Browser and document skills", "Handle portals and PDFs that have no API."]], vis: list("Agent run #1182", "Read the supplier email|Done", "Matched to purchase order|Done", "Updated stock in ERP|Done", "Asked finance to approve|Waiting") },
      { chip: "Keep a human in charge", h: "Keep a human in charge", d: "Approval steps, spending limits and escalation rules mean agents work freely on safe tasks and stop for the risky ones.", subs: [["Approval gates", "Anything over a limit or outside a rule waits for a person."], ["Full audit trail", "Every prompt, tool call and decision is stored and searchable."]], vis: chat("Approval request", "Agent wants to refund $240 to order #881.", "Reason: item arrived damaged, photo attached.", "Approve") },
      { chip: "Measure and improve", h: "Measure and improve", d: "We track completion rate, cost per task and error rate, then tune prompts, tools and rules as real usage teaches us more.", subs: [["Evaluation suites", "Regression tests so a change never quietly makes things worse."], ["Cost and speed tuning", "Right-size the model for each step."]], vis: bars("Tasks completed without help", M6, [52, 61, 68, 74, 81, 87]) },
    ],
    paysTitle: "Where agents pay off first",
    pays: ["Sales reps spend hours researching and writing follow-ups", "Support tickets need the same lookups across several tools", "Back-office staff move data between systems all day", "Reports are assembled by hand every week", "Routine approvals sit in someone's inbox"],
    words: ["Planning", "Tools", "Memory", "Approvals", "Routing", "Browser", "Evals", "Audit", "Limits", "Handover"],
    teamNote: "Product thinkers, AI engineers and testers designing agents you can trust.",
    steps: ["Choose one process, list its tools and rules and decide where a person must approve.", "A thin agent that handles the happy path, tested on real cases from your team.", "Add tools, memory, limits and logging, then connect it to your live systems."],
    faq: [["How is an agent different from a chatbot?", "A chatbot answers. An agent acts: it plans several steps, uses your tools and completes a task, usually with an approval step before anything important."], ["Can an agent spend money or delete things by mistake?", "Only if you let it. We set explicit permissions, spending caps and approval gates, and sensitive actions always ask first."], ["Which tools can it connect to?", "Anything with an API, plus email, calendars, databases, spreadsheets and, when needed, web portals through a controlled browser."], ["How do we know it is working?", "We give you a dashboard of completed tasks, errors, cost and time saved, along with a log of every run."]],
    work: ["fleetline", "hiretrack", "ledgerly"], prods: ["aichatbot", "documentvault", "aianalytics"], more: ["ai", "ai-models", "custom"],
  },
  {
    id: "ai-models",
    lede: "Bring GPT, Claude, Gemini and open-source models into your products and systems, with the right model for each job, sensible costs and proper safeguards.",
    stmt: "The model is the easy part. Making it reliable is the work.",
    p: ["We help you choose between hosted and self-hosted models, wire them into your product and add the retrieval, caching and monitoring that keep answers accurate and bills predictable.", "Our integrations are provider-agnostic, so you can switch models as better ones arrive without rebuilding."],
    capsTitle: "What we integrate and tune",
    caps: [
      { chip: "Pick the right model", h: "Pick the right model", d: "We test several models on your own examples and choose on quality, speed, privacy and price, not on hype.", subs: [["Model benchmarking", "Side-by-side results on your real tasks."], ["Hosted or self-hosted", "Cloud APIs, private deployments or open-source on your servers."]], vis: bars("Answer quality on your tests", ["Model A", "Model B", "Model C", "Open source", "Tuned"], [72, 81, 84, 68, 91]) },
      { chip: "Ground it in your data", h: "Ground it in your data", d: "Retrieval pulls the right passages from your documents and databases so answers cite real sources instead of guessing.", subs: [["RAG pipelines", "Ingest, chunk, index and refresh your content."], ["Source citations", "Every answer links back to where it came from."]], vis: flow("Ask your documents", "Question comes in", "Search your content", "Model drafts an answer", "Sources attached") },
      { chip: "Control cost and speed", h: "Control cost and speed", d: "Caching, smaller models for simple steps and streaming responses keep the experience quick and the invoice in check.", subs: [["Smart routing", "Easy questions go to a cheap model, hard ones to a strong one."], ["Usage dashboards", "See cost by feature, team and customer."]], vis: bars("Monthly model cost, $", M6, [88, 80, 66, 52, 44, 38]) },
      { chip: "Keep it safe", h: "Keep it safe and compliant", d: "Personal data is masked, prompts are filtered and outputs are checked before they reach users.", subs: [["Privacy by design", "Redaction, regional hosting and no training on your data."], ["Output checks", "Policy filters, format validation and fallbacks."]], vis: list("Safety checks", "Personal data masked|On", "Prompt injection filter|On", "Output format validated|On", "Fallback if provider is down|Ready") },
    ],
    paysTitle: "Where model integration pays off first",
    pays: ["You want AI inside your product but not a research team", "A demo works, but production answers are inconsistent", "Model bills are growing faster than usage", "Your documents are full of answers nobody can find", "Compliance needs to know where your data goes"],
    words: ["GPT", "Claude", "Gemini", "Llama", "RAG", "Embeddings", "Routing", "Caching", "Evals", "Privacy"],
    teamNote: "Engineers who have shipped model-powered features to real users.",
    steps: ["Define the task, collect real examples and set the quality bar.", "Compare models and prompts on your examples and prove the approach in a thin slice.", "Build retrieval, routing, caching and monitoring into your product."],
    faq: [["Which model should we use?", "It depends on the task. We test a shortlist on your own examples and pick on quality, cost, speed and privacy, and we keep the design flexible so you can switch later."], ["Can we use our own documents?", "Yes. We index them for retrieval so the model answers from your content and shows its sources."], ["Will our data train the model?", "Not with the setup we recommend. We use providers and settings that do not train on your data, or host models privately."], ["How do you keep costs down?", "By routing simple steps to smaller models, caching repeated answers and trimming prompts, with dashboards so there are no surprises."]],
    work: ["learnloop", "ledgerly", "clinichub"], prods: ["aichatbot", "aianalytics", "documentvault"], more: ["ai", "ai-agents", "saas"],
  },
  {
    id: "web-portals",
    lede: "Customer, partner and staff portals with dashboards, roles and self-service, so people get what they need without calling or emailing your team.",
    stmt: "A good portal removes the phone call.",
    p: ["We start with the questions people keep asking your team, then build the screens that answer them: orders, invoices, documents, requests and reports.", "Everything is permission-based, fast on a phone and built to connect with the systems you already run."],
    capsTitle: "What we build into portals",
    caps: [
      { chip: "Self-service for customers", h: "Self-service for customers", d: "Customers track orders, download invoices, raise requests and update details themselves, any time of day.", subs: [["Customer accounts", "Orders, invoices, documents and history in one place."], ["Requests and tickets", "Raise, track and resolve with status updates."]], vis: list("Your orders", "#4421 Delivered|Today", "#4418 In transit|Tomorrow", "#4402 Invoice ready|Download", "#4397 Return requested|Review") },
      { chip: "Roles and permissions", h: "The right view for every role", d: "Partners, staff and managers each see only what they should, with approvals and activity logs built in.", subs: [["Role-based access", "Fine-grained permissions per team, branch or client."], ["Approvals", "Multi-step sign-off with a clear trail."]], vis: flow("Purchase request", "Staff submits", "Manager reviews", "Finance approves", "Vendor notified") },
      { chip: "Dashboards that answer", h: "Dashboards that answer questions", d: "Live numbers and exports replace the weekly spreadsheet, tailored to each role.", subs: [["Live reports", "Charts and tables that update as work happens."], ["Exports and alerts", "Excel, PDF and scheduled emails."]], vis: bars("Requests resolved", W6, [38, 44, 52, 61, 70, 82]) },
      { chip: "Connected to your systems", h: "Connected to your systems", d: "Portals read from and write to your ERP, CRM, accounting and payment tools so data lives in one place.", subs: [["Integrations", "APIs, webhooks and scheduled syncs."], ["Single sign-on", "Google, Microsoft or your own identity provider."]], vis: flow("Order sync", "Customer places order", "Portal records it", "ERP receives it", "Status flows back") },
    ],
    paysTitle: "Where a portal pays off first",
    pays: ["Your team answers status questions all day", "Partners email you for documents and price lists", "Data is copied between spreadsheets and systems", "Approvals happen over chat and get lost", "Customers expect to help themselves"],
    words: ["Dashboards", "Roles", "Self-service", "Approvals", "Reports", "SSO", "Invoices", "Requests", "Alerts", "Search"],
    teamNote: "Designers and engineers who build portals people actually log in to.",
    steps: ["List the questions and tasks the portal must handle and who needs which view.", "Clickable screens for each role that you can test with real users.", "Build, integrate with your systems and migrate your data."],
    faq: [["Who is a portal for?", "Customers, distributors, suppliers, staff or all of them, each with their own permissions and views."], ["Can it connect to our ERP or CRM?", "Yes. We integrate through APIs or scheduled syncs so there is one source of truth."], ["Will it work on phones?", "Yes. Every portal is responsive, and we can add a mobile app later if you need one."], ["Who hosts it?", "We can host it for you or deploy to your own cloud account, with backups and monitoring either way."]],
    work: ["fleetline", "clinichub", "schoolsphere"], prods: ["orderportal", "smartfacility", "documentvault"], more: ["custom", "erp", "saas"],
  },
  {
    id: "ecommerce",
    lede: "Online stores on Shopify, WooCommerce, Magento and more, or a custom cart, designed to turn visitors into customers and run smoothly behind the scenes.",
    stmt: "A store is a sales process, not a catalogue.",
    p: ["We choose the platform that fits your catalogue, team and budget, then design every step from product page to payment to reduce friction.", "We also connect stock, shipping, accounting and marketing tools so orders flow without manual work."],
    capsTitle: "What we build into stores",
    caps: [
      { chip: "Pages that sell", h: "Pages that sell", d: "Fast, clear product pages, filters and search that help people find and trust what they are buying.", subs: [["Product and collection design", "Galleries, size guides and reviews that answer doubts."], ["Search and filters", "Find the right item in a few taps."]], vis: bars("Add-to-cart rate, %", M6, [30, 34, 41, 46, 52, 59]) },
      { chip: "Checkout that converts", h: "Checkout that converts", d: "One-page checkout, wallets, local payment methods and saved details cut abandoned carts.", subs: [["Payments", "Cards, UPI, wallets, COD and buy-now-pay-later."], ["Cart recovery", "Automatic reminders for unfinished orders."]], vis: flow("Checkout", "Cart", "Delivery slot", "Pay", "Confirmation sent") },
      { chip: "Orders run themselves", h: "Orders that run themselves", d: "Stock, shipping labels, invoices and accounting update automatically when an order arrives.", subs: [["Inventory sync", "Stock stays right across channels."], ["Shipping and returns", "Couriers, labels, tracking and RMAs."]], vis: list("Order #8841", "Payment received|Done", "Stock reserved|Done", "Label printed|Done", "Customer notified|Done") },
      { chip: "Grow after launch", h: "Grow after launch", d: "SEO, analytics, email and ad tracking are set up from day one so you can see what works.", subs: [["Analytics and tracking", "Sales, funnels and campaigns in one view."], ["Subscriptions and loyalty", "Bring customers back."]], vis: bars("Repeat customers, %", M6, [14, 17, 21, 26, 31, 38]) },
    ],
    paysTitle: "Where a better store pays off first",
    pays: ["Lots of visitors but few orders", "Customers abandon the cart at checkout", "Stock and orders are updated by hand", "Your site is slow on phones", "You sell on several channels with separate catalogues"],
    words: ["Shopify", "WooCommerce", "Magento", "Checkout", "Catalogue", "Payments", "Shipping", "SEO", "Subscriptions", "Loyalty"],
    teamNote: "Designers, developers and marketers who have launched stores of every size.",
    steps: ["Review your catalogue, customers and channels, then choose the right platform.", "Designs for the key pages and a working checkout you can test.", "Build, connect payments, shipping and accounting, and import your products."],
    faq: [["Which platform should I choose?", "Shopify is fastest to launch, WooCommerce is flexible and Magento suits large catalogues. We recommend based on your products and team, not our preference."], ["Can you migrate my existing store?", "Yes. We move products, customers and order history and set up redirects to protect your search rankings."], ["Can you add local payment and shipping options?", "Yes. We integrate regional gateways, wallets, COD and couriers."], ["Do you support the store after launch?", "Yes. We offer monthly support for updates, fixes, speed and new features."]],
    work: ["aurum", "bloom", "nutribasket"], prods: ["retailpos", "bookingengine", "orderportal"], more: ["plugins", "marketing", "mobile-apps"],
  },
  {
    id: "mobile-apps",
    lede: "Native and cross-platform apps for iOS and Android, from first sketch to store launch and the updates that follow.",
    stmt: "A great app does one thing people open every day.",
    p: ["We shape the idea around the one journey that matters, design it for thumbs and small screens, then build and test on real devices.", "We handle store submission, analytics and crash monitoring so launch day is calm and the next release is easy."],
    capsTitle: "What goes into a mobile app",
    caps: [
      { chip: "Designed for thumbs", h: "Designed for thumbs", d: "Clear flows, fast screens and platform-native feel on iOS and Android.", subs: [["UX and prototyping", "Tappable prototypes before a line of code."], ["Accessibility", "Readable, reachable and screen-reader friendly."]], vis: flow("Onboarding", "Welcome", "Sign up", "Pick interests", "First win") },
      { chip: "Native or cross-platform", h: "Native or cross-platform", d: "We choose Swift, Kotlin or React Native on your budget, performance needs and roadmap.", subs: [["One codebase or two", "Honest trade-offs, not a default."], ["Offline and sync", "Works on weak networks and catches up later."]], vis: bars("Cold start time, ms", ["Old", "v1", "v2", "v3", "v4"], [88, 64, 48, 36, 28]) },
      { chip: "Connected backend", h: "A backend that keeps up", d: "Accounts, push notifications, payments and real-time features run on a secure, scalable API.", subs: [["Push and in-app messaging", "Timely nudges users welcome."], ["Payments and subscriptions", "In-app purchases and gateways."]], vis: list("Notifications", "Order shipped|Sent", "Cart reminder|Scheduled", "Weekly summary|Scheduled", "New feature|Draft") },
      { chip: "Launch and learn", h: "Launch and keep learning", d: "Store listings, beta testing, analytics and crash reports help each release land better.", subs: [["Store submission", "Screenshots, listings and review handling."], ["Analytics and crash tracking", "See where users drop off."]], vis: bars("Weekly active users", W6, [20, 31, 44, 58, 71, 86]) },
    ],
    paysTitle: "Where an app pays off first",
    pays: ["Customers come back often and want speed", "Your field team needs to work offline", "You want push notifications to bring people back", "A website alone feels clumsy on phones", "You sell subscriptions or bookings"],
    words: ["iOS", "Android", "React Native", "Offline", "Push", "Payments", "Maps", "Biometrics", "Analytics", "Stores"],
    teamNote: "Designers, mobile engineers and testers shipping to both stores.",
    steps: ["Define the core journey, audience and success metric.", "A tappable prototype tested with real users.", "Build, test on real devices and prepare store submission."],
    faq: [["Native or cross-platform?", "Cross-platform is faster and cheaper for most apps. Native wins for heavy graphics, deep device features or the best possible polish. We will tell you which fits."], ["How long does an app take?", "A focused first version usually takes two to four months, depending on features and integrations."], ["Do you publish to the stores?", "Yes. We prepare listings, handle submission and respond to review feedback."], ["Can you update an existing app?", "Yes. We can audit, refactor and extend apps built by others."]],
    work: ["fitpulse", "ridenow", "pocketwise"], prods: ["gymmanager", "clinicdesk", "fleettracker"], more: ["web-portals", "games", "saas"],
  },
  {
    id: "games",
    lede: "Mobile, PC and web games, from first prototype to store launch and live updates, built to be fun in the first minute and the hundredth.",
    stmt: "Fun comes first. Everything else supports it.",
    p: ["We prototype the core loop early, playtest constantly and only then invest in art, content and polish.", "After launch we handle live events, balancing and updates so players have a reason to return."],
    capsTitle: "What goes into a game",
    caps: [
      { chip: "Prototype the fun", h: "Prototype the fun", d: "A playable core loop in weeks, so you can feel the game before committing to a full build.", subs: [["Game design", "Mechanics, progression and economy."], ["Rapid prototyping", "Playable builds you can test."]], vis: flow("Core loop", "Play", "Earn", "Upgrade", "Play harder") },
      { chip: "Art and sound", h: "Art, animation and sound", d: "2D and 3D art, animation, effects and music that give the game its own personality.", subs: [["Art direction", "Characters, worlds and UI."], ["Audio", "Music and effects that make it feel right."]], vis: list("Asset pipeline", "Characters|12 of 12", "Environments|6 of 8", "Animations|34 of 50", "Sound effects|40 of 60") },
      { chip: "Build and optimise", h: "Build and optimise", d: "Unity builds tuned for low-end phones, consoles and browsers, with smooth frame rates and small downloads.", subs: [["Unity development", "Mobile, PC, console and WebGL."], ["Multiplayer and leaderboards", "Co-op, ranked and social features."]], vis: bars("Frame rate, fps", ["Early", "Alpha", "Beta", "RC", "Live"], [34, 42, 51, 57, 60]) },
      { chip: "Live operations", h: "Live operations", d: "Events, seasons, ads and in-app purchases tuned with real player data.", subs: [["Live events", "Seasonal content and daily quests."], ["Analytics and balancing", "Fix what players struggle with."]], vis: bars("Day-7 retention, %", M6, [14, 17, 21, 25, 29, 34]) },
    ],
    paysTitle: "Where game development pays off first",
    pays: ["You have an idea but no playable version", "A prototype exists but is not fun yet", "Your game runs poorly on cheaper phones", "You need live events to keep players", "You want a branded game for a campaign"],
    words: ["Unity", "Prototype", "Levels", "Multiplayer", "Art", "Sound", "Events", "Economy", "Leaderboards", "Stores"],
    teamNote: "Game designers, artists and engineers who love playing as much as building.",
    steps: ["Define the core loop, audience and platform.", "A playable prototype tested with real players.", "Full production of content, art and tech, then store launch."],
    faq: [["Which engines do you use?", "Mostly Unity, which covers mobile, PC, console and web. We choose the engine that suits the game."], ["Can you make a game from my idea?", "Yes. We help turn an idea into a playable prototype, then a full production plan."], ["Do you handle monetisation?", "Yes. Ads, in-app purchases and subscriptions, designed so they do not spoil the fun."], ["Do you support live updates?", "Yes. We run events, patches and balancing after launch."]],
    work: ["skyforge", "pixelpirates", "neonracer"], prods: ["vrgaming", "learningplatform", "hologuide"], more: ["ar-vr", "mobile-apps", "custom"],
  },
  {
    id: "ar-vr",
    lede: "Augmented and virtual reality for training, retail, property and events, experiences people can try on a headset, a phone or a browser.",
    stmt: "If it is easier to show than to explain, build it in 3D.",
    p: ["We pick the format that fits your audience: browser-based 3D for reach, phone AR for convenience, or headsets for full immersion.", "Content is built so you can update it yourself, and we measure how people use it."],
    capsTitle: "What we build in AR and VR",
    caps: [
      { chip: "Walk-through showrooms", h: "Walk-through showrooms and tours", d: "Let customers explore products, properties and venues before they visit or buy.", subs: [["Virtual tours", "360° tours with hotspots and floor plans."], ["3D product views", "Rotate, zoom and customise."]], vis: list("Tour hotspots", "Living room|Open", "Kitchen|Open", "Floor plan|Open", "Book a visit|Open") },
      { chip: "Training and simulation", h: "Training and simulation", d: "Practise safely in VR and measure how people perform, without the cost of real equipment.", subs: [["VR training", "Step-by-step scenarios with scoring."], ["Progress tracking", "See who completed what."]], vis: bars("Pass rate, %", W6, [48, 56, 63, 72, 80, 91]) },
      { chip: "AR on a phone", h: "AR on a phone", d: "Overlays and guides that appear on the real world through the camera, with no headset needed.", subs: [["Try-before-you-buy", "Place products in the room."], ["Guided overlays", "Step-by-step help on the real object."]], vis: flow("AR guide", "Scan the object", "See the overlay", "Follow the steps", "Mark complete") },
      { chip: "Events and campaigns", h: "Events and campaigns", d: "Branded experiences for launches, expos and campaigns that people share.", subs: [["Interactive installations", "Booth and showroom experiences."], ["Analytics", "Sessions, dwell time and enquiries."]], vis: bars("Sessions per day", ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], [22, 34, 41, 52, 66, 88]) },
    ],
    paysTitle: "Where AR and VR pay off first",
    pays: ["Customers cannot visit your property or venue in person", "Training is costly, risky or hard to repeat", "Products are better understood in 3D", "You want a standout experience at an event", "Remote teams need to learn together"],
    words: ["VR", "AR", "360°", "3D", "Unity", "Quest", "Hotspots", "Training", "Showroom", "WebXR"],
    teamNote: "3D artists, engineers and designers who build immersive work for real audiences.",
    steps: ["Choose the format and audience, and define what the experience must achieve.", "A rough interactive scene to test on the device your audience will use.", "Full build, optimisation and publishing to headsets, phones or the web."],
    faq: [["Do users need a headset?", "Not always. Many experiences work in a browser or on a phone, and we use headsets where full immersion is worth it."], ["Which devices do you support?", "Meta Quest, other standalone headsets, iOS and Android AR, and WebXR in the browser."], ["Can we update the content ourselves?", "Yes. We build simple tools so you can change scenes, text and media without a developer."], ["How much does it cost?", "It depends on scope. A simple 360° tour is far cheaper than a full training simulation, and we will give you a clear estimate."]],
    work: ["orbitvr", "landmark", "neonracer"], prods: ["vrshowroom", "virtualtours", "hologuide"], more: ["games", "mobile-apps", "custom"],
  },
  {
    id: "marketing",
    lede: "Brand, search, paid, social, content and analytics run as one growth engine, with reporting you can read without a translator.",
    stmt: "Marketing works when every channel pulls in the same direction.",
    p: ["We start with your customers and numbers, choose the few channels that matter and run them together so each one helps the others.", "You get a simple monthly report that shows spend, leads, sales and what we will do next."],
    capsTitle: "What we run for you",
    caps: [
      { chip: "Search and content", h: "Search and content that compounds", d: "SEO and useful content bring steady, free traffic that keeps growing.", subs: [["SEO", "Technical fixes, keywords and links."], ["Content", "Articles and pages that answer real questions."]], vis: bars("Organic visits", M6, [20, 28, 39, 52, 68, 90]) },
      { chip: "Paid and social", h: "Paid and social that pay back", d: "Google, Meta and social campaigns tuned for cost per lead and return on spend.", subs: [["Paid search and social", "Creative, targeting and testing."], ["Conversion tracking", "Know which ad led to which sale."]], vis: bars("Cost per lead, $", M6, [48, 42, 35, 29, 24, 19]) },
      { chip: "Brand and creative", h: "Brand and creative that sticks", d: "Logos, guidelines, videos and social content that make you easy to recognise.", subs: [["Brand identity", "Logo, colours and voice."], ["Social content", "Posts, reels and campaigns."]], vis: list("This month's content", "Brand film|Editing", "Reel series|Scheduled", "Blog posts|Published", "Email campaign|Draft") },
      { chip: "Analytics you can read", h: "Analytics you can read", d: "One dashboard connects traffic, leads and revenue so decisions are quick.", subs: [["Dashboards", "Google Analytics, ads and CRM together."], ["Monthly reports", "Plain-language summaries."]], vis: flow("Lead journey", "Sees an ad", "Visits the site", "Enquires", "Becomes a customer") },
    ],
    paysTitle: "Where marketing pays off first",
    pays: ["Your site gets little organic traffic", "Ad spend rises but leads do not", "You do not know which channel works", "Your brand looks different everywhere", "Reports are confusing or missing"],
    words: ["SEO", "Ads", "Content", "Social", "Brand", "Email", "Analytics", "Video", "Funnels", "Leads"],
    teamNote: "Strategists, designers, writers and analysts working to the same goals.",
    steps: ["Audit your channels, customers and numbers and set targets.", "Test messages and channels at small scale.", "Scale what works and report monthly."],
    faq: [["How soon will I see results?", "Paid campaigns can bring leads within weeks. SEO and content build over three to six months."], ["Do you guarantee rankings?", "No honest agency can. We commit to the work, the targets and clear reporting."], ["Can you work with our in-house team?", "Yes. We can lead, support or fill gaps."], ["What does it cost?", "Retainers depend on channels and scope. We will propose a plan that fits your budget."]],
    work: ["aurum", "bloom", "harbor"], prods: ["leadflow", "aianalytics", "bookingengine"], more: ["ecommerce", "custom", "ai"],
  },
  {
    id: "custom",
    lede: "Software built the way you work, from a small internal tool to a full platform, designed with you and built to last.",
    stmt: "If off-the-shelf does not fit, build what does.",
    p: ["We start by learning how your team really works, then build only what is needed, in stages you can use early.", "You own the code, and we document it so anyone can maintain it."],
    capsTitle: "What we build",
    caps: [
      { chip: "Internal tools", h: "Internal tools that save hours", d: "Dashboards, admin panels and workflow apps that replace spreadsheets and email chains.", subs: [["Workflow apps", "Requests, approvals and tracking."], ["Admin panels", "Manage data without a developer."]], vis: list("Request queue", "Leave request|Approve", "Purchase order|Review", "Access request|Approve", "Expense claim|Review") },
      { chip: "Customer-facing platforms", h: "Customer-facing platforms", d: "Products your customers use, with accounts, payments and a polished experience.", subs: [["Web platforms", "Fast, secure and scalable."], ["Payments and accounts", "Sign-up, billing and roles."]], vis: bars("Active users", W6, [30, 41, 55, 66, 79, 94]) },
      { chip: "Integrations", h: "Integrations and data", d: "Connect the tools you already use and keep data clean and in one place.", subs: [["APIs", "Build and consume them."], ["Data migration", "Move safely from legacy systems."]], vis: flow("Data sync", "Source system", "Clean and map", "Your platform", "Reports") },
      { chip: "Modernisation", h: "Modernise legacy systems", d: "Rebuild or wrap old software so it is faster, safer and easier to change.", subs: [["Refactoring", "Pay down technical debt."], ["Cloud move", "Host reliably and cost-effectively."]], vis: bars("Page load time, ms", ["Old", "Step 1", "Step 2", "Step 3", "Now"], [90, 70, 52, 38, 24]) },
    ],
    paysTitle: "Where custom software pays off first",
    pays: ["Your team works around a tool that does not fit", "Spreadsheets run critical processes", "Systems do not talk to each other", "A legacy app is slow and risky to change", "You have a product idea that needs building"],
    words: ["Platforms", "APIs", "Dashboards", "Cloud", "Security", "Workflows", "Integrations", "Mobile", "Testing", "Support"],
    teamNote: "Analysts, designers, developers and testers who stay with you after launch.",
    steps: ["Map your process, users and priorities and agree a scope.", "A clickable prototype or thin working slice.", "Build in stages, release early and migrate your data."],
    faq: [["Do I own the code?", "Yes. You own the code and we hand over documentation."], ["How do you price projects?", "Fixed price for clear scopes, or monthly teams for evolving ones."], ["Can we start small?", "Yes. Most clients begin with one tool or one stage and grow from there."], ["Do you maintain it afterwards?", "Yes, if you want. Support plans cover fixes, updates and new features."]],
    work: ["fleetline", "hiretrack", "ledgerly"], prods: ["fieldservice", "assettracker", "propertymanager"], more: ["erp", "saas", "web-portals"],
  },
  {
    id: "plugins",
    lede: "Plugins and apps that extend WordPress, Shopify, Magento and Wix, so the platform you already use can do exactly what your business needs.",
    stmt: "Do not change your platform. Extend it.",
    p: ["We build clean, well-tested plugins that follow each platform's standards, so updates do not break them.", "We can build a private plugin for your store or a public one for the marketplace."],
    capsTitle: "What we build",
    caps: [
      { chip: "WordPress and WooCommerce", h: "WordPress and WooCommerce", d: "Custom plugins, blocks and integrations that stay fast and update-safe.", subs: [["Custom plugins", "Features built to your spec."], ["Performance", "Light on queries and load time."]], vis: list("Plugin features", "Custom checkout fields|Done", "Delivery date picker|Done", "ERP sync|Done", "Admin report|Testing") },
      { chip: "Shopify apps", h: "Shopify apps and themes", d: "Public and custom apps, theme sections and checkout extensions.", subs: [["Custom apps", "Private apps for your store."], ["Theme work", "Sections and features that fit your brand."]], vis: flow("Order app", "Order placed", "App checks rules", "ERP updated", "Customer notified") },
      { chip: "Magento and Wix", h: "Magento and Wix extensions", d: "Modules and Velo code that add features without hacking the core.", subs: [["Magento modules", "Catalogue, pricing and checkout logic."], ["Wix Velo", "Custom pages and integrations."]], vis: bars("Install growth", M6, [10, 18, 29, 42, 58, 78]) },
      { chip: "Marketplace-ready", h: "Marketplace-ready", d: "Billing, onboarding, docs and support so your plugin is ready to sell.", subs: [["Listing and review", "Store submission handled."], ["Updates and support", "Compatibility with new versions."]], vis: list("Release checklist", "Security review|Passed", "Compatibility tests|Passed", "Docs and onboarding|Ready", "Store listing|Submitted") },
    ],
    paysTitle: "Where a plugin pays off first",
    pays: ["A feature you need does not exist", "Several plugins clash or slow the site", "You must connect the store to another system", "You want to sell your own app", "An old plugin is unsupported"],
    words: ["WordPress", "WooCommerce", "Shopify", "Magento", "Wix", "Blocks", "Hooks", "APIs", "Themes", "Updates"],
    teamNote: "Platform specialists who know each marketplace's rules.",
    steps: ["Define the feature and check what already exists.", "A working proof on a staging site.", "Build, test across versions and release."],
    faq: [["Why not use an existing plugin?", "If one fits, we will say so. Custom plugins make sense when you need specific behaviour or fewer moving parts."], ["Will updates break it?", "We follow platform standards and test against new versions."], ["Can you publish it to the marketplace?", "Yes. We prepare, submit and support public plugins."], ["Who owns it?", "You do."]],
    work: ["bloom", "threadwell", "brewlab"], prods: ["bookingengine", "orderportal", "retailpos"], more: ["ecommerce", "custom", "web-portals"],
  },
  {
    id: "erp",
    lede: "Enterprise resource planning built for your business, covering finance, stock, sales, people and reports in one system at a price you can afford.",
    stmt: "One system, one version of the truth.",
    p: ["We map your processes, then build only the modules you need, so you are not paying for a giant suite you will never use.", "Modules can be added over time, and everything shares the same data."],
    capsTitle: "What an ERP covers",
    caps: [
      { chip: "Finance and accounting", h: "Finance and accounting", d: "Invoices, payments, tax and books that stay accurate because they are fed by the rest of the business.", subs: [["Billing and tax", "GST-ready invoices and filings."], ["Accounts", "Ledgers, expenses and reconciliation."]], vis: bars("Cash collected, lakh", M6, [8, 11, 14, 17, 22, 28]) },
      { chip: "Stock and purchasing", h: "Stock and purchasing", d: "Know what you have, what is on order and what to reorder, across warehouses.", subs: [["Inventory", "Batches, barcodes and transfers."], ["Purchasing", "Orders, receipts and vendor bills."]], vis: flow("Purchase to stock", "Reorder alert", "Purchase order", "Goods received", "Stock updated") },
      { chip: "Sales and customers", h: "Sales and customers", d: "Quotes, orders, deliveries and customer history in one flow.", subs: [["Sales orders", "Quote to cash."], ["CRM", "Contacts and follow-ups."]], vis: list("Sales pipeline", "Quote sent|12", "Order confirmed|8", "Delivered|21", "Invoice paid|34") },
      { chip: "People and reports", h: "People and reports", d: "Attendance, payroll and management dashboards that update live.", subs: [["HR and payroll", "Attendance, leave and salary."], ["Management reports", "Profit, stock and performance."]], vis: bars("Profit by month, lakh", M6, [5, 6, 8, 9, 12, 15]) },
    ],
    paysTitle: "Where an ERP pays off first",
    pays: ["Data lives in many spreadsheets", "Month-end close takes days", "Stock counts never match", "Teams cannot see each other's numbers", "Off-the-shelf ERP is too expensive or rigid"],
    words: ["Finance", "Inventory", "Sales", "Purchasing", "HR", "Payroll", "Reports", "Tax", "Multi-branch", "Approvals"],
    teamNote: "Business analysts and engineers who understand how companies run.",
    steps: ["Map your processes and choose the modules to build first.", "A working core module that your team tries on real data.", "Roll out module by module, train users and migrate data."],
    faq: [["Is it cheaper than a big-brand ERP?", "Usually yes, because you only build what you need and avoid per-seat licences."], ["Can it grow with us?", "Yes. New modules, branches and users can be added."], ["Can you migrate our old data?", "Yes. We clean and import it with checks."], ["Do you train our team?", "Yes. Training and documentation are part of the rollout."]],
    work: ["ledgerly", "schoolsphere", "fleetline"], prods: ["stockpilot", "invoicehub", "peopledesk"], more: ["custom", "web-portals", "saas"],
  },
  {
    id: "saas",
    lede: "Subscription software built to launch, sell and scale, from MVP to multi-tenant platform with billing, onboarding and analytics included.",
    stmt: "Ship the smallest product that can earn its first customers.",
    p: ["We help you cut the idea down to an MVP, build it fast and add accounts, billing and analytics from day one.", "The architecture is ready to grow into multiple customers, plans and regions."],
    capsTitle: "What goes into a SaaS product",
    caps: [
      { chip: "MVP in weeks", h: "An MVP in weeks, not quarters", d: "Focus on the one job your customer pays for, then launch and learn.", subs: [["Product scoping", "Cut to what matters."], ["Fast build", "Working software early."]], vis: flow("MVP path", "Idea", "Prototype", "First customers", "Iterate") },
      { chip: "Accounts and billing", h: "Accounts, plans and billing", d: "Sign-up, teams, roles, trials, subscriptions and invoices that work from launch.", subs: [["Subscriptions", "Monthly, yearly and usage-based."], ["Teams and roles", "Invite users and set permissions."]], vis: list("Plans", "Starter|$19", "Growth|$59", "Scale|$149", "Enterprise|Talk") },
      { chip: "Multi-tenant platform", h: "Built to scale", d: "Secure data separation, background jobs, caching and monitoring so growth does not break things.", subs: [["Multi-tenancy", "Many customers, one platform."], ["Reliability", "Backups, alerts and uptime."]], vis: bars("Customers", M6, [4, 9, 17, 29, 46, 71]) },
      { chip: "Analytics and growth", h: "Analytics and growth", d: "Product analytics, onboarding flows and admin tools to understand and grow usage.", subs: [["Product analytics", "Activation, retention and churn."], ["Onboarding", "Get users to value faster."]], vis: bars("Trial to paid, %", M6, [6, 8, 11, 14, 17, 21]) },
    ],
    paysTitle: "Where SaaS development pays off first",
    pays: ["You have a product idea but no technical team", "A prototype needs to become a real product", "You sell a service that could be software", "Billing and accounts are held together by hand", "Your product struggles as customers grow"],
    words: ["MVP", "Billing", "Multi-tenant", "Teams", "Plans", "Analytics", "Onboarding", "API", "Admin", "Scale"],
    teamNote: "Product managers, designers and engineers who have launched SaaS before.",
    steps: ["Define the customer, the problem and the smallest product that solves it.", "A prototype in front of real customers.", "Build the MVP with accounts, billing and analytics."],
    faq: [["How long does an MVP take?", "Typically eight to sixteen weeks, depending on scope."], ["Can you help with the idea?", "Yes. We run product workshops to sharpen scope and priorities."], ["Do I own the product?", "Yes. You own the code and IP."], ["Can it handle growth?", "Yes. We design for multiple tenants and add capacity as you grow."]],
    work: ["ledgerly", "hiretrack", "learnloop"], prods: ["leadflow", "peopledesk", "learningplatform"], more: ["custom", "ai-models", "web-portals"],
  },
]

export const getService = (id: string) => DETAILS.find((d) => d.id === id) ?? null
