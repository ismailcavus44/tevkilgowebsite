const KALIN = "aıouâ";
const UNLU = "aeıioöuüâî";
const SERT = "fstkçşhp";

// Özel isme kesme işaretiyle hal eki getirir: ek("Ankara", "de") → "Ankara'da", ek("Muş", "de") → "Muş'ta"
export function ek(ad, tur) {
  const kucuk = ad.toLocaleLowerCase("tr");
  const sonUnlu = [...kucuk].reverse().find((harf) => UNLU.includes(harf));
  const kalin = KALIN.includes(sonUnlu);
  const sonHarf = kucuk.at(-1);

  if (tur === "de") return `${ad}'${SERT.includes(sonHarf) ? "t" : "d"}${kalin ? "a" : "e"}`;
  if (tur === "deki") return `${ek(ad, "de")}ki`;
  if (tur === "e") return `${ad}'${UNLU.includes(sonHarf) ? "y" : ""}${kalin ? "a" : "e"}`;
  throw new Error(`Bilinmeyen ek: ${tur}`);
}
