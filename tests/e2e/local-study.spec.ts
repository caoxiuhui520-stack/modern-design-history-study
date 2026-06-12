import { expect, test } from "@playwright/test";

test("answers a question and keeps progress after reload", async ({ page }) => {
  await page.goto("/#/practice");
  await expect(page.getByRole("heading", { name: "练习" })).toBeVisible();
  await page.getByLabel("题型筛选").getByRole("button", { name: "选择" }).click();
  await page.locator(".choice-list label").first().click();
  await page.getByRole("button", { name: "提交答案" }).click();
  await expect(page.getByText("回答正确")).toBeVisible();
  await page.getByRole("button", { name: "下一题" }).click();
  await page.reload();
  await page.getByRole("link", { name: "首页" }).first().click();
  await expect(page.getByText("累计完成题目").locator("..").getByText("1")).toBeVisible();
});

