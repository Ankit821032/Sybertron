/* SAMPLE CONTENT: replace with Sybertron's real projects (name, tags, summary). */
export type Project = { id: "aurum" | "fleetline" | "learnloop" | "skyforge" | "landmark"; name: string; url: string; tags: string[]; summary: string };

/* The five projects featured on the home page and the About page. */
export const projects: Project[] = [
  { id: "aurum", name: "Aurum", url: "aurum", tags: ["Jewellery & retail", "Online store"], summary: "A luxury jewellery store with a rich product gallery, fast checkout and a made-to-order enquiry flow." },
  { id: "fleetline", name: "FleetLine", url: "fleetline", tags: ["Logistics", "Web portal"], summary: "A shipment tracking portal for a logistics company, with live route maps, driver roles and customer self-service." },
  { id: "learnloop", name: "LearnLoop", url: "learnloop", tags: ["Education & test prep", "Platform"], summary: "An exam-prep platform with mock tests, progress reports and a companion mobile app for daily practice." },
  { id: "skyforge", name: "Skyforge", url: "skyforge", tags: ["Gaming", "Mobile game"], summary: "A casual adventure game for iOS and Android, from first prototype to store launch and live events." },
  { id: "landmark", name: "Landmark Realty", url: "landmarkrealty", tags: ["Real estate", "Business website"], summary: "A property website with smart search, map listings and an enquiry system wired into the sales team's CRM." },
];

/* ------------------------------------------------------------------ */
/* Full portfolio for the /work page                                    */
/* ------------------------------------------------------------------ */
export const CATEGORIES = ["Online stores", "Platforms", "Business websites", "Mobile apps", "Games & AR/VR"] as const;
export type Category = (typeof CATEGORIES)[number];
export type MockKind = "store" | "portal" | "site" | "app" | "game";

export type WorkItem = {
  id: string;
  name: string;
  url: string;
  category: Category;
  tags: string[];
  summary: string;
  /* generic illustration settings (ignored for the five hand-drawn projects) */
  kind: MockKind;
  lines: [string, string];
  colors: [string, string, string]; // background from, background to, accent
  light?: boolean;
};

const feat = (p: Project, category: Category, kind: MockKind): WorkItem => ({
  ...p, category, kind, lines: ["", ""], colors: ["#000", "#000", "#fff"],
});

export const allProjects: WorkItem[] = [
  feat(projects[0], "Online stores", "store"),
  feat(projects[1], "Platforms", "portal"),
  feat(projects[3], "Games & AR/VR", "game"),
  feat(projects[2], "Platforms", "portal"),
  feat(projects[4], "Business websites", "site"),
  { id: "bloom", name: "Bloom & Co", url: "bloomandco", category: "Online stores", kind: "store", tags: ["Florist", "Online store"], summary: "Same-day flower delivery with a bouquet builder, delivery-slot picker and subscription plans.", lines: ["Fresh blooms,", "delivered daily."], colors: ["#3a0f2a", "#7a2457", "#ff9ec7"] },
  { id: "nutribasket", name: "NutriBasket", url: "nutribasket", category: "Online stores", kind: "store", tags: ["Grocery", "Online store"], summary: "A health-food shop with diet filters, repeat-order baskets and a store-pickup option for local customers.", lines: ["Eat well,", "every single day."], colors: ["#0b3a22", "#146c3c", "#b8f36b"] },
  { id: "threadwell", name: "Threadwell", url: "threadwell", category: "Online stores", kind: "store", tags: ["Fashion", "Online store"], summary: "A fashion label's storefront with size guides, lookbooks and one-page checkout tuned for mobile shoppers.", lines: ["Made slow,", "worn forever."], colors: ["#1a1a2e", "#2d2d52", "#ffd764"] },
  { id: "brewlab", name: "Brew Lab", url: "brewlab", category: "Online stores", kind: "store", tags: ["Coffee", "Online store"], summary: "A specialty-coffee roaster with grind-size options, subscriptions and a customer portal to pause or swap beans.", lines: ["Roasted small,", "shipped fresh."], colors: ["#2b1608", "#5b3416", "#f5c58a"] },
  { id: "ledgerly", name: "Ledgerly", url: "ledgerly", category: "Platforms", kind: "portal", tags: ["Accounting", "SaaS platform"], summary: "Invoicing and bookkeeping software for small firms, with bank feeds, tax-ready reports and team roles.", lines: ["", ""], colors: ["#0c1f3f", "#17376b", "#4ade80"] },
  { id: "clinichub", name: "ClinicHub", url: "clinichub", category: "Platforms", kind: "portal", tags: ["Healthcare", "Web portal"], summary: "Appointment, records and billing in one portal for a group of clinics, with SMS reminders for patients.", lines: ["", ""], colors: ["#06303a", "#0e5a6b", "#67e8f9"] },
  { id: "hiretrack", name: "HireTrack", url: "hiretrack", category: "Platforms", kind: "portal", tags: ["Recruitment", "Web platform"], summary: "An applicant-tracking platform with pipeline boards, interview scheduling and shareable scorecards.", lines: ["", ""], colors: ["#2a0f4a", "#4a1f86", "#f0abfc"] },
  { id: "schoolsphere", name: "SchoolSphere", url: "schoolsphere", category: "Platforms", kind: "portal", tags: ["Education", "School management"], summary: "Attendance, fee collection and parent messaging for a school network, with a mobile app for families.", lines: ["", ""], colors: ["#3b1a05", "#7a3a0a", "#fbbf24"] },
  { id: "harbor", name: "Harbor Legal", url: "harborlegal", category: "Business websites", kind: "site", tags: ["Legal", "Business website"], summary: "A law firm's website with practice-area pages, attorney profiles and a secure consultation request form.", lines: ["Counsel you", "can rely on."], colors: ["#eef1f8", "#dbe3f5", "#1e3a8a"], light: true },
  { id: "atlas", name: "Atlas Security", url: "atlassecurity", category: "Business websites", kind: "site", tags: ["Security", "Business website"], summary: "A corporate site for a security company with service pages, a coverage map and a quote request flow.", lines: ["Protection that", "never blinks."], colors: ["#101418", "#1c242c", "#22d3ee"] },
  { id: "summit", name: "Summit Builders", url: "summitbuilders", category: "Business websites", kind: "site", tags: ["Construction", "Business website"], summary: "A builder's portfolio site with project galleries, process timelines and an estimate request form.", lines: ["We build what", "stands tall."], colors: ["#fff4e0", "#ffe2b0", "#ea580c"], light: true },
  { id: "greenfield", name: "Greenfield Academy", url: "greenfieldacademy", category: "Business websites", kind: "site", tags: ["School", "Business website"], summary: "A school website with admissions pages, event calendar, news and a virtual campus tour.", lines: ["Where curious", "minds grow."], colors: ["#e7f7e4", "#cdeec6", "#15803d"], light: true },
  { id: "fitpulse", name: "FitPulse", url: "fitpulse", category: "Mobile apps", kind: "app", tags: ["Fitness", "iOS & Android"], summary: "A workout and habit app with trainer plans, streaks, wearable sync and in-app subscriptions.", lines: ["Train smarter,", "stay on track."], colors: ["#1b0b3a", "#3b1580", "#fb7185"] },
  { id: "ridenow", name: "RideNow", url: "ridenow", category: "Mobile apps", kind: "app", tags: ["Mobility", "iOS & Android"], summary: "A ride-booking app with live driver tracking, fare estimates and wallet payments for city commuters.", lines: ["Your ride,", "right on time."], colors: ["#06222e", "#0c4a63", "#38bdf8"] },
  { id: "pocketwise", name: "Pocketwise", url: "pocketwise", category: "Mobile apps", kind: "app", tags: ["Finance", "iOS & Android"], summary: "A personal-finance app that tracks spending, sets budgets and nudges users toward their savings goals.", lines: ["Know where", "your money goes."], colors: ["#10251a", "#1d4a30", "#a3e635"] },
  { id: "tablechat", name: "TableChat", url: "tablechat", category: "Mobile apps", kind: "app", tags: ["Hospitality", "Web app & WhatsApp"], summary: "Table ordering through WhatsApp for cafés, with a kitchen display and GST-ready billing.", lines: ["Scan, order,", "enjoy."], colors: ["#3a1408", "#7c2d12", "#fdba74"] },
  { id: "pixelpirates", name: "Pixel Pirates", url: "pixelpirates", category: "Games & AR/VR", kind: "game", tags: ["Gaming", "Mobile game"], summary: "A pixel-art treasure-hunt game with co-op raids, daily quests and seasonal events.", lines: ["Pixel Pirates", ""], colors: ["#0a2a4a", "#0e7490", "#fcd34d"] },
  { id: "neonracer", name: "Neon Racer", url: "neonracer", category: "Games & AR/VR", kind: "game", tags: ["Gaming", "PC & console"], summary: "An arcade racing game with ghost laps, weekly leaderboards and a track editor.", lines: ["Neon Racer", ""], colors: ["#1a0536", "#7e22ce", "#22d3ee"] },
  { id: "orbitvr", name: "Orbit VR Classroom", url: "orbitvr", category: "Games & AR/VR", kind: "game", tags: ["VR", "Education"], summary: "An immersive VR classroom where students explore the solar system together with a live teacher.", lines: ["Orbit VR", ""], colors: ["#020617", "#1e1b4b", "#a78bfa"] },
];
