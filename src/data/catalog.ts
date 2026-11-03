/* SAMPLE CONTENT: replace with Sybertron's real product catalogue. 28 products in 8 categories. */
import { products as base, type Mock } from "./products"

export type Category = { id: string; label: string; tone: string }
export const categories: Category[] = [
  { id: "finance-pos", label: "Finance & POS", tone: "#b8f36b" },
  { id: "operations", label: "Operations", tone: "#c9b7ff" },
  { id: "people", label: "People", tone: "#ffd764" },
  { id: "commerce", label: "Commerce", tone: "#ffb8c6" },
  { id: "ai-data", label: "AI & data", tone: "#a9dcff" },
  { id: "security-cloud", label: "Security & cloud", tone: "#9eebd2" },
  { id: "ar-vr", label: "AR/VR", tone: "#ffb59e" },
  { id: "education", label: "Education", tone: "#d7c8ff" },
]

export type CatalogItem = {
  id: string; cat: string; name: string; blurb: string; bullets: string[]
  platforms: string; accent: string; mock: Mock
}

const PAL = ["#7c73ff", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#f97316", "#3b82f6"]
const LIST_P = [92, 85, 78, 96, 70, 88]
const TILE_P = [90, 20, 60, 5, 60, 90, 20, 5, 60, 90, 5, 20]
const CHART_P = [28, 36, 30, 48, 44, 58, 52, 70]

type Spec = [
  id: string, cat: string, name: string, blurb: string, bullets: [string, string, string], platforms: string,
  variant: Mock["variant"], crumb: string, heading: string, attention: string,
  kpis: [string, string][], alerts: [string, string][], labels?: string[],
]

const SPECS: Spec[] = [
  ["invoicehub", "finance-pos", "Invoice Hub", "Quotes, GST invoices and payment reminders that chase themselves.", ["GST-ready invoices and e-way bills", "Automatic payment reminders", "Expense and tax reports"], "Web app · Phone app", "chart", "Billing / Invoices", "Collected, last 8 weeks", "Overdue", [["₹12.4L", "Billed this month"], ["₹3.1L", "Outstanding"], ["96%", "Paid on time"]], [["4 invoices overdue", "Reminder sends tomorrow"], ["Quote #218 accepted", "Convert to invoice"]]],
  ["retailpos", "finance-pos", "Retail POS", "Fast checkout, barcode billing and stock sync for shops of any size.", ["Barcode and weighing-scale billing", "Works offline, syncs later", "Returns, discounts and loyalty"], "Tablet & desktop POS · Web dashboard", "chart", "Shop / Sales", "Sales, last 8 days", "Low stock", [["₹86k", "Sales today"], ["214", "Bills"], ["₹403", "Avg. basket"]], [["Rice 5kg: 6 left", "Reorder level is 20"], ["Till 2 closing", "Cash count pending"]]],
  ["dineos", "finance-pos", "", "", ["", "", ""], "", "list", "", "", "", [], []],
  ["salonplanner", "finance-pos", "Salon Planner", "Bookings, checkout and staff earnings for salons and spas.", ["Online booking by stylist", "Deposits and package sales", "Commission and payroll reports"], "Web POS · Salon website · Staff login", "list", "Salon / Today", "Chairs booked by service", "Walk-ins waiting", [["38", "Bookings today"], ["₹54k", "Revenue"], ["4", "No-shows"]], [["Priya: 11:30 colour", "Needs a deposit"], ["Package expiring", "3 clients this week"]], ["Hair", "Spa", "Nails", "Makeup", "Barber", "Bridal"]],

  ["stockpilot", "operations", "", "", ["", "", ""], "", "list", "", "", "", [], []],
  ["smartfacility", "operations", "Smart Facility", "Every building, tenant, lease and work order on one dashboard.", ["Live occupancy per building", "Units, floors and amenities", "Lease renewals in one click"], "Web dashboard · Tenant app · Guard app", "chart", "Facility / Dashboard", "Occupancy by building", "Open work orders", [["92%", "Occupancy"], ["17", "Open tickets"], ["5", "Leases ending"]], [["Lift B inspection", "Due on Friday"], ["Lease: Unit 4C", "Renews in 12 days"]]],
  ["fleettracker", "operations", "Fleet Tracker", "Live vehicle tracking, trips and fuel reports for fleets.", ["Live map with trip history", "Driver and fuel reports", "Maintenance reminders"], "Web app · Driver app", "list", "Fleet / Live", "On-time trips by route", "Service due", [["42", "Vehicles live"], ["6", "Idle > 30 min"], ["94%", "On-time trips"]], [["Truck 07: service", "Due in 300 km"], ["Route C delayed", "Traffic near Gurugram"]], ["Route A", "Route B", "Route C", "Route D", "Route E", "Route F"]],
  ["assettracker", "operations", "Asset Tracker", "Know where every asset is, who has it and when it's due for service.", ["QR and barcode asset tags", "Check-in and check-out log", "Service and warranty alerts"], "Web app · Phone scanner app", "tiles", "Assets / Registry", "Assets by status", "Service due", [["1,240", "Assets tracked"], ["86", "Checked out"], ["9", "Service due"]], [["Laptop L-204", "Warranty ends in 14 days"], ["Drill D-31", "Overdue by 3 days"]]],
  ["fieldservice", "operations", "Field Service", "Dispatch technicians, track jobs and collect sign-off on site.", ["Job scheduling and dispatch", "Photo and signature capture", "Customer status updates"], "Web dispatch · Technician app", "list", "Jobs / Today", "Jobs done by team", "Unassigned jobs", [["64", "Jobs today"], ["11", "In progress"], ["2", "Unassigned"]], [["Job #882 unassigned", "Customer waiting"], ["Signature missing", "Job #871"]], ["Team A", "Team B", "Team C", "Team D", "Team E", "Team F"]],
  ["propertymanager", "operations", "Property Manager", "Listings, tenants, rent and repairs for property managers.", ["Rent roll and reminders", "Maintenance requests", "Owner statements"], "Web app · Tenant app", "chart", "Property / Rent", "Rent collected, last 8 months", "Overdue rent", [["₹18.6L", "Rent due"], ["93%", "Collected"], ["7", "Repairs open"]], [["Flat 12B: rent late", "Reminder sent"], ["Plumber booked", "Tower 3, 4 pm"]]],

  ["peopledesk", "people", "", "", ["", "", ""], "", "list", "", "", "", [], []],
  ["visitorpass", "people", "Visitor Pass", "Pre-register guests, print badges and keep an audit trail.", ["QR pre-registration", "Badge printing at the desk", "Host alerts on arrival"], "Web app · Kiosk · Phone app", "tiles", "Front desk / Visitors", "Visitors by hour", "Waiting at desk", [["48", "Visitors today"], ["6", "On site"], ["3", "Expected"]], [["R. Mehta arrived", "Host notified"], ["Contractor badge", "Expires at 6 pm"]]],
  ["clinicdesk", "people", "Clinic Desk", "Appointments, patient records and billing for clinics.", ["Online appointments", "Prescriptions and visit notes", "Billing and reminders"], "Web app · Reception tablet", "list", "Clinic / Today", "Appointments by department", "Waiting room", [["58", "Appointments"], ["5", "Waiting"], ["₹71k", "Billed"]], [["Follow-up due", "12 patients this week"], ["Lab report ready", "Dr. Rao to review"]], ["General", "Dental", "Skin", "Child", "Eye", "Ortho"]],
  ["gymmanager", "people", "Gym Manager", "Memberships, classes and access control for gyms and studios.", ["Plans and auto-renewal", "Class booking and waitlists", "Door access by QR"], "Web app · Member app", "chart", "Gym / Members", "Check-ins, last 8 days", "Renewals due", [["1,120", "Active members"], ["142", "Check-ins today"], ["31", "Renewals due"]], [["Yoga 6 pm full", "9 on waitlist"], ["Plan expiring", "31 members this week"]]],

  ["leadflow", "commerce", "", "", ["", "", ""], "", "chart", "", "", "", [], []],
  ["bookingengine", "commerce", "Booking Engine", "Take bookings, deposits and reminders on your own website.", ["Calendar and resource rules", "Deposits and prepayment", "SMS and email reminders"], "Web widget · Admin app", "tiles", "Bookings / Calendar", "Slots filled this week", "Pending deposits", [["126", "Bookings this week"], ["₹2.4L", "Deposits"], ["4%", "No-show rate"]], [["Saturday nearly full", "3 slots left"], ["Deposit pending", "Booking #4412"]]],
  ["orderportal", "commerce", "Order Portal", "A bulk-ordering portal for distributors and wholesale buyers.", ["Customer-specific price lists", "Reorder from past orders", "Credit limits and approvals"], "Web portal · Sales rep app", "list", "Portal / Orders", "Orders by channel", "Needs approval", [["212", "Orders this week"], ["₹38L", "Order value"], ["9", "Awaiting approval"]], [["Dealer over limit", "Approve or hold"], ["New price list", "Goes live Monday"]], ["Retail", "Wholesale", "Dealers", "Export", "Online", "Direct"]],

  ["aichatbot", "ai-data", "AI Chatbot", "A support and sales assistant trained on your own content.", ["Answers from your documents", "Hands over to your team", "WhatsApp and website chat"], "Website widget · WhatsApp · Admin dashboard", "chart", "Chatbot / Conversations", "Conversations, last 8 days", "Needs a human", [["2,310", "Chats this month"], ["81%", "Resolved by bot"], ["14s", "First reply"]], [["Refund question", "Handed to support"], ["New topic found", "Add to knowledge base"]]],
  ["aianalytics", "ai-data", "AI-Powered Analytics", "Ask questions of your data in plain language and get charts back.", ["Plain-language questions", "Scheduled reports", "Connects to your database"], "Web app · Email reports", "chart", "Analytics / Ask", "Revenue, last 8 weeks", "Insights", [["+12%", "Revenue vs last month"], ["38", "Reports saved"], ["5", "New insights"]], [["Churn up in Pune", "Worth a look"], ["Weekly report", "Sent to 6 people"]]],
  ["documentvault", "ai-data", "Document Vault", "Search, tag and extract data from contracts, invoices and forms.", ["Automatic data extraction", "Full-text search", "Role-based access"], "Web app · Email-in", "list", "Vault / Documents", "Documents by type", "Needs review", [["18.4k", "Documents"], ["96%", "Auto-tagged"], ["23", "To review"]], [["Contract expiring", "Vendor: Orion Labs"], ["Low-confidence scan", "Invoice #2291"]], ["Contracts", "Invoices", "Forms", "HR", "Legal", "Other"]],

  ["securitysuite", "security-cloud", "Security & Compliance", "Monitoring, access control and compliance checks in one place.", ["Login and access monitoring", "Compliance checklists", "Alerts for risky changes"], "Web dashboard · Alerts by email and chat", "tiles", "Security / Overview", "Checks by status", "Alerts", [["98%", "Checks passing"], ["3", "Open alerts"], ["12", "Audits ready"]], [["Admin login: new device", "Verify with user"], ["Policy review", "Due in 5 days"]]],
  ["cloudbackup", "security-cloud", "Cloud Infrastructure", "Automatic backups, fast restores and cost control for cloud workloads.", ["Scheduled encrypted backups", "One-click restore", "Usage and cost reports"], "Web console · CLI", "list", "Cloud / Backups", "Backup health by workload", "Failed jobs", [["99.9%", "Uptime"], ["214", "Backups this week"], ["₹1.1L", "Monthly cost"]], [["Backup job failed", "Mail server, retrying"], ["Cost spike", "Storage up 18%"]], ["Database", "Files", "Servers", "Mail", "Apps", "Logs"]],

  ["vrshowroom", "ar-vr", "VR Showroom", "Let customers walk through products and spaces before they buy.", ["Immersive 3D environments", "Real-time interaction", "Works on headsets and browsers"], "VR headsets · Desktop", "tiles", "Showroom / Scenes", "Sessions by scene", "Popular", [["3D", "Scenes live"], ["420", "Sessions"], ["6 min", "Avg. visit"]], [["Scene 2 most visited", "Add a call to action"], ["New product model", "Ready to publish"]]],
  ["virtualtours", "ar-vr", "Virtual Tours", "Interactive 360° tours for properties, venues and campuses.", ["360° photo and video tours", "Hotspots and floor plans", "Embeds in your website"], "Web · Phone · VR headsets", "chart", "Tours / Views", "Tour views, last 8 days", "Enquiries", [["64", "Tours live"], ["9.2k", "Views"], ["212", "Enquiries"]], [["Tour 18 updated", "Floor 3 added"], ["New enquiry", "From the villa tour"]]],
  ["vrgaming", "ar-vr", "VR Gaming", "VR games and simulations people want to come back to.", ["Optimised for affordable hardware", "Comfort-first design", "Diverse content"], "VR headsets", "tiles", "Games / Library", "Sessions by game", "New release", [["12", "Titles"], ["8.4k", "Players"], ["22 min", "Avg. session"]], [["Update 1.4", "Rolling out today"], ["Motion comfort", "Test results in"]]],
  ["hologuide", "ar-vr", "Holo Guide", "AR overlays and guided walkthroughs for training and retail.", ["AR overlays on a phone", "Step-by-step training mode", "Content you can update yourself"], "Phone app · Tablet · AR glasses", "chart", "Guides / Usage", "Guides opened, last 8 days", "Updates", [["38", "Guides"], ["1.9k", "Completions"], ["91%", "Pass rate"]], [["Guide 12 outdated", "Update steps"], ["New store layout", "Overlay ready"]]],

  ["school360", "education", "School360", "School management: admissions, fees, report cards and a parent app.", ["Fee vouchers and online payments", "Report cards and attendance", "Parent and teacher apps"], "Web app · Phone & tablet browser · Desktop app", "list", "School / Overview", "Attendance by class", "Fees due", [["1,480", "Students"], ["94%", "Present today"], ["₹6.2L", "Fees due"]], [["Class 8 results", "Ready to publish"], ["Fee reminder", "Sends tomorrow"]], ["Class 1", "Class 3", "Class 5", "Class 7", "Class 9", "Class 11"]],
  ["learningplatform", "education", "Learning Platform", "A learning platform for academies: courses, question banks and live classes.", ["Course and subject builder", "Objective and subjective questions", "Live classes and paid plans"], "Web admin · Student portal · Phone app", "chart", "Learning / Courses", "Lessons completed, last 8 days", "Live today", [["340", "Active learners"], ["24", "Courses"], ["78%", "Completion"]], [["Live class 5 pm", "Physics, 42 joined"], ["Question bank", "120 new questions"]]],
]

const mk = (s: Spec, i: number): Mock => {
  const [, , , , , , variant, crumb, heading, attention, kpis, alerts, labels = []] = s
  const rows =
    variant === "list"
      ? labels.map((n, k) => ({ n, p: LIST_P[k % 6], t: `${LIST_P[k % 6]}%` }))
      : variant === "chart"
        ? CHART_P.map((p, k) => ({ n: `W${k + 1}`, p, t: "" }))
        : TILE_P.map((p, k) => ({ n: `T${k + 1}`, p, t: "" }))
  return {
    variant, crumb, title: crumb.split(" / ")[1] ?? crumb, heading, attention,
    accent: PAL[i % 8], accent2: PAL[(i + 3) % 8],
    kpis: kpis.map(([v, l]) => ({ v, l })), rows, alerts: alerts.map(([t, s2]) => ({ t, s: s2 })),
  }
}

export const catalog: CatalogItem[] = SPECS.map((s, i) => {
  const existing = base.find((b) => b.id === s[0])
  if (existing)
    return { id: existing.id, cat: s[1], name: existing.name, blurb: existing.blurb, bullets: existing.bullets.slice(0, 3), platforms: existing.platforms, accent: existing.accent, mock: existing.mock }
  return { id: s[0], cat: s[1], name: s[2], blurb: s[3], bullets: s[4], platforms: s[5], accent: PAL[i % 8], mock: mk(s, i) }
})

export const catalogNames = catalog.map((p) => p.name)
