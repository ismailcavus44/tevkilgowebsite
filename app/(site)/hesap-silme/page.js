import Link from "next/link";
import { ReadingLayout } from "@/components/LegalArticle";

const toc = [
  { id: "uygulama-icinden", text: "Uygulama içinden", level: 2 },
  { id: "uygulamayi-yuklemeden", text: "Uygulamayı yüklemeden", level: 2 },
  { id: "silinen-veriler", text: "Silinen veriler", level: 2 },
  { id: "anonimlestirilerek-saklanan-veriler", text: "Anonimleştirilerek saklanan veriler", level: 2 },
  { id: "mevzuat-geregi-saklanan-veriler", text: "Mevzuat gereği saklanan veriler", level: 2 },
];

const linkClass = "font-medium text-navy underline decoration-line underline-offset-2";
const h2Class = "pt-4 text-xl font-bold";

export const metadata = { title: "Hesap Silme" };

export default function HesapSilmePage() {
  return (
    <ReadingLayout title="Hesap silme" toc={toc}>
      <p>
        TevkilGO hesabını istediğin zaman silebilirsin. Uygulama telefonunda yüklü değilse de silme
        talebinde bulunabilirsin. Bu sayfa,{" "}
        <Link href="/gizlilik#hesabinizi-ve-verilerinizi-silme" className={linkClass}>
          Gizlilik Politikası&apos;nın 7. bölümünü
        </Link>{" "}
        özetler.
      </p>

      <h2 id="uygulama-icinden" className={h2Class}>
        Uygulama içinden
      </h2>
      <p>Profil → Hesabı sil adımlarını izleyerek hesabını hemen silebilirsin.</p>

      <h2 id="uygulamayi-yuklemeden" className={h2Class}>
        Uygulamayı yüklemeden
      </h2>
      <p>
        Kayıtlı e-posta adresinden{" "}
        <a href="mailto:destek@tevkilgo.org?subject=Hesap%20silme%20talebi" className={linkClass}>
          destek@tevkilgo.org
        </a>{" "}
        adresine, konusu &quot;Hesap silme talebi&quot; olan bir e-posta gönder. Talebin hesabın sahibinden
        geldiğini doğrulayabilmemiz için e-postanın kayıtlı adresinden gelmesi gerekir. Talebin en geç 30 gün
        içinde sonuçlandırılır.
      </p>

      <h2 id="silinen-veriler" className={h2Class}>
        Silinen veriler
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Ad, soyad, e-posta ve telefon</li>
        <li>Baro ve sicil bilgileri</li>
        <li>Profil fotoğrafı ve kimlik kartı görseli</li>
        <li>Mod tercihleri ve bildirim anahtarları</li>
      </ul>

      <h2 id="anonimlestirilerek-saklanan-veriler" className={h2Class}>
        Anonimleştirilerek saklanan veriler
      </h2>
      <p>
        Tamamlanmış görevler, verilen puanlar ve şikayet kayıtları, diğer kullanıcıların puan geçmişinin
        bozulmaması ve olası uyuşmazlıklarda ispat amacıyla, seninle ilişkilendirilemeyecek şekilde
        anonimleştirilerek saklanabilir.
      </p>

      <h2 id="mevzuat-geregi-saklanan-veriler" className={h2Class}>
        Mevzuat gereği saklanan veriler
      </h2>
      <p>
        Kanunen saklanması zorunlu kayıtlar, ilgili süre dolana kadar erişimi kısıtlanarak saklanır ve süre
        sonunda silinir. Saklama sürelerinin tamamı için{" "}
        <Link href="/gizlilik#saklama-sureleri" className={linkClass}>
          Saklama süreleri
        </Link>{" "}
        bölümüne bakabilirsin.
      </p>
    </ReadingLayout>
  );
}
