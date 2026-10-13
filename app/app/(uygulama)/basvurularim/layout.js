import { SplitView } from "@/components/SplitView";
import { KayitListesi } from "@/components/uygulama/KayitListesi";

export default function BasvurularLayout({ children }) {
  return (
    <SplitView list={<KayitListesi rol="basvuran" baslik="Başvurularım" taban="/app/basvurularim" />}>
      {children}
    </SplitView>
  );
}
