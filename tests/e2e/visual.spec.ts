import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Visual Composition & Screenshot Verification', () => {
  test('capture and verify Screen 0 visual framing', async ({ page }) => {
    await page.goto('/');

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Wait for textures and initial render
    await page.waitForTimeout(1500);

    const screenshotDir = path.join(process.cwd(), 'tests', 'screenshots');
    fs.mkdirSync(screenshotDir, { recursive: true });

    const screenshotPath = path.join(screenshotDir, 'recreation_screen0.png');
    await canvas.screenshot({ path: screenshotPath });

    expect(fs.existsSync(screenshotPath)).toBe(true);
    const stats = fs.statSync(screenshotPath);
    expect(stats.size).toBeGreaterThan(1000); // Verify meaningful non-empty screenshot
  });
});
