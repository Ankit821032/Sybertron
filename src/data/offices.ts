/* SAMPLE CONTENT: replace with Sybertron's real offices, hours and contact links. */
export type Office = {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  tz: string;            // IANA time zone, drives the live clock
  open: number;          // opening time, minutes from local midnight
  close: number;         // closing time, minutes from local midnight
  workDays: number[];    // 0 = Sunday ... 6 = Saturday
  label: "left" | "right"; // which side of the map pin the city name sits on
};

const MON_FRI = [1, 2, 3, 4, 5];
const SUN_THU = [0, 1, 2, 3, 4];

/* Order matters: the arcs on the map connect the offices in this order. */
export const offices: Office[] = [
  { id: "california", city: "California", country: "USA", lat: 36.78, lon: -119.42, tz: "America/Los_Angeles", open: 9 * 60, close: 18 * 60, workDays: MON_FRI, label: "left" },
  { id: "london", city: "London", country: "UK", lat: 51.51, lon: -0.13, tz: "Europe/London", open: 9 * 60, close: 18 * 60, workDays: MON_FRI, label: "right" },
  { id: "dubai", city: "Dubai", country: "UAE", lat: 25.2, lon: 55.27, tz: "Asia/Dubai", open: 9 * 60, close: 18 * 60, workDays: MON_FRI, label: "left" },
  { id: "delhi", city: "Delhi", country: "India", lat: 28.61, lon: 77.21, tz: "Asia/Kolkata", open: 9 * 60, close: 18 * 60, workDays: MON_FRI, label: "right" },
];

export const urgentHelp = {
  lead: "Something broken in your tech or marketing?",
  rest: "We can help today.",
  cta: { label: "RAPID RESPONSE", href: "/urgent" },
  whatsapp: { label: "Chat on WhatsApp", href: "https://wa.me/10000000000" }, // SAMPLE number
};
