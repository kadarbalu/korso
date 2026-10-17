import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, useMap } from 'react-leaflet'
import { AutoResize, BaseTiles } from './mapParts'
import { BUDAPEST_CENTER, locate, type LatLng } from '../data/locations'
import { cheapness, formatHuf, formatSize, perLiter } from '../lib/prices'
import { BEER_STYLES, type BeerPrice, type BeerStyle } from '../types'

interface Pub {
  key: string
  name: string
  district: string
  position: LatLng
  beers: BeerPrice[] // sorted cheapest per liter first
  bestPint: number // cheapest beer, as the price of a 0.5 l
}

function groupByPub(prices: BeerPrice[]): Pub[] {
  const map = new Map<string, BeerPrice[]>()
  for (const p of prices) {
    const key = `${p.pub.toLowerCase()}|${p.district}`
    map.set(key, [...(map.get(key) ?? []), p])
  }
  return [...map.entries()].map(([key, beers]) => {
    const sorted = [...beers].sort((a, b) => perLiter(a) - perLiter(b))
    // Prefer an exact pin if any report for this pub has one
    const pinned = beers.find((b) => b.lat != null && b.lng != null)
    return {
      key,
      name: beers[0].pub,
      district: beers[0].district,
      position: locate(pinned ?? beers[0]),
      beers: sorted,
      bestPint: perLiter(sorted[0]) / 2,
    }
  })
}

function tier(fill: number) {
  return fill > 0.66 ? 'cheap' : fill > 0.33 ? 'mid' : 'pricey'
}

function pinIcon(pub: Pub, fill: number, isCheapest: boolean) {
  const label = Math.round(pub.bestPint).toLocaleString('hu-HU')
  return L.divIcon({
    className: '', // drop Leaflet's default white box
    html: `<div class="pin pin-${tier(fill)}">${isCheapest ? '<span class="pin-crown">👑</span>' : ''}${label}<small>Ft</small></div>`,
    iconSize: [64, 44],
    iconAnchor: [32, 44],
    popupAnchor: [0, -40],
  })
}

/** Zoom the map to fit all visible pubs whenever the set changes. */
function FitToPubs({ pubs }: { pubs: Pub[] }) {
  const map = useMap()
  const key = pubs.map((p) => p.key).join(',')
  useEffect(() => {
    if (pubs.length === 0) return
    if (pubs.length === 1) {
      map.setView(pubs[0].position, 15)
      return
    }
    map.fitBounds(L.latLngBounds(pubs.map((p) => p.position)), { padding: [50, 50], maxZoom: 15 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map])
  return null
}

export default function MapView({ prices }: { prices: BeerPrice[] }) {
  const [styles, setStyles] = useState<BeerStyle[]>([])

  const toggleStyle = (s: BeerStyle) =>
    setStyles((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  const pubs = useMemo(() => {
    const filtered = styles.length ? prices.filter((p) => styles.includes(p.style)) : prices
    return groupByPub(filtered)
  }, [prices, styles])

  const [min, max] = useMemo(() => {
    const values = pubs.map((p) => p.bestPint)
    return [Math.min(...values), Math.max(...values)]
  }, [pubs])

  const cheapestKey = pubs.reduce<Pub | null>((best, p) => (!best || p.bestPint < best.bestPint ? p : best), null)?.key

  return (
    <section className="map-section">
      <div className="panel filters">
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
          <div className="legend">
            <span><i className="dot dot-cheap" /> Cheap</span>
            <span><i className="dot dot-mid" /> Fair</span>
            <span><i className="dot dot-pricey" /> Pricey</span>
            <span>👑 Cheapest pint</span>
          </div>
          <span className="results-count">
            {pubs.length} {pubs.length === 1 ? 'pub' : 'pubs'}
          </span>
        </div>
        <p className="hint map-hint">Pins show each pub's cheapest beer as the price of a 0.5 l. Tap a pin to see all its beers.</p>
      </div>

      <div className="map-frame">
        <MapContainer center={BUDAPEST_CENTER} zoom={12} scrollWheelZoom className="map">
          <BaseTiles />
          <AutoResize />
          <FitToPubs pubs={pubs} />
          {pubs.map((pub) => (
            <Marker
              key={pub.key}
              position={pub.position}
              icon={pinIcon(pub, cheapness(pub.bestPint, min, max), pub.key === cheapestKey)}
              title={pub.name}
            >
              <Popup>
                <div className="popup">
                  <h3>{pub.name}</h3>
                  <p className="popup-sub">{pub.district}. kerület · {pub.beers.length} {pub.beers.length === 1 ? 'beer' : 'beers'}</p>
                  <ul>
                    {pub.beers.map((b) => (
                      <li key={b.id}>
                        <span>
                          <strong>{b.beer}</strong>
                          <em>{b.style} · {formatSize(b.sizeLiters)}{b.draft ? ' · draft' : ''}</em>
                        </span>
                        <b>{formatHuf(b.priceHuf)}</b>
                      </li>
                    ))}
                  </ul>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        {pubs.length === 0 && (
          <div className="map-empty">🫗 No pubs serve these styles yet.</div>
        )}
      </div>
    </section>
  )
}
