import Link from "next/link";

// İçerik metinlerinde [[tevkil]] ana sayfaya, [[metin|/yol]] verilen yola bağlanır.
// Şema ve meta metinlerine işaretsiz hâli (duzMetin) yazılır.
const ISARET = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

export function duzMetin(metin) {
  return metin.replace(ISARET, "$1");
}

export function BagliMetin({ children }) {
  const parcalar = [];
  let son = 0;
  for (const eslesme of children.matchAll(ISARET)) {
    parcalar.push(children.slice(son, eslesme.index));
    parcalar.push(
      <Link
        key={eslesme.index}
        href={eslesme[2] || "/"}
        className="font-semibold text-ink underline underline-offset-4"
      >
        {eslesme[1]}
      </Link>,
    );
    son = eslesme.index + eslesme[0].length;
  }
  parcalar.push(children.slice(son));
  return parcalar;
}
