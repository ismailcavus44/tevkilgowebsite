const BEZEL = 8;
const RADIUS = 44;
const OUTER_W = 390 + BEZEL * 2;
const OUTER_H = 844 + BEZEL * 2;

export function PhoneFrame({ children, scale = 0.5, crop, className = "", style }) {
  const width = OUTER_W * scale;
  const height = crop ?? OUTER_H * scale;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden ${className}`}
      style={{ width, height, ...style }}
    >
      <div
        style={{
          width: OUTER_W,
          height: OUTER_H,
          padding: BEZEL,
          borderRadius: RADIUS,
          background: "#0B1626",
          boxShadow: "inset 0 0 0 1.5px rgb(255 255 255 / 0.1)",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <div
          style={{
            width: 390,
            height: 844,
            overflow: "hidden",
            borderRadius: RADIUS - BEZEL,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
