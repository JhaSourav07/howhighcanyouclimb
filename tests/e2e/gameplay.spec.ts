import { test, expect } from '@playwright/test';

test.describe('Jump King Browser Recreation E2E', () => {
  test('direct access: loads directly into game viewport with canvas and HUD', async ({ page }) => {
    await page.goto('/');

    // Verify page title
    await expect(page).toHaveTitle(/Jump King Browser/);

    // Verify Phaser canvas is created and rendered
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Verify HUD elements
    await expect(page.getByText(/SCREEN 1\/42/i)).toBeVisible();
    await expect(page.getByText(/0m/i)).toBeVisible();
    await expect(page.getByText(/JUMPS: 0/i)).toBeVisible();
  });

  test('desktop layout: displays left and right skyscraper ad placeholders outside viewport', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop-only test');
    await page.goto('/');

    const leftSponsor = page.getByLabel('left advertisement');
    const rightSponsor = page.getByLabel('right advertisement');

    await expect(leftSponsor).toBeVisible();
    await expect(rightSponsor).toBeVisible();
  });

  test('mobile layout: hides desktop ads and enables on-screen touch controls', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test');
    await page.goto('/');

    const leftSponsor = page.getByLabel('left advertisement');
    await expect(leftSponsor).toBeHidden();

    const walkLeftBtn = page.getByLabel('Walk Left');
    const walkRightBtn = page.getByLabel('Walk Right');
    const jumpBtn = page.getByLabel('Jump Charge');

    await expect(walkLeftBtn).toBeVisible();
    await expect(walkRightBtn).toBeVisible();
    await expect(jumpBtn).toBeVisible();
  });

  test('jump mechanics: charges on Space down and executes on Space up', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Keyboard-only test');
    await page.goto('/');

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Initial state
    await expect(page.getByText(/JUMPS: 0/i)).toBeVisible();

    // Click canvas to ensure window/game focus
    await canvas.click();
    await page.waitForTimeout(100);

    // Hold Spacebar to charge jump
    await page.keyboard.down('Space');
    await page.waitForTimeout(300);

    // Charge gauge should become visible
    await expect(page.getByText(/CHARGE/i)).toBeVisible();

    // Release Spacebar to execute jump
    await page.keyboard.up('Space');
    await page.waitForTimeout(500);

    // Jump count should increment to 1
    await expect(page.getByText(/JUMPS: 1/i)).toBeVisible();
  });
});
