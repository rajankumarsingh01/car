import { useState } from "react";
import { CONFIG } from "../config/site";
import { setConfig } from "../utils/configStore";

function Group({ label, items, active, onPick }) {
  return (
    <div className="swatch-group">
      <div className="swatch-label">
        <span>{label}</span>
        <b>{items[active].name}</b>
      </div>
      <div className="swatches">
        {items.map((it, i) => (
          <button
            key={it.name}
            type="button"
            className={`swatch${it.color ? "" : " stock"}${i === active ? " on" : ""}`}
            style={{ "--c": it.color || "transparent" }}
            aria-label={`${label}: ${it.name}`}
            aria-pressed={i === active}
            title={it.name}
            onClick={() => onPick(i)}
          />
        ))}
      </div>
    </div>
  );
}

// Paint aur wheel ka rang chunne wala panel. Car.jsx config store se live rang badalta hai.
export default function ConfigPanel() {
  const [paint, setPaint] = useState(0);
  const [rim, setRim] = useState(0);

  return (
    <div className="power-panel config-panel">
      <Group
        label="Paint"
        items={CONFIG.paints}
        active={paint}
        onPick={(i) => {
          setPaint(i);
          setConfig({ paint: CONFIG.paints[i].color });
        }}
      />
      <Group
        label="Wheels"
        items={CONFIG.rims}
        active={rim}
        onPick={(i) => {
          setRim(i);
          setConfig({ rim: CONFIG.rims[i].color });
        }}
      />
      <p className="config-note">Changes show live on the car.</p>
    </div>
  );
}