import { test, expect } from '@playwright/test';

test('has a "Create New" button', async ({ page }) => {
  await page.goto('http://localhost:6969/');
  const loader = await page.getByTestId("fullscreen-loader");
  await expect(loader).toHaveCount(0);
  const button = page.getByTestId("frame-objects-manager__create-new");
  await expect(button).toHaveText("Create New");
});
