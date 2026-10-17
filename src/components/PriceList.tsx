import { useMemo, useState } from 'react'
import { perLiter } from '../lib/prices'
import { BEER_STYLES, DISTRICTS, type BeerPrice, type BeerStyle, type SortKey } from '../types'
import { PriceCard } from './PriceCard'

interface Props {
  prices: BeerPrice[]
  onRemove: (id: string) => void
  onAdd: () => void
}

export function PriceList({ prices, onRemove, onAdd }: Props) {
  const [query, setQuery] = useState('')
  const [district, setDistrict] = useState<string>('all')
  const [styles, setStyles] = useState<BeerStyle[]>([])
  const [draftOnly, setDraftOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('perLiter')

  const toggleStyle = (s: BeerStyle) =>
    setStyles((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  const clearFilters = () => {
    setQuery('')
    setDistrict('all')
    setStyles([])
    setDraftOnly(false)
  }

  // Foam meter scale uses all prices so a card's fill doesn't jump when filtering.
  const [minPL, maxPL] = useMemo(() => {
    const values = prices.map(perLiter)
    return [Math.min(...values), Math.max(...values)]
  }, [prices])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = prices.filter(
      (p) =>
        (!q || p.beer.toLowerCase().includes(q) || p.pub.toLowerCase().includes(q)) &&
        (district === 'all' || p.district === district) &&
        (styles.length === 0 || styles.includes(p.style)) &&
        (!draftOnly || p.draft),
    )
    const sorters: Record<SortKey, (a: BeerPrice, b: BeerPrice) => number> = {
      perLiter: (a, b) => perLiter(a) - perLiter(b),
      price: (a, b) => a.priceHuf - b.priceHuf,
      newest: (a, b) => b.reportedAt.localeCompare(a.reportedAt),
    }
    return [...filtered].sort(sorters[sort])
  }, [prices, query, district, styles, draftOnly, sort])

  const hasFilters = query || district !== 'all' || styles.length > 0 || draftOnly

  return (
    <section>
      <div className="panel filters">
        <div className="filter-row">
          <input
            className="input search"
            type="search"
            placeholder="Search a beer or pub…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
          <select
            className="select"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            aria-label="District"
          >
            <option value="all">All districts</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}. kerület
              </option>
            ))}
          </select>
          <select
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort by"
          >
            <option value="perLiter">Cheapest per liter</option>
            <option value="price">Cheapest price</option>
            <option value="newest">Newest reports</option>
          </select>
        </div>
        <div className="chips" role="group" aria-label="Beer styles">
          {BEER_STYLES.map((s) => (
            <button
              key={s}
              className={`chip ${styles.includes(s) ? 'active' : ''}`}
              onClick={() => toggleStyle(s)}
              aria-pressed={styles.includes(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="filter-row">
          <label className="toggle">
            <input type="checkbox" checked={draftOnly} onChange={(e) => setDraftOnly(e.target.checked)} />
            Draft only 🚰
          </label>
          {hasFilters && (
            <button className="link-btn" onClick={clearFilters}>
              Clear filters
            </button>
          )}
          <span className="results-count">
            {visible.length} {visible.length === 1 ? 'beer' : 'beers'}
          </span>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="panel empty">
          <div className="big">🫗</div>
          <h2>Empty glass!</h2>
          <p>No beers match these filters. Know a price? Be the first to share it.</p>
          <button className="btn" onClick={onAdd}>
            Add a price
          </button>
        </div>
      ) : (
        <div className="grid">
          {visible.map((p, i) => (
            <PriceCard
              key={p.id}
              price={p}
              index={i}
              minPerLiter={minPL}
              maxPerLiter={maxPL}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </section>
  )
}
