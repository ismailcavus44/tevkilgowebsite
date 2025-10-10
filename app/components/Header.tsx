"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-black/10 dark:border-white/10 sticky top-0 bg-background/80 backdrop-blur z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="TevkilGO Ana Sayfa">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="TevkilGO" className="h-[60px] w-[60px] sm:h-[72px] sm:w-[72px] object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link className="hover:underline" href="/#nasil-calisir">Nasıl Kullanılır?</Link>
          <Link className="hover:underline" href="/biz-kimiz">Biz Kimiz?</Link>
          <Link className="hover:underline" href="/#sss">S.S.S</Link>
        </nav>
        <div className="hidden md:block">
          <Link
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90"
            href="/iletisim"
          >
            İletişim
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menü"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/10">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              className="text-sm hover:text-primary" 
              href="/#nasil-calisir"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nasıl Kullanılır?
            </Link>
            <Link 
              className="text-sm hover:text-primary" 
              href="/biz-kimiz"
              onClick={() => setMobileMenuOpen(false)}
            >
              Biz Kimiz?
            </Link>
            <Link 
              className="text-sm hover:text-primary" 
              href="/#sss"
              onClick={() => setMobileMenuOpen(false)}
            >
              S.S.S
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90"
              href="/iletisim"
              onClick={() => setMobileMenuOpen(false)}
            >
              İletişim
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}


