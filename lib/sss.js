export const SSS_VARSAYILAN = {
  gunluk_kabul_limit: 3,
  max_basvuru: 10,
  max_bekleyen_basvuru: 5,
  bolge_kilit_saat: 24,
  bolge_max_adliye: 3,
  limit_reset_saat: 9,
  secim_hatirlatma_saat: 2,
  adliye_mod_dakika: 60,
  gece_mod_dakika: 60,
  mod_gunluk_hak: 1,
  gece_baslangic_saat: 18,
  gece_bitis_saat: 8,
  basvuru_toplama_dakika: 5,
};

const SAAT_ANAHTARLARI = ['limit_reset_saat', 'gece_baslangic_saat', 'gece_bitis_saat'];

export function sssDegerleri(satirlar) {
  const degerler = { ...SSS_VARSAYILAN };
  (satirlar || []).forEach((satir) => {
    if (satir?.anahtar != null && satir.deger != null && satir.deger !== '') {
      degerler[satir.anahtar] = satir.deger;
    }
  });
  SAAT_ANAHTARLARI.forEach((anahtar) => {
    const sayi = Number(degerler[anahtar]);
    degerler[anahtar] = String(Number.isFinite(sayi) ? sayi : degerler[anahtar]).padStart(2, '0');
  });
  return degerler;
}

export function sssMetinDoldur(metin, degerler) {
  return String(metin).replace(/\{([a-z0-9_]+)\}/g, (_, anahtar) => (
    degerler[anahtar] != null ? String(degerler[anahtar]) : ''
  ));
}

export const SSS = [
  {
    baslik: 'Başlarken',
    sorular: [
      {
        soru: 'TevkilGO nedir?',
        cevap: 'Avukatların duruşma, savcılık, icra ve kurum işlerini birbirine güvenle devrettiği, yalnızca kimliği doğrulanmış avukatlara açık bir platformdur. İki yolu vardır: planlı işler için ilan açıp başvuranlar arasından seçim yaparsınız; acil işler için o an adliyede ya da nöbette olan meslektaşınızı Müsait listesinden doğrudan ararsınız.',
      },
      {
        soru: 'Kimliğim neden hâlâ onaylanmadı?',
        cevap: 'Yüklediğiniz baro kimlik kartı elle incelenir. İnceleme tamamlandığında uygulamaya bildirim gelir; bu ekrandayken uygulamayı yeniden açtığınızda durum kendiliğinden güncellenir.',
      },
      {
        soru: 'Kimliğim neden reddedildi?',
        cevap: 'Ret nedeni doğrulama ekranında yazar. Genellikle kart okunaksızdır ya da kayıt bilgileriyle eşleşmez. Kartınızın ön yüzünü iyi ışıkta, bütün yazılar okunacak şekilde yeniden yükleyebilirsiniz.',
      },
      {
        soru: 'Yüklediğim kimlik kartı ne oluyor?',
        cevap: 'Yalnızca avukatlığınızı doğrulamak için kullanılır ve inceleme biter bitmez, onaylansa da reddedilse de sistemden kalıcı olarak silinir.',
      },
    ],
  },
  {
    baslik: 'Profil',
    sorular: [
      {
        soru: 'Adımı veya baromu neden değiştiremiyorum?',
        cevap: 'Ad soyad ve baro kimliğinizle doğrulanan bilgilerdir; doğrulamanın anlamlı kalması için uygulamadan değiştirilemez. Baro nakli veya soyadı değişikliği gibi durumlarda Profil → Bize Yazın üzerinden talepte bulunun, kontrol edilip güncellenir.',
      },
      {
        soru: 'Profilde neleri değiştirebilirim?',
        cevap: 'Telefon numaranızı, profil fotoğrafınızı ve iş kategorilerinizi istediğiniz zaman; çalıştığınız bölgeyi ise {bolge_kilit_saat} saatte bir değiştirebilirsiniz.',
      },
      {
        soru: 'Telefon numaram kimlere görünüyor?',
        cevap: 'İki durumda görünür: bir görevde seçildiğinizde veya birini seçtiğinizde yalnızca karşı tarafa; adliye ya da gece modunu açtığınızda mod süresince Müsait listesindeki meslektaşlara. Bunların dışında numaranız kimseye gösterilmez.',
      },
    ],
  },
  {
    baslik: 'Bölge ve Adliye',
    sorular: [
      {
        soru: 'Çalıştığım bölge ne işe yarıyor?',
        cevap: 'Hangi adliyelerin ilanlarını göreceğinizi ve hangi adliyelerde açılan görevler için bildirim alacağınızı belirler. Bir ilde en fazla {bolge_max_adliye} adliye seçebilirsiniz.',
      },
      {
        soru: 'Bölgemi neden hemen değiştiremiyorum?',
        cevap: 'Bölgenizi {bolge_kilit_saat} saatte bir değiştirebilirsiniz. Bu sınır, bölgeden bölgeye geçerek ilan toplanmasını önler ve iş dağılımını adil tutar.',
      },
      {
        soru: 'Kategoriler ne işe yarıyor?',
        cevap: 'Hangi tür yeni ilanlar için bildirim alacağınızı belirler. Hiç kategori seçmezseniz bölgenizdeki her ilan için bildirim alırsınız. İlanlar ekranında kategorilerinizden bağımsız olarak bölgenizdeki bütün ilanları görürsünüz.',
      },
      {
        soru: 'Adliyem listede yok veya adı yanlış.',
        cevap: 'Adliye listesi Hâkimler ve Savcılar Kurulu\'nun yargı çevresi kararlarına göre tutulur. Eksik veya hatalı bir kayıt görürseniz Bize Yazın\'dan bildirin. Adının yanında "teyit bekleniyor" yazan adliyeler yeni kurulmuş olup resmi teyidi beklenen adliyelerdir; seçilebilir ve kullanılabilirler.',
      },
    ],
  },
  {
    baslik: 'İlanlar ve Başvuru',
    sorular: [
      {
        soru: 'Neden hiç ilan göremiyorum?',
        cevap: 'Önce profilinizde çalıştığınız bölgeyi seçtiğinizden emin olun. İlanlar yalnızca seçtiğiniz adliyelerde, tarihi geçmemiş ve başvuru kontenjanı dolmamış olanlar arasından gösterilir. Başvurduğunuz ilanlar varsayılan olarak gizlenir; Sırala menüsündeki "Başvurduklarımı gizle" ayarını kapatarak görebilirsiniz.',
      },
      {
        soru: 'Bir ilana neden başvuramıyorum?',
        cevap: 'Şu durumlardan biri geçerlidir: günlük görev limitiniz ({gunluk_kabul_limit}) dolmuştur; aynı anda tutabileceğiniz {max_bekleyen_basvuru} bekleyen başvuru sınırına ulaşmışsınızdır; ilanın {max_basvuru} kişilik başvuru kontenjanı dolmuştur; ilanın adliyesi bölgenizde değildir ya da hesabınız askıdadır. Hata mesajı hangisi olduğunu söyler.',
      },
      {
        soru: 'Neden günde en fazla {gunluk_kabul_limit} görev alabiliyorum?',
        cevap: 'İşlerin birkaç kişide toplanmasını önlemek ve her meslektaşa iş alma fırsatı tanımak için. Limit her sabah {limit_reset_saat}:00\'da yenilenir.',
      },
      {
        soru: 'Başvurum neden kendiliğinden geri çekildi?',
        cevap: 'Günlük görev limitiniz dolduğunda bekleyen diğer başvurularınız otomatik olarak geri çekilir; böylece görev verenler alamayacağınız işler için sizi beklemez.',
      },
      {
        soru: 'İlk başvuran görevi alır mı?',
        cevap: 'Hayır. Görev açıldıktan sonraki ilk {basvuru_toplama_dakika} dakika boyunca başvurular toplanır ve görev veren başvuranları göremez; bu sürede başvuran herkes aynı anda listelenir. Listede önce puan ortalaması yüksek olanlar yer alır, henüz değerlendirmesi olmayanlar başvuru sırasına göre sıralanır. Seçimi görev veren yapar.',
      },
      {
        soru: 'Seçilip seçilmediğimi nasıl anlarım?',
        cevap: 'Seçildiğinizde ya da başka bir meslektaş seçildiğinde bildirim gelir. Seçildiğiniz görevlerde görev verenin adı, sicili ve telefonu açılır; seçilmediğiniz başvurular Başvurularım listesinden kalkar.',
      },
      {
        soru: 'Başvurumu geri çekebilir miyim?',
        cevap: 'Seçim yapılmadan önce Görevler → Başvurularım bölümünden geri çekebilirsiniz.',
      },
    ],
  },
  {
    baslik: 'Görev Vermek',
    sorular: [
      {
        soru: 'İlan açınca neden başvuranları hemen göremiyorum?',
        cevap: 'İlk {basvuru_toplama_dakika} dakika başvurular toplanır. Bu süre ilk tıklayanın değil, en uygun meslektaşın seçilebilmesi içindir. Süre dolunca başvuranlar listelenir ve size bildirim gelir.',
      },
      {
        soru: 'Başvuranların adları neden gizli?',
        cevap: 'Klasik tevkil gruplarındaki telefon trafiğini ve kayırmacılığı önlemek için. Seçimi baro, tamamlanan görev sayısı, puan ortalaması ve üyelik süresine bakarak yaparsınız. Seçtiğiniz anda iki taraf birbirinin adını, sicilini ve telefonunu görür.',
      },
      {
        soru: '"Düşük puan" rozeti ne demek?',
        cevap: 'Puan ortalaması düşük olan meslektaşları gösterir. Bilgilendirme amaçlıdır, seçiminizi engellemez; karar sizindir.',
      },
      {
        soru: 'Neden belirli bir ücretin altında ilan açamıyorum?',
        cevap: 'Bazı iş türleri için asgari ücret belirlenmiştir. Ücret alanının altında o iş için geçerli asgari tutar yazar.',
      },
      {
        soru: 'İlanımı neden düzenleyemiyorum?',
        cevap: 'İlan, başvuru gelene kadar düzenlenebilir. Başvuru geldikten sonra şartlar değiştirilemez; seçim yapmadan önce ilanı iptal edip yenisini açabilirsiniz.',
      },
      {
        soru: 'Kimse başvurmazsa ya da seçim yapmazsam ne olur?',
        cevap: 'Başvuru geldiği hâlde seçim yapmazsanız {secim_hatirlatma_saat} saat sonra hatırlatma gönderilir. Görev tarihi geçtiğinde ilan otomatik olarak kapanır ve başvuranlar bilgilendirilir.',
      },
      {
        soru: 'Ödemeyi nasıl yapacağım?',
        cevap: 'Ödeme taraflar arasında doğrudan yapılır. TevkilGO ödeme almaz ve ödemeye aracılık etmez.',
      },
    ],
  },
  {
    baslik: 'Adliye ve Gece Modu',
    sorular: [
      {
        soru: 'Adliye modu nedir?',
        cevap: 'Adliyedeyken açtığınız müsaitlik modudur. Mod açıkken adınız ve telefonunuz, seçtiğiniz adliyede Müsait listesinde görünür; acil işi olan meslektaşınız sizi doğrudan arayabilir.',
      },
      {
        soru: 'Gece modu nedir?',
        cevap: 'Cezaevi görüşmesi, karakol ifadesi, sulh ceza sorgusu gibi gece yapılması gereken işler için müsait olduğunuzu bildiren moddur. {gece_baslangic_saat}:00 ile {gece_bitis_saat}:00 arasında açılabilir.',
      },
      {
        soru: 'Modu açınca hangi adliyede görünürüm?',
        cevap: 'Yalnızca açarken seçtiğiniz adliyede. Profilinizde birden fazla adliye olsa da mod tek bir adliyeye bağlıdır; böylece sizi arayan meslektaşınız ulaşabileceğiniz yeri bilir.',
      },
      {
        soru: 'Mod ne kadar sürer, neden tekrar açamıyorum?',
        cevap: 'Adliye modu {adliye_mod_dakika}, gece modu {gece_mod_dakika} dakika sürer. Her modu günde {mod_gunluk_hak} kez açabilirsiniz; erken kapatırsanız o gün aynı modu tekrar açamazsınız. Haklar her sabah {limit_reset_saat}:00\'da yenilenir.',
      },
      {
        soru: 'Mod açmak için ne gerekiyor?',
        cevap: 'Profilinizde telefon numarası kayıtlı olmalı ve modu çalıştığınız bölgedeki bir adliye için açmalısınız.',
      },
      {
        soru: 'Müsait listesinde neden kimse yok?',
        cevap: 'Liste yalnızca o an modu açık meslektaşları gösterir. İl ve adliye filtresini değiştirerek başka yerlere bakabilirsiniz.',
      },
    ],
  },
  {
    baslik: 'Güven ve Kurallar',
    sorular: [
      {
        soru: 'Puanlama nasıl işliyor?',
        cevap: 'Görev tamamlandığında görevi veren, görevi yapan meslektaşı 1 ile 5 arasında bir kez puanlar; verilen puan değiştirilemez. Ortalamanız ve değerlendirme sayınız sonraki başvurularınızda görev verenlere gösterilir.',
      },
      {
        soru: 'Bir meslektaşı nasıl şikayet ederim? Karşı taraf görür mü?',
        cevap: 'Atanmış veya tamamlanmış bir görevin detayındaki "Şikayet Et" butonunu kullanın. Şikayetiniz yönetim tarafından incelenir; şikayet edilen kişiye şikayetçinin kimliği bildirilmez.',
      },
      {
        soru: 'Hesabım neden askıya alındı?',
        cevap: 'Kuralları ihlal eden hesaplar süreli olarak askıya alınabilir veya kalıcı olarak yasaklanabilir; neden askı ekranında yazar. Askı süresince görev oluşturamaz, başvuru yapamaz ve mod açamazsınız; süre dolunca hesabınız kendiliğinden açılır.',
      },
    ],
  },
  {
    baslik: 'Bildirimler',
    sorular: [
      {
        soru: 'Bildirimler nasıl geliyor?',
        cevap: 'Uygulama açıkken yeni bildirimler anında ekranın üstünde görünür ve Bildirimler sekmesine düşer. Telefon bildirimleri yakında eklenecek.',
      },
      {
        soru: '"Yeni başvuru" bildirimleri neden hemen gelmiyor?',
        cevap: 'İlanın ilk {basvuru_toplama_dakika} dakikasında başvurular toplanır; bu süre dolunca kaç başvuru geldiğini bildiren tek bir bildirim alırsınız.',
      },
    ],
  },
  {
    baslik: 'Hesap ve Veriler',
    sorular: [
      {
        soru: 'Hesabımı nasıl silerim, neden silemiyorum?',
        cevap: 'Profil → Hesabımı Sil. İleri tarihli atanmış bir göreviniz varken veya hesabınız askıdayken silemezsiniz. Silindiğinde açık ilanlarınız iptal edilir, ad, telefon, baro, sicil ve fotoğraf gibi kişisel bilgileriniz silinir; puan ve şikayet kayıtları kimliğiniz olmadan saklanır.',
      },
      {
        soru: 'Konumumu kullanıyor musunuz?',
        cevap: 'Hayır. Uygulama konum izni istemez; hangi adliyede bulunduğunuzu kendiniz seçersiniz.',
      },
      {
        soru: 'Size nasıl ulaşırım?',
        cevap: 'Profil → Bize Yazın bölümünden soru, öneri veya şikayetinizi iletebilirsiniz. Cevabımız uygulamadaki taleplerinize ve bildirimlerinize düşer.',
      },
    ],
  },
];

export const HESAP_SILME_METNI = SSS
  .find((grup) => grup.baslik === 'Hesap ve Veriler')
  .sorular.find((soru) => soru.soru.startsWith('Hesabımı nasıl silerim')).cevap;
