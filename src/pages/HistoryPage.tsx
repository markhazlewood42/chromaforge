import { Button, ColorSwatch } from '@heroui/react'
import { useLocalHistory } from '../hooks/useLocalHistory'

function HistoryPage() {
  const { matches, remove } = useLocalHistory()

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-semibold">History</h1>
      <p className="mb-6 text-neutral-500">Your saved matches.</p>

      {matches.length === 0 ? (
        <p className="text-neutral-500">
          No saved matches yet. Find a mix on the Match page and save it.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((match) => (
            <div key={match.id} className="rounded-lg border border-neutral-200 p-4">
              <div className="mb-2 flex items-center gap-3">
                <ColorSwatch aria-label="Target" color={match.targetHex} size="md" />
                <span className="text-neutral-400">to</span>
                <ColorSwatch aria-label="Predicted" color={match.candidate.predictedHex} size="md" />
                <div className="ml-auto text-xs text-neutral-400">
                  {new Date(match.savedAt).toLocaleString()}
                </div>
              </div>
              <ul className="mb-2 text-sm text-neutral-700">
                {match.candidate.components.map((c) => (
                  <li key={c.paintId}>
                    {Math.round(c.ratio * 100)}% {c.label}
                  </li>
                ))}
              </ul>
              <p className="mb-2 text-xs text-neutral-500">ΔE {match.candidate.deltaE.toFixed(1)}</p>
              <Button size="sm" variant="danger-soft" onPress={() => remove(match.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryPage
