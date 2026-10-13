import { Destek } from "@/components/uygulama/Destek";

export const metadata = { title: "Destek" };

export default async function DestekPage({ searchParams }) {
  const sorgu = await searchParams;
  return <Destek baslangicAcik={sorgu?.yeni === "1"} />;
}
