import { SplitView } from "@/components/SplitView";
import { IlanListesi } from "@/components/uygulama/IlanListesi";

export default function IlanlarLayout({ children }) {
  return <SplitView list={<IlanListesi />}>{children}</SplitView>;
}
