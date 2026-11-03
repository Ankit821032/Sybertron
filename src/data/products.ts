/* SAMPLE CONTENT: replace names, copy and mock-up data with Sybertron's real products. */
export type Mock = {
  variant: "list" | "chart" | "tiles";
  crumb: string; title: string; heading: string; attention: string;
  accent: string; accent2: string;
  kpis: { v: string; l: string }[];
  rows: { n: string; p: number; t: string }[];
  alerts: { t: string; s: string }[];
};

export type Product = {
  id: string; category: string; name: string; url: string; blurb: string;
  bullets: string[]; platforms: string; accent: string; mock: Mock;
};

export const products: Product[] = [
  {
    id: "peopledesk", category: "HR & Payroll", name: "PeopleDesk", url: "peopledesk.sybertron.com",
    blurb: "Attendance, leave and payroll for growing teams, from punch-in to payslip.",
    bullets: ["GPS and biometric attendance", "GST-ready payroll with PF and ESI", "Shift and leave rules", "Employee self-service app"],
    platforms: "Web app · Phone app · Desktop app", accent: "#7c73ff",
    mock: {
      variant: "list", crumb: "People / Overview", title: "Attendance", heading: "Present by department", attention: "Needs attention",
      accent: "#7c73ff", accent2: "#c084fc",
      kpis: [{ v: "126", l: "Present today" }, { v: "8", l: "On leave" }, { v: "3", l: "Late arrivals" }],
      rows: [{ n: "Engineering", p: 92, t: "46 / 50" }, { n: "Design", p: 85, t: "17 / 20" }, { n: "Sales", p: 78, t: "31 / 40" }, { n: "Support", p: 96, t: "24 / 25" }, { n: "Finance", p: 70, t: "7 / 10" }, { n: "Operations", p: 88, t: "22 / 25" }],
      alerts: [{ t: "5 timesheets pending", s: "Approve before payroll closes" }, { t: "2 leave requests", s: "Waiting for manager review" }],
    },
  },
  {
    id: "leadflow", category: "Sales & CRM", name: "LeadFlow CRM", url: "leadflow.sybertron.com",
    blurb: "Track every lead from first enquiry to signed deal, with follow-ups that never slip.",
    bullets: ["Pipeline with follow-up reminders", "WhatsApp and email in one inbox", "Quotes and GST invoices", "Team targets and reports"],
    platforms: "Web app · Phone & tablet browser", accent: "#06b6d4",
    mock: {
      variant: "chart", crumb: "Sales / Pipeline", title: "Revenue", heading: "Closed deals, last 12 weeks", attention: "Follow up today",
      accent: "#22d3ee", accent2: "#6366f1",
      kpis: [{ v: "₹48.2L", l: "Pipeline value" }, { v: "37", l: "Open deals" }, { v: "24%", l: "Win rate" }],
      rows: [{ n: "W1", p: 28, t: "" }, { n: "W2", p: 36, t: "" }, { n: "W3", p: 30, t: "" }, { n: "W4", p: 48, t: "" }, { n: "W5", p: 44, t: "" }, { n: "W6", p: 58, t: "" }, { n: "W7", p: 52, t: "" }, { n: "W8", p: 70, t: "" }, { n: "W9", p: 66, t: "" }, { n: "W10", p: 82, t: "" }],
      alerts: [{ t: "Call back: Mehta Traders", s: "Quote sent 3 days ago" }, { t: "Proposal due: Orion Labs", s: "Today, 5:00 pm" }],
    },
  },
  {
    id: "dineos", category: "Restaurants", name: "DineOS", url: "dineos.sybertron.com",
    blurb: "Billing, kitchen and stock for restaurants and cafés in one system.",
    bullets: ["Dine-in, takeaway and delivery billing", "Kitchen display screens", "UPI and card payments", "Recipe-level stock tracking"],
    platforms: "Web app · Tablet POS · Phone app", accent: "#10b981",
    mock: {
      variant: "tiles", crumb: "Floor / Live tables", title: "Tables", heading: "Floor plan", attention: "Kitchen queue",
      accent: "#34d399", accent2: "#fbbf24",
      kpis: [{ v: "14 / 22", l: "Tables busy" }, { v: "₹86,400", l: "Sales today" }, { v: "9 min", l: "Avg. prep time" }],
      rows: [{ n: "T1", p: 90, t: "" }, { n: "T2", p: 20, t: "" }, { n: "T3", p: 60, t: "" }, { n: "T4", p: 90, t: "" }, { n: "T5", p: 5, t: "" }, { n: "T6", p: 60, t: "" }, { n: "T7", p: 90, t: "" }, { n: "T8", p: 20, t: "" }, { n: "T9", p: 5, t: "" }, { n: "T10", p: 60, t: "" }, { n: "T11", p: 90, t: "" }, { n: "T12", p: 5, t: "" }],
      alerts: [{ t: "Table 4: 2 mains", s: "Cooking, 6 min left" }, { t: "Table 7: dessert", s: "Ready to serve" }],
    },
  },
  {
    id: "stockpilot", category: "Inventory", name: "StockPilot", url: "stockpilot.sybertron.com",
    blurb: "Inventory and purchasing control across warehouses, stores and suppliers.",
    bullets: ["Multi-warehouse stock", "Barcode scanning", "Purchase orders and goods receipts", "Low-stock alerts"],
    platforms: "Web app · Handheld scanner app", accent: "#f59e0b",
    mock: {
      variant: "list", crumb: "Stock / Overview", title: "Inventory", heading: "Stock level by warehouse", attention: "Low stock",
      accent: "#fbbf24", accent2: "#f97316",
      kpis: [{ v: "4,280", l: "SKUs tracked" }, { v: "36", l: "Low-stock items" }, { v: "12", l: "Orders in transit" }],
      rows: [{ n: "Delhi", p: 84, t: "8.4k" }, { n: "Mumbai", p: 62, t: "6.2k" }, { n: "Pune", p: 74, t: "7.4k" }, { n: "Jaipur", p: 38, t: "3.8k" }, { n: "Noida", p: 91, t: "9.1k" }, { n: "Lucknow", p: 52, t: "5.2k" }],
      alerts: [{ t: "Cable 6mm: 12 left", s: "Reorder level is 50" }, { t: "PO #1042 arriving", s: "Delhi warehouse, today" }],
    },
  },
];
