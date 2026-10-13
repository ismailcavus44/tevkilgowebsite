import { LegalArticle } from "@/components/LegalArticle";
import { loadLegal } from "@/lib/legal";

export const metadata = { title: "Kullanım Koşulları" };

export default async function KosullarPage() {
  const doc = await loadLegal("kullanim-kosullari");
  return <LegalArticle doc={doc} />;
}
