export function FormHatasi({ children, tur = "hata" }) {
  if (!children) return null;
  const renk = tur === "bilgi" ? "border-line bg-canvas text-ink" : "border-danger/20 bg-danger-soft text-danger";
  return (
    <p role={tur === "bilgi" ? "status" : "alert"} className={`rounded-lg border px-3.5 py-3 text-[14px] ${renk}`}>
      {children}
    </p>
  );
}
