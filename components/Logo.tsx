import Link from "next/link";

// Redrawn from the brand's Instagram mark — swap for the original vector when available.
export function CherryMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 14.5l7 1.5c3 8 4 16 1 22M27 16c9 4 15 10 19 16" />
      <path d="M27 15c2-7 11-9 15-6-2 6-9 8-15 6zM27 16c-6-1-12 4-11 12 6-1 11-6 11-12z" />
      <circle cx="25" cy="47" r="9" />
      <circle cx="48" cy="40" r="9" />
    </svg>
  );
}

export function Logo({ onDark, className = "" }: { onDark?: boolean; className?: string }) {
  const accent = onDark ? "text-blush" : "text-cherry";
  return (
    <Link
      href="/"
      aria-label="CHÉRI WEAR, početna"
      translate="no"
      className={`display inline-flex items-center gap-[0.22em] text-[1.7rem] leading-none ${className}`}
    >
      <span className={accent}>Chéri</span>
      <span>Wear</span>
      <CherryMark className={`size-[0.9em] ${accent}`} />
    </Link>
  );
}
