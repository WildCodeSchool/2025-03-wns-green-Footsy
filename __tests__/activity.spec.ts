import { expect, test } from "@playwright/test";
import { useE2ETestUser } from "./user.helpers";

test.describe("Activity", () => {
  const testUserSetup = useE2ETestUser();

  test("should add a carbon activity", async ({ page }) => {
    const testUser = testUserSetup.user;
    const activityTitle = `E2E Activity ${Date.now()}`;

    await page.goto("/login");
    await page.fill("input#email", testUser.email);
    await page.fill("input#password", testUser.password);
    await page.getByRole("button", { name: /connexion/i }).click();
    await expect(page).toHaveURL("/dashboard");

    await page.goto("/add-activity");
    await expect(
      page.getByRole("heading", { name: "Ajouter une activité" }),
    ).toBeVisible();

    const today = new Date().toISOString().slice(0, 10);
    await page.fill("#date", today);
    await page.fill("#title", activityTitle);

    const categoryOptions = page.locator("#category_id option");
    await expect.poll(async () => categoryOptions.count()).toBeGreaterThan(1);

    const firstCategoryValue = await categoryOptions
      .nth(1)
      .getAttribute("value");
    expect(firstCategoryValue).toBeTruthy();
    await page.selectOption("#category_id", firstCategoryValue as string);

    const typeOptions = page.locator("#type_id option");
    await expect.poll(async () => typeOptions.count()).toBeGreaterThan(1);

    const firstTypeValue = await typeOptions.nth(1).getAttribute("value");
    expect(firstTypeValue).toBeTruthy();
    await page.selectOption("#type_id", firstTypeValue as string);

    await page.fill("#quantity", "10");
    await page.getByRole("button", { name: "Ajouter" }).click();

    await expect(page).toHaveURL("/history");
    await expect(page.getByText(activityTitle)).toBeVisible();
  });
});
