export const metadata = {
  title: "Gizlilik Sözleşmesi",
  description:
    "TevkilGO Gizlilik Sözleşmesi. Kişisel verilerin işlenmesi, korunması ve gizlilik esasları.",
};

export default function PrivacyPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid gap-6 sm:gap-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">TevkilGO Gizlilik Sözleşmesi</h1>
        <div className="text-sm sm:text-base text-foreground/80 leading-relaxed space-y-1">
          <p><strong>Yürürlük Tarihi:</strong> 10/10/2025</p>
          <p><strong>Web Sitesi / Uygulama Adresi:</strong> https://tevkilgo.org</p>
          <p><strong>İletişim:</strong> tevkilgo@gmail.com</p>
        </div>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Taraflar</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Bu Gizlilik Sözleşmesi (&ldquo;Sözleşme&rdquo;), bir tarafta &ldquo;TevkilGO&rdquo; (&ldquo;Platform&rdquo;, &ldquo;Biz&rdquo;) ile; diğer tarafta Platform&apos;u kullanan veya üyelik oluşturan kişi (&ldquo;Kullanıcı&rdquo;) arasında, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) ve ilgili mevzuat kapsamında yapılmıştır. Kullanıcı, platformu kullanarak bu Sözleşme&apos;yi okuduğunu, anladığını ve kabul ettiğini beyan eder.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Sözleşmenin Konusu</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Bu Sözleşme; TevkilGO&apos;nun https://tevkilgo.org adresinde sunduğu hizmetlerin kullanımı sırasında toplanan kişisel verilerin işlenmesi, korunması, saklanması, aktarılması ve gizlilik esaslarını düzenler. Platformun tüm kullanıcıları bu sözleşmeyi elektronik ortamda kabul eder.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Toplanan Kişisel Veriler</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Ad, soyad, e-posta adresi, telefon numarası, profil görseli (isteğe bağlı), ilan içerikleri, cihaz bilgisi, IP adresi, erişim zamanı ve işlem kayıtları. Bu veriler, üyelik oluşturma, sistem güvenliği, ilan paylaşımı ve iletişim amaçlarıyla işlenir.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Kişisel Verilerin İşlenme Amaçları</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Veriler; üyelik işlemleri, kullanıcı profili yönetimi, ilan paylaşımı, sistem bildirimleri, güvenlik ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir. Kullanıcının ad-soyad ve telefon bilgileri varsayılan olarak gizlidir; kullanıcı isterse görünür hale getirebilir.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Verilerin Aktarımı</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          TevkilGO, kullanıcı verilerini yalnızca hizmetin sağlanması için gerekli teknik sağlayıcılarla paylaşır. Veriler Supabase altyapısında (Avrupa/Almanya) saklanır. Yasal zorunluluk halinde, mahkemeler veya yetkili mercilere aktarılabilir. Açık rıza olmaksızın üçüncü taraflara pazarlama amaçlı aktarım yapılmaz.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Saklama Süreleri</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Üyelik süresince saklanan veriler, üyelik sona erdiğinde en geç 180 gün içinde silinir veya anonim hale getirilir. Yasal zorunluluk gereği log kayıtları 2 yıl, mali kayıtlar 10 yıl süreyle saklanır.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Güvenlik Önlemleri</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Veriler SSL/TLS ile şifrelenmiş olarak iletilir ve Supabase güvenlik standartlarına uygun şekilde saklanır. Yetkisiz erişimler, siber saldırılar ve veri ihlallerine karşı gerekli teknik ve idari tedbirler alınmaktadır. Kullanıcı, hesabının güvenliğinden ve şifre gizliliğinden sorumludur.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Kullanıcının Hakları</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Kullanıcı KVKK m.11 kapsamında; verilerinin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme, üçüncü kişilere aktarımı öğrenme, itiraz etme ve zarar halinde tazmin talep etme haklarına sahiptir. Tüm talepler <strong>tevkilgo@gmail.com</strong> adresine yazılı olarak yapılır ve 30 gün içinde yanıtlanır.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Sorumluluk Reddi</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          TevkilGO, kullanıcılar arasında doğan anlaşmazlıklardan, ilan içeriklerinden, dolandırıcılık veya mesleki hatalardan sorumlu değildir. Platformda herhangi bir ödeme sistemi bulunmamaktadır; kullanıcılar arasındaki mali işlemlerden TevkilGO sorumlu tutulamaz. Platform sadece iletişim ve ilan paylaşım aracıdır.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Değişiklikler</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          TevkilGO, işbu Sözleşme&apos;yi mevzuat veya teknik nedenlerle güncelleyebilir. Güncel metin https://tevkilgo.org adresinde yayımlandığı tarihte yürürlüğe girer. Kullanıcının platformu kullanmaya devam etmesi, değişiklikleri kabul ettiği anlamına gelir.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Uygulanacak Hukuk ve Yetki</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Bu sözleşme Türk Hukuku&apos;na tabidir. Taraflar arasındaki uyuşmazlıklarda Ankara Mahkemeleri ve İcra Daireleri yetkilidir.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Kullanıcı Beyanı</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Kullanıcı, TevkilGO&apos;ya üye olarak KVKK Aydınlatma Metni&apos;ni, Gizlilik Politikası&apos;nı ve bu Gizlilik Sözleşmesi&apos;ni okuduğunu, anladığını ve tüm hükümlerini kabul ettiğini beyan eder.
        </p>
      </div>
    </section>
  );
}




