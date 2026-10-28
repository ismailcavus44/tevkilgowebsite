import Link from "next/link";
import { ArrowRight, ChatCircleText, EnvelopeSimple } from "@phosphor-icons/react/ssr";
import { Bolum, BolumBasligi, IkonHalka, kart } from "@/components/Bolum";
import { HomeFooter } from "@/components/HomeFooter";
import { SayfaHero } from "@/components/SayfaHero";

const EPOSTA = "destek@tevkilgo.org";

export const metadata = {
  title: "İletişim",
  description: `TevkilGO destek, hesap ve kişisel veri talepleri için iletişim bilgileri. E-posta ${EPOSTA}`,
  alternates: { canonical: "/iletisim" },
};

const islemler = [
  { href: "/hesap-silme", title: "Hesap silme", text: "Hesabını uygulamadan ya da e-postayla silme adımları." },
  { href: "/kvkk", title: "KVKK Aydınlatma Metni", text: "Kişisel verilerinle ilgili hakların ve başvuru yolları." },
  { href: "/gizlilik", title: "Gizlilik Politikası", text: "Hangi verileri neden işlediğimiz ve ne kadar sakladığımız." },
];

export default function IletisimPage() {
  return (
    <main id="icerik" className="overflow-x-clip">
      <SayfaHero
        ust="İletişim"
        baslik="Sorun, öneri ya da destek talebin için bize yaz."
        metin="Uygulamayla ilgili soruların, hata bildirimlerin ve hesap taleplerin için aşağıdaki kanalları kullanabilirsin."
      />

      <Bolum>
        <BolumBasligi title="Bize ulaş" />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-12">
          <li className={`${kart} flex flex-col p-6`}>
            <IkonHalka icon={EnvelopeSimple} />
            <h3 className="mt-5 text-[16px] font-semibold">E-posta</h3>
            <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">
              Soru, öneri, hata bildirimi ve hesap talepleri için.
            </p>
            <a
              href={`mailto:${EPOSTA}`}
              className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-navy underline-offset-4 hover:underline"
            >
              {EPOSTA}
            </a>
          </li>
          <li className={`${kart} flex flex-col p-6`}>
            <IkonHalka icon={ChatCircleText} />
            <h3 className="mt-5 text-[16px] font-semibold">Uygulama içi destek</h3>
            <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">
              Üyeysen uygulamadaki Destek bölümünden de bize yazabilirsin.
            </p>
            <Link
              href="/giris"
              className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-semibold text-navy underline-offset-4 hover:underline"
            >
              Giriş yap
              <ArrowRight size={15} weight="bold" />
            </Link>
          </li>
        </ul>
      </Bolum>

      <Bolum>
        <BolumBasligi title="Hesap ve kişisel veriler">
          Hesabını silmek ya da kişisel verilerinle ilgili bir talepte bulunmak için önce ilgili sayfaya göz atabilirsin.
        </BolumBasligi>
        <ul className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-12">
          {islemler.map((islem) => (
            <li key={islem.href}>
              <Link
                href={islem.href}
                className={`${kart} group flex h-full items-center justify-between gap-4 p-6 hover:border-navy`}
              >
                <span>
                  <span className="block text-[16px] font-semibold">{islem.title}</span>
                  <span className="mt-1 block text-[14px] leading-relaxed text-muted">{islem.text}</span>
                </span>
                <ArrowRight size={18} weight="bold" className="shrink-0 text-muted group-hover:text-ink" />
              </Link>
            </li>
          ))}
        </ul>
      </Bolum>

      <HomeFooter />
    </main>
  );
}
