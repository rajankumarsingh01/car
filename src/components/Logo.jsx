import { SITE } from "../config/site";

// Monogram: gol ring, beech mein "V" aur horizon line
export function LogoMark({ size = 30 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" strokeWidth="1.4" />
      <path d="M15 16 L24 33 L33 16" strokeWidth="2.4" />
      <path d="M10 24 H20 M28 24 H38" strokeWidth="1.4" />
    </svg>
  );
}

export default function Logo({ size = 30 }) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo-word">
        {SITE.brand.name.toUpperCase()}
        <small>{SITE.brand.sub.toUpperCase()}</small>
      </span>
    </span>
  );
}