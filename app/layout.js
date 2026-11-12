import { Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.tevkilgo.org"),
  applicationName: "TevkilGO",
  verification: { google: "JESdkkAc5f8GduIm4x-ZNNffVKtOTsNffg8Xrj1I5h4" },
  title: {
    default: "TevkilGO",
    template: "%s · TevkilGO",
  },
  description:
    "Duruşmana gidemiyorsan, adliyedeki meslektaşın gitsin. Tevkil ilanını aç, aynı adliyedeki doğrulanmış avukatlar başvursun.",
  openGraph: {
    type: "website",
    siteName: "TevkilGO",
    locale: "tr_TR",
  },
  icons: {
    // Küçük ikon dosyaları; 1024 px'lik icon.png her ziyarette favicon olarak inmesin
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "96x96" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport = {
  themeColor: "#1E3A5F",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${manrope.variable} h-full`}>
      <body
        className="min-h-full bg-canvas font-sans text-base text-ink antialiased"
        suppressHydrationWarning
      >
        <a className="skip-link" href="#icerik">
          İçeriğe geç
        </a>
        {children}
        {/* Google etiketi (Google Ads dönüşüm ölçümü) */}
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-TRNKM7RD"
          strategy="afterInteractive"
        />
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
      </body>
    </html>
  );
}
