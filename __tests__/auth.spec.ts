import { expect, test } from "@playwright/test";

const GRAPHQL_URL = process.env.E2E_GRAPHQL_URL ?? "http://localhost:4000";

type TestUser = {
  email: string;
  password: string;
};

test.describe("Authentication", () => {
  let testUser: TestUser;

  test.beforeAll(async ({ request }) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    testUser = {
      email: `e2e-auth-${unique}@footsy.com`,
      password: "TestPassword123",
    };

    const avatarsResponse = await request.post(GRAPHQL_URL, {
      data: {
        query: `
          query GetAllAvatars {
            getAllAvatars {
              id
              title
              image
            }
          }
        `,
      },
    });

    const avatarsBody = await avatarsResponse.json();
    const avatar = avatarsBody?.data?.getAllAvatars?.[0];

    expect(
      avatar,
      "Aucun avatar disponible pour créer un utilisateur e2e",
    ).toBeTruthy();

    const signUpResponse = await request.post(GRAPHQL_URL, {
      data: {
        query: `
          mutation SignUp($data: NewUserInput!) {
            signup(data: $data)
          }
        `,
        variables: {
          data: {
            first_name: "E2E",
            last_name: "Auth",
            email: testUser.email,
            password: testUser.password,
            birthdate: "1990-01-01",
            avatar,
          },
        },
      },
    });

    const signUpBody = await signUpResponse.json();
    expect(signUpBody.errors).toBeFalsy();
    expect(signUpBody.data?.signup).toBeTruthy();
  });

  test("should login successfully with valid credentials", async ({ page }) => {
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
