export const BEER_STYLES = [
  'Lager',
  'Pilsner',
  'IPA',
  'Pale Ale',
  'Wheat',
  'Stout',
  'Dark Lager',
  'Sour',
  'Cider',
] as const

export type BeerStyle = (typeof BEER_STYLES)[number]

// Budapest districts I–XXIII
export const DISTRICTS = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII',
  'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII',
] as const

export type District = (typeof DISTRICTS)[number]

export const SIZES = [0.3, 0.33, 0.4, 0.5, 1] as const

export interface BeerPrice {
  id: string
  pub: string
  district: District
  beer: string
  style: BeerStyle
  sizeLiters: number
  priceHuf: number
  draft: boolean
  reportedAt: string // ISO date
  userSubmitted?: boolean
  // Optional exact pub location (set via the map picker)
  lat?: number
  lng?: number
}

export type SortKey = 'perLiter' | 'price' | 'newest'
