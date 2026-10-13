import { SplitView } from "@/components/SplitView";
import { KayitListesi } from "@/components/uygulama/KayitListesi";

export default function GorevlerLayout({ children }) {
  return (
    <SplitView list={<KayitListesi rol="olusturan" baslik="Görevlerim" taban="/app/gorevlerim" />}>
      {children}
    </SplitView>
  );
}
