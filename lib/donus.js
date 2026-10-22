// Doğrulama ekranlarından sonra dönülecek adres (?donus=). Yalnızca uygulama içi
// yollar kabul edilir; doğrulama ekranlarının kendisi döngü yaratmasın diye dışarıda kalır.
export function guvenliDonus(deger) {
  const yol = typeof deger === "string" ? deger : "";
  if (!yol.startsWith("/app") || yol.startsWith("//")) return "/app";
  if (yol.startsWith("/app/kimlik") || yol.startsWith("/app/bekliyor")) return "/app";
  return yol;
}
