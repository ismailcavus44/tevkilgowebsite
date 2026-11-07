import { TelegramButonu } from "@/components/TelegramButonu";

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-dvh bg-canvas">
      {children}
      <TelegramButonu />
    </div>
  );
}
