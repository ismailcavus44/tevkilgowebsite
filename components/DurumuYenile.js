"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export function DurumuYenile() {
  const router = useRouter();
  return (
    <Button type="button" className="w-full" onClick={() => router.refresh()}>
      Durumu Yenile
    </Button>
  );
}
