// İl tevkil sayfalarının elle yazılan içeriği. Yalnızca burada kaydı olan il için sayfa üretilir;
// adliye ve baro listesi Supabase'ten gelir. Metinler ilden ile kopyalanmaz, her il kendi
// yargı yapısına, adliye düzenine ve tevkil ihtiyacına göre yazılır.
//
// Metinlerdeki {adliye} ve {baro}, sayfa üretilirken ilin veritabanındaki teyitli adliye ve baro sayısıyla doldurulur.
// [[tevkil]] ana sayfaya, [[metin|/yol]] verilen yola bağlanır (components/BagliMetin.js); sayfa başına bir [[tevkil]].
// aciklama: meta description (150–160 karakter). baslik/metin: hero. Zengin düzende H1 "<İl> Tevkil" olur;
// baslik H1'in altındaki giriş cümlesidir ve "<il> tevkil" ifadesiyle başlar, metin ikinci cümledir. merkez: il merkezindeki
// adliyelerin kodları. ekran: hero'daki telefon önizlemelerinde görünecek adliyeler.
// giris, adliyeMetni, adimMetni, sssMetni: bölüm başlıklarının altındaki metinler. durumlar: üç kart.
// ikon: yargi | kurum | yol | adliye | cezaevi | dag | sanayi. sorular: SSS ve FAQPage şeması.
// konum: il merkezinin enlem/boylamı, yakın illeri bulmak için. kart: yakın il kutusundaki kısa satır.
//
// Zengin düzen (ozet alanı olan il): metaBaslik, ozet (cevap paragrafı), ozetKartlari, nedir {metin, kartlar},
// karsilastirma {baslik, metin, sutunlar, satirlar}, ucret {metin, maddeler}, yasal {baslik, metin, maddeler},
// cagri {baslik, metin}, kimlerMetni, kimler, rehber (adliye rehberi kartları). Sorular 10 civarında tutulur.
export const ilIcerik = {
  ankara: {
    ad: "Ankara",
    guncelleme: "2026-10-28",
    konum: [39.93, 32.86],
    kart: "Yargıtay, Danıştay ve Batı Adliyesi",
    metaBaslik: "Ankara Tevkil – Yargıtay, Danıştay ve {adliye} Adliye | TevkilGO",
    aciklama:
      "Ankara tevkil ilanını aç: Yargıtay, Danıştay ya da Ankara'daki {adliye} adliyedeki duruşmana baro kimliğiyle doğrulanmış bir avukat gitsin. Üyelik ücretsiz.",
    baslik: "Ankara tevkil ilanını aç, Yargıtay'dan Nallıhan'a duruşmana meslektaşın gitsin.",
    metin:
      "Ankara'daki {adliye} adliyede, Yargıtay ve Danıştay'da baro kimliğiyle doğrulanmış avukatlar başvurur. Üyelik ücretsiz, tevkil ücretini sen belirlersin.",
    merkez: ["ankara-adliyesi", "ankara-bati-adliyesi"],
    ekran: {
      detay: "Ankara Batı Adliyesi",
      adliyeler: ["Ankara Batı Adliyesi", "Ankara Adliyesi", "Polatlı Adliyesi"],
    },

    ozet:
      "Ankara'da tevkil vermek için TevkilGO'da işin görüleceği adliyeyi seçip ilan açarsın: Sıhhiye'deki Ankara Adliyesi, Etimesgut'taki Ankara Batı Adliyesi ya da ilçe adliyelerinden biri. İlan, o adliyeyi çalışma bölgesi olarak seçmiş ve baro kimliğiyle doğrulanmış avukatlara bildirim olarak düşer. Başvuranlar arasından seçtiğin meslektaşına yetki belgesi düzenlersin; [[tevkil]] ücretini ve ödemeyi aranızda kararlaştırırsınız.",
    ozetKartlari: [
      {
        deger: "{adliye}",
        etiket: "adliye",
        text: "Ankara Adliyesi, Ankara Batı Adliyesi ve ilçe adliyelerinin hepsinde ilan açılır.",
      },
      {
        deger: "{baro}",
        etiket: "baro",
        text: "Ankara Barosu ve Ankara 2 Nolu Barosu. Başka barolardaki avukatlar da başvurabilir.",
      },
      {
        deger: "2",
        etiket: "yüksek mahkeme",
        text: "Yargıtay ve Danıştay duruşmaları için de ilan açılır.",
      },
      {
        deger: "0 TL",
        etiket: "üyelik",
        text: "İlan açmak ve başvurmak ücretsiz. Tevkil ücretini ilanı açan avukat belirler.",
      },
    ],
    nedir: {
      metin:
        "Ankara tevkil, Ankara'daki bir duruşmayı ya da adliye işini, vekâletnamendeki başkasını tevkil yetkisine dayanarak Ankara'da çalışan bir meslektaşına yetki belgesiyle gördürmendir. Müvekkilinle vekâlet ilişkin sürer, meslektaşın o iş için senin yerine geçer ve talimatınla hareket eder. Ankara'da bu ihtiyaç iki yönden doğar: Yargıtay ve Danıştay burada olduğu için her ilden avukatın işi bir gün Ankara'ya düşer; Ankara'da çalışan avukat ise birbirine uzak adliyeler arasında bölünür.",
      kartlar: [
        {
          title: "Ne sağlar?",
          text: "Ankara'ya gitmeden ya da büronu boş bırakmadan duruşmana, haczine, dosya incelemene bir meslektaşın girer. Yol, konaklama ve kaybolan iş günü ortadan kalkar.",
        },
        {
          title: "Nasıl çalışır?",
          text: "İlanı adliye, iş türü, tarih, saat ve ücretle açarsın. Başvurular kısa bir süre toplanır ve hepsi aynı anda listelenir. Seçtiğin avukatla iletişim bilgileriniz karşılıklı açılır.",
        },
        {
          title: "Kimler kullanır?",
          text: "Yargıtay ya da Danıştay'da duruşması olan il dışındaki avukatlar, aynı sabah iki adliyede işi olan Ankara'daki bürolar ve Ankara adliyelerinde iş almak isteyen avukatlar.",
        },
      ],
    },
    karsilastirma: {
      baslik: "Kendin gitmek, e-Duruşma ya da tevkil",
      metin:
        "Ankara'daki bir iş için üç yol vardır. Hangisinin uygun olduğu işin türüne ve aradaki mesafeye göre değişir.",
      sutunlar: ["Kendin gitmek", "e-Duruşma", "Tevkil"],
      satirlar: [
        {
          etiket: "Yol ve konaklama",
          hucreler: [["Senin üzerinde", "kotu"], ["Yok", "iyi"], ["Yok", "iyi"]],
        },
        {
          etiket: "Mahkemenin kabulü",
          hucreler: [["Gerekmez", "iyi"], ["Talep ve kabul gerekir", "kotu"], ["Gerekmez", "iyi"]],
        },
        {
          etiket: "Keşif, haciz, cezaevi görüşmesi",
          hucreler: [["Yapılır", "iyi"], ["Yapılamaz", "kotu"], ["Yapılır", "iyi"]],
        },
        {
          etiket: "Aynı saatte ikinci iş",
          hucreler: [["Mümkün değil", "kotu"], ["Bağlantı sürerken mümkün değil", "kotu"], ["Mümkün", "iyi"]],
        },
        {
          etiket: "Maliyet",
          hucreler: [["Yol masrafı ve iş günü"], ["Ek maliyet yok"], ["Meslektaşınla kararlaştırdığın ücret"]],
        },
      ],
    },
    ucret: {
      metin:
        "Ankara'da tek bir resmi tevkil ücreti yoktur. Ankara 2 Nolu Barosu'nun 2026 en az ücret çizelgesinde \"Tevkil Duruşma Ücreti\" kalemi 2.640 TL'dir. Ankara Barosu'nun 2026 çizelgesinde ise tevkil için ayrı bir kalem bulunmaz. Çizelgeler tavsiye niteliğindedir; TevkilGO'da ücreti ilanı açan avukat yazar. Barolara göre güncel tutarları [[avukat tevkil ücretleri|/avukat-tevkil-ucretleri]] yazımızda topladık.",
      maddeler: [
        {
          title: "Merkezdeki duruşmalar",
          text: "Sıhhiye'deki ana binada ya da Söğütözü'ndeki ek binada görülecek mazeret veya ara karar duruşmasında çizelgedeki duruşma tutarı iyi bir başlangıç noktasıdır.",
        },
        {
          title: "Batı Adliyesi ve uzak ilçeler",
          text: "Etimesgut'taki Batı Adliyesi'nde ya da merkeze 150 kilometreden uzak Nallıhan ve Şereflikoçhisar'da yol süresi ücrete eklenir.",
        },
        {
          title: "Yargıtay ve Danıştay",
          text: "Temyiz duruşması dosyaya hâkimiyet ve hazırlık ister. Ücreti işin ağırlığına göre ayrıca konuşmak yaygındır.",
        },
        {
          title: "Haciz ve keşif",
          text: "Saha mesaisi ve bekleme süresi olan işlerde yarım gün ya da tam gün üzerinden anlaşmak daha sağlıklıdır. Yol ve harç gibi masraflar ücrete dahil değildir.",
        },
      ],
    },
    yasal: {
      baslik: "Ankara'da tevkil için yetki belgesi",
      metin:
        "Tevkilin ilk şartı, müvekkilin vekâletnamesinde başkasını tevkil yetkisinin bulunmasıdır. Bu yetkiye dayanarak düzenleyip imzaladığın yetki belgesi, Avukatlık Kanunu m.56/2 gereği vekâletname hükmündedir. Ankara'daki mahkemeler, icra daireleri ve kurumlar belgeyi vekâletname gibi işleme koyar.",
      maddeler: [
        {
          title: "Kapsam",
          text: "Yetki belgesi dayandığı vekâletnameden geniş olamaz. Belgeye dosya numarasını, işin türünü ve meslektaşının adını yazarsın.",
        },
        {
          title: "İmza ve gönderim",
          text: "Belgeyi ıslak ya da elektronik imzayla düzenlersin; UYAP üzerinden de gönderilebilir. TevkilGO'da tevkil verdiğin anda meslektaşının bilgileri belge için açılır.",
        },
        {
          title: "Yargıtay ve Danıştay duruşmaları",
          text: "Duruşmaya girecek meslektaşının yetki belgesini ve dayanak vekâletnamenin örneğini yanında bulundurması kalemde zaman kaybını önler.",
        },
        {
          title: "Sorumluluk",
          text: "Tevkil edilen avukat senin talimatınla çalışır, müvekkile karşı sorumluluk sende kalır. Talimatını ilan notunda ve yazılı olarak netleştir.",
        },
      ],
    },
    cagri: {
      baslik: "Ankara'daki duruşmana bugün meslektaş bul",
      metin:
        "İlanı birkaç dakikada aç, Ankara adliyelerinde çalışan avukatların başvurularını aynı anda gör.",
    },
    kimlerMetni:
      "Ankara'da tevkil iki yönlü işler: başka ilden gelen işler Ankara'daki avukatlara düşer, Ankara'daki bürolar da şehir içindeki mesafeyi tevkille kapatır.",
    kimler: [
      {
        title: "İl dışından temyiz ve Danıştay işi olanlar",
        text: "Yargıtay'da duruşmalı temyiz ya da Danıştay'da duruşma için Ankara'ya gelmek bir iş günü ve yol masrafı demektir. Duruşmayı Ankara'daki meslektaşına gördürürsün.",
      },
      {
        title: "Ankara'daki bürolar",
        text: "Sıhhiye ile Etimesgut arasında ya da merkez ile Polatlı arasında aynı sabaha düşen işlerden birini tevkil eder, öbürüne kendin girersin.",
      },
      {
        title: "Ankara'da iş almak isteyen avukatlar",
        text: "Ankara adliyelerini çalışma bölgesi olarak seçersin; duruşma, haciz ve dosya inceleme ilanları sana bildirim olarak gelir. Puanın tamamladığın işlerle oluşur.",
      },
      {
        title: "Mesai dışı işler",
        text: "Karakol ifadesi ya da sulh ceza sorgusu gibi akşam ve gece çıkan işler için gece modunu açmış Ankara'daki avukatlara ulaşırsın.",
      },
    ],

    giris:
      "Ankara'daki tevkil ilanlarının çoğu üç tür işten doğar: yüksek mahkemelerdeki duruşmalar, bakanlık ve kurumlardaki işlemler ve merkeze uzak adliyelerdeki işler. TevkilGO'da her biri için ayrı iş türüyle ilan açarsın; işine Ankara'da çalışan, baro kimliğiyle doğrulanmış bir muhabir avukat gider.",
    adliyeMetni:
      "Ankara'daki {adliye} teyitli adliyenin hepsinde tevkil ilanı açabilirsin. İlan yalnızca o adliyeyi çalışma bölgesi olarak seçmiş avukatlara düşer; bu yüzden doğru adliyeyi seçmek, ilanın doğru meslektaşa ulaşmasının ilk adımıdır.",
    rehber: [
      {
        title: "Ankara Adliyesi",
        text: "Çankaya, Keçiören, Yenimahalle, Altındağ, Mamak ve Pursaklar'ın davalarına bakar; bu ilçelerde ayrı adliye yoktur. Ana bina Sıhhiye'de, Atatürk Bulvarı üzerindedir. Aile, çocuk, ticaret ve tüketici mahkemeleri Söğütözü'ndeki 4 Nolu Ek Hizmet Binası'ndadır; ilan notuna binayı yazman meslektaşının doğru yere gitmesini sağlar.",
      },
      {
        title: "Ankara Batı Adliyesi",
        text: "Etimesgut'ta, Oğuzlar Mahallesi'ndedir. Etimesgut, Sincan, Ayaş, Güdül ve Çamlıdere'nin davaları burada görülür. Beypazarı, Kahramankazan, Kızılcahamam ve Nallıhan adliyeleri de Batı'ya bağlıdır.",
      },
      {
        title: "İlçe adliyeleri",
        text: "Polatlı, Gölbaşı, Çubuk, Elmadağ, Akyurt, Kalecik, Haymana, Balâ ve Şereflikoçhisar'da ayrı adliye binaları vardır. Bu ilçelerdeki iş için ilanı Ankara Adliyesi'nde değil, ilçenin kendi adliyesinde açarsın; ilan o ilçede çalışan avukatlara gider.",
      },
      {
        title: "Yargıtay, Danıştay ve bölge mahkemeleri",
        text: "Yargıtay Çankaya'da Ahlatlıbel'deki yerleşkesinde, Danıştay Eskişehir Yolu üzerindeki binasındadır. Bu mercilerdeki duruşmalar için ilanı Ankara Adliyesi'nde açar, daireyi ve esas numarasını ilan notuna yazarsın. Yeni Ankara Adalet Sarayı'nın 2027'de hizmete girmesi planlanıyor; taşınmalar oldukça bu rehberi güncelliyoruz.",
      },
    ],
    adimMetni:
      "Ankara'da tevkil vermek birkaç dakika sürer. İlanı sen açarsın, başvuran avukatların barosunu ve puanını görürsün, duruşma tevkilini kime vereceğine sen karar verirsin. Yetki belgesi seçtiğin meslektaşınla aranızda hazırlanır.",
    sssMetni: "Ankara'da tevkil, Yargıtay ve Danıştay duruşmaları, adliye seçimi ve tevkil ücreti hakkında en çok sorulanlar.",
    durumlar: [
      {
        ikon: "yargi",
        title: "Yargıtay ve Danıştay",
        text: "Duruşmalı temyiz dosyaları ile Danıştay'ın ilk derece ve temyiz duruşmaları Ankara'da görülür. İl dışındaysan duruşmaya Ankara'daki meslektaşın girer.",
      },
      {
        ikon: "kurum",
        title: "Bakanlık ve kurum işleri",
        text: "Rekabet Kurulu'nda sözlü savunma, bakanlıkta dosya inceleme, düzenleyici kurumlara evrak teslimi. Kurum İşlemleri türüyle ilan açılır.",
      },
      {
        ikon: "yol",
        title: "Batı Adliyesi ve uzak ilçeler",
        text: "Ankara Batı Adliyesi Etimesgut'tadır ve şehrin batısındaki ilçelere bakar. Nallıhan ve Şereflikoçhisar merkeze 150 kilometreden uzaktır; bu adliyelerde tevkil yol ve zaman kazandırır.",
      },
    ],
    sorular: [
      {
        q: "Yargıtay ya da Danıştay'daki duruşmam için Ankara'da tevkil verebilir miyim?",
        a: "Evet. Yargıtay ve Danıştay adliye listesinde ayrıca yer almaz. İlanı Ankara Adliyesi'ni seçerek açar; daireyi, esas numarasını ve duruşma saatini ilan notuna yazarsın. Yargıtay Ahlatlıbel'de, Danıştay Eskişehir Yolu üzerindedir.",
      },
      {
        q: "Ankara Batı Adliyesi nerede, hangi ilçelere bakar?",
        a: "Etimesgut'ta, Oğuzlar Mahallesi'ndedir. Etimesgut, Sincan, Ayaş, Güdül ve Çamlıdere'nin davaları burada görülür. Sıhhiye'deki Ankara Adliyesi ile aynı bina değildir; ilanı doğru adliyede açman, ilanın o bölgede çalışan avukatlara ulaşması için önemlidir.",
      },
      {
        q: "Keçiören, Yenimahalle ya da Mamak'taki dava için hangi adliyeyi seçmeliyim?",
        a: "Bu ilçelerin ayrı adliyesi yoktur, davaları Ankara Adliyesi'nde görülür. İlanı Ankara Adliyesi'ni seçerek açarsın. Çankaya, Altındağ ve Pursaklar için de aynısı geçerlidir.",
      },
      {
        q: "Aile ya da ticaret mahkemesindeki duruşma hangi binada görülür?",
        a: "Ankara Adliyesi'ne bağlı aile, çocuk, ticaret ve tüketici mahkemeleri Söğütözü'ndeki 4 Nolu Ek Hizmet Binası'ndadır. İlanı Ankara Adliyesi'nde açar, mahkemeyi ve binayı ilan notuna yazarsın.",
      },
      {
        q: "Ankara'da tevkil ücreti ne kadar?",
        a: "Ankara 2 Nolu Barosu'nun 2026 çizelgesinde tevkil duruşma ücreti 2.640 TL'dir; Ankara Barosu'nun çizelgesinde ayrı bir tevkil kalemi yoktur. TevkilGO'da ücreti sen yazarsın. Merkezdeki bir duruşma ile 150 kilometre uzaktaki bir keşif aynı emeği gerektirmez; yolu ve bekleme süresini hesaba katman başvuru almanı kolaylaştırır. Ödeme taraflar arasında doğrudan yapılır.",
      },
      {
        q: "Ankara'daki ilanlara başka barolara kayıtlı avukatlar başvurabilir mi?",
        a: "Evet. Ankara'da Ankara Barosu ve Ankara 2 Nolu Barosu olmak üzere iki baro vardır, ancak başvuru için baro sınırı yoktur. Baro kimliğiyle doğrulanmış her avukat Ankara adliyelerini çalışma bölgesi olarak seçip ilanlara başvurabilir. Başvuranın barosunu ilan ekranında görürsün.",
      },
      {
        q: "Tevkil vermek için vekâletnamede ne yazmalı?",
        a: "Vekâletnamede başkasını tevkil yetkisi açıkça bulunmalıdır. Yetki belgesi bu yetkiye dayanır ve vekâletnameden geniş olamaz. Yetki yoksa önce müvekkilinden bu yetkiyi içeren bir vekâletname alman gerekir.",
      },
      {
        q: "e-Duruşma varken neden tevkil vereyim?",
        a: "e-Duruşma talebe ve mahkemenin kabulüne bağlıdır ve yalnızca duruşmaya bağlanmanı sağlar. Keşif, haciz, dosya inceleme, cezaevinde müvekkil görüşmesi ve kurum işleri uzaktan yapılamaz; bu işler için Ankara'da bir meslektaşın gerekir.",
      },
      {
        q: "Rekabet Kurulu'ndaki sözlü savunma için tevkil verebilir miyim?",
        a: "Evet. İlanı Kurum İşlemleri türüyle açar, kurumu, toplantı tarihini ve saatini ilan notuna yazarsın.",
      },
      {
        q: "Akşam ya da gece çıkan bir iş için Ankara'da avukat bulabilir miyim?",
        a: "Gece modunu açan avukatlar 18:00 ile 08:00 arasında müsait görünür. Karakol ifadesi ya da sulh ceza sorgusu gibi acil bir iş için ilan açtığında bu avukatlara ulaşırsın.",
      },
    ],
  },

  istanbul: {
    ad: "İstanbul",
    guncelleme: "2026-10-14",
    konum: [41.01, 28.98],
    kart: "Çağlayan, Kartal ve Bakırköy",
    aciklama:
      "Çağlayan, Kartal ya da Bakırköy'deki duruşman çakıştıysa İstanbul'da çalışan doğrulanmış bir avukata tevkil ver. İstanbul'daki {adliye} adliyede ilan açılır.",
    baslik: "Çağlayan'dan Silivri'ye, İstanbul'daki duruşmana meslektaşın gitsin.",
    metin:
      "Anadolu yakasında bir celse, Avrupa yakasında bir haciz, ikisi aynı sabah. İlanı aç, o adliyede çalışan avukatlar başvursun.",
    merkez: ["istanbul-adliyesi", "istanbul-anadolu-adliyesi", "istanbul-bakirkoy-adliyesi"],
    ekran: {
      detay: "İstanbul Anadolu Adliyesi",
      adliyeler: ["İstanbul Adliyesi", "Bakırköy Adliyesi", "İstanbul Anadolu Adliyesi"],
    },
    giris:
      "İstanbul'da tevkilin asıl sebebi trafik ve mesafedir. Çağlayan'daki İstanbul Adliyesi, Kartal'daki İstanbul Anadolu Adliyesi ve Bakırköy Adliyesi arasında aynı sabah iki duruşmaya yetişmek çoğu zaman mümkün değildir. TevkilGO'da İstanbul tevkil ilanını açarsın; duruşmana, haciz ya da dosya incelemene o adliyede çalışan, baro kimliğiyle doğrulanmış bir muhabir avukat gider.",
    adliyeMetni:
      "Çağlayan, Kartal ve Bakırköy'deki üç büyük adliyenin yanı sıra Küçükçekmece, Gaziosmanpaşa, Silivri ve Çatalca'da da tevkil ilanı açabilirsin. İlan yalnızca o adliyeyi çalışma bölgesi olarak seçmiş avukatlara düşer; Anadolu yakasındaki işin Avrupa yakasındaki avukatlara gitmez.",
    adimMetni:
      "İstanbul'da tevkil ilanı açmak birkaç dakikanı alır. Başvuran avukatların barosunu, puanını ve tamamladığı iş sayısını görür, duruşma tevkilini kime vereceğini sen seçersin.",
    sssMetni: "İstanbul'da tevkil, Silivri duruşmaları ve adliyeler arası mesafe hakkında en çok sorulanlar.",
    durumlar: [
      {
        ikon: "yol",
        title: "İki yaka arasında çakışan celseler",
        text: "Avrupa yakasındaki Çağlayan ve Bakırköy ile Anadolu yakasındaki Kartal arasında köprü trafiği saatler alabilir. Çakışan duruşmalardan birini o yakadaki meslektaşına tevkil edersin.",
      },
      {
        ikon: "cezaevi",
        title: "Silivri'deki duruşmalar",
        text: "Marmara Cezaevleri yerleşkesindeki salonlarda görülen ceza davaları ve müvekkil görüşmeleri için şehir merkezinden gidiş dönüş saatler sürer.",
      },
      {
        ikon: "adliye",
        title: "Adalar, Şile ve Çatalca",
        text: "Adalar Adliyesi'ne vapurla gidilir, Şile ve Çatalca merkeze uzak ilçelerdir. Bu adliyelerdeki işlerde bölgede çalışan bir avukat günü kurtarır.",
      },
    ],
    sorular: [
      {
        q: "Çağlayan Adliyesi ile İstanbul Adliyesi aynı yer mi?",
        a: "Evet. Çağlayan'daki adalet sarayının listedeki adı İstanbul Adliyesi'dir. İlan açarken İstanbul Adliyesi'ni seçersin.",
      },
      {
        q: "Kartal'daki duruşmam için hangi adliyeyi seçmeliyim?",
        a: "Kartal'daki adalet sarayı İstanbul Anadolu Adliyesi'dir. Anadolu yakasındaki birçok ilçenin davaları burada görülür; ilanı bu adliyede açarsın.",
      },
      {
        q: "Silivri'deki bir ceza duruşması için tevkil verebilir miyim?",
        a: "Evet. İlanı davanın görüldüğü mahkemenin bağlı olduğu adliyeyi seçerek açar, duruşmanın Silivri'deki salonda görüleceğini ve saatini ilan notuna yazarsın.",
      },
      {
        q: "İstanbul'da tevkil ücreti neye göre değişir?",
        a: "Ücreti sen belirlersin. Aynı yakadaki bir duruşma ile köprü geçişi gerektiren ya da Silivri'ye gidilen bir iş aynı süreyi almaz; yolu ve bekleme süresini hesaba katman başvuru almanı kolaylaştırır.",
      },
      {
        q: "İstanbul 2 Nolu Barosu üyeleri de başvurabilir mi?",
        a: "Evet. İstanbul Barosu ya da İstanbul 2 Nolu Barosu fark etmez; baro kimliğiyle doğrulanmış her avukat İstanbul adliyelerini çalışma bölgesi olarak seçip ilanlara başvurabilir.",
      },
    ],
  },

  izmir: {
    ad: "İzmir",
    guncelleme: "2026-10-14",
    konum: [38.42, 27.14],
    kart: "Bayraklı, Karşıyaka ve Bergama",
    aciklama:
      "Bayraklı'daki İzmir Adliyesi'nden Bergama'ya, İzmir'deki {adliye} adliyede duruşma ve icra işin için doğrulanmış bir meslektaşına tevkil ver. Üyelik ücretsiz.",
    baslik: "Bayraklı'dan Bergama'ya, İzmir'deki duruşmana meslektaşın gitsin.",
    metin: "Karşıyaka'da bir celse, Torbalı'da bir haciz, Ödemiş'te bir keşif. İlanı aç, o adliyede çalışan avukatlar başvursun.",
    merkez: ["izmir-adliyesi", "izmir-karsiyaka-adliyesi"],
    ekran: {
      detay: "Karşıyaka Adliyesi",
      adliyeler: ["İzmir Adliyesi", "Karşıyaka Adliyesi", "Torbalı Adliyesi"],
    },
    giris:
      "İzmir, {adliye} adliyesiyle adliye sayısı en yüksek illerden biridir. Bayraklı'daki İzmir Adliyesi ve Karşıyaka Adliyesi şehrin iki ana adliyesidir; Bergama'dan Kiraz'a, Çeşme'den Ödemiş'e uzanan ilçe adliyeleri ise merkezden saatlerce uzaktadır. TevkilGO'da İzmir tevkil ilanını açarsın; işine o adliyede çalışan, baro kimliğiyle doğrulanmış bir muhabir avukat gider.",
    adliyeMetni:
      "İzmir Adliyesi ve Karşıyaka Adliyesi başta olmak üzere ildeki {adliye} adliyenin hepsinde tevkil ilanı açabilirsin. Torbalı'daki bir icra işi de Dikili'deki bir duruşma da yalnızca o adliyeyi çalışma bölgesi olarak seçmiş avukatlara bildirim olarak gider.",
    adimMetni:
      "İzmir'de tevkil vermek için ilanı açman yeterli. Başvurular kısa süre toplanır, başvuran avukatların barosunu ve puanını görürsün; duruşma tevkilini kime vereceğine sen karar verirsin.",
    sssMetni: "İzmir'de tevkil, ilçe adliyeleri ve cezaevi görüşmeleri hakkında en çok sorulanlar.",
    durumlar: [
      {
        ikon: "adliye",
        title: "Bayraklı ve Karşıyaka",
        text: "Şehrin iki ana adliyesi ayrı binalardır. Aynı sabah ikisinde celsen varsa birini diğer adliyede çalışan meslektaşına tevkil etmek zaman kazandırır.",
      },
      {
        ikon: "yol",
        title: "Uzak ilçe adliyeleri",
        text: "Bergama ve Kiraz merkeze 100 kilometreden uzaktır, Karaburun ve Çeşme yarımadanın ucundadır. Bu adliyelerdeki duruşma ve keşiflerde bölgede çalışan avukat yolu ortadan kaldırır.",
      },
      {
        ikon: "cezaevi",
        title: "Şakran ve Kırıklar",
        text: "Aliağa'daki Şakran ve Buca'daki Kırıklar ceza infaz kurumlarında müvekkil görüşmesi için Cezaevi Ziyareti türüyle ilan açılır.",
      },
    ],
    sorular: [
      {
        q: "İzmir Adliyesi nerede?",
        a: "Bayraklı'dadır ve İzmir'in merkez adliyesidir. Karşıyaka Adliyesi ise ayrı bir binadır; ilanı işin görüldüğü adliyede açman, ilanın doğru avukatlara ulaşması için önemlidir.",
      },
      {
        q: "Bergama ya da Ödemiş'teki bir duruşma için başvuru gelir mi?",
        a: "İlan, o adliyeyi çalışma bölgesi olarak seçmiş avukatlara düşer. Merkezden uzak adliyelerde başvuranlar daha az olabilir, bu yüzden ilanı birkaç gün önceden açmanı öneririz.",
      },
      {
        q: "Şakran'daki müvekkilimle görüşme için tevkil verebilir miyim?",
        a: "Evet. Cezaevi Ziyareti türüyle ve Aliağa Adliyesi'ni seçerek ilan açar, kurumu ve görüşme saatini ilan notuna yazarsın.",
      },
      {
        q: "Çeşme'deki bir iş için ücreti nasıl belirlemeliyim?",
        a: "Ücreti sen yazarsın. Yarımadadaki bir adliyeye gidiş dönüş merkezdeki bir duruşmadan çok daha uzun sürer; yolu ve bekleme süresini ücrete yansıtmak başvuru almanı kolaylaştırır.",
      },
      {
        q: "İzmir dışındayım, İzmir'deki dosyam için tevkil verebilir miyim?",
        a: "Evet. İlan açarken bulunduğun il değil, işin görüleceği adliye seçilir. İzmir'deki adliyeyi seçtiğinde ilan İzmir'de çalışan meslektaşlarına ulaşır.",
      },
    ],
  },

  bursa: {
    ad: "Bursa",
    guncelleme: "2026-10-14",
    konum: [40.19, 29.06],
    kart: "Bursa, İnegöl ve Gemlik",
    aciklama:
      "Bursa Adliyesi, İnegöl ya da Gemlik'teki duruşman için Bursa'da çalışan doğrulanmış bir avukata tevkil ver. Bursa'daki {adliye} adliyede ilan açılır, üyelik ücretsiz.",
    baslik: "İnegöl'den Mudanya'ya, Bursa'daki duruşmana meslektaşın gitsin.",
    metin: "İstanbul'dan takip ettiğin bir dava ya da İnegöl'de çakışan bir celse. İlanı aç, Bursa'da çalışan avukatlar başvursun.",
    merkez: ["bursa-adliyesi"],
    ekran: {
      detay: "İnegöl Adliyesi",
      adliyeler: ["Bursa Adliyesi", "İnegöl Adliyesi", "Gemlik Adliyesi"],
    },
    giris:
      "Bursa, İstanbul'a otoyolla bağlandığı için İstanbul'daki büroların sık dava takip ettiği bir ildir; yine de bir duruşma için gidiş dönüş bütün günü alır. Bursa Adliyesi'nin yanında İnegöl, Gemlik, Mustafakemalpaşa ve Karacabey gibi kalabalık ilçelerin kendi adliyeleri vardır. TevkilGO'da Bursa tevkil ilanını açarsın; işine o adliyede çalışan, baro kimliğiyle doğrulanmış bir muhabir avukat gider.",
    adliyeMetni:
      "Bursa Adliyesi başta olmak üzere ildeki {adliye} adliyede tevkil ilanı açabilirsin. Gemlik'teki bir icra işi de Karacabey'deki bir duruşma da yalnızca o adliyeyi çalışma bölgesi olarak seçmiş avukatlara bildirim olarak düşer.",
    adimMetni:
      "Bursa'da tevkil ilanını açtıktan sonra başvurular kısa süre toplanır ve hepsi aynı anda listelenir. Barosunu ve puanını gördüğün avukatlar arasından duruşma tevkilini kime vereceğini sen seçersin.",
    sssMetni: "Bursa'da tevkil, İstanbul'dan takip edilen dosyalar ve ilçe adliyeleri hakkında en çok sorulanlar.",
    durumlar: [
      {
        ikon: "yol",
        title: "İstanbul'dan takip edilen dosyalar",
        text: "Bursa'da görülen bir dava için İstanbul'dan gelmek, yol ve bekleme süresiyle bir iş gününü alır. Duruşmaya Bursa'da çalışan meslektaşın girer.",
      },
      {
        ikon: "adliye",
        title: "İnegöl ve Gemlik",
        text: "Sanayisi ve nüfusuyla İnegöl, limanıyla Gemlik yoğun çalışan ilçe adliyeleridir. Merkezdeki bir celseyle çakışan işlerde o adliyedeki meslektaşına tevkil verirsin.",
      },
      {
        ikon: "dag",
        title: "Keles ve Orhaneli",
        text: "Uludağ'ın güneyindeki bu dağ ilçelerinin adliyelerine ulaşım uzun sürer. Bölgede çalışan bir avukat yolu ortadan kaldırır.",
      },
    ],
    sorular: [
      {
        q: "İstanbul'dayım, Bursa'daki duruşmam için tevkil verebilir miyim?",
        a: "Evet. İlanı Bursa'daki adliyeyi seçerek açarsın; ilan Bursa'da çalışan doğrulanmış avukatlara ulaşır. Yetki belgesini seçtiğin meslektaşına düzenlersin.",
      },
      {
        q: "İnegöl'deki bir iş için Bursa Adliyesi'ni mi seçmeliyim?",
        a: "Hayır, İnegöl Adliyesi'ni seçmelisin. İlan, seçtiğin adliyeyi çalışma bölgesi olarak işaretlemiş avukatlara gider; doğru adliye doğru başvuru demektir.",
      },
      {
        q: "Keles veya Orhaneli'deki bir duruşmaya kim başvurur?",
        a: "Bu adliyeleri çalışma bölgesi olarak seçmiş avukatlar. Dağ ilçelerinde başvuran sayısı sınırlı olabileceği için ilanı erken açmak ve yol süresini ücrete katmak işini hızlandırır.",
      },
      {
        q: "Bursa'da tevkil ücretini kim belirler?",
        a: "İlanı açan avukat belirler. Bazı iş türlerinde uygulamanın altına inilemeyen bir asgari tutarı vardır. Ödeme taraflar arasında doğrudan yapılır; TevkilGO aracılık etmez.",
      },
      {
        q: "Haciz işlemi için de tevkil verebilir miyim?",
        a: "Evet. İcra İşlemleri türüyle ilan açar, haciz adresini ve saatini ilan notuna yazarsın.",
      },
    ],
  },

  antalya: {
    ad: "Antalya",
    guncelleme: "2026-10-14",
    konum: [36.89, 30.71],
    kart: "Alanya, Manavgat ve Kaş",
    aciklama:
      "Antalya'nın merkezinden Alanya ve Kaş'a uzanan {adliye} adliyede duruşma, icra ve tapu işlerin için doğrulanmış bir meslektaşına tevkil ver. Üyelik ücretsiz.",
    baslik: "Kaş'tan Gazipaşa'ya, Antalya'daki duruşmana meslektaşın gitsin.",
    metin: "Alanya'da bir celse, Manavgat'ta bir tapu işi, Kaş'ta bir keşif. İlanı aç, o adliyede çalışan avukatlar başvursun.",
    merkez: ["antalya-adliyesi"],
    ekran: {
      detay: "Alanya Adliyesi",
      adliyeler: ["Antalya Adliyesi", "Alanya Adliyesi", "Manavgat Adliyesi"],
    },
    giris:
      "Antalya'nın adliyeleri kıyı boyunca 300 kilometreyi aşan bir hatta dizilir. Merkezden Kaş'a da Gazipaşa'ya da yol yaklaşık üç saat sürer; Alanya ve Manavgat ise kendi başına yoğun adliyelerdir. TevkilGO'da Antalya tevkil ilanını açarsın; işine o adliyede çalışan, baro kimliğiyle doğrulanmış bir muhabir avukat gider.",
    adliyeMetni:
      "Antalya Adliyesi ile Alanya, Manavgat ve Serik başta olmak üzere ildeki {adliye} adliyede tevkil ilanı açabilirsin. Kumluca'daki bir duruşma da Kemer'deki bir icra işi de yalnızca o adliyeyi çalışma bölgesi olarak seçmiş avukatlara düşer.",
    adimMetni:
      "Antalya'da tevkil vermek için adliyeyi, iş türünü ve ücreti yazman yeterli. Başvuran avukatların barosunu ve puanını görür, kime tevkil vereceğine sen karar verirsin.",
    sssMetni: "Antalya'da tevkil, uzak ilçe adliyeleri ve tapu işleri hakkında en çok sorulanlar.",
    durumlar: [
      {
        ikon: "yol",
        title: "Batıda Kaş, doğuda Gazipaşa",
        text: "İki uçtaki adliyeler merkeze yaklaşık 180–190 kilometre uzaklıktadır. Bu adliyelerdeki işlerde bölgede çalışan bir avukat günü kurtarır.",
      },
      {
        ikon: "kurum",
        title: "Tapu ve kurum işleri",
        text: "Yabancı uyruklu alıcılara konut satışları ve kira uyuşmazlıkları nedeniyle tapu müdürlüklerinde iş yoğundur. Bu işler Kurum İşlemleri türüyle ilan açılır.",
      },
      {
        ikon: "adliye",
        title: "Alanya ve Manavgat",
        text: "Turizm bölgesinin iki büyük adliyesi kendi içinde yoğundur. Merkezdeki bir celseyle çakışan işlerde o adliyedeki meslektaşına tevkil verirsin.",
      },
    ],
    sorular: [
      {
        q: "Alanya'daki duruşmam için Antalya Adliyesi'ni mi seçmeliyim?",
        a: "Hayır, Alanya Adliyesi'ni seçmelisin. İlan seçtiğin adliyede çalışan avukatlara gider; Alanya ile merkez arasında yaklaşık 135 kilometre vardır.",
      },
      {
        q: "Kaş ya da Gazipaşa'daki bir iş için başvuru gelir mi?",
        a: "İlan, bu adliyeleri çalışma bölgesi olarak seçmiş avukatlara düşer. İlin iki ucundaki adliyelerde ilanı birkaç gün önceden açmak, başvuru alma şansını artırır.",
      },
      {
        q: "Tapu müdürlüğündeki bir işlem için tevkil verebilir miyim?",
        a: "Evet. Kurum İşlemleri türüyle ilan açar, tapu müdürlüğünü ve işlemin ne olduğunu ilan notuna yazarsın. Vekâletnamendeki yetkinin işleme uygun olduğunu önceden kontrol etmelisin.",
      },
      {
        q: "Antalya dışındayım, Antalya'daki davam için tevkil verebilir miyim?",
        a: "Evet. İlan açarken işin görüleceği adliye seçilir; bulunduğun il fark etmez. Antalya'daki adliyeyi seçtiğinde ilan orada çalışan meslektaşlarına ulaşır.",
      },
      {
        q: "Antalya'da tevkil ücretini nasıl belirlemeliyim?",
        a: "Ücreti sen yazarsın. Merkezdeki bir duruşma ile üç saatlik yol gerektiren bir keşif aynı emeği gerektirmez; yolu ve bekleme süresini ücrete katmak başvuru almanı kolaylaştırır.",
      },
    ],
  },

  adana: {
    ad: "Adana",
    guncelleme: "2026-10-14",
    konum: [37.0, 35.32],
    kart: "Ceyhan, Kozan ve istinaf",
    aciklama:
      "Adana Adliyesi, Ceyhan ya da Kozan'daki duruşman için Adana'da çalışan doğrulanmış bir avukata tevkil ver. Adana'daki {adliye} adliyede ilan açılır, üyelik ücretsiz.",
    baslik: "Ceyhan'dan Pozantı'ya, Adana'daki duruşmana meslektaşın gitsin.",
    metin: "Merkezde çakışan iki celse, Ceyhan'da bir haciz ya da Kozan'da bir keşif. İlanı aç, o adliyede çalışan avukatlar başvursun.",
    merkez: ["adana-adliyesi"],
    ekran: {
      detay: "Ceyhan Adliyesi",
      adliyeler: ["Adana Adliyesi", "Ceyhan Adliyesi", "Kozan Adliyesi"],
    },
    giris:
      "Adana, Çukurova'nın yargı merkezidir; Adana Bölge Adliye Mahkemesi'nde çevre illerden gelen istinaf dosyaları da görülür. Merkezdeki Adana Adliyesi'nin yanında Ceyhan ve Kozan kalabalık ilçe adliyeleridir; Feke, Tufanbeyli ve Aladağ ise kuzeydeki dağlık bölgede, merkeze uzaktır. TevkilGO'da Adana tevkil ilanını açarsın; işine o adliyede çalışan, baro kimliğiyle doğrulanmış bir muhabir avukat gider.",
    adliyeMetni:
      "Adana Adliyesi başta olmak üzere ildeki {adliye} adliyede tevkil ilanı açabilirsin. Ceyhan'daki bir icra işi de Pozantı'daki bir duruşma da yalnızca o adliyeyi çalışma bölgesi olarak seçmiş avukatlara bildirim olarak gider.",
    adimMetni:
      "Adana'da tevkil ilanı birkaç dakikada açılır. Başvurular toplandıktan sonra avukatların barosunu ve puanını karşılaştırır, duruşma tevkilini kime vereceğini sen seçersin.",
    sssMetni: "Adana'da tevkil, istinaf duruşmaları ve ilçe adliyeleri hakkında en çok sorulanlar.",
    durumlar: [
      {
        ikon: "yargi",
        title: "İstinaf duruşmaları",
        text: "Adana Bölge Adliye Mahkemesi'nde çevre illerden gelen dosyalar görülür. İl dışından takip ettiğin bir istinaf duruşmasına Adana'daki meslektaşın girer.",
      },
      {
        ikon: "dag",
        title: "Kuzeydeki dağ ilçeleri",
        text: "Feke, Tufanbeyli ve Aladağ adliyelerine dağ yoluyla ulaşılır ve merkeze uzaktır. Bu adliyelerdeki işlerde bölgede çalışan avukat yolu kısaltır.",
      },
      {
        ikon: "cezaevi",
        title: "Kürkçüler'deki görüşmeler",
        text: "Kürkçüler'deki ceza infaz kurumlarında müvekkil görüşmesi için Cezaevi Ziyareti türüyle ilan açılır.",
      },
    ],
    sorular: [
      {
        q: "Adana Bölge Adliye Mahkemesi'ndeki istinaf duruşması için tevkil verebilir miyim?",
        a: "Evet. Bölge adliye mahkemesi adliye listesinde ayrıca yer almaz; ilanı Adana Adliyesi'ni seçerek açar, daireyi, esas numarasını ve duruşma saatini ilan notuna yazarsın.",
      },
      {
        q: "Ceyhan'daki bir haciz için tevkil verebilir miyim?",
        a: "Evet. İcra İşlemleri türüyle ve Ceyhan Adliyesi'ni seçerek ilan açarsın. Haciz adresini ve saatini ilan notuna yazman başvuran meslektaşın hazırlık yapmasını sağlar.",
      },
      {
        q: "Tufanbeyli ya da Feke'deki bir duruşmaya başvuru gelir mi?",
        a: "İlan bu adliyeleri çalışma bölgesi olarak seçmiş avukatlara düşer. Dağ ilçelerinde ilanı erken açman ve yol süresini ücrete eklemen, işin karşılıksız kalmamasını sağlar.",
      },
      {
        q: "Kürkçüler'deki müvekkilimle görüşme için tevkil verebilir miyim?",
        a: "Evet. Cezaevi Ziyareti türüyle ilan açar, kurumu ve görüşme saatini ilan notuna yazarsın.",
      },
      {
        q: "Adana'da tevkil ücretini kim belirler?",
        a: "İlanı açan avukat belirler, başvuranlar ücreti görerek başvurur. Ödeme taraflar arasında doğrudan yapılır; TevkilGO ödemeye aracılık etmez ve komisyon almaz.",
      },
    ],
  },

  konya: {
    ad: "Konya",
    guncelleme: "2026-10-14",
    konum: [37.87, 32.48],
    kart: "Ereğli'den Akşehir'e",
    aciklama:
      "Türkiye'nin yüzölçümü en büyük ili Konya'da {adliye} adliye var. Ereğli'den Akşehir'e duruşma ve icra işin için doğrulanmış bir meslektaşına tevkil ver.",
    baslik: "Akşehir'den Ereğli'ye, Konya'daki duruşmana meslektaşın gitsin.",
    metin: "Merkezde bir celse, Beyşehir'de bir keşif, Kulu'da bir haciz. İlanı aç, o adliyede çalışan avukatlar başvursun.",
    merkez: ["konya-adliyesi"],
    ekran: {
      detay: "Akşehir Adliyesi",
      adliyeler: ["Konya Adliyesi", "Ereğli Adliyesi", "Beyşehir Adliyesi"],
    },
    giris:
      "Konya, Türkiye'nin yüzölçümü en büyük ilidir ve {adliye} adliyesi bu geniş alana dağılır. Ereğli ile Akşehir merkeze 130 kilometreyi aşan uzaklıktadır; kuzeyde Kulu ve Cihanbeyli, güneyde Hadim ve Bozkır ayrı bir yolculuk gerektirir. TevkilGO'da Konya tevkil ilanını açarsın; işine o adliyede çalışan, baro kimliğiyle doğrulanmış bir muhabir avukat gider.",
    adliyeMetni:
      "Konya Adliyesi başta olmak üzere ildeki {adliye} adliyede tevkil ilanı açabilirsin. Seydişehir'deki bir duruşma da Karapınar'daki bir icra işi de yalnızca o adliyeyi çalışma bölgesi olarak seçmiş avukatlara bildirim olarak düşer.",
    adimMetni:
      "Konya'da tevkil vermek için adliyeyi seçip ilanı açman yeterli. Başvuranların barosunu, puanını ve tamamladığı iş sayısını görür, kime tevkil vereceğine sen karar verirsin.",
    sssMetni: "Konya'da tevkil, uzak ilçe adliyeleri ve istinaf duruşmaları hakkında en çok sorulanlar.",
    durumlar: [
      {
        ikon: "yol",
        title: "Ereğli ve Akşehir",
        text: "İlin doğu ve batı ucundaki bu iki kalabalık ilçe merkeze 130 kilometreden uzaktır. Buradaki duruşmalarda bölgede çalışan bir avukat günü kurtarır.",
      },
      {
        ikon: "yargi",
        title: "Konya Bölge Adliye Mahkemesi",
        text: "Çevre illerden gelen istinaf dosyaları Konya'da görülür. İl dışından takip ettiğin bir istinaf duruşmasına Konya'daki meslektaşın girer.",
      },
      {
        ikon: "dag",
        title: "Hadim ve Bozkır",
        text: "Toros eteklerindeki bu ilçe adliyelerine ulaşım uzun sürer. Keşif ve duruşmalar için o bölgede çalışan meslektaşına tevkil verirsin.",
      },
    ],
    sorular: [
      {
        q: "Ereğli'deki duruşmam için hangi adliyeyi seçmeliyim?",
        a: "Konya altında listelenen Ereğli Adliyesi'ni seçmelisin. Zonguldak'taki Ereğli ile karıştırmamak için önce ili doğru seçtiğinden emin ol.",
      },
      {
        q: "Konya Bölge Adliye Mahkemesi'ndeki istinaf duruşması için tevkil verebilir miyim?",
        a: "Evet. Bölge adliye mahkemesi adliye listesinde ayrıca yer almaz; ilanı Konya Adliyesi'ni seçerek açar, daireyi ve duruşma saatini ilan notuna yazarsın.",
      },
      {
        q: "Hadim veya Bozkır'daki bir keşfe kim başvurur?",
        a: "Bu adliyeleri çalışma bölgesi olarak seçmiş avukatlar başvurur. Küçük adliyelerde ilanı keşif tarihinden birkaç gün önce açmak ve yolu ücrete katmak başvuru şansını artırır.",
      },
      {
        q: "Konya'da tevkil ücretini nasıl belirlemeliyim?",
        a: "Ücreti sen yazarsın. Merkezdeki bir duruşma ile 150 kilometre uzaktaki Ereğli'de bir iş aynı emeği gerektirmez; yolu ve bekleme süresini hesaba katmak başvuru almanı kolaylaştırır.",
      },
      {
        q: "Konya Barosu'na kayıtlı olmayan avukat başvurabilir mi?",
        a: "Evet. Baro kimliğiyle doğrulanmış her avukat Konya adliyelerini çalışma bölgesi olarak seçip ilanlara başvurabilir.",
      },
    ],
  },

  gaziantep: {
    ad: "Gaziantep",
    guncelleme: "2026-10-14",
    konum: [37.07, 37.38],
    kart: "Nizip, İslâhiye ve Nurdağı",
    aciklama:
      "Gaziantep Adliyesi, Nizip, İslâhiye ya da Nurdağı'ndaki duruşman için Gaziantep'te çalışan doğrulanmış bir avukata tevkil ver. Üyelik ücretsiz.",
    baslik: "Nizip'ten Nurdağı'na, Gaziantep'teki duruşmana meslektaşın gitsin.",
    metin: "Merkezde bir icra takibi, İslâhiye'de bir deprem davası, Nizip'te bir celse. İlanı aç, o adliyede çalışan avukatlar başvursun.",
    merkez: ["gaziantep-adliyesi"],
    ekran: {
      detay: "Nizip Adliyesi",
      adliyeler: ["Gaziantep Adliyesi", "Nizip Adliyesi", "İslâhiye Adliyesi"],
    },
    giris:
      "Gaziantep, bölgenin ticaret ve sanayi merkezi olduğu için icra ve ticari dava yükü yüksek bir ildir. 6 Şubat 2023 depremlerinden en çok etkilenen ilçeler arasında yer alan Nurdağı ve İslâhiye'de görülen davalar ise birçok ilden avukatın takip ettiği dosyalardır. TevkilGO'da Gaziantep tevkil ilanını açarsın; işine o adliyede çalışan, baro kimliğiyle doğrulanmış bir muhabir avukat gider.",
    adliyeMetni:
      "Gaziantep'te merkezdeki Gaziantep Adliyesi ile Nizip, İslâhiye, Nurdağı ve Araban olmak üzere {adliye} adliye bulunur. Hangisinde ilan açarsan ilan, o adliyeyi çalışma bölgesi olarak seçmiş avukatlara bildirim olarak düşer.",
    adimMetni:
      "Gaziantep'te tevkil ilanını açtığında başvurular kısa süre toplanır ve hepsi aynı anda listelenir. Avukatların barosunu ve puanını görür, duruşma tevkilini kime vereceğini sen seçersin.",
    sssMetni: "Gaziantep'te tevkil, deprem davaları ve icra işleri hakkında en çok sorulanlar.",
    durumlar: [
      {
        ikon: "yargi",
        title: "Deprem davaları",
        text: "Nurdağı ve İslâhiye'deki deprem kaynaklı ceza ve tazminat davaları uzun süren, çok duruşmalı dosyalardır. İl dışından takip ettiğin celselere Gaziantep'teki meslektaşın girer.",
      },
      {
        ikon: "kurum",
        title: "İcra ve ticari işler",
        text: "Organize sanayi bölgeleri ve ticaret hacmi nedeniyle icra dairelerinde iş yoğundur. Haciz ve dosya işlemleri İcra İşlemleri türüyle ilan açılır.",
      },
      {
        ikon: "adliye",
        title: "Gaziantep Bölge Adliye Mahkemesi",
        text: "Çevre illerden gelen istinaf dosyaları Gaziantep'te görülür. İl dışından takip ettiğin istinaf duruşmasına Gaziantep'teki meslektaşın girer.",
      },
    ],
    sorular: [
      {
        q: "Nurdağı'ndaki deprem davası için tevkil verebilir miyim?",
        a: "Evet. İlanı Nurdağı Adliyesi'ni seçerek açar, mahkemeyi, esas numarasını ve duruşma saatini ilan notuna yazarsın. Duruşma başka bir salonda görülecekse bunu da belirtmelisin.",
      },
      {
        q: "Gaziantep'te haciz için tevkil verebilir miyim?",
        a: "Evet. İcra İşlemleri türüyle ilan açar, haciz adresini ve saatini ilan notuna yazarsın.",
      },
      {
        q: "Gaziantep Bölge Adliye Mahkemesi'ndeki istinaf duruşması için hangi adliyeyi seçmeliyim?",
        a: "Bölge adliye mahkemesi listede ayrıca yer almaz; ilanı Gaziantep Adliyesi'ni seçerek açar, daireyi ve duruşma saatini ilan notuna yazarsın.",
      },
      {
        q: "Gaziantep dışındayım, buradaki dosyam için tevkil verebilir miyim?",
        a: "Evet. İlan açarken işin görüleceği adliye seçilir; bulunduğun il fark etmez. İlan Gaziantep'te çalışan doğrulanmış avukatlara ulaşır.",
      },
      {
        q: "Gaziantep'te tevkil ücretini kim belirler?",
        a: "İlanı açan avukat belirler. Bazı iş türlerinde uygulamanın altına inilemeyen bir asgari tutarı vardır; ödeme taraflar arasında doğrudan yapılır.",
      },
    ],
  },

  kocaeli: {
    ad: "Kocaeli",
    guncelleme: "2026-10-14",
    konum: [40.77, 29.92],
    kart: "İzmit, Gebze ve Kandıra",
    aciklama:
      "Kocaeli Adliyesi, Gebze ya da Kandıra'daki duruşman için Kocaeli'de çalışan doğrulanmış bir avukata tevkil ver. İş davası ve icra işlerinde de ilan açılır.",
    baslik: "Gebze'den Kandıra'ya, Kocaeli'deki duruşmana meslektaşın gitsin.",
    metin: "Gebze'de bir iş davası, İzmit'te bir celse, Kandıra'da bir cezaevi görüşmesi. İlanı aç, o adliyede çalışan avukatlar başvursun.",
    merkez: ["kocaeli-adliyesi"],
    ekran: {
      detay: "Gebze Adliyesi",
      adliyeler: ["Kocaeli Adliyesi", "Gebze Adliyesi", "Körfez Adliyesi"],
    },
    giris:
      "Kocaeli, Türkiye'nin sanayi yoğunluğu en yüksek illerinden biridir; organize sanayi bölgeleri ve limanlar nedeniyle iş davaları ve iş kazası dosyaları ağırlıktadır. İzmit'teki Kocaeli Adliyesi'nin yanında İstanbul sınırındaki Gebze Adliyesi ilin en yoğun adliyelerindendir. TevkilGO'da Kocaeli tevkil ilanını açarsın; işine o adliyede çalışan, baro kimliğiyle doğrulanmış bir muhabir avukat gider.",
    adliyeMetni:
      "İzmit'teki Kocaeli Adliyesi ile Gebze, Gölcük, Körfez, Karamürsel ve Kandıra'da toplam {adliye} adliye bulunur. Hangisinde ilan açarsan ilan, o adliyeyi çalışma bölgesi olarak seçmiş avukatlara bildirim olarak gider.",
    adimMetni:
      "Kocaeli'de tevkil vermek için adliyeyi, iş türünü ve ücreti yazman yeterli. Başvuran avukatların barosunu ve puanını görür, kime tevkil vereceğine sen karar verirsin.",
    sssMetni: "Kocaeli'de tevkil, Gebze'deki işler ve cezaevi görüşmeleri hakkında en çok sorulanlar.",
    durumlar: [
      {
        ikon: "sanayi",
        title: "İş davaları ve iş kazaları",
        text: "Gebze, Dilovası ve Körfez'deki sanayi tesisleri nedeniyle iş mahkemelerinde yoğun bir dosya trafiği vardır. Çakışan celselerde o adliyedeki meslektaşına tevkil verirsin.",
      },
      {
        ikon: "yol",
        title: "İstanbul'a komşu Gebze",
        text: "Gebze, İstanbul'a İzmit'ten daha yakındır. İstanbul'daki bürolar Gebze'deki dosyaları sık takip eder; duruşma için gidiş dönüş trafiğe bağlı olarak saatler sürer.",
      },
      {
        ikon: "cezaevi",
        title: "Kandıra'daki görüşmeler",
        text: "Kandıra'daki ceza infaz kurumlarında müvekkil görüşmesi için Cezaevi Ziyareti türüyle ilan açılır.",
      },
    ],
    sorular: [
      {
        q: "İstanbul'dayım, Gebze'deki iş davası için tevkil verebilir miyim?",
        a: "Evet. İlanı Gebze Adliyesi'ni seçerek açarsın; ilan Gebze'de çalışan doğrulanmış avukatlara ulaşır.",
      },
      {
        q: "Kocaeli Adliyesi nerede?",
        a: "İzmit'tedir. Gebze, Gölcük, Körfez, Karamürsel ve Kandıra'nın kendi adliyeleri vardır; ilanı işin görüldüğü adliyede açmalısın.",
      },
      {
        q: "Kandıra'daki müvekkilimle görüşme için tevkil verebilir miyim?",
        a: "Evet. Cezaevi Ziyareti türüyle ve Kandıra Adliyesi'ni seçerek ilan açar, kurumu ve görüşme saatini ilan notuna yazarsın.",
      },
      {
        q: "İş kazası davasında keşif için tevkil verebilir miyim?",
        a: "Evet. Duruşma türüyle ilan açar, keşfin yapılacağı yeri ve saati ilan notuna yazarsın. Keşif uzun sürebileceği için bunu ücrete yansıtmak başvuru almanı kolaylaştırır.",
      },
      {
        q: "Kocaeli Barosu'na kayıtlı olmayan avukat başvurabilir mi?",
        a: "Evet. Baro kimliğiyle doğrulanmış her avukat Kocaeli adliyelerini çalışma bölgesi olarak seçip ilanlara başvurabilir.",
      },
    ],
  },

  kayseri: {
    ad: "Kayseri",
    guncelleme: "2026-10-14",
    konum: [38.73, 35.49],
    kart: "Develi, Yahyalı ve istinaf",
    aciklama:
      "Kayseri Adliyesi, Develi ya da Yahyalı'daki duruşman için Kayseri'de çalışan doğrulanmış bir avukata tevkil ver. Kayseri'deki {adliye} adliyede ilan açılır.",
    baslik: "Develi'den Sarız'a, Kayseri'deki duruşmana meslektaşın gitsin.",
    metin: "Merkezde bir icra takibi, Develi'de bir celse, Pınarbaşı'nda bir keşif. İlanı aç, o adliyede çalışan avukatlar başvursun.",
    merkez: ["kayseri-adliyesi"],
    ekran: {
      detay: "Develi Adliyesi",
      adliyeler: ["Kayseri Adliyesi", "Develi Adliyesi", "İncesu Adliyesi"],
    },
    giris:
      "Kayseri, İç Anadolu'nun ticaret ve sanayi merkezlerinden biridir; Kayseri Bölge Adliye Mahkemesi'nde çevre illerden gelen istinaf dosyaları görülür. Merkezdeki Kayseri Adliyesi'nin yanında Develi, Yahyalı, Pınarbaşı ve Sarız gibi merkeze uzak ilçe adliyeleri vardır. TevkilGO'da Kayseri tevkil ilanını açarsın; işine o adliyede çalışan, baro kimliğiyle doğrulanmış bir muhabir avukat gider.",
    adliyeMetni:
      "Kayseri Adliyesi başta olmak üzere ildeki {adliye} adliyede tevkil ilanı açabilirsin. İncesu'daki bir duruşma da Yahyalı'daki bir icra işi de yalnızca o adliyeyi çalışma bölgesi olarak seçmiş avukatlara bildirim olarak düşer.",
    adimMetni:
      "Kayseri'de tevkil ilanı açmak birkaç dakika sürer. Başvurular toplandıktan sonra avukatların barosunu ve puanını karşılaştırır, duruşma tevkilini kime vereceğini sen seçersin.",
    sssMetni: "Kayseri'de tevkil, istinaf duruşmaları ve ilçe adliyeleri hakkında en çok sorulanlar.",
    durumlar: [
      {
        ikon: "yargi",
        title: "İstinaf duruşmaları",
        text: "Kayseri Bölge Adliye Mahkemesi'nde çevre illerden gelen dosyalar görülür. İl dışından takip ettiğin istinaf duruşmasına Kayseri'deki meslektaşın girer.",
      },
      {
        ikon: "kurum",
        title: "İcra ve ticari işler",
        text: "Organize sanayi bölgesi ve mobilya sektörü nedeniyle ticari uyuşmazlıklar ve icra takipleri yoğundur. Haciz ve dosya işlemleri İcra İşlemleri türüyle ilan açılır.",
      },
      {
        ikon: "yol",
        title: "Doğudaki ilçeler",
        text: "Pınarbaşı ve Sarız ilin doğusunda, merkeze uzak adliyelerdir. Bu adliyelerdeki duruşma ve keşiflerde bölgede çalışan avukat yolu kısaltır.",
      },
    ],
    sorular: [
      {
        q: "Kayseri Bölge Adliye Mahkemesi'ndeki istinaf duruşması için tevkil verebilir miyim?",
        a: "Evet. Bölge adliye mahkemesi adliye listesinde ayrıca yer almaz; ilanı Kayseri Adliyesi'ni seçerek açar, daireyi ve duruşma saatini ilan notuna yazarsın.",
      },
      {
        q: "Develi'deki duruşmam için hangi adliyeyi seçmeliyim?",
        a: "Develi Adliyesi'ni seçmelisin. İlan, seçtiğin adliyeyi çalışma bölgesi olarak işaretlemiş avukatlara gider.",
      },
      {
        q: "Sarız veya Pınarbaşı'ndaki bir keşif için ne zaman ilan açmalıyım?",
        a: "Mümkün olduğunca erken. Bu adliyeleri çalışma bölgesi olarak seçen avukat sayısı merkeze göre azdır; birkaç gün önceden açılan ilan ve yolu karşılayan bir ücret başvuru almanı kolaylaştırır.",
      },
      {
        q: "Kayseri'de haciz için tevkil verebilir miyim?",
        a: "Evet. İcra İşlemleri türüyle ilan açar, haciz adresini ve saatini ilan notuna yazarsın.",
      },
      {
        q: "Kayseri dışındayım, buradaki davam için tevkil verebilir miyim?",
        a: "Evet. İlan açarken işin görüleceği adliye seçilir; bulunduğun il fark etmez. İlan Kayseri'de çalışan doğrulanmış avukatlara ulaşır.",
      },
    ],
  },
};

export function ilYolu(kod) {
  return `/${kod}-tevkil`;
}

export function yayindakiIller() {
  return Object.entries(ilIcerik)
    .map(([kod, icerik]) => ({ kod, ad: icerik.ad, yol: ilYolu(kod), guncelleme: icerik.guncelleme }))
    .sort((a, b) => a.ad.localeCompare(b.ad, "tr"));
}

function mesafe([enlem1, boylam1], [enlem2, boylam2]) {
  const r = Math.PI / 180;
  const a =
    Math.sin(((enlem2 - enlem1) * r) / 2) ** 2 +
    Math.cos(enlem1 * r) * Math.cos(enlem2 * r) * Math.sin(((boylam2 - boylam1) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

// Yayındaki illerden coğrafi olarak en yakın olanlar
export function yakinIller(kod, adet = 3) {
  const merkez = ilIcerik[kod].konum;
  return Object.entries(ilIcerik)
    .filter(([digerKod]) => digerKod !== kod)
    .map(([digerKod, icerik]) => ({
      kod: digerKod,
      ad: icerik.ad,
      kart: icerik.kart,
      yol: ilYolu(digerKod),
      km: mesafe(merkez, icerik.konum),
    }))
    .sort((a, b) => a.km - b.km)
    .slice(0, adet);
}
