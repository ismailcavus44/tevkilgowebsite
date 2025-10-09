export const metadata = {
  title: "Biz Kimiz?",
};

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/[0.06] via-transparent to-secondary/[0.05]" />
        <div className="max-w-6xl mx-auto px-4 pt-16 sm:pt-24 pb-12 sm:pb-16 grid gap-4">
          <span className="inline-flex w-fit rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">Hakkımızda</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">TevkilGO&apos;yu oluşturan fikir</h1>
          <p className="text-foreground/80 text-base sm:text-lg max-w-prose">
            Avukatlar arasında hızlı ve adil işbirliği oluşturma ihtiyacından doğduk. Amacımız,
            duruşma/keşif gibi kısa süreli vekalet işlerini güvenli ve şeffaf bir yapıda kolaylaştırmak.
          </p>
        </div>
      </section>

      {/* HİKAYE + GÖRSEL */}
      <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12 grid gap-8">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-6 grid gap-4">
            <h2 className="text-lg sm:text-xl font-semibold pl-3 border-l-4 border-primary">Hikayemiz</h2>
            <p className="text-foreground/80 text-sm sm:text-base leading-relaxed max-w-prose">
              TevkilGO, meslek hayatında sıkça karşılaşılan &ldquo;şu duruşmaya kim gidebilir?&rdquo; sorusuna pratik ve
              güvenilir bir yanıt üretmek üzere tasarlandı. Özellikle farklı şehirlerdeki duruşma ve keşiflerde,
              doğru meslektaşa ulaşmak çoğu zaman zaman alıcı ve belirsiz bir süreç olabiliyor. TevkilGO&apos;da şehir,
              adliye ve kategori tercihlerinizi belirleyerek, ihtiyacınıza uygun ilanları hızlıca görüntüleyebilir
              veya doğrudan ilan açabilirsiniz. Amaç; aradığınız desteği birkaç adımda bulmanızı sağlamak, hem
              planlama süresini hem de iletişim yükünü azaltmaktır.
            </p>
            <p className="text-foreground/80 text-sm sm:text-base leading-relaxed max-w-prose">
              Komisyon ya da aracı olmadan, tamamen kullanıcıların kontrol ettiği basit bir iletişim modeli
              benimsiyoruz. Koşullar taraflar arasında şeffaf biçimde konuşulur; süreç, zamanlamadan ücrete kadar
              her aşamada karşılıklı mutabakata dayanır. Şeffaflık ve mesleki dayanışma, ürün kararlarımızın
              temelini oluşturur. Bu yaklaşım, ihtiyaç duyduğunuz anda doğru kişiye ulaşmanızı kolaylaştırırken,
              gereksiz adımları ortadan kaldırmayı ve deneyimi yalın tutmayı hedefler.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/about/hakkimizda.png" alt="Hakkımızda görseli" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>


    </>
  );
}


