// Decorative rising bubbles in the background.
const BUBBLES = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 8 + ((i * 13) % 26),
  duration: 9 + ((i * 7) % 12),
  delay: -((i * 5) % 18),
}))

export function Bubbles() {
  return (
    <div className="bubbles" aria-hidden="true">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
