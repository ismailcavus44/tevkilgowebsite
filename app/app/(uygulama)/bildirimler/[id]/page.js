import { BildirimDetay } from "@/components/uygulama/Bildirimler";

export const metadata = { title: "Bildirim" };

export default async function BildirimDetailPage({ params }) {
  const { id } = await params;
  return <BildirimDetay id={id} />;
}
