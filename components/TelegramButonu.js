// Sağ altta sabit duran Telegram grubu butonu. Yalnızca tanıtım sayfalarında (home ve site
// layout'ları) kullanılır; /app içinde mobildeki "yeni ilan" butonuyla çakışmasın diye yoktur.
// İkon: Telegram logosu (Simple Icons). Daire mavi çizilir, uçak boşluğundan beyaz zemin görünür.
export function TelegramButonu() {
  return (
    <a
      href="https://t.me/TevkilGO"
      target="_blank"
      rel="nofollow noopener noreferrer"
      aria-label="TevkilGO Telegram grubuna katıl"
      title="Telegram grubumuza katıl"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex size-14 items-center justify-center rounded-full bg-white shadow-[0_10px_28px_-6px_rgb(34_158_217/0.6)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#229ED9] active:scale-95 md:right-6 md:bottom-6"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-14 fill-[#229ED9]">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    </a>
  );
}
