"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Bell, ChatCircleText, House, ListChecks, Megaphone, PaperPlaneTilt, Plus, Question } from "@phosphor-icons/react"
import { NavUser } from "@/components/nav-user"
import { BildirimKutusu, useBildirim } from "@/components/uygulama/Bildirimler"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { basvurulmamisIlanSayisi } from "@/lib/acik-ilanlar"
import { createClient } from "@/lib/supabase/client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

const MENU = [
  { href: "/app", label: "Ana sayfa", icon: House, sayac: null },
  { href: "/app/ilanlar", label: "İlanlar", icon: Megaphone, sayac: "acik" },
  { href: "/app/gorevlerim", label: "Görevlerim", icon: ListChecks, sayac: "secim" },
  { href: "/app/basvurularim", label: "Başvurularım", icon: PaperPlaneTilt, sayac: null },
  { href: "/app/bildirimler", label: "Bildirimler", icon: Bell, sayac: "bildirim" },
]

const ROZET = "bg-primary text-primary-foreground group-data-[collapsible=icon]:top-0 group-data-[collapsible=icon]:right-0 group-data-[collapsible=icon]:flex! group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:min-w-4 group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:text-[10px]"

const ALT = [
  { href: "/app/destek", label: "Destek", icon: ChatCircleText },
  { href: "/app/sss", label: "SSS", icon: Question },
]

function BildirimMenusu({ label, ikon: Icon, aktif, adet }) {
  const [acik, setAcik] = useState(false)
  const { isMobile, setOpenMobile } = useSidebar()
  if (isMobile) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={label} isActive={aktif} render={<Link href="/app/bildirimler" onClick={() => setOpenMobile(false)} />}>
          <Icon size={18} weight="regular" />
          <span>{label}</span>
        </SidebarMenuButton>
        {adet > 0 ? <SidebarMenuBadge className={ROZET}>{adet > 99 ? "99+" : adet}</SidebarMenuBadge> : null}
      </SidebarMenuItem>
    )
  }
  return (
    <SidebarMenuItem>
      <Popover open={acik} onOpenChange={setAcik}>
        <PopoverTrigger render={<SidebarMenuButton tooltip={label} isActive={aktif} />}>
          <Icon size={18} weight="regular" />
          <span>{label}</span>
        </PopoverTrigger>
        {adet > 0 ? <SidebarMenuBadge className={ROZET}>{adet > 99 ? "99+" : adet}</SidebarMenuBadge> : null}
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
      <SidebarHeader className="group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:pb-0">
        <SidebarMenu className="group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-3">
          <SidebarMenuItem className="group-data-[collapsible=icon]:w-10">
            <SidebarMenuButton size="lg" tooltip="TevkilGO" className="group-data-[collapsible=icon]:mx-auto" render={<Link href="/app" />}>
              <Image src="/icon.png" alt="" width={40} height={40} className="size-8 shrink-0 rounded-lg group-data-[collapsible=icon]:size-10" />
              <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">TevkilGO</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="group-data-[collapsible=icon]:w-10">
            <SidebarMenuButton tooltip="İlan aç" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground group-data-[collapsible=icon]:mx-auto" onClick={() => { setOpenMobile(false); window.dispatchEvent(new Event("ilan-ac")); }}>
              <Plus size={18} weight="bold" />
              <span>İlan aç</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="group-data-[collapsible=icon]:items-center">
        <SidebarGroup className="mt-3 group-data-[collapsible=icon]:mt-4 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:pt-0">
          <SidebarGroupContent>
            <SidebarMenu className="group-data-[collapsible=icon]:items-center">
              {MENU.map((item) => {
                const aktif = item.href === "/app" ? pathname === "/app" : pathname === item.href || pathname.startsWith(`${item.href}/`)
                const Icon = item.icon
                const adet = item.sayac ? deger[item.sayac] : 0
                if (item.sayac === "bildirim") {
                  return <BildirimMenusu key={item.href} label={item.label} ikon={Icon} aktif={aktif} adet={adet} />
                }
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton tooltip={item.label} isActive={aktif} render={<Link href={item.href} />}>
                      <Icon size={18} weight="regular" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {adet > 0 ? <SidebarMenuBadge className={item.sayac === "bildirim" ? "bg-primary text-primary-foreground" : ""}>{adet > 99 ? "99+" : adet}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu className="group-data-[collapsible=icon]:items-center">
              {ALT.map((item) => {
                const Icon = item.icon
                const aktif = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton tooltip={item.label} isActive={aktif} render={<Link href={item.href} />}>
                      <Icon size={18} weight="regular" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 px-2 group-data-[collapsible=icon]:hidden">
              <Link href="/gizlilik" className="text-xs text-muted-foreground hover:text-foreground">Gizlilik</Link>
              <Link href="/kvkk" className="text-xs text-muted-foreground hover:text-foreground">KVKK</Link>
              <Link href="/kullanim-kosullari" className="text-xs text-muted-foreground hover:text-foreground">Kullanım Koşulları</Link>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
