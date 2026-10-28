import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import sanitize from "sanitize-html";

// Blog yazıları panelden yazılır, burada yalnızca okunur. Anonim istemci RLS gereği yalnızca
// yayındaki ve yayın tarihi gelmiş yazıları görür. Önbellek "blog" etiketiyle tutulur; panel
// kaydettiğinde /api/blog-yenile etiketi düşürür, düşürmese de birkaç dakikada yenilenir.

export const SITE = "https://www.tevkilgo.org";


export const KATEGORILER = {
  rehber: "Rehber",
  ucret: "Ücret",
  dilekce: "Dilekçe ve evrak",
  uyap: "UYAP",
  adliye: "Adliye rehberi",
  meslek: "Meslek hayatı",
};

const KART_ALANLARI = "slug, baslik, ozet, kategori, kapak_url, kapak_alt, yayin_tarihi, guncelleme_tarihi";

function istemci() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Tablo henüz kurulmamışsa ya da veritabanına ulaşılamazsa site çökmez; blog boş görünür
export async function yazilar() {
  "use cache";
  cacheTag("blog");
  cacheLife("minutes");

  const { data, error } = await istemci()
    .from("blog_yazilari")
    .select(KART_ALANLARI)
    .order("yayin_tarihi", { ascending: false });
  if (error) {
    console.error("Blog yazıları okunamadı", error.message);
    return [];
  }
  return data;
}

export async function yazi(slug) {
  "use cache";
  cacheTag("blog", `blog:${slug}`);
  cacheLife("minutes");

  const { data, error } = await istemci()
    .from("blog_yazilari")
    .select(`${KART_ALANLARI}, meta_baslik, meta_aciklama, icerik, sss`)
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("Blog yazısı okunamadı", error.message);
    return null;
  }
  return data;
}

// Önce aynı kategori, sonra en yeniler
export async function ilgiliYazilar(slug, kategori, adet = 3) {
  const tum = (await yazilar()).filter((y) => y.slug !== slug);
  return [...tum.filter((y) => y.kategori === kategori), ...tum.filter((y) => y.kategori !== kategori)].slice(0, adet);
}

export function tarihYaz(iso) {
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" }).format(
    new Date(iso),
  );
}

// Güncelleme, yayından en az bir gün sonraysa ayrıca gösterilir
export function guncellendiMi(y) {
  return new Date(y.guncelleme_tarihi) - new Date(y.yayin_tarihi) > 24 * 60 * 60 * 1000;
}

// ---------------------------------------------------------------------------------------------
// Gövde HTML'i: panel editörünün (Tiptap) çıktısı temizlenir, sınıflar atılır ve bloklar
// data-type işaretlerine göre globals.css'teki .blog-govde kurallarıyla biçimlenir.

const IZINLI = {
  allowedTags: [
    "h2", "h3", "h4", "p", "br", "ul", "ol", "li", "a", "strong", "em", "b", "i", "u", "s",
    "table", "thead", "tbody", "tr", "th", "td", "colgroup", "col",
    "div", "span", "section", "blockquote", "cite", "sup", "sub",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    th: ["colspan", "rowspan"],
    td: ["colspan", "rowspan"],
    "*": ["data-type", "data-footnote-id", "data-cta-type", "aria-hidden"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href || "";
      const dis = /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?tevkilgo\.org/i.test(href);
      const rel = new Set((attribs.rel || "").split(/\s+/).filter(Boolean));
      if (/(?:drive|docs)\.google\.com/i.test(href)) rel.add("nofollow");
      if (dis || attribs.target === "_blank") {
        rel.add("noopener");
        rel.add("noreferrer");
      }
      const yeni = { href: href.replace(/^https?:\/\/(www\.)?tevkilgo\.org(?=\/|$)/i, "") || "/" };
      if (attribs.target === "_blank" || dis) yeni.target = "_blank";
      if (rel.size) yeni.rel = [...rel].join(" ");
      return { tagName, attribs: yeni };
    },
  },
};

const TR = { ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u" };

function metin(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function kimlik(yazi) {
  return (
    yazi
      .toLocaleLowerCase("tr")
      .replace(/[çğıiöşüâîû]/g, (h) => TR[h])
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60) || "baslik"
  );
}

export function govdeHazirla(html) {
  let govde = sanitize(html || "", IZINLI);

  // Başlıklara kimlik ver, içindekiler listesini çıkar
  const icindekiler = [];
  const kullanilan = new Set();
  govde = govde.replace(/<(h[23])>([\s\S]*?)<\/\1>/g, (_, etiket, ic) => {
    const ad = metin(ic);
    let id = kimlik(ad);
    for (let n = 2; kullanilan.has(id); n++) id = `${kimlik(ad)}-${n}`;
    kullanilan.add(id);
    icindekiler.push({ id, ad, seviye: etiket === "h2" ? 2 : 3 });
    return `<${etiket} id="${id}">${ic}</${etiket}>`;
  });

  // Dipnotlar: metindeki ilk görünme sırasına göre numaralanır, iki yönlü bağlanır
  // sanitize-html öznitelik sırasını korur; Tiptap sırası sabit olmadığından öznitelikler ayrı okunur
  const oz = (oznitelikler, ad) => oznitelikler.match(new RegExp(`${ad}="([^"]*)"`))?.[1];
  const REF = /<sup ([^>]*data-type="footnoteReference"[^>]*)>(?:[\s\S]*?)<\/sup>/g;
  const sira = [];
  for (const [, oznitelikler] of govde.matchAll(REF)) {
    const id = oz(oznitelikler, "data-footnote-id");
    if (id && !sira.includes(id)) sira.push(id);
  }
  const gorulen = new Map();
  govde = govde.replace(REF, (_, oznitelikler) => {
    const id = oz(oznitelikler, "data-footnote-id");
    const n = sira.indexOf(id) + 1;
    if (!n) return "";
    const kez = (gorulen.get(id) || 0) + 1;
    gorulen.set(id, kez);
    return `<sup class="dipnot-isaret" id="fnref-${n}${kez > 1 ? `-${kez}` : ""}"><a href="#fn-${n}" aria-label="Dipnot ${n}">[${n}]</a></sup>`;
  });
  const kaynaklar = [];
  govde = govde.replace(/<div ([^>]*data-type="footnoteItem"[^>]*)>([\s\S]*?)<\/div>/g, (_, oznitelikler, ic) => {
    const n = sira.indexOf(oz(oznitelikler, "data-footnote-id")) + 1;
    if (!n) return "";
    kaynaklar[n - 1] = metin(ic);
    return `<li id="fn-${n}" value="${n}">${ic.replace(/<\/?p>/g, " ").trim()} <a href="#fnref-${n}" class="dipnot-don" aria-label="Metne dön">↩</a></li>`;
  });
  govde = govde
    .replace(/<section [^>]*data-type="footnoteList"[^>]*>([\s\S]*?)<\/section>/, (_, ic) =>
      ic.trim() ? `<section class="dipnotlar" aria-label="Dipnotlar"><h2 id="dipnotlar">Dipnotlar</h2><ol>${ic}</ol></section>` : "",
    );

  // Geniş tablolar telefonda yatay kayar
  govde = govde.replace(/<table>/g, '<div class="tablo"><table>').replace(/<\/table>/g, "</table></div>");

  const duz = metin(govde);
  const kelime = duz ? duz.split(" ").length : 0;
  return {
    html: govde,
    icindekiler: icindekiler.filter((b) => b.id !== "dipnotlar"),
    kaynaklar: kaynaklar.filter(Boolean),
    kelime,
    dakika: Math.max(1, Math.round(kelime / 200)),
  };
}
