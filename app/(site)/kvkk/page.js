import { LegalArticle } from "@/components/LegalArticle";
import { loadLegal } from "@/lib/legal";

export const metadata = { title: "KVKK Aydınlatma Metni" };

export default async function KvkkPage() {
  const doc = await loadLegal("kvkk");
  return <LegalArticle doc={doc} />;
}
