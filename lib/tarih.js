export function ymdIstanbul(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function gunEkle(ymd, gun) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + gun));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function gunBaslangic(ymd) {
  return new Date(`${ymd}T00:00:00+03:00`).toISOString();
}

export function tarihAraligi(tur) {
  const bugun = ymdIstanbul();
  if (tur === "bugun") return { gte: gunBaslangic(bugun), lt: gunBaslangic(gunEkle(bugun, 1)) };
  if (tur === "yarin") {
    const yarin = gunEkle(bugun, 1);
    return { gte: gunBaslangic(yarin), lt: gunBaslangic(gunEkle(yarin, 1)) };
  }
  if (tur === "hafta") {
    const weekday = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Istanbul", weekday: "short" }).format(new Date());
    const index = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[weekday] ?? 0;
    const bas = gunEkle(bugun, -index);
    return { gte: gunBaslangic(bas), lt: gunBaslangic(gunEkle(bas, 7)) };
  }
  return null;
}

const IST = { timeZone: "Europe/Istanbul" };

export function tarihSaat(iso, uzun = false) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: uzun ? "long" : "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...IST,
  });
}

export function tarihGun(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("tr-TR", { month: "long", year: "numeric", ...IST });
}

export function istanbulParcalari(iso) {
  if (!iso) return { tarih: "", saat: "" };
  const tarih = new Intl.DateTimeFormat("en-CA", { ...IST, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
  const saat = new Intl.DateTimeFormat("en-GB", { ...IST, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(iso));
  return { tarih, saat };
}

export function istanbulAn(tarih, saat) {
  return new Date(`${tarih}T${saat}:00+03:00`).toISOString();
}

function istanbulSaat(date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const al = (tip) => parts.find((parca) => parca.type === tip)?.value || "0";
  return {
    ymd: `${al("year")}-${al("month")}-${al("day")}`,
    saat: Number(al("hour")) % 24,
    dakika: Number(al("minute")),
    saniye: Number(al("second")),
  };
}

export function enErkenSaat(an = new Date()) {
  const p = istanbulSaat(an);
  let toplam = p.saat * 60 + p.dakika;
  const kalinti = toplam % 5;
  if (p.saniye > 0 || kalinti !== 0) toplam += kalinti === 0 ? 5 : 5 - kalinti;
  if (toplam >= 24 * 60) return { uygun: false, saat: "" };
  const sa = String(Math.floor(toplam / 60)).padStart(2, "0");
  const dk = String(toplam % 60).padStart(2, "0");
  return { uygun: true, saat: `${sa}:${dk}` };
}

export function bugunAraligi() {
  return tarihAraligi("bugun");
}

export function gunBasligi(iso) {
  const ymd = ymdIstanbul(new Date(iso));
  const bugun = ymdIstanbul();
  if (ymd === bugun) return "Bugün";
  if (ymd === gunEkle(bugun, 1)) return "Yarın";
  const date = new Date(`${ymd}T12:00:00+03:00`);
  const day = new Intl.DateTimeFormat("tr-TR", { day: "numeric", timeZone: "Europe/Istanbul" }).format(date);
  const month = new Intl.DateTimeFormat("tr-TR", { month: "long", timeZone: "Europe/Istanbul" }).format(date);
  let weekday = new Intl.DateTimeFormat("tr-TR", { weekday: "long", timeZone: "Europe/Istanbul" }).format(date);
  weekday = weekday.charAt(0).toLocaleUpperCase("tr-TR") + weekday.slice(1);
  return `${day} ${month} ${weekday}`;
}

export function saatYazi(iso, gruplu) {
  const date = new Date(iso);
  const saat = new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Europe/Istanbul",
  }).format(date);
  if (gruplu) return saat;
  const gun = new Intl.DateTimeFormat("tr-TR", { day: "numeric", timeZone: "Europe/Istanbul" }).format(date);
  let ay = new Intl.DateTimeFormat("tr-TR", { month: "short", timeZone: "Europe/Istanbul" }).format(date);
  ay = ay.replace(".", "");
  return `${gun} ${ay} ${saat}`;
}

export function kisaTarihSaat(iso) {
  if (!iso) return "";
  const yazi = saatYazi(iso);
  const bosluk = yazi.lastIndexOf(" ");
  if (bosluk < 0) return yazi;
  return `${yazi.slice(0, bosluk)}, ${yazi.slice(bosluk + 1)}`;
}
