import { MapPin } from "@phosphor-icons/react/ssr";
import { Baslik, Ekran, c } from "@/components/screens/ortak";

const basvuranlar = [
  { ad: "Av. M··· K.", baro: "Ankara Barosu", gorev: 18, uye: "Mart 2024", puan: "4,8", sayi: 26 },
  { ad: "Av. S··· D.", baro: "Ankara Barosu", gorev: 11, uye: "Ocak 2025", puan: "4,6", sayi: 14 },
  { ad: "Av. E··· T.", baro: "Ankara Barosu", gorev: 7, uye: "Eylül 2023", puan: "4,9", sayi: 31 },
];

const kart = { borderRadius: 12, border: `1px solid ${c.border}`, background: c.surface, padding: 16 };
const meta = { marginTop: 4, fontSize: 15, color: c.textMuted };
const bolum = { marginBottom: 12, fontSize: 17, fontWeight: 600 };

function Dugme({ children, ikincil = false, style }) {
  return (
    <span
      style={{
        display: "inline-flex",
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        border: ikincil ? `1px solid ${c.primary}` : "none",
        background: ikincil ? c.surface : c.primary,
        padding: "0 16px",
        fontSize: 17,
        fontWeight: 600,
        color: ikincil ? c.primary : c.textOnPrimary,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function BilgiKarti({ atandi, il, adliye }) {
  return (
    <div style={kart}>
      <span
        style={{
          display: "inline-flex",
          borderRadius: 8,
          background: atandi ? c.primarySoft : c.successSoft,
          padding: "4px 12px",
          fontSize: 12,
          fontWeight: 600,
          color: atandi ? c.primary : c.success,
        }}
      >
        {atandi ? "Atandı" : "Açık"}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
        <MapPin size={20} color={c.textMuted} />
        <span style={{ fontSize: 17, fontWeight: 600 }}>{il}</span>
      </div>
      <div style={{ marginBottom: 8, fontSize: 15, color: c.textMuted }}>{adliye}</div>
      <div style={meta}>Duruşma</div>
      <div style={meta}>12 Ekim 2026 11:00</div>
      <div style={{ marginTop: 8, fontSize: 17, fontWeight: 700, color: c.accent }}>3500₺</div>
      <div style={meta}>4/10 başvuru</div>
      <div style={{ marginTop: 12, fontSize: 15 }}>3. İş Mahkemesi</div>
    </div>
  );
}

function BasvuranlarKarti() {
  return (
    <div style={kart}>
      <div style={bolum}>Başvuranlar (4/10)</div>
      {basvuranlar.map((kisi) => (
        <div
          key={kisi.ad}
          style={{ display: "flex", alignItems: "center", gap: 8, borderTop: `1px solid ${c.border}`, padding: "8px 0" }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{kisi.ad}</div>
            <div style={meta}>{kisi.baro}</div>
            <div style={meta}>{kisi.gorev} görev tamamladı</div>
            <div style={meta}>Üye: {kisi.uye}</div>
            <div style={meta}>
              {kisi.puan} ★ · {kisi.sayi} değerlendirme
            </div>
          </div>
          <Dugme style={{ minWidth: 72 }}>Seç</Dugme>
        </div>
      ))}
      <Dugme ikincil style={{ display: "flex", marginTop: 12 }}>
        Görevi İptal Et
      </Dugme>
    </div>
  );
}

function KarsiTarafKarti() {
  return (
    <div style={kart}>
      <div style={bolum}>Karşı taraf</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span
          style={{
            display: "flex",
            width: 56,
            height: 56,
            flexShrink: 0,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            background: c.primarySoft,
            fontSize: 20,
            fontWeight: 600,
            color: c.primary,
          }}
        >
          MK
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Av. M··· K.</div>
          <div style={meta}>Ankara Barosu</div>
          <div style={meta}>TBB Sicil: •••••</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Dugme ikincil style={{ flex: 1 }}>
          Ara
        </Dugme>
        <Dugme style={{ flex: 1 }}>WhatsApp</Dugme>
      </div>
    </div>
  );
}

export function IlanDetayEkrani({ gorunum = "tam", il = "Ankara", adliye = "Ankara Batı Adliyesi" }) {
  return (
    <Ekran sekme={false}>
      <Baslik title="Görev Detayı" back />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 16px 32px" }}>
        {gorunum === "tam" ? <BilgiKarti il={il} adliye={adliye} /> : null}
        {gorunum !== "secildi" ? <BasvuranlarKarti /> : null}
        {gorunum === "secildi" ? (
          <>
            <KarsiTarafKarti />
            <Dugme style={{ display: "flex" }}>Tamamlandı Olarak İşaretle</Dugme>
            <BilgiKarti atandi il={il} adliye={adliye} />
          </>
        ) : null}
      </div>
    </Ekran>
  );
}
