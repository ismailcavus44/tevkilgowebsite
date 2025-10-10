export const metadata = {
  title: "KVKK Aydınlatma Metni ve Gizlilik Politikası",
  description:
    "TevkilGO KVKK aydınlatma metni ve gizlilik politikası. Kişisel verilerin korunması ve işlenmesi hakkında detaylı bilgiler.",
};

export default function KvkkPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid gap-6 sm:gap-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">KVKK Aydınlatma Metni ve Gizlilik Politikası</h1>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) m.10 ve ilgili mevzuat gereği, TevkilGO platformu olarak kullanıcılarımızı kişisel verilerin işlenmesi hakkında bilgilendirmek amacıyla bu Aydınlatma Metni ve Gizlilik Politikası hazırlanmıştır. Bu metin kapsamında, veri sorumlusunun kimliği ve iletişim bilgileri, işlenen kişisel veri kategorileri, verilerin işlenme amaçları, toplanma yöntemi ve hukuki dayanakları, kişisel verilerin aktarılabileceği taraflar, verilerin saklama süreleri ile kullanıcıların KVKK m.11 kapsamındaki hakları detaylı şekilde açıklanmaktadır.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Veri Sorumlusunun Kimliği ve İletişim Bilgileri</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          TevkilGO uygulaması (tevkilgo.app) kapsamında toplanan kişisel veriler bakımından Veri Sorumlusu, TevkilGO platformunu işleten yetkilidir. İlgili kişiler, KVKK kapsamında taleplerini iletmek için <strong>tevkilgo@gmail.com</strong> e-posta adresi üzerinden veri sorumlusuyla iletişime geçebilirler. (Gelecekte TevkilGO adına farklı bir tüzel kişi veya temsilci atanırsa, bu bölüm güncellenecektir.)
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">İşlenen Kişisel Veriler</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          TevkilGO&apos;ya üye olan veya platformu kullanan kullanıcılarımıza ait işlenebilen kişisel veriler şunlardır:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 grid gap-2 text-sm sm:text-base text-foreground/80">
          <li><strong>Kimlik Bilgileri:</strong> Ad ve soyad. (Profilinizde ad ve soyadınız diğer kullanıcılara gösterilir; ancak dilerseniz profil ayarlarından bu bilgileri gizleyebilirsiniz.)</li>
          <li><strong>İletişim Bilgileri:</strong> Telefon numarası ve e-posta adresi. (Telefon numaranız diğer kullanıcılara profilinizde gösterilir; isterseniz gizlenebilir. E-posta adresiniz diğer kullanıcılara gösterilmez, sadece sistem tarafından iletişim amacıyla ve hesap doğrulaması için kullanılır.)</li>
          <li><strong>Profil Görseli:</strong> Kullanıcının kendi yüklediği profil fotoğrafı veya görsel. (Opsiyoneldir; yüklenmesi halinde diğer kullanıcılar tarafından görülebilir. Yüklenmezse profilinizde herhangi bir görsel bulunmaz.)</li>
          <li><strong>İlan Bilgileri:</strong> Platformda paylaştığınız ilan içerikleri ve bu ilanlarda yer alan bilgiler. (Örneğin, hizmet talebi ilanlarında belirttiğiniz adliye/court bilgileri, tarih, ücret teklifi gibi içerikler. Bu bilgiler, ilanınızı görüntüleyen tüm üyelere açıktır; kişisel verilerinizden sayılabilecek kısımlarını (örn. isminizi/telefonunuzu) gizlemeyi tercih edebilirsiniz.)</li>
          <li><strong>Log ve Teknik Veriler:</strong> Platformu kullanırken otomatik olarak toplanabilen IP adresi, cihaz bilgisi, tarayıcı türü, erişim tarih-saat verileri gibi teknik veriler. (Bu tür veriler, güvenlik ve sistemi iyileştirme amaçlarıyla toplanabilir.)</li>
        </ul>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          <strong>Özel nitelikli kişisel veriler:</strong> TevkilGO, üyelerinden özel nitelikli kişisel veri (örn. din, siyasi görüş, sağlık bilgisi gibi hassas veriler) talep etmez ve bunları işlemeyi amaçlamaz. Kullanıcılar profilinde veya ilanlarında böyle hassas bilgileri paylaşmamaları konusunda uyarılır.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Kişisel Verilerin İşlenme Amaçları</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          TevkilGO, topladığı kişisel verileri aşağıdaki amaçlar kapsamında işlemektedir:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 grid gap-2 text-sm sm:text-base text-foreground/80">
          <li><strong>Hizmetin Sağlanması:</strong> Platformun temel işlevlerini yerine getirmek ve kullanıcı deneyimini sağlamak için verileriniz kullanılır. Örneğin, üyelik hesabınızın oluşturulması, profil bilgilerinizin gösterilmesi, ilan yayımlayabilmeniz ve diğer kullanıcılarla iletişime geçebilmeniz için gerekli veriler işlenir.</li>
          <li><strong>Avukatlar Arası İletişim:</strong> Platform, avukatların birbirleriyle iletişim kurmasını ve yardımlaşmasını amaçlar. Bu kapsamda, diğer kullanıcılara adınız ve telefon numaranızın görünmesi, talep ettiğiniz takdirde profil fotoğrafınızın gösterilmesi ile meslektaşlarınızın size ulaşabilmesi sağlanır. (Kullanıcı profil ayarlarından bu bilgilerin görünürlüğünü yönetebilir.)</li>
          <li><strong>İlan Paylaşımı ve Eşleştirme:</strong> Hizmet talebi ilanlarının oluşturulması, görüntülenmesi ve bunlara yanıt verilmesi süreçlerinde verileriniz kullanılır.</li>
          <li><strong>İdari İletişim ve Bildirimler:</strong> Hesabınızla ilgili önemli bilgilendirmelerin yapılması (örneğin, kayıt doğrulama, şifre sıfırlama, politika değişikliği bildirimleri) veya platformla ilgili duyuruların iletilmesi için iletişim bilgileriniz kullanılabilir.</li>
          <li><strong>Güvenlik ve Kötüye Kullanımın Önlenmesi:</strong> Platformun güvenli bir şekilde işlemesi ve kötüye kullanımın engellenmesi amacıyla veriler işlenir.</li>
          <li><strong>Hizmet Kalitesinin Artırılması:</strong> Platform kullanımına dair istatistiklerin tutulması, kullanıcı geri bildirimlerinin değerlendirilmesi ve yeni özelliklerin geliştirilmesi amacıyla verileriniz anonim veya toplu şekilde analiz edilebilir.</li>
          <li><strong>Yasal Yükümlülüklerin Yerine Getirilmesi:</strong> İlgili mevzuat gereği doğan yükümlülüklere uymak için de kişisel verileriniz işlenebilir.</li>
        </ul>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Kişisel verileriniz, TevkilGO tarafından doğrudan sizlerden çevrimiçi ortamda toplanmaktadır. Platforma üye olurken doldurduğunuz kayıt formları, profilinize girdiğiniz bilgiler ve platform üzerindeki işlemleriniz (ilan oluşturma, profil güncelleme vb.) vasıtasıyla veriler temin edilir.
        </p>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          TevkilGO, KVKK m.5 ve m.6&apos;da öngörülen hukuki sebeplere uygun olarak kişisel verileri işlemektedir:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 grid gap-2 text-sm sm:text-base text-foreground/80">
          <li><strong>Sözleşmenin Kurulması ve İfası:</strong> KVKK 5/2 (c) uyarınca bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olma hukuki sebebine dayanılarak verileriniz işlenmektedir.</li>
          <li><strong>Meşru Menfaat:</strong> KVKK 5/2 (f) kapsamında veri sorumlusunun meşru menfaati hukuki sebebine dayanmaktadır.</li>
          <li><strong>Açık Rıza:</strong> Yukarıdaki hukuki sebeplerin dışında kalan veya KVKK kapsamında yurt dışına veri aktarımı gibi açık rıza gerektiren hallerde, kullanıcıların açık rızasına başvurulacaktır.</li>
        </ul>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Kişisel Verilerin Aktarılması</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          TevkilGO, kural olarak kullanıcılarına ait kişisel verileri üçüncü kişilere satmaz, kiralamaz veya izinsiz olarak aktarmaz. Ancak, aşağıdaki durumlarda sınırlı veri aktarımları söz konusu olabilmektedir:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 grid gap-2 text-sm sm:text-base text-foreground/80">
          <li><strong>Diğer Kullanıcılara Açık Veriler:</strong> Platformun doğası gereği, profilinizde adınız, soyadınız, telefon numaranız ve profil fotoğrafınız (varsa) gibi bilgiler diğer üyelere görünür şekilde sunulur.</li>
          <li><strong>Hizmet Aldığımız Üçüncü Taraflar:</strong> TevkilGO, teknik altyapısını sağlamak için üçüncü taraf hizmet sağlayıcılarını kullanabilir. Örneğin, kullanıcı verileri Supabase adlı bulut veritabanı hizmetinde saklanmaktadır.</li>
          <li><strong>Yasal Yükümlülükler Kapsamında Aktarım:</strong> Kanunlardan doğan yükümlülüklerimizi yerine getirmek amacıyla, gerekli olduğu takdirde kişisel verileriniz ilgili resmi kurum ve kuruluşlarla paylaşılabilir.</li>
          <li><strong>İş Transferi ve Şirket Değişiklikleri:</strong> TevkilGO uygulamasının yönetiminde bir değişiklik olması halinde, kullanıcı verileri yeni yönetici/şirkete aktarılabilir.</li>
        </ul>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Kişisel Verilerin Saklanma Süresi</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          TevkilGO, kişisel verilerinizi, işleme amaçlarının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen yasal saklama süreleri çerçevesinde muhafaza eder:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 grid gap-2 text-sm sm:text-base text-foreground/80">
          <li><strong>Üyelik Bilgileri:</strong> Platformda aktif olarak üyeliğiniz devam ettiği sürece saklanır.</li>
          <li><strong>İlan ve İçerik Verileri:</strong> İlanınızı silmediğiniz veya düzenlemediğiniz sürece sistemde tutulur.</li>
          <li><strong>Log Kayıtları:</strong> Yürürlükteki mevzuata uygun olarak gereken süre kadar saklanır.</li>
          <li><strong>Yedeklemeler:</strong> Olası veri kayıplarının önlenmesi amacıyla periyodik veri yedeklemeleri alınmaktadır.</li>
        </ul>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Kişisel Verilerin Güvenliği</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          TevkilGO, kullanıcılarının kişisel verilerinin gizliliğini ve bütünlüğünü korumak adına gereken teknik ve idari tedbirleri almaktadır. Verileriniz, güvenli sunucularda ve yetkisiz erişimlere karşı korumalı ortamlarda saklanmaktadır. Supabase veritabanı altyapısı, verilerin şifrelenmesi ve sürekli yedeklenmesi gibi modern güvenlik önlemleriyle donatılmıştır.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Çocukların Gizliliği</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          TevkilGO, avukatlar arasındaki profesyonel etkileşime yönelik bir platform olmakla birlikte, üyelik sırasında herhangi bir yaş sınırlaması uygulamamaktadır. Platform, doğrudan çocukları hedefleyen bir hizmet değildir ve 18 yaşın altındaki kullanıcıların kişisel verilerini bilerek işlemeyi amaçlamaz.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">İlgili Kişinin KVKK Kapsamındaki Hakları</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          KVKK&apos;nın 11. maddesi uyarınca, kişisel verisi işlenen herkes (ilgili kişi) veri sorumlusuna başvurarak aşağıdaki haklara sahiptir:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 grid gap-2 text-sm sm:text-base text-foreground/80">
          <li>Kişisel verilerinin işlenip işlenmediğini öğrenme,</li>
          <li>Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,</li>
          <li>Kişisel verilerinin işlenme amacını ve verilerin amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Kişisel verilerinin yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
          <li>Kişisel verilerinin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
          <li>İşlenmesini gerektiren sebeplerin ortadan kalkması hâlinde kişisel verilerinin silinmesini veya yok edilmesini isteme,</li>
          <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendi aleyhine bir sonucun ortaya çıkmasına itiraz etme,</li>
          <li>Kişisel verilerinin kanuna aykırı işlenmesi sebebiyle zarara uğraması hâlinde uğradığı zararın giderilmesini talep etme.</li>
        </ul>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Yukarıdaki haklarınızı kullanmak istediğinizde, talebinizi <strong>tevkilgo@gmail.com</strong> adresine, konu kısmına &ldquo;KVKK Veri Talebi&rdquo; yazarak e-posta ile iletebilirsiniz. KVKK uyarınca, veri sorumlusuna yöneltilen talepler en geç 30 gün içinde ücretsiz olarak sonuçlandırılacaktır.
        </p>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Veri sorumlusunun cevabını yetersiz bulmanız veya 30 gün içinde cevap alamamanız hâlinde, KVKK m.14 uyarınca, Kişisel Verileri Koruma Kurulu&apos;na şikâyette bulunma hakkınız bulunmaktadır.
        </p>
      </div>
    </section>
  );
}




