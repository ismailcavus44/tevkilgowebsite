// Meta (Facebook/Instagram) Pixel
// Olay Yöneticisi > Veri setleri > "TevkilGO Web" kimliğini buraya yaz.
// Boş kaldıkça Pixel hiç yüklenmez, olay da gönderilmez.
export const META_PIXEL_ID = "";

// Pixel yüklüyse olay gönderir; yüklü değilse sessizce geçer.
// Kişisel veri (e-posta, telefon, ad) GÖNDERİLMEZ.
export function metaOlay(olay, veri) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (veri) window.fbq("track", olay, veri);
  else window.fbq("track", olay);
}
