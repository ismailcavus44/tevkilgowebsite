import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ilIcerik } from "@/lib/il-icerik";

export const alt = "TevkilGO, avukatlar arası tevkil uygulaması";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return Object.keys(ilIcerik).map((kod) => ({ sayfa: `${kod}-tevkil` }));
}

export default async function Image({ params }) {
  const { sayfa } = await params;
  const icerik = ilIcerik[sayfa.replace(/-tevkil$/, "")];
  const ikon = await readFile(join(process.cwd(), "public/icon.png"));
  const ikonSrc = `data:image/png;base64,${ikon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#12263F",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={ikonSrc} width={72} height={72} style={{ borderRadius: 16 }} alt="" />
          <span style={{ fontSize: 40, fontWeight: 700 }}>TevkilGO</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span style={{ fontSize: 96, lineHeight: 1.02, letterSpacing: -3 }}>{icerik?.ad || "Türkiye"} Tevkil</span>
          <span style={{ fontSize: 34, lineHeight: 1.3, color: "rgba(255,255,255,0.72)" }}>{icerik?.baslik}</span>
        </div>
        <span style={{ fontSize: 26, color: "rgba(255,255,255,0.6)" }}>
          Baro kimliğiyle doğrulanmış avukatlar · tevkilgo.org
        </span>
      </div>
    ),
    size,
  );
}
