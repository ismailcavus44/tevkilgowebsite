"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useCerezOnayi } from "@/lib/cerez-onay";
import { META_PIXEL_ID, metaOlay } from "@/lib/meta-pixel";

// Üye alanı (/app) reklam ölçümüne dahil edilmez; yalnızca herkese açık sayfalar sayılır.
function sayilirMi(yol) {
  return yol !== "/app" && !yol.startsWith("/app/");
}

export function MetaPixel() {
  const yol = usePathname() || "/";
  const onay = useCerezOnayi();
  const ilk = useRef(true);

  // İlk sayfa görüntülemeyi aşağıdaki betik gönderir (fbq o anda henüz yüklü değil).
  // Sonraki App Router geçişleri yeniden yükleme yapmadığı için PageView'i burada gönder.
  useEffect(() => {
    if (ilk.current) {
      ilk.current = false;
      return;
    }
    if (META_PIXEL_ID && sayilirMi(yol)) metaOlay("PageView");
  }, [yol]);

  // Çerez bandında "Kabul et" denmedikçe Pixel hiç yüklenmez.
  if (!META_PIXEL_ID || onay !== "kabul") return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
var p = location.pathname;
if (p !== '/app' && p.indexOf('/app/') !== 0) fbq('track', 'PageView');
// Mağaza bağlantısına tıklama: uygulama indirme niyeti (Lead)
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest && e.target.closest('a[href*="apps.apple.com"], a[href*="play.google.com"]');
  if (a) fbq('track', 'Lead', { content_name: a.href.indexOf('apple') > -1 ? 'App Store' : 'Google Play' });
}, true);`}
    </Script>
  );
}
