import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/[0.06] via-transparent to-secondary/[0.05]" />
        <div className="max-w-6xl mx-auto px-4 pt-16 sm:pt-24 pb-12 sm:pb-16 grid lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-6 flex flex-col gap-4 sm:gap-6">
            <span className="inline-flex w-fit rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">Avukatlar için tevkil platformu</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">Avukatlar Arası Yardımlaşma - TevkilGO</h1>
            <p className="text-foreground/80 text-base sm:text-lg max-w-prose">
              Şehir dışı duruşmalarda ya da kısa süreli vekaletlerde meslektaşına saniyeler içinde ulaşıp
              anlaş. Süreç şeffaf, iletişim senin kontrolünde.
            </p>
            <div className="flex flex-row items-center gap-2 justify-center sm:justify-start">
              <a href="#" aria-label="App Store">
                <img src="/store/ios.svg" alt="App Store" className="w-[140px] sm:w-[180px] h-auto" />
              </a>
              <a href="#" aria-label="Google Play">
                <img src="/store/googlePlayButton.png" alt="Google Play" className="w-[140px] sm:w-[180px] h-auto" />
              </a>
            </div>
          </div>
          <div className="hidden lg:flex lg:col-span-6 items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] aspect-square rounded-2xl ring-1 ring-secondary/10 bg-secondary/5 overflow-hidden">
              <img src="/hero/hero.png" alt="TevkilGO uygulama önizleme" className="h-full w-full object-contain" />
              <div className="pointer-events-none absolute -inset-16 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* TEVKILGO NE SUNAR */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid gap-6">
        <h2 className="text-xl font-semibold pl-3 border-l-4 border-primary">TevkilGO ne sunar?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl ring-1 ring-secondary/10 bg-background p-6">
            <h3 className="font-semibold mb-2">Hızlı ilan</h3>
            <p className="text-foreground/70 leading-relaxed text-sm">İhtiyacını net tarifle, saniyeler içinde paylaş.</p>
            <ul className="mt-3 grid gap-1.5 text-sm text-foreground/70 list-disc pl-5">
              <li>İl/İlçe, adliye ve mahkeme bilgisi</li>
              <li>Tarih-saat, duruşma türü/keşif</li>
              <li>Ücret aralığı ve kısa açıklama</li>
              <li>Opsiyonel: dosya no/esas (gizli kalabilir)</li>
            </ul>
          </div>
          <div className="rounded-2xl ring-1 ring-secondary/10 bg-background p-6">
            <h3 className="font-semibold mb-2">Uygun görevi bul</h3>
            <p className="text-foreground/70 leading-relaxed text-sm">Sana uygun ilanları anında listele ve başvur.</p>
            <ul className="mt-3 grid gap-1.5 text-sm text-foreground/70 list-disc pl-5">
              <li>Şehir, adliye, ücret ve tarih filtreleri</li>
              <li>Tercih edilen bölgeleri kaydet</li>
              <li>Yakın adliyeleri öne çıkar</li>
              <li>Başvuru gönder, mesajlaşmayı başlat</li>
            </ul>
          </div>
          <div className="rounded-2xl ring-1 ring-secondary/10 bg-background p-6">
            <h3 className="font-semibold mb-2">Komisyonsuz süreç</h3>
            <p className="text-foreground/70 leading-relaxed text-sm">İletişim sende, şartlar şeffaf, aracı yok.</p>
            <ul className="mt-3 grid gap-1.5 text-sm text-foreground/70 list-disc pl-5">
              <li>İletişim bilgilerini dilediğin gibi yönet</li>
              <li>Şartlarda taraflar kendi aralarında anlaşır</li>
              <li>Komisyon ve gizli ücret yok</li>
              <li>Platform kolaylaştırıcıdır, karar sizindir</li>
            </ul>
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil-calisir" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-xl font-semibold pl-3 border-l-4 border-primary">Nasıl çalışır?</h2>
        <div className="mt-6 grid lg:grid-cols-12 gap-4 rounded-2xl bg-background overflow-hidden">
          <div className="lg:col-span-12 p-6 sm:p-8 relative">
            <ol className="grid gap-8">
              <li className="grid gap-2 pl-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl font-extrabold text-primary leading-none select-none">01</div>
                  <div className="grid gap-1.5">
                  <h3 className="font-semibold">Giriş yap</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">E‑posta adresinle hızlıca giriş yap.</p>
                    <ul className="grid gap-1 text-sm text-foreground/70 list-disc pl-5">
                      <li>Tek seferlik doğrulama</li>
                      <li>Hızlı oturum</li>
                    </ul>
                  </div>
                </div>
              </li>
              <li className="grid gap-2 pl-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl font-extrabold text-primary leading-none select-none">02</div>
                  <div className="grid gap-1.5">
                  <h3 className="font-semibold">Profilini ayarla</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">Şehir, adliye ve kategori tercihlerini seç.</p>
                    <ul className="grid gap-1 text-sm text-foreground/70 list-disc pl-5">
                      <li>Şehir seçimi</li>
                      <li>Adliye/ilçe tercihleri</li>
                      <li>Kategori alanları</li>
                    </ul>
                  </div>
                </div>
          </li>
              <li className="grid gap-2 pl-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl font-extrabold text-primary leading-none select-none">03</div>
                  <div className="grid gap-1.5">
                    <h3 className="font-semibold">İlan aç veya başvur</h3>
                    <p className="text-sm text-foreground/70 leading-relaxed">Uygun görevlere başvur, iletişimi başlat.</p>
                    <ul className="grid gap-1 text-sm text-foreground/70 list-disc pl-5">
                      <li>Şehre/mahkemeye göre filtrele</li>
                      <li>Şartları şeffafça konuş</li>
                    </ul>
                  </div>
                </div>
          </li>
        </ol>
          </div>
          <div className="hidden lg:block lg:col-span-6 p-4 sm:p-6">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden lg:sticky lg:top-24">
              {/* Görsel alanı: /public/howto/ikinci.png */}
              <img src="/howto/ikinci.png" alt="Nasıl çalışır görseli" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* SSS */}
      <section id="sss" className="max-w-6xl mx-auto px-4 pb-20 grid gap-6">
        <h2 className="text-xl font-semibold pl-3 border-l-4 border-primary">Sıkça Sorulan Sorular</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-black/10 p-5">
            <h3 className="font-semibold mb-1">Tevkil oluşturmak ücretli mi?</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">Tevkil oluşturmak ücretsizdir; ancak güncel tarifenin altında ilan oluşturulamaz.</p>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <h3 className="font-semibold mb-1">Nasıl giriş yaparım?</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">E‑posta adresinizle giriş yapabilirsiniz.</p>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <h3 className="font-semibold mb-1">Profilde neleri ayarlarım?</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">Şehir, adliye ve kategori tercihlerinizi belirleyebilirsiniz.</p>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <h3 className="font-semibold mb-1">Komisyon var mı?</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">Komisyon veya gizli ücret yoktur; süreç taraflar arasındadır.</p>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <h3 className="font-semibold mb-1">İlanlara nasıl başvururum?</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">Filtrelerle uygun ilanları bulun ve başvuru gönderin.</p>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <h3 className="font-semibold mb-1">İletişim bilgileri nasıl paylaşılır?</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">Bilgilerinizi dilediğiniz gibi yönetebilir, gerektiğinde paylaşabilirsiniz.</p>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <h3 className="font-semibold mb-1">Uygulama ne zaman yayınlanır?</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">Çok yakında; duyuruları blog üzerinden takip edebilirsiniz.</p>
          </div>
          <div className="rounded-xl border border-black/10 p-5">
            <h3 className="font-semibold mb-1">Destek ile nasıl iletişime geçerim?</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">İletişim sayfasından bize e‑posta gönderebilirsiniz.</p>
          </div>
        </div>
      </section>

      {/* ILETISIM (SSS altı, belirgin bar) */}
      <section id="iletisim" className="max-w-6xl mx-auto px-4 pb-20">
        <div className="rounded-xl bg-primary text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-base font-medium">Sorularınız için bizimle iletişime geçin.</div>
          <a className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold bg-white text-primary hover:bg-white/90" href="mailto:tevkilgo@gmail.com">Bizimle iletişime geçin</a>
    </div>
      </section>
    </>
  );
}
