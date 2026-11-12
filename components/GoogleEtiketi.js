"use client";

import Script from "next/script";
import { useCerezOnayi } from "@/lib/cerez-onay";

// Google etiketi (Google Ads dönüşüm ölçümü). Yalnızca çerez bandında "Kabul et" denince yüklenir.
export function GoogleEtiketi() {
  if (useCerezOnayi() !== "kabul") return null;

  return (
    <>
      <Script src="https://www.googletagmanager.com/gtm.js?id=GTM-TRNKM7RD" strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
// App Store linkine tıklama: Google Ads "App Store tıklama" dönüşümü
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest && e.target.closest('a[href*="apps.apple.com"]');
  if (a) gtag('event', 'conversion', { send_to: 'AW-18531678845/WtwJCK7JoLcdEP30y4RF' });
}, true);`}
      </Script>
    </>
  );
}
