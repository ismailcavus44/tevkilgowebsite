export const metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "TevkilGO KVKK aydınlatma metni. Kişisel verilerin korunması ve işlenmesi hakkında bilgiler.",
};

export default function KvkkPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 grid gap-6">
      <h1 className="text-3xl font-bold">KVKK Aydınlatma Metni</h1>
      <p className="text-foreground/80">
        Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında,
        TevkilGO tarafından işlenen kişisel verilere ilişkin usul ve esasları
        bilgilendirmek amacıyla hazırlanmıştır.
      </p>
      <h2 className="text-xl font-semibold">Veri Sorumlusu</h2>
      <p className="text-foreground/80">
        Veri sorumlusu TevkilGO olup, iletişim talepleriniz için iletisim@tevkilgo.com
        adresi üzerinden bizimle iletişime geçebilirsiniz.
      </p>
      <h2 className="text-xl font-semibold">Toplanan Veriler ve Amaç</h2>
      <p className="text-foreground/80">
        Kimlik, iletişim, kullanım ve cihaz verileri; platformun sunulması,
        güvenliğin sağlanması ve istatistiksel analiz amaçlarıyla sınırlı
        olarak işlenebilir.
      </p>
      <h2 className="text-xl font-semibold">Haklarınız</h2>
      <p className="text-foreground/80">
        KVKK m.11 kapsamındaki haklarınızı kullanmak için bizimle
        iletişime geçebilirsiniz.
      </p>
      <p className="text-sm text-foreground/60">
        Not: Bu sayfa bilgilendirme amacıyla örnek niteliktedir. Nihai metin
        hukuk danışmanınız tarafından onaylanmalıdır.
      </p>
    </section>
  );
}



