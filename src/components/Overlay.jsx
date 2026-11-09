import "../overlay.css";
import Logo from "./Logo";
import { SITE, STORY } from "../config/site";

// Ye component sirf ek baar render hota hai. Text ki chamak OverlaySync badalta hai.
// data-go wale button/link par click karne par OverlaySync us offset tak smooth scroll karta hai.
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

  return (
    <section id={id} className={`beat${b.type === "finale" ? " end" : ""}`}>
      <p className="eyebrow">{b.eyebrow}</p>
      <h2>{b.title}</h2>
      <p className="sub">{b.sub}</p>
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
      </header>

      {STORY.map((b, i) => (
        <Beat key={i} b={b} i={i} />
      ))}

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