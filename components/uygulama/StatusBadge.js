import { cn } from "cn";
import { Badge } from "@/components/ui/badge";

const MAVI = "border-transparent bg-blue-100 text-blue-800";
const YESIL = "border-transparent bg-green-100 text-green-800";
const GRI = "border-transparent bg-muted text-muted-foreground";
const ROZET = {
  acik: ["Açık", MAVI],
  bekliyor: ["Bekliyor", MAVI],
  toplaniyor: ["Başvuru toplanıyor", MAVI],
  secim: ["Seçim bekliyor", MAVI],
  atandi: ["Atandı", YESIL],
  tamamlandi: ["Tamamlandı", "border-green-600 bg-transparent text-green-700"],
  iptal: ["İptal", GRI],
  geri: ["Geri çekildi", GRI],
  reddedildi: ["Seçilmedim", GRI],
  suresi_doldu: ["Süresi doldu", GRI],
};

export function StatusBadge({ durum, className }) {
  const [yazi, renk] = ROZET[durum] || ROZET.acik;
  return (
    <Badge variant="secondary" className={cn(renk, className)}>
      {yazi}
    </Badge>
  );
}

export function durumAnahtari(gorev, dakika = 5, simdi = 0) {
  const basvuru = gorev?.basvuru_durumu;
  if (basvuru === "geri_cekildi" || basvuru === "geri_cekti") return "geri";
  if (basvuru === "reddedildi") return "reddedildi";
  if (gorev?.durum === "tamamlandi") return "tamamlandi";
  if (gorev?.durum === "iptal") return "iptal";
  if (gorev?.durum === "suresi_doldu") return "suresi_doldu";
  if (gorev?.durum === "atandi" || basvuru === "secildi") return "atandi";
  if (gorev?.durum === "acik" && gorev?.rol === "olusturan") {
    const bitis = new Date(gorev.created_at).getTime() + dakika * 60000;
    if (simdi && bitis > simdi) return "toplaniyor";
    if ((gorev.basvuru_sayisi || 0) > 0) return "secim";
    return "acik";
  }
  if (basvuru === "bekliyor") return "bekliyor";
  return gorev?.durum === "acik" ? "acik" : "acik";
}
