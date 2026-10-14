// Ana sayfa ve il sayfalarının ortak bölüm düzeni: sola yaslı başlık, tam genişlikte alt metin.
export const kart = "rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgb(18_38_63/0.05)]";

export function Bolum({ id, children }) {
  return (
    <section id={id} className="scroll-mt-24 px-5 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

// sag: başlığın sağ üstünde duran isteğe bağlı bağlantı ya da düğme
export function BolumBasligi({ title, children, sag }) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <h2 className="text-[30px] font-semibold leading-tight tracking-[-0.02em] lg:text-[36px]">{title}</h2>
        {sag}
      </div>
      {children && <p className="mt-4 text-[15px] leading-relaxed text-muted">{children}</p>}
    </div>
  );
}

export function IkonHalka({ icon: Icon }) {
  return (
    <span className="inline-flex size-10 items-center justify-center rounded-full border border-line">
      <Icon size={18} weight="bold" color="#1E3A5F" />
    </span>
  );
}
