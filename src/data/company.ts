/* SAMPLE CONTENT: replace with Sybertron's real numbers and history. */
export const FOUNDED = 2004;

export const stats = [
  { label: "Projects delivered", value: 1000, suffix: "+" },
  { label: "In-house products", value: 28, suffix: "" },
  { label: "Countries where we're present", value: 4, suffix: "" },
];

export type Milestone = { year: number | "Now"; tag: string; title: string; text: string };

/* Years without an entry show as short bars on the timeline. */
export const milestones: Milestone[] = [
  { year: 2004, tag: "Founding", title: "Sybertron begins in Delhi", text: "A small team in Delhi, India starts building custom software for local businesses." },
  { year: 2010, tag: "Growth", title: "First enterprise clients", text: "Larger teams start trusting us with their core systems." },
  { year: 2012, tag: "Product", title: "First in-house product", text: "We turn repeat client needs into our first reusable product." },
  { year: 2014, tag: "Team", title: "Engineering team doubles", text: "New design and engineering hires let us run more projects in parallel." },
  { year: 2015, tag: "Expansion", title: "Presence in London", text: "We start working in London to serve clients across the United Kingdom." },
  { year: 2016, tag: "Product", title: "Cloud platform launch", text: "Our products move to a cloud-first, subscription model." },
  { year: 2018, tag: "Growth", title: "Mobile practice opens", text: "iOS and Android apps join our web and software work." },
  { year: 2019, tag: "Expansion", title: "Presence in Dubai", text: "We open in Dubai to serve clients across the UAE and the wider Gulf region." },
  { year: 2020, tag: "Milestone", title: "Fully remote delivery", text: "Every project runs on distributed teams without losing pace." },
  { year: 2022, tag: "Product", title: "AI automation arrives", text: "We add AI agents and automated workflows to our services." },
  { year: 2024, tag: "Growth", title: "Marketing joins the team", text: "Design, development and marketing now sit under one roof." },
  { year: "Now", tag: "Today", title: "Building what's next", text: "Software, AI and growth work for businesses that want to scale." },
];

/* SAMPLE CONTENT: replace with Sybertron's real locations (shown in the closing call to action). */
export const locations = ["India"];
