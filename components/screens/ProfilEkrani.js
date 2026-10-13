import { CaretDown, PawPrint, Plus, SignOut } from "@phosphor-icons/react/ssr";
import { Baslik, Ekran, c } from "@/components/screens/ortak";

function Alan({ label, value, kapali = false, ok = false }) {
  return (
    <div style={{ marginBottom: 16, opacity: kapali ? 0.7 : 1 }}>
      <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: c.textMuted }}>{label}</div>
      <div
        style={{
          display: "flex",
          minHeight: 48,
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 12,
          border: `1px solid ${c.border}`,
          background: kapali ? c.neutralSoft : c.surface,
          padding: "12px 16px",
          fontSize: 15,
        }}
      >
        <span>{value}</span>
        {ok ? <CaretDown size={16} color={c.textMuted} /> : null}
      </div>
    </div>
  );
}

function Buton({ children, variant = "secondary" }) {
  const yikici = variant === "destructive";
  return (
    <div
      style={{
        display: "flex",
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        border: yikici ? "none" : `1px solid ${c.primary}`,
        background: yikici ? "transparent" : c.surface,
        padding: "0 16px",
        fontSize: 17,
        fontWeight: 600,
        color: yikici ? c.error : c.primary,
      }}
    >
      {children}
    </div>
  );
}

export function ProfilEkrani() {
  return (
    <Ekran sekme={null}>
      <Baslik
        title="Profil"
        right={
          <span
            style={{
              display: "inline-flex",
              minWidth: 92,
              minHeight: 48,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              border: `1px solid ${c.primary}`,
              background: c.surface,
              padding: "0 16px",
              fontSize: 17,
              fontWeight: 600,
              color: c.primary,
              opacity: 0.5,
            }}
          >
            Kaydet
          </span>
        }
      />
      <div style={{ padding: "24px 24px 32px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ position: "relative", width: 120, height: 120 }}>
            <div
              style={{
                display: "flex",
                width: 120,
                height: 120,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 60,
                background: c.primarySoft,
                fontSize: 43,
                fontWeight: 600,
                color: c.primary,
              }}
            >
              AY
            </div>
            <span
              style={{
                position: "absolute",
                right: 2,
                bottom: 2,
                display: "flex",
                width: 28,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                border: `2px solid ${c.background}`,
                background: c.primary,
              }}
            >
              <Plus size={16} weight="bold" color={c.textOnPrimary} />
            </span>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16, fontSize: 17, fontWeight: 700 }}>Kişisel Bilgiler</div>
          <Alan label="Ad Soyad" value="Av. A··· Y." kapali />
          <Alan label="Baro" value="Ankara Barosu" kapali />
          <p style={{ marginBottom: 16, fontSize: 12, lineHeight: "18px", color: c.textMuted }}>
            Ad soyad ve baro değişikliği için <span style={{ fontWeight: 600, color: c.primary }}>Bize Yazın</span>
            &apos;dan talepte bulunun.
          </p>
          <Alan label="Telefon" value="05*********" />
          <Alan label="E-posta" value="a···@ornek.com" kapali />
          <Alan label="TBB Sicil No" value="••••••" kapali />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16, fontSize: 17, fontWeight: 700 }}>Çalışma Tercihleri</div>
          <Alan label="Kategoriler" value="Duruşma" ok />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 16, fontSize: 17, fontWeight: 700 }}>Çalıştığım Bölge</div>
          <Alan label="İl" value="Ankara" ok />
          <Alan label="Adliyeler" value="Ankara Batı Adliyesi" ok />
          <Buton>Bölgeyi Kaydet</Buton>
          <p style={{ marginTop: 12, fontSize: 12, color: c.textMuted }}>
            Bölgenizi 24 saatte bir değiştirebilirsiniz. Kategoriler her zaman değiştirilebilir.
          </p>
        </div>

        <div style={{ marginTop: 24, borderTop: `1px solid ${c.border}` }}>
          {["Bize Yazın", "Kullanım Koşulları", "Gizlilik Politikası"].map((yazi) => (
            <div
              key={yazi}
              style={{
                borderBottom: `1px solid ${c.border}`,
                padding: "16px 0",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {yazi}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderBottom: `1px solid ${c.border}`,
              padding: "16px 0",
              fontSize: 15,
              fontWeight: 600,
              color: c.error,
            }}
          >
            <SignOut size={20} color={c.error} />
            Çıkış Yap
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <Buton variant="destructive">Hesabımı Sil</Buton>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
          <span style={{ fontSize: 12, color: c.textMuted, opacity: 0.6 }}>TevkilGO 2.0.0</span>
          <PawPrint size={10} color={c.accent} style={{ marginLeft: 4 }} />
        </div>
      </div>
    </Ekran>
  );
}
