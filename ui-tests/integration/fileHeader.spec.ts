import { test, expect } from '@playwright/test';

test("Creating new project returns to animator", async ({ page }) => {
  await page.goto('http://localhost:6969/');
  const loader = await page.getByTestId("fullscreen-loader");
  await expect(loader).toHaveCount(0);
  const button = page.getByTestId("frame-objects-manager__create-new");
  await expect(button).toHaveText("Create New");
  await button.click();
  await expect(page.getByText("New Object")).toBeVisible();
  await page.getByTestId("file-header__file").click();
  await page.getByTestId("file-header__new").click();
  await page.getByTestId("global-dialog__affirmative").click();
  await expect(page.getByText("Objects")).toBeVisible();
});