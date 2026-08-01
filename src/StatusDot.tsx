import "./StatusDot.css";

export type StatusKind = "healthy" | "down" | "not-registered" | "unknown";

// Color (and, for "healthy", a pulse) is the only visible signal — no text
// label, same traffic-light dot everywhere status shows up. The pulse reads
// as alive/live-updating (this data is all SSE-driven), rather than a
// static dot that looks the same whether it updated a second ago or an
// hour ago. Still exposed to assistive tech via role="img"/aria-label,
// since color alone isn't accessible, and via title for a hover tooltip.
export function StatusDot({ status, label }: { status: StatusKind; label: string }) {
  return <span className={`status-dot status-dot--${status}`} role="img" aria-label={label} title={label} />;
}
