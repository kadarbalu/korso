import type { BeerPrice, District } from '../types'

export type LatLng = [number, number]

export const BUDAPEST_CENTER: LatLng = [47.4979, 19.0402]

// Rough center of each district, used when we don't know a pub's exact spot.
export const DISTRICT_CENTERS: Record<District, LatLng> = {
  I: [47.4967, 19.0386],
  II: [47.539, 18.987],
  III: [47.564, 19.04],
  IV: [47.566, 19.089],
  V: [47.499, 19.051],
  VI: [47.507, 19.065],
  VII: [47.5, 19.07],
  VIII: [47.489, 19.082],
  IX: [47.475, 19.08],
  X: [47.48, 19.15],
  XI: [47.46, 19.03],
  XII: [47.5, 18.98],
  XIII: [47.53, 19.07],
  XIV: [47.517, 19.1],
  XV: [47.56, 19.13],
  XVI: [47.515, 19.19],
  XVII: [47.48, 19.25],
  XVIII: [47.43, 19.2],
  XIX: [47.446, 19.145],
  XX: [47.433, 19.118],
  XXI: [47.42, 19.065],
  XXII: [47.425, 19.02],
  XXIII: [47.39, 19.12],
}

// Demo pubs are made up; these are plausible spots in their districts.
export const PUB_LOCATIONS: Record<string, LatLng> = {
  'Rozsdás Kert': [47.497, 19.063],
  'Hordó & Hab': [47.4905, 19.072],
  'A Részeg Hattyú': [47.4985, 19.052],
  'Kocsma a Sarkon': [47.473, 19.048],
  'Komló Kézműves': [47.504, 19.06],
  'Budai Söröző': [47.5, 19.034],
  'Óbudai Pince': [47.541, 19.04],
  'Ferencvárosi Kantin': [47.482, 19.07],
  'Újlipóciai Csapszék': [47.52, 19.056],
  'Zuglói Haverok': [47.513, 19.105],
  'Rakparti Hajó': [47.513, 19.036],
  'Kispesti Korsó': [47.446, 19.145],
  'Csepeli Kikötő': [47.425, 19.068],
}

/** Best known location: the pin the user set, then the known pub spot, then the district center. */
export function locate(p: Pick<BeerPrice, 'pub' | 'district' | 'lat' | 'lng'>): LatLng {
  if (p.lat != null && p.lng != null) return [p.lat, p.lng]
  return PUB_LOCATIONS[p.pub] ?? DISTRICT_CENTERS[p.district]
}
