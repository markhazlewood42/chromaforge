import { useMemo } from 'react'
import { Checkbox, ColorSwatch } from '@heroui/react'
import { PIGMENT_CATALOG } from '../data/catalog'
import { useLocalCollection } from '../hooks/useLocalCollection'

function CollectionPage() {
  const { ownedIds, toggle } = useLocalCollection()

  const grouped = useMemo(() => {
    const map = new Map<string, typeof PIGMENT_CATALOG>()
    for (const pigment of PIGMENT_CATALOG) {
      const list = map.get(pigment.category) ?? []
      list.push(pigment)
      map.set(pigment.category, list)
    }
    return map
  }, [])

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-semibold">Collection</h1>
      <p className="mb-6 text-neutral-500">
        Select the paints you own ({ownedIds.size} selected). This is the starter pigment catalog —
        brand-specific products are coming later, see <code>status.md</code>.
      </p>

      <div className="flex flex-col gap-6">
        {[...grouped.entries()].map(([category, pigments]) => (
          <section key={category}>
            <h2 className="mb-2 text-sm font-medium capitalize text-neutral-600">{category}</h2>
            <div className="flex flex-col gap-2">
              {pigments.map((pigment) => (
                <Checkbox
                  key={pigment.ciCode}
                  isSelected={ownedIds.has(pigment.ciCode)}
                  onChange={() => toggle(pigment.ciCode)}
                >
                  <Checkbox.Content>
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <ColorSwatch aria-label={pigment.commonName} color={pigment.masstoneHex} size="sm" />
                    <span>
                      {pigment.commonName}{' '}
                      <span className="text-neutral-400">
                        ({pigment.ciCode}, {pigment.tintingStrength} tinting, {pigment.opacity})
                      </span>
                    </span>
                  </Checkbox.Content>
                </Checkbox>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default CollectionPage
