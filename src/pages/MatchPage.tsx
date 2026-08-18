import { useMemo, useRef, useState } from 'react'
import {
  Button,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  Label,
  parseColor,
} from '@heroui/react'
import { PIGMENT_CATALOG } from '../data/catalog'
import { useLocalCollection } from '../hooks/useLocalCollection'
import { solveMix, isNoMatch, type RecipeCandidate } from '../engine/solver'
import type { OwnedPaint } from '../engine/pigment'
import { useLocalHistory } from '../hooks/useLocalHistory'

const NO_MATCH_THRESHOLD = 15

function MatchPage() {
  const { ownedIds } = useLocalCollection()
  const { save: saveToHistory } = useLocalHistory()
  const [targetHex, setTargetHex] = useState('#4a7043')
  const [results, setResults] = useState<RecipeCandidate[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSolving, setIsSolving] = useState(false)
  const [savedIndex, setSavedIndex] = useState<number | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  const ownedPaints: OwnedPaint[] = useMemo(
    () =>
      PIGMENT_CATALOG.filter((p) => ownedIds.has(p.ciCode)).map((p) => ({
        id: p.ciCode,
        label: p.commonName,
        masstoneHex: p.masstoneHex,
        tintingStrength: p.tintingStrength,
      })),
    [ownedIds],
  )

  function handleFindMix() {
    setError(null)
    setResults(null)
    setSavedIndex(null)

    if (ownedPaints.length === 0) {
      setError('Add some paints to your collection first (see the Collection page).')
      return
    }

    setIsSolving(true)
    try {
      const candidates = solveMix(targetHex, ownedPaints)
      setResults(candidates)
    } catch {
      setError('Something went wrong finding a match. Try a different target color.')
    } finally {
      setIsSolving(false)
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setImageError(null)
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setImageError('That file doesn\'t look like an image.')
      return
    }
    const url = URL.createObjectURL(file)
    setImageSrc(url)
  }

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * canvas.width)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * canvas.height)
    try {
      const [r, g, b] = ctx.getImageData(x, y, 1, 1).data
      const hex = `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
      setTargetHex(hex)
    } catch {
      setImageError('Could not sample that pixel.')
    }
  }

  function handleImageLoad(img: HTMLImageElement) {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(img, 0, 0)
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-semibold">Match</h1>
      <p className="mb-6 text-neutral-500">
        Pick a target color, or sample one from a photo, then find the best paint recipe from your
        collection.
      </p>

      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <ColorPicker
            value={parseColor(targetHex)}
            onChange={(color) => setTargetHex(color.toString('hex'))}
          >
            <ColorPicker.Trigger>
              <ColorSwatch size="lg" />
              <Label>Target color</Label>
            </ColorPicker.Trigger>
            <ColorPicker.Popover className="gap-2">
              <ColorArea
                aria-label="Color area"
                className="max-w-full"
                colorSpace="hsb"
                xChannel="saturation"
                yChannel="brightness"
              >
                <ColorArea.Thumb />
              </ColorArea>
              <ColorSlider aria-label="Hue slider" channel="hue" className="gap-1 px-1" colorSpace="hsb">
                <ColorSlider.Track>
                  <ColorSlider.Thumb />
                </ColorSlider.Track>
              </ColorSlider>
              <ColorField aria-label="Hex value">
                <ColorField.Group variant="secondary">
                  <ColorField.Input />
                </ColorField.Group>
              </ColorField>
            </ColorPicker.Popover>
          </ColorPicker>
          <span className="text-sm text-neutral-500">{targetHex}</span>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-600">
            Or sample from a photo
          </label>
          <input accept="image/*" type="file" onChange={handleImageUpload} />
          {imageError ? <p className="mt-1 text-sm text-red-600">{imageError}</p> : null}
          {imageSrc ? (
            <div className="mt-2">
              <img
                alt="Uploaded reference"
                className="hidden"
                src={imageSrc}
                onLoad={(e) => handleImageLoad(e.currentTarget)}
              />
              <canvas
                ref={canvasRef}
                className="max-w-full cursor-crosshair border border-neutral-200"
                onClick={handleCanvasClick}
              />
              <p className="mt-1 text-xs text-neutral-500">Click the image to sample a color.</p>
            </div>
          ) : null}
        </div>

        <Button isPending={isSolving} onPress={handleFindMix}>
          {isSolving ? 'Finding mix...' : 'Find mix'}
        </Button>
      </div>

      {error ? <p className="mb-4 text-red-600">{error}</p> : null}

      {results ? (
        <div className="flex flex-col gap-3">
          {results.map((candidate, i) => (
            <div key={i} className="rounded-lg border border-neutral-200 p-4">
              <div className="mb-2 flex items-center gap-3">
                <ColorSwatch aria-label="Predicted color" color={candidate.predictedHex} size="lg" />
                <div>
                  <p className="font-medium">{candidate.predictedHex}</p>
                  <p className="text-sm text-neutral-500">
                    {isNoMatch(candidate, NO_MATCH_THRESHOLD)
                      ? `No close match (ΔE ${candidate.deltaE.toFixed(1)})`
                      : `ΔE ${candidate.deltaE.toFixed(1)}`}
                  </p>
                </div>
              </div>
              <ul className="mb-3 text-sm text-neutral-700">
                {candidate.components.map((c) => (
                  <li key={c.paintId}>
                    {Math.round(c.ratio * 100)}% {c.label}
                  </li>
                ))}
              </ul>
              <Button
                size="sm"
                variant="secondary"
                onPress={() => {
                  saveToHistory(targetHex, candidate)
                  setSavedIndex(i)
                }}
              >
                {savedIndex === i ? 'Saved' : 'Save to history'}
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default MatchPage
