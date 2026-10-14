"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { IlanFormu } from "@/components/uygulama/IlanFormu";
import { BildirimSaglayici } from "@/components/uygulama/Bildirimler";
import { OzellikSaglayici } from "@/components/uygulama/Ozellikler";
import { kategoriAd, puanlamaKayitlari, useKategoriler } from "@/components/uygulama/ortak";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { tarihSaat } from "@/lib/tarih";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppShell({ children, sidebarAcik = true }) {
  useKategoriler();
  const [composerOpen, setComposerOpen] = useState(false);
  const [bekleyen, setBekleyen] = useState(null);
  const kontrol = useRef(false);
  const closeComposer = useCallback(() => setComposerOpen(false), []);

  useEffect(() => {
    const ac = async () => {
      if (kontrol.current) return;
      kontrol.current = true;
      try {
        const { data, error } = await createClient().rpc("puanlama_bekleyen_gorevlerim");
        if (error) {
          setBekleyen(null);
          setComposerOpen(true);
          return;
        }
        const liste = puanlamaKayitlari(data);
        if (liste.length) {
          setComposerOpen(false);
          setBekleyen(liste[0]);
        } else {
          setBekleyen(null);
          setComposerOpen(true);
        }
      } finally {
        kontrol.current = false;
      }
    };
    window.addEventListener("ilan-ac", ac);
    return () => window.removeEventListener("ilan-ac", ac);
  }, []);

  return (
    <OzellikSaglayici>
    <BildirimSaglayici>
      <TooltipProvider>
        <SidebarProvider defaultOpen={sidebarAcik} style={{ "--sidebar-width-icon": "56px" }} className="h-dvh min-h-dvh overflow-hidden">
          <AppSidebar className="min-h-screen" />
          <SidebarInset className="h-full min-h-0 overflow-hidden bg-[#F7F8FA]">
            <SiteHeader />
            <div id="icerik" className="min-h-0 flex-1 overflow-hidden pb-[env(safe-area-inset-bottom)] md:pb-0">
              <div className="mx-auto flex h-full min-h-0 w-full max-w-[1200px] flex-col px-4 md:px-8">
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
        <button
          type="button"
          aria-label="İlan aç"
          onClick={() => window.dispatchEvent(new Event("ilan-ac"))}
          className="fixed right-5 z-40 inline-flex size-14 items-center justify-center rounded-full bg-navy text-white shadow-[0_10px_28px_-6px_rgb(30_58_95/0.55)] transition-transform active:scale-95 md:hidden"
          style={{ bottom: "max(1.25rem, calc(env(safe-area-inset-bottom) + 0.75rem))" }}
        >
          <Plus size={26} weight="bold" />
        </button>
        <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
          <DialogContent className="gap-4 bg-white p-6 md:max-w-lg max-md:flex! max-md:max-h-[92dvh]! max-md:flex-col max-md:gap-0 max-md:overflow-hidden! max-md:p-0 max-md:[&>[data-slot=dialog-close]]:top-4 max-md:[&>[data-slot=dialog-close]]:right-3">
            <DialogHeader className="max-md:shrink-0 max-md:border-b max-md:px-5 max-md:pt-5 max-md:pb-4">
              <DialogTitle className="text-lg font-semibold">İlan Aç</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">Görev detaylarını eksiksiz doldurun</DialogDescription>
            </DialogHeader>
            {composerOpen ? <IlanFormu onBitti={closeComposer} onVazgec={closeComposer} /> : null}
          </DialogContent>
        </Dialog>
        <Dialog open={Boolean(bekleyen)} onOpenChange={(acik) => { if (!acik) setBekleyen(null); }}>
          {bekleyen ? <DegerlendirmeKapisi gorev={bekleyen} onKapat={() => setBekleyen(null)} /> : null}
        </Dialog>
        <Toaster />
      </TooltipProvider>
    </BildirimSaglayici>
    </OzellikSaglayici>
  );
}

function DegerlendirmeKapisi({ gorev, onKapat }) {
  const id = gorev?.id || gorev?.task_id;
  const [ozet, setOzet] = useState(gorev);

  useEffect(() => {
    let iptal = false;
    const supabase = createClient();
    (async () => {
      let kayit = gorev;
      if (!kayit?.kategori || !kayit?.tarih_saat || !kayit?.adliye) {
        const { data } = await supabase.from("gorevlerim").select("id, adliye, kategori, tarih_saat").eq("id", id).eq("rol", "olusturan").maybeSingle();
        if (data) kayit = { ...kayit, ...data };
      }
      let adliyeAd = kayit?.adliye || "";
      if (kayit?.adliye) {
        const { data } = await supabase.from("adliyeler").select("ad").eq("kod", kayit.adliye).maybeSingle();
        if (data?.ad) adliyeAd = data.ad;
      }
      if (!iptal) setOzet({ ...kayit, adliyeAd });
    })();
    return () => { iptal = true; };
  }, [gorev, id]);

  return (
    <DialogContent className="md:max-w-md">
      <DialogHeader>
        <DialogTitle>Değerlendirme bekleyen göreviniz var</DialogTitle>
        <DialogDescription>Yeni ilan açmadan önce tamamlanan görevinizi değerlendirmeniz gerekiyor.</DialogDescription>
      </DialogHeader>
      <div className="text-sm">
        <p>{ozet?.adliyeAd || ozet?.adliye}</p>
        <p className="text-muted-foreground">{kategoriAd(ozet?.kategori)}</p>
        <p className="text-muted-foreground">{ozet?.tarih_saat ? tarihSaat(ozet.tarih_saat, true) : ""}</p>
      </div>
      {id ? (
        <Button nativeButton={false} className="h-11 w-full" render={<Link href={`/app/gorevlerim/${id}`} onClick={onKapat} />}>
          Görevi değerlendir
        </Button>
      ) : null}
    </DialogContent>
  );
}
