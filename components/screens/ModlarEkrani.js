import { Bank, ChatCircleText, Info, MoonStars, Plus } from "@phosphor-icons/react/ssr";
import { Baslik, Ekran, IlanBlok, IlanSatiri, c } from "@/components/screens/ortak";

function Secenek({ icon, etiket, not }) {
  return (
    <div style={{ flex: 1 }}>
      <div
        style={{
          display: "flex",
          minHeight: 56,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          borderRadius: 12,
          border: `1px solid ${c.border}`,
          background: c.surface,
          padding: "8px",
        }}
      >
        {icon}
        <span style={{ textAlign: "center", fontSize: 12, fontWeight: 600 }}>{etiket}</span>
      </div>
      {not ? (
        <div style={{ marginTop: 4, textAlign: "center", fontSize: 12, color: c.textMuted }}>{not}</div>
      ) : null}
    </div>
  );
}

function YuvarlakDugme({ children }) {
  return (
    <span
      style={{
        display: "flex",
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: 20,
        border: `1px solid ${c.border}`,
        background: c.surface,
      }}
    >
      {children}
    </span>
  );
}

export function ModlarEkrani() {
  return (
    <Ekran sekme="anasayfa">
      <Baslik
        title="Merhaba"
        right={
          <span style={{ display: "flex", gap: 8 }}>
            <YuvarlakDugme>
              <ChatCircleText size={22} color={c.text} />
            </YuvarlakDugme>
            <YuvarlakDugme>
              <span
                style={{
                  display: "flex",
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  background: c.primarySoft,
                  fontSize: 14,
                  fontWeight: 600,
                  color: c.primary,
                }}
              >
                AY
              </span>
            </YuvarlakDugme>
          </span>
        }
      />
      <div style={{ padding: "0 24px" }}>
        <div
          style={{
            marginBottom: 8,
            borderRadius: 12,
            border: `1px solid ${c.border}`,
            background: c.surface,
            padding: "8px 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Müsaitlik</span>
            <span
              style={{
                display: "flex",
                width: 28,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                border: `1px solid ${c.border}`,
                background: c.background,
              }}
            >
              <Info size={16} color={c.primary} />
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <Secenek icon={<Bank size={20} color={c.primary} />} etiket="Ücretsiz · 60 dk" />
            <Secenek
              icon={<MoonStars size={20} color={c.primary} />}
              etiket="Ücretsiz · 60 dk"
              not="18:00–08:00 arası"
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
            borderRadius: 12,
            border: `1px solid ${c.border}`,
            background: c.surface,
            padding: "8px 16px",
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 700, color: c.primary }}>7</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Bölgende açık ilan</div>
            <div style={{ marginTop: 4, fontSize: 12, color: c.textMuted }}>3 tanesi bugün</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: c.textMuted }}>Yaklaşan İlanlar</span>
          <span style={{ marginBottom: 12, fontSize: 12, fontWeight: 600, color: c.primary }}>Tümünü gör</span>
        </div>
        <IlanBlok>
          <IlanSatiri kategori="Duruşma" ucret={3500} saat="11:00" adet={4} adliye="Ankara Batı" acil />
          <IlanSatiri kategori="Duruşma" ucret={4200} saat="Yarın 09:30" adet={6} adliye="Sincan" son />
        </IlanBlok>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: -12,
            borderRadius: 12,
            background: c.primarySoft,
            padding: 16,
          }}
        >
          <div style={{ flex: 1, marginRight: 12 }}>
            <div style={{ marginBottom: 4, fontSize: 17, fontWeight: 700, color: c.primary }}>Yeni görev oluştur</div>
            <div style={{ fontSize: 12, color: c.text }}>
              Adliye, tarih ve ücreti belirleyip meslektaşlarınıza iletin.
            </div>
          </div>
          <span
            style={{
              display: "flex",
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              background: c.surface,
            }}
          >
            <Plus size={22} weight="bold" color={c.primary} />
          </span>
        </div>
      </div>
    </Ekran>
  );
}
