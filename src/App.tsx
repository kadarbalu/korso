import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { AddPriceForm } from './components/AddPriceForm'
import { Bubbles } from './components/Bubbles'
import { Compare } from './components/Compare'
import { Header, type Tab } from './components/Header'
import { PriceList } from './components/PriceList'
import { perLiter, usePrices } from './lib/prices'

// Leaflet is only loaded when the map is opened
const MapView = lazy(() => import('./components/MapView'))

const TABS: Tab[] = ['prices', 'map', 'compare', 'add']
const readTab = (): Tab => {
  const h = location.hash.slice(1) as Tab
  return TABS.includes(h) ? h : 'prices'
}

const CHEERS =['Egészségedre! 🍻', 'Cheers! 🍺', 'Prost! 🍻', 'Na zdravie! 🍺']

export default function App() {
  const { prices, addPrice, removePrice } = usePrices()
  const [tab, setTab] = useState<Tab>(readTab)

  // Keep the tab in the URL hash so links like /#compare work.
  useEffect(() => {
    const onHash = () => setTab(readTab())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => {
    const hash = tab === 'prices' ? '' : `#${tab}`
    if (location.hash !== hash) history.replaceState(null, '', hash || location.pathname)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [tab])
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const pintIndex = useMemo(() => {
    if (prices.length === 0) return null
    return prices.reduce((sum, p) => sum + perLiter(p) / 2, 0) / prices.length
  }, [prices])

  const knownPubs = useMemo(() => [...new Set(prices.map((p) => p.pub))].sort(), [prices])
  const knownBeers = useMemo(() => [...new Set(prices.map((p) => p.beer))].sort(), [prices])

  return (
    <>
      <Bubbles />
      <div className="app">
        <Header tab={tab} onTab={setTab} pintIndex={pintIndex} />
        <main>
          {tab === 'prices' && (
            <PriceList prices={prices} onRemove={removePrice} onAdd={() => setTab('add')} />
          )}
          {tab === 'map' && (
            <Suspense fallback={<div className="panel empty">🗺️ Loading map…</div>}>
              <MapView prices={prices} />
            </Suspense>
          )}
          {tab === 'compare' && <Compare prices={prices} />}
          {tab === 'add' && (
            <AddPriceForm
              knownPubs={knownPubs}
              knownBeers={knownBeers}
              onSubmit={(p) => {
                addPrice(p)
                setTab('prices')
                setToast(`${CHEERS[Math.floor(Math.random() * CHEERS.length)]} Price published.`)
              }}
            />
          )}
        </main>
        <footer className="footer">
          Korsó beta · demo data, pub names and prices are made up · drink responsibly 💛
        </footer>
      </div>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  )
}
