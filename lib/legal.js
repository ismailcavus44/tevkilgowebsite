import { readFile } from "node:fs/promises";
import path from "node:path";

const FILES = {
  gizlilik: "gizlilik.md",
  kvkk: "kvkk.md",
  "kullanim-kosullari": "kullanim-kosullari.md",
};

export async function loadLegal(slug) {
  "use cache";
  const file = FILES[slug];
  if (!file) {
    throw new Error("Bilinmeyen yasal metin");
  }
  const raw = await readFile(
    path.join(process.cwd(), "content", "legal", file),
    "utf8",
  );
  return parseLegal(raw);
}

export function parseLegal(source) {
  const text = source.replace(/\r\n/g, "\n");
  const titleMatch = /^#\s+(.+)$/m.exec(text);
  const body = titleMatch ? text.replace(titleMatch[0], "").trimStart() : text;
  const slugger = createSlugger();
  const toc = [];

  for (const [, hashes, heading] of body.matchAll(/^(#{2,3})\s+(.+)$/gm)) {
    toc.push({ id: slugger(heading), text: heading.trim(), level: hashes.length });
  }

  return { title: titleMatch?.[1].trim() ?? "", body, toc };
}

// "6. Saklama süreleri" -> "saklama-sureleri"; numara atılır ki
// /gizlilik#saklama-sureleri gibi bağlantılar numaralandırma değişse de çalışsın.
export function slugify(value) {
  return value
    .trim()
    .replace(/^\d+(\.\d+)*\.?\s+/, "")
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "");
}

export function createSlugger() {
  const used = new Set();
  return (value) => {
    const seed = slugify(value) || "bolum";
    let id = seed;
    let n = 2;
    while (used.has(id)) {
      id = `${seed}-${n}`;
      n += 1;
    }
    used.add(id);
    return id;
  };
}
