// Supabase Auth İngilizce döner; veritabanı trigger'ları Türkçe mesaj yükseltir.
// Tanınan İngilizce kalıplar çevrilir, Türkçe metin olduğu gibi kalır.
export function hataMesaji(error) {
  const mesaj = String(error?.message || "").trim();
  if (!mesaj) return "Bir hata oluştu, lütfen tekrar deneyin.";

  const kucuk = mesaj.toLowerCase();

  if (kucuk.includes("user already registered") || kucuk.includes("already been registered")) {
    return "Bu e-posta adresiyle zaten bir hesap var.";
  }
  if (kucuk.includes("invalid login credentials")) {
    return "E-posta veya şifre hatalı.";
  }
  if (kucuk.includes("email not confirmed") || kucuk.includes("email_not_confirmed")) {
    return "E-posta adresiniz henüz doğrulanmadı.";
  }
  if (
    kucuk.includes("token has expired") ||
    kucuk.includes("expired or is invalid") ||
    (kucuk.includes("expired") && kucuk.includes("invalid"))
  ) {
    return "Kodun süresi dolmuş veya kod hatalı.";
  }
  if (kucuk.includes("rate limit") || kucuk.includes("security purposes") || kucuk.includes("too many requests")) {
    return "Çok fazla deneme yapıldı, lütfen biraz sonra tekrar deneyin.";
  }
  if (kucuk.includes("password should be at least")) {
    return "Şifre en az 6 karakter olmalı.";
  }
  if (kucuk.includes("user not found")) {
    return "Bu e-posta adresi ile kayıtlı hesap bulunamadı.";
  }

  if (/[^\u0000-\u007F]/.test(mesaj)) return mesaj;

  return "Bir hata oluştu, lütfen tekrar deneyin.";
}
