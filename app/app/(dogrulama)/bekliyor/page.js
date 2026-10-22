import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DurumuYenile } from "@/components/DurumuYenile";
import { guvenliDonus } from "@/lib/donus";
import { oturumDurumu } from "@/lib/oturum";

export const metadata = { title: "Doğrulama" };

// Onaylanınca kullanıcı geldiği sayfaya, reddedilirse yeniden kimlik ekranına gider.
async function BekliyorKapisi({ searchParams }) {
  const donus = guvenliDonus((await searchParams).donus);
  const { rota } = await oturumDurumu();
  if (rota === "/app") redirect(donus);
  if (rota === "/app/kimlik") redirect(`/app/kimlik?donus=${encodeURIComponent(donus)}`);
  if (rota !== "/app/bekliyor") redirect(rota);
  return (
    <Link href={donus} className="inline-flex min-h-11 w-full items-center justify-center rounded-control border border-line bg-surface px-4 text-[15px] font-semibold hover:bg-canvas">
      Uygulamaya dön
    </Link>
  );
}

export default function BekliyorPage({ searchParams }) {
  return (
    <div className="space-y-5">
      <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">Kimliğiniz inceleniyor</h1>
      <p className="text-[15px] leading-relaxed text-muted">
        Onaylandığında bu sayfa kendiliğinden yenilenir ve kaldığınız yere dönersiniz.
      </p>
      <DurumuYenile />
      <Suspense>
        <BekliyorKapisi searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
