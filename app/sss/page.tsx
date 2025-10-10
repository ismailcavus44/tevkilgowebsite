export const metadata = {
  title: "S.S.S",
};

export default function FAQPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 grid gap-6">
      <h1 className="text-3xl font-bold">Sıkça Sorulan Sorular</h1>
      <div className="grid gap-4">
        <details className="rounded-md border p-4">
          <summary className="font-medium">Tevkil oluşturmak ücretli mi?</summary>
          <p className="mt-2 text-foreground/80">
            Tevkil oluşturmak ücretsizdir; ancak güncel tarifenin altında ilan oluşturulamaz.
          </p>
        </details>
        <details className="rounded-md border p-4">
          <summary className="font-medium">Görev sırasına nasıl katılırım?</summary>
          <p className="mt-2 text-foreground/80">
            İlçe/adliye seçip Barokart onayınızı yaptıktan sonra açılan görevlere başvurabilirsiniz.
          </p>
        </details>
      </div>
    </section>
  );
}





