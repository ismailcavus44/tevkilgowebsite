export const metadata = {
  title: "Gizlilik Politikası",
  description:
    "TevkilGO Gizlilik Politikası. Kullanıcı verilerinin gizliliği ve güvenliği ilkeleri.",
};

export default function PrivacyPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 grid gap-6">
      <h1 className="text-3xl font-bold">Gizlilik Politikası</h1>
      <p className="text-foreground/80">
        TevkilGO olarak gizliliğinize önem veriyoruz. Bu politika, hangi verileri
        hangi amaçlarla işlediğimizi ve bu verileri nasıl koruduğumuzu açıklar.
      </p>
      <h2 className="text-xl font-semibold">Toplanan Veriler</h2>
      <p className="text-foreground/80">
        Ziyaret verileri, çerezler ve uygulama kullanım bilgileri; hizmet kalitesini
        artırmak ve güvenliği sağlamak için kullanılabilir.
      </p>
      <h2 className="text-xl font-semibold">Çerezler</h2>
      <p className="text-foreground/80">
        Çerez tercihlerinizi tarayıcı ayarlarınızdan yönetebilirsiniz. Zorunlu
        çerezler hizmetin çalışması için gereklidir.
      </p>
      <h2 className="text-xl font-semibold">İletişim</h2>
      <p className="text-foreground/80">
        Gizlilikle ilgili talepleriniz için iletisim@tevkilgo.com adresi üzerinden
        bize ulaşabilirsiniz.
      </p>
      <p className="text-sm text-foreground/60">
        Not: Bu sayfa bilgilendirme amacıyla örnek niteliktedir. Nihai metin
        hukuk danışmanınız tarafından onaylanmalıdır.
      </p>
    </section>
  );
}



