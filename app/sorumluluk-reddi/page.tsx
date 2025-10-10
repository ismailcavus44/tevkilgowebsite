export const metadata = {
  title: "Sorumluluk Reddi Beyanı",
  description:
    "TevkilGO Sorumluluk Reddi Beyanı. Platform hizmetinin kullanım şartları ve sınırları hakkında bilgiler.",
};

export default function DisclaimerPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 grid gap-6 sm:gap-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">TevkilGO Sorumluluk Reddi Beyanı</h1>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          TevkilGO Sorumluluk Reddi Beyanı, platform hizmetimizin kullanım şartlarını ve bu hizmetin sınırlarını kullanıcılarımıza bildirmek amacıyla hazırlanmıştır. TevkilGO&apos;yu kullanan herkes, aşağıdaki beyanları okumuş ve kabul etmiş sayılır. Bu beyan, platformumuzun rolü, sunduğu kolaylaştırıcı hizmetin kapsamı ve kullanıcıların sorumlulukları hakkında önemli hükümler içermektedir.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Platformun Amacı ve Rolü</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          TevkilGO, avukatlar arasında mesleki dayanışma ve iş birliğini kolaylaştırmak amacıyla kurulmuş bir ilan ve iletişim platformudur. Platform üzerinden kullanıcılar, örneğin bir duruşmaya vekil arama gibi ilanlar paylaşabilir ve bu ilanlar aracılığıyla diğer avukatlarla iletişime geçebilirler. TevkilGO, kullanıcılar arasında bir köprü vazifesi görür ve tarafların birbirlerini bulmalarını sağlar. Platformun rolü, yalnızca kolaylaştırıcı bir dijital ortam sağlamaktır; TevkilGO, kullanıcılar arasında gerçekleşen anlaşmaların veya hizmet ifalarının bir tarafı değildir.
        </p>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Önemle belirtilmelidir ki, TevkilGO üzerinde doğrudan bir avukatlık hizmeti verilmez, hukuki danışmanlık faaliyeti yürütülmez. Platform, herhangi bir kullanıcının belli bir işi yapacağını taahhüt etmez veya sonuç konusunda garanti vermez. TevkilGO, bir kullanıcının açtığı ilana yanıt veren diğer kullanıcının o işi fiilen yapacağına dair herhangi bir beyanda bulunmaz; platform sadece iletişim zemini sunar.
        </p>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Kullanıcılar Arasındaki İlişkiler ve Sorumluluk</h2>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          TevkilGO, kullanıcılar arasındaki etkileşim ve anlaşmaların sorumluluğunu üstlenmez. Platformda yapılan tüm ilan paylaşımları, teklifler ve bunlara dayalı olarak gerçekleşen işler kullanıcıların kendi rizikoları ve sorumluluğu altındadır. Bu kapsamda, kullanıcılar platformu kullanırken aşağıdaki koşulları kabul eder:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 grid gap-3 text-sm sm:text-base text-foreground/80">
          <li>
            <strong>Kullanıcılar Arasındaki Anlaşmalar:</strong> Bir kullanıcının platformda yayınladığı ilana bir başka kullanıcının talip olmasıyla kurulan ilişki, tamamen ilgili kullanıcılar arasında bir anlaşma niteliğindedir. TevkilGO, bu anlaşmanın kurulmasında sadece aracı görevi görür; anlaşmanın ifasından veya ifa edilmemesinden kaynaklanabilecek hiçbir sorumluluğu üstlenmez. Taraflar arasındaki işin şartları (ücret, süre, işin kapsamı vb.) tamamen kullanıcılarca belirlenir ve bu konuda TevkilGO&apos;nun herhangi bir taahhüdü veya garantisi yoktur.
          </li>
          <li>
            <strong>Mesleki Yetkinlik ve Kimlik Doğrulama:</strong> Platform, avukatların kullanımına yönelik tasarlanmıştır ancak TevkilGO, kullanıcılarının gerçekten avukat olup olmadığını kayıt esnasında aktif olarak doğrulamamaktadır. Her kullanıcı, platforma üye olurken verdiği bilgilerin doğruluğundan sorumludur. Bir başka deyişle, platformda iletişim kurduğunuz kişinin avukat olması veya verdiği diğer bilgilerin gerçeği yansıtması tamamen ilgili kullanıcının beyanına dayanır. TevkilGO, kullanıcı beyanlarının doğruluğunu garanti etmez. Bu nedenle, kullanıcılar iletişime geçtikleri kişilerin mesleki statülerini ve kimliklerini kendileri teyit etmelidir. Avukat olmayan bir kişinin platformu kullanması durumunda ortaya çıkabilecek hiçbir zarardan veya haksız fiilden TevkilGO sorumlu değildir.
          </li>
          <li>
            <strong>Amaç Dışı Kullanım:</strong> TevkilGO, avukatlar arası yardımlaşma için geliştirilmiştir. Platformun bu amacına aykırı şekilde kullanılması (örneğin, avukat olmadığı halde avukat gibi davranarak ilanlara yanıt vermek, gerçeğe aykırı beyanlarla kullanıcıları yanıltmak v.b.) yasaktır. Böyle bir kullanım tespit edilirse, TevkilGO ilgili kullanıcının erişimini kısıtlama, üyeliğini sona erdirme gibi tedbirler alabilir; ancak platform, kötü niyetli kullanımları tamamen engelleyebileceğini taahhüt etmez. Avukat olmayan ve sisteme üye olup ilanlara &ldquo;yaparım/ederim&rdquo; diyerek talip olan, ancak işi yapmayıp karşı taraftan haksız ödeme alan kişilerin fiillerinden TevkilGO sorumlu tutulamaz. Bu tür dolandırıcılık veya suiistimal girişimleri, tamamen ilgili kullanıcıların kötü niyetinden kaynaklanmakta olup, kullanıcılar kendi zararlarını hukuk yollarına başvurarak ilgili kişiden talep etmelidir.
          </li>
          <li>
            <strong>Ödeme ve Ücretlendirme:</strong> TevkilGO platformu üzerinde herhangi bir entegre ödeme sistemi bulunmamaktadır; kullanıcılar, aralarında anlaştıkları işler için ödeme ve ücret konusunu platform dışında, kendi aralarında kararlaştırır ve hallederler. Platform, kullanıcılar arasında gerçekleşen para alışverişine dahil olmaz. Bu nedenle, bir kullanıcının diğerine ödediği ücretin akıbetinden veya iadesinden TevkilGO sorumlu değildir. Örneğin, platform aracılığıyla anlaşılan bir iş için önden ödeme yaptıysanız ve karşı taraf işi yapmadıysa, bu durumda yaşanabilecek maddi kayıptan veya uyuşmazlıktan TevkilGO sorumlu tutulamaz. Aynı şekilde, kullanıcıların ücret konusunda anlaşmazlığa düşmeleri halinde, bu anlaşmazlığın çözümü tamamen taraflara ait olup, TevkilGO arabuluculuk yapmaz.
          </li>
          <li>
            <strong>İçerik Sorumluluğu:</strong> Platformda yayınlanan ilanların ve kullanıcılar tarafından paylaşılan her türlü içeriğin sorumluluğu, ilgili içeriği yayınlayan kullanıcıya aittir. TevkilGO, kullanıcılar tarafından sağlanan içeriklerin doğruluğunu, güncelliğini veya hukuka uygunluğunu kontrol etmekle yükümlü değildir ve bunları taahhüt etmez. Örneğin, bir kullanıcının ilanında belirttiği bilgilerin yanlış, eksik veya yanıltıcı olmasından doğacak zararlardan TevkilGO sorumlu değildir. Bununla birlikte, TevkilGO topluluk kurallarını ve hukuka uygunluğu sağlamak adına zaman zaman içerikleri denetleyebilir; bariz biçimde hukuka aykırı, üçüncü kişileri zarara uğratabilecek veya platform amacına aykırı içerikleri haber vermeksizin kaldırma ve ilgili kullanıcıya gerekli yaptırımları uygulama hakkına sahiptir. Bu çerçevede, kullanıcılar platformu kullanırken hukuka, meslek kurallarına ve dürüstlük ilkesine uygun davranacağını kabul eder.
          </li>
          <li>
            <strong>Platformun Erişilebilirliği ve Teknik Meseleler:</strong> TevkilGO, platformun kesintisiz veya hatasız çalışacağını, kullanıcı ihtiyaç ve beklentilerine her zaman uygun olacağını garanti etmez. Teknik bakım, güncelleme veya beklenmedik altyapı sorunları nedeniyle hizmette kesintiler veya aksamalar yaşanabilir. TevkilGO, makul sınırlar içinde platformun sürekliliğini sağlamak için çaba gösterse de, oluşabilecek teknik arızalar, kesintiler, veri kayıpları veya gecikmeler nedeniyle kullanıcılara karşı sorumlu olmayacaktır. Platformun kullanımı sırasında karşılaşılabilecek olası yazılım hataları, virüs saldırıları, yetkisiz erişimler gibi durumlardan doğabilecek zararlarda da TevkilGO&apos;nun sorumluluğu bulunmamaktadır. Kullanıcılar, platformu &ldquo;olduğu gibi&rdquo; (as-is) kullanmayı kabul eder.
          </li>
          <li>
            <strong>Dolaylı Zararlar ve Mücbir Sebepler:</strong> Hiçbir durumda TevkilGO, kullanıcıların platformu kullanması veya kullanamaması neticesinde ortaya çıkabilecek dolaylı, arızi, özel veya sonuç kabilinden doğan zararlarından sorumlu değildir. Bu kapsamda, kar kayıpları, iş fırsatı kaybı, itibar zedelenmesi, veri kaybı veya beklenmedik her türlü sonucun riskini kullanıcılar üstlenir. Ayrıca, mücbir sebepler (ör. doğal afetler, iletişim altyapısındaki büyük ölçekli arızalar, siber saldırılar, savaş/terör olayları, yasal mevzuat değişiklikleri vb. öngörülemeyen ve kaçınılamayan haller) nedeniyle platform hizmetlerinde aksama veya veri kaybı olursa, TevkilGO bu durumlarda yükümlü tutulamaz.
          </li>
          <li>
            <strong>Harici Bağlantılar:</strong> TevkilGO uygulaması veya sitesinde, üçüncü taraf web sitelerine veya hizmetlere yönlendiren bağlantılar yer alabilir. Bu bağlantılar sadece kolaylık veya referans sağlamak amacıyla konulmuştur. TevkilGO&apos;nun, bağlantı verdiği üçüncü taraf sitelerin içeriği veya bu sitelerin veri uygulamaları üzerinde bir kontrolü bulunmamaktadır. Bu nedenle, harici bağlantılardan ulaşılan sitelerdeki bilgilerin doğruluğu, güvenliği veya o sitelerin kişisel veri uygulamalarından TevkilGO sorumlu değildir. Kullanıcılar, TevkilGO üzerinden eriştikleri üçüncü taraf sitelerde kendi insiyatifleriyle gezinir ve bu sitelerin şartlarına tabi olurlar.
          </li>
        </ul>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Yukarıdaki sorumluluk reddi şartları, yürürlükteki kanunlar çerçevesinde izin verilen en geniş kapsamda uygulanacaktır. TevkilGO&apos;nun herhangi bir sebeple sorumlu tutulamadığı durumlarda dahi, yasal sorumluluğun doğduğu hallerde sorumluluk mevzuatın öngördüğü sınırlar dahilinde olacaktır (örneğin, kasıt veya ağır ihmalimizin bulunduğunun ispat edildiği istisnai durumlar hariç olmak üzere).
        </p>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Bu platformu kullanmaya devam eden tüm üyeler, yukarıda belirtilen sorumluluk reddi beyanı hükümlerini okumuş, anlamış ve kabul etmiş sayılır. Kullanıcı, TevkilGO&apos;ya üye olmakla veya platformu kullanmakla, bu beyanın bağlayıcı olduğunu peşinen beyan eder. Eğer bu koşulları kabul etmiyorsanız, platformu kullanmamanız önerilir. TevkilGO, işbu sorumluluk reddi beyanını ve kullanım koşullarını zaman zaman güncelleme hakkını saklı tutar; bu tür güncellemeler platform üzerinden duyurulur ve yayınlandıktan sonra geçerli olur. Kullanıcıların, platformu her kullanımlarında güncel koşulları gözden geçirmeleri tavsiye edilir.
        </p>
      </div>
    </section>
  );
}




