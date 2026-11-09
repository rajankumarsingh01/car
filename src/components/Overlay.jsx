import "../overlay.css";
import "../chapters.css";
import "../phase3.css";
import { useState } from "react";
import Logo from "./Logo";
import PowerChart from "./PowerChart";
import ConfigPanel from "./ConfigPanel";
import Cursor from "./Cursor";
import { toggleSound } from "../utils/sound";
import { SITE, STORY } from "../config/site";

const { email, subject, body } = SITE.contact;
const MAILTO = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

// Navbar ke right side ke buttons: Sound, Reel mode, Test drive
function Tools() {
  const [soundOn, setSoundOn] = useState(false);
  return (
    <div className="nav-tools">
      <button
        type="button"
        className="tool"
        aria-pressed={soundOn}
        aria-label="Toggle sound"
        onClick={async () => setSoundOn(await toggleSound())}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9v6h4l5 4V5L8 9H4z" />
          {soundOn ? <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /> : <path d="M17 9l5 6M22 9l-5 6" />}
        </svg>
        <span>Sound {soundOn ? "on" : "off"}</span>
      </button>
      <button type="button" className="tool" data-reel aria-label="Reel mode">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="13" height="12" rx="2" />
          <path d="M16 10l5-3v10l-5-3" />
        </svg>
        <span>Reel</span>
      </button>
      <button type="button" className="tool nav-cta" data-go={SITE.testDriveGo}>
        Test drive
      </button>
    </div>
  );
}

// Ye component sirf ek baar render hota hai. Text ki chamak OverlaySync badalta hai.
// data-go wale button/link par click karne par OverlaySync us offset tak smooth scroll karta hai.
// OverlaySync har beat par --p (0 se 1, us beat ke andar scroll ka hissa) set karta hai.
// Chart, timeline aur cards ki animation CSS mein usi --p se chalti hai.
function Beat({ b, i }) {
  const id = `beat-${i}`;

  if (b.type === "hero") {
    return (
      <section id={id} className="beat hero">
        <p className="eyebrow">{b.eyebrow}</p>
        <h1>{b.title}</h1>
        <p className="sub">{b.sub}</p>
        <div className="cta">
          {b.actions.map((a, j) => (
            <button key={a.label} type="button" data-go={a.go} className={j === 0 ? "primary" : ""}>
              {a.label}
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (b.type === "stats") {
    return (
      <section id={id} className="beat stats">
        <p className="eyebrow">{b.eyebrow}</p>
        <h2>{b.title}</h2>
        <div className="stats-row">
          {b.items.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-val">
                <span className="num" data-v={s.value} data-d={s.decimals}>
                  0
                </span>
                <em>{s.unit}</em>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="stats-note">{b.note}</p>
      </section>
    );
  }

  if (b.type === "config") {
    return (
      <section id={id} className="beat power config">
        <div className="power-head">
          <p className="eyebrow">{b.eyebrow}</p>
          <h2>{b.title}</h2>
          <p className="sub">{b.sub}</p>
        </div>
        <ConfigPanel />
      </section>
    );
  }

  if (b.type === "cta") {
    return (
      <section id={id} className="beat end">
        <p className="eyebrow">{b.eyebrow}</p>
        <h2>{b.title}</h2>
        <p className="sub">{b.sub}</p>
        <div className="cta">
          <a className="primary" href={MAILTO}>
            {b.button}
          </a>
        </div>
        <p className="stats-note">{b.note}</p>
      </section>
    );
  }

  if (b.type === "powertrain") {
    return (
      <section id={id} className="beat power">
        <div className="power-head">
          <p className="eyebrow">{b.eyebrow}</p>
          <h2>{b.title}</h2>
          <p className="sub">{b.sub}</p>
        </div>
        <div className="power-panel">
          <dl className="spec-table">
            {b.specs.map(([k, v]) => (
              <div className="spec-row" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <PowerChart />
          <div className="chart-legend">
            <span className="lg power">Power</span>
            <span className="lg torque">Torque</span>
            <span className="lg note">{b.note}</span>
          </div>
        </div>
      </section>
    );
  }

  if (b.type === "timeline") {
    return (
      <section id={id} className="beat tline" style={{ "--n": b.items.length }}>
        <p className="eyebrow">{b.eyebrow}</p>
        <h2>{b.title}</h2>
        <ol className="tl-track">
          {b.items.map((it, j) => (
            <li className="tl-item" key={it.year} style={{ "--i": j }}>
              <span className="tl-year">{it.year}</span>
              <span className="tl-text">{it.text}</span>
            </li>
          ))}
        </ol>
        <p className="stats-note">{b.note}</p>
      </section>
    );
  }

  if (b.type === "cards") {
    return (
      <section id={id} className="beat cards">
        <p className="eyebrow">{b.eyebrow}</p>
        <h2>{b.title}</h2>
        <div className="card-row">
          {b.cards.map((c, j) => (
            <article className={`card${c.featured ? " featured" : ""}`} key={c.name} style={{ "--i": j }}>
              <span className="card-badge">Concept</span>
              <h3>
                <small>Orvane</small> {c.name}
              </h3>
              <p className="card-tag">{c.tag}</p>
              <dl className="card-specs">
                {c.specs.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="card-line">{c.specs.map(([, v]) => v).join(" · ")}</p>
            </article>
          ))}
        </div>
        <p className="stats-note">{b.note}</p>
      </section>
    );
  }

  return (
    <section id={id} className={`beat${b.type === "finale" ? " end" : ""}${b.align === "right" ? " right" : ""}`}>
      <p className="eyebrow">{b.eyebrow}</p>
      <h2>{b.title}</h2>
      <p className="sub">{b.sub}</p>
      {b.points && (
        <ul className="points">
          {b.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      {b.type === "finale" && (
        <div className="cta">
          {SITE.links.map((l, j) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className={j === 0 ? "primary" : ""}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Overlay() {
  return (
    <div className="ov">
      <header id="site-nav" className="nav">
        <button type="button" className="brand" data-go="0" aria-label="Back to top">
          <Logo />
        </button>
        <nav>
          {SITE.nav.map((n) => (
            <button key={n.label} type="button" data-go={n.go} data-nav>
              {n.label}
            </button>
          ))}
        </nav>
        <Tools />
      </header>

      {STORY.map((b, i) => (
        <Beat key={i} b={b} i={i} />
      ))}

      <Cursor />

      <div className="progress">
        <i id="progress-fill" />
      </div>
      <div id="scroll-hint" className="hint">
        Scroll
      </div>

      <footer className="foot">
        <p>{SITE.disclaimer}</p>
        <a href={SITE.credit.href} target="_blank" rel="noreferrer">
          {SITE.credit.text}
        </a>
      </footer>
    </div>
  );
}