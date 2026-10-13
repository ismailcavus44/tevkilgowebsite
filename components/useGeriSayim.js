"use client";

import { useEffect, useState } from "react";

export function useGeriSayim() {
  const [kalan, setKalan] = useState(0);

  useEffect(() => {
    if (kalan <= 0) return undefined;
    const zaman = setTimeout(() => setKalan((deger) => deger - 1), 1000);
    return () => clearTimeout(zaman);
  }, [kalan]);

  return [kalan, () => setKalan(60)];
}
