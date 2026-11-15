// Google etiketi (Google Ads dönüşüm ölçümü)
// Google Ads > Hedefler > Dönüşümler > "Google etiketi ayarlayın" ekranındaki etiket kimliği.
export const GOOGLE_ETIKET_ID = "GTM-TRNKM7RD";

// Dönüşüm işlemleri (Google Ads > Hedefler > Tüm dönüşümler > etkinlik snippet'indeki send_to değeri)
export const DONUSUM_APP_STORE = "AW-18531678845/WtwJCK7JoLcdEP30y4RF"; // "App Store tıklama"
export const DONUSUM_WEB_UYELIK = "AW-18531678845/9_3ICOawibkdEP30y4RF"; // "Web üyelik tamamlandı (kod)"

// Etiket yüklüyse (çerez bandında "Kabul et" denmişse) dönüşüm gönderir; değilse sessizce geçer.
// Kişisel veri (e-posta, telefon, ad) GÖNDERİLMEZ.
export function googleDonusum(hedef) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: hedef });
}
