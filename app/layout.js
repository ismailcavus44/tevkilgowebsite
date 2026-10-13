import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  title: {
    default: "TevkilGO",
    template: "%s · TevkilGO",
  },
  description:
    "Duruşmana gidemiyorsan, adliyedeki meslektaşın gitsin. Tevkil ilanını aç, aynı adliyedeki doğrulanmış avukatlar başvursun.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png" }],
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
