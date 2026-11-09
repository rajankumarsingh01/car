import { POWER_CURVE } from "../config/site";

const W = 320;
const H = 150;
const PAD = { l: 8, r: 8, t: 14, b: 22 };
const RPM_MIN = 1000;
const RPM_MAX = 6500;

const px = (rpm) => PAD.l + ((rpm - RPM_MIN) / (RPM_MAX - RPM_MIN)) * (W - PAD.l - PAD.r);
// Har curve apni peak ke hisaab se scale hoti hai (dono ek hi chart mein dikhein)
const py = (v, max) => H - PAD.b - (v / max) * (H - PAD.b - PAD.t);

// Points se smooth curve (Catmull-Rom se bezier)
function smooth(p) {
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function Curve({ values, unit, cls }) {
  const max = Math.max(...values);
  const pts = POWER_CURVE.rpm.map((r, i) => [px(r), py(values[i], max * 1.08)]);
  const peak = values.indexOf(max);
  return (
    <g className={cls}>
      {/* pathLength=1 se CSS ke --p variable se line "draw" hoti hai (OverlaySync set karta hai) */}
      <path d={smooth(pts)} pathLength="1" className="curve" />
      <g className="peak">
        <circle cx={pts[peak][0]} cy={pts[peak][1]} r="3.5" />
        <text x={pts[peak][0]} y={pts[peak][1] - 8} textAnchor="middle">
          {max} {unit}
        </text>
      </g>
    </g>
  );
}

export default function PowerChart() {
  const ticks = [2000, 3000, 4000, 5000, 6000];
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Power and torque curve">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={px(t)} x2={px(t)} y1={PAD.t} y2={H - PAD.b} className="grid" />
          <text x={px(t)} y={H - 6} textAnchor="middle" className="tick">
            {t / 1000}k
          </text>
        </g>
      ))}
      <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} className="axis" />
      <Curve values={POWER_CURVE.torque} unit="Nm" cls="torque" />
      <Curve values={POWER_CURVE.power} unit="hp" cls="power" />
    </svg>
  );
}