import { SplitView } from "@/components/SplitView";
import { BildirimListesi } from "@/components/uygulama/Bildirimler";

export default function BildirimlerLayout({ children }) {
  return <SplitView list={<BildirimListesi />}>{children}</SplitView>;
}
