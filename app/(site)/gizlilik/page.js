import { LegalArticle } from "@/components/LegalArticle";
import { loadLegal } from "@/lib/legal";

export const metadata = { title: "Gizlilik Politikası" };

export default async function GizlilikPage() {
  const doc = await loadLegal("gizlilik");
  return <LegalArticle doc={doc} />;
}
