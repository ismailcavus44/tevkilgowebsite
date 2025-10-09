import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tevkilgo.com"),
  title: {
    default: "TevkilGO | Avukatlar için modern tevkil platformu",
    template: "%s | TevkilGO",
  },
  description:
    "TevkilGO, CMK benzeri adil sıralama yaklaşımıyla tevkil görevi almak ve vermek isteyen avukatlar için modern, hızlı ve güvenilir bir platform sunar.",
  applicationName: "TevkilGO",
  creator: "TevkilGO",
  keywords: [
    "tevkil",
    "avukat",
    "cmk",
    "tevkil platformu",
    "görevlendirme",
  ],
  openGraph: {
    type: "website",
    url: "/",
    title: "TevkilGO",
    description:
      "Avukatlar için adil, modern ve hızlı tevkil deneyimi. TevkilGO'yu keşfedin.",
    siteName: "TevkilGO",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${manrope.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
