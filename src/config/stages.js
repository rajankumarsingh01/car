// ============================================================
// SCROLL MAP (poori site ka timing yahin hai)
// offset = scroll ka hissa, 0 (sabse upar) se 1 (sabse neeche)
// ============================================================

// Poore page ki lambai (viewport ke multiple mein). Naya chapter jodo to isse badhao.
export const TOTAL_PAGES = 9;

// Site ke chapters (scroll offset ke ranges)
export const CHAPTERS = {
  hero: [0, 0.1],
  stats: [0.115, 0.21],
  teardown: [0.22, 0.9],
  finale: [0.92, 1],
};

// Teardown ke andar ka local time (0 se 1) ko poore page ke offset mein badalta hai
const [T0, T1] = CHAPTERS.teardown;
export const tl = (x) => +(T0 + x * (T1 - T0)).toFixed(4);
const tr = ([a, b]) => [tl(a), tl(b)];

// Camera: scroll offset ke hisaab se jagah.
// angle: ghoomna (radians), radius: doori, height: unchai
// tx/targetY/tz: camera kis point ko dekhega (default tx=0, tz=0)
export const CAMERA_KEYS = [
  // hero + stats: car dheere ghoomti hai
  { at: 0.0, angle: 0.9, radius: 4.3, height: 1.2, targetY: 0.5 },
  { at: 0.11, angle: 1.2, radius: 4.5, height: 1.15, targetY: 0.55 },
  // teardown
  { at: tl(0), angle: 1.5, radius: 4.3, height: 1.1, targetY: 0.55 },
  { at: tl(0.2), angle: 1.7, radius: 4.4, height: 1.1, targetY: 0.6 },
  { at: tl(0.42), angle: 2.6, radius: 9.0, height: 3.2, targetY: 0.9 },
  // engine focus (peeche se, engine rear mein hai, isliye tz negative)
  { at: tl(0.55), angle: 5.1, radius: 4.0, height: 2.3, targetY: 0.5, tz: -1.5 },
  { at: tl(0.68), angle: 5.5, radius: 4.0, height: 2.2, targetY: 0.5, tz: -1.5 },
  { at: tl(0.82), angle: 6.2, radius: 8.0, height: 2.8, targetY: 0.8 },
  { at: tl(1), angle: 7.2, radius: 5.6, height: 1.4, targetY: 0.6 },
  // finale: car poori judi hui, camera thoda aur ghoomta hai
  { at: 1.0, angle: 7.5, radius: 5.8, height: 1.5, targetY: 0.6 },
];

// Teardown mein kab kya hoga (pehle jaisa hi, bas naye offset par)
export const PHASES = {
  fadeIn: tr([0.08, 0.22]), // body transparent hoti hai
  explodeOut: tr([0.24, 0.46]), // parts bahar phailte hain
  focusIn: tr([0.48, 0.56]), // engine pe focus shuru
  focusOut: tr([0.68, 0.76]), // engine focus khatam
  explodeBack: tr([0.78, 0.94]), // parts wapas judte hain
  fadeOut: tr([0.88, 0.98]), // body wapas solid
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