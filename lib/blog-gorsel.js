import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { KATEGORILER } from "@/lib/blog";

const size = { width: 1200, height: 630 };

// Blog yazısı: kapak yüklendiyse kapak, yoksa başlıklı markalı görsel
export async function blogGorseli(y) {
  const ikon = await readFile(join(process.cwd(), "public/icon.png"));
  const ikonSrc = `data:image/png;base64,${ikon.toString("base64")}`;

  if (y.kapak_url) {
    return new ImageResponse(
      // eslint-disable-next-line @next/next/no-img-element
      <img src={y.kapak_url} width={1200} height={630} style={{ objectFit: "cover" }} alt="" />,
      size,
    );
  }
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ikonSrc} width={64} height={64} style={{ borderRadius: 14 }} alt="" />
          <span style={{ fontSize: 34, fontWeight: 700 }}>TevkilGO</span>
          <span style={{ fontSize: 28, color: "rgba(255,255,255,0.55)", marginLeft: 12 }}>
            {KATEGORILER[y.kategori] || "Blog"}
          </span>
        </div>
        <span style={{ fontSize: y.baslik.length > 70 ? 58 : 70, lineHeight: 1.08, letterSpacing: -2, fontWeight: 700 }}>
          {y.baslik}
        </span>
        <span style={{ fontSize: 26, color: "rgba(255,255,255,0.6)" }}>Baro kimliğiyle doğrulanmış avukatlar · tevkilgo.org</span>
      </div>
    ),
    size,
  );
}

