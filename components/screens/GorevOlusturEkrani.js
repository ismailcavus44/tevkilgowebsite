import { CalendarBlank, Clock } from "@phosphor-icons/react/ssr";
import { Baslik, Ekran, c } from "@/components/screens/ortak";

function Etiket({ children }) {
  return <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: c.textMuted }}>{children}</div>;
}

function Kutu({ children, sag }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: 48,
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 12,
        border: `1px solid ${c.border}`,
        background: c.surface,
        padding: "0 16px",
        fontSize: 15,
      }}
    >
      <span>{children}</span>
      {sag}
    </div>
  );
}

function Secim({ label, value }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Etiket>{label}</Etiket>
      <Kutu sag={<span style={{ marginLeft: 8, fontSize: 12, color: c.textMuted }}>▼</span>}>{value}</Kutu>
    </div>
  );
}

export function GorevOlusturEkrani() {
  return (
    <Ekran sekme={false}>
      <Baslik title="Görev Oluştur" back />
      <div style={{ padding: "0 24px 32px" }}>
        <p style={{ marginBottom: 32, textAlign: "center", fontSize: 15, color: c.textMuted }}>
          Görev detaylarını eksiksiz doldurun
        </p>
        <Secim label="Şehir" value="Ankara" />
        <Secim label="Adliye" value="Ankara Batı Adliyesi" />
        <Secim label="Kategori" value="Duruşma" />
        <div style={{ marginBottom: 16 }}>
          <Etiket>Tarih</Etiket>
          <Kutu sag={<CalendarBlank size={20} color={c.textMuted} />}>12.10.2026</Kutu>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Etiket>Saat</Etiket>
          <Kutu sag={<Clock size={20} color={c.textMuted} />}>11:00</Kutu>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Etiket>Ücret (₺)</Etiket>
          <Kutu>3500</Kutu>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Etiket>Görev Notu (Opsiyonel)</Etiket>
          <div
            style={{
              minHeight: 96,
              borderRadius: 12,
              border: `1px solid ${c.border}`,
              background: c.surface,
              padding: "12px 16px",
              fontSize: 15,
            }}
          >
            3. İş Mahkemesi, duruşmaya katılım
          </div>
        </div>
        <div
          style={{
            display: "flex",
            minHeight: 48,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 32,
            borderRadius: 12,
            background: c.primary,
            fontSize: 17,
            fontWeight: 600,
            color: c.textOnPrimary,
          }}
        >
          Görev Oluştur
        </div>
      </div>
    </Ekran>
  );
}
