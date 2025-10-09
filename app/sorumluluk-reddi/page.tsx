export const metadata = {
  title: "Sorumluluk Reddi Beyanı",
  description:
    "TevkilGO Sorumluluk Reddi Beyanı. Bilgilendirme amaçlı içerik ve yükümlülük sınırları.",
};

export default function DisclaimerPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 grid gap-6">
      <h1 className="text-3xl font-bold">Sorumluluk Reddi Beyanı</h1>
      <p className="text-foreground/80">
        TevkilGO üzerinde yer alan bilgi ve içerikler genel bilgilendirme amaçlıdır.
        Her durum kendine özgüdür ve profesyonel hukuki danışmanlık yerine geçmez.
      </p>
      <h2 className="text-xl font-semibold">Yükümlülük Sınırı</h2>
      <p className="text-foreground/80">
        Doğrudan veya dolaylı oluşabilecek zararlardan TevkilGO sorumlu tutulamaz.
      </p>
      <h2 className="text-xl font-semibold">Harici Bağlantılar</h2>
      <p className="text-foreground/80">
        Üçüncü taraf bağlantılarının içerik ve güvenliğinden sorumluluk kabul edilmez.
      </p>
      <p className="text-sm text-foreground/60">
        Not: Bu sayfa bilgilendirme amacıyla örnek niteliktedir. Nihai metin
        hukuk danışmanınız tarafından onaylanmalıdır.
      </p>
    </section>
  );
}



