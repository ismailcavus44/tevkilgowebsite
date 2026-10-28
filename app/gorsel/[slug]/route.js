import { yazi } from "@/lib/blog";
import { blogGorseli } from "@/lib/blog-gorsel";

// Blog yazısının paylaşım görseli, sabit adreste. Next'in opengraph-image adresi sonuna ek aldığı
// için şemadaki (BlogPosting.image) görsel bu adresten verilir.
export async function GET(_request, { params }) {
  const y = await yazi((await params).slug);
  if (!y) return new Response("Bulunamadı", { status: 404 });
  return blogGorseli(y);
}
