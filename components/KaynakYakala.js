"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { kaynakYakala } from "@/lib/kaynak";

// Ziyaretçinin geldiği kaynağı (reklam / site) her sayfa geçişinde kontrol eder. Ekrana bir şey çizmez.
export function KaynakYakala() {
  const yol = usePathname();
  useEffect(() => {
    kaynakYakala();
  }, [yol]);
  return null;
}
