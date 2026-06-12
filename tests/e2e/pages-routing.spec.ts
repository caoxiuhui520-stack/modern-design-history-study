import { expect, test } from "@playwright/test";

test("hash routes survive reload", async ({ page }) => {
  await page.goto("/#/knowledge");
  await expect(page.getByRole("heading", { name: "知识地图" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "知识地图" })).toBeVisible();
});

