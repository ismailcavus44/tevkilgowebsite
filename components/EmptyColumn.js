export function EmptyColumn({ title, body }) {
  return (
    <div className="flex h-full min-h-full flex-col bg-surface">
      <header className="border-b border-line px-5 py-4">
        <h1 className="text-lg font-extrabold">{title}</h1>
      </header>
      <p className="px-5 py-8 text-muted">{body}</p>
    </div>
  );
}
