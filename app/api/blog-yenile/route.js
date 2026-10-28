import { revalidateTag } from "next/cache";

// Panel bir yazıyı kaydettiğinde çağırır; blog önbelleği bir sonraki ziyarette tazelenir.
// Anahtar Vercel'de ve panelin .env.local dosyasında BLOG_YENILEME_ANAHTARI olarak aynı olmalı.
export async function POST(request) {
  const anahtar = process.env.BLOG_YENILEME_ANAHTARI;
  const gelen = (request.headers.get("authorization") || "").replace(/^Bearer /, "");
  if (!anahtar || gelen !== anahtar) {
    return Response.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { sluglar = [] } = await request.json().catch(() => ({}));
  revalidateTag("blog", { expire: 0 });
  for (const slug of sluglar) {
    if (typeof slug === "string" && /^[a-z0-9-]{1,90}$/.test(slug)) revalidateTag(`blog:${slug}`, { expire: 0 });
  }
  return Response.json({ tamam: true });
}
