import {
  ArrowLeft,
  Bell,
  CaretDown,
  CheckCircle,
  ClipboardText,
  Clock,
  House,
  MagnifyingGlass,
  Plus,
  Users,
} from "@phosphor-icons/react/ssr";

export const c = {
  primary: "#1E3A5F",
  primaryDark: "#152B47",
  primarySoft: "#E8EEF5",
  accent: "#C8963E",
  background: "#F7F7F5",
  surface: "#FFFFFF",
  text: "#1A1D21",
  textMuted: "#6B7280",
  textOnPrimary: "#FFFFFF",
  border: "#E5E7EB",
  success: "#2F7D5B",
  successSoft: "#E6F2EC",
  warning: "#B7791F",
  warningSoft: "#FBF1E0",
  error: "#B42318",
  errorSoft: "#FDECEA",
  neutralSoft: "#F1F2F4",
};

export function tl(n) {
  return `${new Intl.NumberFormat("tr-TR").format(n)} ₺`;
}

export function Ekran({ children, sekme }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: 390,
        height: 844,
        overflow: "hidden",
        background: c.background,
        color: c.text,
        fontFamily: "inherit",
        pointerEvents: "none",
      }}
    >
      {children}
      {sekme !== false ? <SekmeCubugu aktif={sekme} /> : null}
    </div>
  );
}

export function Durum() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 4,
        display: "flex",
        height: 54,
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: "0 24px 6px",
        color: c.text,
      }}
    >
      <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.2 }}>09:41</span>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="17" height="12" viewBox="0 0 17 12" aria-hidden="true">
          <rect x="0" y="7" width="3" height="5" rx="0.6" fill="currentColor" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.6" fill="currentColor" />
          <rect x="9" y="2.5" width="3" height="9.5" rx="0.6" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.6" fill="currentColor" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
          <path
            d="M8 3.2c1.7 0 3.2.7 4.3 1.8l1-1.1A7.2 7.2 0 0 0 8 1.6 7.2 7.2 0 0 0 2.7 3.9l1 1.1A5.8 5.8 0 0 1 8 3.2Z"
            fill="currentColor"
          />
          <path
            d="M8 6.4c.9 0 1.7.4 2.3 1l1-1.1A4.4 4.4 0 0 0 8 5 4.4 4.4 0 0 0 4.7 6.3l1 1.1c.6-.6 1.4-1 2.3-1Z"
            fill="currentColor"
          />
          <circle cx="8" cy="10.2" r="1.3" fill="currentColor" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
          <rect x="0.6" y="0.6" width="21" height="10.8" rx="2.4" stroke="currentColor" fill="none" />
          <rect x="2" y="2" width="16" height="8" rx="1.2" fill="currentColor" />
          <path d="M23 4.2v3.6c.8-.3 1.3-1 1.3-1.8s-.5-1.5-1.3-1.8Z" fill="currentColor" />
        </svg>
      </span>
    </div>
  );
}

export function Baslik({ title, right, back = false, pad = 24 }) {
  return (
    <div
      style={{
        position: "relative",
        paddingTop: 52,
        paddingBottom: 24,
        paddingLeft: pad,
        paddingRight: pad,
        background: c.background,
      }}
    >
      <Durum />
      {back ? (
        <div style={{ display: "flex", height: 44, alignItems: "center" }}>
          <span style={{ display: "flex", width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
            <ArrowLeft size={22} color={c.text} />
          </span>
        </div>
      ) : null}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
        {right}
      </div>
    </div>
  );
}

const sekmeler = [
  { id: "anasayfa", label: "Anasayfa", Icon: House },
  { id: "musait", label: "Müsait", Icon: MagnifyingGlass },
  { id: "arti" },
  { id: "gorevler", label: "Görevler", Icon: ClipboardText },
  { id: "bildirimler", label: "Bildirimler", Icon: Bell },
];

export function SekmeCubugu({ aktif }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 20,
        height: 64,
        borderRadius: 32,
        border: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 6px 16px rgba(15,27,45,0.12)",
        display: "flex",
        alignItems: "center",
      }}
    >
      {sekmeler.map((sekme) => {
        if (sekme.id === "arti") {
          return (
            <div key="arti" style={{ display: "flex", flex: 1, justifyContent: "center" }}>
              <span
                style={{
                  display: "flex",
                  width: 52,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 22,
                  background: c.primary,
                }}
              >
                <Plus size={24} weight="bold" color={c.textOnPrimary} />
              </span>
            </div>
          );
        }
        const acik = sekme.id === aktif;
        const Icon = sekme.Icon;
        return (
          <div
            key={sekme.id}
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={22} weight={acik ? "fill" : "regular"} color={acik ? c.primary : c.textMuted} />
            <span
              style={{
                marginTop: 2,
                fontSize: 11,
                fontWeight: acik ? 600 : 400,
                color: acik ? c.primary : c.textMuted,
              }}
            >
              {sekme.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function Segmentler({ aktif }) {
  const oge = [
    ["ilanlar", "İlanlar"],
    ["verdiklerim", "Verdiklerim"],
    ["basvurularim", "Başvurularım"],
  ];
  return (
    <div
      style={{
        display: "flex",
        margin: "0 16px 8px",
        padding: 4,
        borderRadius: 12,
        background: c.neutralSoft,
      }}
    >
      {oge.map(([id, etiket]) => {
        const secili = id === aktif;
        return (
          <div
            key={id}
            style={{
              flex: 1,
              padding: "8px 4px",
              borderRadius: 8,
              background: secili ? c.surface : "transparent",
              textAlign: "center",
              fontSize: 12,
              fontWeight: secili ? 600 : 400,
              color: secili ? c.primary : c.textMuted,
            }}
          >
            {etiket}
          </div>
        );
      })}
    </div>
  );
}

export function Cip({ label }) {
  return (
    <span
      style={{
        display: "inline-flex",
        height: 36,
        flexShrink: 0,
        alignItems: "center",
        gap: 4,
        padding: "0 14px",
        borderRadius: 18,
        border: `1px solid ${c.border}`,
        background: c.surface,
        fontSize: 12,
        fontWeight: 600,
        color: c.text,
      }}
    >
      {label}
      <CaretDown size={14} color={c.text} />
    </span>
  );
}

export function Bolum({ baslik }) {
  return (
    <div style={{ paddingBottom: 8, background: c.background }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0.5,
          color: c.textMuted,
        }}
      >
        {baslik}
      </div>
    </div>
  );
}

export function IlanSatiri({ kategori, ucret, saat, adet, adliye, acil = false, basvuruldu = false, son = false }) {
  return (
    <div>
      <div
        style={{
          position: "relative",
          minHeight: 68,
          padding: "12px 16px",
          background: c.surface,
        }}
      >
        {acil ? (
          <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: c.warning }} />
        ) : null}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, fontSize: 17, fontWeight: 600 }}>{kategori}</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: c.accent }}>{tl(ucret)}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <div style={{ display: "flex", minWidth: 0, flex: 1, alignItems: "center", gap: 4 }}>
            <Clock size={14} color={c.textMuted} />
            <span style={{ fontSize: 12, color: c.textMuted }}>{saat}</span>
            {acil ? (
              <span
                style={{
                  borderRadius: 6,
                  background: c.warningSoft,
                  padding: "1px 6px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: c.warning,
                }}
              >
                Acil
              </span>
            ) : null}
            <span style={{ width: 4 }} />
            <Users size={14} color={c.textMuted} />
            <span style={{ fontSize: 12, color: c.textMuted }}>{adet}/10</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, color: c.textMuted }}>
              {" "}
              · {adliye}
            </span>
          </div>
          {basvuruldu ? (
            <span style={{ display: "inline-flex", flexShrink: 0, alignItems: "center", gap: 4, fontSize: 12, color: c.success }}>
              <CheckCircle size={16} weight="fill" color={c.success} />
              Başvuruldu
            </span>
          ) : (
            <span
              style={{
                display: "inline-flex",
                height: 30,
                flexShrink: 0,
                alignItems: "center",
                padding: "0 14px",
                borderRadius: 15,
                background: c.primary,
                fontSize: 12,
                fontWeight: 600,
                color: c.textOnPrimary,
              }}
            >
              Başvur
            </span>
          )}
        </div>
      </div>
      {son ? null : <div style={{ height: 1, marginLeft: 16, background: c.border }} />}
    </div>
  );
}

export function IlanBlok({ children }) {
  return (
    <div
      style={{
        overflow: "hidden",
        marginBottom: 24,
        borderRadius: 12,
        border: `1px solid ${c.border}`,
        background: c.surface,
      }}
    >
      {children}
    </div>
  );
}
