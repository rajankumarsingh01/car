import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import Logo from "./Logo";

export default function Loader() {
  const { progress, active } = useProgress();
  const [gone, setGone] = useState(false);
  const done = !active && progress >= 100;

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setGone(true), 900);
    return () => clearTimeout(t);
  }, [done]);

  // agar kuch atak jaye to 20 second baad loader apne aap hat jaye
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 20000);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className={`loader${done ? " done" : ""}`}>
      <div className="loader-brand">
        <Logo size={46} />
      </div>
      <div className="loader-bar">
        <i style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
      <div className="loader-pct">{Math.round(progress)}%</div>
    </div>
  );
}