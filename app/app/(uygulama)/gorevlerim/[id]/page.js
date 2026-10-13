import { GorevDetay } from "@/components/uygulama/GorevDetay";

export const metadata = { title: "Görev Detayı" };

export default async function GorevDetailPage({ params }) {
  const { id } = await params;
  return <GorevDetay id={id} geri="/app/gorevlerim" />;
}
