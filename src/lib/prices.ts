import { useEffect, useState } from 'react'
import { SEED_PRICES } from '../data/seed'
import type { BeerPrice } from '../types'

const STORAGE_KEY = 'korso.userPrices.v1'

function loadUserPrices(): BeerPrice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as BeerPrice[]) : []
  } catch {
    return []
  }
}

/** Demo prices plus the ones this browser submitted (saved in localStorage). */
export function usePrices() {
  const [userPrices, setUserPrices] = useState<BeerPrice[]>(loadUserPrices)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userPrices))
    } catch {
      // storage unavailable (private mode etc.) – keep in memory only
    }
  }, [userPrices])

  const addPrice = (p: Omit<BeerPrice, 'id' | 'reportedAt' | 'userSubmitted'>) => {
    const entry: BeerPrice = {
      ...p,
      id: crypto.randomUUID(),
      reportedAt: new Date().toISOString(),
      userSubmitted: true,
    }
    setUserPrices((prev) => [entry, ...prev])
    return entry
  }

  const removePrice = (id: string) => setUserPrices((prev) => prev.filter((p) => p.id !== id))

  return { prices: [...userPrices, ...SEED_PRICES], addPrice, removePrice }
}

export const perLiter = (p: BeerPrice) => p.priceHuf / p.sizeLiters

export const formatHuf = (n: number) =>
  `${Math.round(n).toLocaleString('hu-HU')} Ft`

export const formatSize = (l: number) => `${l.toLocaleString('hu-HU')} l`

export function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}

/** 0 (expensive) … 1 (cheap), relative to the given range of per-liter prices. */
export function cheapness(value: number, min: number, max: number) {
  if (max === min) return 1
  return 1 - (value - min) / (max - min)
}
