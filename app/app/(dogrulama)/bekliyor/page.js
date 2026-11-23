import { Suspense } from "react";
import { redirect } from "next/navigation";
import { guvenliDonus } from "@/lib/donus";

// Kimlik incelemesi kalktı; eski bağlantılar ve yer imleri kaldığı sayfaya döner.
async function Yonlendir({ searchParams }) {
  redirect(guvenliDonus((await searchParams).donus));
}

export default function BekliyorPage({ searchParams }) {
  return (
    <Suspense>
      <Yonlendir searchParams={searchParams} />
    </Suspense>
  );
}
