// Ziyaretçinin siteye hangi reklamdan / nereden geldiğini (yalnızca kaynak adı) bu tarayıcıda tutar.
// Üye olurken bu ad kullanıcı kaydına "kaynak" olarak yazılır; Telegram bildiriminde görünür.
// Kişisel veri tutulmaz: yalnızca "google", "x", "meta" gibi bir etiket ve isteğe bağlı kampanya adı.
//
// Öncelik: reklam bağlantısındaki işaret (utm_source, gclid, fbclid, twclid) her zaman yazılır.
// Yalnızca yönlendiren site (referrer) biliniyorsa, daha önce kayıtlı kaynak yoksa yazılır.
// Kayıt 30 gün geçerlidir.

const ANAHTAR = "tevkilgo-kaynak";
const GECERLILIK_MS = 30 * 24 * 60 * 60 * 1000;

function kisalt(deger) {
  return String(deger || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/[^a-z0-9ğüşöçı_.-]/g, "-")
    .slice(0, 40);
}

function yonlendirenKaynak() {
  let host = "";
  try {
    host = new URL(document.referrer).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
  if (!host || host.endsWith("tevkilgo.org")) return null;
  if (/(^|\.)google\./.test(host)) return "google-organik";
  if (/instagram\.com$/.test(host)) return "instagram";
  if (/facebook\.com$|fb\.com$/.test(host)) return "facebook";
  if (host === "t.co" || /(^|\.)x\.com$|twitter\.com$/.test(host)) return "x-organik";
  if (host === "t.me" || /telegram/.test(host)) return "telegram";
  if (/linkedin\.com$|lnkd\.in$/.test(host)) return "linkedin";
  return kisalt(host);
}

function oku() {
  try {
    const kayit = JSON.parse(localStorage.getItem(ANAHTAR) || "null");
    if (kayit?.k && Date.now() - kayit.t < GECERLILIK_MS) return kayit;
  } catch {
    // Depolama yoksa kaynak bilinmez sayılır.
  }
  return null;
}

function yaz(k, c) {
  try {
    localStorage.setItem(ANAHTAR, JSON.stringify({ k, c: c || "", t: Date.now() }));
  } catch {
    // Gizli sekme vb.: kaynak tutulamaz.
  }
}

// Her sayfa açılışında çağrılır.
export function kaynakYakala() {
  if (typeof window === "undefined") return;
  const p = new URLSearchParams(window.location.search);
  let k = kisalt(p.get("utm_source"));
  if (!k && (p.get("gclid") || p.get("gbraid") || p.get("wbraid"))) k = "google";
  // Instagram reklamsız (bio, gönderi) tıklamalara da fbclid ekler; Instagram reklamı ise utm_source=instagram-reklam taşır.
  if (!k && p.get("fbclid")) k = "instagram";
  if (!k && p.get("twclid")) k = "x";
  if (k) {
    yaz(k, kisalt(p.get("utm_campaign")));
    return;
  }
  if (oku()) return;
  const y = yonlendirenKaynak();
  if (y) yaz(y, "");
}

// "x" ya da "google / tevkil-ucretleri" gibi; bilinmiyorsa "dogrudan".
export function kaynakOku() {
  if (typeof window === "undefined") return "dogrudan";
  const kayit = oku();
  if (!kayit) return "dogrudan";
  return kayit.c ? `${kayit.k} / ${kayit.c}` : kayit.k;
}
