import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { SITE, STORY, REEL } from "../config/site";
import { pg } from "../config/stages";
import { updateSound } from "../utils/sound";

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const FADE = pg(0.4); // fade ki chaudai (0.4 screen scroll)

// Scroll ke hisaab se overlay ko seedha DOM mein badalta hai (React state nahi)
export default function OverlaySync() {
  const scroll = useScroll();
  const els = useRef(null);
  const lastO = useRef(0);
  const reel = useRef({ on: false, wait: 0 });

  useEffect(() => {
    const beats = STORY.map((_, i) => document.getElementById(`beat-${i}`));
    els.current = {
      beats,
      nums: STORY.map((b, i) =>
        b.type === "stats" && beats[i] ? [...beats[i].querySelectorAll(".num")] : null
      ),
      // jin beats ko --p (progress) chahiye: chart, timeline, cards
      wantsP: STORY.map((b) => ["powertrain", "timeline", "cards"].includes(b.type)),
      lastP: STORY.map(() => -1),
      navBtns: [...document.querySelectorAll("[data-nav]")],
      bar: document.getElementById("progress-fill"),
      nav: document.getElementById("site-nav"),
      hint: document.getElementById("scroll-hint"),
    };
  }, []);

  useEffect(() => {
    const box = scroll.el;

    const stopReel = () => {
      reel.current.on = false;
      document.body.classList.remove("reel");
    };

    // Navbar / button click: smooth scroll (data-go) ya reel mode on/off (data-reel)
    const onClick = (ev) => {
      if (ev.target.closest?.("[data-reel]")) {
        if (reel.current.on) {
          stopReel();
        } else {
          document.body.classList.add("reel");
          box.scrollTo({ top: 0, behavior: "instant" });
          reel.current = { on: true, wait: REEL.startDelay };
        }
        return;
      }
      const t = ev.target.closest?.("[data-go]");
      if (!t) return;
      ev.preventDefault();
      const max = box.scrollHeight - box.clientHeight;
      box.scrollTo({ top: parseFloat(t.dataset.go) * max, behavior: "smooth" });
    };

    // Overlay ke panel/cards ke upar mouse wheel bhi page scroll kare
    const onWheel = (ev) => {
      if (box.contains(ev.target)) return;
      box.scrollBy({ top: ev.deltaY });
    };

    // Esc dabane par reel mode band
    const onKey = (ev) => {
      if (ev.key === "Escape") stopReel();
    };

    document.addEventListener("click", onClick);
    document.addEventListener("wheel", onWheel, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("reel");
    };
  }, [scroll]);

  useFrame((_, dt) => {
    const e = els.current;
    if (!e) return;
    const o = scroll.offset;

    // reel mode: ek hi speed se neeche scroll (shuru mein startDelay second ruka rehta hai)
    const r = reel.current;
    if (r.on) {
      if (r.wait > 0) {
        reel.current = { on: true, wait: r.wait - dt };
      } else {
        const box = scroll.el;
        const max = box.scrollHeight - box.clientHeight;
        box.scrollTo({ top: Math.min(max, box.scrollTop + (max / REEL.seconds) * dt), behavior: "instant" });
      }
    }

    // sound: scroll jitna tez, hum utna tez
    updateSound(clamp01(Math.abs(o - lastO.current) / 0.002));
    lastO.current = o;

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

      // beat ke andar progress (0 se 1), CSS animation isi se chalti hai
      if (e.wantsP[i] && v > 0.01) {
        const p = +clamp01((o - a) / (z - a)).toFixed(3);
        if (p !== e.lastP[i]) {
          e.lastP[i] = p;
          el.style.setProperty("--p", p);
        }
      }

      // stats ke numbers scroll ke saath 0 se upar chadhte hain
      const nums = e.nums[i];
      if (nums && v > 0.01) {
        const p = easeOut(clamp01((o - a - pg(0.1)) / pg(0.9)));
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
    if (e.hint) e.hint.style.opacity = String(1 - clamp01(o / pg(0.4)));
    if (e.nav) e.nav.classList.toggle("solid", o > pg(0.2));
  });

  return null;
}