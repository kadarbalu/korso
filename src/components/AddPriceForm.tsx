import { lazy, Suspense, useState, type FormEvent } from 'react'
import { DISTRICT_CENTERS, PUB_LOCATIONS, type LatLng } from '../data/locations'
import { BEER_STYLES, DISTRICTS, SIZES, type BeerPrice, type BeerStyle, type District } from '../types'

// Leaflet is only loaded when the form is opened
const LocationPicker = lazy(() => import('./LocationPicker'))

type NewPrice = Omit<BeerPrice, 'id' | 'reportedAt' | 'userSubmitted'>

interface Props {
  onSubmit: (p: NewPrice) => void
  knownPubs: string[]
  knownBeers: string[]
}

export function AddPriceForm({ onSubmit, knownPubs, knownBeers }: Props) {
  const [pub, setPub] = useState('')
  const [district, setDistrict] = useState<District>('VII')
  const [beer, setBeer] = useState('')
  const [style, setStyle] = useState<BeerStyle>('Lager')
  const [size, setSize] = useState(0.5)
  const [price, setPrice] = useState('')
  const [draft, setDraft] = useState(true)
  const [pin, setPin] = useState<LatLng | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Where the picker looks when nothing is pinned: the known pub, else the district center
  const pickerCenter = PUB_LOCATIONS[pub.trim()] ?? DISTRICT_CENTERS[district]

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const priceNum = Number(price)
    const errs: Record<string, string> = {}
    if (!pub.trim()) errs.pub = 'Which pub was it?'
    if (!beer.trim()) errs.beer = 'Which beer did you have?'
    if (!Number.isFinite(priceNum) || priceNum < 100 || priceNum > 20000)
      errs.price = 'Enter a price between 100 and 20 000 Ft'
    setErrors(errs)
    if (Object.keys(errs).length) return

    onSubmit({
      pub: pub.trim(),
      district,
      beer: beer.trim(),
      style,
      sizeLiters: size,
      priceHuf: Math.round(priceNum),
      draft,
      ...(pin ? { lat: pin[0], lng: pin[1] } : {}),
    })
  }

  return (
    <section className="panel form">
      <h2>➕ Share a beer price</h2>
      <p className="hint">Just had a beer? Tell everyone what it cost. 🍻</p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="pub">Pub</label>
            <input
              id="pub"
              className="input"
              list="pub-list"
              value={pub}
              onChange={(e) => setPub(e.target.value)}
              placeholder="e.g. Kocsma a Sarkon"
            />
            <datalist id="pub-list">
              {knownPubs.map((p) => <option key={p} value={p} />)}
            </datalist>
            {errors.pub && <span className="error">{errors.pub}</span>}
          </div>

          <div className="field">
            <label htmlFor="district">District</label>
            <select
              id="district"
              className="select"
              value={district}
              onChange={(e) => setDistrict(e.target.value as District)}
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}. kerület</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="beer">Beer</label>
            <input
              id="beer"
              className="input"
              list="beer-list"
              value={beer}
              onChange={(e) => setBeer(e.target.value)}
              placeholder="e.g. Soproni"
            />
            <datalist id="beer-list">
              {knownBeers.map((b) => <option key={b} value={b} />)}
            </datalist>
            {errors.beer && <span className="error">{errors.beer}</span>}
          </div>

          <div className="field">
            <label htmlFor="style">Style</label>
            <select
              id="style"
              className="select"
              value={style}
              onChange={(e) => setStyle(e.target.value as BeerStyle)}
            >
              {BEER_STYLES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="field full">
            <label>Size</label>
            <div className="size-picker" role="group" aria-label="Size">
              {SIZES.map((s) => (
                <button
                  type="button"
                  key={s}
                  className={`chip ${size === s ? 'active' : ''}`}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                >
                  {s.toLocaleString('hu-HU')} l
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="price">Price (Ft)</label>
            <input
              id="price"
              className="input"
              type="number"
              inputMode="numeric"
              min={100}
              step={10}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 990"
            />
            {errors.price && <span className="error">{errors.price}</span>}
          </div>

          <div className="field">
            <label>Served as</label>
            <div className="size-picker">
              <button type="button" className={`chip ${draft ? 'active' : ''}`} onClick={() => setDraft(true)} aria-pressed={draft}>
                🚰 Draft
              </button>
              <button type="button" className={`chip ${!draft ? 'active' : ''}`} onClick={() => setDraft(false)} aria-pressed={!draft}>
                🍾 Bottle/can
              </button>
            </div>
          </div>

          <div className="field full">
            <label>
              Pin the pub on the map <span className="optional">(optional)</span>
            </label>
            <p className="hint picker-hint">
              {pin
                ? 'Pinned! Drag the glass to fine-tune.'
                : 'Tap the map where the pub is. If you skip this, it shows at the center of its district.'}
              {pin && (
                <button type="button" className="link-btn" onClick={() => setPin(null)}>
                  Remove pin
                </button>
              )}
            </p>
            <Suspense fallback={<div className="picker-map picker-loading">Loading map…</div>}>
              <LocationPicker value={pin} center={pickerCenter} onChange={setPin} />
            </Suspense>
          </div>
        </div>

        <div className="form-actions">
          <p className="note">
            Beta: prices you add are saved in this browser only. Shared posting comes with the backend.
          </p>
          <button type="submit" className="btn">Publish price 🍺</button>
        </div>
      </form>
    </section>
  )
}
