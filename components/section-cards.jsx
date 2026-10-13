import Link from "next/link"

export function SectionCards({ yukleniyor, bugun, secim, bekleyen, puan }) {
  const kartlar = [
    { href: "/app/gorevlerim?gun=bugun", baslik: "Bugünkü görevler", deger: bugun },
    { href: "/app/gorevlerim?sekme=secim", baslik: "Seçim bekleyen", deger: secim },
    { href: "/app/basvurularim?sekme=bekliyor", baslik: "Bekleyen başvuru", deger: bekleyen },
    {
      href: "/app/profil",
      baslik: "Puan",
      deger: puan != null ? Number(puan).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "—",
    },
  ]

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-none">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {kartlar.map((kart, index) => (
          <Link
            key={kart.href}
            href={kart.href}
            className={`cursor-pointer p-4 transition-colors hover:bg-muted/50 ${index % 2 === 0 ? "border-r border-border" : ""} ${index < 2 ? "border-b border-border lg:border-b-0" : ""} ${index < kartlar.length - 1 ? "lg:border-r lg:border-border" : ""}`}
          >
            <p className="text-xs text-muted-foreground">{kart.baslik}</p>
            <p className="text-2xl font-semibold tabular-nums">{yukleniyor ? "—" : kart.deger}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
