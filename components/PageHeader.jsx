export const kartSinifi = "gap-0 overflow-hidden rounded-[12px] border border-[#E3E8EF] bg-white py-0 shadow-none ring-0";

export function PageHeader({ baslik, sayi, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 pt-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{baslik}</h1>
        {sayi ? <p className="text-sm text-muted-foreground">{sayi}</p> : null}
      </div>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  );
}
