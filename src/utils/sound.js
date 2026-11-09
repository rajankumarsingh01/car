// Free, bina koi audio file ke: browser mein hi ek halka engine-jaisa hum banata hai.
// Browser rule: awaaz sirf user ke click ke baad chalu ho sakti hai, isliye toggle button se start hota hai.
let ctx = null;
let master = null;
let osc1 = null;
let osc2 = null;
let filter = null;
let on = false;

function build() {
  const AC = window.AudioContext || window.webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 300;
  osc1 = ctx.createOscillator();
  osc1.type = "sawtooth";
  osc1.frequency.value = 46;
  osc2 = ctx.createOscillator();
  osc2.type = "square";
  osc2.frequency.value = 92;
  const g2 = ctx.createGain();
  g2.gain.value = 0.3;
  osc1.connect(filter);
  osc2.connect(g2).connect(filter);
  filter.connect(master).connect(ctx.destination);
  osc1.start();
  osc2.start();
}

// true = sound on, false = off
export async function toggleSound() {
  if (!ctx) build();
  if (ctx.state === "suspended") await ctx.resume();
  on = !on;
  master.gain.setTargetAtTime(on ? 0.07 : 0, ctx.currentTime, 0.25);
  return on;
}

// speed: 0 (ruka hua) se 1 (tez scroll). Pitch aur brightness scroll ke saath badhte hain.
export function updateSound(speed) {
  if (!ctx || !on) return;
  const t = ctx.currentTime;
  osc1.frequency.setTargetAtTime(46 + speed * 80, t, 0.12);
  osc2.frequency.setTargetAtTime(92 + speed * 160, t, 0.12);
  filter.frequency.setTargetAtTime(300 + speed * 1500, t, 0.12);
}