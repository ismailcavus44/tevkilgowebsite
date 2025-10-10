export const metadata = {
  title: "İletişim",
  description:
    "TevkilGO ile iletişime geçin. Sorularınız, talepleriniz ve hesap silme işlemleri için bizimle iletişime geçebilirsiniz.",
};

export default function ContactPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid gap-8 sm:gap-12">
      {/* Başlık */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">İletişim</h1>
        <p className="text-sm sm:text-base text-foreground/70 leading-relaxed max-w-2xl mx-auto">
          Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçebilirsiniz.
        </p>
      </div>

      {/* İletişim Kartı */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-black/10 p-6 sm:p-8 bg-white hover:shadow-lg transition-shadow">
          <div className="mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">E-posta</h2>
            <p className="text-sm text-foreground/70 mb-4">
              Tüm sorularınız ve talepleriniz için
            </p>
          </div>
          <a 
            href="mailto:tevkilgo@gmail.com" 
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            tevkilgo@gmail.com
          </a>
        </div>

        <div className="rounded-2xl border border-black/10 p-6 sm:p-8 bg-white hover:shadow-lg transition-shadow">
          <div className="mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Yanıt Süresi</h2>
            <p className="text-sm text-foreground/70">
              E-posta taleplerinize en geç 48 saat içinde yanıt veriyoruz.
            </p>
          </div>
        </div>
      </div>

      {/* Hesap Silme Bölümü */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 sm:p-8 border border-primary/20">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Hesap Silme Talebi</h2>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-4">
              TevkilGO hesabınızı silmek istiyorsanız, aşağıdaki adımları takip ederek talebinizi iletebilirsiniz.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 space-y-4">
          <h3 className="font-semibold mb-3">Hesap Silme Süreci</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                1
              </div>
              <div>
                <p className="text-sm sm:text-base text-foreground/80">
                  <strong>tevkilgo@gmail.com</strong> adresine hesap silme talebinizi gönderin
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                2
              </div>
              <div>
                <p className="text-sm sm:text-base text-foreground/80">
                  E-posta başlığına <strong>&ldquo;Hesap Silme Talebi&rdquo;</strong> yazın
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                3
              </div>
              <div>
                <p className="text-sm sm:text-base text-foreground/80">
                  E-posta içeriğinde <strong>kayıtlı e-posta adresinizi</strong> ve <strong>ad-soyadınızı</strong> belirtin
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                4
              </div>
              <div>
                <p className="text-sm sm:text-base text-foreground/80">
                  Talebiniz en geç <strong>30 gün içinde</strong> işleme alınacak ve hesabınız silinecektir
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-black/10">
            <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed">
              <strong>Not:</strong> Hesabınız silindikten sonra tüm verileriniz kalıcı olarak silinecektir ve bu işlem geri alınamaz. Yasal yükümlülükler kapsamında saklanması gereken veriler (log kayıtları gibi) ilgili mevzuatta belirtilen süreler boyunca saklanmaya devam edecektir.
            </p>
          </div>
        </div>
      </div>

      {/* Hızlı İletişim Butonu */}
      <div className="text-center">
        <a
          href="mailto:tevkilgo@gmail.com"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-white px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold hover:bg-primary/90 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Bizimle İletişime Geçin
        </a>
      </div>
    </section>
  );
}

