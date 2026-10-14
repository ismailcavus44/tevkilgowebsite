import { Manrope } from "next/font/google";
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
      </body>
    </html>
  );
}
