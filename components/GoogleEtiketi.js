"use client";

import Script from "next/script";
import { useCerezOnayi } from "@/lib/cerez-onay";
import { DONUSUM_APP_STORE, GOOGLE_ETIKET_ID } from "@/lib/google-etiketi";

// Google etiketi (Google Ads dönüşüm ölçümü). Yalnızca çerez bandında "Kabul et" denince yüklenir.
export function GoogleEtiketi() {
  if (useCerezOnayi() !== "kabul") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ETIKET_ID}`} strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ETIKET_ID}');
// App Store linkine tıklama: Google Ads "App Store tıklama" dönüşümü
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest && e.target.closest('a[href*="apps.apple.com"]');
  if (a) gtag('event', 'conversion', { send_to: '${DONUSUM_APP_STORE}' });
}, true);`}
      </Script>
    </>
  );
}
