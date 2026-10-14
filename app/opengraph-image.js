import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "TevkilGO, avukatlar arası tevkil uygulaması";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          <span style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -2 }}>
            Avukatlar arası tevkil uygulaması
          </span>
          <span style={{ fontSize: 32, color: "rgba(255,255,255,0.72)" }}>
            Duruşmana gidemiyorsan tevkil ver, adliyedeki meslektaşın gitsin.
          </span>
        </div>
        <span style={{ fontSize: 26, color: "rgba(255,255,255,0.6)" }}>
          81 il · Baro kimliğiyle doğrulanmış avukatlar · tevkilgo.org
        </span>
      </div>
    ),
    size,
  );
}
