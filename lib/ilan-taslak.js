// İlan açarken kimlik kapısına takılan kullanıcının formu bu sekmede saklanır.
// Kimlik sayfasından uygulamaya dönünce ilan penceresi aynı bilgilerle yeniden açılır.
// sessionStorage: sekme kapanınca silinir; depolama yoksa (gizli sekme vb.) sessizce atlanır.

const TASLAK = "tevkilgo-ilan-taslak";
const DEVAM = "tevkilgo-ilan-devam";
const GECERLILIK_MS = 24 * 60 * 60 * 1000;

export function taslakKaydet(form, sehirAd) {
  try {
    sessionStorage.setItem(TASLAK, JSON.stringify({ form, sehirAd: sehirAd || "", t: Date.now() }));
  } catch {
    // Depolama yok: taslak tutulamaz.
  }
}

export function taslakOku() {
  try {
    const kayit = JSON.parse(sessionStorage.getItem(TASLAK) || "null");
    if (kayit?.form && Date.now() - kayit.t < GECERLILIK_MS) return kayit;
    sessionStorage.removeItem(TASLAK);
  } catch {
    // Depolama yok ya da bozuk kayıt.
  }
  return null;
}

export function taslakSil() {
  try {
    sessionStorage.removeItem(TASLAK);
    sessionStorage.removeItem(DEVAM);
  } catch {
    // Depolama yok.
  }
}

// Kullanıcı ilan sırasında "Bilgilerimi düzelt"e bastı: dönüşte ilan penceresi açılsın.
export function ilanDevamIsaretle() {
  try {
    if (sessionStorage.getItem(TASLAK)) sessionStorage.setItem(DEVAM, "1");
  } catch {
    // Depolama yok.
  }
}

// Uygulamaya dönüşte bir kez true döner; işaret silinir.
export function ilanDevamAl() {
  try {
    if (sessionStorage.getItem(DEVAM) !== "1") return false;
    sessionStorage.removeItem(DEVAM);
    return Boolean(taslakOku());
  } catch {
    return false;
  }
}
