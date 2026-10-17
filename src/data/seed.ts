import type { BeerPrice } from '../types'

// Demo data for the beta. Pub names and prices are made up.
type Seed = Omit<BeerPrice, 'id' | 'reportedAt'> & { daysAgo: number }

const seeds: Seed[] = [
  { pub: 'Rozsdás Kert', district: 'VII', beer: 'Soproni', style: 'Lager', sizeLiters: 0.5, priceHuf: 990, draft: true, daysAgo: 1 },
  { pub: 'Rozsdás Kert', district: 'VII', beer: 'Hazy Duna IPA', style: 'IPA', sizeLiters: 0.4, priceHuf: 1890, draft: true, daysAgo: 1 },
  { pub: 'Hordó & Hab', district: 'VIII', beer: 'Dreher Classic', style: 'Lager', sizeLiters: 0.5, priceHuf: 890, draft: true, daysAgo: 2 },
  { pub: 'Hordó & Hab', district: 'VIII', beer: 'Guinness', style: 'Stout', sizeLiters: 0.5, priceHuf: 1990, draft: true, daysAgo: 4 },
  { pub: 'A Részeg Hattyú', district: 'V', beer: 'Pilsner Urquell', style: 'Pilsner', sizeLiters: 0.5, priceHuf: 1690, draft: true, daysAgo: 3 },
  { pub: 'A Részeg Hattyú', district: 'V', beer: 'Hoegaarden', style: 'Wheat', sizeLiters: 0.5, priceHuf: 1890, draft: true, daysAgo: 6 },
  { pub: 'Kocsma a Sarkon', district: 'XI', beer: 'Borsodi', style: 'Lager', sizeLiters: 0.5, priceHuf: 650, draft: true, daysAgo: 1 },
  { pub: 'Kocsma a Sarkon', district: 'XI', beer: 'Dreher Bak', style: 'Dark Lager', sizeLiters: 0.5, priceHuf: 790, draft: false, daysAgo: 5 },
  { pub: 'Komló Kézműves', district: 'VI', beer: 'Savanyú Meggy', style: 'Sour', sizeLiters: 0.3, priceHuf: 1450, draft: true, daysAgo: 2 },
  { pub: 'Komló Kézműves', district: 'VI', beer: 'Budai Pale Ale', style: 'Pale Ale', sizeLiters: 0.4, priceHuf: 1490, draft: true, daysAgo: 2 },
  { pub: 'Komló Kézműves', district: 'VI', beer: 'Tripla Komló DIPA', style: 'IPA', sizeLiters: 0.3, priceHuf: 1690, draft: true, daysAgo: 7 },
  { pub: 'Budai Söröző', district: 'I', beer: 'Kozel Premium', style: 'Lager', sizeLiters: 0.5, priceHuf: 1390, draft: true, daysAgo: 3 },
  { pub: 'Budai Söröző', district: 'I', beer: 'Kozel Dark', style: 'Dark Lager', sizeLiters: 0.5, priceHuf: 1390, draft: true, daysAgo: 3 },
  { pub: 'Óbudai Pince', district: 'III', beer: 'Arany Ászok', style: 'Lager', sizeLiters: 0.5, priceHuf: 720, draft: true, daysAgo: 9 },
  { pub: 'Óbudai Pince', district: 'III', beer: 'Somersby Apple', style: 'Cider', sizeLiters: 0.33, priceHuf: 990, draft: false, daysAgo: 9 },
  { pub: 'Ferencvárosi Kantin', district: 'IX', beer: 'Soproni Óvatos Duhaj IPA', style: 'IPA', sizeLiters: 0.5, priceHuf: 1190, draft: true, daysAgo: 2 },
  { pub: 'Ferencvárosi Kantin', district: 'IX', beer: 'Paulaner Weissbier', style: 'Wheat', sizeLiters: 0.5, priceHuf: 1790, draft: true, daysAgo: 8 },
  { pub: 'Újlipóciai Csapszék', district: 'XIII', beer: 'Staropramen', style: 'Lager', sizeLiters: 0.5, priceHuf: 1190, draft: true, daysAgo: 4 },
  { pub: 'Újlipóciai Csapszék', district: 'XIII', beer: 'Fekete Macska Stout', style: 'Stout', sizeLiters: 0.4, priceHuf: 1590, draft: true, daysAgo: 4 },
  { pub: 'Zuglói Haverok', district: 'XIV', beer: 'Dreher 24', style: 'Lager', sizeLiters: 0.5, priceHuf: 590, draft: false, daysAgo: 1 },
  { pub: 'Zuglói Haverok', district: 'XIV', beer: 'Pécsi Szalon', style: 'Lager', sizeLiters: 0.5, priceHuf: 790, draft: true, daysAgo: 6 },
  { pub: 'Rakparti Hajó', district: 'II', beer: 'Pilsner Urquell', style: 'Pilsner', sizeLiters: 0.4, priceHuf: 1790, draft: true, daysAgo: 5 },
  { pub: 'Rakparti Hajó', district: 'II', beer: 'Kőbányai Pale Ale', style: 'Pale Ale', sizeLiters: 0.5, priceHuf: 1650, draft: true, daysAgo: 10 },
  { pub: 'Kispesti Korsó', district: 'XIX', beer: 'Borsodi Bivaly', style: 'Lager', sizeLiters: 0.5, priceHuf: 690, draft: true, daysAgo: 3 },
  { pub: 'Csepeli Kikötő', district: 'XXI', beer: 'Soproni Démon', style: 'Dark Lager', sizeLiters: 0.5, priceHuf: 750, draft: true, daysAgo: 12 },
]

export const SEED_PRICES: BeerPrice[] = seeds.map(({ daysAgo, ...rest }, i) => ({
  ...rest,
  id: `seed-${i}`,
  reportedAt: new Date(Date.now() - daysAgo * 86_400_000).toISOString(),
}))
