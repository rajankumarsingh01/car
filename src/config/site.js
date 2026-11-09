import { CHAPTERS, tl } from "./stages";

export const SITE = {
  // Brand (fictional concept brand)
  brand: { name: "Orvane", sub: "Motors" },

  // Navbar: go = click karne par kahan scroll hoga, range = kab "active" dikhega
  nav: [
    { label: "Performance", go: 0.17, range: [CHAPTERS.stats[0] - 0.005, CHAPTERS.teardown[0]] },
    { label: "Engineering", go: tl(0.17), range: [CHAPTERS.teardown[0], CHAPTERS.teardown[1] + 0.01] },
    { label: "Contact", go: 1, range: [CHAPTERS.teardown[1] + 0.01, 1.01] },
  ],

  links: [
    { label: "Portfolio", href: "https://rajankumarsingh.me" },
    { label: "GitHub", href: "https://github.com/rajankumarsingh01" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rajankumarsingh01" },
  ],

  disclaimer:
    "Concept project by Rajan. Orvane Motors is a fictional brand, not affiliated with any automaker.",

  // CC-BY 4.0 ke liye ye credit dikhana zaroori hai
  credit: {
    text: "Car model “FREE 1975 Porsche 911 (930) Turbo” by Lionsharp Studios, CC BY 4.0",
    href: "https://sketchfab.com/3d-models/free-1975-porsche-911-930-turbo-8568d9d14a994b9cae59499f0dbed21e",
  },
};

// Har stage ka text. range = scroll offset (0 se 1) jab tak dikhega
// type: "hero" | "stats" | "text" (default) | "finale"
export const STORY = [
  {
    type: "hero",
    range: CHAPTERS.hero,
    eyebrow: "Orvane Motors · Concept Edition",
    title: "Precision, laid bare.",
    sub: "A turbocharged icon, rebuilt in the open. Scroll to open it up.",
    actions: [
      { label: "Explore", go: tl(0.17) },
      { label: "Performance", go: 0.17 },
    ],
  },
  {
    type: "stats",
    range: CHAPTERS.stats,
    eyebrow: "Performance",
    title: "Built to be felt.",
    items: [
      { value: 260, decimals: 0, unit: "hp", label: "Output" },
      { value: 5.5, decimals: 1, unit: "s", label: "0–100 km/h" },
      { value: 250, decimals: 0, unit: "km/h", label: "Top speed" },
      { value: 1195, decimals: 0, unit: "kg", label: "Curb weight" },
    ],
    note: "Concept figures.",
  },
  {
    range: [tl(0.07), tl(0.26)],
    eyebrow: "01 · Blueprint",
    title: "Paint off.",
    sub: "The body turns into a blueprint. Everything underneath shows through.",
  },
  {
    range: [tl(0.26), tl(0.47)],
    eyebrow: "02 · Teardown",
    title: "Every part, apart.",
    sub: "Wheels, brakes, springs, bumpers and lights, each moving along its own axis.",
  },
  {
    range: [tl(0.49), tl(0.74)],
    eyebrow: "03 · The engine",
    title: "The heart.",
    sub: "Air-cooled flat-six with a turbo. Six pistons, one crankshaft, all firing in turn.",
  },
  {
    range: [tl(0.76), tl(0.97)],
    eyebrow: "04 · Reassembly",
    title: "Back together.",
    sub: "Engine, gearbox and suspension rejoin the body. Every part back where it belongs.",
  },
  {
    type: "finale",
    range: CHAPTERS.finale,
    eyebrow: "Orvane Motors · Concept Edition",
    title: "Built by Rajan.",
    sub: "A 3D scroll experience, frontend only.",
  },
];