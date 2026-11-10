import { CHAPTERS, tl, pg } from "./stages";

// Navbar button click par chapter ke start se thoda andar tak scroll hota hai,
// taaki text poora dikhe
const go = (c) => +(c[0] + pg(0.45)).toFixed(4);

export const SITE = {
  // Brand (fictional concept brand)
  brand: { name: "Orvane", sub: "Motors" },

  // Navbar: go = click karne par kahan scroll hoga, range = kab "active" dikhega
  nav: [
    { label: "Design", go: go(CHAPTERS.design), range: [CHAPTERS.design[0], CHAPTERS.teardown[0]] },
    { label: "Engineering", go: go(CHAPTERS.teardown), range: [CHAPTERS.teardown[0], CHAPTERS.powertrain[0]] },
    { label: "Powertrain", go: go(CHAPTERS.powertrain), range: [CHAPTERS.powertrain[0], CHAPTERS.interior[0]] },
    { label: "Interior", go: go(CHAPTERS.interior), range: [CHAPTERS.interior[0], CHAPTERS.heritage[0]] },
    { label: "Heritage", go: go(CHAPTERS.heritage), range: [CHAPTERS.heritage[0], CHAPTERS.lineup[0]] },
    { label: "Lineup", go: go(CHAPTERS.lineup), range: [CHAPTERS.lineup[0], CHAPTERS.config[0]] },
    { label: "Configure", go: go(CHAPTERS.config), range: [CHAPTERS.config[0], CHAPTERS.gallery[0]] },
    { label: "Gallery", go: go(CHAPTERS.gallery), range: [CHAPTERS.gallery[0], 1.01] },
  ],

  // Navbar ka "Test drive" button isi chapter tak scroll karta hai
  testDriveGo: go(CHAPTERS.cta),

  // "Book a test drive" button mailto kholta hai (free, koi backend nahi).
  // YAHAN APNA EMAIL DAALO:
  contact: {
    email: "your-email@example.com",
    subject: "Test drive request: Orvane 75 Turbo",
    body: "Hi, I would like to book a test drive.\n\nName:\nCity:\nPreferred date:\n",
  },

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

// Powertrain chart ka data (concept figures). Do curves: power (hp) aur torque (Nm)
export const POWER_CURVE = {
  rpm: [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500],
  power: [30, 50, 75, 100, 135, 175, 205, 230, 248, 260, 255, 235],
  torque: [250, 275, 300, 320, 335, 342, 343, 336, 320, 300, 270, 240],
};

// Configurator ke swatches. color: null = car ka original (stock)
export const CONFIG = {
  paints: [
    { name: "Stock", color: null },
    { name: "Champagne", color: "#c9b78a" },
    { name: "Midnight", color: "#0d1b3a" },
    { name: "Racing Green", color: "#0f3d2b" },
    { name: "Signal Red", color: "#a3121b" },
    { name: "Arctic White", color: "#e6e6e2" },
    { name: "Graphite", color: "#2a2c30" },
  ],
  rims: [
    { name: "Stock", color: null },
    { name: "Gunmetal", color: "#2b2e33" },
    { name: "Champagne Gold", color: "#c9a96e" },
    { name: "Gloss Black", color: "#0b0b0c" },
  ],
};

// Reel mode: seconds = poora page kitne second mein scroll hoga, startDelay = shuru hone se pehle ruk
export const REEL = {
  startDelay: 2,
  default: "teardown",
  // from/to = page (screen) number jahan se jahan tak scroll hoga, seconds = clip ki lambai
  // Use: http://localhost:5173/?clip=teardown (ya design, engine, full)
  clips: {
    teardown: { from: 5.5, to: 11.5, seconds: 28 },
    design: { from: 2.2, to: 5.3, seconds: 18 },
    engine: { from: 8.0, to: 10.4, seconds: 12 },
    full: { from: 0, to: 29, seconds: 75 },
  },
};

// Har stage ka text. range = scroll offset (0 se 1) jab tak dikhega
// type: "hero" | "stats" | "powertrain" | "timeline" | "cards" | "config" | "cta" | "text" (default) | "finale"
// text beat mein optional: align: "right", points: ["...", "..."]
export const STORY = [
  {
    type: "hero",
    range: CHAPTERS.hero,
    eyebrow: "Orvane Motors · Concept Edition",
    title: "Precision, laid bare.",
    sub: "A turbocharged icon, rebuilt in the open. Scroll to open it up.",
    actions: [
      { label: "Explore", go: go(CHAPTERS.design) },
      { label: "Performance", go: go(CHAPTERS.stats) },
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

  // ---------- DESIGN ----------
  {
    range: [pg(2.3), pg(3.3)],
    eyebrow: "Design · 01 Light",
    title: "A face you know.",
    sub: "Round lamps, set deep in the wing. Nothing added, nothing hidden.",
  },
  {
    range: [pg(3.3), pg(4.3)],
    align: "right",
    eyebrow: "Design · 02 Stance",
    title: "Planted.",
    sub: "Wide haunches over forged wheels. The car looks fast before it moves.",
  },
  {
    range: [pg(4.3), pg(5.2)],
    eyebrow: "Design · 03 Profile",
    title: "One line, nose to tail.",
    sub: "A single sweeping roofline. The shape stayed because it was right.",
  },

  // ---------- ENGINEERING (teardown) ----------
  {
    range: [tl(0.07), tl(0.26)],
    eyebrow: "Engineering · 01 Blueprint",
    title: "Paint off.",
    sub: "The body turns into a blueprint. Everything underneath shows through.",
  },
  {
    range: [tl(0.26), tl(0.47)],
    eyebrow: "Engineering · 02 Teardown",
    title: "Every part, apart.",
    sub: "Wheels, brakes, springs, bumpers and lights, each moving along its own axis.",
  },
  {
    range: [tl(0.49), tl(0.74)],
    eyebrow: "Engineering · 03 The engine",
    title: "The heart.",
    sub: "Air-cooled flat-six with a turbo. Six pistons, one crankshaft, all firing in turn.",
  },
  {
    range: [tl(0.76), tl(0.97)],
    eyebrow: "Engineering · 04 Reassembly",
    title: "Back together.",
    sub: "Engine, gearbox and suspension rejoin the body. Every part back where it belongs.",
  },

  // ---------- POWERTRAIN ----------
  {
    type: "powertrain",
    range: CHAPTERS.powertrain,
    eyebrow: "Powertrain",
    title: "Power, where you need it.",
    sub: "Torque arrives early and stays. Power peaks high, just before the limiter.",
    specs: [
      ["Engine", "3.0 L flat-six, turbo"],
      ["Power", "260 hp @ 5,500 rpm"],
      ["Torque", "343 Nm @ 4,000 rpm"],
      ["Gearbox", "4-speed manual"],
      ["Drive", "Rear-wheel"],
      ["0–100 km/h", "5.5 s"],
      ["Top speed", "250 km/h"],
    ],
    note: "Concept figures.",
  },

  // ---------- INTERIOR ----------
  {
    range: CHAPTERS.interior,
    eyebrow: "Interior · Craftsmanship",
    title: "Made by hand.",
    sub: "Look through the glass. The cabin is built around the driver, and nothing else.",
    points: ["Hand-stitched leather", "Machined metal switchgear", "Analogue dials, no screens"],
  },

  // ---------- HERITAGE ----------
  {
    type: "timeline",
    range: CHAPTERS.heritage,
    eyebrow: "Heritage",
    title: "Since 1975.",
    items: [
      { year: "1975", text: "The first turbocharged Orvane leaves the line." },
      { year: "1984", text: "Intercooler and a wider stance arrive." },
      { year: "1993", text: "The final air-cooled run. A collector's car from day one." },
      { year: "2005", text: "Carbon panels debut on the track edition." },
      { year: "2018", text: "Heritage programme: every car restored in-house." },
      { year: "2026", text: "Concept Edition. The icon, taken apart in 3D." },
    ],
    note: "Fictional timeline for a concept brand.",
  },

  // ---------- LINEUP ----------
  {
    type: "cards",
    range: CHAPTERS.lineup,
    eyebrow: "Lineup",
    title: "Choose your Orvane.",
    cards: [
      {
        name: "75 Classic",
        tag: "The pure one.",
        specs: [["Power", "200 hp"], ["0–100", "6.8 s"], ["Top speed", "230 km/h"]],
      },
      {
        name: "75 Turbo",
        tag: "The icon.",
        featured: true,
        specs: [["Power", "260 hp"], ["0–100", "5.5 s"], ["Top speed", "250 km/h"]],
      },
      {
        name: "75 Turbo S",
        tag: "The sharpest.",
        specs: [["Power", "330 hp"], ["0–100", "4.4 s"], ["Top speed", "280 km/h"]],
      },
    ],
    note: "Concept figures. Not for sale.",
  },

  // ---------- CONFIGURATOR ----------
  {
    type: "config",
    range: CHAPTERS.config,
    eyebrow: "Configure",
    title: "Make it yours.",
    sub: "Pick a paint and a wheel finish. The car changes live.",
  },

  // ---------- GALLERY ----------
  {
    range: [pg(22.5), pg(23.6)],
    eyebrow: "Gallery · 01 / 04",
    title: "Low and wide.",
    sub: "Nose down, haunches out. The stance never changed.",
  },
  {
    range: [pg(23.6), pg(24.7)],
    align: "right",
    eyebrow: "Gallery · 02 / 04",
    title: "Quiet from behind.",
    sub: "A clean tail, a single lamp bar, and an engine you cannot see.",
  },
  {
    range: [pg(24.7), pg(25.8)],
    eyebrow: "Gallery · 03 / 04",
    title: "From above.",
    sub: "One roof, four wheels, no extra lines.",
  },
  {
    range: [pg(25.8), pg(26.9)],
    align: "right",
    eyebrow: "Gallery · 04 / 04",
    title: "Where it breathes.",
    sub: "The engine sits behind the axle, under the rear grille.",
  },

  // ---------- TEST DRIVE ----------
  {
    type: "cta",
    range: CHAPTERS.cta,
    eyebrow: "Test drive",
    title: "Feel it for yourself.",
    sub: "Tell us where and when. We will take it from there.",
    button: "Book a test drive",
    note: "Concept project: this opens your email app.",
  },

  {
    type: "finale",
    range: CHAPTERS.finale,
    eyebrow: "Orvane Motors · Concept Edition",
    title: "Built by Rajan.",
    sub: "A 3D scroll experience, frontend only.",
  },
];