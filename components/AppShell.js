"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChatCircleText,
  House,
  ListChecks,
  Megaphone,
  MoonStars,
  PaperPlaneTilt,
  User,
} from "@phosphor-icons/react/ssr";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { IlanFormu } from "@/components/uygulama/IlanFormu";
import { BildirimSaglayici } from "@/components/uygulama/Bildirimler";
import { OzellikSaglayici, useOzellikler } from "@/components/uygulama/Ozellikler";
import { kategoriAd, puanlamaKayitlari, useKategoriler } from "@/components/uygulama/ortak";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { tarihSaat } from "@/lib/tarih";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const NAV = [
  { href: "/app", label: "Ana sayfa", icon: House },
  { href: "/app/ilanlar", label: "İlanlar", icon: Megaphone },
  { href: "/app/gorevlerim", label: "Görevlerim", icon: ListChecks },
  { href: "/app/basvurularim", label: "Başvurularım", icon: PaperPlaneTilt },
  { href: "/app/modlar", label: "Modlar", icon: MoonStars },
  { href: "/app/destek", label: "Destek", icon: ChatCircleText },
  { href: "/app/profil", label: "Profil", icon: User },
];

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
            <div id="icerik" className="min-h-0 flex-1 overflow-hidden">
              <div className="flex h-full min-h-0 w-full max-w-[1200px] flex-col px-4 md:px-8">
                {children}
              </div>
            </div>
            <Suspense fallback={<TabBar kolon={7}><TabLinks pathname="" ogeler={NAV} /></TabBar>}>
              <TabBarLive />
            </Suspense>
          </SidebarInset>
        </SidebarProvider>
        <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
          <DialogContent className="gap-4 bg-white p-6 md:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">İlan aç</DialogTitle>
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

function TabBarLive() {
  const pathname = usePathname();
  const { modlarAktif } = useOzellikler();
  const ogeler = modlarAktif ? NAV : NAV.filter((item) => item.href !== "/app/modlar");
  return <TabBar kolon={ogeler.length}><TabLinks pathname={pathname} ogeler={ogeler} /></TabBar>;
}

function TabBar({ children, kolon }) {
  return (
    <nav aria-label="Uygulama" className="shrink-0 border-t border-border bg-card md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <ul className={kolon === 7 ? "grid grid-cols-7" : "grid grid-cols-6"}>{children}</ul>
    </nav>
  );
}

function TabLinks({ pathname, ogeler }) {
  return ogeler.map((item) => {
    const active = isActive(pathname, item.href);
    const Icon = item.icon;
    return (
      <li key={item.href}>
        <Link href={item.href} aria-current={active ? "page" : undefined} className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 overflow-hidden border-t-2 px-0.5 py-1 text-[10px] leading-tight ${active ? "border-accent-gold text-foreground" : "border-transparent text-muted-foreground"}`}>
          <Icon size={20} aria-hidden="true" />
          <span className="w-full truncate text-center">{softLabel(item.label)}</span>
        </Link>
      </li>
    );
  });
}

function isActive(pathname, href) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function softLabel(label) {
  const breaks = { Görevlerim: "Görev\u00ADlerim", Başvurularım: "Başvuru\u00ADlarım" };
  return breaks[label] || label;
}
