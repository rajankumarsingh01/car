import { PHASES } from "../config/stages";

const clamp01 = (x) => Math.min(1, Math.max(0, x));

export const seg = (v, [a, b]) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// scroll offset (0 se 1) se: out = parts kitne bahar, fade = body kitni transparent,
// focus = engine pe focus kitna
export function getTimeline(o) {
  return {
    out: seg(o, PHASES.explodeOut) * (1 - seg(o, PHASES.explodeBack)),
    fade: seg(o, PHASES.fadeIn) * (1 - seg(o, PHASES.fadeOut)),
    focus: seg(o, PHASES.focusIn) * (1 - seg(o, PHASES.focusOut)),
  };
}