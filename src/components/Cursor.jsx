import { useEffect, useRef } from "react";

// Custom cursor: chhota dot + peeche chalti ring. Touch screen par nahi dikhta.
// Button / link / card / swatch par ring bada ho jata hai.
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.body.classList.add("has-cursor");

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      const hot = !!e.target.closest?.("button, a, [data-go], .card, .swatch");
      ring.current?.classList.toggle("hot", hot);
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor ring" />
      <div ref={dot} className="cursor dot" />
    </>
  );
}