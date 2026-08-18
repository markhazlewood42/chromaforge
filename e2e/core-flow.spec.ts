import { test, expect, type Page } from '@playwright/test'

// Clicking the checkbox's visual control directly is flaky (its animated checkmark SVG can
// intercept the click point). Clicking the wrapping <label> (Checkbox.Content) is what a real
// user does when they click the paint name, and reliably toggles the underlying input in both
// Chromium and Firefox.
function paintLabel(page: Page, name: string) {
  return page.locator('label').filter({ hasText: name })
}

test.describe('Collection -> Match -> History', () => {
  test('shows an error when trying to find a mix with an empty collection', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Find mix' }).click()
    await expect(page.getByText('Add some paints to your collection first')).toBeVisible()
  })

  test('lets you select paints in the collection', async ({ page }) => {
    await page.goto('/collection')
    await expect(page.getByText('Select the paints you own (0 selected)')).toBeVisible()

    await paintLabel(page, 'Titanium White').click()
    await expect(page.getByText('Select the paints you own (1 selected)')).toBeVisible()

    await paintLabel(page, 'Titanium White').click()
    await expect(page.getByText('Select the paints you own (0 selected)')).toBeVisible()
  })

  test('finds a mix from owned paints and saves it to history', async ({ page }) => {
    await page.goto('/collection')
    await paintLabel(page, 'Titanium White').click()
    await paintLabel(page, 'Ivory Black').click()
    await paintLabel(page, 'Cadmium Yellow Medium').click()
    await paintLabel(page, 'Ultramarine Blue').click()
    await expect(page.getByText('Select the paints you own (4 selected)')).toBeVisible()

    await page.goto('/')
    await page.getByRole('button', { name: 'Find mix' }).click()

    // At least one ranked recipe card should appear with a delta-E readout and components.
    await expect(page.getByText(/ΔE/).first()).toBeVisible()
    await expect(page.getByText(/Titanium White|Ivory Black|Ultramarine Blue|Cadmium Yellow Medium/).first()).toBeVisible()

    await page.getByRole('button', { name: 'Save to history' }).first().click()
    await expect(page.getByRole('button', { name: 'Saved' }).first()).toBeVisible()

    await page.goto('/history')
    await expect(page.getByText('No saved matches yet.')).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Remove' }).first()).toBeVisible()
  })

  test('removes a saved match from history', async ({ page }) => {
    // Seed a match via the UI first.
    await page.goto('/collection')
    await paintLabel(page, 'Cadmium Red Medium').click()
    await page.goto('/')
    await page.getByRole('button', { name: 'Find mix' }).click()
    await page.getByRole('button', { name: 'Save to history' }).first().click()

    await page.goto('/history')
    await expect(page.getByRole('button', { name: 'Remove' }).first()).toBeVisible()
    await page.getByRole('button', { name: 'Remove' }).first().click()
    await expect(page.getByText('No saved matches yet.')).toBeVisible()
  })
})
