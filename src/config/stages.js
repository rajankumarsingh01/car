// ============================================================
// SCROLL MAP (poori site ka timing yahin hai)
// offset = scroll ka hissa, 0 (sabse upar) se 1 (sabse neeche)
// ============================================================

// Poore page ki lambai (viewport ke multiple mein). Naya chapter jodo to isse badhao.
export const TOTAL_PAGES = 30;

// pg(v): "v viewport scroll hua" ko offset (0 se 1) mein badalta hai.
// Isse timing sochna aasan hai: pg(5.5) = 5.5 screen neeche.
const U = TOTAL_PAGES - 1;
export const pg = (v) => +(v / U).toFixed(4);

// Site ke chapters (scroll offset ke ranges)
export const CHAPTERS = {
  hero: [pg(0), pg(0.9)],
  stats: [pg(1.1), pg(2.0)],
  design: [pg(2.3), pg(5.2)],
  teardown: [pg(5.5), pg(11.5)],
  powertrain: [pg(11.8), pg(13.6)],
  interior: [pg(13.9), pg(15.6)],
  heritage: [pg(15.9), pg(18.0)],
  lineup: [pg(18.2), pg(19.4)],
  config: [pg(19.7), pg(22.2)],
  gallery: [pg(22.5), pg(26.9)],
  cta: [pg(27.1), pg(28.1)],
  finale: [pg(28.3), 1],
};

// Teardown ke andar ka local time (0 se 1) ko poore page ke offset mein badalta hai
const [T0, T1] = CHAPTERS.teardown;
export const tl = (x) => +(T0 + x * (T1 - T0)).toFixed(4);
const tr = ([a, b]) => [tl(a), tl(b)];

// Camera: scroll offset ke hisaab se jagah.
// angle: ghoomna (radians), radius: doori, height: unchai
// tx/targetY/tz: camera kis point ko dekhega (default tx=0, tz=0)
// Car ka aage ka hissa +z hai (angle ~1.57), peeche -z (angle ~4.71), side +x (angle 0).
// Close-up shots mein camera isi (tx, tz) point ke aas-paas ghoomta hai.
export const CAMERA_KEYS = [
  // hero + stats: car dheere ghoomti hai
  { at: 0.0, angle: 0.9, radius: 4.3, height: 1.2, targetY: 0.5 },
  { at: pg(1.5), angle: 1.2, radius: 4.5, height: 1.15, targetY: 0.55 },

  // DESIGN: headlight -> wheel -> profile
  { at: pg(2.6), angle: 1.15, radius: 1.6, height: 0.75, targetY: 0.68, tx: 0.55, tz: 1.9 },
  { at: pg(3.0), angle: 1.0, radius: 1.5, height: 0.72, targetY: 0.68, tx: 0.55, tz: 1.9 },
  { at: pg(3.7), angle: 0.35, radius: 2.0, height: 0.45, targetY: 0.3, tx: 0.85, tz: 1.1 },
  { at: pg(4.0), angle: 0.2, radius: 1.9, height: 0.42, targetY: 0.3, tx: 0.85, tz: 1.1 },
  { at: pg(4.7), angle: 0.0, radius: 5.8, height: 0.9, targetY: 0.55 },
  { at: pg(5.1), angle: 0.0, radius: 5.8, height: 0.9, targetY: 0.55 },

  // ENGINEERING (teardown)
  { at: tl(0), angle: 1.5, radius: 4.3, height: 1.1, targetY: 0.55 },
  { at: tl(0.2), angle: 1.7, radius: 4.4, height: 1.1, targetY: 0.6 },
  { at: tl(0.42), angle: 2.6, radius: 9.0, height: 3.2, targetY: 0.9 },
  // engine focus (peeche se, engine rear mein hai, isliye tz negative)
  { at: tl(0.55), angle: 5.1, radius: 4.0, height: 2.3, targetY: 0.5, tz: -1.5 },
  { at: tl(0.68), angle: 5.5, radius: 4.0, height: 2.2, targetY: 0.5, tz: -1.5 },
  { at: tl(0.82), angle: 6.2, radius: 8.0, height: 2.8, targetY: 0.8 },
  { at: tl(1), angle: 7.2, radius: 5.6, height: 1.4, targetY: 0.6 },

  // POWERTRAIN: peeche se, engine bay ki taraf
  { at: pg(12.4), angle: 10.5, radius: 4.8, height: 1.9, targetY: 0.5, tz: -1.0 },
  { at: pg(13.2), angle: 10.9, radius: 4.6, height: 1.8, targetY: 0.5, tz: -1.0 },

  // INTERIOR: windshield ke upar se cabin ke andar
  { at: pg(14.4), angle: 7.9, radius: 2.3, height: 1.7, targetY: 0.55, tz: 0.2 },
  { at: pg(15.2), angle: 7.3, radius: 2.4, height: 1.8, targetY: 0.55, tz: 0.2 },

  // HERITAGE + LINEUP: car poori, thodi door se
  { at: pg(16.6), angle: 6.45, radius: 6.6, height: 1.1, targetY: 0.6 },
  { at: pg(17.6), angle: 6.2, radius: 6.6, height: 1.1, targetY: 0.6 },
  { at: pg(18.6), angle: 5.8, radius: 7.8, height: 1.6, targetY: 0.6 },
  { at: pg(19.2), angle: 5.6, radius: 7.8, height: 1.6, targetY: 0.6 },

  // CONFIGURATOR: car screen ke left mein, panel right mein (tx/tz se target right ki taraf khiska hai)
  { at: pg(20.2), angle: 5.9, radius: 5.4, height: 1.3, targetY: 0.6, tx: -0.37, tz: -0.93 },
  { at: pg(22.0), angle: 6.15, radius: 5.4, height: 1.3, targetY: 0.6, tx: -0.17, tz: -0.98 },

  // GALLERY: 4 frames (har frame ke do keys = thodi der rukta hai)
  { at: pg(22.9), angle: 7.28, radius: 4.6, height: 0.7, targetY: 0.5 }, // 1 front, low
  { at: pg(23.4), angle: 7.4, radius: 4.5, height: 0.7, targetY: 0.5 },
  { at: pg(24.0), angle: 4.2, radius: 4.8, height: 1.0, targetY: 0.55 }, // 2 rear three-quarter
  { at: pg(24.5), angle: 4.3, radius: 4.7, height: 1.0, targetY: 0.55 },
  { at: pg(25.1), angle: 5.2, radius: 3.2, height: 5.0, targetY: 0.3 }, // 3 top-down
  { at: pg(25.6), angle: 5.4, radius: 3.2, height: 5.0, targetY: 0.3 },
  { at: pg(26.2), angle: 4.75, radius: 2.4, height: 0.9, targetY: 0.6, tz: -1.7 }, // 4 rear detail
  { at: pg(26.7), angle: 4.9, radius: 2.4, height: 0.9, targetY: 0.6, tz: -1.7 },

  // CTA + finale: car poori, thodi door se
  { at: pg(27.6), angle: 5.6, radius: 6.0, height: 1.4, targetY: 0.6 },
  { at: 1.0, angle: 5.5, radius: 6.0, height: 1.5, targetY: 0.6 },
];

// Kab kya hoga. Teardown wale pehle jaise hi (tr = teardown ke andar ka local time)
export const PHASES = {
  fadeIn: tr([0.08, 0.22]), // body transparent hoti hai
  explodeOut: tr([0.24, 0.46]), // parts bahar phailte hain
  focusIn: tr([0.48, 0.56]), // engine pe focus shuru
  focusOut: tr([0.68, 0.76]), // engine focus khatam
  explodeBack: tr([0.78, 0.94]), // parts wapas judte hain
  fadeOut: tr([0.88, 0.98]), // body wapas solid
  // Interior chapter: sirf glass saaf hota hai, taaki cabin dikhe
  interiorIn: [pg(13.3), pg(14.2)],
  interiorOut: [pg(15.4), pg(16.2)],
};

// Material ka naam -> transparent hone ke baad opacity
export const FADE_MATERIALS = { paint: 0.08, coat: 0, glass: 0.1 };

// Parts kitni door jayenge (car ki lambai ka hissa)
export const EXPLODE = {
  body: 0.55,
  glass: 0.8,
  wheel: 0.32,
  bigInner: 0.2,
  part: 0.3,
};

// Kisi ek mesh ko alag direction/doori dene ke liye, jaise:
// Object_103: { dir: [0, 1, 0], dist: 0.35 },
export const OVERRIDES = {};