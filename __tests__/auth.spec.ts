import { expect, test } from "@playwright/test";
import { useE2ETestUser } from "./user.helpers";

test.describe("Authentication", () => {
  const testUserSetup = useE2ETestUser();

  test("should login successfully with valid credentials", async ({ page }) => {
    const testUser = testUserSetup.user;

    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: "Connexion" }),
    ).toBeVisible();

    await page.fill("input#email", testUser.email);
    await page.fill("input#password", testUser.password);

    await page.getByRole("button", { name: /connexion/i }).click();

    await expect(page).toHaveURL("/dashboard");
  });

  test("should show error message with invalid credentials", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.fill("input#email", "wrong@email.com");
    await page.fill("input#password", "wrongpassword");

    await page.getByRole("button", { name: /connexion/i }).click();

    await expect(page.locator(".Toastify__toast--error")).toBeVisible();
  });
});
