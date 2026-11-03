/* SAMPLE CONTENT: replace link targets and labels with Sybertron's real pages. */
export type FooterLink = { label: string; href: string };
export type FooterGroup = { title: string; links: FooterLink[] };

export const footerGroups: FooterGroup[] = [
  {
    title: "Services",
    links: [
      "AI Automations", "AI Agent Development", "AI Model Integration", "Web Portals", "Ecommerce", "Mobile Apps", "Game Development",
      "AR/VR", "Digital Marketing", "Custom Development", "Plugin Development", "ERP Systems", "SaaS Product Development",
    ].map((label, i) => ({ label, href: `/services/${["ai", "ai-agents", "ai-models", "web-portals", "ecommerce", "mobile-apps", "games", "ar-vr", "marketing", "custom", "plugins", "erp", "saas"][i]}` })),
  },
  {
    title: "Products",
    links: [
      { label: "PeopleDesk", href: "/products/peopledesk" },
      { label: "LeadFlow CRM", href: "/products/leadflow" },
      { label: "DineOS", href: "/products/dineos" },
      { label: "StockPilot", href: "/products/stockpilot" },
      { label: "All products", href: "/products" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Work", href: "/work" },
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "#contact" },
      { label: "RAPID RESPONSE", href: "/urgent" },
    ],
  },
];

export const socials = [
  { id: "facebook", label: "Sybertron on Facebook", href: "https://facebook.com" },
  { id: "instagram", label: "Sybertron on Instagram", href: "https://instagram.com" },
  { id: "linkedin", label: "Sybertron on LinkedIn", href: "https://linkedin.com" },
];

export const legalLinks: FooterLink[] = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms and conditions", href: "/terms" },
  { label: "Cookie policy", href: "/cookies" },
];
export const utilityLinks: FooterLink[] = [
  { label: "Cookie settings", href: "#cookie-settings" },
  { label: "Lite version", href: "/lite" },
];
