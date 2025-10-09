export const metadata = {
  title: "Blog & Duyurular",
  description:
    "TevkilGO ile ilgili en güncel haberler ve duyuruların statik listesi.",
};

export default function BlogPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 grid gap-6">
      <h1 className="text-3xl font-bold">Blog & Duyurular</h1>
      <p className="text-foreground/80">
        Yakında burada TevkilGO ile ilgili güncellemeleri paylaşacağız.
      </p>
      <ul className="grid gap-2 text-sm text-foreground/70 list-disc pl-6">
        <li>v1 web sitesi yayında</li>
      </ul>
    </section>
  );
}



