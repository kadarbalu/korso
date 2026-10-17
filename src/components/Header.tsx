export type Tab = 'prices' | 'map' | 'compare' | 'add'

const TABS: { id: Tab; label: string }[] = [
  { id: 'prices', label: '🍺 Prices' },
  { id: 'map', label: '🗺️ Map' },
  { id: 'compare', label: '🏆 Compare' },
  { id: 'add', label: '➕ Add a price' },
]

interface Props {
  tab: Tab
  onTab: (t: Tab) => void
  pintIndex: number | null
}

export function Header({ tab, onTab, pintIndex }: Props) {
  return (
    <header className="header">
      <div className="brand">
        <div className="logo" aria-hidden="true">
          <span className="logo-foam" />
          🍺
        </div>
        <div>
          <h1>Korsó</h1>
          <p className="tagline">Budapest's beer price radar</p>
        </div>
        {pintIndex !== null && (
          <div className="pint-index" title="Average price of a 0.5 l beer across all reports">
            <span className="pint-index-label">Pint index</span>
            <strong>{Math.round(pintIndex).toLocaleString('hu-HU')} Ft</strong>
          </div>
        )}
      </div>
      <nav className="tabs" aria-label="Sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'active' : ''} ${t.id === 'add' ? 'tab-add' : ''}`}
            onClick={() => onTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
