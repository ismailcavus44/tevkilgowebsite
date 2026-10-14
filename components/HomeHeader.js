"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function HomeHeader() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={
          stuck
            ? "fixed inset-x-0 top-0 z-50 h-20 border-b border-line bg-canvas/95 text-ink backdrop-blur"
            : "absolute inset-x-0 top-0 z-20 h-20 text-white"
        }
      >
        <div
          className={`flex h-full items-center justify-between px-6 ${
            stuck ? "lg:px-[72px]" : "lg:px-14"
          }`}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/icon.png" alt="" width={34} height={34} className="size-[34px] rounded-lg" />
            <span className="text-lg font-extrabold tracking-tight">TevkilGO</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/giris"
              className={`rounded-[10px] px-3 py-2 text-[15px] font-bold ${
                stuck ? "text-ink hover:bg-white" : "text-white hover:bg-white/10"
              }`}
            >
              Giriş yap
            </Link>
            <Link
              href="/uye-ol"
              className={`inline-flex h-10 items-center rounded-[10px] px-4 text-[15px] font-bold ${
                stuck ? "bg-navy text-white" : "bg-white text-navy"
              }`}
            >
              Üye ol
            </Link>
          </nav>
        </div>
      </header>
      <div className="h-20 shrink-0" />
    </>
  );
}

