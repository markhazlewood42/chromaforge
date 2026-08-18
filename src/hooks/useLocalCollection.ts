// Interim localStorage-backed "owned paints" store. TODO: replace with a Supabase-backed hook
// against the `user_collection` table once migrations are applied and auth is fully wired.

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'chromaforge:owned-paints'

function readStoredIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

export function useLocalCollection() {
  const [ownedIds, setOwnedIds] = useState<Set<string>>(() => readStoredIds())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ownedIds]))
  }, [ownedIds])

  const toggle = useCallback((ciCode: string) => {
    setOwnedIds((prev) => {
      const next = new Set(prev)
      if (next.has(ciCode)) next.delete(ciCode)
      else next.add(ciCode)
      return next
    })
  }, [])

  const isOwned = useCallback((ciCode: string) => ownedIds.has(ciCode), [ownedIds])

  return { ownedIds, toggle, isOwned }
}
