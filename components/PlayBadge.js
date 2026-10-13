import Image from "next/image";

const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.ismailcavus.TevkilGO";

export function PlayBadge({ height = 48 }) {
  const width = Math.round((270 / 80) * height);

  return (
    <a
      href={PLAY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0"
    >
      <Image
        src="/store/googlePlayButton.png"
        alt="Google Play'den indir"
        width={width}
        height={height}
        style={{ width, height }}
      />
    </a>
  );
}
