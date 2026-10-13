import { ArrowRight, MapPin } from "@phosphor-icons/react/ssr";
import { Baslik, Ekran, Segmentler, c } from "@/components/screens/ortak";

const kartlar = [
  {
    sehir: null,
    adliye: "Ankara Batı Adliyesi",
    ucret: "3500₺",
    rozet: "Değerlendiriliyor",
    rozetBg: c.warningSoft,
    rozetRenk: c.warning,
    kategori: "Duruşma",
    tarih: "12.10.2026 11:00",
    not: "3. İş Mahkemesi",
    ad: "Av. M··· K.",
    harf: "MK",
    olusturma: "10.10.2026 16:40",
  },
  {
    sehir: "Ankara",
    adliye: "Sincan Adliyesi",
    ucret: "2800₺",
    rozet: "Size Verildi",
    rozetBg: c.primarySoft,
    rozetRenk: c.primary,
    kategori: "Duruşma",
    tarih: "13.10.2026 09:30",
    not: "2. Aile Mahkemesi",
    ad: "Av. S··· D.",
    harf: "SD",
    olusturma: "11.10.2026 08:15",
  },
  {
    sehir: null,
    adliye: "Ankara Adliyesi",
    ucret: "4200₺",
    rozet: "Değerlendiriliyor",
    rozetBg: c.warningSoft,
    rozetRenk: c.warning,
    kategori: "Duruşma",
    tarih: "12.10.2026 14:00",
    not: "5. Asliye Hukuk Mahkemesi",
    ad: "Av. E··· T.",
    harf: "ET",
    olusturma: "09.10.2026 19:05",
  },
];

export function BasvurularEkrani() {
  return (
    <Ekran sekme="gorevler">
      <Baslik title="Görevler" pad={16} />
      <Segmentler aktif="basvurularim" />
      <div style={{ padding: "8px 16px 120px" }}>
        {kartlar.map((kart) => (
          <div
            key={kart.adliye + kart.tarih}
            style={{
              marginBottom: 12,
              borderRadius: 12,
              border: `1px solid ${c.border}`,
              background: c.surface,
              padding: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                {kart.sehir ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <MapPin size={20} color={c.textMuted} />
                    <span style={{ fontSize: 17, fontWeight: 700 }}>{kart.sehir}</span>
                  </div>
                ) : null}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  {kart.sehir ? null : <MapPin size={20} color={c.textMuted} />}
                  <span style={{ fontSize: 15, color: c.textMuted }}>{kart.adliye}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ marginBottom: 4, fontSize: 12, fontWeight: 600, color: c.textMuted }}>Ücret</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: c.accent }}>{kart.ucret}</div>
              </div>
            </div>
            <span
              style={{
                display: "inline-flex",
                marginBottom: 12,
                borderRadius: 8,
                background: kart.rozetBg,
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 600,
                color: kart.rozetRenk,
              }}
            >
              {kart.rozet}
            </span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span
                style={{
                  borderRadius: 8,
                  background: c.neutralSoft,
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {kart.kategori}
              </span>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{kart.tarih}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span
                style={{
                  display: "flex",
                  width: 36,
                  height: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 18,
                  background: c.primarySoft,
                  fontSize: 13,
                  fontWeight: 600,
                  color: c.primary,
                }}
              >
                {kart.harf}
              </span>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{kart.ad}</span>
            </div>
            <div
              style={{
                marginBottom: 12,
                borderRadius: 8,
                background: c.neutralSoft,
                padding: 12,
                fontSize: 15,
                lineHeight: "20px",
              }}
            >
              {kart.not}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: `1px solid ${c.border}`,
                paddingTop: 12,
              }}
            >
              <span style={{ fontSize: 12, color: c.textMuted }}>{kart.olusturma}</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  borderRadius: 16,
                  background: c.primarySoft,
                  padding: "8px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: c.primary,
                }}
              >
                <ArrowRight size={20} color={c.primary} />
                Detay
              </span>
            </div>
          </div>
        ))}
      </div>
    </Ekran>
  );
}
