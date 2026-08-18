// Interim localStorage-backed match history. TODO: replace with a Supabase-backed hook against
// the `matches` table once migrations are applied.

import { useCallback, useEffect, useState } from 'react'
import type { RecipeCandidate } from '../engine/solver'

export type SavedMatch = {
  id: string
  targetHex: string
  candidate: RecipeCandidate
  savedAt: string
}

const STORAGE_KEY = 'chromaforge:match-history'

function readStored(): SavedMatch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SavedMatch[]
  } catch {
    return []
  }
}

export function useLocalHistory() {
  const [matches, setMatches] = useState<SavedMatch[]>(() => readStored())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches))
  }, [matches])

  const save = useCallback((targetHex: string, candidate: RecipeCandidate) => {
    const entry: SavedMatch = {
      id: crypto.randomUUID(),
      targetHex,
      candidate,
      savedAt: new Date().toISOString(),
    }
    setMatches((prev) => [entry, ...prev])
  }, [])

  const remove = useCallback((id: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== id))
  }, [])

  return { matches, save, remove }
}
