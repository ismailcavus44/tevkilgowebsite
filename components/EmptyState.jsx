export function EmptyState({ ikon: Ikon, baslik, aciklama, children }) {
  return (
    <div className="flex h-full min-h-64 items-start justify-center px-6 pt-[12%]">
      <div className="flex w-full max-w-[560px] flex-col items-center text-center">
        {Ikon ? (
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Ikon size={20} weight="regular" />
          </span>
        ) : null}
        <h2 className="mt-3 text-base font-medium text-foreground">{baslik}</h2>
        {aciklama ? <p className="mt-1 text-sm text-muted-foreground">{aciklama}</p> : null}
        {children ? <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-2">{children}</div> : null}
      </div>
    </div>
  );
}
