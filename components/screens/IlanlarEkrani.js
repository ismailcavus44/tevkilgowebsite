import { Baslik, Bolum, Cip, Ekran, IlanBlok, IlanSatiri, Segmentler } from "@/components/screens/ortak";

export function IlanlarEkrani() {
  return (
    <Ekran sekme="gorevler">
      <Baslik title="Görevler" pad={16} />
      <Segmentler aktif="ilanlar" />
      <div style={{ display: "flex", height: 48, alignItems: "center", gap: 8, padding: "0 16px" }}>
        <Cip label="Adliye" />
        <Cip label="Kategori" />
        <Cip label="Tarih" />
        <Cip label="En yakın" />
      </div>
      <div style={{ padding: "0 16px" }}>
        <Bolum baslik="BUGÜN · 2 İLAN" />
        <IlanBlok>
          <IlanSatiri
            kategori="Duruşma"
            ucret={3500}
            saat="11:00"
            adet={4}
            adliye="Ankara Batı Adliyesi"
            acil
          />
          <IlanSatiri
            kategori="Duruşma"
            ucret={2750}
            saat="14:00"
            adet={2}
            adliye="Ankara Adliyesi"
            son
          />
        </IlanBlok>
        <Bolum baslik="YARIN · 1 İLAN" />
        <IlanBlok>
          <IlanSatiri
            kategori="Duruşma"
            ucret={4200}
            saat="Yarın 09:30"
            adet={6}
            adliye="Sincan Adliyesi"
            basvuruldu
            son
          />
        </IlanBlok>
      </div>
    </Ekran>
  );
}
