import { test, expect } from '@playwright/test';

test.describe('Jump King Browser Recreation E2E', () => {
  test('direct access: loads directly into game viewport with canvas and HUD', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Jump King Browser/);

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

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
    await page.waitForTimeout(1000);

    await expect(page.getByText(/JUMPS: 0/i)).toBeVisible();

    await canvas.click();
    await page.keyboard.down('Space');
    await page.waitForTimeout(300);

    await expect(page.getByText(/CHARGE/i)).toBeVisible();

    await page.keyboard.up('Space');
    await page.waitForTimeout(500);

    await expect(page.getByText(/JUMPS: 1/i)).toBeVisible();
  });

  test('pause & resume flow: opens modal on Escape and resumes on resume click', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Keyboard-only test');
    await page.goto('/');

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    await canvas.click();
    await page.keyboard.press('Escape');

    await expect(page.getByText(/GAME PAUSED/i)).toBeVisible();
    const resumeBtn = page.getByRole('button', { name: /RESUME/i });
    await expect(resumeBtn).toBeVisible();

    await resumeBtn.click();
    await expect(page.getByText(/GAME PAUSED/i)).toBeHidden();
  });

  test('restart flow: clicking restart button resets jump count and HUD', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Keyboard-only test');
    await page.goto('/');

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    await canvas.click();

    // Perform a jump
    await page.keyboard.down('Space');
    await page.waitForTimeout(300);
    await page.keyboard.up('Space');
    await page.waitForTimeout(500);

    await expect(page.getByText(/JUMPS: 1/i)).toBeVisible();

    // Click restart button
    const restartBtn = page.getByLabel(/Restart Run/i);
    await restartBtn.click();
    await page.waitForTimeout(300);

    await expect(page.getByText(/JUMPS: 0/i)).toBeVisible();
  });
});
