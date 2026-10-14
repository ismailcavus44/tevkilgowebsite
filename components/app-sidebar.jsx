"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Bell, ChatCircleText, House, ListChecks, MagnifyingGlass, Megaphone, PaperPlaneTilt, Plus, Question } from "@phosphor-icons/react"
import { NavUser } from "@/components/nav-user"
import { BildirimKutusu, useBildirim } from "@/components/uygulama/Bildirimler"
import { useOzellikler } from "@/components/uygulama/Ozellikler"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { basvurulmamisIlanSayisi } from "@/lib/acik-ilanlar"
import { createClient } from "@/lib/supabase/client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

const GRUPLAR = [
  {
    ad: "Genel",
    ogeler: [
      { href: "/app", label: "Ana Sayfa", icon: House, sayac: null },
      { href: "/app/bildirimler", label: "Bildirimler", icon: Bell, sayac: "bildirim" },
    ],
  },
  {
    ad: "İşlerim",
    ogeler: [
      { href: "/app/ilanlar", label: "İlanlar", icon: Megaphone, sayac: "acik" },
      { href: "/app/gorevlerim", label: "Görevlerim", icon: ListChecks, sayac: "secim" },
      { href: "/app/basvurularim", label: "Başvurularım", icon: PaperPlaneTilt, sayac: null },
      { href: "/app/avukat-ara", label: "Müsait Meslektaşlar", icon: MagnifyingGlass, sayac: null, mod: true },
    ],
  },
]

const ALT = [
  { href: "/app/destek", label: "Destek", icon: ChatCircleText },
  { href: "/app/sss", label: "SSS", icon: Question },
]

// Aktif öğe: lacivert zemin, ikon dolu.
const OGE = "h-10 gap-3 rounded-lg px-3 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-5 data-active:bg-navy/[0.07] data-active:font-semibold data-active:text-navy data-active:hover:bg-navy/10 data-active:hover:text-navy"

const ROZET = "top-1/2! right-2 h-5 min-w-5 -translate-y-1/2 rounded-full bg-navy px-1.5 text-[11px] font-semibold text-white peer-hover/menu-button:text-white peer-data-active/menu-button:text-white group-data-[collapsible=icon]:top-0.5! group-data-[collapsible=icon]:right-0.5 group-data-[collapsible=icon]:flex! group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:min-w-4 group-data-[collapsible=icon]:translate-y-0 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:text-[10px] group-data-[collapsible=icon]:ring-2 group-data-[collapsible=icon]:ring-sidebar"

const BASLIK = "px-3 text-[11px] font-semibold tracking-wider text-muted-foreground/80 uppercase"

function aktifMi(pathname, href) {
  if (href === "/app") return pathname === "/app"
  return pathname === href || pathname.startsWith(`${href}/`)
}

function Rozet({ adet }) {
  if (!adet) return null
  return <SidebarMenuBadge className={ROZET}>{adet > 99 ? "99+" : adet}</SidebarMenuBadge>
}

function MenuOgesi({ item, aktif, adet }) {
  const Icon = item.icon
  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={item.label} isActive={aktif} className={OGE} render={<Link href={item.href} />}>
        <Icon weight={aktif ? "fill" : "regular"} />
        <span>{item.label}</span>
      </SidebarMenuButton>
      <Rozet adet={adet} />
    </SidebarMenuItem>
  )
}

function BildirimMenusu({ label, ikon: Icon, aktif, adet }) {
  const [acik, setAcik] = useState(false)
  const { isMobile, setOpenMobile } = useSidebar()
  if (isMobile) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={label} isActive={aktif} className={OGE} render={<Link href="/app/bildirimler" onClick={() => setOpenMobile(false)} />}>
          <Icon weight={aktif ? "fill" : "regular"} />
          <span>{label}</span>
        </SidebarMenuButton>
        <Rozet adet={adet} />
      </SidebarMenuItem>
    )
  }
  return (
    <SidebarMenuItem>
      <Popover open={acik} onOpenChange={setAcik}>
        <PopoverTrigger render={<SidebarMenuButton tooltip={label} isActive={aktif} className={OGE} />}>
          <Icon weight={aktif || acik ? "fill" : "regular"} />
          <span>{label}</span>
        </PopoverTrigger>
        <Rozet adet={adet} />
        <PopoverContent side="right" align="start" className="w-96 gap-0 p-0">
          <BildirimKutusu acik={acik} onKapat={() => setAcik(false)} />
        </PopoverContent>
      </Popover>
    </SidebarMenuItem>
  )
}

export function AppSidebar(props) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  const bildirim = useBildirim()
  const { modlarAktif } = useOzellikler()
  const [sayac, setSayac] = useState({ acik: 0, secim: 0 })

  useEffect(() => {
    let iptal = false
    async function say() {
      const supabase = createClient()
      try {
        const [acik, gorev, ayar] = await Promise.all([
          basvurulmamisIlanSayisi(supabase),
          supabase.from("gorevlerim").select("id, rol, durum, basvuru_sayisi, created_at").eq("rol", "olusturan").eq("durum", "acik"),
          supabase.from("app_ayarlar").select("deger").eq("anahtar", "basvuru_toplama_dakika").maybeSingle(),
        ])
        if (iptal) return
        const dakika = Number(ayar.data?.deger)
        const sure = Number.isFinite(dakika) && dakika >= 0 ? dakika : 5
        const simdi = Date.now()
        const secim = (gorev.data || []).filter((satir) => {
          const bitis = new Date(satir.created_at).getTime() + sure * 60000
          return bitis <= simdi && (satir.basvuru_sayisi || 0) > 0
        }).length
        setSayac({ acik, secim })
      } catch {
        /* rozet bir sonraki yenilemede gelir */
      }
    }
    say()
    const yenile = () => { say() }
    window.addEventListener("ilanlar-yenile", yenile)
    return () => {
      iptal = true
      window.removeEventListener("ilanlar-yenile", yenile)
    }
  }, [pathname])

  useEffect(() => {
    if (isMobile) setOpenMobile(false)
  }, [pathname, isMobile, setOpenMobile])

  const deger = { acik: sayac.acik, secim: sayac.secim, bildirim: bildirim?.okunmamis || 0 }

  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarHeader className="gap-4 px-3 pt-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
        <SidebarMenu className="gap-4 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-3">
          <SidebarMenuItem className="group-data-[collapsible=icon]:w-10">
            <SidebarMenuButton size="lg" tooltip="TevkilGO" className="gap-3 rounded-xl px-1.5 hover:bg-transparent active:bg-transparent group-data-[collapsible=icon]:mx-auto" render={<Link href="/app" />}>
              <Image src="/icon.png" alt="" width={40} height={40} className="size-9 shrink-0 rounded-xl shadow-sm ring-1 ring-black/5 group-data-[collapsible=icon]:size-10" />
              <span className="grid leading-tight group-data-[collapsible=icon]:hidden">
                <span className="text-base font-bold tracking-tight text-navy">TevkilGO</span>
                <span className="text-xs text-muted-foreground">Tevkil ağı</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="group-data-[collapsible=icon]:w-10">
            <SidebarMenuButton tooltip="İlan Aç" className="h-10 justify-center gap-2 rounded-xl bg-navy font-semibold text-white shadow-[0_6px_16px_-6px_rgb(30_58_95/0.6)] transition-[background-color,transform] hover:bg-ink hover:text-white active:scale-[0.98] active:bg-ink active:text-white group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:rounded-lg" onClick={() => { setOpenMobile(false); window.dispatchEvent(new Event("ilan-ac")); }}>
              <Plus weight="bold" />
              <span>İlan Aç</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-1 pt-2 group-data-[collapsible=icon]:items-center">
        {GRUPLAR.map((grup) => (
          <SidebarGroup key={grup.ad} className="px-3 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:px-2">
            <SidebarGroupLabel className={BASLIK}>{grup.ad}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:items-center">
                {grup.ogeler.filter((item) => modlarAktif || !item.mod).map((item) => {
                  const aktif = aktifMi(pathname, item.href)
                  const adet = item.sayac ? deger[item.sayac] : 0
                  if (item.sayac === "bildirim") {
                    return <BildirimMenusu key={item.href} label={item.label} ikon={item.icon} aktif={aktif} adet={adet} />
                  }
                  return <MenuOgesi key={item.href} item={item} aktif={aktif} adet={adet} />
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup className="mt-auto px-3 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:px-2">
          <SidebarGroupLabel className={BASLIK}>Yardım</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:items-center">
              {ALT.map((item) => <MenuOgesi key={item.href} item={item} aktif={aktifMi(pathname, item.href)} adet={0} />)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-3 px-3 pb-4 group-data-[collapsible=icon]:px-2">
        <NavUser />
        <div className="flex flex-wrap justify-center gap-x-1.5 text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          <Link href="/gizlilik" className="hover:text-foreground">Gizlilik</Link>
          <span aria-hidden="true">·</span>
          <Link href="/kvkk" className="hover:text-foreground">KVKK</Link>
          <span aria-hidden="true">·</span>
          <Link href="/kullanim-kosullari" className="hover:text-foreground">Kullanım Koşulları</Link>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
