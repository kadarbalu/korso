import { useMemo } from 'react'
import { formatHuf, formatSize, perLiter } from '../lib/prices'
import type { BeerPrice } from '../types'

const MEDALS = ['🥇', '🥈', '🥉']

function averageBy(prices: BeerPrice[], key: (p: BeerPrice) => string) {
  const groups = new Map<string, number[]>()
  for (const p of prices) {
    const k = key(p)
    groups.set(k, [...(groups.get(k) ?? []), perLiter(p) / 2]) // price of a 0.5 l
  }
  return [...groups.entries()]
    .map(([name, values]) => ({
      name,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      count: values.length,
    }))
    .sort((a, b) => a.avg - b.avg)
}

function Bars({ rows }: { rows: { name: string; avg: number; count: number }[] }) {
  const max = Math.max(...rows.map((r) => r.avg))
  return (
    <div className="bars">
      {rows.map((r) => (
        <div className="bar-row" key={r.name} title={`${r.count} report(s)`}>
          <span>{r.name}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(r.avg / max) * 100}%` }} />
          </div>
          <span className="bar-value">{formatHuf(r.avg)}</span>
        </div>
      ))}
    </div>
  )
}

export function Compare({ prices }: { prices: BeerPrice[] }) {
  const stats = useMemo(() => {
    const byValue = [...prices].sort((a, b) => perLiter(a) - perLiter(b))
    const byStyle = averageBy(prices, (p) => p.style)
    const byDistrict = averageBy(prices, (p) => `${p.district}. ker.`)
    const pubs = new Set(prices.map((p) => p.pub))
    return {
      cheapest: byValue.slice(0, 5),
      priciest: byValue.at(-1),
      byStyle,
      byDistrict,
      pubCount: pubs.size,
    }
  }, [prices])

  if (prices.length === 0) return null

  return (
    <div className="compare">
      <section className="panel">
        <h2>🏆 Cheapest beers</h2>
        <p className="hint">Ranked by price per liter, so every size is compared fairly.</p>
        <ol className="leaderboard">
          {stats.cheapest.map((p, i) => (
            <li key={p.id}>
              <span className="rank">{MEDALS[i] ?? i + 1}</span>
              <div>
                <div className="lb-name">{p.beer}</div>
                <div className="lb-sub">
                  {p.pub} · {p.district}. ker.
                </div>
              </div>
              <div className="lb-price">
                {formatHuf(p.priceHuf)}
                <small>{formatSize(p.sizeLiters)}</small>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel">
        <h2>🍻 Average by style</h2>
        <p className="hint">Average price of a 0.5 l, cheapest first.</p>
        <Bars rows={stats.byStyle} />
      </section>

      <section className="panel">
        <h2>🗺️ Average by district</h2>
        <p className="hint">Average price of a 0.5 l, cheapest first.</p>
        <Bars rows={stats.byDistrict} />
      </section>

      <section className="panel span-all">
        <h2>🤓 Fun facts</h2>
        <div className="fun-facts">
          <div className="fact">
            <div className="emoji">📋</div>
            <strong>{prices.length}</strong>
            <span>prices reported</span>
          </div>
          <div className="fact">
            <div className="emoji">🏠</div>
            <strong>{stats.pubCount}</strong>
            <span>pubs covered</span>
          </div>
          <div className="fact">
            <div className="emoji">💸</div>
            <strong>{formatHuf(perLiter(stats.cheapest[0]) / 2)}</strong>
            <span>cheapest 0.5 l in town</span>
          </div>
          {stats.priciest && (
            <div className="fact">
              <div className="emoji">😱</div>
              <strong>{formatHuf(perLiter(stats.priciest) / 2)}</strong>
              <span>priciest 0.5 l ({stats.priciest.beer})</span>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
