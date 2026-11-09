import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { SITE, STORY } from "../config/site";

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const FADE = 0.02; // fade ki chaudai (scroll offset mein)

// Scroll ke hisaab se overlay ko seedha DOM mein badalta hai (React state nahi)
export default function OverlaySync() {
  const scroll = useScroll();
  const els = useRef(null);

  useEffect(() => {
    const beats = STORY.map((_, i) => document.getElementById(`beat-${i}`));
    els.current = {
      beats,
      nums: STORY.map((b, i) =>
        b.type === "stats" && beats[i] ? [...beats[i].querySelectorAll(".num")] : null
      ),
      navBtns: [...document.querySelectorAll("[data-nav]")],
      bar: document.getElementById("progress-fill"),
      nav: document.getElementById("site-nav"),
      hint: document.getElementById("scroll-hint"),
    };
  }, []);

  // Navbar / button click par us jagah tak smooth scroll (data-go = scroll offset 0 se 1)
  useEffect(() => {
    const box = scroll.el;
    const onClick = (ev) => {
      const t = ev.target.closest?.("[data-go]");
      if (!t) return;
      ev.preventDefault();
      const max = box.scrollHeight - box.clientHeight;
      box.scrollTo({ top: parseFloat(t.dataset.go) * max, behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scroll]);

  useFrame(() => {
    const e = els.current;
    if (!e) return;
    const o = scroll.offset;

    STORY.forEach((b, i) => {
      const el = e.beats[i];
      if (!el) return;
      const [a, z] = b.range;
      const fadeIn = a <= 0 ? 1 : clamp01((o - a) / FADE);
      const fadeOut = z >= 1 ? 1 : 1 - clamp01((o - (z - FADE)) / FADE);
      const v = fadeIn * fadeOut;
      el.style.opacity = v.toFixed(3);
      el.style.transform = `translateY(${((1 - v) * 18).toFixed(1)}px)`;
      el.style.visibility = v > 0.01 ? "visible" : "hidden";

      // stats ke numbers scroll ke saath 0 se upar chadhte hain
      const nums = e.nums[i];
      if (nums && v > 0.01) {
        const p = easeOut(clamp01((o - a - 0.005) / 0.03));
        nums.forEach((n) => {
          const d = Number(n.dataset.d);
          const txt = (Number(n.dataset.v) * p).toLocaleString("en-US", {
            minimumFractionDigits: d,
            maximumFractionDigits: d,
          });
          if (n.textContent !== txt) n.textContent = txt;
        });
      }
    });

    e.navBtns.forEach((btn, i) => {
      const [a, z] = SITE.nav[i].range;
      btn.classList.toggle("active", o >= a && o < z);
    });

    if (e.bar) e.bar.style.transform = `scaleY(${o.toFixed(4)})`;
    if (e.hint) e.hint.style.opacity = String(1 - clamp01(o / 0.02));
    if (e.nav) e.nav.classList.toggle("solid", o > 0.01);
  });

  return null;
}