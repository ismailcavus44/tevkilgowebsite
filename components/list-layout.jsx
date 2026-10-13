"use client";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ListeSayfa({ children, kaydir }) {
  return (
    <div className="h-full min-h-0 overflow-y-auto" {...(kaydir ? { "data-kaydir": "" } : {})}>
      <div className="-mx-4 md:-mx-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 md:px-6 md:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ baslik, aciklama, eylem }) {
  return (
    <div className="mb-4 flex flex-col items-stretch gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold break-words">{baslik}</h1>
        {aciklama ? <p className="text-sm text-muted-foreground break-words">{aciklama}</p> : null}
      </div>
      {eylem ? <div className="w-full shrink-0 md:w-auto [&_button]:h-11 [&_button]:w-full md:[&_button]:h-9 md:[&_button]:w-auto">{eylem}</div> : null}
    </div>
  );
}

export function Toolbar({ sekmeler, sekme, onSekme, children }) {
  const sekmeli = Boolean(sekmeler?.length);
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end md:gap-x-3 md:gap-y-2">
      {sekmeli ? (
        <div className="w-full overflow-x-auto border-b pb-[5px] [scrollbar-width:none] md:w-auto [&::-webkit-scrollbar]:hidden">
          <Tabs value={sekme} onValueChange={(deger) => { if (deger) onSekme(deger); }}>
            <TabsList variant="line" className="h-11 w-max gap-4 bg-transparent p-0 md:h-9">
              {sekmeler.map((oge) => (
                <TabsTrigger key={oge.value} value={oge.value} className="h-11 flex-none rounded-none px-0 text-sm md:h-9">
                  {oge.label}
                  {oge.adet > 0 ? <Badge variant="secondary" className="h-4 px-1.5 text-[11px]">{oge.adet}</Badge> : null}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      ) : null}
      {children ? <div className={sekmeli ? "grid w-full grid-cols-2 gap-2 [&>*]:min-w-0 [&>*:only-child]:col-span-2 md:ml-auto md:flex md:w-auto md:flex-wrap md:items-center md:pb-3" : "grid w-full grid-cols-2 gap-2 [&>*]:min-w-0 [&>*:only-child]:col-span-2 md:flex md:flex-wrap md:items-center"}>{children}</div> : null}
    </div>
  );
}

export function ListeAraclari({ adliye, onAdliye, adliyeler, kategori, onKategori, kategoriler, sira, onSira, siralar }) {
  return (
    <>
      <AracSelect genislik="w-full md:w-44" value={adliye || "tumu"} placeholder="Tüm adliyeler" secenekler={adliyeler} onValueChange={(deger) => onAdliye(!deger || deger === "tumu" ? "" : deger)} />
      <AracSelect genislik="w-full md:w-44" value={kategori || "tumu"} placeholder="Tüm kategoriler" secenekler={kategoriler} onValueChange={(deger) => onKategori(!deger || deger === "tumu" ? "" : deger)} />
      <AracSelect genislik="col-span-2 w-full md:col-span-1 md:w-40" value={sira} secenekler={siralar} onValueChange={(deger) => { if (deger) onSira(deger); }} />
    </>
  );
}

function AracSelect({ value, genislik, placeholder, secenekler, onValueChange }) {
  const etiket = (deger) => secenekler.find((satir) => satir.value === deger)?.label;
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("h-11 rounded-md text-base md:h-9 md:text-sm", genislik)}>
        <SelectValue>{(deger) => etiket(deger) || placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {placeholder ? <SelectItem value="tumu">{placeholder}</SelectItem> : null}
        {secenekler.map((satir) => <SelectItem key={satir.value} value={satir.value}>{satir.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export function ListCard({ children }) {
  return <section className="overflow-hidden rounded-lg border bg-background">{children}</section>;
}

export function KartBos(props) {
  return <BosListe {...props} className="py-12" />;
}

export function BosListe({ ikon: Ikon, baslik, aciklama, children, className }) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-16 text-center", className)}>
      {Ikon ? <Ikon size={20} aria-hidden="true" className="text-muted-foreground" /> : null}
      <p className="mt-3 text-sm font-medium">{baslik}</p>
      {aciklama ? <p className="mt-1 text-sm text-muted-foreground">{aciklama}</p> : null}
      {children ? <div className="mt-4 flex flex-wrap items-center justify-center gap-2">{children}</div> : null}
    </div>
  );
}
