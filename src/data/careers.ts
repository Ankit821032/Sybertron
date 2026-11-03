/* SAMPLE CONTENT: replace with Sybertron's real roles. Set open: false to show a role as filled. */
export type Role = { id: string; title: string; team: string; type: string; location?: string; summary: string; open: boolean };

export const roles: Role[] = [
  { id: "sales", title: "Sales / Business Development Executive", team: "Sales", type: "Full-time", location: "Delhi (on-site)", summary: "Find and win new clients for our websites, apps and software, by phone and in person.", open: true },
  { id: "social", title: "Social Media Executive", team: "Marketing", type: "Full-time", summary: "Grow our presence across platforms with 3+ years of content and performance marketing experience.", open: true },
  { id: "ecom", title: "E-commerce Expert", team: "Commerce", type: "Full-time", summary: "Grow sales on Amazon, eBay and Shopify through listings, ads, inventory and service.", open: true },
  { id: "video", title: "Video Editor & Animator", team: "Creative", type: "Junior–Mid", summary: "Create AI-assisted and traditionally edited videos, plus basic graphic design.", open: true },
  { id: "qa-intern", title: "Quality Assurance (QA) Intern", team: "Quality", type: "Internship", summary: "Learn manual and automated testing with our product quality team.", open: true },
  { id: "anim-intern", title: "Animator / Graphic Designer Intern", team: "Creative", type: "Internship", summary: "Bring visual stories to life with animation and design.", open: true },
  { id: "mern", title: "Full Stack MERN Developer", team: "Engineering", type: "Full-time", summary: "Own projects end to end, from architecture to deployment, with minimal supervision.", open: false },
  { id: "ml", title: "AI/ML Engineer", team: "Engineering", type: "Full-time", summary: "Design, build and deploy machine learning solutions that work with large-scale data.", open: false },
  { id: "qa", title: "Quality Assurance (QA) Engineer", team: "Quality", type: "Full-time", summary: "Plan and run manual and automated testing across web and mobile products.", open: false },
  { id: "unity", title: "Game Development Intern (Unity)", team: "Engineering", type: "Internship · On-site", summary: "Build and test games in Unity and C# alongside experienced developers.", open: false },
  { id: "ux", title: "UI/UX Intern", team: "Design", type: "Internship", summary: "Help design user flows and interfaces with our product design team.", open: false },
];
