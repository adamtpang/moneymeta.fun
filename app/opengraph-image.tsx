import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "moneymeta.fun, the Vicious Syndicate of moneymaking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TIERS: { letter: string; bg: string; fg: string }[] = [
  { letter: "S", bg: "#fbbf24", fg: "#451a03" },
  { letter: "A", bg: "#a78bfa", fg: "#2e1065" },
  { letter: "B", bg: "#38bdf8", fg: "#082f49" },
  { letter: "C", bg: "#34d399", fg: "#022c22" },
  { letter: "D", bg: "#94a3b8", fg: "#0f172a" },
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0d14",
          backgroundImage:
            "linear-gradient(135deg, #0c1a12 0%, #0a0d14 45%, #0a0d14 70%, #14110a 100%)",
          padding: "72px 80px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 800, color: "#f1f5f9", letterSpacing: -2 }}>
            moneymeta<span style={{ color: "#22c55e" }}>.fun</span>
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 36, color: "#94a3b8" }}>
            The Vicious Syndicate of moneymaking. Capital, income, and careers, ranked.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", gap: 18 }}>
            {TIERS.map((t) => (
              <div
                key={t.letter}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 92,
                  height: 92,
                  borderRadius: 18,
                  backgroundColor: t.bg,
                  color: t.fg,
                  fontSize: 56,
                  fontWeight: 800,
                }}
              >
                {t.letter}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#64748b" }}>
            S → D · every number traces to a public source
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
