import { cheapness, formatHuf, formatSize, perLiter, timeAgo } from '../lib/prices'
import type { BeerPrice } from '../types'

interface Props {
  price: BeerPrice
  minPerLiter: number
  maxPerLiter: number
  onRemove?: (id: string) => void
  index: number
}

const styleClass = (s: string) => `tag style-${s.replace(/\s+/g, '-')}`

export function PriceCard({ price: p, minPerLiter, maxPerLiter, onRemove, index }: Props) {
  const fill = cheapness(perLiter(p), minPerLiter, maxPerLiter)
  const label = fill > 0.75 ? 'bargain!' : fill > 0.45 ? 'fair' : fill > 0.2 ? 'pricey' : 'ouch'

  return (
    <article className="card" style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}>
      <div
        className="glass"
        title={`Foam meter: the fuller, the cheaper per liter (${label})`}
        aria-label={`Value: ${label}`}
      >
        <div className="glass-fill" style={{ height: `${15 + fill * 75}%` }} />
      </div>
      <div className="card-body">
        <h3>{p.beer}</h3>
        <p className="pub">📍 {p.pub}</p>
        <div className="tags">
          <span className="tag tag-district">{p.district}. ker.</span>
          <span className={styleClass(p.style)}>{p.style}</span>
          <span className="tag">{p.draft ? 'Draft' : 'Bottle/can'}</span>
          {p.userSubmitted && <span className="tag tag-new">Yours</span>}
        </div>
        <div className="price-row">
          <span className="price">{formatHuf(p.priceHuf)}</span>
          <span className="size">/ {formatSize(p.sizeLiters)}</span>
        </div>
        <div className="per-liter">{formatHuf(perLiter(p))} per liter · {label}</div>
        <div className="meta">
          <span>Reported {timeAgo(p.reportedAt)}</span>
          {p.userSubmitted && onRemove && (
            <button className="remove-btn" onClick={() => onRemove(p.id)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
