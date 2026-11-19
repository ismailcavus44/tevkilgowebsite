"use client";

import { useEffect } from "react";

// Yazıdaki belge örneklerine (data-type="document-sample") "Kopyala" düğmesi ekler.
// Panoya iki biçim yazılır: Word'e biçimiyle yapışan HTML ve düz metin.
// Gövde sunucuda HTML olarak geldiği için düğme sonradan DOM'a eklenir.

const SATIR = '[data-type="document-row"]';

function satirlar(deger) {
  return deger.innerText.split("\n").map((s) => s.trim()).filter(Boolean);
}

function duzMetin(belge) {
  const parcalar = [];
  for (const el of belge.children) {
    const tur = el.getAttribute("data-type");
    if (tur === "document-title") parcalar.push(el.innerText.trim(), "");
    else if (tur === "document-row") {
      const etiket = el.querySelector('[data-type="document-label"]').innerText.trim();
      const [ilk = "", ...diger] = satirlar(el.querySelector('[data-type="document-value"]'));
      parcalar.push(`${etiket}\t: ${ilk}`, ...diger.map((s) => `\t  ${s}`), "");
    } else if (tur === "document-text") parcalar.push(el.innerText.trim(), "");
    else if (tur === "document-signature") parcalar.push(...satirlar(el));
  }
  return parcalar.join("\n").trim();
}

// Word ve benzeri editörler satır içi stilleri korur; tablo kullanılmaz, etiketler sekmeyle hizalanır.
function wordHtml(belge) {
  const yazi = "font-family:'Times New Roman',serif;font-size:12pt;line-height:1.5;";
  const parcalar = [];
  for (const el of belge.children) {
    const tur = el.getAttribute("data-type");
    if (tur === "document-title") {
      parcalar.push(`<p style="${yazi}text-align:center;font-weight:bold;">${el.innerHTML}</p><p style="${yazi}">&nbsp;</p>`);
    } else if (tur === "document-row") {
      const etiket = el.querySelector('[data-type="document-label"]').innerHTML;
      const deger = el.querySelector('[data-type="document-value"]').innerHTML;
      parcalar.push(
        `<p style="${yazi}margin-left:6.5cm;text-indent:-6.5cm;"><u>${etiket}</u>\t: ${deger}</p>`,
      );
    } else if (tur === "document-text") {
      parcalar.push(`<p style="${yazi}text-align:justify;text-indent:1.25cm;">${el.innerHTML}</p>`);
    } else if (tur === "document-signature") {
      parcalar.push(`<p style="${yazi}">&nbsp;</p><p style="${yazi}text-align:right;">${el.innerHTML}</p>`);
    }
  }
  return `<div>${parcalar.join("")}</div>`;
}

async function kopyala(belge) {
  const metin = duzMetin(belge);
  try {
    if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": new Blob([metin], { type: "text/plain" }),
          "text/html": new Blob([wordHtml(belge)], { type: "text/html" }),
        }),
      ]);
    } else {
      await navigator.clipboard.writeText(metin);
    }
    return true;
  } catch {
    return false;
  }
}

export function BelgeKopyala() {
  useEffect(() => {
    const dugmeler = [];
    for (const belge of document.querySelectorAll('.blog-govde [data-type="document-sample"]')) {
      if (!belge.querySelector(SATIR) || belge.querySelector(":scope > button")) continue;
      const dugme = document.createElement("button");
      dugme.type = "button";
      dugme.textContent = "Kopyala";
      dugme.setAttribute("aria-label", "Belge örneğini kopyala");
      let zamanlayici;
      dugme.addEventListener("click", async () => {
        const tamam = await kopyala(belge);
        dugme.textContent = tamam ? "Kopyalandı" : "Kopyalanamadı";
        clearTimeout(zamanlayici);
        zamanlayici = setTimeout(() => {
          dugme.textContent = "Kopyala";
        }, 2000);
      });
      belge.prepend(dugme);
      dugmeler.push(dugme);
    }
    return () => dugmeler.forEach((d) => d.remove());
  }, []);

  return null;
}
